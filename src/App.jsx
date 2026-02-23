import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell } from "recharts";

/* ═══════════════════════════════════════════════════════════════
   NETFLIX-INSPIRED GLOBAL STYLES
   Deep blacks, bold red accent, cinematic typography
═══════════════════════════════════════════════════════════════ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --nf-black: #141414;
      --nf-dark: #1a1a1a;
      --nf-card: #1f1f1f;
      --nf-card2: #2a2a2a;
      --nf-border: #2d2d2d;
      --nf-border2: #383838;
      --nf-red: #e50914;
      --nf-red2: #f40612;
      --nf-red-dim: rgba(229,9,20,0.15);
      --nf-text: #e5e5e5;
      --nf-sub: #a3a3a3;
      --nf-muted: #6b6b6b;
      --nf-white: #ffffff;
      --green: #46d369;
      --amber: #f5a623;
      --red: #e50914;
      --blue: #0096d6;
      --purple: #7c3aed;
    }
    html { -webkit-tap-highlight-color: transparent; }
    body {
      background: var(--nf-black);
      color: var(--nf-text);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.6); cursor: pointer; }
    input, select, textarea { font-family: 'Inter', system-ui, sans-serif; }
    ::-webkit-scrollbar { width: 3px; height: 3px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #3d3d3d; border-radius: 3px; }

    /* ── ANIMATIONS ── */
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes scaleIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
    @keyframes pulseRed {
      0%,100% { box-shadow: 0 0 0 0 rgba(229,9,20,0.4); }
      50% { box-shadow: 0 0 0 8px rgba(229,9,20,0); }
    }
    @keyframes tickGlow {
      0%,100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    @keyframes shimmerSlide {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes glowRed {
      0%,100% { text-shadow: 0 0 10px rgba(229,9,20,0.5); }
      50% { text-shadow: 0 0 25px rgba(229,9,20,0.9), 0 0 50px rgba(229,9,20,0.4); }
    }
    @keyframes glowAmber {
      0%,100% { text-shadow: 0 0 10px rgba(245,166,35,0.4); }
      50% { text-shadow: 0 0 20px rgba(245,166,35,0.8); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes progressFill { from { width: 0% } }

    /* ── COMPONENT CLASSES ── */
    .nf-card {
      background: var(--nf-card);
      border: 1px solid var(--nf-border);
      border-radius: 6px;
      animation: slideUp 0.35s ease both;
    }
    .nf-card:nth-child(1){animation-delay:.04s}
    .nf-card:nth-child(2){animation-delay:.08s}
    .nf-card:nth-child(3){animation-delay:.12s}
    .nf-card:nth-child(4){animation-delay:.16s}

    .nf-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 7px;
      border: none; cursor: pointer; font-family: 'Inter', sans-serif;
      font-weight: 600; border-radius: 4px; transition: all 0.15s;
      -webkit-appearance: none; appearance: none;
      white-space: nowrap;
    }
    .nf-btn-red {
      background: var(--nf-red); color: white; padding: 10px 20px; font-size: 14px;
    }
    .nf-btn-red:hover { background: var(--nf-red2); transform: scale(1.02); }
    .nf-btn-red:active { transform: scale(0.98); }

    .nf-btn-ghost {
      background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
      color: var(--nf-text); padding: 9px 18px; font-size: 13px;
    }
    .nf-btn-ghost:hover { background: rgba(255,255,255,0.12); }

    .nf-btn-sm {
      padding: 6px 14px; font-size: 12px;
    }
    .nf-btn-promote {
      background: rgba(70,211,105,0.12); border: 1px solid rgba(70,211,105,0.3);
      color: #46d369; padding: 6px 12px; font-size: 12px;
    }
    .nf-btn-promote:hover { background: rgba(70,211,105,0.2); }

    .nf-btn-edit {
      background: rgba(0,150,214,0.1); border: 1px solid rgba(0,150,214,0.25);
      color: #0096d6; padding: 6px 12px; font-size: 12px;
    }
    .nf-btn-edit:hover { background: rgba(0,150,214,0.18); }

    .nf-btn-danger {
      background: rgba(229,9,20,0.1); border: 1px solid rgba(229,9,20,0.25);
      color: var(--nf-red); padding: 6px 12px; font-size: 12px;
    }
    .nf-btn-danger:hover { background: rgba(229,9,20,0.18); }

    .nf-input {
      background: #2a2a2a; border: 1px solid #3d3d3d;
      color: var(--nf-text); border-radius: 4px; padding: 10px 14px;
      font-size: 14px; width: 100%; font-family: 'Inter', sans-serif;
      transition: border-color 0.2s, background 0.2s; outline: none;
    }
    .nf-input:focus { border-color: var(--nf-red); background: #2f2f2f; }
    .nf-input::placeholder { color: #555; }

    .nf-input-inline {
      background: transparent; border: none; border-bottom: 1px solid #3d3d3d;
      color: var(--nf-text); padding: 3px 6px; font-size: 13px;
      font-family: 'Inter', sans-serif; outline: none; width: 100%;
      transition: border-color 0.2s;
    }
    .nf-input-inline:focus { border-bottom-color: var(--nf-red); }

    .nf-tab {
      padding: 14px 16px; font-size: 13px; font-weight: 600; cursor: pointer;
      border: none; background: none; color: var(--nf-muted);
      border-bottom: 2px solid transparent; transition: all 0.2s;
      font-family: 'Inter', sans-serif; white-space: nowrap;
      display: flex; align-items: center; gap: 7px;
      -webkit-appearance: none;
    }
    .nf-tab:hover { color: var(--nf-text); }
    .nf-tab.active { color: var(--nf-white); border-bottom-color: var(--nf-red); }

    /* Mobile bottom nav */
    .mobile-nav {
      position: fixed; bottom: 0; left: 0; right: 0;
      background: rgba(20,20,20,0.97); border-top: 1px solid #2d2d2d;
      display: flex; z-index: 50;
      padding-bottom: env(safe-area-inset-bottom, 0px);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    }
    .mobile-nav-btn {
      flex: 1; display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 10px 4px; gap: 4px;
      background: none; border: none; cursor: pointer;
      color: #6b6b6b; font-size: 10px; font-family: 'Inter', sans-serif;
      font-weight: 500; transition: color 0.15s;
      -webkit-appearance: none;
    }
    .mobile-nav-btn.active { color: var(--nf-red); }
    .mobile-nav-btn:hover { color: var(--nf-text); }

    .risk-badge {
      display: inline-flex; align-items: center; gap: 4px;
      border-radius: 3px; padding: 3px 8px; font-size: 10px;
      font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
      font-family: 'DM Mono', monospace;
    }

    .progress-bar { transition: width 0.9s cubic-bezier(0.34,1.2,0.64,1); }

    .row-hover { transition: background 0.15s; }
    .row-hover:hover { background: rgba(255,255,255,0.04) !important; }

    /* Tooltip */
    .ntip { position: relative; display: inline-flex; align-items: center; cursor: help; }
    .ntip .tip-box {
      display: none; position: absolute; bottom: calc(100% + 8px); left: 50%;
      transform: translateX(-50%); background: #1f1f1f; border: 1px solid #3d3d3d;
      border-radius: 6px; padding: 10px 14px; width: 250px; font-size: 12px;
      color: var(--nf-sub); line-height: 1.5; z-index: 100;
      box-shadow: 0 8px 32px rgba(0,0,0,0.8); pointer-events: none;
    }
    .ntip:hover .tip-box { display: block; animation: fadeIn 0.15s ease; }

    /* Promote modal */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.88);
      z-index: 200; display: flex; align-items: center; justify-content: center;
      padding: 20px; backdrop-filter: blur(6px);
      animation: fadeIn 0.15s ease;
    }
    .modal-box {
      background: #1f1f1f; border: 1px solid #3d3d3d; border-radius: 8px;
      padding: 28px; width: 100%; max-width: 500px; max-height: 90vh;
      overflow-y: auto; animation: scaleIn 0.2s ease;
    }

    /* Clock colon blink */
    .clock-colon { animation: tickGlow 1s ease infinite; }

    /* Ring SVG */
    .ring-path { transition: stroke-dasharray 1.2s cubic-bezier(0.34,1.2,0.64,1); }

    /* Netflix shimmer loading effect */
    .nf-shimmer {
      position: relative; overflow: hidden;
    }
    .nf-shimmer::after {
      content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
      animation: shimmerSlide 2s infinite;
    }

    .insight-row {
      border-radius: 4px; padding: 16px 18px;
      border-left: 3px solid; margin-bottom: 10px;
      transition: transform 0.15s, background 0.15s;
      cursor: default;
    }
    .insight-row:hover { transform: translateX(4px); }

    /* View toggle pills */
    .pill-group { display: flex; background: #1a1a1a; border: 1px solid #2d2d2d; border-radius: 6px; padding: 3px; gap: 3px; }
    .pill { padding: 7px 16px; border-radius: 4px; font-size: 12px; font-weight: 600;
      cursor: pointer; border: none; font-family: 'Inter', sans-serif; transition: all 0.2s; }
    .pill.on { background: var(--nf-red); color: white; }
    .pill:not(.on) { background: transparent; color: var(--nf-muted); }
    .pill:not(.on):hover { color: var(--nf-text); }

    /* iOS safe area */
    .safe-bottom { padding-bottom: calc(70px + env(safe-area-inset-bottom, 0px)); }
    .safe-top { padding-top: env(safe-area-inset-top, 0px); }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════════
   DATE MATH — Departure EXCLUDED · Return EXCLUDED
   Exit Jan 1 → Return Jan 10 = 8 absent days (Jan 2–9)
═══════════════════════════════════════════════════════════════ */
const D = {
  parse(str) {
    if (!str) return null;
    str = String(str).trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) return new Date(str + "T00:00:00");
    const parts = str.split(/[\/\-\.]/);
    if (parts.length === 3) {
      const [a, b, c] = parts.map(Number);
      if (a > 12) return new Date(c, b - 1, a);
      if (b > 12) return new Date(c, a - 1, b);
      return new Date(c, a - 1, b);
    }
    return new Date(str);
  },
  absent(exit, ret) {
    const e = new Date(exit); e.setHours(0,0,0,0);
    const r = new Date(ret); r.setHours(0,0,0,0);
    return Math.max(0, (r - e) / 86400000 - 1);
  },
  today() { const d = new Date(); d.setHours(0,0,0,0); return d; },
  add(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d; },
  fmt(d) { if (!d) return "—"; return new Date(d).toLocaleDateString("en-GB", {day:"2-digit",month:"short",year:"numeric"}); },
  fmtShort(d) { if (!d) return "—"; return new Date(d).toLocaleDateString("en-GB", {day:"2-digit",month:"short"}); },
  iso(d) { return new Date(d).toISOString().split("T")[0]; },
  rolling(trips, windowEnd) {
    const we = new Date(windowEnd); we.setHours(23,59,59,999);
    const ws = new Date(windowEnd); ws.setFullYear(ws.getFullYear()-1); ws.setDate(ws.getDate()+1); ws.setHours(0,0,0,0);
    let total = 0;
    for (const t of trips) {
      if (!t.exitDate || !t.returnDate) continue;
      const abS = D.add(new Date(t.exitDate), 1); abS.setHours(0,0,0,0);
      const abE = D.add(new Date(t.returnDate), -1); abE.setHours(23,59,59,999);
      if (abE < ws || abS > we) continue;
      const os = abS < ws ? ws : abS;
      const oe = abE > we ? we : abE;
      if (oe >= os) total += (oe - os) / 86400000 + 1;
    }
    return Math.round(total);
  },
  monthName(d) { return new Date(d).toLocaleDateString("en-GB", {month:"short", year:"2-digit"}); }
};

function buildRolling(trips) {
  if (!trips.length) return { peak:0, peakDate:null, current:0, chartData:[], monthlyData:[] };
  const today = D.today();
  const valid = trips.filter(t => t.exitDate && t.returnDate);
  if (!valid.length) return { peak:0, peakDate:null, current:0, chartData:[], monthlyData:[] };
  const allDates = valid.flatMap(t => [new Date(t.exitDate), new Date(t.returnDate)]);
  const minDate = allDates.reduce((a,b) => a < b ? a : b, D.add(today,-365));
  const maxDate = D.add(today, 365);
  const chartData = [], monthlyData = [];
  let peak = 0, peakDate = null;
  let d = new Date(minDate);
  while (d <= maxDate) {
    const abs = D.rolling(valid, d);
    if (abs > peak) { peak = abs; peakDate = new Date(d); }
    chartData.push({ date: D.iso(d), absences: abs, label: D.fmtShort(d), isFuture: d > today });
    d = D.add(d, 7);
  }
  for (let i = -11; i <= 6; i++) {
    const md = D.add(today, i * 30);
    monthlyData.push({ label: D.monthName(md), absences: D.rolling(valid, md), isFuture: md > today });
  }
  const current = D.rolling(valid, today);
  return { peak, peakDate, current, chartData, monthlyData };
}

function risk(days) {
  if (days >= 180) return { level:"BREACH", color:"#e50914", dot:"⛔" };
  if (days >= 170) return { level:"RED",    color:"#e50914", dot:"🔴" };
  if (days >= 150) return { level:"AMBER",  color:"#f5a623", dot:"🟡" };
  if (days >= 120) return { level:"CAUTION",color:"#f5a623", dot:"🟡" };
  return              { level:"SAFE",   color:"#46d369", dot:"🟢" };
}

function calcRBI(cur, futDays) {
  return Math.min(100, Math.max(0, Math.round(((180 - cur - futDays) / 180) * 100)));
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (!lines.length) return [];
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g,"").toLowerCase());
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const vals = line.split(",").map(v => v.trim().replace(/^"|"$/g,""));
    const obj = {}; headers.forEach((h,i) => obj[h] = vals[i]||""); return obj;
  });
}

function generateInsights(eTrips, eFuture, rolling, fRolling, settings) {
  const insights = [];
  const today = D.today();
  const buffer = 180 - rolling.current;

  if (rolling.current >= 180)
    insights.push({type:"critical",icon:"💥",title:"Continuous Residence BREACH",body:`You have ${rolling.current} days in a rolling 12-month window, exceeding the 180-day limit. Seek UK immigration legal advice immediately.`,action:"Contact a solicitor urgently"});
  else if (rolling.current >= 170)
    insights.push({type:"critical",icon:"🚨",title:`Only ${buffer} Days Until Breach`,body:`Rolling absence is at ${rolling.current}/180. ${buffer<=5?"Do NOT travel.":"Avoid all non-essential travel."}`,action:"Pause all travel plans"});
  else if (rolling.current >= 150)
    insights.push({type:"warning",icon:"⚠️",title:"Amber Zone — Caution Required",body:`At ${rolling.current} days you have ${buffer} days buffer. Keep trips under ${Math.max(1,buffer-10)} days.`,action:`Max trip: ${Math.max(1,buffer-10)} days`});

  if (eFuture.length > 0) {
    if (fRolling.peak >= 150)
      insights.push({type:"warning",icon:"📋",title:"Planned Travel Creates Risk",body:`${eFuture.length} planned trip(s) will push rolling to ${fRolling.peak} days. ${fRolling.peak>=180?"WILL BREACH.":fRolling.peak>=170?"Enters RED zone.":"Enters AMBER zone."}`,action:"Review planned trips"});
    else
      insights.push({type:"info",icon:"✈️",title:"Planned Travel Assessed",body:`${eFuture.length} trip(s) add ${fRolling.peak-rolling.current} days, projected peak: ${fRolling.peak} days. Within safe limits.`,action:"Continue monitoring"});
  }

  if (eTrips.length >= 3) {
    const monthCount = Array(12).fill(0);
    eTrips.forEach(t => monthCount[new Date(t.exitDate).getMonth()]++);
    const peakM = monthCount.indexOf(Math.max(...monthCount));
    const mNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    if (monthCount[peakM] >= 2)
      insights.push({type:"info",icon:"📅",title:`Peak Travel Month: ${mNames[peakM]}`,body:`You travel most in ${mNames[peakM]} (${monthCount[peakM]} trips). Plan your buffer for this season.`,action:"Budget ahead of peak months"});
  }

  if (settings.residenceStartDate) {
    const qd = new Date(settings.residenceStartDate);
    qd.setFullYear(qd.getFullYear() + settings.qualifyingYears);
    const daysLeft = Math.ceil((qd - today) / 86400000);
    const earlyApp = D.add(qd, -28);
    const dToEarly = Math.ceil((earlyApp - today) / 86400000);
    if (daysLeft <= 0)
      insights.push({type:"success",icon:"🏆",title:"ILR Qualifying Period Complete!",body:`You've completed your ${settings.qualifyingYears}-year period. The Home Office will assess your full qualifying history. Apply now.`,action:"Submit ILR application"});
    else if (dToEarly <= 30 && dToEarly > 0)
      insights.push({type:"warning",icon:"📬",title:`Application Window Opens in ${dToEarly} Days`,body:`Submit ILR from ${D.fmt(earlyApp)} (28 days before qualifying date). Gather P60s, payslips, passport stamps, employer letters.`,action:`Apply from ${D.fmt(earlyApp)}`});
    else if (daysLeft <= 180)
      insights.push({type:"info",icon:"⏳",title:`${daysLeft} Days Until Qualification`,body:`Final stretch — avoid absences that push rolling above 180 days. The last 12 months are most critical.`,action:"Minimise travel now"});
  }

  if (rolling.current < 150) {
    const maxSingle = Math.max(0, 180 - rolling.current - 10);
    const inMonth = D.rolling(eTrips, D.add(today, 30));
    insights.push({type:"success",icon:"🗓️",title:"Safe Travel Window",body:`Buffer: ${buffer} days. Recommended max single trip: ${Math.min(maxSingle,30)} days. In 30 days your rolling will be ${inMonth} days.`,action:`Safe for up to ${Math.min(maxSingle,30)} days`});
  }

  if (eTrips.length >= 2) {
    const avg = Math.round(eTrips.reduce((s,t)=>s+(t.daysAbsent||0),0)/eTrips.length);
    insights.push({type:"info",icon:"📊",title:"Travel Capacity Forecast",body:`Average trip: ${avg} days → ~${Math.floor(buffer/avg)} more trips before approach threshold. Longest trip: ${Math.max(...eTrips.map(t=>t.daysAbsent||0))} days.`,action:`Budget ${avg} days per trip`});
  }

  const falloffs = eTrips.filter(t => {
    const ro = D.add(new Date(t.returnDate), 365);
    const d2 = Math.ceil((ro - today) / 86400000);
    return d2 > 0 && d2 <= 90;
  });
  if (falloffs.length > 0) {
    const freed = falloffs.reduce((s,t)=>s+(t.daysAbsent||0),0);
    const soonest = falloffs.reduce((a,b)=>D.add(new Date(a.returnDate),365)<D.add(new Date(b.returnDate),365)?a:b);
    insights.push({type:"success",icon:"♻️",title:`${freed} Days Roll Off Soon`,body:`${freed} absence days drop off your rolling window within 90 days (by ${D.fmt(D.add(new Date(soonest.returnDate),365))}). Your buffer will increase automatically.`,action:`Good time to travel after ${D.fmt(D.add(new Date(soonest.returnDate),365))}`});
  }

  eTrips.forEach(t => {
    if ((t.daysAbsent||0) > 180)
      insights.push({type:"critical",icon:"⛔",title:"Single Trip Exceeds 180 Days",body:`Trip ${D.fmt(t.exitDate)}→${D.fmt(t.returnDate)} was ${t.daysAbsent} days. A single trip >180 days breaks continuous residence. Seek legal advice.`,action:"Seek legal advice immediately"});
  });

  return insights;
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
═══════════════════════════════════════════════════════════════ */
function RiskBadge({ days }) {
  const r = risk(days);
  return <span className="risk-badge" style={{background:`${r.color}18`,color:r.color,border:`1px solid ${r.color}33`}}>{r.dot} {r.level}</span>;
}

function InfoTip({ text }) {
  return (
    <span className="ntip">
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{color:"#555",flexShrink:0}}>
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 7v5M8 5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <span className="tip-box">{text}</span>
    </span>
  );
}

function RingGauge({ value, max=180, size=160 }) {
  const r = risk(value);
  const radius = 60;
  const circ = 2 * Math.PI * radius;
  const pct = Math.min(1, value / max);
  return (
    <div style={{position:"relative",width:size,height:size,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)",position:"absolute"}}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#2d2d2d" strokeWidth={10}/>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={r.color} strokeWidth={10}
          strokeDasharray={`${circ*pct} ${circ*(1-pct)}`} strokeLinecap="round"
          className="ring-path"
          style={{filter:`drop-shadow(0 0 10px ${r.color}66)`}}/>
        {/* threshold markers at 150 and 170 */}
        {[150,170].map(threshold => {
          const a = (threshold/180)*2*Math.PI - Math.PI/2;
          const x1 = size/2 + (radius-8)*Math.cos(a), y1 = size/2 + (radius-8)*Math.sin(a);
          const x2 = size/2 + (radius+8)*Math.cos(a), y2 = size/2 + (radius+8)*Math.sin(a);
          return <line key={threshold} x1={x1} y1={y1} x2={x2} y2={y2} stroke={threshold===150?"#f5a623":"#e50914"} strokeWidth={2} opacity={0.6} style={{transformOrigin:`${size/2}px ${size/2}px`,transform:"rotate(90deg)"}}/>;
        })}
      </svg>
      <div style={{textAlign:"center",zIndex:1}}>
        <div style={{fontSize:30,fontWeight:800,color:r.color,fontFamily:"'DM Mono',monospace",lineHeight:1,animation:value>=170?"glowRed 2s infinite":value>=150?"glowAmber 2s infinite":"none"}}>{value}</div>
        <div style={{fontSize:10,color:"#555",marginTop:2}}>of {max}</div>
        <div style={{fontSize:10,fontWeight:700,color:r.color,letterSpacing:"0.1em",marginTop:3}}>{r.level}</div>
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  const r = risk(v);
  return (
    <div style={{background:"#1f1f1f",border:"1px solid #3d3d3d",borderRadius:6,padding:"10px 14px",boxShadow:"0 8px 32px rgba(0,0,0,0.8)"}}>
      <div style={{fontSize:11,color:"#6b6b6b",marginBottom:4}}>{label}</div>
      <div style={{fontSize:18,fontWeight:700,color:r.color,fontFamily:"'DM Mono',monospace"}}>{v} days</div>
      <div style={{fontSize:11,color:r.color,marginTop:2}}>{r.level}</div>
    </div>
  );
}

/* ─── LIVE CLOCK ─── */
function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(()=>setNow(new Date()),1000); return ()=>clearInterval(t); }, []);
  const h = String(now.getHours()).padStart(2,"0");
  const m = String(now.getMinutes()).padStart(2,"0");
  const s = String(now.getSeconds()).padStart(2,"0");
  const date = now.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",year:"numeric"});
  return (
    <div style={{textAlign:"right",lineHeight:1.2}}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:18,fontWeight:500,color:"#e5e5e5",letterSpacing:"0.05em"}}>
        {h}<span className="clock-colon">:</span>{m}<span style={{fontSize:12,color:"#555",marginLeft:2}}>{s}</span>
      </div>
      <div style={{fontSize:10,color:"#555",marginTop:2}}>{date}</div>
    </div>
  );
}

/* ─── PROMOTE MODAL ─── */
function PromoteModal({ trip, allPastTrips, onConfirm, onClose }) {
  const defaultExit = trip.exitDate;
  const defaultReturn = trip.returnDate;
  const [mode, setMode] = useState("full"); // full | partial | extended
  const [exitDate, setExitDate] = useState(defaultExit);
  const [returnDate, setReturnDate] = useState(defaultReturn);
  const [note, setNote] = useState(trip.note || "");

  const actualDays = exitDate && returnDate && new Date(returnDate) > new Date(exitDate)
    ? Math.round(D.absent(exitDate, returnDate)) : 0;
  const plannedDays = Math.round(D.absent(trip.exitDate, trip.returnDate));
  const diff = actualDays - plannedDays;

  const modePresets = {
    full:     { exit: trip.exitDate, return: trip.returnDate, label: "Exactly as planned" },
    partial:  { exit: trip.exitDate, return: D.iso(D.add(new Date(trip.exitDate), Math.max(2, Math.floor(plannedDays * 0.6)))), label: "Returned early" },
    extended: { exit: trip.exitDate, return: D.iso(D.add(new Date(trip.returnDate), 7)), label: "Stayed longer" },
  };

  function applyMode(m) {
    setMode(m);
    setExitDate(modePresets[m].exit);
    setReturnDate(modePresets[m].return);
  }

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box">
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
          <div>
            <div style={{fontSize:11,color:"var(--nf-red)",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>Promote to Travel Log</div>
            <div style={{fontSize:20,fontWeight:800,letterSpacing:"-0.03em"}}>Mark Trip as Actual</div>
            <div style={{fontSize:13,color:"#6b6b6b",marginTop:4}}>Planned: {D.fmt(trip.exitDate)} → {D.fmt(trip.returnDate)} ({plannedDays} days)</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.06)",border:"1px solid #3d3d3d",color:"#a3a3a3",width:32,height:32,borderRadius:4,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>×</button>
        </div>

        {/* Mode selector */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,color:"#6b6b6b",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>What actually happened?</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            {Object.entries(modePresets).map(([k,v])=>(
              <button key={k} onClick={()=>applyMode(k)} style={{
                padding:"12px 8px",borderRadius:4,cursor:"pointer",
                background: mode===k ? "rgba(229,9,20,0.15)" : "#2a2a2a",
                border: mode===k ? "1px solid rgba(229,9,20,0.5)" : "1px solid #3d3d3d",
                color: mode===k ? "#e50914" : "#a3a3a3",
                fontFamily:"'Inter',sans-serif",fontSize:12,fontWeight:600,transition:"all 0.15s",
                textAlign:"center"
              }}>
                <div style={{fontSize:18,marginBottom:6}}>{k==="full"?"✅":k==="partial"?"🏠":"🌍"}</div>
                <div>{v.label}</div>
              </button>
            ))}
          </div>
          <div style={{marginTop:8,fontSize:12,color:"#555",textAlign:"center"}}>Or enter custom actual dates below ↓</div>
        </div>

        {/* Date inputs */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
          <div>
            <label style={{display:"block",fontSize:11,color:"#6b6b6b",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:7}}>Actual Exit Date</label>
            <input type="date" value={exitDate} onChange={e=>setExitDate(e.target.value)} className="nf-input"/>
          </div>
          <div>
            <label style={{display:"block",fontSize:11,color:"#6b6b6b",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:7}}>Actual Return Date</label>
            <input type="date" value={returnDate} onChange={e=>setReturnDate(e.target.value)} className="nf-input"/>
          </div>
        </div>

        <div style={{marginBottom:20}}>
          <label style={{display:"block",fontSize:11,color:"#6b6b6b",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:7}}>Note (optional)</label>
          <input type="text" value={note} onChange={e=>setNote(e.target.value)} placeholder="e.g. Business trip, extended due to work" className="nf-input"/>
        </div>

        {/* Preview */}
        {actualDays > 0 && (
          <div style={{marginBottom:20,padding:"14px 16px",background:"rgba(229,9,20,0.06)",border:"1px solid rgba(229,9,20,0.2)",borderRadius:6}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:13,color:"#a3a3a3"}}>Actual days absent</span>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:16,fontWeight:700,color:risk(actualDays).color}}>{actualDays} days</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:13,color:"#a3a3a3"}}>vs planned</span>
              <span style={{fontSize:13,fontWeight:600,color:diff>0?"#e50914":diff<0?"#46d369":"#a3a3a3"}}>
                {diff===0?"Exactly as planned":diff>0?`+${diff} days longer`:`${Math.abs(diff)} days shorter`}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{display:"flex",gap:10}}>
          <button className="nf-btn nf-btn-red" style={{flex:1,padding:"12px"}} onClick={()=>{
            if(!exitDate||!returnDate||new Date(returnDate)<=new Date(exitDate)){alert("Check dates");return;}
            onConfirm({exitDate,returnDate,note,id:Date.now(),_promoted:true,_originalNote:trip.note});
          }}>
            ✅ Add to Travel Log
          </button>
          <button className="nf-btn nf-btn-ghost" onClick={onClose}>Cancel</button>
        </div>
        <div style={{marginTop:12,fontSize:11,color:"#555",textAlign:"center"}}>The planned trip will be removed from Future Travel after promotion.</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [trips, setTrips] = useState(()=>{try{return JSON.parse(localStorage.getItem("ilr3_t")||"[]")}catch{return[]}});
  const [future, setFuture] = useState(()=>{try{return JSON.parse(localStorage.getItem("ilr3_f")||"[]")}catch{return[]}});
  const [settings, setSettings] = useState(()=>{try{return JSON.parse(localStorage.getItem("ilr3_s")||"null")||{qualifyingYears:5,residenceStartDate:"",name:"Traveller",visaType:"skilled"}}catch{return{qualifyingYears:5,residenceStartDate:"",name:"Traveller",visaType:"skilled"}}});
  const [tab, setTab] = useState("dashboard");
  const [dashView, setDashView] = useState("current");
  const [newTrip, setNewTrip] = useState({exitDate:"",returnDate:""});
  const [newFut, setNewFut] = useState({exitDate:"",returnDate:"",note:""});
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [uploadPreview, setUploadPreview] = useState([]);
  const [uploadMode, setUploadMode] = useState("merge");
  const [stress, setStress] = useState({days:14,startIn:7,result:null});
  const [editingFuture, setEditingFuture] = useState({});
  const [promoteTrip, setPromoteTrip] = useState(null); // trip to promote
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const fileRef = useRef();

  useEffect(()=>{
    const h = ()=>setIsMobile(window.innerWidth<768);
    window.addEventListener("resize",h);
    return ()=>window.removeEventListener("resize",h);
  },[]);

  useEffect(()=>{localStorage.setItem("ilr3_t",JSON.stringify(trips))},[trips]);
  useEffect(()=>{localStorage.setItem("ilr3_f",JSON.stringify(future))},[future]);
  useEffect(()=>{localStorage.setItem("ilr3_s",JSON.stringify(settings))},[settings]);

  const eTrips = useMemo(()=>trips.map(t=>({...t,daysAbsent:t.exitDate&&t.returnDate?Math.round(D.absent(t.exitDate,t.returnDate)):0})),[trips]);
  const eFuture = useMemo(()=>future.map(t=>({...t,daysAbsent:t.exitDate&&t.returnDate?Math.round(D.absent(t.exitDate,t.returnDate)):0})),[future]);
  const allTrips = useMemo(()=>[...eTrips,...eFuture],[eTrips,eFuture]);

  const rolling = useMemo(()=>buildRolling(eTrips),[eTrips]);
  const fRolling = useMemo(()=>buildRolling(allTrips),[allTrips]);
  const r = risk(rolling.current);
  const fr = risk(fRolling.current);
  const buffer = Math.max(0, 180 - rolling.current);
  const fBuffer = Math.max(0, 180 - fRolling.current);
  const futureTotal = eFuture.reduce((s,t)=>s+t.daysAbsent,0);
  const rbIndex = calcRBI(rolling.current, futureTotal);
  const maxSafe = Math.max(0, 180 - rolling.current - futureTotal - 5);
  const insights = useMemo(()=>generateInsights(eTrips,eFuture,rolling,fRolling,settings),[eTrips,eFuture,rolling,fRolling,settings]);

  const {qualifyDate,earlyAppDate,daysToQ,daysToEarly,qProg} = useMemo(()=>{
    if(!settings.residenceStartDate) return {qualifyDate:null,earlyAppDate:null,daysToQ:null,daysToEarly:null,qProg:0};
    const start = new Date(settings.residenceStartDate);
    const qd = new Date(start); qd.setFullYear(qd.getFullYear()+settings.qualifyingYears);
    const ea = D.add(qd,-28);
    const today = D.today();
    return {
      qualifyDate:qd, earlyAppDate:ea,
      daysToQ: Math.ceil((qd-today)/86400000),
      daysToEarly: Math.ceil((ea-today)/86400000),
      qProg: Math.min(100,Math.max(0,((today-start)/(qd-start))*100))
    };
  },[settings]);

  const addTrip = ()=>{
    if(!newTrip.exitDate||!newTrip.returnDate) return;
    if(new Date(newTrip.returnDate)<=new Date(newTrip.exitDate)){alert("Return must be after exit");return;}
    setTrips(p=>[...p,{...newTrip,id:Date.now()}]);
    setNewTrip({exitDate:"",returnDate:""});
  };
  const addFuture = ()=>{
    if(!newFut.exitDate||!newFut.returnDate) return;
    if(new Date(newFut.returnDate)<=new Date(newFut.exitDate)){alert("Return must be after exit");return;}
    setFuture(p=>[...p,{...newFut,id:Date.now()}]);
    setNewFut({exitDate:"",returnDate:"",note:""});
  };

  // PROMOTE: move future trip to travel log
  const handlePromoteConfirm = (actualTrip) => {
    setTrips(p=>[...p, actualTrip]);
    setFuture(p=>p.filter(t=>t.id!==promoteTrip.id));
    setPromoteTrip(null);
  };

  const startEditF = (t)=>setEditingFuture(p=>({...p,[t.id]:{exitDate:t.exitDate,returnDate:t.returnDate,note:t.note||""}}));
  const saveEditF = (id)=>{
    const ed=editingFuture[id]; if(!ed) return;
    setFuture(p=>p.map(t=>t.id===id?{...t,...ed}:t));
    setEditingFuture(p=>{const n={...p};delete n[id];return n;});
  };
  const cancelEditF = (id)=>setEditingFuture(p=>{const n={...p};delete n[id];return n;});

  const handleFile = useCallback((file)=>{
    const reader=new FileReader();
    reader.onload=(e)=>{
      const rows=parseCSV(e.target.result);
      if(!rows.length){setUploadErrors(["No data found"]);return;}
      const keys=Object.keys(rows[0]);
      const ek=keys.find(k=>/exit|depart/i.test(k))||keys[1];
      const rk=keys.find(k=>/return|arriv/i.test(k))||keys[2];
      const errors=[],valid=[];
      rows.forEach((row,i)=>{
        const re=row[ek]||"",rr=row[rk]||"";
        if(!re||!rr){errors.push(`Row ${i+2}: missing dates`);return;}
        const ed=D.parse(re),rd=D.parse(rr);
        if(!ed||isNaN(ed)){errors.push(`Row ${i+2}: invalid exit "${re}"`);return;}
        if(!rd||isNaN(rd)){errors.push(`Row ${i+2}: invalid return "${rr}"`);return;}
        if(rd<=ed){errors.push(`Row ${i+2}: return before exit`);return;}
        valid.push({id:Date.now()+i,exitDate:D.iso(ed),returnDate:D.iso(rd)});
      });
      setUploadErrors(errors);setUploadPreview(valid);
    };
    reader.readAsText(file);
  },[]);

  const confirmUpload = ()=>{
    const today=D.iso(D.today());
    const past=uploadPreview.filter(t=>t.exitDate<=today);
    const fut=uploadPreview.filter(t=>t.exitDate>today);
    if(uploadMode==="replace"){setTrips(past);setFuture(fut);}
    else{
      setTrips(p=>{const ex=new Set(p.map(t=>`${t.exitDate}_${t.returnDate}`));return[...p,...past.filter(t=>!ex.has(`${t.exitDate}_${t.returnDate}`))]});
      setFuture(p=>{const ex=new Set(p.map(t=>`${t.exitDate}_${t.returnDate}`));return[...p,...fut.filter(t=>!ex.has(`${t.exitDate}_${t.returnDate}`))]});
    }
    setUploadModal(false);setUploadPreview([]);setUploadErrors([]);
  };

  const runStress = ()=>{
    const today=D.today();
    const ht={id:"st",exitDate:D.iso(D.add(today,stress.startIn)),returnDate:D.iso(D.add(today,stress.startIn+stress.days+1))};
    const tr=buildRolling([...eTrips,...eFuture,ht]);
    setStress(s=>({...s,result:{peak:tr.peak,wouldBreach:tr.peak>=180,buffer:180-tr.peak}}));
  };

  const genReport = ()=>{
    const html=`<!DOCTYPE html><html><head><title>ILR Report — ${settings.name}</title>
<style>body{font-family:Georgia,serif;max-width:820px;margin:50px auto;color:#111;line-height:1.6}
h1{font-size:28px;margin-bottom:4px;border-bottom:3px solid #e50914;padding-bottom:10px}
h2{font-size:16px;margin:28px 0 10px;color:#333;border-bottom:1px solid #eee;padding-bottom:5px}
.r{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #f5f5f5;font-size:14px}
table{width:100%;border-collapse:collapse;margin-top:12px;font-size:13px}
th,td{border:1px solid #e5e5e5;padding:8px 12px}th{background:#f5f5f5}
.safe{color:#46d369}.amber,.caution{color:#f5a623}.red,.breach{color:#e50914}
.footer{margin-top:40px;padding:12px;background:#f9f9f9;font-size:11px;color:#888;border-left:3px solid #ddd}
</style></head><body>
<h1>🛡️ ILR Compliance Report</h1>
<p style="color:#666;font-size:13px">Generated ${new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})} · ${settings.name}</p>
<h2>Summary</h2>
<div class="r"><span>Rolling 12-Month Absences</span><span class="${r.level.toLowerCase()}">${rolling.current} days (${r.level})</span></div>
<div class="r"><span>Buffer Remaining</span><span>${buffer} days</span></div>
<div class="r"><span>Peak Rolling (Historical)</span><span>${rolling.peak} days — ${D.fmt(rolling.peakDate)}</span></div>
<div class="r"><span>Risk Buffer Index</span><span>${rbIndex}/100</span></div>
<div class="r"><span>Total Trips</span><span>${eTrips.length}</span></div>
${settings.residenceStartDate?`<div class="r"><span>ILR Qualifying Date</span><span>${D.fmt(qualifyDate)}</span></div>
<div class="r"><span>Earliest Application (28-day rule)</span><span>${D.fmt(earlyAppDate)}</span></div>`:""}
<h2>Travel History</h2>
<table><tr><th>#</th><th>Exit</th><th>Return</th><th>Days Absent</th><th>Rolling at Return</th><th>Status</th></tr>
${eTrips.map((t,i)=>{const rr=D.rolling(eTrips,new Date(t.returnDate));const rv=risk(rr);return`<tr><td>${i+1}</td><td>${D.fmt(t.exitDate)}</td><td>${D.fmt(t.returnDate)}</td><td>${t.daysAbsent}</td><td>${rr}</td><td class="${rv.level.toLowerCase()}">${rv.level}</td></tr>`}).join("")}
</table>
${eFuture.length?`<h2>Planned Future Travel</h2>
<table><tr><th>Exit</th><th>Return</th><th>Days</th><th>Note</th></tr>
${eFuture.map(t=>`<tr><td>${D.fmt(t.exitDate)}</td><td>${D.fmt(t.returnDate)}</td><td>${t.daysAbsent}</td><td>${t.note||"—"}</td></tr>`).join("")}
</table>`:""}
<div class="footer">For informational purposes only. Not legal advice. Verify compliance with UKVI.</div>
</body></html>`;
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([html],{type:"text/html"}));a.download=`ILR_Report_${settings.name.replace(/\s+/g,"_")}.html`;a.click();
  };

  /* ── STYLE HELPERS ── */
  const lbl = {display:"block",fontSize:11,fontWeight:600,color:"#6b6b6b",marginBottom:7,letterSpacing:"0.08em",textTransform:"uppercase"};
  const displayRolling = dashView==="simulation" ? fRolling : rolling;
  const displayCurrent = dashView==="simulation" ? fRolling.current : rolling.current;
  const displayBuffer  = dashView==="simulation" ? fBuffer : buffer;
  const displayRBI     = dashView==="simulation" ? Math.max(0,Math.round(((180-fRolling.current)/180)*100)) : rbIndex;
  const displayRisk    = risk(displayCurrent);

  const TABS = [
    {id:"dashboard",icon:"⬡",label:"Home"},
    {id:"travel-log",icon:"✈",label:"Trips"},
    {id:"future",icon:"◎",label:"Future"},
    {id:"advisor",icon:"◆",label:"Advisor"},
    {id:"settings",icon:"⚙",label:"Settings"},
  ];

  const insightColors = {critical:"#e50914",warning:"#f5a623",info:"#0096d6",success:"#46d369"};

  /* ─── FUTURE TRIPS: flag those that have passed or started ─── */
  const today = D.today();
  const activeOrPastFuture = eFuture.filter(t => new Date(t.exitDate) <= D.add(today, 2)); // started or imminent

  return (
    <>
      <GlobalStyles />
      {promoteTrip && (
        <PromoteModal
          trip={promoteTrip}
          allPastTrips={eTrips}
          onConfirm={handlePromoteConfirm}
          onClose={()=>setPromoteTrip(null)}
        />
      )}

      <div style={{minHeight:"100vh",background:"var(--nf-black)",paddingTop:0}}>

        {/* ─── HEADER ─── */}
        <header style={{
          background:"rgba(20,20,20,0.97)", borderBottom:"1px solid #2d2d2d",
          position:"sticky", top:0, zIndex:40,
          backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
          paddingTop:"env(safe-area-inset-top, 0px)"
        }}>
          <div style={{maxWidth:1200,margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{display:"flex",alignItems:"center",gap:3}}>
                <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:"var(--nf-red)",letterSpacing:"0.05em",lineHeight:1}}>ILR</span>
                <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:"#e5e5e5",letterSpacing:"0.05em",lineHeight:1}}>COPILOT</span>
              </div>
              <div style={{width:1,height:28,background:"#2d2d2d"}}/>
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 12px",background:"rgba(255,255,255,0.04)",borderRadius:4,border:"1px solid #2d2d2d"}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:r.color,boxShadow:`0 0 8px ${r.color}`,animation:rolling.current>=150?"pulseRed 2s infinite":"none"}}/>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:r.color}}>{rolling.current}/180</span>
                <span style={{fontSize:11,color:"#555"}}>{r.level}</span>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <LiveClock/>
              {!isMobile && (
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setUploadModal(true)} className="nf-btn nf-btn-ghost nf-btn-sm">📤 Upload</button>
                  <button onClick={genReport} className="nf-btn nf-btn-red nf-btn-sm">📄 Export</button>
                </div>
              )}
            </div>
          </div>
          {/* Desktop tabs */}
          {!isMobile && (
            <div style={{maxWidth:1200,margin:"0 auto",padding:"0 20px",display:"flex",gap:0}}>
              {TABS.map(({id,icon,label})=>(
                <button key={id} className={`nf-tab${tab===id?" active":""}`} onClick={()=>setTab(id)}>
                  <span>{icon}</span>{label}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Disclaimer */}
        <div style={{background:"#1a1a1a",borderBottom:"1px solid #2d2d2d",padding:"7px 20px",fontSize:11,color:"#555",textAlign:"center"}}>
          ⚠ For informational purposes only · Not legal advice · Verify with UK Visas &amp; Immigration
        </div>

        {/* Promote alert banner — if any future trips have started */}
        {activeOrPastFuture.length > 0 && (
          <div style={{background:"rgba(229,9,20,0.08)",borderBottom:"1px solid rgba(229,9,20,0.2)",padding:"10px 20px"}}>
            <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:18}}>🛬</span>
                <span style={{fontSize:13,fontWeight:600,color:"#e5e5e5"}}>
                  {activeOrPastFuture.length} planned trip{activeOrPastFuture.length>1?"s":""} {activeOrPastFuture.length>1?"have":"has"} started or passed
                </span>
                <span style={{fontSize:12,color:"#6b6b6b"}}>— Move them to your Travel Log</span>
              </div>
              <button className="nf-btn nf-btn-red nf-btn-sm" onClick={()=>setTab("future")}>
                Review & Promote →
              </button>
            </div>
          </div>
        )}

        {/* ─── MAIN CONTENT ─── */}
        <main style={{maxWidth:1200,margin:"0 auto",padding:`24px 20px ${isMobile?"90px":"24px"}`,animation:"fadeIn 0.3s ease"}}>

          {/* ═══════ DASHBOARD ═══════ */}
          {tab==="dashboard" && (
            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22,flexWrap:"wrap",gap:12}}>
                <div>
                  <h1 style={{fontSize:isMobile?22:28,fontWeight:800,letterSpacing:"-0.04em",color:"#fff",marginBottom:2}}>
                    {settings.name==="Traveller"?"Your Dashboard":settings.name+"'s Dashboard"}
                  </h1>
                  <p style={{fontSize:13,color:"#6b6b6b"}}>{dashView==="current"?"Live compliance view":"Simulation with planned trips"}</p>
                </div>
                <div className="pill-group">
                  <button className={`pill${dashView==="current"?" on":""}`} onClick={()=>setDashView("current")}>Live</button>
                  <button className={`pill${dashView==="simulation"?" on":""}`} onClick={()=>setDashView("simulation")}>
                    Simulation {eFuture.length>0&&<span style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"0 5px",fontSize:10,marginLeft:3}}>{eFuture.length}</span>}
                  </button>
                </div>
              </div>

              {dashView==="simulation" && (
                <div style={{background:"rgba(0,150,214,0.07)",border:"1px solid rgba(0,150,214,0.2)",borderRadius:6,padding:"12px 16px",marginBottom:20,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                  <span style={{fontSize:18}}>🔮</span>
                  <span style={{fontSize:13,color:"#0096d6",fontWeight:600}}>Simulation — </span>
                  <span style={{fontSize:13,color:"#6b6b6b"}}>{eFuture.length===0?"No planned trips. Add them in Future Travel.":` ${eFuture.length} trip(s) adding ${futureTotal} days projected.`}</span>
                  {eFuture.length===0&&<button className="nf-btn nf-btn-ghost nf-btn-sm" onClick={()=>setTab("future")}>+ Add Trips</button>}
                </div>
              )}

              {/* Hero row */}
              <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":`200px 1fr`,gap:16,marginBottom:16}}>
                {/* Ring */}
                <div className="nf-card" style={{padding:24,display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
                  <RingGauge value={displayCurrent} size={isMobile?150:175}/>
                  <div style={{width:"100%"}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#555",marginBottom:5}}>
                      <span>0</span><span style={{color:"#f5a623"}}>150</span><span style={{color:"#e50914"}}>170</span><span>180</span>
                    </div>
                    <div style={{height:5,background:"#2d2d2d",borderRadius:99,overflow:"hidden"}}>
                      <div className="progress-bar" style={{height:"100%",width:`${Math.min(100,(displayCurrent/180)*100)}%`,background:displayCurrent>=170?"#e50914":displayCurrent>=150?"#f5a623":"#46d369",borderRadius:99}}/>
                    </div>
                  </div>
                </div>

                {/* KPIs */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
                  {[
                    {label:"Buffer",tip:"Days remaining before 180-day breach",value:displayBuffer,unit:"days",color:displayRisk.color,badge:displayRisk.level},
                    {label:"Risk Buffer Index",tip:`Composite safety score. 100=max safety, 0=breach. Formula: ((180 − ${rolling.current} current − ${futureTotal} planned) ÷ 180) × 100`,value:displayRBI,unit:"/ 100",color:displayRBI>60?"#46d369":displayRBI>30?"#f5a623":"#e50914",bar:true,barVal:displayRBI},
                    {label:"Peak Rolling",tip:`Highest rolling 12-month total ever. Recorded on ${D.fmt(displayRolling.peakDate)}. The window rolls forward daily — not calendar year.`,value:displayRolling.peak,unit:"days peak",color:risk(displayRolling.peak).color},
                    {label:"ILR Countdown",value:daysToQ!=null?(daysToQ<=0?"✓":daysToQ):"—",unit:daysToQ!=null?(daysToQ<=0?"Eligible now":"days to qualify"):"Set in Settings",color:daysToQ!=null&&daysToQ<=0?"#46d369":"#e5e5e5",prog:settings.residenceStartDate?{val:qProg,color:"#e50914"}:null},
                  ].map((c,i)=>(
                    <div key={i} className="nf-card" style={{padding:16,borderTop:`2px solid ${c.color}`}}>
                      <div style={{fontSize:10,color:"#6b6b6b",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:7,display:"flex",alignItems:"center",gap:4}}>
                        {c.label}{c.tip&&<InfoTip text={c.tip}/>}
                      </div>
                      <div style={{fontSize:28,fontWeight:800,fontFamily:"'DM Mono',monospace",color:c.color,lineHeight:1}}>{c.value}</div>
                      <div style={{fontSize:11,color:"#555",marginTop:4}}>{c.unit}</div>
                      {c.badge&&<div style={{marginTop:8}}><RiskBadge days={displayCurrent}/></div>}
                      {c.bar&&<div style={{marginTop:8,height:4,background:"#2d2d2d",borderRadius:99,overflow:"hidden"}}><div className="progress-bar" style={{height:"100%",width:`${c.barVal}%`,background:c.color,borderRadius:99}}/></div>}
                      {c.prog&&<div style={{marginTop:8}}><div style={{height:3,background:"#2d2d2d",borderRadius:99,overflow:"hidden"}}><div className="progress-bar" style={{height:"100%",width:`${c.prog.val}%`,background:c.prog.color,borderRadius:99}}/></div><div style={{fontSize:10,color:"#555",marginTop:4}}>{Math.round(c.prog.val)}% complete</div></div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="nf-card" style={{padding:20}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:10}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:14,marginBottom:2}}>{dashView==="simulation"?"Projected":"Historical"} Rolling 12-Month Window</div>
                    <div style={{fontSize:12,color:"#6b6b6b"}}>Weekly samples · Each point = total absent days in trailing 365 days</div>
                  </div>
                  <div style={{display:"flex",gap:12,fontSize:11,color:"#555"}}>
                    <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:16,height:2,background:"#f5a623",display:"inline-block",borderRadius:1}}/> 150</span>
                    <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:16,height:2,background:"#e50914",display:"inline-block",borderRadius:1}}/> 180</span>
                  </div>
                </div>
                {displayRolling.chartData.length>0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={displayRolling.chartData.slice(-60)}>
                      <defs>
                        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={dashView==="simulation"?"#7c3aed":"#e50914"} stopOpacity={0.25}/>
                          <stop offset="95%" stopColor={dashView==="simulation"?"#7c3aed":"#e50914"} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tick={{fill:"#3d3d3d",fontSize:10}} tickLine={false} axisLine={false} tickFormatter={v=>v.slice(5)}/>
                      <YAxis domain={[0,200]} tick={{fill:"#3d3d3d",fontSize:10}} tickLine={false} axisLine={false} tickFormatter={v=>`${v}d`}/>
                      <Tooltip content={<ChartTooltip/>}/>
                      <ReferenceLine y={180} stroke="#e50914" strokeDasharray="4 4" strokeWidth={1.5}/>
                      <ReferenceLine y={150} stroke="#f5a623" strokeDasharray="4 4" strokeWidth={1.5}/>
                      <Area type="monotone" dataKey="absences" stroke={dashView==="simulation"?"#7c3aed":"#e50914"} fill="url(#cg)" strokeWidth={2} dot={false}/>
                    </AreaChart>
                  </ResponsiveContainer>
                ):(
                  <div style={{height:200,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10}}>
                    <div style={{fontSize:36}}>✈️</div>
                    <div style={{fontWeight:600,color:"#a3a3a3"}}>No travel data yet</div>
                    <div style={{fontSize:13,color:"#555"}}>Add trips in Travel Log to see your rolling window</div>
                    <button className="nf-btn nf-btn-red nf-btn-sm" onClick={()=>setTab("travel-log")}>Add First Trip</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════ TRAVEL LOG ═══════ */}
          {tab==="travel-log" && (
            <div>
              <div style={{marginBottom:20}}>
                <h2 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em",marginBottom:4}}>Travel Log</h2>
                <p style={{fontSize:13,color:"#6b6b6b"}}>Complete history of past trips · Departure &amp; return days excluded from absence count</p>
              </div>

              <div className="nf-card" style={{padding:20,marginBottom:16}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>Add Past Trip</div>
                <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr auto",gap:14,alignItems:"flex-end"}}>
                  <div>
                    <label style={lbl}>Exit Date</label>
                    <input type="date" value={newTrip.exitDate} onChange={e=>setNewTrip(s=>({...s,exitDate:e.target.value}))} className="nf-input"/>
                  </div>
                  <div>
                    <label style={lbl}>Return Date</label>
                    <input type="date" value={newTrip.returnDate} onChange={e=>setNewTrip(s=>({...s,returnDate:e.target.value}))} className="nf-input"/>
                  </div>
                  <button onClick={addTrip} className="nf-btn nf-btn-red" style={{padding:"10px 24px"}}>+ Add</button>
                </div>
                {newTrip.exitDate&&newTrip.returnDate&&new Date(newTrip.returnDate)>new Date(newTrip.exitDate)&&(
                  <div style={{marginTop:12,padding:"8px 14px",background:"rgba(229,9,20,0.07)",borderRadius:4,fontSize:13,color:"#a3a3a3",display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,color:"#e5e5e5"}}>{Math.round(D.absent(newTrip.exitDate,newTrip.returnDate))} days absent</span>
                    <span>→ {D.fmt(newTrip.exitDate)} to {D.fmt(newTrip.returnDate)}</span>
                  </div>
                )}
              </div>

              <div className="nf-card" style={{overflow:"hidden",padding:0}}>
                <div style={{padding:"16px 20px",borderBottom:"1px solid #2d2d2d",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                  <div style={{fontWeight:700,fontSize:14}}>Travel History</div>
                  <div style={{display:"flex",gap:14,fontSize:12,color:"#6b6b6b"}}>
                    <span>{eTrips.length} trips</span>
                    <span>·</span><span>{eTrips.reduce((s,t)=>s+t.daysAbsent,0)} total days</span>
                    <span>·</span><span style={{color:r.color}}>{rolling.current} rolling</span>
                  </div>
                </div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",minWidth:isMobile?500:0}}>
                    <thead>
                      <tr style={{background:"#1a1a1a"}}>
                        {["#","Exit","Return","Days","Rolling","Status",""].map(h=>(
                          <th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:10,color:"#555",fontWeight:700,borderBottom:"1px solid #2d2d2d",letterSpacing:"0.08em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {eTrips.length===0?(
                        <tr><td colSpan={7} style={{padding:"48px 20px",textAlign:"center",color:"#555"}}>
                          <div style={{fontSize:32,marginBottom:10}}>🗺️</div>
                          <div style={{fontWeight:600,color:"#a3a3a3",marginBottom:6}}>No trips yet</div>
                          <div style={{fontSize:13}}>Add above or upload a CSV</div>
                        </td></tr>
                      ):eTrips.map((t,i)=>{
                        const rr=D.rolling(eTrips,new Date(t.returnDate));
                        const tr=risk(rr);
                        return(
                          <tr key={t.id} className="row-hover" style={{borderBottom:"1px solid rgba(45,45,45,0.6)"}}>
                            <td style={{padding:"12px 16px",fontSize:11,color:"#555",fontFamily:"'DM Mono',monospace"}}>{i+1}</td>
                            <td style={{padding:"12px 16px",fontSize:13,fontWeight:500}}>{D.fmt(t.exitDate)}</td>
                            <td style={{padding:"12px 16px",fontSize:13,fontWeight:500}}>{D.fmt(t.returnDate)}</td>
                            <td style={{padding:"12px 16px",fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:14}}>{t.daysAbsent}</td>
                            <td style={{padding:"12px 16px"}}>
                              <span style={{fontFamily:"'DM Mono',monospace",color:tr.color,fontWeight:600}}>{rr}</span>
                              <span style={{fontSize:11,color:"#555"}}>/180</span>
                            </td>
                            <td style={{padding:"12px 16px"}}><RiskBadge days={rr}/></td>
                            <td style={{padding:"12px 16px"}}>
                              <button onClick={()=>setTrips(p=>p.filter(x=>x.id!==t.id))} style={{background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:16,padding:"4px 8px",borderRadius:4,transition:"color 0.15s"}} onMouseOver={e=>e.target.style.color="#e50914"} onMouseOut={e=>e.target.style.color="#555"}>×</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════ FUTURE TRAVEL ═══════ */}
          {tab==="future" && (
            <div>
              <div style={{marginBottom:20}}>
                <h2 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em",marginBottom:4}}>Future Travel</h2>
                <p style={{fontSize:13,color:"#6b6b6b"}}>Plan, simulate, and promote trips to your actual travel log</p>
              </div>

              {/* Stats row */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:16}}>
                {[
                  {label:"Max Safe Additional",value:maxSafe,unit:"days",color:"#46d369",tip:`180 − ${rolling.current} current − ${futureTotal} planned − 5 safety buffer = ${maxSafe}`},
                  {label:"Planned Trips",value:eFuture.length,unit:`${futureTotal} days booked`,color:"#0096d6"},
                  {label:"Projected Peak",value:fRolling.peak,unit:"days",color:risk(fRolling.peak).color},
                  {label:"Buffer After",value:fBuffer,unit:"days",color:fBuffer<20?"#e50914":fBuffer<40?"#f5a623":"#46d369"},
                ].map((c,i)=>(
                  <div key={i} className="nf-card" style={{padding:16,borderTop:`2px solid ${c.color}`}}>
                    <div style={{fontSize:10,color:"#6b6b6b",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6,display:"flex",alignItems:"center",gap:4}}>{c.label}{c.tip&&<InfoTip text={c.tip}/>}</div>
                    <div style={{fontSize:26,fontWeight:800,fontFamily:"'DM Mono',monospace",color:c.color,lineHeight:1}}>{c.value}</div>
                    <div style={{fontSize:11,color:"#555",marginTop:4}}>{c.unit}</div>
                  </div>
                ))}
              </div>

              {/* Add future trip */}
              <div className="nf-card" style={{padding:20,marginBottom:16}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>Plan New Trip</div>
                <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr 1fr auto",gap:14,alignItems:"flex-end"}}>
                  <div><label style={lbl}>Exit Date</label><input type="date" value={newFut.exitDate} onChange={e=>setNewFut(s=>({...s,exitDate:e.target.value}))} className="nf-input"/></div>
                  <div><label style={lbl}>Return Date</label><input type="date" value={newFut.returnDate} onChange={e=>setNewFut(s=>({...s,returnDate:e.target.value}))} className="nf-input"/></div>
                  <div><label style={lbl}>Note</label><input type="text" placeholder="e.g. Business, holiday…" value={newFut.note} onChange={e=>setNewFut(s=>({...s,note:e.target.value}))} className="nf-input"/></div>
                  <button onClick={addFuture} className="nf-btn nf-btn-red" style={{padding:"10px 24px"}}>+ Plan</button>
                </div>
                {newFut.exitDate&&newFut.returnDate&&new Date(newFut.returnDate)>new Date(newFut.exitDate)&&(()=>{
                  const days=Math.round(D.absent(newFut.exitDate,newFut.returnDate));
                  const hr=risk(buildRolling([...allTrips,{exitDate:newFut.exitDate,returnDate:newFut.returnDate}]).peak);
                  return <div style={{marginTop:12,padding:"8px 14px",background:`${hr.color}0f`,border:`1px solid ${hr.color}25`,borderRadius:4,fontSize:13,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
                    <span style={{fontFamily:"'DM Mono',monospace",fontWeight:700}}>{days} days</span>
                    <span style={{color:"#6b6b6b"}}>Projected peak: <span style={{color:hr.color,fontWeight:600}}>{buildRolling([...allTrips,{exitDate:newFut.exitDate,returnDate:newFut.returnDate}]).peak}</span> days ({hr.level})</span>
                  </div>;
                })()}
              </div>

              {/* Future trips table — editable + promote */}
              <div className="nf-card" style={{overflow:"hidden",padding:0}}>
                <div style={{padding:"16px 20px",borderBottom:"1px solid #2d2d2d",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:14}}>Planned Trips</div>
                    <div style={{fontSize:12,color:"#6b6b6b",marginTop:2}}>
                      Inline editable · Click ✅ Promote to move a trip to your actual Travel Log
                    </div>
                  </div>
                  {activeOrPastFuture.length>0&&(
                    <div style={{padding:"6px 12px",background:"rgba(229,9,20,0.1)",border:"1px solid rgba(229,9,20,0.3)",borderRadius:4,fontSize:12,color:"#e50914",fontWeight:600}}>
                      {activeOrPastFuture.length} trip{activeOrPastFuture.length>1?"s":""} ready to promote
                    </div>
                  )}
                </div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
                    <thead>
                      <tr style={{background:"#1a1a1a"}}>
                        {["Status","Exit","Return","Days","Note","Impact","Actions"].map(h=>(
                          <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:10,color:"#555",fontWeight:700,borderBottom:"1px solid #2d2d2d",letterSpacing:"0.08em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {eFuture.length===0?(
                        <tr><td colSpan={7} style={{padding:"48px 20px",textAlign:"center",color:"#555"}}>
                          <div style={{fontSize:32,marginBottom:10}}>🛫</div>
                          <div style={{fontWeight:600,color:"#a3a3a3",marginBottom:6}}>No planned trips</div>
                          <div style={{fontSize:13}}>Add a trip above to simulate its compliance impact</div>
                        </td></tr>
                      ):eFuture.map(t=>{
                        const ed=editingFuture[t.id];
                        const isEditing=!!ed;
                        const tripDate=new Date(t.exitDate);
                        const hasStarted=tripDate<=today;
                        const isImminent=tripDate<=D.add(today,2)&&!hasStarted;
                        const roleStatus=hasStarted?"past":isImminent?"imminent":"future";
                        const statusColors={past:"#e50914",imminent:"#f5a623",future:"#46d369"};
                        const statusLabels={past:"Needs Promotion",imminent:"Starting Soon",future:"Planned"};
                        const editedDays=ed?.exitDate&&ed?.returnDate?Math.round(D.absent(ed.exitDate,ed.returnDate)):t.daysAbsent;
                        const rolW=D.rolling(allTrips,new Date(t.returnDate));
                        const tr=risk(rolW);
                        const baseRol=D.rolling(eTrips,new Date(t.returnDate));
                        const impact=rolW-baseRol;
                        return(
                          <tr key={t.id} className="row-hover" style={{borderBottom:"1px solid rgba(45,45,45,0.6)",background:hasStarted?"rgba(229,9,20,0.04)":isEditing?"rgba(0,150,214,0.04)":"transparent"}}>
                            <td style={{padding:"12px 14px"}}>
                              <span style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",color:statusColors[roleStatus],background:`${statusColors[roleStatus]}15`,border:`1px solid ${statusColors[roleStatus]}33`,borderRadius:3,padding:"3px 8px",fontFamily:"'DM Mono',monospace"}}>
                                {statusLabels[roleStatus]}
                              </span>
                            </td>
                            <td style={{padding:"12px 14px"}}>
                              {isEditing?(
                                <input type="date" value={ed.exitDate} className="nf-input-inline" style={{width:130}} onChange={e=>setEditingFuture(p=>({...p,[t.id]:{...p[t.id],exitDate:e.target.value}}))}/>
                              ):(
                                <span onClick={()=>startEditF(t)} style={{cursor:"text",fontSize:13,fontWeight:500,borderBottom:"1px dashed #3d3d3d",paddingBottom:1}}>{D.fmt(t.exitDate)}</span>
                              )}
                            </td>
                            <td style={{padding:"12px 14px"}}>
                              {isEditing?(
                                <input type="date" value={ed.returnDate} className="nf-input-inline" style={{width:130}} onChange={e=>setEditingFuture(p=>({...p,[t.id]:{...p[t.id],returnDate:e.target.value}}))}/>
                              ):(
                                <span onClick={()=>startEditF(t)} style={{cursor:"text",fontSize:13,fontWeight:500,borderBottom:"1px dashed #3d3d3d",paddingBottom:1}}>{D.fmt(t.returnDate)}</span>
                              )}
                            </td>
                            <td style={{padding:"12px 14px",fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:13,color:isEditing?"#0096d6":undefined}}>
                              {isEditing?editedDays:t.daysAbsent}
                            </td>
                            <td style={{padding:"12px 14px",maxWidth:160}}>
                              {isEditing?(
                                <input type="text" value={ed.note} placeholder="Note…" className="nf-input-inline" onChange={e=>setEditingFuture(p=>({...p,[t.id]:{...p[t.id],note:e.target.value}}))}/>
                              ):(
                                <span onClick={()=>startEditF(t)} style={{cursor:"text",fontSize:13,color:t.note?"#e5e5e5":"#555",borderBottom:"1px dashed #3d3d3d",paddingBottom:1}}>{t.note||"Add note…"}</span>
                              )}
                            </td>
                            <td style={{padding:"12px 14px"}}>
                              <span style={{fontFamily:"'DM Mono',monospace",color:tr.color,fontWeight:600}}>{rolW}</span>
                              <span style={{fontSize:11,color:"#555"}}>/180</span>
                              <div style={{marginTop:4}}><span style={{fontSize:11,color:impact>0?"#f5a623":"#46d369"}}>+{impact}d</span></div>
                            </td>
                            <td style={{padding:"12px 14px"}}>
                              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                                {!isEditing&&(
                                  <button
                                    className="nf-btn nf-btn-promote nf-btn-sm"
                                    onClick={()=>setPromoteTrip(t)}
                                    title="Move to actual Travel Log"
                                  >✅ Promote</button>
                                )}
                                {isEditing?(
                                  <>
                                    <button onClick={()=>saveEditF(t.id)} className="nf-btn nf-btn-promote nf-btn-sm">Save</button>
                                    <button onClick={()=>cancelEditF(t.id)} className="nf-btn nf-btn-ghost nf-btn-sm">Cancel</button>
                                  </>
                                ):(
                                  <>
                                    <button onClick={()=>startEditF(t)} className="nf-btn nf-btn-edit nf-btn-sm">Edit</button>
                                    <button onClick={()=>setFuture(p=>p.filter(x=>x.id!==t.id))} className="nf-btn nf-btn-danger nf-btn-sm">✕</button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{padding:"12px 20px",background:"#1a1a1a",borderTop:"1px solid #2d2d2d",fontSize:12,color:"#555"}}>
                  💡 When a trip is done, click <span style={{color:"#46d369",fontWeight:600}}>✅ Promote</span> to log what actually happened — full, partial return, or extended stay.
                </div>
              </div>
            </div>
          )}

          {/* ═══════ AI ADVISOR ═══════ */}
          {tab==="advisor" && (
            <div>
              <div style={{marginBottom:20}}>
                <h2 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em",marginBottom:4}}>AI Advisor</h2>
                <p style={{fontSize:13,color:"#6b6b6b"}}>{insights.length} active insight{insights.length!==1?"s":""} · Rule-based compliance intelligence</p>
              </div>

              {/* Insights */}
              <div style={{marginBottom:24}}>
                {insights.length===0?(
                  <div className="nf-card" style={{padding:48,textAlign:"center"}}>
                    <div style={{fontSize:40,marginBottom:12}}>🤖</div>
                    <div style={{fontWeight:600,fontSize:15,color:"#a3a3a3",marginBottom:6}}>No data to analyse yet</div>
                    <div style={{fontSize:13,color:"#555",marginBottom:16}}>Add travel history to activate the AI Advisor</div>
                    <button className="nf-btn nf-btn-red" onClick={()=>setTab("travel-log")}>Add Trips</button>
                  </div>
                ):insights.map((ins,i)=>(
                  <div key={i} className="insight-row" style={{background:`${insightColors[ins.type]}0a`,borderColor:insightColors[ins.type]}}>
                    <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                      <span style={{fontSize:22,flexShrink:0}}>{ins.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:14,color:insightColors[ins.type],marginBottom:5,letterSpacing:"-0.01em"}}>{ins.title}</div>
                        <div style={{fontSize:13,color:"#a3a3a3",lineHeight:1.6}}>{ins.body}</div>
                        <div style={{marginTop:8,display:"inline-flex",alignItems:"center",gap:6,padding:"4px 12px",background:`${insightColors[ins.type]}15`,borderRadius:4,fontSize:11,fontWeight:700,color:insightColors[ins.type],letterSpacing:"0.04em"}}>
                          → {ins.action}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stress test + chart grid */}
              <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16,marginBottom:16}}>
                <div className="nf-card" style={{padding:20}}>
                  <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>⚡ Stress Test</div>
                  <div style={{fontSize:12,color:"#6b6b6b",marginBottom:16}}>Simulate an emergency unplanned trip</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                    <div><label style={lbl}>Starts in (days)</label><input type="number" min={0} max={365} value={stress.startIn} onChange={e=>setStress(s=>({...s,startIn:Number(e.target.value),result:null}))} className="nf-input"/></div>
                    <div><label style={lbl}>Duration (days)</label><input type="number" min={1} max={180} value={stress.days} onChange={e=>setStress(s=>({...s,days:Number(e.target.value),result:null}))} className="nf-input"/></div>
                  </div>
                  <button onClick={runStress} className="nf-btn nf-btn-red" style={{width:"100%",marginBottom:12}}>Run Stress Test</button>
                  {stress.result&&(
                    <div style={{padding:14,background:`${stress.result.wouldBreach?"#e50914":"#46d369"}0f`,borderRadius:4,border:`1px solid ${stress.result.wouldBreach?"#e50914":"#46d369"}30`}}>
                      <div style={{fontWeight:700,color:stress.result.wouldBreach?"#e50914":"#46d369",fontSize:14,marginBottom:6}}>
                        {stress.result.wouldBreach?"🚨 WOULD BREACH":"✅ SAFE"}
                      </div>
                      <div style={{fontSize:13,color:"#a3a3a3"}}>
                        Peak: <span style={{fontFamily:"'DM Mono',monospace",color:"#e5e5e5",fontWeight:600}}>{stress.result.peak} days</span>
                        {" · "}Buffer: <span style={{fontFamily:"'DM Mono',monospace",color:stress.result.buffer<10?"#e50914":"#e5e5e5",fontWeight:600}}>{stress.result.buffer} days</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="nf-card" style={{padding:20}}>
                  <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>Monthly Profile</div>
                  <div style={{fontSize:12,color:"#6b6b6b",marginBottom:12}}>Rolling total · Past 12 + 6 forecast</div>
                  {rolling.monthlyData.length>0?(
                    <ResponsiveContainer width="100%" height={170}>
                      <BarChart data={rolling.monthlyData} barSize={10}>
                        <XAxis dataKey="label" tick={{fill:"#3d3d3d",fontSize:9}} tickLine={false} axisLine={false}/>
                        <YAxis domain={[0,200]} tick={{fill:"#3d3d3d",fontSize:9}} tickLine={false} axisLine={false}/>
                        <Tooltip content={<ChartTooltip/>}/>
                        <ReferenceLine y={180} stroke="#e50914" strokeDasharray="3 3" strokeWidth={1}/>
                        <ReferenceLine y={150} stroke="#f5a623" strokeDasharray="3 3" strokeWidth={1}/>
                        <Bar dataKey="absences" radius={[2,2,0,0]}>
                          {rolling.monthlyData.map((entry,i)=>(
                            <Cell key={i} fill={entry.absences>=170?"#e50914":entry.absences>=150?"#f5a623":entry.isFuture?"#6b6b6b":"#e50914"} opacity={entry.isFuture?0.4:0.85}/>
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ):<div style={{height:170,display:"flex",alignItems:"center",justifyContent:"center",color:"#555"}}>No data</div>}
                </div>
              </div>

              {eTrips.length>=2&&(
                <div className="nf-card" style={{padding:20}}>
                  <div style={{fontWeight:700,fontSize:14,marginBottom:16}}>Travel Pattern Stats</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:20}}>
                    {[
                      {l:"Average trip",v:`${Math.round(eTrips.reduce((s,t)=>s+(t.daysAbsent||0),0)/eTrips.length)} days`},
                      {l:"Longest trip",v:`${Math.max(...eTrips.map(t=>t.daysAbsent||0))} days`},
                      {l:"Shortest trip",v:`${Math.min(...eTrips.map(t=>t.daysAbsent||0))} days`},
                      {l:"Total trips",v:eTrips.length},
                      {l:"Trips at risk",v:`${eTrips.filter(t=>D.rolling(eTrips,new Date(t.returnDate))>=150).length}/${eTrips.length}`},
                      {l:"Current buffer",v:`${buffer} days`},
                    ].map((s,i)=>(
                      <div key={i}>
                        <div style={{fontSize:10,color:"#555",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>{s.l}</div>
                        <div style={{fontSize:22,fontWeight:800,fontFamily:"'DM Mono',monospace"}}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════ SETTINGS ═══════ */}
          {tab==="settings" && (
            <div style={{maxWidth:600}}>
              <div style={{marginBottom:20}}>
                <h2 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em",marginBottom:4}}>Settings</h2>
                <p style={{fontSize:13,color:"#6b6b6b"}}>Configure qualifying period, visa type, and personal details</p>
              </div>

              <div className="nf-card" style={{padding:24,marginBottom:14}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:18,paddingBottom:14,borderBottom:"1px solid #2d2d2d"}}>Personal Details</div>
                <div style={{marginBottom:16}}>
                  <label style={lbl}>Your Name</label>
                  <input type="text" placeholder="e.g. Jane Smith" value={settings.name||""} onChange={e=>setSettings(s=>({...s,name:e.target.value}))} className="nf-input"/>
                </div>
                <div>
                  <label style={lbl}>Visa / Route Type</label>
                  <select value={settings.visaType||"skilled"} onChange={e=>setSettings(s=>({...s,visaType:e.target.value}))} className="nf-input">
                    <option value="skilled">Skilled Worker (5-year route)</option>
                    <option value="spouse">Spouse / Partner (5-year)</option>
                    <option value="spouse3">Spouse / Partner (3-year)</option>
                    <option value="global_talent">Global Talent</option>
                    <option value="long_residence">Long Residence (10-year)</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="nf-card" style={{padding:24,marginBottom:14}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:18,paddingBottom:14,borderBottom:"1px solid #2d2d2d"}}>Qualifying Period</div>
                <div style={{marginBottom:16}}>
                  <label style={lbl}>UK Continuous Residence Start Date</label>
                  <input type="date" value={settings.residenceStartDate||""} onChange={e=>setSettings(s=>({...s,residenceStartDate:e.target.value}))} className="nf-input"/>
                  <div style={{fontSize:12,color:"#555",marginTop:7}}>Typically your visa grant date or first UK entry on qualifying visa</div>
                </div>
                <div style={{marginBottom:20}}>
                  <label style={lbl}>Qualifying Period</label>
                  <select value={settings.qualifyingYears} onChange={e=>setSettings(s=>({...s,qualifyingYears:Number(e.target.value)}))} className="nf-input">
                    <option value={5}>5 Years — Standard ILR (most routes)</option>
                    <option value={3}>3 Years — Spouse/Partner 3-year route</option>
                    <option value={10}>10 Years — Long Residence</option>
                  </select>
                </div>

                {settings.residenceStartDate&&(
                  <div style={{background:"rgba(229,9,20,0.06)",border:"1px solid rgba(229,9,20,0.2)",borderRadius:6,padding:18}}>
                    <div style={{fontWeight:700,fontSize:13,color:"#e50914",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>📋 Your ILR Timeline</div>
                    <div style={{display:"grid",gap:10}}>
                      {[
                        {label:"Residence start",value:D.fmt(settings.residenceStartDate),color:"#e5e5e5"},
                        {label:"ILR qualifying date",value:qualifyDate?D.fmt(qualifyDate):"—",color:"#46d369"},
                        {label:"Earliest application",value:earlyAppDate?D.fmt(earlyAppDate):"—",color:"#e50914",tip:"UK Visas & Immigration allows you to apply up to 28 calendar days before your qualifying date. Don't miss this window — it prevents issues if your qualifying date falls on a weekend or bank holiday."},
                        {label:"Days until qualifying",value:daysToQ!=null?(daysToQ<=0?"✅ Eligible now!":`${daysToQ} days`):"-",color:daysToQ!=null&&daysToQ<=0?"#46d369":"#e5e5e5"},
                        {label:"Days to application window",value:daysToEarly!=null?(daysToEarly<=0?"✅ Window open!":`${daysToEarly} days`):"-",color:daysToEarly!=null&&daysToEarly<=0?"#46d369":"#e5e5e5"},
                      ].map(item=>(
                        <div key={item.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13}}>
                          <span style={{color:"#6b6b6b",display:"flex",alignItems:"center",gap:5}}>{item.label}{item.tip&&<InfoTip text={item.tip}/>}</span>
                          <span style={{fontWeight:600,color:item.color,fontFamily:"'DM Mono',monospace",fontSize:12}}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{marginTop:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#555",marginBottom:5}}><span>Progress</span><span>{Math.round(qProg)}%</span></div>
                      <div style={{height:4,background:"#2d2d2d",borderRadius:99,overflow:"hidden"}}>
                        <div className="progress-bar" style={{height:"100%",width:`${qProg}%`,background:"#e50914",borderRadius:99}}/>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="nf-card" style={{padding:24,marginBottom:14}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:18,paddingBottom:14,borderBottom:"1px solid #2d2d2d"}}>Actions</div>
                <div style={{display:"flex",flexDirection:isMobile?"column":"row",gap:10}}>
                  <button onClick={()=>setUploadModal(true)} className="nf-btn nf-btn-ghost">📤 Upload CSV</button>
                  <button onClick={genReport} className="nf-btn nf-btn-red">📄 Export Report</button>
                </div>
                <div style={{marginTop:20,paddingTop:16,borderTop:"1px solid #2d2d2d",display:"flex",gap:10,flexWrap:"wrap"}}>
                  <button onClick={()=>{if(confirm("Delete all past travel data?"))setTrips([])}} className="nf-btn nf-btn-ghost" style={{color:"#f5a623",borderColor:"rgba(245,166,35,0.3)"}}>Clear Travel Log</button>
                  <button onClick={()=>{if(confirm("Delete all planned trips?"))setFuture([])}} className="nf-btn nf-btn-ghost" style={{color:"#f5a623",borderColor:"rgba(245,166,35,0.3)"}}>Clear Planned</button>
                  <button onClick={()=>{if(confirm("Factory reset — delete ALL data?"))setTrips([]),setFuture([]),setSettings({qualifyingYears:5,residenceStartDate:"",name:"Traveller",visaType:"skilled"})}} className="nf-btn nf-btn-ghost" style={{color:"#e50914",borderColor:"rgba(229,9,20,0.3)"}}>⚠️ Factory Reset</button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ─── MOBILE BOTTOM NAV ─── */}
        {isMobile && (
          <nav className="mobile-nav">
            {TABS.map(({id,icon,label})=>(
              <button key={id} className={`mobile-nav-btn${tab===id?" active":""}`} onClick={()=>setTab(id)}>
                <span style={{fontSize:20}}>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* ─── UPLOAD MODAL ─── */}
      {uploadModal&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&(setUploadModal(false),setUploadPreview([]),setUploadErrors([]))}>
          <div className="modal-box">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
              <div>
                <div style={{fontWeight:800,fontSize:18,letterSpacing:"-0.03em"}}>Upload Travel Log</div>
                <div style={{fontSize:13,color:"#6b6b6b",marginTop:2}}>CSV or Google Sheets export</div>
              </div>
              <button onClick={()=>{setUploadModal(false);setUploadPreview([]);setUploadErrors([]);}} style={{background:"rgba(255,255,255,0.05)",border:"1px solid #3d3d3d",color:"#6b6b6b",width:32,height:32,borderRadius:4,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
            </div>
            <div
              style={{border:`2px dashed ${uploadPreview.length?"#46d369":"#3d3d3d"}`,borderRadius:6,padding:28,textAlign:"center",cursor:"pointer",marginBottom:16,background:uploadPreview.length?"rgba(70,211,105,0.04)":"rgba(255,255,255,0.01)",transition:"all 0.2s"}}
              onDragOver={e=>e.preventDefault()}
              onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleFile(f);}}
              onClick={()=>fileRef.current?.click()}
            >
              <div style={{fontSize:32,marginBottom:8}}>{uploadPreview.length?"✅":"📂"}</div>
              <div style={{fontSize:14,fontWeight:600,color:"#a3a3a3"}}>{uploadPreview.length?`${uploadPreview.length} trips ready`:"Drop CSV or click to browse"}</div>
              <div style={{fontSize:12,color:"#555",marginTop:6}}>Auto-detects DD/MM/YYYY · MM/DD/YYYY · YYYY-MM-DD</div>
              <input ref={fileRef} type="file" accept=".csv,.txt" style={{display:"none"}} onChange={e=>{if(e.target.files[0])handleFile(e.target.files[0]);}}/>
            </div>
            <div style={{background:"#1a1a1a",borderRadius:4,padding:10,marginBottom:14,fontFamily:"'DM Mono',monospace",fontSize:11,color:"#555",lineHeight:1.8}}>
              Trip #,Exit Date,Return Date,Days Outside<br/>
              1,03/01/2026,03/14/2026,13
            </div>
            {uploadErrors.length>0&&(
              <div style={{background:"rgba(229,9,20,0.07)",border:"1px solid rgba(229,9,20,0.2)",borderRadius:6,padding:12,marginBottom:14}}>
                <div style={{fontWeight:700,color:"#e50914",fontSize:13,marginBottom:6}}>{uploadErrors.length} Error{uploadErrors.length>1?"s":""}</div>
                {uploadErrors.slice(0,5).map((e,i)=><div key={i} style={{fontSize:12,color:"#a3a3a3"}}>{e}</div>)}
              </div>
            )}
            {uploadPreview.length>0&&(
              <div>
                <div style={{marginBottom:14}}>
                  {["merge","replace"].map(m=>(
                    <label key={m} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,cursor:"pointer"}}>
                      <input type="radio" checked={uploadMode===m} onChange={()=>setUploadMode(m)} style={{accentColor:"#e50914"}}/>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,textTransform:"capitalize"}}>{m} with existing</div>
                        <div style={{fontSize:12,color:"#555"}}>{m==="merge"?"Adds new, skips duplicates":"Replaces all data"}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <button onClick={confirmUpload} className="nf-btn nf-btn-red" style={{width:"100%",padding:12,fontSize:15}}>
                  Import {uploadPreview.length} Trips
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
