import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "https://datalens-backend-ljqe.onrender.comhttps://datalens-backend-ljqe.onrender.com";

/* ─── GLOBAL CSS ──────────────────────────────────────────── */
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@300;400;500;700;800&family=Instrument+Serif:ital@0;1&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#07080f; --surface:#0e0f1a; --surface2:#13141f; --surface3:#1a1b2e;
    --border:rgba(255,255,255,0.06); --border2:rgba(255,255,255,0.11);
    --lime:#c6ff4e; --lime-dim:rgba(198,255,78,0.1);
    --blue:#4e8cff; --blue-dim:rgba(78,140,255,0.1);
    --pink:#ff6eb4; --warn:#ffcc44;
    --text:#eeeef5; --muted:#5a5b72; --muted2:#3a3b52;
  }
  html,body,#root{height:100%;}
  body{background:var(--bg);color:var(--text);font-family:'Cabinet Grotesk',sans-serif;overflow-x:hidden;}
  ::-webkit-scrollbar{width:4px;height:4px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:var(--muted2);border-radius:2px;}

  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes barGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}

  .fu{animation:fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both;}
  .fu1{animation-delay:.05s}.fu2{animation-delay:.10s}.fu3{animation-delay:.15s}
  .fu4{animation-delay:.20s}.fu5{animation-delay:.25s}.fu6{animation-delay:.30s}

  .nav-item{
    display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:8px;
    font-size:13px;font-weight:500;cursor:pointer;color:var(--muted);
    transition:all .15s;border:1px solid transparent;user-select:none;
  }
  .nav-item:hover{color:var(--text);background:var(--surface2);}
  .nav-item.active{color:var(--lime);background:var(--lime-dim);border-color:rgba(198,255,78,.15);}

  .btn{
    display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:9px;
    font-family:'Cabinet Grotesk',sans-serif;font-size:13px;font-weight:700;
    cursor:pointer;border:none;transition:all .15s;user-select:none;
  }
  .btn-lime{background:var(--lime);color:#07080f;}
  .btn-lime:hover{background:#d4ff6e;transform:translateY(-1px);box-shadow:0 8px 24px rgba(198,255,78,.22);}
  .btn-lime:disabled{opacity:.45;cursor:not-allowed;transform:none;box-shadow:none;}
  .btn-ghost{background:transparent;color:var(--muted);border:1px solid var(--border2);}
  .btn-ghost:hover{color:var(--text);border-color:rgba(255,255,255,.2);}
  .btn-sm{padding:6px 14px;font-size:12px;border-radius:7px;}

  .card{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;}
  .card-head{
    padding:18px 24px;border-bottom:1px solid var(--border);
    display:flex;align-items:center;justify-content:space-between;
  }
  .card-title{
    font-family:'Clash Display',sans-serif;font-size:14px;font-weight:600;
    display:flex;align-items:center;gap:8px;
  }
  .card-body{padding:24px;}

  .stat-card{
    background:var(--surface);border:1px solid var(--border);border-radius:14px;
    padding:20px;position:relative;overflow:hidden;transition:border-color .2s;
  }
  .stat-card:hover{border-color:var(--border2);}
  .stat-card::before{
    content:'';position:absolute;top:0;left:0;right:0;height:2px;
    background:var(--ac,var(--lime));
  }

  .input-field{
    flex:1;background:var(--surface2);border:1px solid var(--border2);
    border-radius:10px;padding:11px 16px;color:var(--text);
    font-family:'Cabinet Grotesk',sans-serif;font-size:13px;outline:none;
    transition:border .15s;width:100%;
  }
  .input-field:focus{border-color:rgba(198,255,78,.4);}

  .insight-row{
    display:flex;gap:12px;align-items:flex-start;padding:12px 16px;border-radius:10px;
    background:var(--surface2);border:1px solid var(--border);
    font-size:13px;line-height:1.6;margin-bottom:8px;transition:border-color .15s;
  }
  .insight-row:hover{border-color:var(--border2);}

  .sug-row{
    display:flex;gap:14px;align-items:flex-start;padding:14px 18px;border-radius:10px;
    background:var(--surface2);border:1px solid rgba(78,140,255,.12);
    font-size:13px;line-height:1.65;margin-bottom:10px;transition:border-color .2s;
  }
  .sug-row:hover{border-color:rgba(78,140,255,.28);}

  .method-pill{
    padding:5px 12px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;
    border:1px solid;transition:all .15s;text-transform:uppercase;letter-spacing:.05em;
  }
  .pill-off{border-color:rgba(198,255,78,.2);background:transparent;color:var(--muted);}
  .pill-off:hover{color:var(--lime);border-color:rgba(198,255,78,.4);}
  .pill-on{border-color:transparent;background:var(--lime);color:#07080f;}

  .badge{display:inline-flex;padding:3px 9px;border-radius:5px;font-size:11px;font-weight:600;margin:0 4px 4px 0;}
  .chip{
    padding:5px 14px;border-radius:20px;font-size:12px;cursor:pointer;
    background:var(--surface2);border:1px solid var(--border2);color:var(--muted);
    transition:all .15s;white-space:nowrap;
  }
  .chip:hover{color:var(--lime);border-color:rgba(198,255,78,.3);background:var(--lime-dim);}

  table{width:100%;border-collapse:collapse;font-size:12px;}
  thead th{
    text-align:left;padding:9px 14px;color:var(--muted);font-size:10px;
    text-transform:uppercase;letter-spacing:.1em;border-bottom:1px solid var(--border);
    font-weight:500;white-space:nowrap;
  }
  tbody td{
    padding:9px 14px;border-bottom:1px solid rgba(255,255,255,.025);
    white-space:nowrap;max-width:180px;overflow:hidden;text-overflow:ellipsis;
  }
  tbody tr:hover td{background:rgba(255,255,255,.02);}

  .bar-wrap{display:flex;align-items:flex-end;gap:2px;height:72px;}
  .bar-item{
    flex:1;border-radius:3px 3px 0 0;transform-origin:bottom;min-height:2px;
    animation:barGrow .8s cubic-bezier(0.22,1,0.36,1) both;
  }
  .spinner{
    width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,.1);
    border-top-color:var(--lime);animation:spin .7s linear infinite;display:inline-block;
  }
  .upload-zone{
    border:1.5px dashed rgba(198,255,78,.22);border-radius:14px;padding:52px 32px;
    text-align:center;cursor:pointer;position:relative;transition:all .2s;
    background:radial-gradient(ellipse at 50% 0%,rgba(198,255,78,.04) 0%,transparent 70%);
  }
  .upload-zone:hover{
    border-color:rgba(198,255,78,.5);
    background:radial-gradient(ellipse at 50% 0%,rgba(198,255,78,.09) 0%,transparent 70%);
  }
  .upload-zone input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;}
  .quality-ring{position:relative;width:68px;height:68px;flex-shrink:0;}
  .quality-ring svg{transform:rotate(-90deg);}
  .quality-ring .val{
    position:absolute;inset:0;display:grid;place-items:center;
    font-family:'Clash Display',sans-serif;font-size:14px;font-weight:700;
  }
  .error-toast{
    background:rgba(255,80,80,.07);border:1px solid rgba(255,80,80,.2);border-radius:10px;
    padding:12px 16px;font-size:13px;color:#ff7070;margin-bottom:18px;
    display:flex;align-items:center;gap:8px;
  }
  .answer-box{
    margin-top:16px;padding:16px 20px;background:var(--lime-dim);
    border:1px solid rgba(198,255,78,.2);border-radius:12px;
    font-size:14px;color:var(--lime);line-height:1.65;font-weight:500;
  }
  .mv-row{
    display:flex;align-items:center;gap:14px;padding:14px 0;
    border-bottom:1px solid var(--border);flex-wrap:wrap;
  }
  .mv-row:last-child{border-bottom:none;}
  .story-text{font-family:'Instrument Serif',serif;font-size:17px;line-height:1.9;font-style:italic;}
  .empty-state{text-align:center;padding:52px 20px;color:var(--muted);font-size:13px;line-height:1.7;}
  .empty-icon{font-size:32px;margin-bottom:12px;opacity:.3;display:block;}
`;

function StyleInject() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = globalCSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

const NAV = [
  { id:"upload",      icon:"⬆",  label:"Upload"      },
  { id:"summary",     icon:"◈",  label:"Summary"     },
  { id:"preview",     icon:"⊞",  label:"Preview"     },
  { id:"missing",     icon:"◌",  label:"Missing"     },
  { id:"insights",    icon:"◎",  label:"Insights"    },
  { id:"suggestions", icon:"◆",  label:"Suggestions" },
  { id:"story",       icon:"◉",  label:"Data Story"  },
  { id:"ask",         icon:"◐",  label:"Ask Data"    },
];

function QRing({ score }) {
  const C = 207, r = 33;
  const col = score >= 80 ? "#c6ff4e" : score >= 60 ? "#ffcc44" : "#ff6b6b";
  return (
    <div className="quality-ring">
      <svg width="68" height="68" viewBox="0 0 68 68">
        <circle cx="34" cy="34" r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="5"/>
        <circle cx="34" cy="34" r={r} fill="none" stroke={col} strokeWidth="5"
          strokeLinecap="round" strokeDasharray={C}
          strokeDashoffset={C - (score / 100) * C}
          style={{ transition:"stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)" }}/>
      </svg>
      <div className="val" style={{ color: col }}>{score}%</div>
    </div>
  );
}

function BarChart({ values, color }) {
  const mn = Math.min(...values), mx = Math.max(...values), B = 28;
  const bins = Array(B).fill(0);
  values.forEach(v => { const i = Math.min(B-1,Math.floor(((v-mn)/(mx-mn||1))*B)); bins[i]++; });
  const maxB = Math.max(...bins);
  return (
    <div className="bar-wrap">
      {bins.map((b,i) => (
        <div key={i} className="bar-item" style={{
          height:`${Math.max(3,(b/maxB)*100)}%`,
          background:`linear-gradient(180deg,${color},${color}44)`,
          animationDelay:`${i*.018}s`,
        }}/>
      ))}
    </div>
  );
}

export default function App() {
  const [tab, setTab]             = useState("upload");
  const [file, setFile]           = useState(null);
  const [summary, setSummary]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [preview, setPreview]     = useState([]);
  const [insights, setInsights]   = useState([]);
  const [suggs, setSuggs]         = useState([]);
  const [missing, setMissing]     = useState({});
  const [mvSel, setMvSel]         = useState({});
  const [mvMsg, setMvMsg]         = useState({});
  const [story, setStory]         = useState("");
  const [q, setQ]                 = useState("");
  const [ans, setAns]             = useState("");
  const [qaLoad, setQaLoad]       = useState(false);
  const [charts, setCharts]       = useState([]);

  const go = (id) => { setTab(id); setError(""); };

  const upload = async () => {
    if (!file) { setError("Please select a CSV file first."); return; }
    setLoading(true); setError("");
    try {
      const fd = new FormData(); fd.append("file", file);
      const [r, ch] = await Promise.all([
        axios.post(`${API}/upload`, fd),
        axios.get(`${API}/charts`).catch(() => ({ data: { charts: [] } })),
      ]);
      setSummary(r.data);
      setCharts(ch.data.charts || []);
      setTab("summary");
    } catch { setError("Upload failed — make sure the file is a valid CSV."); }
    setLoading(false);
  };

  const loadPreview     = async () => { try { setPreview((await axios.get(`${API}/preview`)).data); } catch { setError("Upload a dataset first."); } };
  const loadInsights    = async () => { try { setInsights((await axios.get(`${API}/insights`)).data.insights); } catch { setError("Upload a dataset first."); } };
  const loadSuggs       = async () => { try { setSuggs((await axios.get(`${API}/business_suggestions`)).data.business_suggestions); } catch { setError("Upload a dataset first."); } };
  const loadMissing     = async () => { try { setMissing((await axios.get(`${API}/missing_value_questions`)).data); } catch { setError("Upload a dataset first."); } };
  const loadStory       = async () => { try { setStory((await axios.get(`${API}/story`)).data.story); } catch { setError("Upload a dataset first."); } };

  const applyMV = async (col) => {
    const m = mvSel[col]; if (!m) { setError(`Pick a method for "${col}"`); return; }
    try { await axios.post(`${API}/handle_null_values?column=${encodeURIComponent(col)}&method=${m}`); setMvMsg(p=>({...p,[col]:"✓ Applied"})); }
    catch { setError("Could not apply method."); }
  };

  const askQ = async () => {
    if (!q.trim()) return;
    setQaLoad(true); setAns("");
    try { setAns((await axios.get(`${API}/ask?question=${encodeURIComponent(q)}`)).data.answer); }
    catch { setAns("Could not get answer — upload a dataset first."); }
    setQaLoad(false);
  };

  const COLS = ["#4e8cff","#c6ff4e","#ff6eb4","#ffcc44","#9b8fff","#4ec9ff"];

  return (
    <>
      <StyleInject />
      <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>

        {/* SIDEBAR */}
        <aside style={{
          width:220, flexShrink:0, background:"var(--surface)",
          borderRight:"1px solid var(--border)",
          display:"flex", flexDirection:"column", padding:"0 10px",
        }}>
          <div style={{ padding:"24px 8px 20px", borderBottom:"1px solid var(--border)" }}>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:21, fontWeight:700, letterSpacing:-0.5 }}>
              Data<span style={{ color:"var(--lime)" }}>Lens</span>
            </div>
            <div style={{ fontSize:11, color:"var(--muted)", marginTop:3 }}>AI Analytics Platform</div>
          </div>

          <nav style={{ flex:1, padding:"14px 0", display:"flex", flexDirection:"column", gap:2 }}>
            <div style={{ fontSize:10, color:"var(--muted2)", textTransform:"uppercase", letterSpacing:".12em", padding:"4px 14px 8px" }}>Workspace</div>
            {NAV.map(n => (
              <div key={n.id} className={`nav-item${tab===n.id?" active":""}`} onClick={() => go(n.id)}>
                <span style={{ fontSize:14 }}>{n.icon}</span> {n.label}
              </div>
            ))}
          </nav>

          <div style={{ padding:"14px 8px", borderTop:"1px solid var(--border)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, color:"var(--muted)" }}>
              <span style={{
                width:7, height:7, borderRadius:"50%", flexShrink:0,
                background: summary ? "var(--lime)" : "var(--muted2)",
                boxShadow: summary ? "0 0 8px var(--lime)" : "none",
              }}/>
              {summary ? `${summary.rows.toLocaleString()} rows loaded` : "No data loaded"}
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex:1, overflowY:"auto", background:"var(--bg)" }}>

          {/* Topbar */}
          <div style={{
            height:56, display:"flex", alignItems:"center", padding:"0 32px",
            borderBottom:"1px solid var(--border)", background:"rgba(7,8,15,.85)",
            backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50,
            justifyContent:"space-between",
          }}>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:16, fontWeight:600 }}>
              {NAV.find(n=>n.id===tab)?.label}
            </div>
            <div style={{ fontSize:11, color:"var(--muted)", fontFamily:"monospace" }}>
              datalens-backend-ljqe.onrender.com
            </div>
          </div>

          <div style={{ padding:"32px", maxWidth:940, margin:"0 auto" }}>

            {error && (
              <div className="error-toast fu">
                ⚠ {error}
                <span style={{ marginLeft:"auto", cursor:"pointer", opacity:.5 }} onClick={() => setError("")}>✕</span>
              </div>
            )}

            {/* ── UPLOAD ── */}
            {tab === "upload" && (
              <div className="fu">
                <div style={{ marginBottom:32 }}>
                  <h1 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:34, fontWeight:700, lineHeight:1.1, marginBottom:10 }}>
                    Upload your{" "}
                    <span style={{ color:"var(--lime)", fontFamily:"'Instrument Serif',serif", fontStyle:"italic" }}>dataset</span>
                  </h1>
                  <p style={{ fontSize:14, color:"var(--muted)", lineHeight:1.65, maxWidth:480 }}>
                    Drop a CSV file and get instant AI-powered analysis, visual charts, insights and business recommendations.
                  </p>
                </div>

                <div className="upload-zone">
                  <input type="file" accept=".csv" onChange={e => { setFile(e.target.files[0]); setError(""); }}/>
                  <div style={{ fontSize:30, marginBottom:14, opacity:.45 }}>⬆</div>
                  <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:16, fontWeight:600, marginBottom:6 }}>
                    {file ? `✓  ${file.name}` : "Drop your CSV file here"}
                  </div>
                  <div style={{ fontSize:12, color:"var(--muted)" }}>or click to browse · CSV only · max 50 MB</div>
                </div>

                <div style={{ marginTop:20, display:"flex", gap:12, alignItems:"center" }}>
                  <button className="btn btn-lime" onClick={upload} disabled={loading || !file}>
                    {loading ? <><span className="spinner"/> Analysing…</> : "Analyse Dataset →"}
                  </button>
                  {file && !loading && <span style={{ fontSize:12, color:"var(--muted)" }}>{(file.size/1024).toFixed(1)} KB</span>}
                </div>

                <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:44 }}>
                  {["Quality Score","Missing Values","Visual Charts","AI Insights","Data Story","Q&A"].map(f => (
                    <span key={f} style={{
                      padding:"6px 14px", borderRadius:20, fontSize:12,
                      background:"var(--surface)", border:"1px solid var(--border2)", color:"var(--muted)",
                    }}>✦ {f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* ── SUMMARY ── */}
            {tab === "summary" && !summary && (
              <div className="card fu"><div className="card-body">
                <div className="empty-state"><span className="empty-icon">◈</span>Upload a dataset to see the summary</div>
              </div></div>
            )}
            {tab === "summary" && summary && (
              <>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:14, marginBottom:20 }}>
                  {[
                    { label:"Total Rows",     val:summary.rows.toLocaleString(),    sub:`${summary.columns} columns`,                         col:"#4e8cff" },
                    { label:"Numeric Cols",   val:summary.numeric_columns.length,   sub:`${summary.categorical_columns.length} categorical`,   col:"#c6ff4e" },
                    { label:"Missing Values", val:Object.values(summary.missing_values).reduce((a,b)=>a+b,0), sub:"total nulls",              col:"#ffcc44" },
                    { label:"Duplicates",     val:summary.duplicate_rows,           sub:"duplicate rows",                                      col:"#ff6eb4" },
                  ].map((s,i) => (
                    <div key={i} className={`stat-card fu fu${i+1}`} style={{ "--ac":s.col }}>
                      <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:".1em", color:"var(--muted)", marginBottom:10 }}>{s.label}</div>
                      <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:30, fontWeight:700, color:s.col, lineHeight:1 }}>{s.val}</div>
                      <div style={{ fontSize:11, color:"var(--muted)", marginTop:5 }}>{s.sub}</div>
                    </div>
                  ))}
                  <div className="stat-card fu fu5" style={{ "--ac": summary.data_quality_score>=80?"#c6ff4e":summary.data_quality_score>=60?"#ffcc44":"#ff6b6b" }}>
                    <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:".1em", color:"var(--muted)", marginBottom:10 }}>Quality Score</div>
                    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                      <QRing score={summary.data_quality_score}/>
                      <div>
                        <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:14, fontWeight:700,
                          color:summary.data_quality_score>=80?"#c6ff4e":summary.data_quality_score>=60?"#ffcc44":"#ff6b6b" }}>
                          {summary.data_quality_score>=80?"Excellent":summary.data_quality_score>=60?"Good":"Needs Work"}
                        </div>
                        <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>Overall quality</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card fu fu6" style={{ marginBottom:20 }}>
                  <div className="card-head"><div className="card-title">⊞ Columns</div></div>
                  <div className="card-body">
                    {summary.numeric_columns.map(c=><span key={c} className="badge" style={{ background:"var(--blue-dim)",color:"var(--blue)" }}># {c}</span>)}
                    {summary.categorical_columns.map(c=><span key={c} className="badge" style={{ background:"var(--lime-dim)",color:"var(--lime)" }}>Aa {c}</span>)}
                  </div>
                </div>

                {charts.length > 0 && (
                  <div className="card fu">
                    <div className="card-head"><div className="card-title">◎ Distributions</div></div>
                    <div className="card-body">
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:14 }}>
                        {charts.map((ch,i)=>(
                          <div key={i} style={{ background:"var(--surface2)", borderRadius:10, padding:16, border:"1px solid var(--border)" }}>
                            <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:".1em", color:"var(--muted)", marginBottom:10 }}>{ch.column}</div>
                            <BarChart values={ch.values} color={COLS[i%COLS.length]}/>
                            <div style={{ fontSize:10, color:"var(--muted)", marginTop:8 }}>{ch.values.length.toLocaleString()} values</div>
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
              <div className="card fu">
                <div className="card-head">
                  <div className="card-title">⊞ Data Preview <span style={{ fontSize:11, color:"var(--muted)", fontWeight:400, marginLeft:4 }}>first 20 rows</span></div>
                  <button className="btn btn-ghost btn-sm" onClick={loadPreview}>Load →</button>
                </div>
                <div style={{ padding:0 }}>
                  {preview.length === 0
                    ? <div className="empty-state"><span className="empty-icon">⊞</span>Click "Load" to see your data</div>
                    : <div style={{ overflowX:"auto" }}><table>
                        <thead><tr>{Object.keys(preview[0]).map(k=><th key={k}>{k}</th>)}</tr></thead>
                        <tbody>{preview.map((row,i)=>(
                          <tr key={i}>{Object.values(row).map((v,j)=><td key={j} title={String(v)}>{v??"—"}</td>)}</tr>
                        ))}</tbody>
                      </table></div>
                  }
                </div>
              </div>
            )}

            {/* ── MISSING ── */}
            {tab === "missing" && (
              <div className="card fu">
                <div className="card-head">
                  <div className="card-title">◌ Handle Missing Values</div>
                  <button className="btn btn-ghost btn-sm" onClick={loadMissing}>Load →</button>
                </div>
                <div className="card-body">
                  {Object.keys(missing).length === 0
                    ? <div className="empty-state"><span className="empty-icon">◌</span>Click "Load" to detect missing values</div>
                    : Object.entries(missing).map(([col,info])=>(
                        <div key={col} className="mv-row">
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:13, fontWeight:600, marginBottom:3 }}>{col}</div>
                            <div style={{ fontSize:11, color:"var(--warn)" }}>⚠ {info.missing_count} missing</div>
                          </div>
                          <div style={{ display:"flex", gap:6 }}>
                            {info.options.map(opt=>(
                              <button key={opt} className={`method-pill ${mvSel[col]===opt?"pill-on":"pill-off"}`}
                                onClick={()=>setMvSel(p=>({...p,[col]:opt}))}>
                                {opt.replace("fill_","").replace("_"," ")}
                              </button>
                            ))}
                          </div>
                          <button className="btn btn-lime btn-sm" onClick={()=>applyMV(col)}>Apply</button>
                          {mvMsg[col] && <span style={{ fontSize:11, color:"var(--lime)" }}>{mvMsg[col]}</span>}
                        </div>
                    ))
                  }
                </div>
              </div>
            )}

            {/* ── INSIGHTS ── */}
            {tab === "insights" && (
              <div className="card fu">
                <div className="card-head">
                  <div className="card-title">◎ Data Insights</div>
                  <button className="btn btn-ghost btn-sm" onClick={loadInsights}>Generate →</button>
                </div>
                <div className="card-body">
                  {insights.length === 0
                    ? <div className="empty-state"><span className="empty-icon">◎</span>Click "Generate" to analyse your dataset</div>
                    : insights.map((ins,i)=>(
                        <div key={i} className="insight-row fu" style={{ animationDelay:`${i*.04}s` }}>
                          <span style={{ color:"var(--lime)", flexShrink:0, marginTop:1 }}>▸</span>
                          <span>{ins}</span>
                        </div>
                    ))
                  }
                </div>
              </div>
            )}

            {/* ── SUGGESTIONS ── */}
            {tab === "suggestions" && (
              <div className="card fu">
                <div className="card-head">
                  <div className="card-title">◆ Business Suggestions</div>
                  <button className="btn btn-ghost btn-sm" onClick={loadSuggs}>Generate →</button>
                </div>
                <div className="card-body">
                  {suggs.length === 0
                    ? <div className="empty-state"><span className="empty-icon">◆</span>Click "Generate" to get recommendations</div>
                    : suggs.map((s,i)=>(
                        <div key={i} className="sug-row fu" style={{ animationDelay:`${i*.04}s` }}>
                          <span style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:12, color:"var(--blue)", minWidth:24 }}>
                            {String(i+1).padStart(2,"0")}
                          </span>
                          <span>{s}</span>
                        </div>
                    ))
                  }
                </div>
              </div>
            )}

            {/* ── STORY ── */}
            {tab === "story" && (
              <div className="card fu">
                <div className="card-head">
                  <div className="card-title">◉ Data Story</div>
                  <button className="btn btn-ghost btn-sm" onClick={loadStory}>Generate →</button>
                </div>
                <div className="card-body">
                  {!story
                    ? <div className="empty-state"><span className="empty-icon">◉</span>Click "Generate" to create your data narrative</div>
                    : <p className="story-text fu">{story}</p>
                  }
                </div>
              </div>
            )}

            {/* ── ASK ── */}
            {tab === "ask" && (
              <div className="card fu">
                <div className="card-head"><div className="card-title">◐ Ask Your Data</div></div>
                <div className="card-body">
                  <div style={{ display:"flex", gap:10 }}>
                    <input className="input-field" value={q}
                      placeholder="e.g. What is the highest value? How many rows?"
                      onChange={e=>setQ(e.target.value)}
                      onKeyDown={e=>e.key==="Enter"&&askQ()}/>
                    <button className="btn btn-lime" onClick={askQ} disabled={qaLoad}>
                      {qaLoad ? <span className="spinner"/> : "Ask →"}
                    </button>
                  </div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:12 }}>
                    {["What is the highest value?","How many rows?","What is the average?"].map(qs=>(
                      <span key={qs} className="chip" onClick={()=>setQ(qs)}>{qs}</span>
                    ))}
                  </div>
                  {ans && <div className="answer-box fu">{ans}</div>}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
}
