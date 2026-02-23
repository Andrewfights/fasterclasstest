// Valuation Guesstimate Game Data
// Each startup profile has actual valuation range for players to guess

export interface StartupProfile {
  id: string;
  name: string;
  description: string;
  stage: 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B' | 'Series C+';
  industry: string;
  metrics: {
    mrr?: string;
    arr?: string;
    users?: string;
    growth?: string;
    revenue?: string;
  };
  fundingHistory?: string;
  teamSize: string;
  founded: string;
  actualValuation: {
    min: number; // in millions
    max: number;
    label: string;
  };
  hint: string;
}

export const STARTUP_PROFILES: StartupProfile[] = [
  {
    id: 'v1',
    name: 'CloudSync Pro',
    description: 'B2B SaaS platform for enterprise file synchronization with advanced security features.',
    stage: 'Series A',
    industry: 'Enterprise SaaS',
    metrics: {
      arr: '$2.4M',
      users: '180 enterprise customers',
      growth: '15% MoM',
    },
    fundingHistory: '$1.5M seed round from notable angels',
    teamSize: '22 employees',
    founded: '2022',
    actualValuation: {
      min: 20,
      max: 30,
      label: '$20M - $30M',
    },
    hint: 'Series A SaaS companies typically valued at 10-15x ARR.',
  },
  {
    id: 'v2',
    name: 'FinFlow',
    description: 'AI-powered expense management for SMBs with automated receipt scanning and categorization.',
    stage: 'Seed',
    industry: 'Fintech',
    metrics: {
      mrr: '$85K',
      users: '2,400 businesses',
      growth: '22% MoM',
    },
    teamSize: '8 employees',
    founded: '2023',
    actualValuation: {
      min: 8,
      max: 12,
      label: '$8M - $12M',
    },
    hint: 'Strong growth rate commands premium at seed stage.',
  },
  {
    id: 'v3',
    name: 'HealthPulse',
    description: 'Telehealth platform connecting patients with specialists, focused on mental health.',
    stage: 'Series B',
    industry: 'Healthtech',
    metrics: {
      arr: '$12M',
      users: '50,000 monthly active patients',
      growth: '8% MoM',
    },
    fundingHistory: '$15M Series A',
    teamSize: '85 employees',
    founded: '2020',
    actualValuation: {
      min: 80,
      max: 120,
      label: '$80M - $120M',
    },
    hint: 'Healthtech often commands 8-10x revenue multiples.',
  },
  {
    id: 'v4',
    name: 'GreenRoute',
    description: 'Last-mile delivery optimization using AI to reduce carbon emissions and costs.',
    stage: 'Pre-Seed',
    industry: 'Logistics / Climate',
    metrics: {
      revenue: '$15K pilot revenue',
      users: '3 enterprise pilots',
      growth: 'N/A - early stage',
    },
    teamSize: '4 founders',
    founded: '2024',
    actualValuation: {
      min: 2,
      max: 4,
      label: '$2M - $4M',
    },
    hint: 'Pre-seed valuations based on team, TAM, and early traction.',
  },
  {
    id: 'v5',
    name: 'DevSecOps Cloud',
    description: 'Automated security scanning and compliance for cloud-native applications.',
    stage: 'Series A',
    industry: 'Cybersecurity',
    metrics: {
      arr: '$4.5M',
      users: '95 enterprise customers',
      growth: '12% MoM',
    },
    fundingHistory: '$3M seed',
    teamSize: '35 employees',
    founded: '2021',
    actualValuation: {
      min: 45,
      max: 60,
      label: '$45M - $60M',
    },
    hint: 'Security companies often valued at 12-15x ARR due to market demand.',
  },
  {
    id: 'v6',
    name: 'EduPlay',
    description: 'Gamified learning platform for K-12 students with adaptive curriculum.',
    stage: 'Seed',
    industry: 'Edtech',
    metrics: {
      mrr: '$120K',
      users: '45,000 students',
      growth: '18% MoM',
    },
    teamSize: '12 employees',
    founded: '2022',
    actualValuation: {
      min: 10,
      max: 15,
      label: '$10M - $15M',
    },
    hint: 'Edtech multiples vary; strong engagement metrics matter.',
  },
  {
    id: 'v7',
    name: 'PropFlow',
    description: 'Real estate investment platform enabling fractional property ownership.',
    stage: 'Series A',
    industry: 'Proptech / Fintech',
    metrics: {
      arr: '$3.2M',
      users: '12,000 investors',
      growth: '10% MoM',
    },
    fundingHistory: '$2.5M seed',
    teamSize: '28 employees',
    founded: '2021',
    actualValuation: {
      min: 30,
      max: 45,
      label: '$30M - $45M',
    },
    hint: 'Fintech platforms with assets under management get higher multiples.',
  },
  {
    id: 'v8',
    name: 'AIWriter Pro',
    description: 'Enterprise AI writing assistant with custom model training on company data.',
    stage: 'Series B',
    industry: 'AI / Enterprise',
    metrics: {
      arr: '$18M',
      users: '450 enterprise accounts',
      growth: '20% MoM',
    },
    fundingHistory: '$25M Series A',
    teamSize: '120 employees',
    founded: '2021',
    actualValuation: {
      min: 180,
      max: 250,
      label: '$180M - $250M',
    },
    hint: 'AI companies with strong enterprise traction command premium valuations.',
  },
  {
    id: 'v9',
    name: 'FoodieLocal',
    description: 'Marketplace connecting local food producers directly with consumers.',
    stage: 'Seed',
    industry: 'Marketplace / Food',
    metrics: {
      mrr: '$45K',
      users: '8,500 monthly buyers',
      growth: '25% MoM',
    },
    teamSize: '6 employees',
    founded: '2023',
    actualValuation: {
      min: 5,
      max: 8,
      label: '$5M - $8M',
    },
    hint: 'Marketplaces valued on GMV trajectory and take rate.',
  },
  {
    id: 'v10',
    name: 'WorkflowAI',
    description: 'No-code automation platform for business process optimization.',
    stage: 'Series C+',
    industry: 'Enterprise SaaS',
    metrics: {
      arr: '$65M',
      users: '2,500 enterprise customers',
      growth: '6% MoM',
    },
    fundingHistory: '$80M Series B',
    teamSize: '350 employees',
    founded: '2018',
    actualValuation: {
      min: 500,
      max: 700,
      label: '$500M - $700M',
    },
    hint: 'Late-stage SaaS with strong ARR commands 8-12x revenue.',
  },
  {
    id: 'v11',
    name: 'CryptoGuard',
    description: 'Institutional-grade cryptocurrency custody and compliance solution.',
    stage: 'Series A',
    industry: 'Crypto / Fintech',
    metrics: {
      arr: '$5M',
      users: '45 institutional clients',
      growth: '8% MoM',
    },
    fundingHistory: '$4M seed',
    teamSize: '40 employees',
    founded: '2022',
    actualValuation: {
      min: 40,
      max: 60,
      label: '$40M - $60M',
    },
    hint: 'Crypto infrastructure companies valued differently than exchanges.',
  },
  {
    id: 'v12',
    name: 'VirtualStage',
    description: 'Virtual event platform with immersive 3D environments for conferences.',
    stage: 'Seed',
    industry: 'Events / Metaverse',
    metrics: {
      mrr: '$65K',
      users: '120 enterprise clients',
      growth: '12% MoM',
    },
    teamSize: '15 employees',
    founded: '2022',
    actualValuation: {
      min: 6,
      max: 10,
      label: '$6M - $10M',
    },
    hint: 'Post-pandemic, virtual event market is normalizing valuations.',
  },
];

// Scoring thresholds
export const VALUATION_SCORING = {
  exact: { points: 100, xp: 20 },      // Within the actual range
  close: { points: 50, xp: 10 },       // Within 25% of range
  reasonable: { points: 25, xp: 5 },   // Within 50% of range
  miss: { points: 0, xp: 0 },          // More than 50% off
};

// Valuation ranges for player selection
export const VALUATION_OPTIONS = [
  { label: '$1M - $3M', min: 1, max: 3 },
  { label: '$3M - $6M', min: 3, max: 6 },
  { label: '$6M - $10M', min: 6, max: 10 },
  { label: '$10M - $20M', min: 10, max: 20 },
  { label: '$20M - $40M', min: 20, max: 40 },
  { label: '$40M - $70M', min: 40, max: 70 },
  { label: '$70M - $120M', min: 70, max: 120 },
  { label: '$120M - $200M', min: 120, max: 200 },
  { label: '$200M - $400M', min: 200, max: 400 },
  { label: '$400M - $700M', min: 400, max: 700 },
  { label: '$700M+', min: 700, max: 1000 },
];
