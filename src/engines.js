const avg = values => Math.round(values.reduce((a,b)=>a+Number(b||0),0) / Math.max(values.length,1));
const clamp = n => Math.max(0, Math.min(100, Math.round(n)));

export function calculateRisk(scenario){
  const constraint = avg((scenario.constraints||[]).map(c=>c.severity));
  const decisionRisk = avg((scenario.decisions||[]).map(d=>d.risk));
  const stakeholder = avg((scenario.stakeholders||[]).map(s=>s.riskExposure));
  const assumptionGap = 100 - avg((scenario.assumptions||[]).map(a=>a.confidence));
  return clamp((constraint * .28) + (decisionRisk * .25) + (stakeholder * .25) + (assumptionGap * .22));
}

export function calculateOpportunity(scenario){
  const upside = avg((scenario.decisions||[]).map(d=>d.upside));
  const benefit = avg((scenario.stakeholders||[]).map(s=>s.benefit));
  const evidence = avg((scenario.evidence||[]).map(e=>e.strength));
  return clamp((upside * .38) + (benefit * .34) + (evidence * .28));
}

export function calculateEvidence(scenario){
  const evidence = avg((scenario.evidence||[]).map(e=>e.strength));
  const assumptions = avg((scenario.assumptions||[]).map(a=>a.confidence));
  const unknownPenalty = Math.min((scenario.knownUnknowns||[]).length * 4, 24);
  return clamp((evidence * .64) + (assumptions * .36) - unknownPenalty);
}

export function calculateExecution(scenario){
  const complexity = avg((scenario.decisions||[]).map(d=>100-d.complexity));
  const time = avg((scenario.decisions||[]).map(d=>100-d.time));
  const confidence = scenario.confidence || 50;
  return clamp((complexity * .32) + (time * .24) + (confidence * .44));
}

export function getScenarioScores(scenario){
  const risk = calculateRisk(scenario);
  const opportunity = calculateOpportunity(scenario);
  const evidence = calculateEvidence(scenario);
  const execution = calculateExecution(scenario);
  const confidence = clamp((opportunity + evidence + execution + (100-risk)) / 4);
  const wow = clamp((opportunity * .28) + (evidence * .22) + (execution * .22) + ((100-risk) * .18) + ((scenario.decisions?.length||0) * 2.5));
  const readiness = confidence >= 78 ? 'Proceed with controls' : confidence >= 62 ? 'Proceed only after gaps are reduced' : 'Hold / redesign before proceeding';
  return { risk, opportunity, evidence, execution, confidence, wow, readiness };
}

export function agentReview(agentId, scenario){
  const s = getScenarioScores(scenario);
  const common = { confidence: s.confidence, stop: [], actions: [], signal: 'Advisory only' };
  if(agentId === 'strategy') return {
    ...common, score: s.opportunity, status: s.opportunity > 75 ? 'Strong strategic signal' : 'Opportunity needs sharpening',
    summary: 'The opportunity is strongest when ScenarioForge positions the pilot as a controlled, evidence-generating public-benefit test rather than a guaranteed outcome system.',
    concerns: ['Positioning must avoid overclaiming outcomes', 'Stakeholder communication must be tailored', 'Success criteria need measurable evidence'],
    actions: ['Run stakeholder demo first', 'Use evidence pack before asking for pilot commitment', 'Frame as advisory decision support', 'Show the 4P3X Verse™ connection clearly']
  };
  if(agentId === 'risk') return {
    ...common, score: 100 - s.risk, status: s.risk < 45 ? 'Risk controlled' : 'Risk requires visible controls',
    summary: 'Main risks are safety wording, inconsistent usage, missing data, unclear ownership and responsibility boundaries.',
    concerns: ['No automatic safety decisions', 'Data freshness must be visible', 'Escalation ownership must be assigned', 'Live mode needs backend/data protection review'],
    actions: ['Add human override', 'Add do-not-proceed-unless conditions', 'Make missing data warnings visible', 'Keep live mode locked until configured'],
    stop: ['No named owner', 'Unsafe guarantee language', 'Missing backend/data protection decision for live mode']
  };
  if(agentId === 'evidence') return {
    ...common, score: s.evidence, status: s.evidence > 70 ? 'Evidence pack viable' : 'More proof required',
    summary: 'The scenario is reportable, but claims should be tied to workflow proof, screenshots, risk controls, audit trail and measurable pilot outcomes.',
    concerns: ['Unsupported claims weaken funder confidence', 'Screenshots need labels', 'Audit trail must preserve original records', 'Demo data must be labelled'],
    actions: ['Attach screenshots', 'Export report', 'Add before/after metrics', 'Map each claim to a proof item']
  };
  return {
    ...common, score: s.execution, status: s.execution > 70 ? 'Executable with staged rollout' : 'Execution needs simplification',
    summary: 'Best path is cinematic demo validation, limited pilot, backend setup, then controlled expansion with review points and rollback options.',
    concerns: ['Trying to launch full SaaS too early', 'Too many features before validation', 'No rollback owner', 'Weak onboarding reduces adoption'],
    actions: ['Start with limited pilot', 'Validate PWA install flow', 'Keep demo/live data separated', 'Use ScenarioForge report as the project control pack']
  };
}

export function outcomePaths(scenario){
  const s = getScenarioScores(scenario);
  return [
    { name:'Best Case', probability: clamp(s.confidence + 8), trigger:'Stakeholders understand boundaries and adopt the workflow quickly.', result:'Pilot generates strong evidence, improved coordination visibility and funder-ready reporting.', className:'best' },
    { name:'Expected Case', probability: clamp(s.confidence), trigger:'Some onboarding friction but core workflow is useful.', result:'Pilot proves value with refinements needed for live backend and training.', className:'expected' },
    { name:'Risk Case', probability: clamp(s.risk), trigger:'Missing data, unclear ownership or weak onboarding reduces confidence.', result:'Proceed only after risk controls, evidence gaps and owner responsibilities are corrected.', className:'risk' },
    { name:'Failure Case', probability: clamp(100 - s.evidence), trigger:'No clear owner, unsupported claims, unsafe wording or no evidence capture.', result:'Hold rollout and redesign scope before presenting to serious stakeholders.', className:'failure' },
    { name:'Partnership Case', probability: clamp((s.opportunity + s.evidence) / 2), trigger:'A partner/funder wants pilot evidence before commitment.', result:'Use guided demo, stakeholder map and exported report to structure a safe pilot conversation.', className:'partner' }
  ];
}

export function intelligenceFeed(scenario){
  const s = getScenarioScores(scenario);
  return [
    { label:'Scenario signal', text:`${scenario.title} is currently ${s.readiness.toLowerCase()} with ${s.confidence}% confidence.` },
    { label:'Best next move', text:'Run the stakeholder demo first, then export the evidence pack before pilot commitment.' },
    { label:'Highest risk control', text:'Keep advisory-only wording, human review and demo/live separation visible before live use.' },
    { label:'Portfolio value', text:'This proves the 4P3X base can become simulation intelligence, not only dashboards and PWAs.' },
    { label:'Live mode warning', text:'Do not enter live operational use until backend, owner, data protection and evidence rules are configured.' }
  ];
}

export function impactMatrix(scenario){
  return (scenario.stakeholders||[]).map(s => ({
    name: s.name,
    impact: clamp((s.benefit + s.priority) / 2),
    exposure: s.riskExposure,
    influence: s.influence
  }));
}
