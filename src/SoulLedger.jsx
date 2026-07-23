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

.app{ max-width:1420px; margin:0 auto; padding:20px 20px 60px; }

/* ===== Header ===== */
header.top{
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 4px 20px; border-bottom:1px solid var(--line); margin-bottom:20px;
  flex-wrap:wrap; gap:12px;
}
.brand{ display:flex; align-items:baseline; gap:12px; }
.brand .mark{
  font-family:'Rajdhani',sans-serif; font-weight:700; font-size:24px; letter-spacing:0.14em;
  color:var(--text);
}
.brand .mark span{ color:var(--souls); }
.brand .sub{ font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--text-faint); letter-spacing:0.04em; }

.header-actions{ display:flex; align-items:center; gap:12px; }
.build-tag{ font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:var(--text-faint); text-align:right; line-height:1.6; }
.build-tag a{ color:var(--text-dim); text-decoration:none; }
.build-tag a:hover{ text-decoration:underline; }

.sync-btn{
  background:var(--bg-panel-2); border:1px solid var(--line); color:var(--text-dim);
  font-family:'IBM Plex Mono',monospace; font-size:11px; padding:6px 12px; border-radius:var(--radius);
  cursor:pointer; transition:.15s; display:inline-flex; align-items:center; gap:6px;
}
.sync-btn:hover{ border-color:var(--souls); color:var(--souls); background:#1e1a10; }
.sync-btn:disabled{ opacity:0.5; cursor:not-allowed; }

/* ===== Hero rail ===== */
.hero-rail{ margin-bottom:22px; }
.hero-rail-label{
  font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:var(--text-faint);
  letter-spacing:0.12em; text-transform:uppercase; margin:0 0 8px 2px;
  display:flex; justify-content:space-between; align-items:center;
}
.hero-search{
  width:100%; background:var(--bg-panel); border:1px solid var(--line); color:var(--text);
  font-family:'Inter',sans-serif; font-size:13px; padding:9px 12px; border-radius:var(--radius);
  margin-bottom:10px; outline:none; transition:border-color .15s;
}
.hero-search:focus{ border-color:var(--spirit); }
.hero-grid{
  display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:6px;
  max-height:180px; overflow-y:auto; padding-right:4px;
}
.hero-chip{
  background:var(--bg-panel); border:1px solid var(--line); border-radius:var(--radius);
  padding:6px 8px; cursor:pointer; text-align:left; transition:border-color .12s, background .12s;
  font-family:'Rajdhani',sans-serif; display:flex; align-items:center; gap:8px;
}
.hero-chip:hover{ border-color:var(--text-faint); background:var(--bg-panel-2); }
.hero-chip.active{ border-color:var(--souls); background:#1e1a10; }
.hero-chip .hero-img-sm{
  width:32px; height:32px; border-radius:2px; object-fit:cover; background:#000; flex-shrink:0;
  border:1px solid var(--line);
}
.hero-chip .hero-info{ overflow:hidden; }
.hero-chip .n{ font-weight:600; font-size:13.5px; color:var(--text); display:block; line-height:1.2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.hero-chip .r{ font-size:9.5px; color:var(--text-faint); display:block; margin-top:2px; font-family:'IBM Plex Mono',monospace; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

/* ===== Layout ===== */
.layout{ display:grid; grid-template-columns:360px 1fr; gap:20px; align-items:start; }
@media (max-width:980px){ .layout{ grid-template-columns:1fr; } }

.panel{
  background:var(--bg-panel); border:1px solid var(--line); border-radius:var(--radius); padding:16px;
  margin-bottom:20px;
}
.panel:last-child{ margin-bottom:0; }
.panel-title{
  font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:var(--text-faint);
  letter-spacing:0.12em; text-transform:uppercase; margin:0 0 12px 0; display:flex; justify-content:space-between; align-items:center;
}

/* ===== Hero Detail Header ===== */
.hero-detail-header{
  display:flex; gap:12px; align-items:center; padding-bottom:14px; margin-bottom:14px;
  border-bottom:1px solid var(--line);
}
.hero-portrait{
  width:56px; height:56px; border-radius:4px; object-fit:cover; background:#000;
  border:1px solid var(--souls); flex-shrink:0;
}
.hero-detail-meta .name{ font-family:'Rajdhani',sans-serif; font-size:20px; font-weight:700; color:var(--text); line-height:1.1; }
.hero-detail-meta .role{ font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--text-dim); margin-top:3px; }
.hero-tags{ display:flex; flex-wrap:wrap; gap:4px; margin-top:5px; }
.hero-tag{ padding:2px 5px; border:1px solid var(--spirit-dim); border-radius:2px; color:var(--spirit); font:9.5px 'IBM Plex Mono',monospace; text-transform:uppercase; }

/* ===== Slot Capacity & Walker Kills Panel ===== */
.slots-card{
  background:var(--bg-panel-2); border:1px solid var(--line); border-radius:var(--radius);
  padding:12px; margin-bottom:16px; font-family:'IBM Plex Mono',monospace;
}
.slots-title{ font-family:'Rajdhani',sans-serif; font-weight:700; font-size:14px; color:var(--text); margin-bottom:8px; display:flex; justify-content:space-between; }
.slots-summary{ display:flex; gap:16px; align-items:baseline; font-size:12px; color:var(--text-dim); margin-bottom:8px; }
.slots-summary b{ color:var(--text); font-size:14px; }
.slots-summary .base-lbl{ color:var(--text-faint); }
.slots-summary .flex-lbl{ color:var(--souls); }

.walker-section{ background:#00000040; border:1px solid var(--souls); padding:8px 10px; border-radius:2px; margin-top:8px; }
.walker-head{ display:flex; justify-content:space-between; align-items:baseline; font-size:11px; color:var(--souls); margin-bottom:6px; }
.walker-btn-group{ display:flex; gap:4px; margin-top:4px; }
.walker-btn{
  flex:1; background:var(--bg-panel); border:1px solid var(--line); color:var(--text-dim);
  font-size:10.5px; padding:5px 2px; border-radius:2px; cursor:pointer; text-align:center; transition:.12s;
}
.walker-btn:hover{ color:var(--text); border-color:var(--text-dim); }
.walker-btn.active{ background:#261f0d; border-color:var(--souls); color:var(--souls); font-weight:600; }
.slot-warn{ color:var(--danger); font-size:10.5px; margin-top:6px; text-align:center; font-weight:600; }

/* ===== Locked Slot Placeholders ===== */
.locked-slot{
  display:flex; align-items:center; gap:8px; padding:6px 8px; background:#0c0d0f;
  border-radius:var(--radius); border:1px dashed var(--line); font-size:12px;
  color:var(--text-faint); font-style:italic; opacity:0.5;
}
.locked-slot.unlockable{ border-color:var(--souls); opacity:0.65; color:var(--souls); font-style:normal; }
.locked-slot .lock-icon{ font-size:14px; flex-shrink:0; }

/* ===== Soul Boons Section ===== */
.boons-card{
  background:var(--bg-panel-2); border:1px solid var(--souls); border-radius:var(--radius);
  padding:12px; margin-bottom:16px; position:relative; overflow:hidden;
}
.boons-head{ display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px; }
.boons-title{ font-family:'Rajdhani',sans-serif; font-weight:700; font-size:14px; color:var(--souls); letter-spacing:0.04em; }
.boons-badge{ font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--text); font-weight:600; }
.boon-stats-preview{
  display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:8px; font-family:'IBM Plex Mono',monospace; font-size:10.5px;
}
.boon-stat-chip{ background:#00000040; border:1px solid #ffffff10; padding:4px 6px; border-radius:2px; color:var(--text-dim); }
.boon-stat-chip b{ color:var(--souls); }

/* ===== Stat panel ===== */
.stat-row{
  display:grid; grid-template-columns:1fr auto auto; gap:10px; align-items:center;
  position:relative; padding:7px 0; border-bottom:1px solid #1c1f24; font-family:'IBM Plex Mono',monospace; font-size:12.5px; cursor:help;
}
.stat-row:last-child{ border-bottom:none; }
.stat-row .label{ color:var(--text-dim); font-family:'Inter',sans-serif; font-size:12.5px; }
.stat-row .total{ text-align:right; min-width:70px; font-weight:600; color:var(--text); }
.stat-row .delta{ font-size:10.5px; }
.stat-tooltip{
  display:none; position:absolute; z-index:20; left:0; top:calc(100% - 1px); min-width:250px; max-width:340px;
  padding:9px 10px; background:#0d0f12; border:1px solid var(--spirit); border-radius:var(--radius);
  box-shadow:0 8px 20px #000b; color:var(--text-dim); font:10.5px/1.55 'IBM Plex Mono',monospace;
}
.stat-row:hover .stat-tooltip{ display:block; }
.stat-tooltip-title{ color:var(--text); font-weight:600; margin-bottom:4px; }
.stat-tooltip-line{ display:flex; justify-content:space-between; gap:16px; }
.stat-tooltip-line b{ color:var(--text); white-space:nowrap; }
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

.build-list{ margin-top:10px; display:grid; grid-template-columns:1fr 1fr; gap:5px; max-height:300px; overflow-y:auto; }
.souls-spent + .build-list{ display:none; }
.build-empty{ color:var(--text-faint); font-size:12px; font-style:italic; padding:10px 0; }
.build-list .build-empty{ grid-column:1 / -1; }
.build-item{
  display:flex; align-items:center; gap:8px; padding:6px 8px; background:var(--bg-panel-2);
  border-radius:var(--radius); border-left:2px solid var(--line); font-size:12px;
}
.build-item-icon{ width:22px; height:22px; object-fit:contain; flex-shrink:0; }
.build-item .nm{ flex:1; color:var(--text); font-weight:500; }
.build-item .cost{ color:var(--souls); font-family:'IBM Plex Mono',monospace; font-size:11px; }
.build-item .rm{ cursor:pointer; color:var(--text-faint); background:none; border:none; font-size:16px; line-height:1; padding:0 4px; }
.build-item .rm:hover{ color:var(--danger); }
.imbue-select{
  background:var(--bg-panel); border:1px solid var(--spirit-dim); color:var(--spirit);
  font-family:'IBM Plex Mono',monospace; font-size:10px; padding:2px 4px; border-radius:2px;
  max-width:110px; flex-shrink:0;
}
.tag.imbue-tag{ color:var(--spirit); border-color:var(--spirit-dim); }

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

.item-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:8px; }
.item-card{
  position:relative; background:var(--bg-panel-2); border:1px solid var(--line); border-radius:var(--radius);
  padding:10px 11px; cursor:pointer; transition:border-color .12s, transform .06s;
  border-left-width:3px; display:flex; flex-direction:column; justify-content:space-between;
}
.item-card:hover{ border-color:var(--text-faint); }
.item-card:active{ transform:scale(0.99); }
.item-card.added{ background:#171a1e; }
.item-card.disabled-card{ opacity:0.4; cursor:not-allowed; }
.item-card[data-cat="weapon"]{ border-left-color:var(--weapon-dim); }
.item-card[data-cat="vitality"]{ border-left-color:var(--vitality-dim); }
.item-card[data-cat="spirit"]{ border-left-color:var(--spirit-dim); }
.item-card.added[data-cat="weapon"]{ border-left-color:var(--weapon); }
.item-card.added[data-cat="vitality"]{ border-left-color:var(--vitality); }
.item-card.added[data-cat="spirit"]{ border-left-color:var(--spirit); }

.item-head{ display:flex; align-items:center; gap:8px; margin-bottom:6px; }
.item-img{ width:30px; height:30px; object-fit:contain; flex-shrink:0; background:#00000040; border-radius:2px; }
.item-head-info{ flex:1; overflow:hidden; }
.item-name{ font-family:'Rajdhani',sans-serif; font-weight:600; font-size:14.5px; line-height:1.2; color:var(--text); }
.item-cost{ font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--souls); white-space:nowrap; }
.item-effect{ font-size:11.5px; color:var(--text-dim); line-height:1.4; margin-bottom:6px; }
.item-hover-info{ display:none; position:absolute; z-index:25; left:8px; right:8px; top:calc(100% - 2px); padding:9px 10px; background:#0d0f12; border:1px solid var(--souls); border-radius:var(--radius); box-shadow:0 8px 20px #000b; color:var(--text-dim); font-size:11px; line-height:1.45; pointer-events:none; }
.item-card:hover .item-hover-info{ display:block; }
.item-tags{ display:flex; flex-wrap:wrap; gap:4px; margin-top:4px; }
.tag{
  font-family:'IBM Plex Mono',monospace; font-size:9.5px; padding:2px 6px; border-radius:2px;
  background:#00000055; color:var(--text-faint); border:1px solid #ffffff10;
}
.tag.active-tag{ color:var(--souls); border-color:#5c4c1f; }
.tag.cond-tag{ color:#e0925c; border-color:#5c3d1f; }
.tag.upgrade-tag{ color:var(--spirit); border-color:var(--spirit-dim); }
.tag.upgrade-tag.ready{ color:var(--souls); border-color:#5c4c1f; background:#1e1a10; }

/* ===== Hero Abilities Section ===== */
.abilities-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:10px; }
.ability-card{
  background:var(--bg-panel-2); border:1px solid var(--line); border-radius:var(--radius);
  position:relative; padding:10px 12px; display:flex; flex-direction:column; justify-content:space-between;
}
.ability-card.ability-locked{ border-color:#3a3030; }
.ability-lock-symbol{ position:absolute; top:8px; right:9px; color:var(--danger); font-size:18px; opacity:.9; }
.ability-meta{ margin:5px 0 7px; color:var(--text-dim); font:10.5px/1.45 'IBM Plex Mono',monospace; }
.ability-meta b{ color:var(--text); }
.ability-impact{ color:var(--vitality); }
.ability-stat-icon{ display:inline-flex; align-items:center; justify-content:center; width:16px; height:14px; color:var(--souls); font-size:13px; line-height:1; vertical-align:-1px; }
.ability-stat-line{ position:relative; cursor:help; }
.ability-stat-line:hover .stat-tooltip{ display:block; }
.ability-hover-info{ display:none; position:absolute; z-index:25; left:8px; right:8px; top:52px; padding:9px 10px; background:#0d0f12; border:1px solid var(--spirit); border-radius:var(--radius); box-shadow:0 8px 20px #000b; color:var(--text-dim); font-size:11px; line-height:1.45; pointer-events:none; }
.ability-head{ display:flex; align-items:center; gap:8px; margin-bottom:6px; position:relative; cursor:help; }
.ability-head:hover + .ability-hover-info{ display:block; }
.ability-img{ width:32px; height:32px; object-fit:contain; background:#00000060; border-radius:3px; flex-shrink:0; }
.ability-title-box{ flex:1; }
.ability-name{ font-family:'Rajdhani',sans-serif; font-weight:700; font-size:15px; color:var(--text); line-height:1.1; }
.ability-slot{ font-family:'IBM Plex Mono',monospace; font-size:10px; color:var(--spirit); text-transform:uppercase; margin-top:2px; }

.ability-upgrades{ display:flex; flex-direction:column; gap:4px; margin-top:6px; }
.ability-tier-btn{
  background:var(--bg-panel); border:1px solid var(--line); border-radius:2px;
  padding:5px 8px; font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:var(--text-faint);
  text-align:left; cursor:pointer; transition:.12s; display:flex; justify-content:space-between; align-items:center;
}
.ability-tier-btn:hover{ border-color:var(--text-dim); color:var(--text); }
.ability-tier-btn.unlocked{ border-color:var(--spirit); background:#1c1730; color:var(--text); }
.ability-tier-btn .t-badge{ font-weight:600; color:var(--spirit); }
.ability-tier-btn > span:last-child{ margin-left:10px; white-space:nowrap; }
.collapse-btn{ background:transparent; border:1px solid var(--line); color:var(--text-dim); border-radius:2px; padding:1px 7px; cursor:pointer; font:12px 'IBM Plex Mono',monospace; }
.collapse-btn:hover{ border-color:var(--spirit); color:var(--text); }
.shop-toggle{ display:flex; justify-content:flex-end; margin:-5px 0 3px; }

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
  position:absolute; top:0; bottom:0; width:1px; background:#ffffff28;
}
.invest-tick.hit{ background:#ffffffb0; }
.invest-tick.major{ background:var(--souls); width:2px; }
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
`;

const HEROES_API_URL = "https://api.deadlock-api.com/v1/assets/heroes";
const ITEMS_API_URL = "https://api.deadlock-api.com/v1/assets/items";

const FALLBACK_HEROES = [
 {n:"Abrams",role:"Tank · Brawler",h:800,r:1.5,d:3.6,m:6.4,s:3,levelUp:{hp:39,dmg:0.088,spirit:1.1}},
 {n:"Bebop",role:"Hook · Bomb",h:880,r:2.5,d:5.0,m:6.45,s:3,levelUp:{hp:39,dmg:0.088,spirit:1.1}},
 {n:"Dynamo",role:"Teamplay · Initiator",h:880,r:1.75,d:12.6,m:6.7,s:3,levelUp:{hp:39,dmg:0.088,spirit:1.1}},
 {n:"Grey Talon",role:"Precision · Hunter",h:780,r:1.5,d:23.5,m:6.3,s:4,levelUp:{hp:39,dmg:0.088,spirit:1.1}},
 {n:"Haze",role:"Assassin · Stealthy",h:730,r:2,d:5.3,m:8.2,s:3,levelUp:{hp:39,dmg:0.088,spirit:1.1}},
 {n:"Infernus",role:"Arsonist · Explosive",clip:27,bulletVelocity:660,h:830,r:2,d:5.5,m:6.7,s:3,levelUp:{hp:39,dmg:0.088,spirit:1.1}},
 {n:"Ivy",role:"Team-up · Disruptor",h:755,r:2,d:4.5,m:7.2,s:4,levelUp:{hp:39,dmg:0.088,spirit:1.1}},
 {n:"Kelvin",role:"Protector · Explorer",h:880,r:1,d:18.6,m:6.7,s:3,levelUp:{hp:39,dmg:0.088,spirit:1.1}},
 {n:"Lady Geist",role:"Lifesteal · Self Damage",h:880,r:1,d:20.7,m:6.3,s:3,levelUp:{hp:39,dmg:0.088,spirit:1.1}},
 {n:"Lash",role:"Initiator · High Flying",h:780,r:2,d:8.5,m:7.2,s:3,levelUp:{hp:39,dmg:0.088,spirit:1.1}},
 {n:"McGinnis",role:"Inventor · Support",h:780,r:2,d:6.4,m:6.7,s:2,levelUp:{hp:39,dmg:0.088,spirit:1.1}},
 {n:"Mirage",role:"Bodyguard · Traveller",h:730,r:1.5,d:14.8,m:7.0,s:3,levelUp:{hp:39,dmg:0.088,spirit:1.1}},
 {n:"Seven",role:"High Voltage · Merciless",h:730,r:1,d:10.8,m:6.7,s:3,levelUp:{hp:39,dmg:0.088,spirit:1.1}},
 {n:"Vindicta",role:"Sniper · Soaring",h:660,r:1,d:22.0,m:6.5,s:3,levelUp:{hp:39,dmg:0.088,spirit:1.1}},
];

const TIER_COST = {1:800,2:1600,3:3200,4:6400};

const FALLBACK_ITEMS = [
 {n:"Close Quarters",cat:"weapon",tier:1,effect:"Bullet falloff start range +10m · Weapon Damage: +6%",mods:{dmg:6}},
 {n:"Extended Magazine",cat:"weapon",tier:1,effect:"Max Ammo: +30% · Weapon Damage: +8%",mods:{clip:30,dmg:8}},
 {n:"Headshot Booster",cat:"weapon",tier:1,effect:"Headshot Bonus Damage: +45 · Weapon Damage: +5%",mods:{dmg:5},cond:"Bonus headshot damage triggers on headshots."},
 {n:"High-Velocity Rounds",cat:"weapon",tier:1,effect:"Bullet Velocity: +60% · Weapon Damage: +8%",mods:{dmg:8}},
 {n:"Monster Rounds",cat:"weapon",tier:1,effect:"Weapon Damage vs NPCs: +25% · Out of Combat Regen: +1 · Bullet Resist vs NPCs: +25%",mods:{regen:1},cond:"Bonus damage applies against non-hero targets."},
 {n:"Rapid Rounds",cat:"weapon",tier:1,effect:"Fire Rate: +8% · Weapon Damage: -2%",mods:{fireRate:8,dmg:-2}},
 {n:"Active Reload",cat:"weapon",tier:2,effect:"Max Ammo: +10% · Weapon Damage: +10% · Fire Rate on Timed Reload: +20%",mods:{clip:10,dmg:10},cond:"Triggers on a successful timed reload."},
 {n:"Mystic Shot",cat:"weapon",tier:2,effect:"Spirit Damage on Shot: +65 · Spirit Power: +6 · Weapon Damage: +5%",mods:{dmg:5,spirit:6}},
 {n:"Tesla Bullets",cat:"weapon",tier:3,effect:"Shock Damage: +33 · Proc Chance: +15% · Max Jumps: +4",mods:{}},
 {n:"Glass Cannon",cat:"weapon",tier:4,effect:"Weapon Damage: +70% · Spirit Power: +22 · Max Health: -150",mods:{dmg:70,spirit:22,hp:-150}},
 {n:"Extra Health",cat:"vitality",tier:1,effect:"Max Health: +175 · Weapon Damage: +5%",mods:{hp:175,dmg:5}},
 {n:"Extra Regen",cat:"vitality",tier:1,effect:"Health Regen: +3 · Max Health: +50",mods:{regen:3,hp:50}},
 {n:"Extra Stamina",cat:"vitality",tier:1,effect:"Stamina Charges: +1 · Stamina Recovery: +10% · Max Health: +35",mods:{stamina:1,hp:35}},
 {n:"Bullet Armor",cat:"vitality",tier:2,effect:"Bullet Resist: +20% · Weapon Damage: +6%",mods:{bulletArmor:20,dmg:6}},
 {n:"Spirit Armor",cat:"vitality",tier:2,effect:"Spirit Resist: +20% · Spirit Power: +6",mods:{spiritArmor:20,spirit:6}},
 {n:"Fortitude",cat:"vitality",tier:3,effect:"Max Health: +200 · Health Regen: +2 · Weapon Damage: +8%",mods:{hp:200,regen:2,dmg:8}},
 {n:"Extra Spirit",cat:"spirit",tier:1,effect:"Spirit Power: +10 · Max Health: +35",mods:{spirit:10,hp:35}},
 {n:"Compress Cooldown",cat:"spirit",tier:2,effect:"−Ability Cooldowns: +10% · Spirit Power: +6",mods:{cdr:10,spirit:6}},
 {n:"Superior Cooldown",cat:"spirit",tier:3,effect:"−Ability Cooldowns: +14% · Spirit Power: +12",mods:{cdr:14,spirit:12}},
 {n:"Boundless Spirit",cat:"spirit",tier:4,effect:"Spirit Power: +30 · Max Health: +100 · Health Regen: +3",mods:{spirit:30,hp:100,regen:3}},
];

const STAT_DEFS = [
 {k:"hp", label:"Max Health", unit:""},
 {k:"regen", label:"Health Regen /s", unit:""},
 {k:"dmg", label:"Bullet Damage", unit:""},
 {k:"spirit", label:"Spirit Power", unit:""},
 {k:"fireRate", label:"Fire Rate", unit:"%"},
 {k:"clip", label:"Clip Size", unit:""},
 {k:"bulletVelocity", label:"Bullet Velocity", unit:" m/s"},
 {k:"bulletArmor", label:"Bullet Resist", unit:"%"},
 {k:"spiritArmor", label:"Spirit Resist", unit:"%"},
 {k:"cdr", label:"Cooldown Reduction", unit:"%"},
 {k:"move", label:"Move Speed", unit:"m/s"},
 {k:"sprint", label:"Sprint Speed", unit:"m/s"},
 {k:"stamina", label:"Stamina Charges", unit:""},
];

const INVEST_BREAKPOINTS = [800, 1600, 2400, 3200, 4800, 6400, 8000, 11200, 16000, 22400, 28800];
const INVEST_MAJOR_BREAKPOINT = 4800;
const INVEST_CAP = 28800;
const INVEST_VALUES = {
  weapon:   [9, 12, 15, 18, 46, 54, 62, 74, 86, 100, 115],
  vitality: [9, 12, 15, 20, 38, 42, 46, 50, 54, 64, 70],
  spirit:   [7, 11, 15, 19, 38, 45, 52, 59, 66, 75, 100],
};
const INVEST_UNIT = { weapon:"%", vitality:"%", spirit:"" };
const INVEST_LABEL = { weapon:"Weapon Damage", vitality:"Bonus Health", spirit:"Spirit Power" };

// Hero progression is shared by every hero. These are the soul thresholds for
// levels 0 through 35; levels 0, 2, 4, and 7 award an ability unlock, while
// every other level awards an ability point (capped at 32).
const LEVEL_SOUL_THRESHOLDS = [600, 800, 1100, 1500, 2000, 2600, 3200, 3800, 4500, 5200, 5900, 6600, 7400, 8200, 9000, 9800, 10700, 11600, 12500, 13400, 14400, 15500, 16700, 18000, 19500, 21200, 23100, 25200, 27500, 30000, 32700, 35600, 38700, 42000, 45500, 49200];
const MAX_LEVEL = LEVEL_SOUL_THRESHOLDS.length - 1;
const MAX_ABILITY_POINTS = 32;
const ABILITY_UNLOCK_LEVELS = [0, 2, 4, 7];

function getHeroProgression(souls){
  const level = Math.max(0, LEVEL_SOUL_THRESHOLDS.reduce((currentLevel, threshold, index) => (
    Math.max(currentLevel, souls >= threshold ? index : -1)
  ), -1));
  const abilityUnlocks = ABILITY_UNLOCK_LEVELS.filter(unlockLevel => unlockLevel <= level).length;
  const abilityPoints = Math.min(
    MAX_ABILITY_POINTS,
    Math.max(0, level - ABILITY_UNLOCK_LEVELS.filter(unlockLevel => unlockLevel > 0 && unlockLevel <= level).length)
  );
  return { level, abilityUnlocks, abilityPoints };
}

function categorySpend(build, cat){
  return build.filter(it=>it.cat===cat).reduce((a,b)=>a+TIER_COST[b.tier],0);
}
function investmentBonus(cat, spend){
  let tierIndex = -1;
  for(let i=0;i<INVEST_BREAKPOINTS.length;i++){
    if(spend >= INVEST_BREAKPOINTS[i]) tierIndex = i;
  }
  const value = tierIndex===-1 ? 0 : INVEST_VALUES[cat][tierIndex];
  return { value, tierIndex };
}

function normalizeName(s){ return (s||"").toLowerCase().replace(/[^a-z0-9]/g,""); }
function getHeroTags(hero){
  if (hero?.tags?.length) return hero.tags;
  return (hero?.role || "Versatile fighter").split(/[·,|]/).map(tag => tag.trim()).filter(Boolean);
}
function buildFallbackIndex(list){
  const map = new Map();
  list.forEach(x=>map.set(normalizeName(x.n), x));
  return map;
}

function formatBonusText(propName, bonusVal) {
  const num = parseFloat(bonusVal);
  const sign = num > 0 ? "+" : "";
  const prettyName = propName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^Ability\s*/, '')
    .trim();

  if (propName.includes("Cooldown")) return `${sign}${num}s Cooldown`;
  if (propName.includes("Duration")) return `${sign}${num}s Duration`;
  if (propName.includes("Range") || propName.includes("Radius")) return `${sign}${num}m ${prettyName}`;
  if (propName.includes("Percent") || propName.includes("Pct")) return `${sign}${num}% ${prettyName}`;
  return `${sign}${num} ${prettyName}`;
}

function cleanApiText(value){
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// API description fields are usually { desc, quip, t3_desc } rather than a
// plain string, so a direct cleanApiText(obj) always comes back empty.
function getDescriptionText(source){
  if (typeof source === "string") return cleanApiText(source);
  if (source && typeof source === "object") {
    return cleanApiText(source.desc || source.description || source.lore || source.effect || "");
  }
  return "";
}

function findApiNumber(source, patterns){
  if (!source || typeof source !== "object") return null;
  for (const [key, value] of Object.entries(source)) {
    const keyText = key.toLowerCase().replace(/[^a-z]/g, "");
    if (patterns.some(pattern => keyText.includes(pattern))) {
      const numericValue = typeof value === "number" ? value : Number(value?.value ?? value);
      if (!isNaN(numericValue) && numericValue !== 0) return numericValue;
    }
    if (value && typeof value === "object") {
      const nested = findApiNumber(value, patterns);
      if (nested !== null) return nested;
    }
  }
  return null;
}

function findApiText(source, patterns){
  if (!source || typeof source !== "object") return "";
  for (const [key, value] of Object.entries(source)) {
    const keyText = key.toLowerCase().replace(/[^a-z]/g, "");
    if (patterns.some(pattern => keyText.includes(pattern)) && typeof value === "string") {
      const text = cleanApiText(value);
      if (text) return text;
    }
    if (value && typeof value === "object") {
      const nested = findApiText(value, patterns);
      if (nested) return nested;
    }
  }
  return "";
}

// Damage-carrying properties encode spirit/weapon scaling as a nested
// scale_function rather than a separate flat number, e.g.
// properties.DPS = { value: 22, scale_function: { specific_stat_scale_type: "ETechPower", stat_scale: 0.6 } }
// meaning DPS = 22 + 0.6 * SpiritPower. ETechPower is Deadlock's internal name
// for Spirit Power; EWeaponPower is the equivalent for weapon damage scaling.
function extractDamageStats(abilityObj){
  if (!abilityObj?.properties) return [];
  const results = [];
  for (const [key, prop] of Object.entries(abilityObj.properties)) {
    if (!prop || typeof prop !== "object") continue;
    const label = String(prop.label || "");
    const labelLower = label.toLowerCase();
    const looksLikeDamage = labelLower ? labelLower.includes("damage") : key.toLowerCase().includes("damage");
    if (!looksLikeDamage) continue;
    if (/threshold|resist|reduction|percent|\bpct\b/.test(labelLower)) continue;
    const base = Number(prop.value);
    if (isNaN(base) || base === 0) continue;
    const scaleType = prop.scale_function?.specific_stat_scale_type;
    const statScale = Number(prop.scale_function?.stat_scale) || 0;
    results.push({
      key,
      label: label || key.replace(/([A-Z])/g, " $1").trim(),
      base,
      spiritScale: scaleType === "ETechPower" ? statScale : 0,
      weaponScale: scaleType === "EWeaponPower" ? statScale : 0,
    });
  }
  return results.slice(0, 4);
}

// Source-engine weapon data reports bullet_speed in inches/s (1 Hammer unit = 1 inch);
// the UI shows the player-facing m/s value used on deadlock.wiki. Verified against
// deadlock.wiki's Hero Comparison Table across 37 heroes: raw/wiki ratio clusters at 39.37,
// i.e. the standard inches-per-metre conversion (1m = 39.3701 in), not a bespoke constant.
const HAMMER_UNITS_PER_METER = 39.3701;
function normalizeBulletVelocity(value){
  const numericValue = Number(value) || 0;
  return numericValue / HAMMER_UNITS_PER_METER;
}

// Some abilities spawn a projectile/turret/prop that persists on its own timer
// (e.g. Call Bell's "Bell Lifetime", Mini Turret's "Lifetime") — distinct from the
// ability's own cast/active AbilityDuration. These are reliably labeled "Lifetime"
// (unlike the property *key*, e.g. "ProjectileFuse", which varies per ability), so
// match on label text rather than key name.
function extractLifetimeStats(abilityObj){
  if (!abilityObj?.properties) return [];
  const results = [];
  for (const [key, prop] of Object.entries(abilityObj.properties)) {
    if (!prop || typeof prop !== "object") continue;
    if (!/lifetime/i.test(String(prop.label || ""))) continue;
    const value = Number(prop.value);
    if (isNaN(value) || value === 0) continue;
    if (prop.disable_value !== undefined && String(prop.disable_value) === String(prop.value)) continue;
    results.push({ key, label: prop.label, value });
  }
  return results.slice(0, 2);
}

function numOrNull(p){
  const n = Number(p?.value);
  return (p && !isNaN(n) && n !== 0) ? n : null;
}

// AbilityCooldown/AbilityCharges/AbilityCooldownBetweenCharge/AbilityDuration are the
// canonical property keys Deadlock uses across every ability *and* item that has its
// own cast timing — read them directly rather than fuzzy-matching key names, which
// risks grabbing an unrelated stat (e.g. a target debuff's own "...Duration" property).
function extractTimingStats(propsObj){
  const props = propsObj || {};
  return {
    cooldown: numOrNull(props.AbilityCooldown),
    duration: numOrNull(props.AbilityDuration),
    charges: numOrNull(props.AbilityCharges),
    chargeDelay: numOrNull(props.AbilityCooldownBetweenCharge),
  };
}

// Some items only affect one ability the player imbues them onto (chosen in-game),
// rather than every ability globally — encoded by a truthy `imbue` field on the raw item.
function isImbuedItem(rawItem){
  return !!rawItem?.imbue;
}

function imbueKey(item){
  return item.id ?? item.n;
}

// Imbued items apply their bonus to only whichever ability they're targeted at
// (defaulting to the hero's first ability slot until the player picks one);
// non-imbued items keep applying to every ability, as before.
function itemAppliesToAbility(item, abilityKey, imbueTargets, hero){
  if (!item.imbued) return true;
  const target = imbueTargets[imbueKey(item)] ?? hero?.abilities?.[0]?.key;
  return target === abilityKey;
}

// tooltip_sections' "innate" section lists properties that are always active. Other
// sections (usually "passive") have a loc_string, but that text is sometimes just a
// flat description of an unconditional passive (e.g. Superior Cooldown: "Reduces the
// Cooldown of your abilities") rather than an actual trigger. Only keep ones whose text
// reads like a real condition (Headshot Booster's "Your next headshot... deals bonus
// weapon damage", Opening Rounds' "...against enemies above 50% health").
const CONDITION_CUE_WORDS = /\b(if|when|while|after|next|below|above|upon|whenever|during|within)\b/i;
function extractConditionalEffects(rawItem){
  if (!Array.isArray(rawItem?.tooltip_sections)) return [];
  const results = [];
  rawItem.tooltip_sections.forEach(section => {
    if (section.section_type === "innate") return;
    (section.section_attributes || []).forEach(attr => {
      const condition = cleanApiText(attr.loc_string);
      if (!condition || !CONDITION_CUE_WORDS.test(condition)) return;
      const propKeys = [...(attr.important_properties || []), ...(attr.properties || [])];
      const stats = propKeys.map(propKey => {
        const propDef = rawItem.properties?.[propKey];
        const val = Number(propDef?.value);
        if (!propDef || isNaN(val) || val === 0) return null;
        const sign = val > 0 ? "+" : "";
        return { label: propDef.label || propKey, value: sign + val + (propDef.postfix || "") };
      }).filter(Boolean);
      results.push({ condition, stats });
    });
  });
  return results.slice(0, 3);
}

function extractAbilityMeta(abilityObj){
  const timing = extractTimingStats(abilityObj?.properties);
  return {
    description: getDescriptionText(abilityObj?.description) || cleanApiText(abilityObj?.ability_description || abilityObj?.desc || abilityObj?.effect) || findApiText(abilityObj, ["description", "desc", "abilitydescription", "lore", "effect", "tooltip", "details"]),
    ...timing,
    damageStats: extractDamageStats(abilityObj),
    lifetimeStats: extractLifetimeStats(abilityObj),
  };
}

async function fetchDeadlockData(signal){
  const heroFallbackIdx = buildFallbackIndex(FALLBACK_HEROES);
  const itemFallbackIdx = buildFallbackIndex(FALLBACK_ITEMS);

  try {
    const [heroRes, itemRes] = await Promise.all([
      fetch(HEROES_API_URL, { signal }),
      fetch(ITEMS_API_URL, { signal }),
    ]);
    if(!heroRes.ok || !itemRes.ok) throw new Error(`API responded ${heroRes.status}/${itemRes.status}`);

    const heroRaw = await heroRes.json();
    const itemRaw = await itemRes.json();

    const rawHeroesList = Array.isArray(heroRaw) ? heroRaw : (heroRaw.heroes || heroRaw.data || []);
    const rawItemsList = Array.isArray(itemRaw) ? itemRaw : (itemRaw.items || itemRaw.data || []);

    const itemByClassName = new Map();
    rawItemsList.forEach(i => itemByClassName.set(i.class_name, i));

    // Exclude disabled, unshopable, in_development items (e.g. upgrade_aoe_tech_shield)
    const validMainItems = rawItemsList.filter(i => {
      if (i.disabled === true) return false;
      if (i.shopable === false) return false;
      if (i.in_development === true) return false;
      if (i.name && i.name.startsWith('upgrade_') && i.name.includes('_test')) return false;
      if (!i.item_tier || i.item_tier < 1 || i.item_tier > 4) return false;
      if (!i.item_slot_type && i.type !== 'upgrade') return false;
      return true;
    });

    const heroes = rawHeroesList
      .filter(h => h.player_selectable !== false && !h.disabled)
      .map(h => {
        const match = heroFallbackIdx.get(normalizeName(h.name));
        const weaponClass = h.items?.weapon_primary;
        const weaponItem = weaponClass ? itemByClassName.get(weaponClass) : null;
        const wInfo = weaponItem?.weapon_info || {};

        const maxHp = h.starting_stats?.max_health?.value ?? match?.h ?? 700;
        const regen = h.starting_stats?.base_health_regen?.value ?? match?.r ?? 1.5;
        const move = h.starting_stats?.max_move_speed?.value ?? match?.m ?? 7;
        const stamina = h.starting_stats?.stamina?.value ?? match?.s ?? 3;
        const bulletDmg = wInfo.bullet_damage ?? wInfo.damage_per_shot ?? match?.d ?? 10;
        const clipSize = findApiNumber(wInfo, ["clipsize", "clipcapacity"]) || findApiNumber(h.starting_stats, ["clipsize", "clipcapacity"]) || match?.clip || 0;
        const rawBulletVelocity = findApiNumber(wInfo, ["bulletvelocity", "bulletspeed", "projectilespeed"]) || findApiNumber(h.starting_stats, ["bulletvelocity", "bulletspeed"]);
        // Only raw Hammer-unit values from the API need converting — the fallback
        // snapshot's bulletVelocity constants are already stored in m/s.
        const bulletVelocity = rawBulletVelocity ? normalizeBulletVelocity(rawBulletVelocity) : (match?.bulletVelocity || 0);
        // Sprint Speed is a standalone bonus (m/s) added on top of Move Speed while
        // sprinting, not a multiplier — matches deadlock.wiki's per-hero values exactly.
        const sprintSpeed = h.starting_stats?.sprint_speed?.value ?? match?.sprint ?? 1.6;
        // Some heroes have an innate (often negative) resistance baked into their kit,
        // e.g. Pocket's -15% Spirit Resist — surface it instead of assuming 0.
        const bulletArmor = Number(h.starting_stats?.bullet_armor_damage_reduction?.value) || 0;
        const spiritArmor = Number(h.starting_stats?.tech_armor_damage_reduction?.value) || 0;
        const roleCandidate = h.description?.role || h.description?.playstyle || match?.role || "";
        const role = !roleCandidate || roleCandidate.trim().toLowerCase() === "hero"
          ? (match?.role || "Versatile fighter")
          : roleCandidate;
        const tags = (Array.isArray(h.tags) ? h.tags : (Array.isArray(h.description?.tags) ? h.description.tags : []))
          .map(tag => typeof tag === "string" ? tag : tag?.name).filter(Boolean);

        // Map 4 Signature Abilities
        const signatureKeys = ['signature1', 'signature2', 'signature3', 'signature4'];
        const signatureAbilities = signatureKeys.map((key, idx) => {
          const className = h.items?.[key];
          const abilityObj = className ? itemByClassName.get(className) : null;
          const name = abilityObj?.name || `Ability ${idx + 1}`;
          const meta = extractAbilityMeta(abilityObj);
          const fallbackDescription = name === "Call Bell"
            ? "Throw out a call bell that deals spirit damage on impact. After a short delay it explodes, dealing additional spirit damage and causing affected enemies to suffer reduced weapon accuracy and movement slow. Can be shot to detonate early."
            : "";

          const upgrades = (abilityObj?.upgrades || []).map((u, uIdx) => {
            const bonuses = (u.property_upgrades || []).map(pu => ({
              prop: pu.name,
              bonus: parseFloat(pu.bonus) || 0,
              // scale_stat_filter + upgrade_type (e.g. "ETechPower"/"EAddToScale") mean
              // this upgrade adds to the ability's spirit/weapon scaling ratio rather
              // than a flat amount of the stat itself.
              scaleFilter: pu.scale_stat_filter || null,
              scaleType: pu.upgrade_type || null,
              formatted: formatBonusText(pu.name, pu.bonus)
            }));
            return {
              tier: uIdx + 1,
              apCost: uIdx === 0 ? 1 : (uIdx === 1 ? 2 : 5),
              bonuses
            };
          });

          return {
            key,
            slot: `Ability ${idx + 1}`,
            name,
            image: abilityObj?.image || abilityObj?.shop_image,
            description: meta.description || fallbackDescription,
            cooldown: meta.cooldown ?? (name === "Call Bell" ? 18 : null),
            duration: meta.duration ?? (name === "Call Bell" ? 4 : null),
            charges: meta.charges ?? (name === "Call Bell" ? 1 : null),
            chargeDelay: meta.chargeDelay,
            damageStats: meta.damageStats,
            lifetimeStats: meta.lifetimeStats,
            upgrades
          };
        });

        const levelUp = {
          hp: h.standard_level_up_upgrades?.MODIFIER_VALUE_BASE_HEALTH_FROM_LEVEL || 39,
          dmg: h.standard_level_up_upgrades?.MODIFIER_VALUE_BASE_BULLET_DAMAGE_FROM_LEVEL || 0.088,
          spirit: h.standard_level_up_upgrades?.MODIFIER_VALUE_TECH_POWER || 1.1,
          melee: h.standard_level_up_upgrades?.MODIFIER_VALUE_BASE_MELEE_DAMAGE_FROM_LEVEL || 1.58
        };

        return {
          id: h.id,
          n: h.name,
          role: role.length > 40 ? role.slice(0, 37) + '...' : role,
          tags: tags.length ? tags.slice(0, 4) : role.split(/[·,|]/).map(tag => tag.trim()).filter(Boolean).slice(0, 3),
          description: cleanApiText(h.description?.description || h.description?.lore || h.description?.playstyle),
          h: Number(maxHp) || 700,
          r: Number(regen) || 1.5,
          d: Number(bulletDmg) || 10,
          clip: Number(clipSize) || 0,
          bulletVelocity: Number(bulletVelocity) || 0,
          m: Number(move) || 7,
          s: Number(stamina) || 3,
          sprint: Number(sprintSpeed) || 1.6,
          bulletArmor,
          spiritArmor,
          image: h.images?.card_image || h.images?.icon_hero_card || h.images?.small_image,
          icon: h.images?.icon_image_small || h.images?.minimap_image || h.images?.small_image,
          abilities: signatureAbilities,
          levelUp,
          live: true
        };
      });

    const items = validMainItems.map(i => {
      const match = itemFallbackIdx.get(normalizeName(i.name));
      let cat = (i.item_slot_type || '').toLowerCase();
      if (cat.includes('weapon')) cat = 'weapon';
      else if (cat.includes('armor') || cat.includes('vitality')) cat = 'vitality';
      else if (cat.includes('tech') || cat.includes('spirit')) cat = 'spirit';
      else cat = match?.cat || 'weapon';

      const tier = Number(i.item_tier);
      const cost = i.cost || TIER_COST[tier] || 800;

      const mods = Object.assign({}, match?.mods || {});
      if (match?.n === "Extended Magazine" || match?.n === "Active Reload") {
        if (mods.clip !== undefined) {
          mods.clipPct = mods.clip;
          delete mods.clip;
        }
      }
      const statDisplays = [];

      if (i.properties) {
        Object.entries(i.properties).forEach(([k, p]) => {
          if (!p || p.value === undefined || !p.label) return;
          if (p.value === '0' || p.value === '0.0' || p.value === '-1' || p.value === '-1.0') return;
          if (p.disable_value !== undefined && String(p.disable_value) === String(p.value)) return;
          const val = Number(p.value);
          if (isNaN(val) || val === 0) return;

          if (['BonusHealth', 'MaxHealth'].includes(k)) mods.hp = val;
          else if (['BaseHealthRegen', 'HealthRegen', 'Regeneration', 'OutOfCombatHealthRegen'].includes(k)) mods.regen = val;
          else if (['BaseAttackDamagePercent', 'WeaponPower'].includes(k)) mods.dmg = val;
          else if (['TechPower', 'SpiritPower', 'SpiritPowerInnate'].includes(k)) mods.spirit = val;
          else if (['BonusFireRate', 'FireRate'].includes(k)) mods.fireRate = val;
          else if (['BonusClipSizePercent'].includes(k)) mods.clipPct = val;
          else if (['BonusClipSize', 'ClipSize'].includes(k)) mods.clip = val;
          else if (['BulletArmorDamageReduction', 'BulletResist', 'BulletArmor'].includes(k)) mods.bulletArmor = val;
          else if (['TechArmorDamageReduction', 'SpiritResist', 'TechArmor'].includes(k)) mods.spiritArmor = val;
          else if (['AbilityCooldownReduction', 'TechCooldown'].includes(k)) mods.cdr = Math.abs(val);
          else if (['ImbuedBonusDuration', 'BonusAbilityDurationPercent', 'AbilityDuration'].includes(k)) mods.abilityDuration = val;
          else if (['AbilityCharges', 'BonusAbilityCharges', 'AdditionalAbilityCharges', 'MaxAbilityCharges'].includes(k)) mods.abilityCharges = val;
          else if (['Stamina', 'BonusStamina'].includes(k)) mods.stamina = val;

          const sign = val > 0 ? '+' : '';
          const postfix = p.postfix || '';
          statDisplays.push({ label: p.label, value: sign + val + postfix });
        });
      }

      let description = getDescriptionText(i.description) || match?.effect || '';
      if (!description) {
        if (statDisplays.length > 0) {
          description = statDisplays.map(s => `${s.label}: ${s.value}`).join(' · ');
        } else {
          description = "Deadlock shop upgrade.";
        }
      }

      // Some items are upgrades of a cheaper item (e.g. Tankbuster upgrades from
      // Mystic Burst) — component_items holds the class_names of those prerequisites.
      const upgradesFrom = (i.component_items || [])
        .map(className => itemByClassName.get(className)?.name)
        .filter(Boolean);

      const isActive = i.is_active_item !== undefined ? !!i.is_active_item : (match?.active || false);
      const activeTiming = isActive ? extractTimingStats(i.properties) : {};
      const conditionalEffects = extractConditionalEffects(i);

      return {
        id: i.id,
        n: i.name,
        cat,
        tier,
        cost,
        effect: description,
        active: isActive,
        cond: match?.cond || conditionalEffects[0]?.condition,
        image: i.shop_image || i.image || i.shop_image_webp,
        mods,
        statDisplays: statDisplays.slice(0, 4),
        tags: match?.tags || [cat.toUpperCase(), 'T' + tier],
        upgradesFrom,
        upgradesInto: [],
        imbued: isImbuedItem(i),
        activeCooldown: activeTiming.cooldown,
        activeDuration: activeTiming.duration,
        activeCharges: activeTiming.charges,
        activeChargeDelay: activeTiming.chargeDelay,
        conditionalEffects,
        live: true
      };
    });

    // Reverse the upgradesFrom relationship so a base item also knows what it upgrades into.
    const upgradesIntoMap = new Map();
    items.forEach(it => {
      it.upgradesFrom.forEach(baseName => {
        if (!upgradesIntoMap.has(baseName)) upgradesIntoMap.set(baseName, []);
        upgradesIntoMap.get(baseName).push(it.n);
      });
    });
    items.forEach(it => { it.upgradesInto = upgradesIntoMap.get(it.n) || []; });

    if (heroes.length === 0 || items.length === 0) throw new Error("API returned empty datasets");

    return { heroes, items, source: "live" };
  } catch (err) {
    console.warn("[SoulLedger] Live API fetch failed, falling back to snapshot:", err.message);
    return { heroes: FALLBACK_HEROES, items: FALLBACK_ITEMS, source: "fallback", error: err.message };
  }
}

function baseValue(hero, k){
  switch(k){
    case "hp": return hero.h;
    case "regen": return hero.r;
    case "dmg": return hero.d;
    case "spirit": return 0;
    case "fireRate": return 100;
    case "clip": return hero.clip || 0;
    case "bulletVelocity": return hero.bulletVelocity || 0;
    case "bulletArmor": return hero.bulletArmor || 0;
    case "spiritArmor": return hero.spiritArmor || 0;
    case "cdr": return 0;
    case "move": return hero.m;
    case "sprint": return hero.sprint ?? 1.6;
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

function computeAbilityStatDeltas(unlockedAbilityTiers, unlockedAbilitySlots, selectedHero) {
  const deltas = { hp: 0, regen: 0, dmg: 0, spirit: 0, fireRate: 0, clip: 0, clipPct: 0, bulletArmor: 0, spiritArmor: 0, cdr: 0, move: 0, sprint: 0, stamina: 0 };
  if (!selectedHero || !selectedHero.abilities) return deltas;

  selectedHero.abilities.forEach(ab => {
    if (!unlockedAbilitySlots[ab.key]) return;
    (ab.upgrades || []).forEach(u => {
      const key = `${ab.key}_T${u.tier}`;
      if (unlockedAbilityTiers[key]) {
        u.bonuses.forEach(b => {
          const val = Number(b.bonus);
          if (isNaN(val) || val === 0) return;
          const p = b.prop;

          if (['BonusHealth', 'MaxHealth', 'BonusMaxHealth'].includes(p)) deltas.hp += val;
          else if (['BonusHealthRegen', 'BaseHealthRegen', 'HealthRegen'].includes(p)) deltas.regen += val;
          else if (['BaseAttackDamagePercent', 'WeaponPower', 'BuffBaseWeaponPct', 'BonusDamagePercent'].includes(p)) deltas.dmg += val;
          else if (['TechPower', 'SpiritPower', 'BonusSpirit', 'BonusSpiritPower'].includes(p)) deltas.spirit += val;
          else if (['BonusFireRate', 'FireRate', 'AttackSpeedMult'].includes(p)) deltas.fireRate += val;
          else if (['BonusClipSizePercent'].includes(p)) deltas.clipPct += val;
          else if (['BonusClipSize'].includes(p)) deltas.clip += val;
          else if (['BulletArmor', 'BulletResist', 'BulletArmorReduction'].includes(p)) deltas.bulletArmor += val;
          else if (['SpiritArmor', 'SpiritResist', 'TechResist', 'TechArmor'].includes(p)) deltas.spiritArmor += val;
          else if (['BonusMoveSpeed', 'MoveSpeedMax', 'BonusMoveSpeedPercent'].includes(p)) deltas.move += val;
          else if (['BonusSprintSpeed'].includes(p)) deltas.sprint += val;
          else if (['Stamina', 'BonusStamina'].includes(p)) deltas.stamina += val;
          else if (['AbilityCooldown', 'AbilityCooldownReduction'].includes(p)) deltas.cdr += Math.abs(val);
        });
      }
    });
  });
  return deltas;
}

function computeFinalDeltas(hero, build, unlockedBoons, unlockedAbilityTiers, unlockedAbilitySlots){
  const raw = computeRawTotals(build);
  const inv = computeInvestments(build);
  const abDeltas = computeAbilityStatDeltas(unlockedAbilityTiers, unlockedAbilitySlots, hero);
  const final = Object.assign({}, raw);

  // Boon stat increases synced directly to total item souls
  const boonHpBonus = (hero.levelUp?.hp || 39) * unlockedBoons;
  const boonDmgPct = (hero.levelUp?.dmg || 0.088) * unlockedBoons * 100;
  const boonSpiritBonus = (hero.levelUp?.spirit || 1.1) * unlockedBoons;

  const baseDmg = baseValue(hero, 'dmg');
  const dmgBeforeInvest = baseDmg + raw.dmg + (baseDmg * (boonDmgPct / 100)) + abDeltas.dmg;
  const weaponBonusDmg = dmgBeforeInvest * (inv.weapon.value/100);

  final.dmg = raw.dmg + (baseDmg * (boonDmgPct / 100)) + abDeltas.dmg + weaponBonusDmg;
  final.hp = raw.hp + boonHpBonus + abDeltas.hp + ((raw.hp + boonHpBonus + abDeltas.hp) * (inv.vitality.value/100));
  final.spirit = raw.spirit + boonSpiritBonus + abDeltas.spirit + inv.spirit.value;
  final.clip = raw.clip + (baseValue(hero, 'clip') * (raw.clipPct / 100)) + abDeltas.clip + (baseValue(hero, 'clip') * (abDeltas.clipPct / 100));
  final.cdr = raw.cdr + abDeltas.cdr;
  final.move = raw.move + abDeltas.move;
  final.sprint = raw.sprint + abDeltas.sprint;
  final.stamina = raw.stamina + abDeltas.stamina;
  final.fireRate = raw.fireRate + abDeltas.fireRate;
  final.bulletArmor = raw.bulletArmor + abDeltas.bulletArmor;
  final.spiritArmor = raw.spiritArmor + abDeltas.spiritArmor;

  return { raw, inv, abDeltas, final, boons: { count: unlockedBoons, hp: boonHpBonus, dmgPct: boonDmgPct, spirit: boonSpiritBonus } };
}

// Reusable calculation-breakdown popover for ability stat lines, styled to match
// the left-panel stat-sheet tooltips (.stat-tooltip).
function CalcTooltip({ title, lines }){
  return (
    <div className="stat-tooltip">
      <div className="stat-tooltip-title">{title}</div>
      {lines.filter(Boolean).map((line, i) => (
        <div className="stat-tooltip-line" key={i}>
          <span>{line.label}</span><b>{line.value}</b>
        </div>
      ))}
    </div>
  );
}

export default function SoulLedger(){
  const [heroes, setHeroes] = useState(FALLBACK_HEROES);
  const [items, setItems] = useState(FALLBACK_ITEMS);
  const [dataSource, setDataSource] = useState("loading");
  const [dataError, setDataError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [selectedHero, setSelectedHero] = useState(FALLBACK_HEROES[0]);
  const [build, setBuild] = useState([]);
  const [catFilter, setCatFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState(0);
  const [heroQuery, setHeroQuery] = useState("");
  const [itemQuery, setItemQuery] = useState("");
  const [collapsedSections, setCollapsedSections] = useState({});

  const [walkersDestroyed, setWalkersDestroyed] = useState(0);
  const [unlockedAbilitySlots, setUnlockedAbilitySlots] = useState({});
  const [unlockedAbilityTiers, setUnlockedAbilityTiers] = useState({});
  const [slotLimitWarning, setSlotLimitWarning] = useState("");
  // Which ability an imbue-type item (e.g. Compress Cooldown) has been imbued onto -
  // keyed by item id (falls back to name for fallback-snapshot items without an id).
  const [imbueTargets, setImbueTargets] = useState({});

  function toggleSection(section){
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  }

  function loadData(){
    const controller = new AbortController();
    setDataSource("loading");
    setIsRefreshing(true);
    fetchDeadlockData(controller.signal).then(res=>{
      const loadedHeroes = res.heroes.length ? res.heroes : FALLBACK_HEROES;
      const loadedItems = res.items.length ? res.items : FALLBACK_ITEMS;
      setHeroes(loadedHeroes);
      setItems(loadedItems);
      setDataSource(res.source);
      setDataError(res.error || null);
      setSelectedHero(prev => loadedHeroes.find(h=>h.n===prev?.n) || loadedHeroes[0]);
      setBuild(prev => prev.map(oldItem => loadedItems.find(item => item.id === oldItem.id || item.n === oldItem.n)).filter(Boolean));
      setIsRefreshing(false);
    });
    return ()=>controller.abort();
  }

  useEffect(()=>{
    const cleanup = loadData();
    const refreshTimer = setInterval(loadData, 30 * 60 * 1000);
    return ()=>{
      cleanup?.();
      clearInterval(refreshTimer);
    };
  },[]);

  // Item capacity: 9 base slots + up to 3 extra from Walker kills = 12 max
  const maxItems = useMemo(() => 9 + Math.min(3, Math.max(0, walkersDestroyed)), [walkersDestroyed]);
  const buildFull = build.length >= maxItems;

  function pickHero(h){
    setSelectedHero(h);
    setBuild([]);
    setUnlockedAbilitySlots({});
    setUnlockedAbilityTiers({});
    setSlotLimitWarning("");
    setImbueTargets({});
  }

  function toggleItem(it){
    setSlotLimitWarning("");
    if (build.includes(it)) {
      setBuild(prev => prev.filter(b=>b!==it));
      return;
    }

    if (it.active && build.filter(item => item.active).length >= 4) {
      setSlotLimitWarning("Active item limit reached (4 maximum). Remove an active item before adding another.");
      return;
    }

    // A base item and anything it upgrades into are mutually exclusive - owning
    // the upgrade already supersedes the base, so block re-buying the base.
    // (Multiple different upgrades of the same base, e.g. Arcane Surge + Stamina
    // Mastery both from Extra Stamina, are still allowed to coexist.)
    const ownedUpgrades = (it.upgradesInto || []).filter(name => build.some(b => b.n === name));
    if (ownedUpgrades.length > 0) {
      setSlotLimitWarning(`You already own ${ownedUpgrades.join(', ')}, which upgrades from ${it.n} — remove it first if you want the base item instead.`);
      return;
    }

    // Upgrading: if the build already owns one or more of this item's component
    // items, they get consumed into the upgrade's slot instead of costing a new one
    // (mirrors how upgrades absorb their prerequisite item in-game).
    const ownedComponentNames = (it.upgradesFrom || []).filter(name => build.some(b => b.n === name));
    if (ownedComponentNames.length > 0) {
      setBuild(prev => {
        const next = [...prev];
        ownedComponentNames.forEach(name => {
          const idx = next.findIndex(b => b.n === name);
          if (idx !== -1) next.splice(idx, 1);
        });
        next.push(it);
        return next;
      });
      return;
    }

    // Enforce total item cap (9 base + Walker kills)
    if (build.length >= maxItems) {
      setSlotLimitWarning(`Build full! (${maxItems} items max). Destroy a Walker to unlock more slots, or remove an item.`);
      return;
    }

    setBuild(prev => [...prev, it]);
  }

  function removeAt(idx){
    setSlotLimitWarning("");
    setBuild(prev => prev.filter((_,i)=>i!==idx));
  }

  function toggleAbilityUnlock(abilityIndex) {
    const ability = selectedHero?.abilities?.[abilityIndex];
    if (!ability) return;
    setUnlockedAbilitySlots(prev => {
      const isUnlocked = !!prev[ability.key];
      if (isUnlocked) {
        const next = { ...prev, [ability.key]: false };
        setUnlockedAbilityTiers(current => {
          const cleared = { ...current };
          (ability.upgrades || []).forEach(u => { cleared[`${ability.key}_T${u.tier}`] = false; });
          return cleared;
        });
        return next;
      }
      if (Object.values(prev).filter(Boolean).length >= abilityUnlocks) return prev;
      if (abilityIndex === 3 && level < 7) return prev;
      return { ...prev, [ability.key]: true };
    });
  }

  // Ability tiers cost their listed AP. T2 requires T1, T3 requires T2.
  function toggleAbilityTier(key, tier) {
    const tierKey = `${key}_T${tier}`;
    setUnlockedAbilityTiers(prev => {
      const isCurrentlyUnlocked = !!prev[tierKey];
      const abilityIndex = selectedHero?.abilities?.findIndex(ab => ab.key === key) ?? -1;

      // If unlocking: check prerequisites and AP budget
      if (!isCurrentlyUnlocked) {
        if (abilityIndex < 0 || !unlockedAbilitySlots[key]) return prev;
        // Prerequisite: previous tiers must be unlocked
        if (tier >= 2 && !prev[`${key}_T${tier - 1}`]) return prev;

        const upgrade = selectedHero.abilities[abilityIndex].upgrades?.find(u => u.tier === tier);
        const cost = upgrade?.apCost || 1;
        if (spentAP + cost > abilityPoints) return prev;

        return { ...prev, [tierKey]: true };
      }

      // If un-unlocking: also remove higher tiers that depend on this one
      const next = { ...prev, [tierKey]: false };
      for (let t = tier + 1; t <= 3; t++) {
        next[`${key}_T${t}`] = false;
      }
      return next;
    });
  }

  // Soul Boons are automatically synced to total item soul value
  const buildSouls = useMemo(()=>build.reduce((a,b)=>a+TIER_COST[b.tier],0), [build]);
  const progression = useMemo(() => getHeroProgression(buildSouls), [buildSouls]);
  const { level, abilityUnlocks, abilityPoints } = progression;
  const displayLevel = Math.max(0, level);
  const unlockedBoons = level;

  // The ultimate is granted automatically as soon as level 7 is reached.
  useEffect(() => {
    const ultimate = selectedHero?.abilities?.[3];
    if (level >= 7 && ultimate && !unlockedAbilitySlots[ultimate.key]) {
      setUnlockedAbilitySlots(prev => ({ ...prev, [ultimate.key]: true }));
    }
  }, [level, selectedHero, unlockedAbilitySlots]);

  const spentAP = useMemo(() => selectedHero?.abilities?.reduce((total, ab) => (
    total + (ab.upgrades || []).reduce((abilityTotal, u) => (
      abilityTotal + (unlockedAbilityTiers[`${ab.key}_T${u.tier}`] ? (u.apCost || 1) : 0)
    ), 0)
  ), 0) || 0, [selectedHero, unlockedAbilityTiers]);
  const availableAP = Math.max(0, abilityPoints - spentAP);

  const filteredHeroes = useMemo(()=>{
    const q = heroQuery.trim().toLowerCase();
    return heroes.filter(h=>h.n.toLowerCase().includes(q));
  },[heroes, heroQuery]);

  const { inv, boons, abDeltas, final: totals } = useMemo(
    ()=>computeFinalDeltas(selectedHero, build, unlockedBoons, unlockedAbilityTiers, unlockedAbilitySlots),
    [selectedHero, build, unlockedBoons, unlockedAbilityTiers, unlockedAbilitySlots]
  );

  const filteredItemsByTier = useMemo(()=>{
    const q = itemQuery.trim().toLowerCase();
    const pool = items.filter(it=>{
      if(catFilter!=="all" && it.cat!==catFilter) return false;
      if(tierFilter!==0 && it.tier!==tierFilter) return false;
      const searchableText = [
        it.n, it.effect, it.cond, ...(it.tags || []),
        ...(it.statDisplays || []).flatMap(stat => [stat.label, stat.value])
      ].filter(Boolean).join(" ").toLowerCase();
      if(q && !searchableText.includes(q)) return false;
      return true;
    });
    const byTier = {1:[],2:[],3:[],4:[]};
    pool.forEach(it=>byTier[it.tier].push(it));
    return byTier;
  },[items, catFilter, tierFilter, itemQuery]);

  const conditionalItems = useMemo(()=>build.filter(it=>it.active || it.cond), [build]);

  function getStatBreakdown(statKey, statDef){
    const lines = [{ label: `Base ${selectedHero.n}`, value: baseValue(selectedHero, statKey) }];
    const raw = computeRawTotals(build);
    const boonHpBonus = (selectedHero.levelUp?.hp || 39) * unlockedBoons;
    const boonDmgPct = (selectedHero.levelUp?.dmg || 0.088) * unlockedBoons * 100;
    const boonSpiritBonus = (selectedHero.levelUp?.spirit || 1.1) * unlockedBoons;

    build.forEach(item => {
      const value = item.mods?.[statKey] || 0;
      if (value) lines.push({ label: item.n, value });
    });
    if (statKey === "hp" && boonHpBonus) lines.push({ label: "Soul boons", value: boonHpBonus });
    if (statKey === "dmg" && boonDmgPct) lines.push({ label: "Soul boons", value: baseValue(selectedHero, "dmg") * (boonDmgPct / 100) });
    if (statKey === "spirit" && boonSpiritBonus) lines.push({ label: "Soul boons", value: boonSpiritBonus });

    selectedHero.abilities?.forEach(ab => {
      if (!unlockedAbilitySlots[ab.key]) return;
      (ab.upgrades || []).forEach(u => {
        if (!unlockedAbilityTiers[`${ab.key}_T${u.tier}`]) return;
        u.bonuses.forEach(b => {
          const value = Number(b.bonus);
          const abilityStat = ['BonusHealth', 'MaxHealth', 'BonusMaxHealth'].includes(b.prop) ? 'hp'
            : ['BonusHealthRegen', 'BaseHealthRegen', 'HealthRegen'].includes(b.prop) ? 'regen'
            : ['BaseAttackDamagePercent', 'WeaponPower', 'BuffBaseWeaponPct', 'BonusDamagePercent'].includes(b.prop) ? 'dmg'
            : ['TechPower', 'SpiritPower', 'BonusSpirit', 'BonusSpiritPower'].includes(b.prop) ? 'spirit'
            : ['BonusFireRate', 'FireRate', 'AttackSpeedMult'].includes(b.prop) ? 'fireRate'
            : ['BonusClipSizePercent', 'BonusClipSize'].includes(b.prop) ? 'clip'
            : ['BulletArmor', 'BulletResist', 'BulletArmorReduction'].includes(b.prop) ? 'bulletArmor'
            : ['SpiritArmor', 'SpiritResist', 'TechResist', 'TechArmor'].includes(b.prop) ? 'spiritArmor'
            : ['BonusMoveSpeed', 'MoveSpeedMax', 'BonusMoveSpeedPercent'].includes(b.prop) ? 'move'
            : ['BonusSprintSpeed'].includes(b.prop) ? 'sprint'
            : ['Stamina', 'BonusStamina'].includes(b.prop) ? 'stamina'
            : ['AbilityCooldown', 'AbilityCooldownReduction'].includes(b.prop) ? 'cdr' : null;
          if (abilityStat === statKey && !isNaN(value) && value !== 0) {
            lines.push({ label: `${ab.name} · T${u.tier}`, value, text: b.formatted });
          }
        });
      });
    });

    if (statKey === "dmg" && inv.weapon.value) {
      const beforeInvestment = baseValue(selectedHero, "dmg") + raw.dmg + (baseValue(selectedHero, "dmg") * (boonDmgPct / 100)) + abDeltas.dmg;
      lines.push({ label: `Soul investment · Weapon (${inv.weapon.value}%)`, value: beforeInvestment * inv.weapon.value / 100 });
    }
    if (statKey === "hp" && inv.vitality.value) {
      lines.push({ label: `Soul investment · Vitality (${inv.vitality.value}%)`, value: (raw.hp + boonHpBonus + abDeltas.hp) * inv.vitality.value / 100 });
    }
    if (statKey === "spirit" && inv.spirit.value) lines.push({ label: `Soul investment · Spirit`, value: inv.spirit.value });
    return lines.map(line => ({ ...line, display: line.text || `${line.value >= 0 ? "+" : ""}${round1(line.value)}${statDef.unit}` }));
  }

  return (
    <div style={{minHeight:"100vh", background:"var(--bg)"}}>
      <style>{CSS_STYLES}</style>
      <div className="app">

        <header className="top">
          <div className="brand">
            <div className="mark">SOUL<span>·</span>LEDGER</div>
            <div className="sub">DEADLOCK ITEM &amp; STAT SIMULATOR</div>
          </div>
          <div className="header-actions">
            <button className="sync-btn" onClick={loadData} disabled={isRefreshing}>
              🔄 {isRefreshing ? "SYNCING..." : "RE-SYNC API"}
            </button>
            <div className="build-tag">
              <span className={"data-badge "+dataSource}>
                {dataSource==="loading" && "● fetching live data..."}
                {dataSource==="live" && `● live from api.deadlock-api.com (${heroes.length} heroes · ${items.length} main items)`}
                {dataSource==="fallback" && "● offline — using bundled snapshot"}
              </span><br/>
              <a href="https://api.deadlock-api.com/docs#tag/items" target="_blank" rel="noreferrer">
                api.deadlock-api.com docs
              </a>
            </div>
          </div>
        </header>

        <div className="hero-rail">
          <div className="hero-rail-label">
            <span>01 — Choose a hero ({heroes.length} available)</span>
          </div>
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
                className={"hero-chip" + (h===selectedHero?" active":"")}
                onClick={()=>pickHero(h)}
              >
                {h.icon && <img src={h.icon} alt={h.n} className="hero-img-sm" onError={e=>e.target.style.display='none'} />}
                <div className="hero-info">
                  <span className="n">{h.n}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="layout">
          <div className="col-left">
            <div className="panel">
              <div className="panel-title">
                <span>02 — Stat sheet</span>
                <span>{selectedHero?.n}</span>
              </div>

              {selectedHero && (
                <div className="hero-detail-header">
                  {selectedHero.image ? (
                    <img src={selectedHero.image} alt={selectedHero.n} className="hero-portrait" onError={e=>e.target.style.display='none'} />
                  ) : null}
                  <div className="hero-detail-meta">
                    <div className="name">{selectedHero.n}</div>
                    <div className="hero-tags">{getHeroTags(selectedHero).map(tag => <span className="hero-tag" key={tag}>{tag}</span>)}</div>
                  </div>
                </div>
              )}

              {/* ===== Item Slots & Walker Kills ===== */}
              <div className="slots-card">
                <div className="slots-title">
                  <span>ITEM SLOTS</span>
                  <span>{build.length} / {maxItems} ITEMS</span>
                </div>
                <div className="slots-summary">
                  <span className="base-lbl">Base: <b>9</b></span>
                  <span className="flex-lbl">+ Walker Bonus: <b>{Math.min(3, walkersDestroyed)}</b></span>
                </div>
                <div className="walker-section">
                  <div className="walker-head">
                    <span>WALKERS DESTROYED:</span>
                    <b>{walkersDestroyed} / 3</b>
                  </div>
                  <div className="walker-btn-group">
                    {[0, 1, 2, 3].map(cnt => (
                      <button
                        key={cnt}
                        className={"walker-btn" + (walkersDestroyed === cnt ? " active" : "")}
                        onClick={() => setWalkersDestroyed(cnt)}
                      >
                        {cnt === 0 ? "No Walkers" : `${cnt} Walker${cnt > 1 ? "s" : ""} (+${cnt} slot${cnt > 1 ? "s" : ""})`}
                      </button>
                    ))}
                  </div>
                </div>
                {slotLimitWarning && <div className="slot-warn">{slotLimitWarning}</div>}
                <div className="build-list">
                  {build.length===0 && <div className="build-empty">No items purchased yet — click items in the shop to add them.</div>}
                  {build.map((it,idx)=>(
                    <div className="build-item" key={it.n+idx}>
                      {it.image ? <img src={it.image} alt={it.n} className="build-item-icon" onError={e=>e.target.style.display='none'} /> : null}
                      <span className="nm">{it.n}</span>
                      {it.imbued && selectedHero?.abilities?.length > 0 && (
                        <select
                          className="imbue-select"
                          title="Which ability this item is imbued onto"
                          value={imbueTargets[imbueKey(it)] ?? selectedHero.abilities[0].key}
                          onChange={e => setImbueTargets(prev => ({ ...prev, [imbueKey(it)]: e.target.value }))}
                        >
                          {selectedHero.abilities.map(ab => <option key={ab.key} value={ab.key}>{ab.name}</option>)}
                        </select>
                      )}
                      <span className="cost">{TIER_COST[it.tier]}</span>
                      <button className="rm" title="Remove" onClick={()=>removeAt(idx)}>×</button>
                    </div>
                  ))}
                  {Array.from({ length: maxItems - build.length }, (_, i) => (
                    <div className="locked-slot" key={"empty-"+i}><span className="lock-icon">○</span><span>Empty Slot {build.length + i + 1}</span></div>
                  ))}
                  {Array.from({ length: 3 - Math.min(3, walkersDestroyed) }, (_, i) => (
                    <div className="locked-slot unlockable" key={"locked-"+i}><span className="lock-icon">🔒</span><span>Locked — Destroy Walker {Math.min(3, walkersDestroyed) + i + 1} to unlock</span></div>
                  ))}
                </div>
              </div>

              {/* ===== Soul Boons Card (Auto-Synced to Build Souls) ===== */}
              <div className="boons-card">
                <div className="boons-head">
                  <span className="boons-title">⚡ SOUL BOONS (AUTO-SYNCED)</span>
                  <span className="boons-badge">LEVEL {displayLevel} / {MAX_LEVEL}</span>
                </div>
                <div style={{fontSize:"11px", color:"var(--text-dim)", fontFamily:"'IBM Plex Mono',monospace", margin:"4px 0 8px"}}>
                  Item Build Value: <b style={{color:"var(--souls)"}}>{buildSouls.toLocaleString()}</b> Souls
                  {level < MAX_LEVEL ? ` · Next level at ${LEVEL_SOUL_THRESHOLDS[level === 0 ? 0 : level + 1].toLocaleString()} souls` : ' · Max Level Reached'}
                </div>
                <div className="boon-stats-preview">
                  <div className="boon-stat-chip">Max Health: <b>+{round1(boons.hp)}</b></div>
                  <div className="boon-stat-chip">Weapon Dmg: <b>+{round1(boons.dmgPct)}%</b></div>
                  <div className="boon-stat-chip">Spirit Power: <b>+{round1(boons.spirit)}</b></div>
                  <div className="boon-stat-chip">Ability Points: <b style={{color: availableAP > 0 ? 'var(--vitality)' : 'var(--text-faint)'}}>{availableAP}</b> available</div>
                  <div className="boon-stat-chip">Ability Unlocks: <b>{abilityUnlocks} / 4</b></div>
                </div>
              </div>

              {/* ===== Category Investments ===== */}
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

              {/* ===== Stat Sheet Rows ===== */}
              <div>
                {STAT_DEFS.map(s=>{
                  const base = baseValue(selectedHero, s.k);
                  const delta = totals[s.k] || 0;
                  const total = base + delta;
                  const breakdown = getStatBreakdown(s.k, s);
                  const deltaClass = delta > 0 ? "pos" : (delta < 0 ? "neg" : "zero");
                  const deltaTxt = delta === 0 ? "—" : (delta > 0 ? "+"+round1(delta) : round1(delta)) + s.unit;
                  return (
                    <div className="stat-row" key={s.k}>
                      <span className="label">{s.label}</span>
                      <span className="total">{round1(total)}{s.unit}</span>
                      <span className={"delta "+deltaClass}>{deltaTxt}</span>
                      <div className="stat-tooltip">
                        <div className="stat-tooltip-title">{s.label} breakdown</div>
                        {breakdown.map((line, index) => (
                          <div className="stat-tooltip-line" key={line.label + index}>
                            <span>{line.label}</span><b>{line.display}</b>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="souls-spent">
                <span className="lbl">Item Build Souls</span>
                <span className="amt">{buildSouls.toLocaleString()}</span>
              </div>

              <div className="build-list">
                {build.length===0 && maxItems > 0 ? (
                  <div className="build-empty">No items purchased yet — click items in the shop to add them.</div>
                ) : null}
                {build.map((it,idx)=>(
                  <div className="build-item" key={it.n+idx}>
                    {it.image ? <img src={it.image} alt={it.n} className="build-item-icon" onError={e=>e.target.style.display='none'} /> : null}
                    <span className="nm">{it.n}</span>
                    {it.imbued && selectedHero?.abilities?.length > 0 && (
                      <select
                        className="imbue-select"
                        title="Which ability this item is imbued onto"
                        value={imbueTargets[imbueKey(it)] ?? selectedHero.abilities[0].key}
                        onChange={e => setImbueTargets(prev => ({ ...prev, [imbueKey(it)]: e.target.value }))}
                      >
                        {selectedHero.abilities.map(ab => <option key={ab.key} value={ab.key}>{ab.name}</option>)}
                      </select>
                    )}
                    <span className="cost">{TIER_COST[it.tier]}</span>
                    <button className="rm" title="Remove" onClick={()=>removeAt(idx)}>×</button>
                  </div>
                ))}
                {/* Locked & empty slot placeholders */}
                {Array.from({ length: maxItems - build.length }, (_, i) => (
                  <div className="locked-slot" key={"empty-"+i}>
                    <span className="lock-icon">○</span>
                    <span>Empty Slot {build.length + i + 1}</span>
                  </div>
                ))}
                {Array.from({ length: 3 - Math.min(3, walkersDestroyed) }, (_, i) => (
                  <div className="locked-slot unlockable" key={"locked-"+i}>
                    <span className="lock-icon">🔒</span>
                    <span>Locked — Destroy Walker {Math.min(3, walkersDestroyed) + i + 1} to unlock</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-right">
            {/* ===== Hero Abilities & Skill Points ===== */}
            {selectedHero && selectedHero.abilities && selectedHero.abilities.length > 0 && (
              <div className="panel">
                <div className="panel-title">
                  <span>03 — Hero Abilities &amp; Skill Upgrades (Affects Hero Stats)</span>
                  <span><button className="collapse-btn" onClick={() => toggleSection("abilities")} aria-label="Toggle abilities panel">{collapsedSections.abilities ? "+" : "−"}</button> {selectedHero.n}</span>
                </div>
                {!collapsedSections.abilities && <div className="abilities-grid">
                  {selectedHero.abilities.map((ab, abilityIndex) => {
                    const abilityUnlocked = !!unlockedAbilitySlots[ab.key];
                    const canUnlock = !abilityUnlocked && abilityUnlocks > Object.values(unlockedAbilitySlots).filter(Boolean).length && (abilityIndex < 3 || level >= 7);
                    const lockUnavailable = !abilityUnlocked && !canUnlock;
                    const activeUpgradeBonuses = (ab.upgrades || []).filter(u => unlockedAbilityTiers[`${ab.key}_T${u.tier}`]).flatMap(u => u.bonuses || []);
                    // Match against the canonical property names exactly (not a fuzzy
                    // substring) — abilities also carry unrelated props like "StunDuration"
                    // or "AbilityCooldownBetweenCharge" that would otherwise false-positive.
                    const upgradeChargeBonus = activeUpgradeBonuses.filter(b => b.prop === "AbilityCharges").reduce((sum, b) => sum + Number(b.bonus || 0), 0);
                    const upgradeCooldownDelta = activeUpgradeBonuses.filter(b => b.prop === "AbilityCooldown").reduce((sum, b) => sum + Number(b.bonus || 0), 0);
                    const upgradeDurationDelta = activeUpgradeBonuses.filter(b => b.prop === "AbilityDuration").reduce((sum, b) => sum + Number(b.bonus || 0), 0);
                    // Imbued items (e.g. Compress Cooldown) only count toward the ability
                    // they're targeted at; non-imbued items (e.g. Superior Cooldown) still
                    // apply to every ability as before.
                    const itemChargeBonus = build.reduce((sum, item) => sum + (itemAppliesToAbility(item, ab.key, imbueTargets, selectedHero) ? (item.mods?.abilityCharges || 0) : 0), 0);
                    const effectiveCharges = ab.charges == null ? null : ab.charges + itemChargeBonus + upgradeChargeBonus;
                    const itemCdr = build.reduce((sum, item) => sum + (itemAppliesToAbility(item, ab.key, imbueTargets, selectedHero) ? (item.mods?.cdr || 0) : 0), 0);
                    const adjustedCooldown = ab.cooldown == null ? null : Math.max(0, (ab.cooldown + upgradeCooldownDelta) * (1 - Math.max(0, itemCdr) / 100));
                    const abilityDurationPct = build.reduce((sum, item) => sum + (itemAppliesToAbility(item, ab.key, imbueTargets, selectedHero) ? (item.mods?.abilityDuration || 0) : 0), 0);
                    const adjustedDuration = ab.duration == null ? null : Math.max(0, ab.duration + upgradeDurationDelta) * (1 + abilityDurationPct / 100);
                    // Combine each damage stat's base value with any unlocked-upgrade bonus:
                    // flat bonuses add to the base, EAddToScale bonuses add to the spirit/weapon
                    // scaling ratio, which is then multiplied by the hero's current totals.
                    const effectiveDamageStats = (ab.damageStats || []).map(stat => {
                      let upgradeFlatBonus = 0;
                      let spiritScale = stat.spiritScale;
                      let weaponScale = stat.weaponScale;
                      activeUpgradeBonuses.forEach(b => {
                        if (b.prop !== stat.key) return;
                        if (b.scaleFilter === "ETechPower" && b.scaleType === "EAddToScale") spiritScale += b.bonus;
                        else if (b.scaleFilter === "EWeaponPower" && b.scaleType === "EAddToScale") weaponScale += b.bonus;
                        else upgradeFlatBonus += b.bonus;
                      });
                      const base = stat.base + upgradeFlatBonus;
                      const spiritBonus = spiritScale * (totals.spirit || 0);
                      const weaponBonus = weaponScale * (totals.dmg || 0);
                      return { ...stat, base, upgradeFlatBonus, spiritScale, weaponScale, spiritBonus, weaponBonus, total: base + spiritBonus + weaponBonus };
                    });
                    // A spawned object's own lifetime (e.g. Call Bell's "Bell Lifetime"),
                    // separate from the ability's own cast/active AbilityDuration.
                    const effectiveLifetimeStats = (ab.lifetimeStats || []).map(stat => {
                      const upgradeFlatBonus = activeUpgradeBonuses.filter(b => b.prop === stat.key).reduce((sum, b) => sum + Number(b.bonus || 0), 0);
                      return { ...stat, upgradeFlatBonus, total: stat.value + upgradeFlatBonus };
                    });
                    return <div className={"ability-card" + (abilityUnlocked ? "" : " ability-locked")} key={ab.key}>
                      {lockUnavailable && <span className="ability-lock-symbol" title={abilityIndex === 3 ? "Ultimate unlocks at level 7" : "Earn an ability unlock to choose this ability"}>🔒</span>}
                      <div>
                        <div className="ability-head">
                          {ab.image && <img src={ab.image} alt={ab.name} className="ability-img" onError={e=>e.target.style.display='none'} />}
                          <div className="ability-title-box">
                            <div className="ability-name">{ab.name}</div>
                            <div className="ability-slot">{ab.slot} · {abilityUnlocked ? "UNLOCKED" : (abilityIndex === 3 ? "Requires level 7" : "Choose to unlock")}</div>
                          </div>
                        </div>
                        <div className="ability-hover-info">
                          <b>{ab.name}</b>
                          <div>{ab.description || "No additional description available."}</div>
                        </div>
                        {(effectiveDamageStats.length > 0 || effectiveLifetimeStats.length > 0 || ab.cooldown != null || ab.duration != null || effectiveCharges != null) && (
                          <div className="ability-meta">
                            {effectiveDamageStats.map(d => (
                              <div className="ability-stat-line" key={d.key}>
                                <span className="ability-stat-icon">✦</span><b>{d.label}:</b> {round1(d.total)}
                                {(d.spiritScale > 0 || d.weaponScale > 0) && (
                                  <span className="ability-impact">
                                    {" "}({round1(d.base)}{d.spiritScale > 0 ? ` +${round1(d.spiritScale)}×Spirit` : ""}{d.weaponScale > 0 ? ` +${round1(d.weaponScale)}×WpnDmg` : ""})
                                  </span>
                                )}
                                <CalcTooltip title={`${d.label} breakdown`} lines={[
                                  { label: "Ability base", value: round1(d.base - d.upgradeFlatBonus) },
                                  d.upgradeFlatBonus !== 0 && { label: "Upgrade bonus", value: (d.upgradeFlatBonus > 0 ? "+" : "") + round1(d.upgradeFlatBonus) },
                                  d.spiritScale !== 0 && { label: `Spirit Power (${round1(d.spiritScale)}× of ${round1(totals.spirit || 0)})`, value: "+" + round1(d.spiritBonus) },
                                  d.weaponScale !== 0 && { label: `Weapon Damage (${round1(d.weaponScale)}× of ${round1(totals.dmg || 0)})`, value: "+" + round1(d.weaponBonus) },
                                  { label: "Total", value: round1(d.total) },
                                ]} />
                              </div>
                            ))}
                            {effectiveLifetimeStats.map(ls => (
                              <div className="ability-stat-line" key={ls.key}>
                                <span className="ability-stat-icon">⌛︎</span><b>{ls.label}:</b> {round1(ls.total)}s
                                <CalcTooltip title={`${ls.label} breakdown`} lines={[
                                  { label: "Ability base", value: round1(ls.value) + "s" },
                                  ls.upgradeFlatBonus !== 0 && { label: "Upgrade bonus", value: (ls.upgradeFlatBonus > 0 ? "+" : "") + round1(ls.upgradeFlatBonus) + "s" },
                                  { label: "Total", value: round1(ls.total) + "s" },
                                ]} />
                              </div>
                            ))}
                            {ab.cooldown != null && (
                              <div className="ability-stat-line">
                                <span className="ability-stat-icon">◷</span><b>Cooldown:</b> {round1(ab.cooldown)}s {adjustedCooldown !== ab.cooldown && <span className="ability-impact">→ {round1(adjustedCooldown)}s</span>}
                                <CalcTooltip title="Cooldown breakdown" lines={[
                                  { label: "Ability base", value: round1(ab.cooldown) + "s" },
                                  upgradeCooldownDelta !== 0 && { label: "Upgrade bonus", value: (upgradeCooldownDelta > 0 ? "+" : "") + round1(upgradeCooldownDelta) + "s" },
                                  itemCdr !== 0 && { label: "Cooldown reduction (items)", value: "-" + round1(itemCdr) + "%" },
                                  { label: "Total", value: round1(adjustedCooldown) + "s" },
                                ]} />
                              </div>
                            )}
                            {ab.duration != null && (
                              <div className="ability-stat-line">
                                <span className="ability-stat-icon">⌛︎</span><b>Duration:</b> {round1(ab.duration)}s {adjustedDuration !== ab.duration && <span className="ability-impact">→ {round1(adjustedDuration)}s</span>}
                                <CalcTooltip title="Duration breakdown" lines={[
                                  { label: "Ability base", value: round1(ab.duration) + "s" },
                                  upgradeDurationDelta !== 0 && { label: "Upgrade bonus", value: (upgradeDurationDelta > 0 ? "+" : "") + round1(upgradeDurationDelta) + "s" },
                                  abilityDurationPct !== 0 && { label: "Duration bonus (items)", value: "+" + round1(abilityDurationPct) + "%" },
                                  { label: "Total", value: round1(adjustedDuration) + "s" },
                                ]} />
                              </div>
                            )}
                            {effectiveCharges != null && (
                              <div className="ability-stat-line">
                                <span className="ability-stat-icon">◉</span><b>Charges:</b> {round1(effectiveCharges)}{ab.chargeDelay != null && ` · ${round1(ab.chargeDelay)}s recharge`}
                                <CalcTooltip title="Charges breakdown" lines={[
                                  { label: "Ability base", value: round1(ab.charges) },
                                  itemChargeBonus !== 0 && { label: "Item bonus", value: (itemChargeBonus > 0 ? "+" : "") + round1(itemChargeBonus) },
                                  upgradeChargeBonus !== 0 && { label: "Upgrade bonus", value: (upgradeChargeBonus > 0 ? "+" : "") + round1(upgradeChargeBonus) },
                                  { label: "Total", value: round1(effectiveCharges) },
                                ]} />
                              </div>
                            )}
                          </div>
                        )}
                        {!abilityUnlocked && (
                          <button className="ability-tier-btn" disabled={!canUnlock} onClick={() => toggleAbilityUnlock(abilityIndex)}>
                            <span>Unlock this ability</span>
                            <span>{canUnlock ? "UNLOCK" : (abilityIndex === 3 && level < 7 ? "LEVEL 7" : "NO UNLOCK")}</span>
                          </button>
                        )}
                      </div>
                      <div className="ability-upgrades">
                        {(ab.upgrades || []).map(u => {
                          const tierKey = `${ab.key}_T${u.tier}`;
                          const isUnlocked = !!unlockedAbilityTiers[tierKey];
                          const prevLocked = u.tier >= 2 && !unlockedAbilityTiers[`${ab.key}_T${u.tier - 1}`];
                          const noAP = !isUnlocked && availableAP < (u.apCost || 1);
                          const bonusTxt = u.bonuses.map(b => b.formatted).join(', ') || `Tier ${u.tier} Upgrade`;
                          const abilityStatus = !abilityUnlocked ? "Unlock ability first" : `${u.apCost || 1} AP`;
                          let statusTxt = isUnlocked ? "✓ UNLOCKED" : `${u.apCost || 1} AP`;
                          if (!isUnlocked && prevLocked) statusTxt = `🔒 Need T${u.tier - 1}`;
                          else if (!isUnlocked && noAP) statusTxt = "No AP";
                          const isDisabled = !abilityUnlocked || (!isUnlocked && (prevLocked || noAP));
                          return (
                            <button
                              key={u.tier}
                              className={"ability-tier-btn" + (isUnlocked ? " unlocked" : "") + (isDisabled ? " disabled-tier" : "")}
                              onClick={() => toggleAbilityTier(ab.key, u.tier)}
                              disabled={isDisabled}
                              style={isDisabled ? { opacity: 0.45, cursor: 'not-allowed' } : {}}
                            >
                              <span><span className="t-badge">T{u.tier}:</span> {bonusTxt}</span>
                              <span>{isUnlocked ? "UNLOCKED" : (abilityUnlocked ? statusTxt : abilityStatus)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  })}
                </div>}
              </div>
            )}

            {/* ===== Shop Panel ===== */}
            <div className="panel">
              <div className="shop-toggle"><button className="collapse-btn" onClick={() => toggleSection("shop")} aria-label="Toggle shop panel">{collapsedSections.shop ? "+" : "−"}</button></div>
              <div className="panel-title">04 — Shop ({items.length} Main Gamemode Items)</div>
              {!collapsedSections.shop && <>
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
                          const statChips = (it.statDisplays && it.statDisplays.length > 0)
                            ? it.statDisplays.map((s, idx) => (
                                <span className="stat-chip pos" key={s.label + idx}>{s.label}: {s.value}</span>
                              ))
                            : Object.entries(it.mods||{}).filter(([k,v])=>v!==0).map(([k,v])=>{
                                const def = STAT_DEFS.find(s=>s.k===k);
                                if(!def) return null;
                                const cls = v>0?"pos":"neg";
                                const txt = (v>0?"+":"") + round1(v) + def.unit;
                                return <span className={"stat-chip "+cls} key={k}>{def.label}: {txt}</span>;
                              });

                          const ownedComponents = (it.upgradesFrom || []).filter(name => build.some(b => b.n === name));
                          const ownedUpgradesOfThis = (it.upgradesInto || []).filter(name => build.some(b => b.n === name));
                          const needsChargeAbility = !!it.mods?.abilityCharges;
                          const heroHasNoChargeAbilities = needsChargeAbility && !(selectedHero?.abilities || []).some(a => a.charges != null);
                          const blockedReason = ownedUpgradesOfThis.length > 0
                            ? `Already own ${ownedUpgradesOfThis.join(', ')} (upgraded from this) — remove it first.`
                            : heroHasNoChargeAbilities
                              ? `${selectedHero?.n} has no charge-based abilities — this item has nothing to affect.`
                              : null;

                          return (
                            <div
                              className={"item-card"+(inBuild?" added":"")+(blockedReason?" disabled-card":"")}
                              data-cat={it.cat}
                              key={it.id || it.n}
                              onClick={()=>{ if (!blockedReason) toggleItem(it); }}
                            >
                              <div>
                                <div className="item-head">
                                  {it.image ? <img src={it.image} alt={it.n} className="item-img" onError={e=>e.target.style.display='none'} /> : null}
                                  <div className="item-head-info">
                                    <div className="item-name">{it.n}{inBuild?" ✓":""}</div>
                                  </div>
                                  <span className="item-cost">{TIER_COST[it.tier]}</span>
                                </div>
                                {statChips.length>0 && <div className="item-stats">{statChips}</div>}
                                <div className="item-hover-info">
                                  <b>{it.n}</b>
                                  <div>{it.effect}</div>
                                  {it.cond && <div><strong>Condition:</strong> {it.cond}</div>}
                                  {it.upgradesFrom?.length > 0 && (
                                    <div><strong>Upgrades from:</strong> {it.upgradesFrom.join(', ')}{ownedComponents.length > 0 ? ' — owned, buying this absorbs it' : ''}</div>
                                  )}
                                  {it.upgradesInto?.length > 0 && (
                                    <div><strong>Upgrades into:</strong> {it.upgradesInto.join(', ')}</div>
                                  )}
                                  {blockedReason && <div><strong>Unavailable:</strong> {blockedReason}</div>}
                                </div>
                              </div>
                              <div className="item-tags">
                                {(it.tags||[]).map(t=><span className="tag" key={t}>{t}</span>)}
                                {it.active && <span className="tag active-tag">ACTIVE</span>}
                                {it.cond && <span className="tag cond-tag">CONDITIONAL</span>}
                                {it.upgradesFrom?.length > 0 && (
                                  <span className={"tag upgrade-tag" + (ownedComponents.length > 0 ? " ready" : "")}>
                                    {ownedComponents.length > 0 ? `⬆ UPGRADES ${ownedComponents.join(', ')}` : `⬆ FROM ${it.upgradesFrom.join(', ')}`}
                                  </span>
                                )}
                                {it.upgradesInto?.length > 0 && <span className="tag upgrade-tag">⬆ INTO {it.upgradesInto.join(', ')}</span>}
                                {it.imbued && <span className="tag imbue-tag" title="Only affects the one ability you imbue it onto">IMBUE — 1 ABILITY</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {Object.values(filteredItemsByTier).every(arr=>arr.length===0) && (
                  <div className="build-empty">No items match your search or filters.</div>
                )}
              </div>
              </>}
            </div>

            {/* ===== Active & Conditional Effects Panel ===== */}
            <div className="panel cond-panel">
              <div className="panel-title">05 — Active &amp; conditional effects</div>
              <div className="cond-list">
                {conditionalItems.length===0 ? (
                  <div className="cond-empty">Buy an active or conditional item to see its status and activation triggers.</div>
                ) : conditionalItems.map((it,idx)=>{
                  const badge = it.active ? "ACTIVE — bound to Z / X / C / V" : "CONDITIONAL PASSIVE";
                  const adjustedItemCooldown = it.activeCooldown == null ? null : Math.max(0, it.activeCooldown * (1 - Math.max(0, totals.cdr || 0) / 100));
                  return (
                    <div className="cond-row" key={it.n+idx}>
                      <div className="item-lbl">{it.n}<small>{badge}</small></div>
                      <div className="desc">
                        {it.active && (it.activeCooldown != null || it.activeDuration != null || it.activeCharges != null) && (
                          <div>
                            {it.activeCooldown != null && <span>◷ Cooldown: {round1(it.activeCooldown)}s{adjustedItemCooldown !== it.activeCooldown && ` → ${round1(adjustedItemCooldown)}s with current CDR`}</span>}
                            {it.activeDuration != null && <span>{it.activeCooldown != null ? " · " : ""}⌛︎ Duration: {round1(it.activeDuration)}s</span>}
                            {it.activeCharges != null && <span>{(it.activeCooldown != null || it.activeDuration != null) ? " · " : ""}◉ Charges: {round1(it.activeCharges)}{it.activeChargeDelay != null ? ` · ${round1(it.activeChargeDelay)}s recharge` : ""}</span>}
                          </div>
                        )}
                        {it.conditionalEffects?.length > 0 ? it.conditionalEffects.map((ce, ceIdx) => (
                          <div key={ceIdx}>
                            <span className="ability-impact">If {ce.condition}</span>
                            {ce.stats.length > 0 && <>: {ce.stats.map(s => `${s.label} ${s.value}`).join(', ')}</>}
                          </div>
                        )) : (!it.active && <div>{it.cond || "Manually activated ability — triggers only while used and then goes on cooldown."}</div>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <footer className="note">
          {dataSource==="fallback" && dataError && <>Live API fetch failed ({dataError}) — using bundled backup snapshot.<br/></>}
          Hero and item data is dynamically fetched from <a href="https://api.deadlock-api.com/docs#tag/items" target="_blank" rel="noreferrer">api.deadlock-api.com</a>.
          Non-main gamemode items are automatically filtered out. Item slot capacity rules (4 per category + Walker Flex slots) are strictly enforced.
        </footer>
      </div>
    </div>
  );
}
