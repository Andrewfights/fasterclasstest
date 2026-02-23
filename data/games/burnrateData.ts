// Burn Rate Blitz Game Data
// Resource management scenarios

export interface BurnRateDecision {
  id: string;
  label: string;
  description: string;
  effect: {
    cashChange: number;      // Immediate cash impact
    burnRateChange: number;  // Monthly burn rate change
    revenueChange: number;   // Monthly revenue change
    morale: 'up' | 'down' | 'neutral';
    risk: 'low' | 'medium' | 'high';
  };
  outcome: string;
  isOptimal: boolean;
}

export interface BurnRateScenario {
  id: string;
  title: string;
  context: string;
  initialState: {
    cash: number;           // Current cash in bank
    monthlyBurn: number;    // Monthly expenses
    monthlyRevenue: number; // Monthly revenue
    teamSize: number;
    runway: number;         // Months of runway
  };
  situation: string;
  decisions: BurnRateDecision[];
  lesson: string;
}

export const BURNRATE_SCENARIOS: BurnRateScenario[] = [
  {
    id: 'br1',
    title: 'The Hiring Dilemma',
    context: 'Your startup is growing steadily but needs more engineering capacity.',
    initialState: {
      cash: 500000,
      monthlyBurn: 80000,
      monthlyRevenue: 35000,
      teamSize: 8,
      runway: 11,
    },
    situation: 'You have a promising senior engineer candidate who wants $15K/month. Hiring them could accelerate product development, but it would reduce your runway.',
    decisions: [
      {
        id: 'a',
        label: 'Hire at full salary',
        description: 'Bring them on at $15K/month immediately.',
        effect: { cashChange: 0, burnRateChange: 15000, revenueChange: 0, morale: 'up', risk: 'medium' },
        outcome: 'Your runway drops to 8 months, but product velocity increases 40%. You close 2 new enterprise deals worth $25K MRR within 3 months.',
        isOptimal: false,
      },
      {
        id: 'b',
        label: 'Offer equity-heavy comp',
        description: 'Offer $10K salary + 0.5% equity.',
        effect: { cashChange: 0, burnRateChange: 10000, revenueChange: 0, morale: 'up', risk: 'low' },
        outcome: 'They accept! Your runway stays at 10 months. They are highly motivated by the equity stake and ship features faster than expected.',
        isOptimal: true,
      },
      {
        id: 'c',
        label: 'Pass and hire contractor',
        description: 'Use a contractor for $8K/month on a 3-month project basis.',
        effect: { cashChange: 0, burnRateChange: 8000, revenueChange: 0, morale: 'neutral', risk: 'low' },
        outcome: 'The contractor does good work but leaves after 3 months. Knowledge transfer is minimal, and you are back to square one.',
        isOptimal: false,
      },
    ],
    lesson: 'Equity can be a powerful tool for extending runway while still attracting great talent. Candidates who accept equity-heavy offers often have higher conviction in your mission.',
  },
  {
    id: 'br2',
    title: 'The Office Decision',
    context: 'Your team is remote but several members are asking for co-working space.',
    initialState: {
      cash: 300000,
      monthlyBurn: 65000,
      monthlyRevenue: 20000,
      teamSize: 6,
      runway: 6.7,
    },
    situation: 'A nice office space is available for $8K/month with a 12-month lease. Your team of 6 is currently fully remote.',
    decisions: [
      {
        id: 'a',
        label: 'Sign the lease',
        description: 'Commit to $8K/month for 12 months.',
        effect: { cashChange: -16000, burnRateChange: 8000, revenueChange: 0, morale: 'up', risk: 'high' },
        outcome: 'Your runway drops to under 5 months. The office is nice but only 3 people use it regularly. You panic-raise a bridge round at bad terms.',
        isOptimal: false,
      },
      {
        id: 'b',
        label: 'Use a flex space',
        description: 'Get WeWork hot desks for $500/person/month for those who want it.',
        effect: { cashChange: 0, burnRateChange: 2000, revenueChange: 0, morale: 'up', risk: 'low' },
        outcome: 'Four team members use the flex space and collaboration improves. No long-term commitment and you can scale up or down as needed.',
        isOptimal: true,
      },
      {
        id: 'c',
        label: 'Stay fully remote',
        description: 'Keep the current setup and spend nothing.',
        effect: { cashChange: 0, burnRateChange: 0, revenueChange: 0, morale: 'down', risk: 'low' },
        outcome: 'Some team members feel isolated. Two key people start interviewing elsewhere. You save money but risk losing talent.',
        isOptimal: false,
      },
    ],
    lesson: 'Fixed costs like long-term leases are dangerous at early stages. Flexible solutions let you preserve runway while addressing team needs.',
  },
  {
    id: 'br3',
    title: 'The Marketing Push',
    context: 'Your product is ready but growth is slow. Marketing could accelerate customer acquisition.',
    initialState: {
      cash: 400000,
      monthlyBurn: 70000,
      monthlyRevenue: 25000,
      teamSize: 7,
      runway: 8.9,
    },
    situation: 'Your CAC is $500 and LTV is $2,000. A marketing agency proposes a $30K/month campaign they claim will bring 100 new customers/month.',
    decisions: [
      {
        id: 'a',
        label: 'Go all-in on marketing',
        description: 'Sign up for the $30K/month campaign.',
        effect: { cashChange: 0, burnRateChange: 30000, revenueChange: 15000, morale: 'up', risk: 'high' },
        outcome: 'They deliver only 40 customers/month at $750 CAC. Your runway drops to 5 months. You are forced to cut marketing and lay off 2 people.',
        isOptimal: false,
      },
      {
        id: 'b',
        label: 'Start small and test',
        description: 'Run a $10K test campaign for 2 months.',
        effect: { cashChange: 0, burnRateChange: 10000, revenueChange: 5000, morale: 'neutral', risk: 'low' },
        outcome: 'The test reveals which channels work. You achieve 25 customers at $400 CAC. Armed with data, you scale what works.',
        isOptimal: true,
      },
      {
        id: 'c',
        label: 'Focus on organic growth',
        description: 'Skip the agency and focus on content marketing in-house.',
        effect: { cashChange: 0, burnRateChange: 0, revenueChange: 2000, morale: 'neutral', risk: 'low' },
        outcome: 'Growth continues slowly at 10 customers/month. You extend runway but a competitor with more marketing spend takes market share.',
        isOptimal: false,
      },
    ],
    lesson: 'Big marketing bets without data are risky. Test campaigns first to validate CAC before scaling spend. The agency always overpromises.',
  },
  {
    id: 'br4',
    title: 'The Revenue vs Growth Trade-off',
    context: 'You have a freemium product. Conversion is low but users love it.',
    initialState: {
      cash: 250000,
      monthlyBurn: 55000,
      monthlyRevenue: 15000,
      teamSize: 5,
      runway: 6.3,
    },
    situation: 'An advisor suggests implementing a paywall on key features. This would reduce free users by 60% but could triple paid conversions.',
    decisions: [
      {
        id: 'a',
        label: 'Implement hard paywall',
        description: 'Put core features behind a paywall immediately.',
        effect: { cashChange: 0, burnRateChange: 0, revenueChange: 12000, morale: 'neutral', risk: 'medium' },
        outcome: 'Revenue jumps to $27K/month but free user growth stops. Your viral coefficient drops and CAC increases. Long-term growth is damaged.',
        isOptimal: false,
      },
      {
        id: 'b',
        label: 'Soft paywall with trial',
        description: 'Introduce a 14-day trial for premium features with gentle upgrade prompts.',
        effect: { cashChange: 0, burnRateChange: 0, revenueChange: 8000, morale: 'up', risk: 'low' },
        outcome: 'Revenue grows to $23K/month. Free users still grow and convert at higher rates. You maintain growth momentum while improving unit economics.',
        isOptimal: true,
      },
      {
        id: 'c',
        label: 'Keep freemium, raise prices',
        description: 'Double prices for paid tier but keep free tier generous.',
        effect: { cashChange: 0, burnRateChange: 0, revenueChange: 5000, morale: 'neutral', risk: 'medium' },
        outcome: 'Some paid users churn at the new price. Net revenue only increases to $18K. New customer acquisition slows as word spreads about the price hike.',
        isOptimal: false,
      },
    ],
    lesson: 'Monetization changes affect growth dynamics. Gentle nudges toward paid often work better than hard paywalls, especially when viral growth matters.',
  },
  {
    id: 'br5',
    title: 'The Layoff Decision',
    context: 'Fundraising is taking longer than expected. You need to extend runway.',
    initialState: {
      cash: 180000,
      monthlyBurn: 90000,
      monthlyRevenue: 30000,
      teamSize: 10,
      runway: 3,
    },
    situation: 'With only 3 months of runway, you need to make hard decisions. Laying off 3 people would reduce burn by $30K/month.',
    decisions: [
      {
        id: 'a',
        label: 'Immediate layoffs',
        description: 'Let go of 3 people today (including 1 senior engineer).',
        effect: { cashChange: -20000, burnRateChange: -30000, revenueChange: 0, morale: 'down', risk: 'medium' },
        outcome: 'Runway extends to 5.5 months. Remaining team is scared. Product development slows 50%. But you survive to close the round.',
        isOptimal: true,
      },
      {
        id: 'b',
        label: 'Ask for salary deferrals',
        description: 'Ask team to defer 30% of salary until funding closes.',
        effect: { cashChange: 0, burnRateChange: -27000, revenueChange: 0, morale: 'down', risk: 'high' },
        outcome: 'Most agree but 2 leave immediately. The deferred salaries become a liability. If funding fails, you owe $150K you do not have.',
        isOptimal: false,
      },
      {
        id: 'c',
        label: 'Keep team, bridge loan',
        description: 'Take a $100K bridge loan from an angel at unfavorable terms.',
        effect: { cashChange: 100000, burnRateChange: 0, revenueChange: 0, morale: 'up', risk: 'high' },
        outcome: 'The bridge terms include 2x liquidation preference. You keep the team but give up significant value. The bridge investor blocks later fundraising.',
        isOptimal: false,
      },
    ],
    lesson: 'Hard cuts early are often better than slow death. Layoffs are painful but can be the right decision to save the company. Bad bridge terms can be worse than layoffs.',
  },
  {
    id: 'br6',
    title: 'The Enterprise Pivot',
    context: 'Your SMB product is working but enterprise clients are knocking.',
    initialState: {
      cash: 350000,
      monthlyBurn: 75000,
      monthlyRevenue: 40000,
      teamSize: 8,
      runway: 6.4,
    },
    situation: 'A Fortune 500 company wants a custom enterprise version for $200K/year, but requires 3 months of custom development and dedicated support.',
    decisions: [
      {
        id: 'a',
        label: 'Go all-in on enterprise',
        description: 'Pause SMB development and focus entirely on this deal.',
        effect: { cashChange: 50000, burnRateChange: 10000, revenueChange: -10000, morale: 'up', risk: 'high' },
        outcome: 'The enterprise deal closes but takes 6 months, not 3. SMB revenue drops 40% from neglect. You become dependent on one customer.',
        isOptimal: false,
      },
      {
        id: 'b',
        label: 'Hire for enterprise',
        description: 'Hire 2 contractors for enterprise while maintaining SMB focus.',
        effect: { cashChange: 0, burnRateChange: 20000, revenueChange: 5000, morale: 'up', risk: 'medium' },
        outcome: 'Enterprise deal closes in 4 months. SMB continues growing. You learn to serve both segments and open a new revenue stream.',
        isOptimal: true,
      },
      {
        id: 'c',
        label: 'Pass on enterprise',
        description: 'Politely decline and focus on your core SMB market.',
        effect: { cashChange: 0, burnRateChange: 0, revenueChange: 0, morale: 'neutral', risk: 'low' },
        outcome: 'SMB continues steadily but you miss the enterprise opportunity. The enterprise client goes to a competitor who uses it for case studies.',
        isOptimal: false,
      },
    ],
    lesson: 'Enterprise revenue is attractive but dangerous if you abandon your core business. Hiring specifically for new opportunities lets you explore without betting the company.',
  },
  {
    id: 'br7',
    title: 'The Pricing Experiment',
    context: 'Your pricing has been the same since launch. It might be leaving money on the table.',
    initialState: {
      cash: 280000,
      monthlyBurn: 60000,
      monthlyRevenue: 28000,
      teamSize: 6,
      runway: 8.8,
    },
    situation: 'Your $49/month plan has high conversion but customers often ask for more features. A pricing consultant suggests a $99 tier.',
    decisions: [
      {
        id: 'a',
        label: 'Replace $49 with $99',
        description: 'Migrate all customers to the new $99 plan.',
        effect: { cashChange: 0, burnRateChange: 0, revenueChange: -5000, morale: 'down', risk: 'high' },
        outcome: '30% of customers churn. Revenue drops before slowly recovering. The remaining customers are happier with new features but trust is damaged.',
        isOptimal: false,
      },
      {
        id: 'b',
        label: 'Add $99 as premium tier',
        description: 'Keep $49, add $99 with more features, grandfather existing customers.',
        effect: { cashChange: 0, burnRateChange: 0, revenueChange: 8000, morale: 'up', risk: 'low' },
        outcome: '25% of new customers choose $99. Some existing customers upgrade voluntarily. Revenue grows to $36K with zero churn.',
        isOptimal: true,
      },
      {
        id: 'c',
        label: 'Keep current pricing',
        description: 'If it is not broken, do not fix it.',
        effect: { cashChange: 0, burnRateChange: 0, revenueChange: 0, morale: 'neutral', risk: 'low' },
        outcome: 'Revenue stays flat. A competitor launches a premium tier and starts winning the customers who wanted more. You leave money on the table.',
        isOptimal: false,
      },
    ],
    lesson: 'Price increases on existing customers risk churn. Adding tiers captures willingness to pay without damaging existing relationships.',
  },
  {
    id: 'br8',
    title: 'The Technical Infrastructure',
    context: 'Your AWS bill is growing faster than revenue as you scale.',
    initialState: {
      cash: 320000,
      monthlyBurn: 85000,
      monthlyRevenue: 45000,
      teamSize: 9,
      runway: 8,
    },
    situation: 'Infrastructure costs are $25K/month and growing 20% monthly. An engineer proposes 2 months of optimization work that could cut costs 60%.',
    decisions: [
      {
        id: 'a',
        label: 'Full optimization sprint',
        description: 'Dedicate 2 engineers for 2 months to optimize infrastructure.',
        effect: { cashChange: 0, burnRateChange: 0, revenueChange: -5000, morale: 'neutral', risk: 'medium' },
        outcome: 'Feature development pauses. Infrastructure costs drop to $10K. But you miss a market window and a competitor ships the feature first.',
        isOptimal: false,
      },
      {
        id: 'b',
        label: 'Incremental optimization',
        description: 'Spend 20% time on infra while maintaining feature development.',
        effect: { cashChange: 0, burnRateChange: -7000, revenueChange: 0, morale: 'up', risk: 'low' },
        outcome: 'Infrastructure costs drop to $15K over 3 months. Features continue shipping. Team learns sustainable practices.',
        isOptimal: true,
      },
      {
        id: 'c',
        label: 'Ignore and scale',
        description: 'Infrastructure costs are just part of growth. Focus on revenue.',
        effect: { cashChange: 0, burnRateChange: 5000, revenueChange: 5000, morale: 'neutral', risk: 'high' },
        outcome: 'Costs grow to $40K/month. Eventually you are forced to do emergency optimization anyway, causing a week of downtime.',
        isOptimal: false,
      },
    ],
    lesson: 'Infrastructure debt compounds like technical debt. Incremental optimization prevents crises while maintaining velocity. Balance is key.',
  },
];

// Scoring
export const BURNRATE_SCORING = {
  optimal: { points: 100, xp: 15 },
  acceptable: { points: 50, xp: 8 },
  poor: { points: 10, xp: 3 },
};

// Game constants
export const BURNRATE_GAME_DURATION = 180; // 3 minutes
export const SCENARIOS_PER_GAME = 5;
