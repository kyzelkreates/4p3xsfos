export const BRAND = {
  product: '4P3X ScenarioForge OS™',
  strapline: 'AI-Powered Scenario Simulation, Decision Mapping & Future Planning Platform',
  powered: 'Powered by 4P3X Intelligent AI™ Created by Kyzel Kreates™',
  portfolio: '4P3X Verse™ — One Modular Architecture. Many AI-Powered Products. Powered by 4P3X Intelligent AI™ Created by Kyzel Kreates™.',
  positioning: 'One Base Architecture. Hundreds of Possible Product Directions.'
};

export const scenarioTemplates = [
  'Council welfare pilot launch',
  'Grant-funded community technology rollout',
  'Turning a demo product into live SaaS',
  'Small business pricing change',
  'Charity volunteer capacity challenge',
  'Fleet compliance platform rollout',
  'Investor presentation decision path',
  'Public-benefit product pilot',
  'AI agent safety review',
  'Multi-sector product expansion'
];

export const seedState = {
  app: {
    demoMode: true,
    liveProvider: 'local-only',
    installPromptSeen: false,
    activeScenarioId: 'scn-response-link',
    mobileMenuOpen: false,
    wowMode: true,
    presentationMode: true
  },
  backend: {
    supabaseUrl: '', supabaseAnonKey: '', firebaseProjectId: '', restEndpoint: '', providerStatus: 'not_configured', lastSync: null,
    secretWarnings: ['SUPABASE_SERVICE_ROLE_KEY', 'OPENAI_API_KEY', 'GROQ_API_KEY', 'STRIPE_SECRET_KEY', 'DATABASE_URL', 'JWT_SECRET', 'PRIVATE_KEY', 'WEBHOOK_SECRET']
  },
  users: [
    { id: 'usr-owner', name: 'Demo Strategist', role: 'owner', permission: 'admin' },
    { id: 'usr-analyst', name: 'Evidence Reviewer', role: 'analyst', permission: 'edit' },
    { id: 'usr-viewer', name: 'Funder Viewer', role: 'viewer', permission: 'read' }
  ],
  organisations: [
    { id: 'org-demo', name: 'ScenarioForge Demo Organisation', plan: 'Portfolio Demo', workspaceHealth: 91, liveReadiness: 74, evidenceReadiness: 82 }
  ],
  audit: [
    { id: 'aud-1', at: new Date().toISOString(), actor: 'system', action: 'Demo workspace initialised with wow-factor scenario intelligence layer', scope: 'system' }
  ],
  scenarios: [
    {
      id: 'scn-response-link',
      title: 'Launch ResponseLink OS™ as a council welfare pilot',
      sector: 'Community Support / Civic Tech',
      status: 'simulation-ready',
      owner: 'Demo Strategist',
      goal: 'Improve welfare visit coordination, responder check-ins, escalation visibility, and evidence capture without replacing emergency services or safeguarding professionals.',
      timeframe: '3 months',
      confidence: 78,
      opportunity: 84,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      successCriteria: ['Clear human-reviewed escalation workflow', 'Supervisor-ready reports', 'Responder and service-user PWA adoption', 'No unsafe automation claims', 'Evidence pack strong enough for stakeholder review'],
      constraints: [
        { id: 'con-1', label: 'Limited council pilot budget', severity: 68, type: 'financial' },
        { id: 'con-2', label: 'Safeguarding boundaries must be explicit', severity: 92, type: 'legal/safety' },
        { id: 'con-3', label: 'Volunteer availability varies week to week', severity: 63, type: 'operational' },
        { id: 'con-4', label: 'Live data protection review must happen before real deployment', severity: 81, type: 'governance' }
      ],
      assumptions: [
        { id: 'asm-1', label: 'Responders will use mobile check-ins consistently', confidence: 70, evidence: 'Demo flow and training plan' },
        { id: 'asm-2', label: 'Supervisors value evidence capture and reports', confidence: 82, evidence: 'Public-sector workflow fit' },
        { id: 'asm-3', label: 'Backend can be configured after demo validation', confidence: 74, evidence: 'Supabase-ready architecture' },
        { id: 'asm-4', label: 'Stakeholders accept advisory-only AI boundaries', confidence: 77, evidence: 'Clear safety wording and human-review controls' }
      ],
      knownUnknowns: ['Exact council procurement requirements', 'Pilot team size', 'Data protection review process', 'Internal champion availability'],
      stakeholders: [
        { id: 'st-1', name: 'Council service lead', type: 'Decision maker', influence: 90, priority: 88, riskExposure: 70, benefit: 86, communicationNeed: 'Clear pilot scope, public-benefit story and risk controls' },
        { id: 'st-2', name: 'Charity responders', type: 'Operator', influence: 68, priority: 82, riskExposure: 78, benefit: 80, communicationNeed: 'Simple mobile workflows and safety boundaries' },
        { id: 'st-3', name: 'Service users', type: 'Affected user', influence: 55, priority: 95, riskExposure: 88, benefit: 92, communicationNeed: 'Accessible support, consent wording and human support routes' },
        { id: 'st-4', name: 'Funders', type: 'Funder', influence: 80, priority: 76, riskExposure: 42, benefit: 78, communicationNeed: 'Evidence pack, measurable outcomes and impact logic' },
        { id: 'st-5', name: 'Technical reviewer', type: 'Technical gatekeeper', influence: 72, priority: 68, riskExposure: 56, benefit: 74, communicationNeed: 'SSOT, demo/live, PWA, backend and API safety explanation' }
      ],
      decisions: [
        { id: 'dec-1', title: 'Launch limited 6-week pilot', cost: 45, risk: 52, complexity: 55, time: 38, upside: 88, downside: 'Needs careful onboarding and clear disclaimers', dependencies: ['Supervisor owner', 'Demo/live toggle validated', 'Evidence template'], confidence: 79, recommendation: 'Proceed with controls' },
        { id: 'dec-2', title: 'Delay until full backend is complete', cost: 64, risk: 35, complexity: 70, time: 80, upside: 65, downside: 'Loses momentum and evidence opportunities', dependencies: ['Supabase setup', 'Auth roles', 'Data protection review'], confidence: 62, recommendation: 'Hold unless required' },
        { id: 'dec-3', title: 'Run stakeholder demo before pilot', cost: 24, risk: 22, complexity: 30, time: 20, upside: 76, downside: 'Does not prove field adoption alone', dependencies: ['Polished demo', 'Scenario report', 'Guided tour'], confidence: 88, recommendation: 'Proceed first' },
        { id: 'dec-4', title: 'Partner-led public benefit pilot', cost: 38, risk: 44, complexity: 48, time: 46, upside: 91, downside: 'Requires strong role boundaries and written pilot ownership', dependencies: ['Partner sponsor', 'Impact metrics', 'Human review workflow'], confidence: 81, recommendation: 'Best strategic route after demo' }
      ],
      evidence: [
        { id: 'ev-1', title: 'Demo workflow walkthrough', strength: 78, type: 'Product evidence' },
        { id: 'ev-2', title: 'Safety boundary wording', strength: 86, type: 'Compliance evidence' },
        { id: 'ev-3', title: 'Backend readiness checklist', strength: 72, type: 'Technical evidence' },
        { id: 'ev-4', title: 'Public-benefit impact map', strength: 80, type: 'Impact evidence' },
        { id: 'ev-5', title: 'PWA install and offline workflow proof', strength: 75, type: 'Operational evidence' }
      ],
      versions: [
        { id: 'ver-2', label: 'Wow-factor upgrade seed', at: new Date().toISOString(), summary: 'Added richer scenario intelligence, stakeholder detail, evidence records and portfolio-ready presentation data.' },
        { id: 'ver-1', label: 'Initial scenario', at: new Date().toISOString(), summary: 'Seeded scenario with stakeholders, assumptions, decisions and evidence.' }
      ]
    }
  ]
};

export const agents = [
  { id: 'strategy', name: '4P3X Strategy AI™', purpose: 'Tests opportunity, timing, stakeholder readiness and positioning.', forbidden: 'No guaranteed market, adoption or funding outcomes.' },
  { id: 'risk', name: '4P3X Risk AI™', purpose: 'Finds operational, financial, legal/safety and uncertainty risks.', forbidden: 'No final legal, safety or safeguarding decision-making.' },
  { id: 'evidence', name: '4P3X Evidence AI™', purpose: 'Checks proof strength, unsupported claims and report readiness.', forbidden: 'No fabricated evidence or altered records.' },
  { id: 'execution', name: '4P3X Execution AI™', purpose: 'Creates the minimum viable rollout path, blockers and next actions.', forbidden: 'No fake completion claims or hidden backend assumptions.' }
];

export const navItems = [
  ['home','Home'], ['dashboard','Command'], ['workspace','Scenario'], ['stakeholders','Stakeholders'], ['decisions','Decision Tree'], ['engines','Engines'], ['arena','AI Arena'], ['timeline','Timeline'], ['compare','Compare'], ['confidence','Confidence'], ['reports','Reports'], ['evidence','Evidence Pack'], ['team','Team'], ['org','Organisation'], ['version','Versions'], ['audit','Audit Trail'], ['mobile','Mobile PWA'], ['portfolio','Portfolio Layer'], ['settings','Settings']
];
