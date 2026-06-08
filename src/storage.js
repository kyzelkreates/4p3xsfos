import { seedState } from './data';
const KEY = 'scenarioforge-os-state-v1';

export function loadState(){
  try { return JSON.parse(localStorage.getItem(KEY)) || seedState; } catch { return seedState; }
}
export function saveState(state){ localStorage.setItem(KEY, JSON.stringify(state)); }
export function resetDemo(){ localStorage.setItem(KEY, JSON.stringify(seedState)); return seedState; }
export function addAudit(state, action, scope='system'){
  return { ...state, audit: [{ id: crypto.randomUUID(), at: new Date().toISOString(), actor: 'local-user', action, scope }, ...(state.audit||[])] };
}
export function updateScenario(state, id, patch){
  const next = { ...state, scenarios: state.scenarios.map(s => s.id === id ? { ...s, ...patch, updatedAt: new Date().toISOString(), versions: [{ id: crypto.randomUUID(), label:'Local update', at:new Date().toISOString(), summary:Object.keys(patch).join(', ') }, ...(s.versions||[])] } : s) };
  return addAudit(next, `Updated scenario: ${Object.keys(patch).join(', ')}`, id);
}
export function createScenario(state, template='Blank strategic scenario'){
  const id = crypto.randomUUID();
  const scenario = {
    id, title: template, sector:'Custom', status:'draft', owner:'Local User', goal:'Define the goal for this scenario.', timeframe:'30 days', confidence:50, opportunity:50, createdAt:new Date().toISOString(), updatedAt:new Date().toISOString(),
    successCriteria: ['Define measurable success criteria'], constraints: [], assumptions: [], knownUnknowns: [], stakeholders: [], decisions: [], evidence: [], versions: [{ id:crypto.randomUUID(), label:'Created', at:new Date().toISOString(), summary:'Scenario created locally.' }]
  };
  return addAudit({ ...state, app:{...state.app, activeScenarioId:id}, scenarios:[scenario, ...state.scenarios] }, `Created scenario: ${template}`, id);
}
