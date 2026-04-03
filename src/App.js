import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// ─────────────────────────────────────────────
// PASTE YOUR RENDER URL BELOW — NOTHING ELSE
// ─────────────────────────────────────────────
const API = "https://datalens-backend-ljqe.onrender.com";

/* ══════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,700;12..96,800&family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=JetBrains+Mono:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink:     #0d0e14;
  --ink2:    #161720;
  --ink3:    #1e1f2c;
  --ink4:    #272839;
  --line:    rgba(255,255,255,0.07);
  --line2:   rgba(255,255,255,0.13);
  --gold:    #f5c842;
  --gold2:   rgba(245,200,66,0.12);
  --gold3:   rgba(245,200,66,0.06);
  --teal:    #2de2c8;
  --teal2:   rgba(45,226,200,0.1);
  --rose:    #ff5f87;
  --rose2:   rgba(255,95,135,0.1);
  --sky:     #5b9cf6;
  --sky2:    rgba(91,156,246,0.1);
  --text:    #f0f0f8;
  --muted:   #5c5d78;
  --muted2:  #3a3b52;
}

html, body, #root { height: 100%; }
body {
  background: var(--ink);
  color: var(--text);
  font-family: 'Bricolage Grotesque', sans-serif;
  overflow-x: hidden;
}

/* SCROLLBAR */
::-webkit-scrollbar { width: 3px; height: 3px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--muted2); border-radius: 2px; }

/* ANIMATIONS */
@keyframes up   { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
@keyframes in   { from { opacity:0 } to { opacity:1 } }
@keyframes spin { to { transform:rotate(360deg) } }
@keyframes grow { from { transform:scaleY(0) } to { transform:scaleY(1) } }
@keyframes ring { from { stroke-dashoffset:var(--full) } to { stroke-dashoffset:var(--off) } }
@keyframes scan {
  0%   { transform:translateY(-100%) }
  100% { transform:translateY(400%) }
}

.up  { animation: up  0.5s cubic-bezier(.22,1,.36,1) both; }
.u1  { animation-delay:.04s } .u2 { animation-delay:.08s }
.u3  { animation-delay:.12s } .u4 { animation-delay:.16s }
.u5  { animation-delay:.20s } .u6 { animation-delay:.24s }

/* LAYOUT */
.shell {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 52px 1fr;
  height: 100vh;
  overflow: hidden;
}

/* TOP BAR */
.topbar {
  grid-column: 1 / -1;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px;
  background: var(--ink2);
  border-bottom: 1px solid var(--line);
  position: relative; z-index: 50;
}
.logo-mark {
  display: flex; align-items: center; gap: 10px;
  font-size: 16px; font-weight: 800; letter-spacing: -0.5px;
}
.logo-icon {
  width: 26px; height: 26px;
  background: var(--gold);
  border-radius: 6px;
  display: grid; place-items: center;
  font-size: 13px;
  color: var(--ink);
}
.logo-text { color: var(--text); }
.logo-text span { color: var(--gold); }
.topbar-right {
  display: flex; align-items: center; gap: 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; color: var(--muted);
}
.live-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--muted2); display: inline-block; margin-right: 5px;
  transition: all .3s;
}
.live-dot.on {
  background: var(--teal);
  box-shadow: 0 0 8px var(--teal);
  animation: in .3s ease;
}

/* SIDEBAR */
.sidebar {
  background: var(--ink2);
  border-right: 1px solid var(--line);
  overflow-y: auto;
  padding: 16px 8px 24px;
  display: flex; flex-direction: column; gap: 2px;
}
.nav-group {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; text-transform: uppercase;
  letter-spacing: .14em; color: var(--muted2);
  padding: 10px 10px 6px;
}
.nav-btn {
  display: flex; align-items: center; gap: 9px;
  padding: 8px 12px; border-radius: 8px;
  font-size: 12.5px; font-weight: 500;
  cursor: pointer; color: var(--muted);
  transition: all .14s; border: 1px solid transparent;
  user-select: none; position: relative; overflow: hidden;
}
.nav-btn:hover { color: var(--text); background: var(--ink3); }
.nav-btn.on {
  color: var(--gold);
  background: var(--gold3);
  border-color: rgba(245,200,66,.15);
}
.nav-btn .dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--muted2); flex-shrink: 0; margin-left: auto;
  transition: background .2s;
}
.nav-btn.on .dot { background: var(--gold); box-shadow: 0 0 6px var(--gold); }

/* SIDEBAR FOOTER */
.sidebar-foot {
  margin-top: auto; padding: 12px 10px 0;
  border-top: 1px solid var(--line);
}
.status-pill {
  display: flex; align-items: center; gap: 7px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; color: var(--muted);
  padding: 8px 10px; border-radius: 7px;
  background: var(--ink3);
}

/* MAIN */
.main {
  overflow-y: auto;
  background: var(--ink);
  position: relative;
}

/* BG GRID */
.main::before {
  content: '';
  position: fixed; inset: 52px 0 0 200px;
  background-image:
    linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none; z-index: 0;
}

.inner {
  position: relative; z-index: 1;
  padding: 28px 32px 48px;
  max-width: 960px; margin: 0 auto;
}

/* PAGE TITLE */
.page-title {
  font-size: 26px; font-weight: 800;
  letter-spacing: -0.5px; line-height: 1.1;
  margin-bottom: 6px;
}
.page-sub { font-size: 13px; color: var(--muted); margin-bottom: 28px; }

/* CARD */
.card {
  background: var(--ink2);
  border: 1px solid var(--line);
  border-radius: 14px; overflow: hidden;
  transition: border-color .2s;
}
.card:hover { border-color: var(--line2); }
.card-head {
  padding: 15px 20px;
  border-bottom: 1px solid var(--line);
  display: flex; align-items: center; justify-content: space-between;
}
.card-title {
  font-size: 12px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .08em;
  color: var(--muted); display: flex; align-items: center; gap: 7px;
}
.card-body { padding: 20px; }

/* STAT CARDS */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(145px,1fr));
  gap: 12px; margin-bottom: 20px;
}
.stat {
  background: var(--ink2);
  border: 1px solid var(--line);
  border-radius: 12px; padding: 18px;
  position: relative; overflow: hidden;
  transition: all .2s;
}
.stat:hover { border-color: var(--line2); transform: translateY(-1px); }
.stat::after {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
  background: var(--ac, var(--gold));
  opacity: .8;
}
.stat-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; text-transform: uppercase;
  letter-spacing: .12em; color: var(--muted); margin-bottom: 10px;
}
.stat-num {
  font-size: 28px; font-weight: 800; line-height: 1;
  color: var(--ac, var(--gold));
  font-variant-numeric: tabular-nums;
}
.stat-hint { font-size: 10.5px; color: var(--muted); margin-top: 5px; }

/* QUALITY RING */
.q-ring-wrap { display: flex; align-items: center; gap: 14px; }
.q-ring { position: relative; width: 64px; height: 64px; flex-shrink: 0; }
.q-ring svg { transform: rotate(-90deg); }
.q-ring .val {
  position: absolute; inset: 0;
  display: grid; place-items: center;
  font-size: 13px; font-weight: 800;
}

/* BUTTONS */
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 18px; border-radius: 9px; border: none;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 12.5px; font-weight: 700;
  cursor: pointer; transition: all .15s; user-select: none;
}
.btn-gold { background: var(--gold); color: var(--ink); }
.btn-gold:hover {
  background: #f9d65a;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(245,200,66,.3);
}
.btn-gold:disabled { opacity: .45; cursor: not-allowed; transform: none; box-shadow: none; }
.btn-ghost {
  background: transparent; color: var(--muted);
  border: 1px solid var(--line2);
}
.btn-ghost:hover { color: var(--text); border-color: rgba(255,255,255,.25); }
.btn-sm { padding: 6px 13px; font-size: 11.5px; border-radius: 7px; }
.btn-teal { background: var(--teal); color: var(--ink); }
.btn-teal:hover { background: #4eeedd; transform:translateY(-1px); box-shadow: 0 6px 20px rgba(45,226,200,.25); }

/* UPLOAD ZONE */
.drop-zone {
  border: 1.5px dashed rgba(245,200,66,.22);
  border-radius: 14px; padding: 52px 28px;
  text-align: center; cursor: pointer; position: relative;
  transition: all .2s;
  background: radial-gradient(ellipse at 50% 0%, rgba(245,200,66,.04) 0%, transparent 65%);
}
.drop-zone:hover {
  border-color: rgba(245,200,66,.5);
  background: radial-gradient(ellipse at 50% 0%, rgba(245,200,66,.09) 0%, transparent 65%);
}
.drop-zone.active {
  border-color: var(--gold);
  background: radial-gradient(ellipse at 50% 0%, rgba(245,200,66,.14) 0%, transparent 65%);
}
.drop-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
.drop-icon {
  width: 52px; height: 52px; border-radius: 13px; margin: 0 auto 16px;
  background: var(--gold2); display: grid; place-items: center;
  font-size: 22px; border: 1px solid rgba(245,200,66,.25);
}
.drop-h { font-size: 16px; font-weight: 700; margin-bottom: 5px; }
.drop-sub { font-size: 12px; color: var(--muted); }

/* INPUT */
.field {
  flex: 1; background: var(--ink3);
  border: 1px solid var(--line2); border-radius: 9px;
  padding: 10px 14px; color: var(--text);
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 13px; outline: none; transition: border .15s; width: 100%;
}
.field:focus { border-color: rgba(245,200,66,.4); }

/* INSIGHT ROW */
.ins-row {
  display: flex; gap: 11px; align-items: flex-start;
  padding: 11px 14px; border-radius: 9px;
  background: var(--ink3); border: 1px solid var(--line);
  font-size: 13px; line-height: 1.6; margin-bottom: 7px;
  transition: all .15s;
}
.ins-row:hover { border-color: var(--line2); background: var(--ink4); }
.ins-arrow { color: var(--teal); flex-shrink: 0; margin-top: 2px; font-size: 10px; }

/* SUGGESTION ROW */
.sug-row {
  display: flex; gap: 14px; align-items: flex-start;
  padding: 14px 16px; border-radius: 10px;
  background: var(--sky2); border: 1px solid rgba(91,156,246,.12);
  font-size: 13px; line-height: 1.65; margin-bottom: 9px;
  transition: border-color .2s;
}
.sug-row:hover { border-color: rgba(91,156,246,.28); }
.sug-num {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700; font-size: 11px; color: var(--sky); min-width: 22px;
}

/* METHOD PILLS */
.m-pill {
  padding: 4px 11px; border-radius: 5px; font-size: 10.5px;
  font-weight: 700; cursor: pointer; border: 1px solid;
  transition: all .14s; text-transform: uppercase; letter-spacing: .05em;
  font-family: 'JetBrains Mono', monospace;
}
.m-off { border-color: rgba(245,200,66,.2); background: transparent; color: var(--muted); }
.m-off:hover { color: var(--gold); border-color: rgba(245,200,66,.45); }
.m-on  { border-color: transparent; background: var(--gold); color: var(--ink); }

/* MV ROW */
.mv-row {
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  padding: 13px 0; border-bottom: 1px solid var(--line);
}
.mv-row:last-child { border-bottom: none; }

/* BADGE */
.badge {
  display: inline-flex; padding: 3px 8px; border-radius: 5px;
  font-size: 10.5px; font-weight: 600; margin: 0 3px 4px 0;
  font-family: 'JetBrains Mono', monospace;
}

/* CHIP */
.chip {
  padding: 5px 13px; border-radius: 20px; font-size: 11.5px;
  cursor: pointer; background: var(--ink3); border: 1px solid var(--line2);
  color: var(--muted); transition: all .15s; white-space: nowrap;
}
.chip:hover { color: var(--gold); border-color: rgba(245,200,66,.3); background: var(--gold3); }

/* TABLE */
table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
thead th {
  text-align: left; padding: 8px 13px;
  color: var(--muted); font-size: 9.5px;
  text-transform: uppercase; letter-spacing: .1em;
  border-bottom: 1px solid var(--line);
  font-weight: 500; white-space: nowrap;
  font-family: 'JetBrains Mono', monospace;
}
tbody td {
  padding: 8px 13px; border-bottom: 1px solid rgba(255,255,255,.025);
  white-space: nowrap; max-width: 180px;
  overflow: hidden; text-overflow: ellipsis;
}
tbody tr:hover td { background: rgba(255,255,255,.02); }

/* CHART BARS */
.bars { display: flex; align-items: flex-end; gap: 2px; height: 68px; }
.bar {
  flex: 1; border-radius: 3px 3px 0 0; min-height: 2px;
  transform-origin: bottom;
  animation: grow .7s cubic-bezier(.22,1,.36,1) both;
}

/* SPINNER */
.spin {
  width: 15px; height: 15px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.08);
  border-top-color: var(--gold);
  animation: spin .7s linear infinite; display: inline-block;
}

/* ANSWER BOX */
.answer {
  margin-top: 16px; padding: 16px 18px;
  background: var(--gold3); border: 1px solid rgba(245,200,66,.2);
  border-radius: 11px; font-size: 14px; font-weight: 500;
  color: var(--gold); line-height: 1.7;
  font-family: 'Lora', serif; font-style: italic;
}

/* STORY */
.story-body {
  font-family: 'Lora', serif; font-size: 16px;
  line-height: 1.9; font-style: italic; color: var(--text);
}

/* ERROR */
.err {
  display: flex; align-items: center; gap: 8px;
  padding: 11px 15px; border-radius: 9px;
  background: rgba(255,95,135,.07); border: 1px solid rgba(255,95,135,.2);
  font-size: 12.5px; color: var(--rose); margin-bottom: 18px;
}

/* EMPTY */
.empty {
  text-align: center; padding: 52px 20px;
  font-size: 13px; color: var(--muted); line-height: 1.7;
}
.empty-icon { font-size: 28px; margin-bottom: 12px; opacity: .35; display: block; }

/* SCAN LINE on upload zone */
.scan-wrap {
  position: absolute; inset: 0; overflow: hidden;
  border-radius: 14px; pointer-events: none;
}
.scan-line {
  position: absolute; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
  opacity: .5;
  animation: scan 2s ease-in-out infinite;
}

/* FEATURE TAGS */
.feat-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 32px; }
.feat-tag {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 13px; border-radius: 20px;
  font-size: 11.5px; color: var(--muted);
  background: var(--ink2); border: 1px solid var(--line2);
}
.feat-tag span { color: var(--gold); font-size: 10px; }
`;

function StyleInject() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

/* ══════════════════════════════════════════════
   COMPONENTS
══════════════════════════════════════════════ */
const NAV = [
  { id: "upload",      icon: "⬆",  label: "Upload"      },
  { id: "summary",     icon: "◈",  label: "Summary"     },
  { id: "preview",     icon: "⊞",  label: "Preview"     },
  { id: "missing",     icon: "◌",  label: "Missing"     },
  { id: "insights",    icon: "◎",  label: "Insights"    },
  { id: "suggestions", icon: "◆",  label: "Suggestions" },
  { id: "story",       icon: "◉",  label: "Data Story"  },
  { id: "ask",         icon: "◐",  label: "Ask Data"    },
];

function QualityRing({ score }) {
  const C = 195, r = 31;
  const col = score >= 80 ? "#2de2c8" : score >= 60 ? "#f5c842" : "#ff5f87";
  const off = C - (score / 100) * C;
  return (
    <div className="q-ring">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5"/>
        <circle cx="32" cy="32" r={r} fill="none" stroke={col} strokeWidth="5"
          strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 1.3s cubic-bezier(.22,1,.36,1)" }}/>
      </svg>
      <div className="val" style={{ color: col }}>{score}%</div>
    </div>
  );
}

function BarChart({ values, color }) {
  const mn = Math.min(...values), mx = Math.max(...values), B = 30;
  const bins = Array(B).fill(0);
  values.forEach(v => { const i = Math.min(B - 1, Math.floor(((v - mn) / (mx - mn || 1)) * B)); bins[i]++; });
  const mb = Math.max(...bins);
  return (
    <div className="bars">
      {bins.map((b, i) => (
        <div key={i} className="bar" style={{
          height: `${Math.max(3, (b / mb) * 100)}%`,
          background: `linear-gradient(180deg, ${color}, ${color}33)`,
          animationDelay: `${i * 0.018}s`,
        }}/>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════ */
export default function App() {
  const [tab, setTab]         = useState("upload");
  const [file, setFile]       = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [preview, setPreview] = useState([]);
  const [insights, setInsights] = useState([]);
  const [suggs, setSuggs]     = useState([]);
  const [missing, setMissing] = useState({});
  const [mvSel, setMvSel]     = useState({});
  const [mvMsg, setMvMsg]     = useState({});
  const [story, setStory]     = useState("");
  const [q, setQ]             = useState("");
  const [ans, setAns]         = useState("");
  const [qaLoad, setQaLoad]   = useState(false);
  const [charts, setCharts]   = useState([]);
  const [drag, setDrag]       = useState(false);

  const go = (id) => { setTab(id); setError(""); };

  const upload = async () => {
    if (!file) { setError("Please select a CSV file."); return; }
    setLoading(true); setError("");
    try {
      const fd = new FormData(); fd.append("file", file);
      const [r, ch] = await Promise.all([
        axios.post(`${API}/upload`, fd),
        axios.get(`${API}/charts`).catch(() => ({ data: { charts: [] } })),
      ]);
      setSummary(r.data); setCharts(ch.data.charts || []);
      setTab("summary");
    } catch { setError("Upload failed. Check your CSV and that the backend is awake."); }
    setLoading(false);
  };

  const load = {
    preview:     async () => { try { setPreview((await axios.get(`${API}/preview`)).data); } catch { setError("Upload a dataset first."); } },
    insights:    async () => { try { setInsights((await axios.get(`${API}/insights`)).data.insights); } catch { setError("Upload a dataset first."); } },
    suggs:       async () => { try { setSuggs((await axios.get(`${API}/business_suggestions`)).data.business_suggestions); } catch { setError("Upload a dataset first."); } },
    missing:     async () => { try { setMissing((await axios.get(`${API}/missing_value_questions`)).data); } catch { setError("Upload a dataset first."); } },
    story:       async () => { try { setStory((await axios.get(`${API}/story`)).data.story); } catch { setError("Upload a dataset first."); } },
  };

  const applyMV = async (col) => {
    const m = mvSel[col]; if (!m) { setError(`Pick a method for "${col}"`); return; }
    try { await axios.post(`${API}/handle_null_values?column=${encodeURIComponent(col)}&method=${m}`); setMvMsg(p => ({ ...p, [col]: "✓" })); }
    catch { setError("Failed to apply."); }
  };

  const ask = async () => {
    if (!q.trim()) return;
    setQaLoad(true); setAns("");
    try { setAns((await axios.get(`${API}/ask?question=${encodeURIComponent(q)}`)).data.answer); }
    catch { setAns("Upload a dataset first, then try again."); }
    setQaLoad(false);
  };

  const PALETTE = ["#2de2c8", "#f5c842", "#ff5f87", "#5b9cf6", "#b06eff", "#ff9c5b"];

  const qualLabel = (s) => s >= 80 ? "Excellent" : s >= 60 ? "Good" : "Needs Work";
  const qualCol   = (s) => s >= 80 ? "#2de2c8"   : s >= 60 ? "#f5c842" : "#ff5f87";

  return (
    <>
      <StyleInject />
      <div className="shell">

        {/* TOP BAR */}
        <header className="topbar">
          <div className="logo-mark">
            <div className="logo-icon">◈</div>
            <div className="logo-text">Data<span>Lens</span></div>
          </div>
          <div className="topbar-right">
            <span>
              <span className={`live-dot${summary ? " on" : ""}`}/>
              {summary ? `${summary.rows.toLocaleString()} rows · ${summary.columns} cols` : "no dataset"}
            </span>
            <span style={{ color: "var(--muted2)" }}>|</span>
            <span>datalens-backend-ljqe.onrender.com</span>
          </div>
        </header>

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="nav-group">Workspace</div>
          {NAV.map(n => (
            <div key={n.id} className={`nav-btn${tab === n.id ? " on" : ""}`} onClick={() => go(n.id)}>
              <span style={{ fontSize: 13, opacity: .8 }}>{n.icon}</span>
              {n.label}
              <span className="dot"/>
            </div>
          ))}
          <div className="sidebar-foot">
            <div className="status-pill">
              <span className={`live-dot${summary ? " on" : ""}`}/>
              {summary ? "Data loaded" : "Awaiting data"}
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="inner">

            {error && (
              <div className="err up">
                <span>⚠</span> {error}
                <span style={{ marginLeft: "auto", cursor: "pointer", opacity: .5 }} onClick={() => setError("")}>✕</span>
              </div>
            )}

            {/* ── UPLOAD ── */}
            {tab === "upload" && (
              <div className="up">
                <div className="page-title">
                  Upload your{" "}
                  <span style={{ color: "var(--gold)", fontFamily: "'Lora', serif", fontStyle: "italic" }}>dataset</span>
                </div>
                <div className="page-sub">Instant AI-powered analysis, charts and business intelligence</div>

                <div className={`drop-zone${drag ? " active" : ""}`}
                  onDragOver={e => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}>
                  <input type="file" accept=".csv" onChange={e => { setFile(e.target.files[0]); setError(""); }}/>
                  {drag && <div className="scan-wrap"><div className="scan-line"/></div>}
                  <div className="drop-icon">⬆</div>
                  <div className="drop-h">{file ? `✓  ${file.name}` : "Drop your CSV here"}</div>
                  <div className="drop-sub">or click to browse · CSV only · max 50 MB</div>
                </div>

                <div style={{ marginTop: 18, display: "flex", gap: 12, alignItems: "center" }}>
                  <button className="btn btn-gold" onClick={upload} disabled={loading || !file}>
                    {loading ? <><span className="spin"/> Analysing…</> : "Analyse Dataset →"}
                  </button>
                  {file && !loading && (
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "var(--muted)" }}>
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  )}
                </div>

                <div className="feat-tags">
                  {["Quality Score", "Missing Values", "Distribution Charts", "AI Insights", "Data Story", "Q&A"].map(f => (
                    <div key={f} className="feat-tag"><span>✦</span>{f}</div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SUMMARY ── */}
            {tab === "summary" && !summary && (
              <div className="card up"><div className="card-body">
                <div className="empty"><span className="empty-icon">◈</span>Upload a dataset to see the summary</div>
              </div></div>
            )}
            {tab === "summary" && summary && (
              <>
                <div className="page-title up">Dataset <span style={{ color: "var(--gold)", fontFamily: "'Lora',serif", fontStyle: "italic" }}>Overview</span></div>
                <div className="page-sub up u1">Your data at a glance</div>

                <div className="stat-grid">
                  {[
                    { label: "Total Rows",     val: summary.rows.toLocaleString(),  hint: `${summary.columns} columns`,                         ac: "#5b9cf6" },
                    { label: "Numeric Cols",   val: summary.numeric_columns.length, hint: `${summary.categorical_columns.length} categorical`,   ac: "#f5c842" },
                    { label: "Missing Values", val: Object.values(summary.missing_values).reduce((a,b)=>a+b,0), hint: "total nulls",             ac: "#ff9c5b" },
                    { label: "Duplicates",     val: summary.duplicate_rows,         hint: "duplicate rows",                                       ac: "#ff5f87" },
                  ].map((s, i) => (
                    <div key={i} className={`stat up u${i + 1}`} style={{ "--ac": s.ac }}>
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-num">{s.val}</div>
                      <div className="stat-hint">{s.hint}</div>
                    </div>
                  ))}
                  <div className="stat up u5" style={{ "--ac": qualCol(summary.data_quality_score) }}>
                    <div className="stat-label">Quality Score</div>
                    <div className="q-ring-wrap">
                      <QualityRing score={summary.data_quality_score}/>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14, color: qualCol(summary.data_quality_score) }}>
                          {qualLabel(summary.data_quality_score)}
                        </div>
                        <div className="stat-hint">Overall quality</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card up u6" style={{ marginBottom: 16 }}>
                  <div className="card-head"><div className="card-title">⊞ Column Index</div></div>
                  <div className="card-body">
                    {summary.numeric_columns.map(c => <span key={c} className="badge" style={{ background: "var(--sky2)", color: "var(--sky)" }}># {c}</span>)}
                    {summary.categorical_columns.map(c => <span key={c} className="badge" style={{ background: "var(--gold2)", color: "var(--gold)" }}>Aa {c}</span>)}
                  </div>
                </div>

                {charts.length > 0 && (
                  <div className="card up">
                    <div className="card-head"><div className="card-title">◎ Distributions</div></div>
                    <div className="card-body">
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
                        {charts.map((ch, i) => (
                          <div key={i} style={{ background: "var(--ink3)", borderRadius: 9, padding: 14, border: "1px solid var(--line)" }}>
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)", marginBottom: 10 }}>{ch.column}</div>
                            <BarChart values={ch.values} color={PALETTE[i % PALETTE.length]}/>
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "var(--muted)", marginTop: 7 }}>{ch.values.length.toLocaleString()} values</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── PREVIEW ── */}
            {tab === "preview" && (
              <div className="card up">
                <div className="card-head">
                  <div className="card-title">⊞ Data Preview <span style={{ opacity: .5, fontWeight: 400, marginLeft: 4 }}>first 20 rows</span></div>
                  <button className="btn btn-ghost btn-sm" onClick={load.preview}>Load →</button>
                </div>
                {preview.length === 0
                  ? <div className="empty"><span className="empty-icon">⊞</span>Click "Load" to fetch your data</div>
                  : <div style={{ overflowX: "auto" }}><table>
                      <thead><tr>{Object.keys(preview[0]).map(k => <th key={k}>{k}</th>)}</tr></thead>
                      <tbody>{preview.map((row, i) => (
                        <tr key={i}>{Object.values(row).map((v, j) => <td key={j} title={String(v)}>{v ?? "—"}</td>)}</tr>
                      ))}</tbody>
                    </table></div>
                }
              </div>
            )}

            {/* ── MISSING ── */}
            {tab === "missing" && (
              <div className="card up">
                <div className="card-head">
                  <div className="card-title">◌ Missing Values</div>
                  <button className="btn btn-ghost btn-sm" onClick={load.missing}>Detect →</button>
                </div>
                <div className="card-body">
                  {Object.keys(missing).length === 0
                    ? <div className="empty"><span className="empty-icon">◌</span>Click "Detect" to find missing values</div>
                    : Object.entries(missing).map(([col, info]) => (
                        <div key={col} className="mv-row">
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{col}</div>
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#ff9c5b" }}>⚠ {info.missing_count} null values</div>
                          </div>
                          <div style={{ display: "flex", gap: 5 }}>
                            {info.options.map(o => (
                              <button key={o} className={`m-pill ${mvSel[col] === o ? "m-on" : "m-off"}`}
                                onClick={() => setMvSel(p => ({ ...p, [col]: o }))}>
                                {o.replace("fill_", "").replace("_", " ")}
                              </button>
                            ))}
                          </div>
                          <button className="btn btn-teal btn-sm" onClick={() => applyMV(col)}>Apply</button>
                          {mvMsg[col] && <span style={{ color: "var(--teal)", fontSize: 12, fontWeight: 700 }}>{mvMsg[col]}</span>}
                        </div>
                    ))
                  }
                </div>
              </div>
            )}

            {/* ── INSIGHTS ── */}
            {tab === "insights" && (
              <div className="card up">
                <div className="card-head">
                  <div className="card-title">◎ Data Insights</div>
                  <button className="btn btn-ghost btn-sm" onClick={load.insights}>Generate →</button>
                </div>
                <div className="card-body">
                  {insights.length === 0
                    ? <div className="empty"><span className="empty-icon">◎</span>Click "Generate" to discover insights</div>
                    : insights.map((ins, i) => (
                        <div key={i} className="ins-row up" style={{ animationDelay: `${i * .04}s` }}>
                          <span className="ins-arrow">▶</span><span>{ins}</span>
                        </div>
                    ))
                  }
                </div>
              </div>
            )}

            {/* ── SUGGESTIONS ── */}
            {tab === "suggestions" && (
              <div className="card up">
                <div className="card-head">
                  <div className="card-title">◆ Business Suggestions</div>
                  <button className="btn btn-ghost btn-sm" onClick={load.suggs}>Generate →</button>
                </div>
                <div className="card-body">
                  {suggs.length === 0
                    ? <div className="empty"><span className="empty-icon">◆</span>Click "Generate" for recommendations</div>
                    : suggs.map((s, i) => (
                        <div key={i} className="sug-row up" style={{ animationDelay: `${i * .04}s` }}>
                          <span className="sug-num">{String(i + 1).padStart(2, "0")}</span>
                          <span>{s}</span>
                        </div>
                    ))
                  }
                </div>
              </div>
            )}

            {/* ── STORY ── */}
            {tab === "story" && (
              <div className="card up">
                <div className="card-head">
                  <div className="card-title">◉ Data Story</div>
                  <button className="btn btn-ghost btn-sm" onClick={load.story}>Generate →</button>
                </div>
                <div className="card-body">
                  {!story
                    ? <div className="empty"><span className="empty-icon">◉</span>Click "Generate" to narrate your data</div>
                    : <p className="story-body up">{story}</p>
                  }
                </div>
              </div>
            )}

            {/* ── ASK ── */}
            {tab === "ask" && (
              <div className="card up">
                <div className="card-head"><div className="card-title">◐ Ask Your Data</div></div>
                <div className="card-body">
                  <div style={{ display: "flex", gap: 10 }}>
                    <input className="field" value={q}
                      placeholder="e.g. What is the highest value? How many rows?"
                      onChange={e => setQ(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && ask()}/>
                    <button className="btn btn-gold" onClick={ask} disabled={qaLoad}>
                      {qaLoad ? <span className="spin"/> : "Ask →"}
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 12 }}>
                    {["What is the highest value?", "How many rows?", "What is the average?"].map(qs => (
                      <span key={qs} className="chip" onClick={() => setQ(qs)}>{qs}</span>
                    ))}
                  </div>
                  {ans && <div className="answer up">{ans}</div>}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
}
