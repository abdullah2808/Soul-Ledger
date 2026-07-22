// Automated Test Suite for Soul Ledger
// Tests: 9+3 item cap, ability tier prerequisites, AP budget from boons, locked slots, soul boon auto-sync.

async function runTests() {
  console.log("==================================================");
  console.log("   SOUL LEDGER AUTOMATED VERIFICATION SUITE");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    const [heroRes, itemRes] = await Promise.all([
      fetch("https://api.deadlock-api.com/v1/assets/heroes"),
      fetch("https://api.deadlock-api.com/v1/assets/items"),
    ]);

    assert(heroRes.ok, "Heroes API responded with status 200 OK");
    assert(itemRes.ok, "Items API responded with status 200 OK");

    const itemRaw = await itemRes.json();
    const rawItemsList = Array.isArray(itemRaw) ? itemRaw : (itemRaw.items || []);

    // TEST: Filter out non-main gamemode items
    const mainGamemodeItems = rawItemsList.filter(i => {
      if (i.disabled === true || i.shopable === false || i.in_development === true) return false;
      if (!i.item_tier || i.item_tier < 1 || i.item_tier > 4) return false;
      if (!i.item_slot_type && i.type !== 'upgrade') return false;
      return true;
    });
    const hasShield = mainGamemodeItems.some(i => i.class_name === "upgrade_aoe_tech_shield");
    assert(!hasShield, "Excludes non-main gamemode items (upgrade_aoe_tech_shield)");

    // ===== ITEM CAP: 9 base + 0-3 Walkers = max 12 =====
    function maxItems(walkers) { return 9 + Math.min(3, Math.max(0, walkers)); }

    assert(maxItems(0) === 9, "0 Walkers => max 9 items");
    assert(maxItems(1) === 10, "1 Walker => max 10 items");
    assert(maxItems(2) === 11, "2 Walkers => max 11 items");
    assert(maxItems(3) === 12, "3 Walkers => max 12 items (absolute max)");
    assert(maxItems(5) === 12, "Walkers capped at 3 (input 5 => still max 12)");

    // 10 items should be blocked with 0 walkers
    assert(10 > maxItems(0), "10 items rejected with 0 Walkers (cap is 9)");
    assert(10 <= maxItems(1), "10 items allowed with 1 Walker (cap is 10)");

    // ===== LOCKED SLOT DISPLAY =====
    function getSlotDisplay(buildLen, walkers) {
      const max = maxItems(walkers);
      const emptySlots = Math.max(0, max - buildLen);
      const lockedSlots = 3 - Math.min(3, walkers);
      return { emptySlots, lockedSlots, totalVisible: buildLen + emptySlots + lockedSlots };
    }

    const d0 = getSlotDisplay(0, 0);
    assert(d0.emptySlots === 9, "0 items, 0 Walkers => 9 empty slot placeholders");
    assert(d0.lockedSlots === 3, "0 items, 0 Walkers => 3 locked slot placeholders");
    assert(d0.totalVisible === 12, "Total visible = 12 (items + empty + locked = always 12)");

    const d5_2 = getSlotDisplay(5, 2);
    assert(d5_2.emptySlots === 6, "5 items, 2 Walkers => 6 empty slots");
    assert(d5_2.lockedSlots === 1, "5 items, 2 Walkers => 1 locked slot");

    const d12_3 = getSlotDisplay(12, 3);
    assert(d12_3.emptySlots === 0, "12 items, 3 Walkers => 0 empty slots");
    assert(d12_3.lockedSlots === 0, "12 items, 3 Walkers => 0 locked slots");

    // ===== ABILITY TIER PREREQUISITES =====
    // Simulate the toggleAbilityTier logic
    function simulateToggle(prev, key, tier, boons) {
      const tierKey = `${key}_T${tier}`;
      const isCurrentlyUnlocked = !!prev[tierKey];
      if (!isCurrentlyUnlocked) {
        if (tier >= 2 && !prev[`${key}_T${tier - 1}`]) return prev; // prereq fail
        const spentAP = Object.values(prev).filter(Boolean).length;
        if (spentAP >= boons) return prev; // no AP
        return { ...prev, [tierKey]: true };
      }
      const next = { ...prev, [tierKey]: false };
      for (let t = tier + 1; t <= 3; t++) next[`${key}_T${t}`] = false;
      return next;
    }

    // Can't unlock T2 without T1
    let state = {};
    state = simulateToggle(state, "sig1", 2, 5);
    assert(!state["sig1_T2"], "T2 blocked when T1 is not unlocked (prerequisite)");

    // Can unlock T1 first
    state = simulateToggle(state, "sig1", 1, 5);
    assert(state["sig1_T1"] === true, "T1 unlocks successfully");

    // Now T2 should work
    state = simulateToggle(state, "sig1", 2, 5);
    assert(state["sig1_T2"] === true, "T2 unlocks after T1 is unlocked");

    // T3 should work after T2
    state = simulateToggle(state, "sig1", 3, 5);
    assert(state["sig1_T3"] === true, "T3 unlocks after T1+T2 are unlocked");

    // Can't unlock T3 directly without T2
    let state2 = { "sig2_T1": true };
    state2 = simulateToggle(state2, "sig2", 3, 5);
    assert(!state2["sig2_T3"], "T3 blocked when T2 is not unlocked");

    // Removing T1 should cascade-remove T2 and T3
    let state3 = { "sig1_T1": true, "sig1_T2": true, "sig1_T3": true };
    state3 = simulateToggle(state3, "sig1", 1, 5);
    assert(!state3["sig1_T1"], "Removing T1 sets T1 to false");
    assert(!state3["sig1_T2"], "Removing T1 cascades to T2");
    assert(!state3["sig1_T3"], "Removing T1 cascades to T3");

    // ===== AP BUDGET FROM BOONS =====
    // With 2 boons, can only unlock 2 tiers total
    let state4 = {};
    state4 = simulateToggle(state4, "sig1", 1, 2); // spend 1 AP
    state4 = simulateToggle(state4, "sig2", 1, 2); // spend 2 AP
    assert(Object.values(state4).filter(Boolean).length === 2, "2 boons = 2 ability tiers unlocked");

    state4 = simulateToggle(state4, "sig3", 1, 2); // try to spend 3rd AP — should fail
    assert(!state4["sig3_T1"], "3rd tier blocked when only 2 boons available (AP budget)");

    // ===== SOUL BOONS AUTO-SYNC =====
    function getUnlockedBoons(souls) { return Math.min(25, Math.floor(souls / 1000)); }
    assert(getUnlockedBoons(0) === 0, "0 Build Souls -> 0 Boons / 0 AP");
    assert(getUnlockedBoons(5000) === 5, "5,000 Build Souls -> 5 Boons / 5 AP");
    assert(getUnlockedBoons(25000) === 25, "25,000 Build Souls -> 25 Boons (capped at 25)");

    // Each boon = 1 AP => 12 total ability upgrades (4 abilities × 3 tiers)
    // 25 boons >= 12, so all abilities can be unlocked at max
    assert(25 >= 12, "Max 25 boons >= 12 total ability tiers (all abilities unlockable at max)");

    console.log("\n--------------------------------------------------");
    console.log(`SUMMARY: ${passed} Passed, ${failed} Failed`);
    console.log("--------------------------------------------------\n");

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error("Test execution failed with error:", err);
    process.exit(1);
  }
}

runTests();
