import { useState, useEffect, useMemo } from "react";

const CSS_STYLES = `
@font-face { font-family:'Rajdhani'; src: local('Rajdhani'); }
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');

:root{
  --bg: #0a0b0d;
  --bg-panel: #131519;
  --bg-panel-2: #1a1d22;
  --line: #262a31;
  --text: #e9ebee;
  --text-dim: #8b929e;
  --text-faint: #565c66;
  --weapon: #d97b3f;
  --weapon-dim: #6b4527;
  --vitality: #5cb56a;
  --vitality-dim: #2f5a37;
  --spirit: #9b7fe0;
  --spirit-dim: #4c3f78;
  --souls: #e8c96b;
  --danger: #d9524a;
  --radius: 3px;
}

*{box-sizing:border-box;}
html,body{margin:0;padding:0;}
body{
  background:
    radial-gradient(ellipse 1200px 600px at 50% -10%, #1a1220 0%, transparent 60%),
    var(--bg);
  color:var(--text);
  font-family:'Inter',sans-serif;
  min-height:100vh;
}

::selection{ background:var(--spirit); color:#000; }
::-webkit-scrollbar{ width:8px; height:8px; }
::-webkit-scrollbar-track{ background:var(--bg-panel); }
::-webkit-scrollbar-thumb{ background:var(--line); border-radius:4px; }
::-webkit-scrollbar-thumb:hover{ background:var(--text-faint); }

.app{ max-width:1400px; margin:0 auto; padding:20px 20px 60px; }

/* ===== Header ===== */
header.top{
  display:flex; align-items:baseline; justify-content:space-between;
  padding:14px 4px 20px; border-bottom:1px solid var(--line); margin-bottom:20px;
  flex-wrap:wrap; gap:10px;
}
.brand{ display:flex; align-items:baseline; gap:12px; }
.brand .mark{
  font-family:'Rajdhani',sans-serif; font-weight:700; font-size:22px; letter-spacing:0.14em;
  color:var(--text);
}
.brand .mark span{ color:var(--souls); }
.brand .sub{ font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--text-faint); letter-spacing:0.04em; }
.build-tag{ font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:var(--text-faint); text-align:right; line-height:1.6; }
.build-tag a{ color:var(--text-dim); }

/* ===== Hero rail ===== */
.hero-rail{ margin-bottom:22px; }
.hero-rail-label{
  font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:var(--text-faint);
  letter-spacing:0.12em; text-transform:uppercase; margin:0 0 8px 2px;
}
.hero-search{
  width:100%; background:var(--bg-panel); border:1px solid var(--line); color:var(--text);
  font-family:'Inter',sans-serif; font-size:13px; padding:9px 12px; border-radius:var(--radius);
  margin-bottom:10px; outline:none;
}
.hero-search:focus{ border-color:var(--spirit); }
.hero-grid{
  display:grid; grid-template-columns:repeat(auto-fill,minmax(108px,1fr)); gap:6px;
  max-height:168px; overflow-y:auto; padding-right:4px;
}
.hero-chip{
  background:var(--bg-panel); border:1px solid var(--line); border-radius:var(--radius);
  padding:9px 8px; cursor:pointer; text-align:left; transition:border-color .12s, background .12s;
  font-family:'Rajdhani',sans-serif;
}
.hero-chip:hover{ border-color:var(--text-faint); background:var(--bg-panel-2); }
.hero-chip.active{ border-color:var(--souls); background:#1e1a10; }
.hero-chip .n{ font-weight:600; font-size:13.5px; color:var(--text); display:block; line-height:1.2; }
.hero-chip .r{ font-size:10px; color:var(--text-faint); display:block; margin-top:2px; font-family:'IBM Plex Mono',monospace; }
.hero-chip.approx .n::after{ content:' *'; color:var(--text-faint); }

/* ===== Layout ===== */
.layout{ display:grid; grid-template-columns:340px 1fr; gap:20px; align-items:start; }
@media (max-width:980px){ .layout{ grid-template-columns:1fr; } }

.panel{
  background:var(--bg-panel); border:1px solid var(--line); border-radius:var(--radius); padding:16px;
}
.panel-title{
  font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:var(--text-faint);
  letter-spacing:0.12em; text-transform:uppercase; margin:0 0 12px 0; display:flex; justify-content:space-between; align-items:center;
}

/* ===== Stat panel ===== */
.stat-row{
  display:grid; grid-template-columns:1fr auto auto; gap:10px; align-items:center;
  padding:7px 0; border-bottom:1px solid #1c1f24; font-family:'IBM Plex Mono',monospace; font-size:12.5px;
}
.stat-row:last-child{ border-bottom:none; }
.stat-row .label{ color:var(--text-dim); font-family:'Inter',sans-serif; font-size:12.5px; }
.stat-row .base{ color:var(--text-faint); text-align:right; min-width:52px; }
.stat-row .total{ text-align:right; min-width:70px; font-weight:600; color:var(--text); }
.stat-row .delta{ font-size:10.5px; }
.delta.pos{ color:var(--vitality); }
.delta.neg{ color:var(--danger); }
.delta.zero{ color:var(--text-faint); }

.souls-spent{
  margin-top:14px; padding-top:12px; border-top:1px solid var(--line);
  display:flex; justify-content:space-between; align-items:baseline;
  font-family:'IBM Plex Mono',monospace;
}
.souls-spent .amt{ font-size:20px; font-weight:600; color:var(--souls); }
.souls-spent .lbl{ font-size:10.5px; color:var(--text-faint); letter-spacing:0.08em; text-transform:uppercase; }

.build-list{ margin-top:14px; display:flex; flex-direction:column; gap:5px; max-height:220px; overflow-y:auto; }
.build-empty{ color:var(--text-faint); font-size:12px; font-style:italic; padding:10px 0; }
.build-item{
  display:flex; align-items:center; gap:8px; padding:6px 8px; background:var(--bg-panel-2);
  border-radius:var(--radius); border-left:2px solid var(--line); font-size:12px;
}
.build-item .dot{ width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.build-item .nm{ flex:1; color:var(--text); }
.build-item .cost{ color:var(--text-faint); font-family:'IBM Plex Mono',monospace; font-size:11px; }
.build-item .rm{ cursor:pointer; color:var(--text-faint); background:none; border:none; font-size:15px; line-height:1; padding:0 2px; }
.build-item .rm:hover{ color:var(--danger); }

/* ===== Shop ===== */
.shop-controls{ display:flex; gap:8px; margin-bottom:14px; flex-wrap:wrap; }
.cat-btn{
  font-family:'Rajdhani',sans-serif; font-weight:600; font-size:13px; letter-spacing:0.04em;
  padding:7px 14px; border-radius:var(--radius); border:1px solid var(--line); background:var(--bg-panel-2);
  color:var(--text-dim); cursor:pointer; transition:.12s;
}
.cat-btn:hover{ color:var(--text); }
.cat-btn.on[data-cat="weapon"]{ border-color:var(--weapon); color:var(--weapon); background:#241a10; }
.cat-btn.on[data-cat="vitality"]{ border-color:var(--vitality); color:var(--vitality); background:#0f2214; }
.cat-btn.on[data-cat="spirit"]{ border-color:var(--spirit); color:var(--spirit); background:#1c1730; }
.cat-btn.on[data-cat="all"]{ border-color:var(--text-dim); color:var(--text); }
.item-search{
  flex:1; min-width:160px; background:var(--bg-panel-2); border:1px solid var(--line); color:var(--text);
  font-family:'Inter',sans-serif; font-size:13px; padding:7px 12px; border-radius:var(--radius); outline:none;
}
.item-search:focus{ border-color:var(--spirit); }
.tier-tabs{ display:flex; gap:4px; margin-left:auto; }
.tier-btn{
  font-family:'IBM Plex Mono',monospace; font-size:11px; padding:6px 9px; border-radius:var(--radius);
  border:1px solid var(--line); background:var(--bg-panel-2); color:var(--text-faint); cursor:pointer;
}
.tier-btn.on{ color:var(--text); border-color:var(--text-dim); }

.tier-group{ margin-bottom:18px; }
.tier-group h4{
  font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:var(--text-faint);
  letter-spacing:0.1em; text-transform:uppercase; margin:0 0 8px 2px; display:flex; align-items:center; gap:8px;
}
.tier-group h4::after{ content:''; flex:1; height:1px; background:var(--line); }

.item-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(238px,1fr)); gap:8px; }
.item-card{
  background:var(--bg-panel-2); border:1px solid var(--line); border-radius:var(--radius);
  padding:10px 11px; cursor:pointer; transition:border-color .12s, transform .06s;
  border-left-width:3px;
}
.item-card:hover{ border-color:var(--text-faint); }
.item-card:active{ transform:scale(0.99); }
.item-card.added{ background:#171a1e; }
.item-card[data-cat="weapon"]{ border-left-color:var(--weapon-dim); }
.item-card[data-cat="vitality"]{ border-left-color:var(--vitality-dim); }
.item-card[data-cat="spirit"]{ border-left-color:var(--spirit-dim); }
.item-card.added[data-cat="weapon"]{ border-left-color:var(--weapon); }
.item-card.added[data-cat="vitality"]{ border-left-color:var(--vitality); }
.item-card.added[data-cat="spirit"]{ border-left-color:var(--spirit); }

.item-head{ display:flex; justify-content:space-between; align-items:flex-start; gap:6px; margin-bottom:4px; }
.item-name{ font-family:'Rajdhani',sans-serif; font-weight:600; font-size:14.5px; line-height:1.2; }
.item-cost{ font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--souls); white-space:nowrap; }
.item-effect{ font-size:11.5px; color:var(--text-dim); line-height:1.4; margin-bottom:6px; }
.item-tags{ display:flex; flex-wrap:wrap; gap:4px; }
.tag{
  font-family:'IBM Plex Mono',monospace; font-size:9.5px; padding:2px 6px; border-radius:2px;
  background:#00000055; color:var(--text-faint); border:1px solid #ffffff10;
}
.tag.active-tag{ color:var(--souls); border-color:#5c4c1f; }
.tag.cond-tag{ color:#e0925c; border-color:#5c3d1f; }

/* ===== Conditional effects panel ===== */
.cond-panel{ margin-top:20px; }
.cond-list{ display:flex; flex-direction:column; gap:8px; }
.cond-row{
  display:grid; grid-template-columns:170px 1fr; gap:12px; padding:10px 12px;
  background:var(--bg-panel-2); border-radius:var(--radius); border-left:3px solid var(--souls);
  font-size:12.5px;
}
.cond-row .item-lbl{ font-family:'Rajdhani',sans-serif; font-weight:600; color:var(--text); }
.cond-row .item-lbl small{ display:block; font-family:'IBM Plex Mono',monospace; font-weight:400; font-size:10px; color:var(--souls); margin-top:2px; }
.cond-row .desc{ color:var(--text-dim); line-height:1.5; }
.cond-empty{ color:var(--text-faint); font-size:12.5px; font-style:italic; }

/* ===== Investment bars ===== */
.invest-panel{ margin-bottom:20px; }
.invest-row{ margin-bottom:14px; }
.invest-row:last-child{ margin-bottom:0; }
.invest-head{ display:flex; justify-content:space-between; align-items:baseline; margin-bottom:5px; }
.invest-name{ font-family:'Rajdhani',sans-serif; font-weight:600; font-size:13px; letter-spacing:0.03em; }
.invest-name.weapon{ color:var(--weapon); }
.invest-name.vitality{ color:var(--vitality); }
.invest-name.spirit{ color:var(--spirit); }
.invest-figures{ font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--text-dim); }
.invest-figures b{ color:var(--text); font-weight:600; }
.invest-track{
  position:relative; height:16px; background:#000000aa; border:1px solid var(--line); border-radius:2px; overflow:hidden;
}
.invest-fill{ position:absolute; top:0; left:0; bottom:0; width:0%; transition:width .25s ease; }
.invest-fill.weapon{ background:linear-gradient(90deg,var(--weapon-dim),var(--weapon)); }
.invest-fill.vitality{ background:linear-gradient(90deg,var(--vitality-dim),var(--vitality)); }
.invest-fill.spirit{ background:linear-gradient(90deg,var(--spirit-dim),var(--spirit)); }
.invest-ticks{ position:absolute; inset:0; }
.invest-tick{
  position:absolute; top:0; bottom:0; width:1px; background:#00000060;
}
.invest-tick.hit{ background:#ffffff40; }
.invest-tick.cap{ background:var(--souls); width:2px; }
.invest-labels{ display:flex; justify-content:space-between; margin-top:3px; }
.invest-labels span{ font-family:'IBM Plex Mono',monospace; font-size:9px; color:var(--text-faint); }
.invest-bonus-txt{ font-size:11px; color:var(--text-faint); margin-top:4px; font-family:'IBM Plex Mono',monospace; }
.invest-bonus-txt b{ color:var(--souls); font-weight:600; }

/* ===== Item stat chips ===== */
.item-stats{ display:flex; flex-wrap:wrap; gap:4px; margin-bottom:6px; }
.stat-chip{
  font-family:'IBM Plex Mono',monospace; font-size:10px; font-weight:600; padding:2px 6px; border-radius:2px;
}
.stat-chip.pos{ background:#123a1e; color:var(--vitality); }
.stat-chip.neg{ background:#3a1414; color:var(--danger); }

footer.note{
  margin-top:26px; padding-top:14px; border-top:1px solid var(--line);
  font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:var(--text-faint); line-height:1.7;
}
footer.note a{ color:var(--text-dim); }

/* ===== Live data status badge ===== */
.data-badge{ font-weight:600; letter-spacing:0.02em; }
.data-badge.live{ color:var(--vitality); }
.data-badge.fallback{ color:#e0925c; }
.data-badge.loading{ color:var(--text-faint); }

.invest-tick.major{ background:var(--souls); width:2px; }
`;

const FALLBACK_HEROES = [
 {n:"Abrams",role:"Tank · Brawler",h:800,r:1.5,d:3.6,m:6.4,s:3},
 {n:"Apollo",role:"Finesse · Mobility",h:770,r:1,d:18.5,m:7.2,s:3},
 {n:"Bebop",role:"Hook · Bomb",h:880,r:2.5,d:5.0,m:6.45,s:3},
 {n:"Billy",role:"Punk · Chaotic",h:820,r:2.5,d:6.3,m:7.0,s:3},
 {n:"Calico",role:"Tricksy · Slippery",h:730,r:2,d:1.8,m:6.8,s:3},
 {n:"Celeste",role:"Performer · Disruptive",h:690,r:1,d:18.0,m:6.2,s:4},
 {n:"Drifter",role:"Stalker · Bloodthirsty",h:755,r:3.5,d:19.5,m:6.9,s:3},
 {n:"Dynamo",role:"Teamplay · Initiator",h:880,r:1.75,d:12.6,m:6.7,s:3},
 {n:"Graves",role:"Morbid · Area Denial",h:730,r:1,d:3.6,m:7.0,s:2},
 {n:"Grey Talon",role:"Precision · Hunter",h:780,r:1.5,d:23.5,m:6.3,s:4},
 {n:"Haze",role:"Assassin · Stealthy",h:730,r:2,d:5.3,m:8.2,s:3},
 {n:"Holliday",role:"Crackshot · Explosive",h:780,r:2,d:19.7,m:8.2,s:2},
 {n:"Infernus",role:"Arsonist · Explosive",h:830,r:2,d:5.5,m:6.7,s:3},
 {n:"Ivy",role:"Team-up · Disruptor",h:755,r:2,d:4.5,m:7.2,s:4},
 {n:"Kelvin",role:"Protector · Explorer",h:880,r:1,d:18.6,m:6.7,s:3},
 {n:"Lady Geist",role:"Lifesteal · Self Damage",h:880,r:1,d:20.7,m:6.3,s:3},
 {n:"Lash",role:"Initiator · High Flying",h:780,r:2,d:8.5,m:7.2,s:3},
 {n:"McGinnis",role:"Inventor · Support",h:780,r:2,d:6.4,m:6.7,s:2},
 {n:"Mina",role:"Harasser · Nimble",h:660,r:2,d:7.3,m:6.5,s:2},
 {n:"Mirage",role:"Bodyguard · Traveller",h:730,r:1.5,d:14.8,m:7.0,s:3},
 {n:"Mo & Krill",role:"Tag-Team · Initiator",h:930,r:1,d:2.8,m:8.0,s:3},
 {n:"Paige",role:"Helpful · Protector",h:680,r:2,d:35.0,m:6.9,s:3},
 {n:"Paradox",role:"Calculated · Disruptor",h:730,r:1,d:6.8,m:6.7,s:3},
 {n:"Pocket",role:"Trickster · Burst Damage",h:780,r:1,d:4.3,m:7.2,s:3},
 {n:"Rem",role:"Helpful · Tiny",h:680,r:2,d:16.0,m:7.2,s:3},
 {n:"Seven",role:"High Voltage · Merciless",h:730,r:1,d:10.8,m:6.7,s:3},
 {n:"Shiv",role:"Rage · Bleed",h:830,r:2,d:4.8,m:6.5,s:3},
 {n:"Silver",role:"Feral · Hot Mess",h:830,r:2.5,d:5.1,m:6.7,s:2},
 {n:"Sinclair",role:"Trickster · Copycat",h:790,r:1.5,d:17.8,m:6.9,s:3},
 {n:"The Doorman",role:"Disorienting · Map Control",h:755,r:1,d:26.0,m:7.9,s:3},
 {n:"Venator",role:"Devout · Arms Expert",h:760,r:1.5,d:16.0,m:6.8,s:3,approx:true},
 {n:"Victor",role:"You · Can't",h:800,r:1.5,d:14.0,m:6.5,s:3,approx:true},
 {n:"Vindicta",role:"Sniper · Soaring",h:660,r:1,d:22.0,m:6.5,s:3,approx:true},
 {n:"Viscous",role:"Evasive · Disruptor",h:800,r:2,d:9.0,m:6.6,s:3,approx:true},
 {n:"Vyper",role:"Gunner · Slippery",h:700,r:1.5,d:8.0,m:7.0,s:3,approx:true},
 {n:"Warden",role:"Initiator · Fearless",h:850,r:1.5,d:17.0,m:6.5,s:3,approx:true},
 {n:"Wraith",role:"Duelist · Isolator",h:680,r:1,d:13.0,m:7.0,s:3,approx:true},
 {n:"Yamato",role:"Relentless · Acrobatics",h:800,r:1.5,d:11.0,m:6.8,s:3,approx:true},
];

const TIER_COST = {1:800,2:1600,3:3200,4:6400};

const FALLBACK_ITEMS = [
/* ---------- WEAPON T1 ---------- */
{n:"Close Quarters",cat:"weapon",tier:1,effect:"+Bullet damage falloff at close range, −damage at long range.",mods:{dmg:6},tags:["short range"]},
{n:"Extended Magazine",cat:"weapon",tier:1,effect:"+Clip size.",mods:{clip:20},tags:["clip"]},
{n:"Headshot Booster",cat:"weapon",tier:1,effect:"+Headshot bonus damage.",mods:{},tags:["headshot"],cond:"Triggers only on landing a headshot."},
{n:"High-Velocity Rounds",cat:"weapon",tier:1,effect:"+Bullet velocity and falloff start/end range.",mods:{},tags:["range","velocity"]},
{n:"Monster Rounds",cat:"weapon",tier:1,effect:"+Bonus damage to non-player units (troopers, guardians, neutrals).",mods:{},tags:["vs. NPCs"],cond:"Bonus damage only applies to non-hero targets."},
{n:"Rapid Rounds",cat:"weapon",tier:1,effect:"+Fire rate, small −bullet damage per shot.",mods:{fireRate:8,dmg:-2},tags:["fire rate"]},
{n:"Restorative Shot",cat:"weapon",tier:1,effect:"Reloading while below max health restores bonus health.",mods:{},tags:["sustain"],cond:"Only heals if you reload while missing health."},

/* ---------- WEAPON T2 ---------- */
{n:"Active Reload",cat:"weapon",tier:2,effect:"Hit the reload timing bar for an instant reload plus a burst of fire rate, lifesteal and move speed.",mods:{clip:10},tags:["skill check","active-proc"],cond:"Bonus only triggers on a successful timed reload."},
{n:"Fleetfoot",cat:"weapon",tier:2,effect:"Active: burst of movement speed.",mods:{},tags:["Z/X/C/V"],active:true,cond:"Only active while the ability is toggled on, then goes on cooldown."},
{n:"Intensifying Magazine",cat:"weapon",tier:2,effect:"+Clip size and bullet damage that ramps up the longer you hold fire.",mods:{clip:14},tags:["clip","ramping"],cond:"Damage bonus ramps only during a sustained clip and resets on reload."},
{n:"Kinetic Dash",cat:"weapon",tier:2,effect:"Dash gains a burst of bonus fire rate for a few seconds after use.",mods:{},tags:["on dash"],cond:"Fire rate burst triggers only right after dashing."},
{n:"Long Range",cat:"weapon",tier:2,effect:"+Falloff start/end range, so damage stays high at distance.",mods:{},tags:["range"]},
{n:"Melee Charge",cat:"weapon",tier:2,effect:"Landing bullets charges a bonus melee attack.",mods:{},tags:["on bullets"],cond:"Bonus melee damage only available once the charge fills from landed shots."},
{n:"Mystic Shot",cat:"weapon",tier:2,effect:"Bullets deal bonus Spirit damage.",mods:{dmg:5,spirit:6},tags:["hybrid"]},
{n:"Opening Rounds",cat:"weapon",tier:2,effect:"Bonus damage on the first shots after reloading.",mods:{},tags:["on reload"],cond:"Bonus only applies to the first bullets fired after a fresh reload."},
{n:"Recharging Rush",cat:"weapon",tier:2,effect:"Sprinting builds bonus ammo regeneration.",mods:{},tags:["on sprint"],cond:"Ammo regen only accrues while sprinting."},
{n:"Slowing Bullets",cat:"weapon",tier:2,effect:"Bullets apply a stacking slow to enemies hit.",mods:{},tags:["on-hit CC"],cond:"Slow only applies to bullets that connect with a hero."},
{n:"Spirit Shredder Bullets",cat:"weapon",tier:2,effect:"Bullets reduce enemy Spirit resist for a short time.",mods:{},tags:["on-hit debuff"],cond:"Resist shred only applies while the debuff is active on a hit target."},
{n:"Split Shot",cat:"weapon",tier:2,effect:"Chance to fire an extra bullet with each shot.",mods:{dmg:3},tags:["proc"],cond:"Extra bullet triggers on a per-shot chance, not guaranteed."},
{n:"Stalker",cat:"weapon",tier:2,effect:"+Damage against enemies from behind or unaware.",mods:{},tags:["flank"],cond:"Bonus only applies to unaware or backstabbed targets."},
{n:"Swift Striker",cat:"weapon",tier:2,effect:"+Fire rate that increases the longer you keep firing.",mods:{fireRate:6},tags:["ramping"],cond:"Ramp resets after a pause in firing or on reload."},
{n:"Titanic Magazine",cat:"weapon",tier:2,effect:"Large +clip size, small −fire rate.",mods:{clip:40,fireRate:-4},tags:["clip"]},
{n:"Weakening Headshot",cat:"weapon",tier:2,effect:"Headshots apply a damage-taken debuff to the target.",mods:{},tags:["headshot","debuff"],cond:"Debuff only applies on a landed headshot."},

/* ---------- WEAPON T3 ---------- */
{n:"Alchemical Fire",cat:"weapon",tier:3,effect:"Active: throw a fire zone that burns and slows enemies inside.",mods:{},tags:["Z/X/C/V","zone"],active:true,cond:"Burn/slow only applies to targets standing in the thrown fire zone."},
{n:"Ballistic Enchantment",cat:"weapon",tier:3,effect:"Bullets deal a portion of their damage as bonus Spirit damage.",mods:{dmg:4,spirit:10},tags:["hybrid"]},
{n:"Berserker",cat:"weapon",tier:3,effect:"+Fire rate and move speed that scale up as you take damage in a fight.",mods:{fireRate:6},tags:["low HP","ramping"],cond:"Bonus scales with recent damage taken — strongest when you're already hurt."},
{n:"Blood Tribute",cat:"weapon",tier:3,effect:"Spend health on cast to empower your next ability with bonus Spirit power.",mods:{},tags:["on ability cast"],cond:"Only triggers when you cast an ability after activating it."},
{n:"Burst Fire",cat:"weapon",tier:3,effect:"+Damage on the first bullets of a fresh clip.",mods:{},tags:["on reload"],cond:"Bonus only applies to the opening bullets after reloading."},
{n:"Cultist Sacrifice",cat:"weapon",tier:3,effect:"Killing a unit heals you and grants temporary bonus Spirit power.",mods:{},tags:["on kill"],cond:"Heal and Spirit bonus trigger only on securing a kill."},
{n:"Escalating Resilience",cat:"weapon",tier:3,effect:"+Bullet resist that increases the longer you're in combat.",mods:{bulletArmor:6},tags:["ramping"],cond:"Resist bonus ramps up only while actively in a fight."},
{n:"Express Shot",cat:"weapon",tier:3,effect:"First bullet fired after aiming down sights deals bonus damage.",mods:{},tags:["ADS"],cond:"Bonus only on the first shot after entering aim mode."},
{n:"Headhunter",cat:"weapon",tier:3,effect:"Damaging low-health enemies grants bonus bullet damage against them.",mods:{},tags:["execute"],cond:"Bonus only applies once the target is below the health threshold."},
{n:"Heroic Aura",cat:"weapon",tier:3,effect:"Grants nearby allies a small bullet damage aura.",mods:{dmg:4},tags:["aura","team"],cond:"Aura bonus only affects allies within range of you."},
{n:"Hollow Point",cat:"weapon",tier:3,effect:"+Damage to enemies at low health.",mods:{},tags:["execute"],cond:"Bonus only applies against targets under the health threshold."},
{n:"Hunter's Aura",cat:"weapon",tier:3,effect:"Reveals and slows enemies who damage you at range.",mods:{},tags:["reveal"],cond:"Triggers only when an enemy hits you from outside melee range."},
{n:"Point Blank",cat:"weapon",tier:3,effect:"Large +damage at very close range, reduced falloff up close.",mods:{dmg:8},tags:["short range"]},
{n:"Shadow Weave",cat:"weapon",tier:3,effect:"Missing shots briefly grants bonus evasion.",mods:{},tags:["on miss"],cond:"Evasion window only opens after a bullet misses its target."},
{n:"Sharpshooter",cat:"weapon",tier:3,effect:"+Falloff range and bonus damage the farther the target.",mods:{},tags:["long range"],cond:"Bonus scales up only at longer engagement distances."},
{n:"Spirit Rend",cat:"weapon",tier:3,effect:"Headshots deal bonus Spirit damage and shred Spirit resist.",mods:{spirit:8},tags:["headshot","hybrid"],cond:"Bonus only triggers on landed headshots."},
{n:"Tesla Bullets",cat:"weapon",tier:3,effect:"Bullets chain lightning to nearby enemies.",mods:{},tags:["on-hit AoE"],cond:"Chain only triggers when a bullet connects with a target that has enemies nearby."},
{n:"Toxic Bullets",cat:"weapon",tier:3,effect:"Bullets apply a stacking poison that deals damage over time.",mods:{},tags:["on-hit DoT"],cond:"Poison stacks only apply while bullets keep landing on the target."},
{n:"Weighted Shots",cat:"weapon",tier:3,effect:"+Bullet damage, −bullet velocity.",mods:{dmg:7},tags:["heavy"]},

/* ---------- WEAPON T4 ---------- */
{n:"Armor Piercing Rounds",cat:"weapon",tier:4,effect:"Bullets ignore a portion of enemy bullet resist.",mods:{},tags:["shred"],cond:"Shred only applies against targets with bullet resist active."},
{n:"Capacitor",cat:"weapon",tier:4,effect:"Active: a charged burst attack dealing heavy bonus damage.",mods:{},tags:["Z/X/C/V"],active:true,cond:"Bonus damage only on activation; otherwise idle on cooldown."},
{n:"Crippling Headshot",cat:"weapon",tier:4,effect:"Headshots slow and weaken the target for several seconds.",mods:{},tags:["headshot","debuff"],cond:"Only triggers on a landed headshot."},
{n:"Crushing Fists",cat:"weapon",tier:4,effect:"Large +melee damage and stun chance on heavy melee.",mods:{},tags:["melee"],cond:"Stun only applies on a heavy (charged) melee hit."},
{n:"Frenzy",cat:"weapon",tier:4,effect:"+Fire rate and lifesteal while below half health.",mods:{fireRate:10},tags:["low HP"],cond:"Bonus only active while your health is below 50%."},
{n:"Glass Cannon",cat:"weapon",tier:4,effect:"Large +bullet and Spirit damage, −max health.",mods:{dmg:14,spirit:22,hp:-150},tags:["all-in"]},
{n:"Lucky Shot",cat:"weapon",tier:4,effect:"Chance for a bullet to deal a guaranteed critical hit.",mods:{},tags:["proc crit"],cond:"Crit triggers on a per-shot chance, not every shot."},
{n:"Ricochet",cat:"weapon",tier:4,effect:"Bullets have a chance to bounce to a second nearby enemy.",mods:{},tags:["proc AoE"],cond:"Bounce only triggers if another enemy is within range of the hit target."},
{n:"Silencer",cat:"weapon",tier:4,effect:"Headshots briefly silence the target, preventing ability use.",mods:{},tags:["headshot","CC"],cond:"Silence only applies on a landed headshot."},
{n:"Spellslinger",cat:"weapon",tier:4,effect:"Landing consecutive headshots empowers your next ability cast.",mods:{},tags:["headshot combo"],cond:"Bonus only builds from consecutive headshots and is consumed on next cast."},
{n:"Spiritual Overflow",cat:"weapon",tier:4,effect:"Excess Spirit power beyond a threshold converts into bonus bullet damage.",mods:{dmg:6},tags:["scaling"],cond:"Only grants bonus once Spirit power exceeds the threshold."},

/* ---------- VITALITY T1 ---------- */
{n:"Extra Health",cat:"vitality",tier:1,effect:"+Max health.",mods:{hp:175},tags:["health"]},
{n:"Extra Regen",cat:"vitality",tier:1,effect:"+Health regeneration per second.",mods:{regen:3},tags:["regen"]},
{n:"Extra Stamina",cat:"vitality",tier:1,effect:"+1 stamina charge for sprint, jump and dash.",mods:{stamina:1},tags:["mobility"]},
{n:"Grit",cat:"vitality",tier:1,effect:"+Bullet resist while standing still or walking.",mods:{},tags:["conditional armor"],cond:"Resist bonus only applies while not sprinting."},
{n:"Healing Rite",cat:"vitality",tier:1,effect:"Active: heal yourself over a few seconds.",mods:{},tags:["Z/X/C/V","heal"],active:true,cond:"Heal only occurs while the channel is active, then the item goes on cooldown."},
{n:"Melee Lifesteal",cat:"vitality",tier:1,effect:"Melee hits heal you for a portion of damage dealt.",mods:{},tags:["on melee"],cond:"Healing only triggers on landed melee attacks."},
{n:"Rebuttal",cat:"vitality",tier:1,effect:"Taking melee damage grants a brief counter-attack bonus.",mods:{},tags:["on hit taken"],cond:"Bonus only triggers right after being hit in melee."},
{n:"Sprint Boots",cat:"vitality",tier:1,effect:"+Sprint speed.",mods:{sprint:1},tags:["mobility"]},

/* ---------- VITALITY T2 ---------- */
{n:"Battle Vest",cat:"vitality",tier:2,effect:"+Health and a shield that regenerates out of combat.",mods:{hp:100},tags:["shield"],cond:"Shield only regenerates after a few seconds without taking damage."},
{n:"Bullet Armor",cat:"vitality",tier:2,effect:"+Bullet resist.",mods:{bulletArmor:20},tags:["armor"]},
{n:"Bullet Lifesteal",cat:"vitality",tier:2,effect:"Bullet damage heals you for a portion dealt.",mods:{},tags:["on bullet hit"],cond:"Healing only triggers on bullets that connect with an enemy."},
{n:"Debuff Reducer",cat:"vitality",tier:2,effect:"−Duration of slows, stuns and other debuffs against you.",mods:{},tags:["CC resist"]},
{n:"Enchanter's Emblem",cat:"vitality",tier:2,effect:"Healing an ally grants both of you a temporary Spirit power bonus.",mods:{},tags:["on heal ally"],cond:"Bonus only triggers when your healing effects target another hero."},
{n:"Enduring Speed",cat:"vitality",tier:2,effect:"+Sprint speed and stamina regeneration.",mods:{sprint:1},tags:["mobility"]},
{n:"Guardian Ward",cat:"vitality",tier:2,effect:"Active: place a ward that reveals and slightly slows nearby enemies.",mods:{},tags:["Z/X/C/V","vision"],active:true,cond:"Only affects enemies who enter the ward's radius."},
{n:"Healbane",cat:"vitality",tier:2,effect:"Your damage reduces incoming healing on the target.",mods:{},tags:["anti-heal"],cond:"Debuff only applies to enemies you've recently damaged."},
{n:"Healing Booster",cat:"vitality",tier:2,effect:"+Effectiveness of all healing you receive.",mods:{},tags:["sustain"]},
{n:"Reactive Barrier",cat:"vitality",tier:2,effect:"Dropping below a health threshold grants a temporary shield.",mods:{},tags:["proc shield"],cond:"Shield only triggers once per cooldown, when health drops below the threshold."},
{n:"Restorative Locket",cat:"vitality",tier:2,effect:"Active: heal yourself and nearby allies.",mods:{},tags:["Z/X/C/V","team heal"],active:true,cond:"Heal only applies to allies within range when activated."},
{n:"Return Fire",cat:"vitality",tier:2,effect:"Getting hit by bullets briefly returns bonus damage to the shooter.",mods:{},tags:["on hit taken"],cond:"Reflect only triggers while the shield charge is available."},
{n:"Spirit Armor",cat:"vitality",tier:2,effect:"+Spirit resist.",mods:{spiritArmor:20},tags:["armor"]},
{n:"Spirit Lifesteal",cat:"vitality",tier:2,effect:"Spirit/ability damage heals you for a portion dealt.",mods:{},tags:["on ability hit"],cond:"Healing only triggers on ability damage landing on an enemy."},
{n:"Spirit Shielding",cat:"vitality",tier:2,effect:"+Spirit resist that increases the lower your health is.",mods:{spiritArmor:8},tags:["low HP"],cond:"Extra resist scales up only as your health drops."},
{n:"Trophy Collector",cat:"vitality",tier:2,effect:"Securing kills grants a stacking, temporary bonus to a core stat.",mods:{},tags:["on kill"],cond:"Stacks only accrue from recent kills and decay over time."},
{n:"Weapon Shielding",cat:"vitality",tier:2,effect:"+Bullet resist that increases the lower your health is.",mods:{bulletArmor:8},tags:["low HP"],cond:"Extra resist scales up only as your health drops."},

/* ---------- VITALITY T3 ---------- */
{n:"Bullet Resilience",cat:"vitality",tier:3,effect:"Large +bullet resist and health.",mods:{bulletArmor:22,hp:75},tags:["armor"]},
{n:"Counterspell",cat:"vitality",tier:3,effect:"+Spirit resist and a chance to reduce incoming ability duration.",mods:{spiritArmor:16},tags:["armor","CC resist"]},
{n:"Dispel Magic",cat:"vitality",tier:3,effect:"Active: remove negative Spirit effects from yourself.",mods:{},tags:["Z/X/C/V","cleanse"],active:true,cond:"Only removes debuffs present at the moment of activation."},
{n:"Fortitude",cat:"vitality",tier:3,effect:"Large +max health and health regeneration.",mods:{hp:200,regen:2},tags:["health"]},
{n:"Fury Trance",cat:"vitality",tier:3,effect:"Being hit in a fight grants stacking bonus damage for a short window.",mods:{},tags:["on hit taken","ramping"],cond:"Stacks only build while under fire and decay once out of combat."},
{n:"Healing Nova",cat:"vitality",tier:3,effect:"Active: pulse that heals nearby allies over time.",mods:{},tags:["Z/X/C/V","team heal"],active:true,cond:"Only heals allies inside the pulse radius when cast."},
{n:"Lifestrike",cat:"vitality",tier:3,effect:"Heavy melee hits deal bonus damage and heal you.",mods:{},tags:["melee"],cond:"Bonus only triggers on a landed heavy melee attack."},
{n:"Majestic Leap",cat:"vitality",tier:3,effect:"Active: leap a long distance, gaining brief damage resistance mid-air.",mods:{},tags:["Z/X/C/V","mobility"],active:true,cond:"Resistance only applies during the leap itself."},
{n:"Metal Skin",cat:"vitality",tier:3,effect:"Active: become briefly immune to a portion of incoming damage.",mods:{},tags:["Z/X/C/V","damage block"],active:true,cond:"Only active for the short duration after casting, then on cooldown."},
{n:"Rescue Beam",cat:"vitality",tier:3,effect:"Active: tether to an ally to heal and pull them toward you.",mods:{},tags:["Z/X/C/V","team"],active:true,cond:"Only affects the allied hero you target while channeling."},
{n:"Spirit Resilience",cat:"vitality",tier:3,effect:"Large +Spirit resist and health.",mods:{spiritArmor:22,hp:75},tags:["armor"]},
{n:"Stamina Mastery",cat:"vitality",tier:3,effect:"+1 stamina charge and faster stamina recovery.",mods:{stamina:1},tags:["mobility"]},
{n:"Veil Walker",cat:"vitality",tier:3,effect:"Taking heavy Spirit damage grants brief bonus Spirit resist.",mods:{},tags:["proc armor"],cond:"Bonus only triggers after taking a large burst of Spirit damage."},
{n:"Warp Stone",cat:"vitality",tier:3,effect:"Active: teleport a short distance, breaking most slows.",mods:{},tags:["Z/X/C/V","mobility"],active:true,cond:"Slow cleanse only applies at the moment of teleporting."},

/* ---------- VITALITY T4 ---------- */
{n:"Cheat Death",cat:"vitality",tier:4,effect:"Passive: surviving a killing blow instead knocks you into a brief downed state you can recover from.",mods:{},tags:["proc"],cond:"Only triggers once per cooldown, on a hit that would otherwise kill you."},
{n:"Colossus",cat:"vitality",tier:4,effect:"Large +max health and +melee damage.",mods:{hp:300},tags:["health"]},
{n:"Divine Barrier",cat:"vitality",tier:4,effect:"Dropping below a health threshold grants a large shield.",mods:{},tags:["proc shield"],cond:"Shield only triggers once per cooldown when health crosses the threshold."},
{n:"Diviner's Kevlar",cat:"vitality",tier:4,effect:"+Bullet and Spirit resist, more effective while at high health.",mods:{bulletArmor:12,spiritArmor:12},tags:["armor"],cond:"Bonus resist scales down as your health drops."},
{n:"Healing Tempo",cat:"vitality",tier:4,effect:"Health regeneration ramps up the longer you stay out of combat.",mods:{regen:2},tags:["out of combat"],cond:"Bonus regen only builds while you avoid taking or dealing damage."},
{n:"Indomitable",cat:"vitality",tier:4,effect:"+Debuff resist and a burst of tenacity when crowd controlled.",mods:{},tags:["CC resist"],cond:"Burst effect only triggers when a stun or root lands on you."},
{n:"Infuser",cat:"vitality",tier:4,effect:"Large +lifesteal on all damage sources.",mods:{},tags:["sustain"]},
{n:"Inhibitor",cat:"vitality",tier:4,effect:"+Debuff resist and reduces the duration of all incoming crowd control.",mods:{},tags:["CC resist"]},
{n:"Juggernaut",cat:"vitality",tier:4,effect:"Move speed and stamina charges increase as your health rises.",mods:{stamina:1},tags:["scaling"],cond:"Bonus scales with your current health total."},
{n:"Leech",cat:"vitality",tier:4,effect:"Damaging an enemy hero briefly saps their move speed and heals you.",mods:{},tags:["on hit"],cond:"Slow and heal only trigger against hero targets you damage."},
{n:"Phantom Strike",cat:"vitality",tier:4,effect:"Active: dash to an enemy and strike them with bonus damage.",mods:{},tags:["Z/X/C/V","gap close"],active:true,cond:"Bonus damage only applies on the strike that lands after the dash."},
{n:"Plated Armor",cat:"vitality",tier:4,effect:"Large +bullet resist, extra effective against sustained fire.",mods:{bulletArmor:26},tags:["armor"]},
{n:"Siphon Bullets",cat:"vitality",tier:4,effect:"Taking bullet damage converts a portion into bonus Spirit power.",mods:{},tags:["on hit taken"],cond:"Bonus only accrues from bullet damage you actually take."},
{n:"Spellbreaker",cat:"vitality",tier:4,effect:"Active: become briefly immune to disables and gain bonus Spirit resist.",mods:{},tags:["Z/X/C/V","cleanse"],active:true,cond:"Immunity window only lasts for the short active duration."},
{n:"Unstoppable",cat:"vitality",tier:4,effect:"Active: become immune to all crowd control for a few seconds.",mods:{},tags:["Z/X/C/V","CC immune"],active:true,cond:"Immunity only lasts for the active's duration, then goes on cooldown."},
{n:"Vampiric Burst",cat:"vitality",tier:4,effect:"Active: pulse that heals you based on nearby enemies hit.",mods:{},tags:["Z/X/C/V","sustain"],active:true,cond:"Heal amount scales only with enemies caught in the pulse."},
{n:"Witchmail",cat:"vitality",tier:4,effect:"+Spirit resist; casting an ability against you triggers a slow on the caster.",mods:{spiritArmor:20},tags:["armor","punish"],cond:"Slow only triggers when an enemy targets you with an ability."},

/* ---------- SPIRIT T1 ---------- */
{n:"Ammo Scavenger",cat:"spirit",tier:1,effect:"Securing or denying a Soul refunds ammo and grants stacking Spirit power; bonus sprint speed at max stacks.",mods:{},tags:["on soul"],cond:"Ammo/Spirit gain triggers only when you secure or deny a Soul, and the sprint bonus only appears at max stacks."},
{n:"Extra Charge",cat:"spirit",tier:1,effect:"+1 max charge for one of your abilities.",mods:{},tags:["ability"]},
{n:"Extra Spirit",cat:"spirit",tier:1,effect:"+Spirit power.",mods:{spirit:10},tags:["spirit power"]},
{n:"Golden Goose Egg",cat:"spirit",tier:1,effect:"Passively earns bonus Souls while you're alive; active: hatch the egg for banked Souls plus permanent buffs.",mods:{},tags:["Z/X/C/V","economy"],active:true,cond:"Passive income only applies while alive; the permanent buffs are only granted when you hatch the egg."},
{n:"Mystic Burst",cat:"spirit",tier:1,effect:"Charges up over time; the next ability dealing over ~80 damage deals bonus Spirit damage.",mods:{},tags:["ability proc"],cond:"Bonus only applies once charged, and only to a qualifying high-damage ability hit."},
{n:"Mystic Expansion",cat:"spirit",tier:1,effect:"Imbue an ability to increase its range and effect radius.",mods:{},tags:["imbue"],cond:"Bonus only applies to the specific ability you imbue with it."},
{n:"Mystic Regeneration",cat:"spirit",tier:1,effect:"Dealing Spirit damage to enemy heroes grants stacking bonus health regen.",mods:{},tags:["on ability hit"],cond:"Regen only stacks from Spirit damage landed on different enemy heroes."},
{n:"Rusted Barrel",cat:"spirit",tier:1,effect:"+Spirit power that is stronger early and tapers as the match goes on.",mods:{spirit:12},tags:["early game"]},
{n:"Spirit Strike",cat:"spirit",tier:1,effect:"Melee hits deal bonus Spirit damage.",mods:{},tags:["on melee"],cond:"Bonus only triggers on landed melee attacks."},

/* ---------- SPIRIT T2 ---------- */
{n:"Arcane Surge",cat:"spirit",tier:2,effect:"+Spirit power and ability range.",mods:{spirit:12},tags:["spirit power","range"]},
{n:"Bullet Resist Shredder",cat:"spirit",tier:2,effect:"Ability hits reduce the target's bullet resist for a short time.",mods:{},tags:["on ability hit"],cond:"Shred only applies while the debuff is active on a hit enemy."},
{n:"Cold Front",cat:"spirit",tier:2,effect:"Active: chilling nova that slows and damages nearby enemies.",mods:{},tags:["Z/X/C/V","AoE CC"],active:true,cond:"Only affects enemies within the nova's radius when cast."},
{n:"Compress Cooldown",cat:"spirit",tier:2,effect:"−Ability cooldowns.",mods:{cdr:10},tags:["cooldown"]},
{n:"Duration Extender",cat:"spirit",tier:2,effect:"+Duration of your ability effects (slows, buffs, debuffs).",mods:{},tags:["duration"]},
{n:"Improved Spirit",cat:"spirit",tier:2,effect:"+Spirit power and a small amount of health regen.",mods:{spirit:14,regen:1},tags:["spirit power"]},
{n:"Mystic Slow",cat:"spirit",tier:2,effect:"Ability hits apply a stacking slow.",mods:{},tags:["on ability hit","CC"],cond:"Slow only applies while the debuff is active on a hit enemy."},
{n:"Mystic Vulnerability",cat:"spirit",tier:2,effect:"Ability hits mark the target to take bonus damage from all sources briefly.",mods:{},tags:["on ability hit"],cond:"Vulnerability window only applies while the mark is active."},
{n:"Quicksilver Reload",cat:"spirit",tier:2,effect:"Casting an ability instantly refills a portion of your clip.",mods:{},tags:["on ability cast"],cond:"Refill only triggers right after casting an ability."},
{n:"Slowing Hex",cat:"spirit",tier:2,effect:"Active: hex a target to slow and silence them briefly.",mods:{},tags:["Z/X/C/V","CC"],active:true,cond:"Only affects the targeted enemy while the hex is active."},
{n:"Spirit Sap",cat:"spirit",tier:2,effect:"Active: drain Spirit power from a target, giving it to you temporarily.",mods:{},tags:["Z/X/C/V","drain"],active:true,cond:"Drain only applies to the targeted enemy for the active's duration."},
{n:"Suppressor",cat:"spirit",tier:2,effect:"+Spirit power against enemies at range; slows enemies who damage you from far away.",mods:{spirit:8},tags:["ranged"],cond:"Slow only triggers against enemies hitting you from outside melee range."},

/* ---------- SPIRIT T3 ---------- */
{n:"Decay",cat:"spirit",tier:3,effect:"Active: curse an enemy to take more damage from all sources for a duration.",mods:{},tags:["Z/X/C/V","debuff"],active:true,cond:"Vulnerability only applies to the cursed target while the effect lasts."},
{n:"Disarming Hex",cat:"spirit",tier:3,effect:"Active: silence and disarm a target, preventing weapon and ability use.",mods:{},tags:["Z/X/C/V","hard CC"],active:true,cond:"Only affects the targeted enemy for the hex duration."},
{n:"Greater Expansion",cat:"spirit",tier:3,effect:"Large +ability range and radius across all your abilities.",mods:{},tags:["range"]},
{n:"Knockdown",cat:"spirit",tier:3,effect:"Active: knock an enemy into the air and stun them on landing.",mods:{},tags:["Z/X/C/V","hard CC"],active:true,cond:"Stun only applies to the target hit by the knock-up."},
{n:"Radiant Regeneration",cat:"spirit",tier:3,effect:"+Spirit power and a burst of health regen when you land an ability.",mods:{spirit:14},tags:["on ability hit"],cond:"Regen burst only triggers when an ability actually connects."},
{n:"Rapid Recharge",cat:"spirit",tier:3,effect:"Large −time between ability charge refills.",mods:{cdr:8},tags:["charges"]},
{n:"Silence Wave",cat:"spirit",tier:3,effect:"Active: a wave that silences all enemies it passes through.",mods:{},tags:["Z/X/C/V","AoE CC"],active:true,cond:"Silence only applies to enemies caught in the wave's path."},
{n:"Spirit Snatch",cat:"spirit",tier:3,effect:"Melee hits against enemy heroes steal a burst of Spirit power.",mods:{},tags:["on melee"],cond:"Steal only triggers on melee hits against enemy heroes."},
{n:"Superior Cooldown",cat:"spirit",tier:3,effect:"Large −ability cooldowns.",mods:{cdr:14},tags:["cooldown"]},
{n:"Superior Duration",cat:"spirit",tier:3,effect:"Large +duration on all your ability effects.",mods:{},tags:["duration"]},
{n:"Surge of Power",cat:"spirit",tier:3,effect:"Casting an ability grants a brief burst of bonus Spirit power.",mods:{spirit:6},tags:["on ability cast"],cond:"Burst only triggers right after casting an ability, then falls off."},
{n:"Tankbuster",cat:"spirit",tier:3,effect:"Ability damage against high-health targets is increased.",mods:{},tags:["vs. tanks"],cond:"Bonus scales with the target's max health — strongest against tanky heroes."},
{n:"Torment Pulse",cat:"spirit",tier:3,effect:"Passive pulse that damages and marks nearby enemies over time.",mods:{},tags:["AoE DoT"],cond:"Only affects enemies within pulse range of you."},

/* ---------- SPIRIT T4 ---------- */
{n:"Arctic Blast",cat:"spirit",tier:4,effect:"Active: a large freezing nova that heavily slows and damages enemies.",mods:{},tags:["Z/X/C/V","AoE CC"],active:true,cond:"Only affects enemies caught within the nova's radius when cast."},
{n:"Boundless Spirit",cat:"spirit",tier:4,effect:"Large +Spirit power, scaling further with your current bonus health.",mods:{spirit:30},tags:["spirit power","scaling"]},
{n:"Cursed Relic",cat:"spirit",tier:4,effect:"Active: launch a curse that deals heavy Spirit damage over time to a target.",mods:{},tags:["Z/X/C/V","DoT"],active:true,cond:"Only affects the enemy the curse is cast on."},
{n:"Echo Shard",cat:"spirit",tier:4,effect:"Active: recast your last used ability a second time at reduced cooldown.",mods:{},tags:["Z/X/C/V","ability"],active:true,cond:"Only works on the most recent ability you cast, within the active's window."},
{n:"Escalating Exposure",cat:"spirit",tier:4,effect:"Repeated Spirit damage against the same target increases its vulnerability.",mods:{},tags:["ramping debuff"],cond:"Vulnerability stacks only build against a target you keep hitting with Spirit damage."},
{n:"Ethereal Shift",cat:"spirit",tier:4,effect:"Active: become briefly untargetable and pass through enemies.",mods:{},tags:["Z/X/C/V","evasion"],active:true,cond:"Untargetable window only lasts for the short active duration."},
{n:"Focus Lens",cat:"spirit",tier:4,effect:"Active: mark a target to take bonus Spirit damage from your next ability.",mods:{},tags:["Z/X/C/V","setup"],active:true,cond:"Bonus damage only applies to the marked target's next instance of ability damage."},
{n:"Lightning Scroll",cat:"spirit",tier:4,effect:"Active: strike enemies in a line with chaining lightning damage.",mods:{},tags:["Z/X/C/V","AoE"],active:true,cond:"Only affects enemies caught in the lightning's path."},
{n:"Magic Carpet",cat:"spirit",tier:4,effect:"Active: brief flight that lets you cross gaps and cliffs.",mods:{},tags:["Z/X/C/V","mobility"],active:true,cond:"Flight only lasts for the active's duration."},
{n:"Mercurial Magnum",cat:"spirit",tier:4,effect:"Bullets occasionally convert to a high-damage Spirit-infused shot.",mods:{spirit:10},tags:["proc","hybrid"],cond:"Bonus shot triggers on a per-clip chance, not every bullet."},
{n:"Mystic Reverb",cat:"spirit",tier:4,effect:"Ability hits bounce a portion of their slow/damage to a second nearby enemy.",mods:{},tags:["on ability hit"],cond:"Bounce only triggers if a second enemy is near the original target."},
{n:"Refresher",cat:"spirit",tier:4,effect:"Active: instantly reset the cooldowns of all your other items and abilities.",mods:{},tags:["Z/X/C/V","reset"],active:true,cond:"One-time reset per cooldown of Refresher itself."},
{n:"Scourge",cat:"spirit",tier:4,effect:"When you die, deals a burst of Spirit damage to nearby enemies.",mods:{},tags:["on death"],cond:"Only triggers at the moment you die, damaging enemies near your body."},
{n:"Spirit Burn",cat:"spirit",tier:4,effect:"Large +Spirit power and duration on burn/damage-over-time effects.",mods:{spirit:20},tags:["spirit power","DoT"]},
{n:"Transcendent Cooldown",cat:"spirit",tier:4,effect:"Massive −ability cooldowns, strongest on your most expensive ability.",mods:{cdr:20},tags:["cooldown"]},
{n:"Vortex Web",cat:"spirit",tier:4,effect:"Active: pull all nearby enemies toward a central point.",mods:{},tags:["Z/X/C/V","AoE CC"],active:true,cond:"Pull only affects enemies within the vortex's radius when cast."},
];

/* ============== STAT MODEL ============== */
const STAT_DEFS = [
 {k:"hp", label:"Max Health", unit:""},
 {k:"regen", label:"Health Regen /s", unit:""},
 {k:"dmg", label:"Bullet Damage", unit:""},
 {k:"spirit", label:"Spirit Power", unit:""},
 {k:"fireRate", label:"Fire Rate", unit:"%"},
 {k:"clip", label:"Clip Size", unit:""},
 {k:"bulletArmor", label:"Bullet Resist", unit:"%"},
 {k:"spiritArmor", label:"Spirit Resist", unit:"%"},
 {k:"cdr", label:"Cooldown Reduction", unit:"%"},
 {k:"move", label:"Move Speed", unit:"m/s"},
 {k:"sprint", label:"Sprint Speed", unit:"m/s"},
 {k:"stamina", label:"Stamina Charges", unit:""},
];

/* ============== INVESTMENT BONUS TRACK ==============
 Deadlock grants a passive category bonus based on total souls currently spent (owned items)
 in that column. The track ramps in small steps, then spikes hard at 4,800 -- the breakpoint
 players talk about and the one Valve has repeatedly called out in patch notes -- and continues
 with further, smaller spikes deeper in as you keep stacking souls into the same column.
 Weapon -> % bonus Weapon Damage. Vitality -> % bonus to your item-granted Bonus Health.
 Spirit -> flat bonus Spirit Power.

 CONFIRMED from patch notes / datamines (mid-2026 patch): the 3,200 and 4,800 rows.
 EXTRAPOLATED: 800/1,600/2,400 (smoothed "small step" ramp) and the two rows past 4,800
 (9,600 / 14,400), continuing the same growth curve since Valve hasn't published exact
 numbers that deep and it isn't in the public assets API response. Treat anything past
 4,800 as a rough shape, not a verified figure -- the important thing this bar communicates
 is that investment keeps paying out past the famous breakpoint, it doesn't cap there.
*/
const INVEST_BREAKPOINTS = [800, 1600, 2400, 3200, 4800, 9600, 14400];
const INVEST_MAJOR_BREAKPOINT = 4800; // the commonly-cited "hit your spike" milestone
const INVEST_CAP = 14400; // bar's full-scale range -- well past the 4.8k milestone
const INVEST_VALUES = {
  weapon:   [6, 11, 16, 20, 49, 62, 74],   // % bonus Weapon Damage
  vitality: [5, 9, 13, 17, 34, 44, 53],    // % bonus to item-granted Bonus Health
  spirit:   [5, 10, 15, 19, 45, 58, 70],   // flat bonus Spirit Power
};
const INVEST_UNIT = { weapon:"%", vitality:"%", spirit:"" };
const INVEST_LABEL = { weapon:"Weapon Damage", vitality:"Bonus Health", spirit:"Spirit Power" };

function categorySpend(build, cat){
  return build.filter(it=>it.cat===cat).reduce((a,b)=>a+TIER_COST[b.tier],0);
}
// returns {value, tierIndex} for the highest breakpoint reached (tierIndex -1 = none)
function investmentBonus(cat, spend){
  let tierIndex = -1;
  for(let i=0;i<INVEST_BREAKPOINTS.length;i++){
    if(spend >= INVEST_BREAKPOINTS[i]) tierIndex = i;
  }
  const value = tierIndex===-1 ? 0 : INVEST_VALUES[cat][tierIndex];
  return { value, tierIndex };
}


/* ============== LIVE API LAYER ==============
 Pulls current heroes/items straight from the community-run Deadlock API instead of relying
 only on the bundled snapshot above. Endpoints per deadlock-api.com's docs:
   Heroes: https://api.deadlock-api.com/v1/assets/heroes
   Items:  https://api.deadlock-api.com/v1/assets/items
 NOTE: api.deadlock-api.com's docs page is a JS app (Scalar), so the exact response shape
 couldn't be introspected from outside a browser. The normalizers below try several likely
 field names defensively and log the first raw record to the console on load -- open devtools
 once against a live deploy and confirm the field names match; adjust the `pick(...)` lists
 below if the API uses different keys. Either way the app never breaks: anything the API
 doesn't confirm falls back to the curated snapshot (name-matched), and a full fetch failure
 (offline, CORS, rate limit) just keeps the whole app on the bundled data with a visible notice.
*/
const HEROES_API_URL = "https://api.deadlock-api.com/v1/assets/heroes";
const ITEMS_API_URL = "https://api.deadlock-api.com/v1/assets/items";

function pick(obj, keys, fallback){
  for(const k of keys){
    const v = k.split('.').reduce((o,p)=> (o==null?undefined:o[p]), obj);
    if(v !== undefined && v !== null) return v;
  }
  return fallback;
}
function normalizeName(s){ return (s||"").toLowerCase().replace(/[^a-z0-9]/g,""); }

function mapApiHero(raw, fallbackByName){
  const name = pick(raw, ["name","display_name","localized_name","class_name"], null);
  if(!name) return null;
  const match = fallbackByName.get(normalizeName(name));
  const h = pick(raw, ["stats.max_health","starting_stats.health","max_health","health"], match?.h ?? 700);
  const r = pick(raw, ["stats.health_regen","starting_stats.health_regen","health_regen"], match?.r ?? 1.5);
  const d = pick(raw, ["stats.bullet_damage","starting_stats.weapon_damage","bullet_damage"], match?.d ?? 10);
  const m = pick(raw, ["stats.move_speed","starting_stats.move_speed","move_speed"], match?.m ?? 7);
  const s = pick(raw, ["stats.stamina","starting_stats.stamina","stamina"], match?.s ?? 3);
  const role = pick(raw, ["role","player_selectable_role"], match?.role ?? "");
  return {
    n: name,
    role: role || match?.role || "",
    h: Number(h) || (match?.h ?? 700),
    r: Number(r) || (match?.r ?? 1.5),
    d: Number(d) || (match?.d ?? 10),
    m: Number(m) || (match?.m ?? 7),
    s: Number(s) || (match?.s ?? 3),
    approx: !match && true,
    live: true,
  };
}

function mapApiItem(raw, fallbackByName){
  const name = pick(raw, ["name","display_name","displayName.english","class_name"], null);
  if(!name) return null;
  const match = fallbackByName.get(normalizeName(name));

  let cat = pick(raw, ["category","item_slot_type","shop.category","slot_type"], match?.cat ?? null);
  if(cat) cat = String(cat).toLowerCase();
  if(cat && cat.includes("weapon")) cat = "weapon";
  else if(cat && (cat.includes("armor") || cat.includes("vitality"))) cat = "vitality";
  else if(cat && (cat.includes("tech") || cat.includes("spirit"))) cat = "spirit";
  if(!["weapon","vitality","spirit"].includes(cat)) cat = match?.cat ?? "weapon";

  let tier = Number(pick(raw, ["tier","item_tier","shop.tier"], match?.tier ?? 1)) || (match?.tier ?? 1);
  if(tier < 1 || tier > 4) tier = match?.tier ?? 1;

  const description = pick(raw, ["description","descriptionDisplay.english","tooltip"], null);
  const active = pick(raw, ["active","activation.isActive","is_active"], match?.active ?? false);

  return {
    n: name,
    cat,
    tier,
    effect: (description && String(description).replace(/<[^>]+>/g,"").trim()) || match?.effect || "See in-game tooltip for full effect — not yet curated in this tool.",
    mods: match?.mods || {},
    tags: match?.tags || [],
    active: !!active,
    cond: match?.cond,
    live: true,
    matched: !!match,
  };
}

function buildFallbackIndex(list){
  const map = new Map();
  list.forEach(x=>map.set(normalizeName(x.n), x));
  return map;
}

// Fetches + normalizes both endpoints. Always resolves (never throws) -- returns
// { heroes, items, source: "live"|"fallback", error? }
async function fetchDeadlockData(signal){
  const heroFallbackIdx = buildFallbackIndex(FALLBACK_HEROES);
  const itemFallbackIdx = buildFallbackIndex(FALLBACK_ITEMS);
  try {
    const [heroRes, itemRes] = await Promise.all([
      fetch(HEROES_API_URL, { signal }),
      fetch(ITEMS_API_URL, { signal }),
    ]);
    if(!heroRes.ok || !itemRes.ok) throw new Error(`API responded ${heroRes.status}/${itemRes.status}`);
    const heroJson = await heroRes.json();
    const itemJson = await itemRes.json();
    const heroRaw = Array.isArray(heroJson) ? heroJson : (heroJson.heroes || heroJson.data || []);
    const itemRaw = Array.isArray(itemJson) ? itemJson : (itemJson.items || itemJson.data || []);

    if(heroRaw[0]) console.log("[SoulLedger] sample raw hero from API:", heroRaw[0]);
    if(itemRaw[0]) console.log("[SoulLedger] sample raw item from API:", itemRaw[0]);

    const heroes = heroRaw
      .map(r=>mapApiHero(r, heroFallbackIdx))
      .filter(Boolean)
      .filter(h=> pick(h, ["player_selectable"], true) !== false);
    const items = itemRaw
      .map(r=>mapApiItem(r, itemFallbackIdx))
      .filter(Boolean)
      .filter(it=>it.tier>=1 && it.tier<=4);

    if(heroes.length===0 || items.length===0) throw new Error("API returned no usable heroes/items");
    return { heroes, items, source: "live" };
  } catch(err){
    console.warn("[SoulLedger] live API fetch failed, using bundled snapshot:", err.message);
    return { heroes: FALLBACK_HEROES, items: FALLBACK_ITEMS, source: "fallback", error: err.message };
  }
}



/* ============== PURE HELPERS ============== */
function baseValue(hero, k){
  switch(k){
    case "hp": return hero.h;
    case "regen": return hero.r;
    case "dmg": return hero.d;
    case "spirit": return 0;
    case "fireRate": return 100;
    case "clip": return 0;
    case "bulletArmor": return 0;
    case "spiritArmor": return 0;
    case "cdr": return 0;
    case "move": return hero.m;
    case "sprint": return 0;
    case "stamina": return hero.s;
    default: return 0;
  }
}
function round1(n){ return Math.round(n*10)/10; }

function computeRawTotals(build){
  const totals = {};
  STAT_DEFS.forEach(s=>totals[s.k]=0);
  build.forEach(it=>{
    Object.entries(it.mods||{}).forEach(([k,v])=>{ totals[k] = (totals[k]||0) + v; });
  });
  return totals;
}

function computeInvestments(build){
  const spend = {
    weapon: categorySpend(build,'weapon'),
    vitality: categorySpend(build,'vitality'),
    spirit: categorySpend(build,'spirit'),
  };
  return {
    spend,
    weapon: investmentBonus('weapon', spend.weapon),
    vitality: investmentBonus('vitality', spend.vitality),
    spirit: investmentBonus('spirit', spend.spirit),
  };
}

function computeFinalDeltas(hero, build){
  const raw = computeRawTotals(build);
  const inv = computeInvestments(build);
  const final = Object.assign({}, raw);

  const baseDmg = baseValue(hero, 'dmg');
  const dmgBeforeInvest = baseDmg + raw.dmg;
  const weaponBonusDmg = dmgBeforeInvest * (inv.weapon.value/100);
  final.dmg = raw.dmg + weaponBonusDmg;

  const vitalityBonusHp = raw.hp * (inv.vitality.value/100);
  final.hp = raw.hp + vitalityBonusHp;

  final.spirit = raw.spirit + inv.spirit.value;

  return { raw, inv, final };
}


/* ============== COMPONENT ============== */
export default function SoulLedger(){
  const [heroes, setHeroes] = useState(FALLBACK_HEROES);
  const [items, setItems] = useState(FALLBACK_ITEMS);
  const [dataSource, setDataSource] = useState("loading"); // loading | live | fallback
  const [dataError, setDataError] = useState(null);

  const [selectedHero, setSelectedHero] = useState(FALLBACK_HEROES[0]);
  const [build, setBuild] = useState([]);
  const [catFilter, setCatFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState(0);
  const [heroQuery, setHeroQuery] = useState("");
  const [itemQuery, setItemQuery] = useState("");

  useEffect(()=>{
    const controller = new AbortController();
    setDataSource("loading");
    fetchDeadlockData(controller.signal).then(res=>{
      setHeroes(res.heroes.length ? res.heroes : FALLBACK_HEROES);
      setItems(res.items.length ? res.items : FALLBACK_ITEMS);
      setDataSource(res.source);
      setDataError(res.error || null);
      const heroList = res.heroes.length ? res.heroes : FALLBACK_HEROES;
      setSelectedHero(prev => heroList.find(h=>h.n===prev?.n) || heroList[0]);
    });
    return ()=>controller.abort();
  },[]);

  function pickHero(h){ setSelectedHero(h); setBuild([]); }
  function toggleItem(it){
    setBuild(prev => prev.includes(it) ? prev.filter(b=>b!==it) : [...prev, it]);
  }
  function removeAt(idx){ setBuild(prev => prev.filter((_,i)=>i!==idx)); }

  const filteredHeroes = useMemo(()=>{
    const q = heroQuery.trim().toLowerCase();
    return heroes.filter(h=>h.n.toLowerCase().includes(q));
  },[heroes, heroQuery]);

  const { inv, final: totals } = useMemo(()=>computeFinalDeltas(selectedHero, build), [selectedHero, build]);

  const soulsTotal = useMemo(()=>build.reduce((a,b)=>a+TIER_COST[b.tier],0), [build]);

  const filteredItemsByTier = useMemo(()=>{
    const q = itemQuery.trim().toLowerCase();
    const pool = items.filter(it=>{
      if(catFilter!=="all" && it.cat!==catFilter) return false;
      if(tierFilter!==0 && it.tier!==tierFilter) return false;
      if(q && !it.n.toLowerCase().includes(q)) return false;
      return true;
    });
    const byTier = {1:[],2:[],3:[],4:[]};
    pool.forEach(it=>byTier[it.tier].push(it));
    return byTier;
  },[items, catFilter, tierFilter, itemQuery]);

  const conditionalItems = useMemo(()=>build.filter(it=>it.active || it.cond), [build]);

  return (
    <div style={{minHeight:"100vh", background:"var(--bg)"}}>
      <style>{CSS_STYLES}</style>
      <div className="app">

        <header className="top">
          <div className="brand">
            <div className="mark">SOUL<span>·</span>LEDGER</div>
            <div className="sub">DEADLOCK ITEM &amp; STAT SIMULATOR</div>
          </div>
          <div className="build-tag">
            <span className={"data-badge "+dataSource}>
              {dataSource==="loading" && "● fetching live data..."}
              {dataSource==="live" && "● live from api.deadlock-api.com"}
              {dataSource==="fallback" && "● offline — using bundled snapshot"}
            </span><br/>
            source: api.deadlock-api.com (heroes + items) · cross-checked against deadlock.wiki/Items
          </div>
        </header>

        <div className="hero-rail">
          <div className="hero-rail-label">01 — Choose a hero</div>
          <input
            className="hero-search"
            placeholder={`Search ${heroes.length} heroes...`}
            value={heroQuery}
            onChange={e=>setHeroQuery(e.target.value)}
          />
          <div className="hero-grid">
            {filteredHeroes.map(h=>(
              <button
                key={h.n}
                className={"hero-chip" + (h===selectedHero?" active":"") + (h.approx?" approx":"")}
                onClick={()=>pickHero(h)}
              >
                <span className="n">{h.n}</span>
                <span className="r">{h.role}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="layout">
          <div className="col-left">
            <div className="panel">
              <div className="panel-title"><span>02 — Stat sheet</span><span>{selectedHero?.n}</span></div>

              <div className="invest-panel">
                {["weapon","vitality","spirit"].map(cat=>{
                  const spend = inv.spend[cat];
                  const { value, tierIndex } = inv[cat];
                  const pct = Math.min(100, (spend/INVEST_CAP)*100);
                  return (
                    <div className="invest-row" key={cat}>
                      <div className="invest-head">
                        <span className={"invest-name "+cat}>{cat}</span>
                        <span className="invest-figures"><b>{spend.toLocaleString()}</b> / {INVEST_CAP.toLocaleString()}</span>
                      </div>
                      <div className="invest-track">
                        <div className={"invest-fill "+cat} style={{width:pct+"%"}}></div>
                        <div className="invest-ticks">
                          {INVEST_BREAKPOINTS.map(bp=>{
                            const left = (bp/INVEST_CAP)*100;
                            const isMajor = bp === INVEST_MAJOR_BREAKPOINT;
                            const cls = "invest-tick" + (spend>=bp?" hit":"") + (isMajor?" major":"");
                            return <div key={bp} className={cls} style={{left:left+"%"}} title={bp.toLocaleString()+" souls"}></div>;
                          })}
                        </div>
                      </div>
                      <div className="invest-bonus-txt">
                        {tierIndex===-1
                          ? <>No bonus yet — next breakpoint at {INVEST_BREAKPOINTS[0]} souls</>
                          : <><b>+{value}{INVEST_UNIT[cat]} {INVEST_LABEL[cat]}</b>{tierIndex<INVEST_BREAKPOINTS.length-1 ? ` · next at ${INVEST_BREAKPOINTS[tierIndex+1].toLocaleString()}` : " · past every known breakpoint"}</>
                        }
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                {STAT_DEFS.map(s=>{
                  const base = baseValue(selectedHero, s.k);
                  const delta = totals[s.k] || 0;
                  const total = base + delta;
                  const deltaClass = delta > 0 ? "pos" : (delta < 0 ? "neg" : "zero");
                  const deltaTxt = delta === 0 ? "—" : (delta > 0 ? "+"+round1(delta) : round1(delta)) + s.unit;
                  return (
                    <div className="stat-row" key={s.k}>
                      <span className="label">{s.label}</span>
                      <span className="total">{round1(total)}{s.unit}</span>
                      <span className={"delta "+deltaClass}>{deltaTxt}</span>
                    </div>
                  );
                })}
              </div>

              <div className="souls-spent">
                <span className="lbl">Souls spent</span>
                <span className="amt">{soulsTotal.toLocaleString()}</span>
              </div>

              <div className="build-list">
                {build.length===0 ? (
                  <div className="build-empty">No items purchased yet — click items in the shop to add them.</div>
                ) : build.map((it,idx)=>(
                  <div className="build-item" key={it.n+idx}>
                    <span className="dot" style={{background:`var(--${it.cat})`}}></span>
                    <span className="nm">{it.n}</span>
                    <span className="cost">{TIER_COST[it.tier]}</span>
                    <button className="rm" title="Remove" onClick={()=>removeAt(idx)}>×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-right">
            <div className="panel">
              <div className="panel-title">03 — Shop</div>
              <div className="shop-controls">
                {["all","weapon","vitality","spirit"].map(c=>(
                  <button
                    key={c}
                    className={"cat-btn"+(catFilter===c?" on":"")}
                    data-cat={c}
                    onClick={()=>setCatFilter(c)}
                  >{c==="all"?"All":c[0].toUpperCase()+c.slice(1)}</button>
                ))}
                <input
                  className="item-search"
                  placeholder={`Search ${items.length} items...`}
                  value={itemQuery}
                  onChange={e=>setItemQuery(e.target.value)}
                />
                <div className="tier-tabs">
                  {[0,1,2,3,4].map(t=>(
                    <button
                      key={t}
                      className={"tier-btn"+(tierFilter===t?" on":"")}
                      onClick={()=>setTierFilter(t)}
                    >{t===0?"All tiers":"T"+t}</button>
                  ))}
                </div>
              </div>

              <div>
                {[1,2,3,4].map(tier=>{
                  const tierItems = filteredItemsByTier[tier];
                  if(!tierItems || tierItems.length===0) return null;
                  return (
                    <div className="tier-group" key={tier}>
                      <h4>Tier {tier} · {TIER_COST[tier]} souls</h4>
                      <div className="item-grid">
                        {tierItems.map(it=>{
                          const inBuild = build.includes(it);
                          const statChips = Object.entries(it.mods||{}).filter(([k,v])=>v!==0).map(([k,v])=>{
                            const def = STAT_DEFS.find(s=>s.k===k);
                            if(!def) return null;
                            const cls = v>0?"pos":"neg";
                            const txt = (v>0?"+":"") + round1(v) + def.unit;
                            return <span className={"stat-chip "+cls} key={k}>{txt} {def.label}</span>;
                          });
                          return (
                            <div
                              className={"item-card"+(inBuild?" added":"")}
                              data-cat={it.cat}
                              key={it.n}
                              onClick={()=>toggleItem(it)}
                            >
                              <div className="item-head">
                                <span className="item-name">{it.n}{inBuild?" ✓":""}</span>
                                <span className="item-cost">{TIER_COST[it.tier]}</span>
                              </div>
                              {statChips.length>0 && <div className="item-stats">{statChips}</div>}
                              <div className="item-effect">{it.effect}</div>
                              <div className="item-tags">
                                {(it.tags||[]).map(t=><span className="tag" key={t}>{t}</span>)}
                                {it.active && <span className="tag active-tag">ACTIVE</span>}
                                {it.cond && <span className="tag cond-tag">CONDITIONAL</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {Object.values(filteredItemsByTier).every(arr=>arr.length===0) && (
                  <div className="build-empty">No items match your filters.</div>
                )}
              </div>
            </div>

            <div className="panel cond-panel">
              <div className="panel-title">04 — Active &amp; conditional effects</div>
              <div className="cond-list">
                {conditionalItems.length===0 ? (
                  <div className="cond-empty">Buy an active or conditional item to see exactly when its effect turns on.</div>
                ) : conditionalItems.map((it,idx)=>{
                  const badge = it.active ? "ACTIVE — bound to Z / X / C / V" : "CONDITIONAL PASSIVE";
                  return (
                    <div className="cond-row" key={it.n+idx}>
                      <div className="item-lbl">{it.n}<small>{badge}</small></div>
                      <div className="desc">{it.cond ? it.cond : "Manually activated ability — triggers only while used and then goes on cooldown."}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <footer className="note">
          {dataSource==="fallback" && dataError && <>Live API fetch failed ({dataError}) — showing the bundled snapshot (build 23988212) instead.<br/></>}
          Hero and item data is pulled live from api.deadlock-api.com on load; anything the API doesn't confirm falls back
          to a curated snapshot referenced against deadlock.wiki/Items. Deadlock balances frequently, so treat exact
          numbers as close approximations — including the category investment breakpoints, where only 3.2k/4.8k are
          confirmed from patch notes and the deeper rows (9.6k/14.4k) are extrapolated, not datamined. Confirm anything
          match-critical against the in-game shop or{" "}
          <a href="https://deadlock.io/en/items" target="_blank" rel="noreferrer">deadlock.io/items</a>.
          This tool has no affiliation with Valve.
        </footer>
      </div>
    </div>
  );
}
