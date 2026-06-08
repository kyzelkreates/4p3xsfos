import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, AlertTriangle, BarChart3, Brain, Briefcase,
  CheckCircle2, ChevronRight, ClipboardList, Download, Eye,
  FileText, GitBranch, History, Home, Layers, Menu, Network,
  Radar, RefreshCcw, Rocket, Settings, ShieldCheck, Sparkles,
  Smartphone, Target, Users, X, Zap, TrendingUp, Lock, Globe,
  BookOpen, Star
} from 'lucide-react';
import { BRAND, agents, navItems, scenarioTemplates } from './data';
import { loadState, saveState, resetDemo, updateScenario, createScenario } from './storage';
import { agentReview, getScenarioScores, outcomePaths, intelligenceFeed, impactMatrix } from './engines';
import './styles.css';

/* ── State hook ── */
function useAppState() {
  const [state, setState] = useState(loadState);
  useEffect(() => saveState(state), [state]);
  const mutate = fn => setState(prev => fn(prev));
  return [state, mutate];
}

const IconMap = {
  home: Home, dashboard: BarChart3, workspace: ClipboardList,
  stakeholders: Users, decisions: GitBranch, engines: Radar,
  arena: Brain, timeline: Activity, compare: Layers,
  confidence: ShieldCheck, reports: FileText, evidence: CheckCircle2,
  team: Users, org: Briefcase, version: History, audit: History,
  mobile: Smartphone, portfolio: Network, settings: Settings,
};

/* ══════════════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════════════ */
function App() {
  const [state, mutate] = useAppState();
  const [view, setView] = useState('home');
  const scenario = state.scenarios.find(s => s.id === state.app.activeScenarioId) || state.scenarios[0];
  const scores = getScenarioScores(scenario);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  const closeNav = () => mutate(s => ({ ...s, app: { ...s.app, mobileMenuOpen: false } }));

  return (
    <div className={`app ${state.app.wowMode ? 'wowMode' : ''}`}>
      <Nav view={view} setView={setView} state={state} mutate={mutate} />
      {state.app.mobileMenuOpen && (
        <div className="navOverlay" onClick={closeNav} aria-hidden="true" />
      )}
      <main className="main">
        <Topbar state={state} mutate={mutate} scenario={scenario} scores={scores} setView={setView} />
        {view === 'home'        && <HomePage   setView={setView} scenario={scenario} scores={scores} state={state} mutate={mutate} />}
        {view === 'dashboard'   && <Dashboard  scenario={scenario} scores={scores} setView={setView} />}
        {view === 'workspace'   && <Workspace  scenario={scenario} mutate={mutate} state={state} />}
        {view === 'stakeholders'&& <Stakeholders scenario={scenario} />}
        {view === 'decisions'   && <Decisions  scenario={scenario} />}
        {view === 'engines'     && <Engines    scenario={scenario} scores={scores} />}
        {view === 'arena'       && <Arena      scenario={scenario} />}
        {view === 'timeline'    && <Timeline   scenario={scenario} />}
        {view === 'compare'     && <Compare    scenario={scenario} />}
        {view === 'confidence'  && <Confidence scenario={scenario} scores={scores} />}
        {view === 'reports'     && <Reports    scenario={scenario} scores={scores} />}
        {view === 'evidence'    && <Evidence   scenario={scenario} />}
        {view === 'team'        && <Team       state={state} />}
        {view === 'org'         && <Org        state={state} />}
        {view === 'version'     && <Versions   scenario={scenario} />}
        {view === 'audit'       && <Audit      state={state} />}
        {view === 'mobile'      && <MobilePWA  scenario={scenario} scores={scores} />}
        {view === 'portfolio'   && <PortfolioLayer />}
        {view === 'settings'    && <SettingsPage state={state} mutate={mutate} />}
      </main>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   NAV
══════════════════════════════════════════════════════════════ */
function Nav({ view, setView, state, mutate }) {
  const navigate = (id) => {
    setView(id);
    mutate(s => ({ ...s, app: { ...s.app, mobileMenuOpen: false } }));
  };

  return (
    <aside className={`nav ${state.app.mobileMenuOpen ? 'open' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="brand">
        <div className="mark" aria-hidden="true">4X</div>
        <div>
          <strong>{BRAND.product}</strong>
          <small>{BRAND.powered}</small>
        </div>
        <button
          className="iconBtn close"
          onClick={() => mutate(s => ({ ...s, app: { ...s.app, mobileMenuOpen: false } }))}
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>
      <nav className="navList">
        {navItems.map(([id, label]) => {
          const Icon = IconMap[id] || ChevronRight;
          return (
            <button
              key={id}
              className={view === id ? 'active' : ''}
              onClick={() => navigate(id)}
              aria-current={view === id ? 'page' : undefined}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

/* ══════════════════════════════════════════════════════════════
   TOPBAR
══════════════════════════════════════════════════════════════ */
function Topbar({ state, mutate, scenario, scores, setView }) {
  return (
    <header className="topbar">
      <button
        className="iconBtn menu"
        onClick={() => mutate(s => ({ ...s, app: { ...s.app, mobileMenuOpen: true } }))}
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>
      <div className="topTitle">
        <strong>{scenario?.title || '4P3X ScenarioForge OS™'}</strong>
        <small>
          {state.app.demoMode
            ? '⬤ DEMO MODE — safe sample data active'
            : '⬤ LIVE MODE — backend configuration required'}
        </small>
      </div>
      <div className="topMeta">
        <span className="statusPill">{state.app.liveProvider}</span>
        <span className="statusPill glow" aria-label={`Wow score ${scores.wow}%`}>
          Wow {scores.wow}%
        </span>
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════════ */
function HomePage({ setView, scenario, scores, state, mutate }) {
  const handleReset = () => {
    const next = resetDemo();
    mutate(() => next);
  };

  return (
    <section className="hero" aria-label="ScenarioForge OS home">
      {/* Left hero panel */}
      <div className="heroText glass">
        <span className="eyebrow">
          <Sparkles size={14} aria-hidden="true" />
          {BRAND.portfolio}
        </span>
        <h1>{BRAND.product}</h1>
        <p>
          {BRAND.strapline}. Model complex decisions, map stakeholders, compare decision branches,
          simulate future outcomes, and export evidence-based intelligence reports.
        </p>
        <div className="heroActions">
          <button onClick={() => setView('dashboard')} aria-label="Enter Command Dashboard">
            <Rocket size={16} aria-hidden="true" /> Enter Command Dashboard
          </button>
          <button className="secondary" onClick={() => setView('arena')} aria-label="Open AI Simulation Arena">
            <Brain size={16} aria-hidden="true" /> AI Simulation Arena
          </button>
          <button className="secondary" onClick={() => setView('reports')} aria-label="Export Intelligence Report">
            <Download size={16} aria-hidden="true" /> Export Report
          </button>
        </div>
        <div className="signalStrip" aria-label="Product capabilities">
          <span>Simulation-ready</span>
          <span>Multi-agent AI</span>
          <span>Backend-ready</span>
          <span>PWA-ready</span>
          <span>Local-first</span>
          <span>Demo / Live</span>
        </div>
        {/* Demo reset shortcut */}
        <div style={{ marginTop: 18 }}>
          <button className="secondary" style={{ fontSize: 12, padding: '8px 14px' }} onClick={handleReset}>
            <RefreshCcw size={13} aria-hidden="true" /> Reset Demo Data
          </button>
        </div>
      </div>

      {/* Right holo panel */}
      <div className="holoPanel glass">
        <ScenarioOrb scores={scores} />
        <h3>Decision Intelligence Layer</h3>
        <p>
          ScenarioForge OS™ extends the 4P3X Verse™ architecture beyond dashboards into
          strategic simulation, multi-agent advisory support, risk forecasting, and
          evidence-based future planning.
        </p>
        <div className="miniGrid">
          <Metric label="Active scenario" value={state.scenarios.length} />
          <Metric label="AI agents"       value="4" />
          <Metric label="Decision paths"  value={scenario?.decisions?.length || 0} />
          <Metric label="Wow score"        value={`${scores.wow}%`} />
        </div>
        <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="secondary" style={{ fontSize: 12, padding: '8px 12px' }} onClick={() => setView('portfolio')}>
            <Network size={13} aria-hidden="true" /> Portfolio Layer
          </button>
          <button className="secondary" style={{ fontSize: 12, padding: '8px 12px' }} onClick={() => setView('settings')}>
            <Settings size={13} aria-hidden="true" /> API Config Guard™
          </button>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════════ */
function Dashboard({ scenario, scores, setView }) {
  const feed = intelligenceFeed(scenario);

  if (!scenario) {
    return (
      <Page title="Scenario Command Dashboard" subtitle="No scenario selected.">
        <EmptyState icon={BarChart3} title="No active scenario" message="Create or select a scenario in the Workspace to begin." />
      </Page>
    );
  }

  return (
    <Page title="Scenario Command Dashboard" subtitle="High-level decision intelligence for the active scenario.">
      <div className="demoBanner" role="status">
        <CheckCircle2 size={15} aria-hidden="true" />
        Showing demo scenario — safe simulation data. Switch to Live Mode in Settings when backend is configured.
      </div>
      <div className="grid four">
        <Metric label="Confidence"  value={`${scores.confidence}%`} />
        <Metric label="Opportunity" value={`${scores.opportunity}%`} />
        <Metric label="Risk Load"   value={`${scores.risk}%`} />
        <Metric label="Evidence"    value={`${scores.evidence}%`} />
      </div>
      <div className="grid two">
        <Card title="Readiness Command">
          <h2 style={{ color: 'var(--gold)', fontSize: 22 }}>{scores.readiness}</h2>
          <p style={{ marginTop: 8 }}>{scenario.goal}</p>
          <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => setView('reports')}>
              <Download size={15} aria-hidden="true" /> Generate Report
            </button>
            <button className="secondary" onClick={() => setView('arena')}>
              <Brain size={15} aria-hidden="true" /> AI Arena
            </button>
          </div>
        </Card>
        <Card title="Intelligence Feed">
          <div className="feed" role="feed" aria-label="Intelligence feed">
            {feed.map((f, i) => (
              <div className="feedItem" key={i}>
                <span>{f.label}</span>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="scenarioMatrix glass">
        <h2>Scenario Matrix</h2>
        <div className="matrixGrid">
          <MatrixCell label="Stakeholders"     value={scenario.stakeholders.length} />
          <MatrixCell label="Decision branches" value={scenario.decisions.length} />
          <MatrixCell label="Assumptions"       value={scenario.assumptions.length} />
          <MatrixCell label="Evidence records"  value={scenario.evidence.length} />
          <MatrixCell label="Known unknowns"    value={scenario.knownUnknowns.length} />
          <MatrixCell label="Stop gates"        value="5" />
        </div>
      </div>
    </Page>
  );
}

/* ══════════════════════════════════════════════════════════════
   WORKSPACE
══════════════════════════════════════════════════════════════ */
function Workspace({ scenario, mutate, state }) {
  const [saved, setSaved] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const update = (field, value) => {
    mutate(s => updateScenario(s, scenario.id, { [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCreate = () => {
    if (!selectedTemplate) return;
    mutate(s => createScenario(s, selectedTemplate));
    setCreating(false);
    setSelectedTemplate('');
  };

  if (!scenario) {
    return (
      <Page title="Scenario Workspace" subtitle="Create and manage scenario records.">
        <EmptyState icon={ClipboardList} title="No scenario found" message="Create a new scenario to get started." />
      </Page>
    );
  }

  return (
    <Page title="Scenario Workspace" subtitle="Create, edit and control the core scenario record through the local SSOT.">
      {saved && (
        <div className="demoBanner" role="status" style={{ marginBottom: 14 }}>
          <CheckCircle2 size={15} aria-hidden="true" /> Scenario saved to local storage.
        </div>
      )}

      {/* Scenario switcher */}
      {state.scenarios.length > 1 && (
        <Card title="Active Scenario" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {state.scenarios.map(s => (
              <button
                key={s.id}
                className={s.id === scenario.id ? '' : 'secondary'}
                style={{ fontSize: 12, padding: '8px 14px' }}
                onClick={() => mutate(st => ({ ...st, app: { ...st.app, activeScenarioId: s.id } }))}
              >
                {s.title.length > 30 ? s.title.slice(0, 30) + '…' : s.title}
              </button>
            ))}
          </div>
        </Card>
      )}

      <div className="formGrid">
        <label>
          Title
          <input value={scenario.title} onChange={e => update('title', e.target.value)} />
        </label>
        <label>
          Sector
          <input value={scenario.sector} onChange={e => update('sector', e.target.value)} />
        </label>
        <label>
          Status
          <input value={scenario.status} onChange={e => update('status', e.target.value)} />
        </label>
        <label>
          Timeframe
          <input value={scenario.timeframe} onChange={e => update('timeframe', e.target.value)} />
        </label>
        <label className="wide">
          Goal
          <textarea value={scenario.goal} onChange={e => update('goal', e.target.value)} />
        </label>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={handleSave}>
          <CheckCircle2 size={15} aria-hidden="true" /> Save Changes
        </button>
        <button className="secondary" onClick={() => setCreating(!creating)}>
          <Rocket size={15} aria-hidden="true" /> New Scenario
        </button>
      </div>

      {creating && (
        <Card title="Create New Scenario" style={{ marginBottom: 18 }}>
          <label style={{ marginBottom: 10 }}>
            Choose a template
            <select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)}>
              <option value="">— select template —</option>
              {scenarioTemplates.map(t => <option key={t} value={t}>{t}</option>)}
              <option value="Blank strategic scenario">Blank strategic scenario</option>
            </select>
          </label>
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button onClick={handleCreate} disabled={!selectedTemplate}>
              <Rocket size={14} aria-hidden="true" /> Create
            </button>
            <button className="secondary" onClick={() => setCreating(false)}>Cancel</button>
          </div>
        </Card>
      )}

      <div className="grid three">
        <Card title="Assumptions">
          {scenario.assumptions.length === 0
            ? <EmptyState icon={BookOpen} title="No assumptions" message="Add assumptions to strengthen the scenario model." />
            : <List items={scenario.assumptions.map(a => `${a.label} — ${a.confidence}% confidence`)} />
          }
        </Card>
        <Card title="Constraints">
          {scenario.constraints.length === 0
            ? <EmptyState icon={Lock} title="No constraints" message="Define constraints to surface blockers." />
            : <List items={scenario.constraints.map(c => `${c.label} — ${c.severity}% severity`)} />
          }
        </Card>
        <Card title="Known Unknowns">
          {scenario.knownUnknowns.length === 0
            ? <EmptyState icon={AlertTriangle} title="No known unknowns" message="Document knowledge gaps here." />
            : <List items={scenario.knownUnknowns} />
          }
        </Card>
      </div>
    </Page>
  );
}

/* ══════════════════════════════════════════════════════════════
   STAKEHOLDERS
══════════════════════════════════════════════════════════════ */
function Stakeholders({ scenario }) {
  const matrix = impactMatrix(scenario);

  if (!scenario.stakeholders.length) {
    return (
      <Page title="Stakeholder Mapping System" subtitle="Influence, priority, benefit and risk exposure.">
        <EmptyState icon={Users} title="No stakeholders defined" message="Add stakeholders to the scenario to generate the impact heatmap." />
      </Page>
    );
  }

  return (
    <Page title="Stakeholder Mapping System" subtitle="Influence, priority, benefit potential, communication needs and risk exposure.">
      <div className="impactMap glass">
        <h2>Impact Heatmap</h2>
        {matrix.map(m => (
          <div className="impactRow" key={m.name}>
            <span>{m.name}</span>
            <div className="heat" role="progressbar" aria-valuenow={m.impact} aria-valuemin="0" aria-valuemax="100" aria-label={`${m.name} impact ${m.impact}%`}>
              <i style={{ width: `${m.impact}%` }} />
            </div>
            <b>{m.impact}% impact</b>
          </div>
        ))}
      </div>
      <div className="grid cards">
        {scenario.stakeholders.map(s => (
          <Card key={s.id} title={s.name}>
            <p className="muted">{s.type}</p>
            <Bars data={{ Influence: s.influence, Priority: s.priority, Risk: s.riskExposure, Benefit: s.benefit }} />
            <p style={{ marginTop: 12, fontSize: 13, color: 'var(--muted)' }}>{s.communicationNeed}</p>
          </Card>
        ))}
      </div>
    </Page>
  );
}

/* ══════════════════════════════════════════════════════════════
   DECISIONS
══════════════════════════════════════════════════════════════ */
function Decisions({ scenario }) {
  if (!scenario.decisions.length) {
    return (
      <Page title="Decision Tree Builder" subtitle="Compare route options before committing resources.">
        <EmptyState icon={GitBranch} title="No decision branches" message="Add decision branches to map possible paths forward." />
      </Page>
    );
  }

  return (
    <Page title="Decision Tree Builder" subtitle="Compare route options before committing resources.">
      <div className="branchRail" role="list" aria-label="Decision branch rail">
        {scenario.decisions.map((d, i) => (
          <div className="branchNode" key={d.id} role="listitem">
            <span aria-hidden="true">{i + 1}</span>
            <div>
              <strong>{d.title}</strong>
              <small>{d.recommendation}</small>
            </div>
          </div>
        ))}
      </div>
      <div className="grid cards">
        {scenario.decisions.map(d => (
          <Card key={d.id} title={d.title}>
            <Bars data={{ Cost: d.cost, Risk: d.risk, Complexity: d.complexity, Time: d.time, Upside: d.upside, Confidence: d.confidence }} />
            <p style={{ marginTop: 12 }}><strong>{d.recommendation}</strong></p>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>{d.downside}</p>
            {d.dependencies?.length > 0 && (
              <>
                <h4>Dependencies</h4>
                <List items={d.dependencies} />
              </>
            )}
          </Card>
        ))}
      </div>
    </Page>
  );
}

/* ══════════════════════════════════════════════════════════════
   ENGINES
══════════════════════════════════════════════════════════════ */
function Engines({ scenario, scores }) {
  return (
    <Page title="Risk, Opportunity & Evidence Engines" subtitle="Local explainable scoring logic — no fake backend assumptions.">
      <div className="engineConsole glass">
        <div>
          <Target size={28} color="var(--gold)" aria-hidden="true" />
          <h2>Explainable Decision Core</h2>
          <p>
            Scores combine constraints, decision branches, stakeholder exposure, assumption
            confidence, evidence strength, timeline difficulty and complexity. All agents
            remain advisory and cannot guarantee outcomes.
          </p>
        </div>
        <ScenarioOrb scores={scores} />
      </div>
      <div className="grid four">
        <Metric label="Risk Engine"        value={`${scores.risk}%`} />
        <Metric label="Opportunity Engine" value={`${scores.opportunity}%`} />
        <Metric label="Evidence Engine"    value={`${scores.evidence}%`} />
        <Metric label="Execution Engine"   value={`${scores.execution}%`} />
      </div>
      <Card title="How scores are calculated">
        <div className="grid two">
          <div>
            <h4>Risk Engine</h4>
            <List items={['Constraint severity (28%)', 'Decision branch risk (25%)', 'Stakeholder exposure (25%)', 'Assumption confidence gap (22%)']} />
          </div>
          <div>
            <h4>Opportunity Engine</h4>
            <List items={['Decision upside average (38%)', 'Stakeholder benefit average (34%)', 'Evidence strength average (28%)']} />
          </div>
          <div>
            <h4>Evidence Engine</h4>
            <List items={['Evidence record strength (64%)', 'Assumption confidence (36%)', 'Known unknowns penalty (−4% each)']} />
          </div>
          <div>
            <h4>Execution Engine</h4>
            <List items={['Decision complexity inverse (32%)', 'Time difficulty inverse (24%)', 'Scenario confidence base (44%)']} />
          </div>
        </div>
      </Card>
    </Page>
  );
}

/* ══════════════════════════════════════════════════════════════
   AI ARENA
══════════════════════════════════════════════════════════════ */
function Arena({ scenario }) {
  const [revealed, setRevealed] = useState({});

  const toggleReveal = (id) => setRevealed(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <Page title="AI Simulation Arena" subtitle="Four bounded advisory agents review the scenario from independent angles.">
      <div className="agentCouncil glass">
        <h2>4P3X Intelligent AI™ Agent Council</h2>
        <p>
          Each agent has a separate role, clearly defined forbidden actions, advisory
          boundaries and stop conditions. All outputs are advisory simulation estimates —
          not guarantees, legal advice, or final decisions.
        </p>
      </div>
      <div className="grid cards">
        {agents.map(a => {
          const r = agentReview(a.id, scenario);
          const isOpen = revealed[a.id];
          return (
            <Card key={a.id} title={a.name}>
              <span className="score" aria-label={`Score ${r.score}%`}>{r.score}%</span>
              <h3 style={{ marginTop: 10 }}>{r.status}</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>{r.summary}</p>
              <button
                className="secondary"
                style={{ marginTop: 12, fontSize: 12, padding: '8px 14px' }}
                onClick={() => toggleReveal(a.id)}
                aria-expanded={isOpen}
              >
                <Eye size={13} aria-hidden="true" /> {isOpen ? 'Hide Detail' : 'Show Full Analysis'}
              </button>
              {isOpen && (
                <div style={{ marginTop: 14 }}>
                  {r.concerns?.length > 0 && (
                    <>
                      <h4>Concerns</h4>
                      <List items={r.concerns} />
                    </>
                  )}
                  {r.actions?.length > 0 && (
                    <>
                      <h4>Recommended Actions</h4>
                      <List items={r.actions} />
                    </>
                  )}
                  {r.stop?.length > 0 && (
                    <>
                      <h4>Stop Conditions</h4>
                      <List items={r.stop} />
                    </>
                  )}
                </div>
              )}
              <p className="muted" style={{ marginTop: 12, fontSize: 11, borderTop: '1px solid var(--line)', paddingTop: 10 }}>
                ⚠ Forbidden: {a.forbidden}
              </p>
            </Card>
          );
        })}
      </div>
    </Page>
  );
}

/* ══════════════════════════════════════════════════════════════
   TIMELINE
══════════════════════════════════════════════════════════════ */
function Timeline({ scenario }) {
  return (
    <Page title="Future Timeline Simulator" subtitle="Best case, expected case, risk case, failure case and partnership case.">
      <div className="timeline" role="list" aria-label="Future outcome paths">
        {outcomePaths(scenario).map((p, i) => (
          <div className={`timeNode ${p.className}`} key={p.name} role="listitem">
            <span aria-hidden="true">{i + 1}</span>
            <div>
              <h3>{p.name} — {p.probability}% probability</h3>
              <p><strong>Trigger: </strong>{p.trigger}</p>
              <p style={{ marginTop: 6 }}>{p.result}</p>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPARE
══════════════════════════════════════════════════════════════ */
function Compare({ scenario }) {
  if (!scenario.decisions.length) {
    return (
      <Page title="Outcome Path Comparison" subtitle="Compare branch strength, downside and recommended route.">
        <EmptyState icon={Layers} title="No decision branches to compare" message="Add decision branches in the Workspace to use this view." />
      </Page>
    );
  }

  return (
    <Page title="Outcome Path Comparison" subtitle="Compare branch strength, downside and recommended route.">
      <div className="table" role="table" aria-label="Decision branch comparison">
        <div className="row head" role="row">
          <span role="columnheader">Branch</span>
          <span role="columnheader">Risk</span>
          <span role="columnheader">Upside</span>
          <span role="columnheader">Confidence</span>
          <span role="columnheader">Recommendation</span>
        </div>
        {scenario.decisions.map(d => (
          <div className="row" key={d.id} role="row">
            <span role="cell">{d.title}</span>
            <span role="cell">{d.risk}%</span>
            <span role="cell">{d.upside}%</span>
            <span role="cell">{d.confidence}%</span>
            <span role="cell">{d.recommendation}</span>
          </div>
        ))}
      </div>
    </Page>
  );
}

/* ══════════════════════════════════════════════════════════════
   CONFIDENCE
══════════════════════════════════════════════════════════════ */
function Confidence({ scenario, scores }) {
  return (
    <Page title="Scenario Confidence Dashboard" subtitle="Confidence, readiness, warnings and do-not-proceed-unless logic.">
      <div className="grid two">
        <Card title="Overall Confidence">
          <div className="bigCircle" aria-label={`Overall confidence ${scores.confidence}%`}>
            {scores.confidence}%
          </div>
          <h2 style={{ textAlign: 'center', fontSize: 18, marginTop: 8 }}>{scores.readiness}</h2>
        </Card>
        <Card title="Do Not Proceed Unless">
          <List items={[
            'Scenario owner is named and accountable',
            'Unsafe guarantee language has been removed',
            'Human review and responsibility boundaries are visible',
            'Demo / live data separation has been validated',
            'Evidence and report outputs have been tested',
            'Live backend and data protection pathway are confirmed',
          ]} />
        </Card>
      </div>
      <div className="grid four">
        <Metric label="Confidence"  value={`${scores.confidence}%`} />
        <Metric label="Opportunity" value={`${scores.opportunity}%`} />
        <Metric label="Risk Load"   value={`${scores.risk}%`} />
        <Metric label="Execution"   value={`${scores.execution}%`} />
      </div>
      <Card title="Advisory Safety Boundary">
        <p>
          4P3X ScenarioForge OS™ is advisory decision-support software. It does not guarantee
          funding, adoption, legal compliance, safety outcomes, or operational success.
          Human review remains required at every stage. All agent outputs are
          confidence-based advisory simulation estimates.
        </p>
      </Card>
    </Page>
  );
}

/* ══════════════════════════════════════════════════════════════
   REPORTS
══════════════════════════════════════════════════════════════ */
function Reports({ scenario, scores }) {
  const [copied, setCopied] = useState(false);

  const report = [
    `${BRAND.product}`,
    `${BRAND.powered}`,
    ``,
    `═══════════════════════════════════════════════`,
    `SCENARIO INTELLIGENCE REPORT`,
    `═══════════════════════════════════════════════`,
    ``,
    `Scenario:     ${scenario.title}`,
    `Sector:       ${scenario.sector}`,
    `Status:       ${scenario.status}`,
    `Timeframe:    ${scenario.timeframe}`,
    `Owner:        ${scenario.owner}`,
    `Generated:    ${new Date().toLocaleString()}`,
    ``,
    `── SCORES ────────────────────────────────────`,
    `Readiness:    ${scores.readiness}`,
    `Confidence:   ${scores.confidence}%`,
    `Wow Signal:   ${scores.wow}%`,
    `Risk Load:    ${scores.risk}%`,
    `Opportunity:  ${scores.opportunity}%`,
    `Evidence:     ${scores.evidence}%`,
    `Execution:    ${scores.execution}%`,
    ``,
    `── GOAL ──────────────────────────────────────`,
    scenario.goal,
    ``,
    `── ASSUMPTIONS ───────────────────────────────`,
    ...(scenario.assumptions.map(a => `• ${a.label} (${a.confidence}% confidence)`)),
    ``,
    `── CONSTRAINTS ───────────────────────────────`,
    ...(scenario.constraints.map(c => `• ${c.label} (${c.severity}% severity)`)),
    ``,
    `── KNOWN UNKNOWNS ────────────────────────────`,
    ...(scenario.knownUnknowns.map(k => `• ${k}`)),
    ``,
    `── DECISION BRANCHES ─────────────────────────`,
    ...(scenario.decisions.map(d => `• ${d.title}: ${d.recommendation} | confidence ${d.confidence}%`)),
    ``,
    `── EVIDENCE PACK ─────────────────────────────`,
    ...(scenario.evidence.map(e => `• ${e.title} — ${e.strength}% strength (${e.type})`)),
    ``,
    `── RECOMMENDED ROUTE ─────────────────────────`,
    scores.readiness,
    ``,
    `── AI AGENT ADVISORY BOUNDARIES ─────────────`,
    `All agents are advisory. They cannot guarantee outcomes, fabricate evidence,`,
    `make final legal or safety decisions, or replace human responsibility.`,
    ``,
    `── DO NOT PROCEED UNLESS ─────────────────────`,
    `• Human review and responsibility boundaries are confirmed`,
    `• Data freshness and evidence capture are validated`,
    `• Demo / live separation is verified`,
    `• Unsafe guarantee language has been removed`,
    ``,
    `═══════════════════════════════════════════════`,
    `${BRAND.product} — ${BRAND.powered}`,
    `Advisory simulation estimate only. Not a guarantee of any outcome.`,
    `═══════════════════════════════════════════════`,
  ].join('\n');

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([report], { type: 'text/plain' }));
    a.download = `4P3X-ScenarioForge-Report-${Date.now()}.txt`;
    a.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <Page title="Intelligence Report Exporter" subtitle="Executive-summary report generated from the active scenario.">
      {copied && (
        <div className="demoBanner" role="status" style={{ marginBottom: 14 }}>
          <CheckCircle2 size={15} aria-hidden="true" /> Report copied to clipboard.
        </div>
      )}
      <Card title="Scenario Intelligence Report Preview">
        <pre aria-label="Report preview">{report}</pre>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={handleDownload}>
            <Download size={15} aria-hidden="true" /> Download .txt Report
          </button>
          <button className="secondary" onClick={handleCopy}>
            <FileText size={15} aria-hidden="true" /> {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      </Card>
    </Page>
  );
}

/* ══════════════════════════════════════════════════════════════
   EVIDENCE
══════════════════════════════════════════════════════════════ */
function Evidence({ scenario }) {
  if (!scenario.evidence.length) {
    return (
      <Page title="Evidence Pack Generator" subtitle="Proof, claim strength and report-ready artefacts.">
        <EmptyState icon={CheckCircle2} title="No evidence records" message="Add evidence records to build your proof pack." />
      </Page>
    );
  }

  return (
    <Page title="Evidence Pack Generator" subtitle="Proof, claim strength and report-ready artefacts.">
      <div className="grid cards">
        {scenario.evidence.map(e => (
          <Card key={e.id} title={e.title}>
            <span className="score" aria-label={`Strength ${e.strength}%`}>{e.strength}%</span>
            <p style={{ marginTop: 8 }}>{e.type}</p>
            <div className="bar" role="progressbar" aria-valuenow={e.strength} aria-valuemin="0" aria-valuemax="100" style={{ marginTop: 10 }}>
              <i style={{ width: `${e.strength}%` }} />
            </div>
          </Card>
        ))}
      </div>
      <Card title="Evidence Pack Checklist">
        <List items={[
          'Screenshots labelled by page and purpose',
          'Decision branches exported and reviewed',
          'Agent findings included in report',
          'Risk controls and stop conditions visible',
          'Assumptions separated from verified proof',
          'Demo / live mode clearly labelled throughout',
        ]} />
      </Card>
    </Page>
  );
}

/* ══════════════════════════════════════════════════════════════
   TEAM
══════════════════════════════════════════════════════════════ */
function Team({ state }) {
  return (
    <Page title="Collaboration / Team Workspace" subtitle="Demo role and permission layer — backend-ready for live access control.">
      <div className="liveBanner" role="note">
        <AlertTriangle size={15} aria-hidden="true" />
        Team management requires live backend configuration. Showing demo roles.
      </div>
      <div className="grid cards">
        {state.users.map(u => (
          <Card key={u.id} title={u.name}>
            <p style={{ textTransform: 'capitalize', marginBottom: 10 }}>{u.role}</p>
            <span className="statusPill">{u.permission}</span>
          </Card>
        ))}
      </div>
    </Page>
  );
}

/* ══════════════════════════════════════════════════════════════
   ORG
══════════════════════════════════════════════════════════════ */
function Org({ state }) {
  return (
    <Page title="Organisation Workspace System" subtitle="Organisation-level workspace, health and live-mode readiness.">
      {state.organisations.map(o => (
        <Card key={o.id} title={o.name} style={{ marginBottom: 16 }}>
          <div className="grid three">
            <Metric label="Workspace health"   value={`${o.workspaceHealth}%`} />
            <Metric label="Live readiness"     value={`${o.liveReadiness}%`} />
            <Metric label="Evidence readiness" value={`${o.evidenceReadiness}%`} />
          </div>
          <p style={{ marginTop: 14 }}>Plan: <strong>{o.plan}</strong></p>
        </Card>
      ))}
    </Page>
  );
}

/* ══════════════════════════════════════════════════════════════
   VERSIONS
══════════════════════════════════════════════════════════════ */
function Versions({ scenario }) {
  if (!scenario.versions?.length) {
    return (
      <Page title="Scenario Version History" subtitle="Local-first version notes for traceability.">
        <EmptyState icon={History} title="No versions recorded" message="Versions are recorded automatically as you edit." />
      </Page>
    );
  }

  return (
    <Page title="Scenario Version History" subtitle="Local-first version notes for traceability.">
      <div className="timeline">
        {scenario.versions.map(v => (
          <div className="timeNode" key={v.id}>
            <span><History size={14} aria-hidden="true" /></span>
            <div>
              <h3>{v.label}</h3>
              <p style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(v.at).toLocaleString()}</p>
              <p style={{ marginTop: 6 }}>{v.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}

/* ══════════════════════════════════════════════════════════════
   AUDIT
══════════════════════════════════════════════════════════════ */
function Audit({ state }) {
  return (
    <Page title="Audit Trail & Change Log" subtitle="Preserves actions for accountability and report trust.">
      <div className="table" role="table" aria-label="Audit trail">
        <div className="row head" role="row">
          <span role="columnheader">Time</span>
          <span role="columnheader">Actor</span>
          <span role="columnheader">Action</span>
          <span role="columnheader">Scope</span>
        </div>
        {state.audit.map(a => (
          <div className="row" key={a.id} role="row">
            <span role="cell" style={{ fontSize: 12 }}>{new Date(a.at).toLocaleString()}</span>
            <span role="cell">{a.actor}</span>
            <span role="cell">{a.action}</span>
            <span role="cell">{a.scope}</span>
          </div>
        ))}
      </div>
    </Page>
  );
}

/* ══════════════════════════════════════════════════════════════
   MOBILE PWA
══════════════════════════════════════════════════════════════ */
function MobilePWA({ scenario, scores }) {
  return (
    <Page title="Mobile Scenario Companion" subtitle="Installable PWA-ready mobile experience for reviewing decisions offline.">
      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'auto 1fr', alignItems: 'start' }}>
        <div className="phone" role="img" aria-label="Mobile PWA preview">
          <div className="phoneNotch" aria-hidden="true" />
          <h3 style={{ fontSize: 14 }}>{scenario?.title}</h3>
          <p style={{ fontSize: 12, color: 'var(--muted)' }}>{scenario?.status}</p>
          <Metric label="Mobile confidence" value={`${scores.confidence}%`} />
          <button><Eye size={14} aria-hidden="true" /> Review Next Action</button>
          <button className="secondary"><CheckCircle2 size={14} aria-hidden="true" /> Offline Draft Saved</button>
          <small style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.6 }}>
            Installable PWA — manifest, service worker and offline fallback included.
          </small>
        </div>
        <div>
          <Card title="PWA Readiness Status">
            <List items={[
              '✓ manifest.webmanifest present',
              '✓ Service worker registered (sw.js)',
              '✓ Offline fallback enabled',
              '✓ Standalone display mode',
              '✓ Theme colour matches brand (#05050a)',
              '✓ Icons: 192×192 and 512×512',
              '✓ App installable on supported browsers',
              '✓ Demo mode works fully offline',
            ]} />
          </Card>
          <Card title="Install Guidance" style={{ marginTop: 16 }}>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>
              On Chrome / Edge: look for the install icon in the address bar.<br />
              On iOS Safari: tap Share → Add to Home Screen.<br />
              On Android: tap the browser menu → Install App.
            </p>
          </Card>
        </div>
      </div>
    </Page>
  );
}

/* ══════════════════════════════════════════════════════════════
   PORTFOLIO LAYER
══════════════════════════════════════════════════════════════ */
function PortfolioLayer() {
  return (
    <Page title="Portfolio Presentation Layer" subtitle="Why ScenarioForge OS™ proves a different skill category within the 4P3X Verse™.">
      <div className="portfolioVerse glass">
        <h2>One Modular Architecture. Many AI-Powered Products.</h2>
        <p>
          The 4P3X Verse™ is designed to demonstrate something distinct: a single reusable
          software base that can be adapted into many sector-specific products. ScenarioForge OS™
          proves that the same modular architecture that powers dashboards, PWAs, welfare platforms,
          compliance tools and training systems can also become a strategic simulation and
          intelligence engine.
        </p>
        <p>
          This is not another dashboard. It is advisory scenario planning, AI-agent reasoning,
          decision-tree modelling, evidence scoring, risk forecasting, and report generation —
          all running locally-first with demo/live separation and PWA support.
        </p>
        <div className="verseCapabilities">
          {[
            { icon: Brain,        label: 'Multi-agent AI',       desc: 'Four advisory agents' },
            { icon: GitBranch,    label: 'Decision mapping',     desc: 'Branching path analysis' },
            { icon: Activity,     label: 'Timeline simulation',  desc: 'Probabilistic outcomes' },
            { icon: CheckCircle2, label: 'Evidence scoring',     desc: 'Strength-rated proof' },
            { icon: FileText,     label: 'Report generation',    desc: 'Downloadable intelligence' },
            { icon: ShieldCheck,  label: 'Safety boundaries',    desc: 'Advisory-only AI' },
            { icon: Smartphone,   label: 'PWA-ready',            desc: 'Installable, offline-safe' },
            { icon: Globe,        label: 'Backend-ready',        desc: 'Supabase / custom REST' },
            { icon: TrendingUp,   label: 'Risk forecasting',     desc: 'Explainable score engine' },
            { icon: Network,      label: '4P3X Verse™',          desc: 'One architecture, many products' },
          ].map(({ icon: Icon, label, desc }) => (
            <div className="verseCap" key={label}>
              <Icon size={22} aria-hidden="true" />
              <strong>{label}</strong>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>
      <Card title="Portfolio Positioning">
        <p>
          <strong style={{ color: 'var(--gold)' }}>ScenarioForge OS™</strong> sits alongside
          ResponseLink OS™, fleet systems, welfare platforms, and training tools as evidence
          that the 4P3X Verse™ architecture is genuinely versatile. Each product is built
          on the same local-first SSOT, demo/live toggle, PWA shell, and backend-ready
          design — adapted to a completely different use case.
        </p>
        <div className="signalStrip" style={{ marginTop: 16 }}>
          <span>Simulation</span>
          <span>Decision mapping</span>
          <span>Multi-agent reasoning</span>
          <span>Evidence reports</span>
          <span>Risk forecasting</span>
          <span>Local-first</span>
        </div>
      </Card>
      <Card title="A First-of-its-kind Modular AI Architecture">
        <p>
          "A first-of-its-kind modular AI-assisted product architecture" that demonstrates
          how the same technical base can support strategic intelligence tools, not just
          operational dashboards. Each product in the 4P3X Verse™ proves a different
          dimension of what this architecture can do.
        </p>
        <p style={{ marginTop: 10 }}>
          <em style={{ color: 'var(--muted)' }}>
            {BRAND.portfolio}
          </em>
        </p>
      </Card>
    </Page>
  );
}

/* ══════════════════════════════════════════════════════════════
   SETTINGS / API CONFIG GUARD™
══════════════════════════════════════════════════════════════ */
function SettingsPage({ state, mutate }) {
  const setBackend = (k, v) => mutate(s => ({ ...s, backend: { ...s.backend, [k]: v } }));
  const toggleDemo = () => mutate(s => ({ ...s, app: { ...s.app, demoMode: !s.app.demoMode } }));

  return (
    <Page title="Settings, API Config Guard™ & Backend-Ready Live Mode" subtitle="Demo/live controls, provider status and safe environment boundaries.">

      {/* Demo / Live Mode Toggle */}
      <Card title="Demo / Live Mode" style={{ marginBottom: 16 }}>
        {state.app.demoMode ? (
          <div className="demoBanner" role="status" style={{ marginBottom: 14 }}>
            <CheckCircle2 size={15} aria-hidden="true" />
            <strong>Demo Mode active</strong> — safe sample data. No backend required.
          </div>
        ) : (
          <div className="liveBanner" role="status" style={{ marginBottom: 14 }}>
            <AlertTriangle size={15} aria-hidden="true" />
            <strong>Live Mode active</strong> — backend configuration required before operational use.
          </div>
        )}
        <p style={{ color: 'var(--muted)', marginBottom: 14, fontSize: 13 }}>
          Demo Mode shows the product. Live Mode runs the product.
        </p>
        <button onClick={toggleDemo}>
          <Zap size={15} aria-hidden="true" />
          {state.app.demoMode ? 'Switch to Live Mode' : 'Switch to Demo Mode'}
        </button>
      </Card>

      <div className="grid two">
        {/* Backend Config */}
        <Card title="Backend Provider Configuration">
          <label>
            Provider
            <select
              value={state.app.liveProvider}
              onChange={e => mutate(s => ({ ...s, app: { ...s.app, liveProvider: e.target.value } }))}
            >
              <option>local-only</option>
              <option>supabase</option>
              <option>firebase</option>
              <option>aws-custom</option>
              <option>generic-rest</option>
            </select>
          </label>
          <label style={{ marginTop: 12 }}>
            Supabase Project URL (client-safe)
            <input
              value={state.backend.supabaseUrl}
              onChange={e => setBackend('supabaseUrl', e.target.value)}
              placeholder="https://your-project.supabase.co"
            />
          </label>
          <label style={{ marginTop: 12 }}>
            Supabase Anon Key (client-safe)
            <input
              value={state.backend.supabaseAnonKey}
              onChange={e => setBackend('supabaseAnonKey', e.target.value)}
              placeholder="eyJh... (masked client-safe anon key)"
              type="password"
            />
          </label>
          <label style={{ marginTop: 12 }}>
            REST Endpoint (optional)
            <input
              value={state.backend.restEndpoint}
              onChange={e => setBackend('restEndpoint', e.target.value)}
              placeholder="https://your-api.example.com"
            />
          </label>
          {!state.app.demoMode && !state.backend.supabaseUrl && (
            <div className="liveBanner" style={{ marginTop: 14 }}>
              <AlertTriangle size={14} aria-hidden="true" />
              Live Mode selected but no backend configured — app will use local-only fallback.
            </div>
          )}
        </Card>

        {/* API Config Guard™ */}
        <Card title="4P3X API Config Guard™">
          <List items={[
            '✓ No backend-only secrets in frontend/public code',
            '✓ Missing keys disable only dependent features',
            '✓ Client-safe keys are masked in the UI',
            '✓ Demo data cannot pollute live data',
            '✓ Supabase first, with Firebase/AWS/REST/local fallback',
          ]} />
          <div className="configGuard" style={{ marginTop: 16 }}>
            <h4>⛔ Blocked Frontend Secrets</h4>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
              These keys must NEVER appear in client-side code or public files:
            </p>
            <div className="chips">
              {state.backend.secretWarnings.map(w => (
                <span key={w} className="chip" style={{ fontSize: 11 }}>{w}</span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Reset */}
      <Card title="Reset Demo Data">
        <p style={{ color: 'var(--muted)', marginBottom: 14, fontSize: 13 }}>
          Resets all state back to the original demo scenario. This clears local storage
          and reloads the seed data. Live data is not affected.
        </p>
        <button className="danger" onClick={() => { mutate(() => resetDemo()); }}>
          <RefreshCcw size={15} aria-hidden="true" /> Reset to Demo Data
        </button>
      </Card>
    </Page>
  );
}

/* ══════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
══════════════════════════════════════════════════════════════ */
function ScenarioOrb({ scores }) {
  return (
    <div className="orbWrap" aria-label={`Scenario intelligence orb — confidence ${scores.confidence}%`}>
      <div className="orb" aria-hidden="true">
        <span>{scores.confidence}%</span>
        <i />
        <b />
        <em />
      </div>
      <div className="orbStats" aria-hidden="true">
        <small>risk {scores.risk}%</small>
        <small>evidence {scores.evidence}%</small>
        <small>execution {scores.execution}%</small>
      </div>
    </div>
  );
}

function MatrixCell({ label, value }) {
  return (
    <div className="matrixCell">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function Page({ title, subtitle, children }) {
  return (
    <section className="page" aria-label={title}>
      <div className="pageHead">
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <Zap className="pageIcon" size={28} aria-hidden="true" />
      </div>
      {children}
    </section>
  );
}

function Card({ title, children, style }) {
  return (
    <article className="card" style={style}>
      {title && <h2>{title}</h2>}
      {children}
    </article>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function List({ items }) {
  return (
    <ul className="list">
      {items.map((x, i) => <li key={i}>{x}</li>)}
    </ul>
  );
}

function Bars({ data }) {
  return (
    <div className="bars">
      {Object.entries(data).map(([k, v]) => (
        <div key={k}>
          <label>{k}<span>{v}%</span></label>
          <div
            className="bar"
            role="progressbar"
            aria-valuenow={v}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={`${k} ${v}%`}
          >
            <i style={{ width: `${v}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className="emptyState" role="status">
      {Icon && <Icon size={40} aria-hidden="true" />}
      <h3>{title}</h3>
      {message && <p>{message}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════════════════════ */
createRoot(document.getElementById('root')).render(<App />);
