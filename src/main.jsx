
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";

const API_BASE = "https://betwise-ai.darkerhorse25.workers.dev";

// EDIT THESE DETAILS WHEN YOU ARE READY TO INSERT YOUR MENTORSHIP AD.
const MENTORSHIP_AD = {
  headline: "MASTER FOOTBALL BETTING STRATEGY",
  description: "Join our mentorship programme and learn a structured approach to football betting.",
  buttonText: "JOIN THE MENTORSHIP",
  link: "https://example.com",
};

const NAVIGATION = [
  ["Dashboard", "▦"],
  ["All Fixtures", "⚽"],
  ["AI Selections", "✓"],
  ["Results & History", "◷"],
  ["Performance", "▤"],
  ["Settings", "⚙"],
];

const styles = `
*{box-sizing:border-box}
body{margin:0;background:#080d18;color:#edf2fa;font-family:Inter,Arial,sans-serif}
button,input{font:inherit}
button{cursor:pointer}
.app{min-height:100vh}
.topbar{height:76px;border-bottom:1px solid #202b3c;display:flex;align-items:center;justify-content:space-between;padding:0 30px;background:#0b1220;position:sticky;top:0;z-index:5}
.brand{display:flex;align-items:center;gap:12px}
.brand-icon{width:40px;height:40px;border-radius:12px;background:#123b35;color:#5ee5b0;display:grid;place-items:center;font-weight:900;font-size:22px}
.brand-name{font-weight:800;letter-spacing:1px}
.brand-sub{font-size:10px;color:#8290a6;letter-spacing:1.5px;margin-top:3px}
.layout{display:flex;min-height:calc(100vh - 76px)}
.sidebar{width:225px;padding:25px 17px;border-right:1px solid #202b3c;flex-shrink:0}
.nav-heading{font-size:10px;color:#718198;letter-spacing:1.5px;margin:12px 12px}
.nav-item{width:100%;border:0;text-align:left;padding:12px;border-radius:9px;color:#9eacc0;font-size:13px;margin:4px 0;display:flex;gap:11px;align-items:center;background:transparent}
.nav-item:hover{background:#152337;color:#fff}
.nav-item.active{background:#173b35;color:#69e3b2}
.sidebar-status{margin-top:65px;border:1px solid #26364b;border-radius:12px;padding:14px}
.main{padding:30px;flex:1;min-width:0;max-width:1500px;margin:auto;width:100%}
.page-head{display:flex;align-items:flex-end;justify-content:space-between;gap:15px;margin-bottom:25px;flex-wrap:wrap}
.eyebrow{color:#8290a6;font-size:11px;letter-spacing:1.1px}
h1{font-size:30px;margin:8px 0 5px;letter-spacing:-.7px}
.subtitle{color:#8290a6;font-size:13px}
.panel{background:#111a2a;border:1px solid #202d40;border-radius:13px}
.stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px;margin-bottom:29px}
.stat{padding:18px}
.stat-label{font-size:12px;color:#8290a6}
.stat-value{font-size:27px;font-weight:750;margin-top:10px}
.stat-note{font-size:11px;color:#718198;margin-top:5px}
.green{color:#43d9a2}
.toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:15px}
.section-title{font-weight:750;font-size:19px}
.section-sub{font-size:11px;color:#8290a6;margin-top:5px}
.filters{display:flex;gap:7px;flex-wrap:wrap}
.btn{border:1px solid #293950;border-radius:8px;padding:9px 13px;background:#111a2a;color:#aab8ca;font-size:12px}
.btn.active{background:#173b35;border-color:#287b65;color:#69e3b2}
.btn:disabled{opacity:.5;cursor:not-allowed}
.date-input{background:#111a2a;border:1px solid #293950;color:#dce6f3;padding:9px 11px;border-radius:8px;font-size:12px}
.pick-list{display:grid;gap:12px}
.pick{background:#111b2b;border:1px solid #27384e;border-radius:12px;padding:17px}
.pick-top{display:flex;justify-content:space-between;gap:15px;align-items:flex-start}
.league{font-size:10px;color:#8290a6;letter-spacing:1px;margin-bottom:9px;text-transform:uppercase}
.teams{font-size:17px;font-weight:750}
.vs{color:#8290a6;font-weight:400}
.fixture-time{font-size:11px;color:#8290a6;margin-top:8px}
.tag{background:#164436;color:#6ce6b3;border-radius:5px;padding:5px 8px;font-size:10px;font-weight:800;letter-spacing:.7px;display:inline-block}
.market-label{font-size:11px;color:#aab8ca;margin-top:8px}
.pick-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px;margin-top:17px;padding-top:15px;border-top:1px solid #29394d}
.metric-label{font-size:11px;color:#8290a6}
.metric-value{font-size:21px;font-weight:750;margin-top:6px}
.metric-note{font-size:10px;color:#718198;margin-top:5px}
.meter{height:5px;background:#29384a;border-radius:9px;overflow:hidden;margin-top:8px}
.meter span{display:block;height:100%;background:#39d6a0;border-radius:9px}
.empty,.loading,.error{padding:45px 20px;text-align:center;color:#8290a6;font-size:13px}
.error{color:#f3a4a4}
.footer{text-align:center;color:#66758b;font-size:10px;margin:32px 0 10px;letter-spacing:.7px}
.notice{padding:12px 15px;margin-bottom:18px;color:#9eacc0;font-size:11px;line-height:1.6}
.fixture-row{padding:16px;border-bottom:1px solid #26364b;display:flex;justify-content:space-between;gap:15px;align-items:center}
.fixture-row:last-child{border-bottom:0}
.ad-banner{margin-bottom:25px;padding:24px 27px;border:1px solid #8c6a32;border-radius:14px;background:linear-gradient(110deg,#30210e,#171d2c 70%,#142d32);display:flex;align-items:center;justify-content:space-between;gap:20px}
.ad-label{font-size:10px;color:#f3c875;letter-spacing:1.5px;font-weight:800;margin-bottom:9px}
.ad-title{font-size:22px;font-weight:850;letter-spacing:.2px}
.ad-description{font-size:12px;color:#c3cbd8;margin-top:8px;line-height:1.6}
.ad-button{display:inline-block;white-space:nowrap;text-decoration:none;background:#e4b85e;color:#17120a;font-weight:850;font-size:11px;padding:13px 17px;border-radius:8px}
.ad-button:hover{background:#f5cf81}
.page-placeholder{padding:45px 25px;text-align:center}
.page-placeholder h2{font-size:20px;margin:0 0 10px}
.page-placeholder p{font-size:13px;color:#8290a6;line-height:1.7;max-width:520px;margin:0 auto}
@media(max-width:850px){.sidebar{width:190px}.main{padding:22px}.stats{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:600px){
.topbar{height:66px;padding:0 15px}
.layout{min-height:calc(100vh - 66px)}
.sidebar{display:flex;width:100%;padding:8px;position:sticky;top:66px;background:#0b1220;z-index:4;border-right:0;border-bottom:1px solid #202b3c;overflow-x:auto}
.nav-heading,.sidebar-status{display:none}
.nav-item{width:auto;white-space:nowrap;padding:10px;font-size:11px;flex-shrink:0}
.layout{display:block}
.main{padding:20px 14px}
.stats{gap:9px}
.stat{padding:13px}
.stat-value{font-size:23px}
h1{font-size:26px}
.pick{padding:14px}
.teams{font-size:15px}
.pick-stats{gap:8px}
.metric-value{font-size:18px}
.ad-banner{padding:19px;display:block}
.ad-title{font-size:19px}
.ad-button{margin-top:16px}
.fixture-row{align-items:flex-start;flex-direction:column}
}
`;

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function getFixtures(payload) {
  if (Array.isArray(payload)) return payload;
  return payload?.fixtures || payload?.data?.fixtures || payload?.results || payload?.data || [];
}

function getEventId(f) {
  return f?.event_id ?? f?.id ?? f?.event?.id ?? f?.fixture?.id;
}

function getTeamNames(f) {
  return {
    home: f?.home_team?.name || f?.home?.name || f?.teams?.home?.name || f?.home_team || f?.home || "Home team",
    away: f?.away_team?.name || f?.away?.name || f?.teams?.away?.name || f?.away_team || f?.away || "Away team"
  };
}

function getFixtureDate(f) {
  return f?.date || f?.fixture_date || f?.starting_at || f?.event_date || f?.event?.date || "";
}

function getLeague(f) {
  return f?.league?.name || f?.league_name || f?.competition?.name || "Football";
}

function getKickoff(date) {
  if (!date) return "Kickoff time unavailable";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return String(date);
  return parsed.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",timeZone:"UTC"}) + " UTC";
}

function marketName(pick) {
  const key = String(pick?.market_key || pick?.market || "").toLowerCase();
  if (key.includes("over") || key.includes("1.5")) return "Over 1.5 Goals";
  if (key.includes("btts") || key.includes("both")) return "BTTS Yes";
  return pick?.market || pick?.market_key || "Qualified selection";
}

function getProbability(pick) {
  if (typeof pick?.probability_percent === "number") return pick.probability_percent;
  if (typeof pick?.probability === "number") {
    return pick.probability <= 1 ? pick.probability * 100 : pick.probability;
  }
  return null;
}

async function fetchJson(url) {
  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || data?.detail || `Request failed (${response.status})`);
  }
  return data;
}

function App() {
  const [date,setDate] = useState(todayString());
  const [filter,setFilter] = useState("all");
  const [page,setPage] = useState("Dashboard");
  const [fixtures,setFixtures] = useState([]);
  const [picks,setPicks] = useState([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [lastUpdated,setLastUpdated] = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    setPicks([]);
    setFixtures([]);

    try {
      const fixturePayload = await fetchJson(
        `${API_BASE}/api/fixtures?date=${encodeURIComponent(date)}`
      );

      const fixtureList = getFixtures(fixturePayload);
      setFixtures(fixtureList);

      const validFixtures = fixtureList.filter(f => getEventId(f) != null);
      const analyses = [];
      const concurrency = 4;

      for (let i = 0; i < validFixtures.length; i += concurrency) {
        const batch = validFixtures.slice(i,i+concurrency);

        const results = await Promise.allSettled(
          batch.map(f => fetchJson(
            `${API_BASE}/api/analyze?event_id=${encodeURIComponent(getEventId(f))}`
          ))
        );

        results.forEach((result,index) => {
          if (result.status !== "fulfilled") return;

          const analysis = result.value;
          const fixture = batch[index];
          const names = getTeamNames(fixture);
          const analysisNames = analysis?.teams || {};

          (analysis?.picks || []).forEach(pick => {
            if (pick?.decision !== "TAKE") return;

            const probability = getProbability(pick);
            if (probability == null || probability < 65) return;

            analyses.push({
              ...pick,
              probabilityPercent: probability,
              eventId: getEventId(fixture),
              home: analysisNames.home || names.home,
              away: analysisNames.away || names.away,
              league: getLeague(fixture),
              date: analysis?.fixture_date || getFixtureDate(fixture),
              availableOdds: analysis?.available_odds || {},
            });
          });
        });
      }

      analyses.sort((a,b) => b.probabilityPercent - a.probabilityPercent);
      setPicks(analyses);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || "Unable to load fixtures. Please try again.");
    } finally {
      setLoading(false);
    }
  },[date]);

  useEffect(() => {
    loadDashboard();
  },[loadDashboard]);

  const visiblePicks = useMemo(() => {
    if (filter === "all") return picks;
    if (filter === "over") return picks.filter(p => marketName(p).toLowerCase().includes("over"));
    return picks.filter(p => marketName(p).toLowerCase().includes("btts"));
  },[picks,filter]);

  const fixtureCount = fixtures.length;

  const formatDate = new Date(`${date}T12:00:00`).toLocaleDateString(undefined,{
    weekday:"long",year:"numeric",month:"long",day:"numeric"
  });

  function renderAd() {
    return (
      <section className="ad-banner">
        <div>
          <div className="ad-label">★ FEATURED MENTORSHIP</div>
          <div className="ad-title">{MENTORSHIP_AD.headline}</div>
          <div className="ad-description">{MENTORSHIP_AD.description}</div>
        </div>
        <a className="ad-button" href={MENTORSHIP_AD.link} target="_blank" rel="noreferrer">
          {MENTORSHIP_AD.buttonText} ↗
        </a>
      </section>
    );
  }

  function renderPicks() {
    return (
      <>
        <div className="toolbar">
          <div>
            <div className="section-title">AI Selections</div>
            <div className="section-sub">Only qualifying TAKE selections are displayed.</div>
          </div>
          <div className="filters">
            {[
              ["all","All"],
              ["over","Over 1.5"],
              ["btts","BTTS Yes"]
            ].map(([value,label]) => (
              <button key={value} className={`btn ${filter===value?"active":""}`}
                onClick={() => setFilter(value)}>{label}</button>
            ))}
          </div>
        </div>

        <div className="notice panel">
          Selections are generated using BetWise Poisson v3.2. Bookmaker odds are displayed for reference and do not determine qualification.
        </div>

        {loading && <div className="panel loading">Analysing fixtures and checking qualifying selections...</div>}

        {!loading && error && (
          <div className="panel error">
            <div style={{fontWeight:700,marginBottom:8}}>Unable to load selections</div>
            {error}
            <div style={{marginTop:15}}>
              <button className="btn" onClick={loadDashboard}>Try again</button>
            </div>
          </div>
        )}

        {!loading && !error && visiblePicks.length === 0 && (
          <div className="panel empty">
            <div style={{fontSize:25,marginBottom:10}}>⌕</div>
            <div style={{color:"#dce6f3",fontWeight:700,marginBottom:7}}>
              No qualifying selections found
            </div>
            No fixtures currently meet the selected market and qualification rules.
          </div>
        )}

        {!loading && !error && visiblePicks.length > 0 && (
          <div className="pick-list">
            {visiblePicks.map((pick,index) => {
              const probability = pick.probabilityPercent;
              const odds = pick.odds ?? pick.availableOdds?.[pick.market_key] ?? null;

              return (
                <article className="pick" key={`${pick.eventId}-${pick.market_key}-${index}`}>
                  <div className="pick-top">
                    <div>
                      <div className="league">{pick.league}</div>
                      <div className="teams">
                        {pick.home} <span className="vs">vs</span> {pick.away}
                      </div>
                      <div className="fixture-time">{getKickoff(pick.date)}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <span className="tag">TAKE</span>
                      <div className="market-label">{marketName(pick)}</div>
                    </div>
                  </div>

                  <div className="pick-stats">
                    <div>
                      <div className="metric-label">Predicted probability</div>
                      <div className="metric-value green">{probability.toFixed(2)}%</div>
                      <div className="meter"><span style={{width:`${Math.min(probability,100)}%`}} /></div>
                    </div>
                    <div>
                      <div className="metric-label">Available odds</div>
                      <div className="metric-value">{odds == null ? "—" : Number(odds).toFixed(2)}</div>
                      <div className="metric-note">BSD reference odds</div>
                    </div>
                    <div>
                      <div className="metric-label">Market</div>
                      <div className="metric-value" style={{fontSize:15}}>{marketName(pick)}</div>
                      <div className="metric-note">Qualified selection</div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </>
    );
  }

  function renderFixtures() {
    return (
      <>
        <div className="toolbar">
          <div>
            <div className="section-title">All Fixtures</div>
            <div className="section-sub">Fixtures returned by the football data provider.</div>
          </div>
          <span className="tag">{fixtureCount} FIXTURES</span>
        </div>

        {loading && <div className="panel loading">Loading fixtures...</div>}
        {!loading && error && <div className="panel error">{error}</div>}
        {!loading && !error && fixtures.length === 0 && (
          <div className="panel empty">No fixtures available for this date.</div>
        )}

        {!loading && !error && fixtures.length > 0 && (
          <div className="panel">
            {fixtures.map((fixture,index) => {
              const names = getTeamNames(fixture);
              return (
                <div className="fixture-row" key={getEventId(fixture) ?? index}>
                  <div>
                    <div className="league">{getLeague(fixture)}</div>
                    <div className="teams">{names.home} <span className="vs">vs</span> {names.away}</div>
                    <div className="fixture-time">{getKickoff(getFixtureDate(fixture))}</div>
                  </div>
                  <div className="eyebrow">FIXTURE</div>
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  }

  function renderPageContent() {
    if (page === "Dashboard") {
      return (
        <>
          <div className="stats">
            <div className="panel stat">
              <div className="stat-label">Available fixtures</div>
              <div className="stat-value">{loading ? "—" : fixtureCount}</div>
              <div className="stat-note">Selected date</div>
            </div>
            <div className="panel stat">
              <div className="stat-label">Qualified picks</div>
              <div className="stat-value green">{loading ? "—" : picks.length}</div>
              <div className="stat-note">Meeting model criteria</div>
            </div>
            <div className="panel stat">
              <div className="stat-label">Markets monitored</div>
              <div className="stat-value">02</div>
              <div className="stat-note">Over 1.5 · BTTS Yes</div>
            </div>
            <div className="panel stat">
              <div className="stat-label">Probability threshold</div>
              <div className="stat-value">65%</div>
              <div className="stat-note">Minimum qualification</div>
            </div>
          </div>
          {renderPicks()}
        </>
      );
    }

    if (page === "All Fixtures") return renderFixtures();
    if (page === "AI Selections") return renderPicks();

    if (page === "Results & History") {
      return (
        <div className="panel page-placeholder">
          <h2>Results & History</h2>
          <p>Historical selection tracking is not yet connected. This section will show settled selections, match results and recorded outcomes once the results-tracking system is implemented.</p>
        </div>
      );
    }

    if (page === "Performance") {
      return (
        <div className="panel page-placeholder">
          <h2>Performance Analytics</h2>
          <p>Performance reports will be available after BetWise AI has collected and verified a sufficient history of settled selections. No accuracy or profit figures are being assumed.</p>
        </div>
      );
    }

    return (
      <div className="panel page-placeholder">
        <h2>Settings</h2>
        <p>BetWise AI uses the BSD football data provider and the BetWise Poisson v3.2 statistical model. Provider connection details are kept out of the main dashboard.</p>
        <p style={{marginTop:12}}>Markets currently monitored: Over 1.5 Goals and BTTS Yes.</p>
        <p style={{marginTop:12}}>Minimum probability: 65%. Minimum odds: 1.25.</p>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="topbar">
          <div className="brand">
            <div className="brand-icon">B</div>
            <div>
              <div className="brand-name">BETWISE <span className="green">AI</span></div>
              <div className="brand-sub">FOOTBALL INTELLIGENCE</div>
            </div>
          </div>
          <div className="eyebrow">FOOTBALL ANALYTICS PLATFORM</div>
        </header>

        <div className="layout">
          <aside className="sidebar">
            <div className="nav-heading">WORKSPACE</div>
            {NAVIGATION.slice(0,5).map(([label,icon]) => (
              <button key={label}
                className={`nav-item ${page===label?"active":""}`}
                onClick={() => setPage(label)}>
                <span>{icon}</span>{label}
              </button>
            ))}

            <div className="nav-heading" style={{marginTop:35}}>SYSTEM</div>
            <button
              className={`nav-item ${page==="Settings"?"active":""}`}
              onClick={() => setPage("Settings")}>
              <span>⚙</span>Settings
            </button>

            <div className="sidebar-status">
              <div style={{fontSize:11,fontWeight:700}}>MODEL STATUS</div>
              <div className="green" style={{fontSize:12,marginTop:10}}>● Operational</div>
              <div className="eyebrow" style={{marginTop:7}}>BetWise Poisson v3.2</div>
            </div>
          </aside>

          <main className="main">
            <div className="page-head">
              <div>
                <div className="eyebrow">{formatDate.toUpperCase()}</div>
                <h1>{page}</h1>
                <div className="subtitle">
                  {page === "Dashboard" ? "Your football intelligence overview." : `BetWise AI · ${page}`}
                </div>
              </div>

              <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
                <input className="date-input" type="date" value={date}
                  onChange={e => setDate(e.target.value)} />
                <button className="btn active" onClick={loadDashboard} disabled={loading}>
                  {loading ? "Loading..." : "↻ Refresh"}
                </button>
              </div>
            </div>

            {["Dashboard","All Fixtures","AI Selections"].includes(page) && renderAd()}

            {renderPageContent()}

            <div className="footer">
              BETWISE AI · STATISTICAL ANALYSIS, NOT A GUARANTEE OF RESULTS
              {lastUpdated && <div style={{marginTop:7}}>Last updated: {lastUpdated.toLocaleTimeString()}</div>}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
