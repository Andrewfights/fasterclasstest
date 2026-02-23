// Founder's Dilemma Game Data
// Scenario-based decision making with outcomes

export interface DilemmaChoice {
  id: string;
  label: string;
  description: string;
  outcome: string;
  isOptimal: boolean;
  impact: {
    runway?: string;
    team?: string;
    growth?: string;
    equity?: string;
  };
}

export interface DilemmaScenario {
  id: string;
  title: string;
  context: string;
  situation: string;
  stage: 'Pre-Seed' | 'Seed' | 'Series A' | 'Growth';
  category: 'Fundraising' | 'Team' | 'Product' | 'Finance' | 'Strategy';
  choices: DilemmaChoice[];
  lesson: string;
}

export const DILEMMA_SCENARIOS: DilemmaScenario[] = [
  {
    id: 'd1',
    title: 'The Acqui-hire Offer',
    context: 'Your B2B SaaS startup has been running for 18 months with $150K ARR and 6 months of runway.',
    situation: 'A large tech company offers to acqui-hire your team for $4M total, giving each founder $800K and $500K per engineer. Your product would be discontinued.',
    stage: 'Seed',
    category: 'Strategy',
    choices: [
      {
        id: 'a',
        label: 'Accept the offer',
        description: 'Take the guaranteed money and join the big company.',
        outcome: 'You secure financial stability, but your vision dies. The team disperses within 18 months, and you spend 2 years on projects you dont believe in.',
        isOptimal: false,
        impact: { runway: 'N/A', team: 'Dispersed', growth: 'N/A', equity: '$800K cash' },
      },
      {
        id: 'b',
        label: 'Decline and fundraise',
        description: 'Use the offer as validation to raise a seed round.',
        outcome: 'The acquisition offer validates your team. You raise a $2M seed round at $8M valuation, giving you 18 months runway to hit key milestones.',
        isOptimal: true,
        impact: { runway: '+18 months', team: 'Motivated', growth: 'Funded', equity: '75% retained' },
      },
      {
        id: 'c',
        label: 'Negotiate a partnership instead',
        description: 'Propose becoming a vendor or partner rather than being acquired.',
        outcome: 'They agree to a $200K annual contract. Not a game-changer, but extends runway by 4 months while you explore other options.',
        isOptimal: false,
        impact: { runway: '+4 months', team: 'Uncertain', growth: 'Slow', equity: '100% retained' },
      },
    ],
    lesson: 'Acquisition offers can be powerful fundraising leverage. An offer validates your team and technology, making you more attractive to investors.',
  },
  {
    id: 'd2',
    title: 'Co-founder Conflict',
    context: 'You and your technical co-founder started the company together. You handle business, they handle product.',
    situation: 'Your co-founder wants to pivot to a completely different market based on customer feedback. You believe the current direction just needs more time. The disagreement is causing team tension.',
    stage: 'Pre-Seed',
    category: 'Team',
    choices: [
      {
        id: 'a',
        label: 'Pull rank as CEO',
        description: 'Make an executive decision to stay the course.',
        outcome: 'Your co-founder becomes disengaged. Within 6 months, they leave. Recruiting a new CTO takes 8 months and delays product development.',
        isOptimal: false,
        impact: { runway: 'Unchanged', team: 'Damaged', growth: 'Delayed', equity: 'Vesting issues' },
      },
      {
        id: 'b',
        label: 'Agree to the pivot',
        description: 'Trust your co-founder technical instincts.',
        outcome: 'The pivot requires rebuilding from scratch. You run out of money before achieving product-market fit in the new market.',
        isOptimal: false,
        impact: { runway: '-6 months', team: 'Aligned', growth: 'Reset', equity: 'Diluted' },
      },
      {
        id: 'c',
        label: 'Run a time-boxed experiment',
        description: 'Test both directions for 30 days with clear success metrics.',
        outcome: 'Data shows your co-founders instincts were partially right. You find a middle path that addresses customer feedback while staying in your core market. Team trust strengthens.',
        isOptimal: true,
        impact: { runway: '-1 month', team: 'Strengthened', growth: 'Validated', equity: 'Unchanged' },
      },
    ],
    lesson: 'Co-founder disagreements are inevitable. Data-driven experiments with clear metrics allow both parties to be heard while avoiding emotional decision-making.',
  },
  {
    id: 'd3',
    title: 'The Down Round',
    context: 'You raised a Series A at $25M valuation 18 months ago. Growth has been slower than projected.',
    situation: 'You have 4 months of runway left. The only term sheet on the table is a $5M round at $15M valuation (a 40% down round). Your existing investors are not participating.',
    stage: 'Series A',
    category: 'Fundraising',
    choices: [
      {
        id: 'a',
        label: 'Take the down round',
        description: 'Accept the terms to survive and fight another day.',
        outcome: 'You take significant dilution but survive. The new investor brings operational expertise, and you hit profitability within 12 months. The company eventually sells for $60M.',
        isOptimal: true,
        impact: { runway: '+18 months', team: 'Diluted', growth: 'Stabilized', equity: 'Heavily diluted' },
      },
      {
        id: 'b',
        label: 'Hold out for better terms',
        description: 'Continue searching for an investor who values you higher.',
        outcome: 'You find no other investors. With 2 weeks of runway left, you accept a worse term sheet at $10M valuation with aggressive liquidation preferences.',
        isOptimal: false,
        impact: { runway: 'Critical', team: 'Stressed', growth: 'Desperate', equity: 'Worse terms' },
      },
      {
        id: 'c',
        label: 'Cut costs drastically and bootstrap',
        description: 'Lay off 60% of the team and try to reach profitability.',
        outcome: 'You achieve ramen profitability but lost key engineers. Growth stalls completely. Three years later, you sell the company for $5M in an acqui-hire.',
        isOptimal: false,
        impact: { runway: '+12 months', team: 'Decimated', growth: 'Stalled', equity: 'Retained but worthless' },
      },
    ],
    lesson: 'A down round is not failure - its a recalibration. Surviving with dilution is better than dying with equity. The right investor can help turn the company around.',
  },
  {
    id: 'd4',
    title: 'The Key Hire Decision',
    context: 'Your startup just raised a seed round. You need to make your first senior hire.',
    situation: 'You have two final candidates: A former FAANG engineer who wants $250K salary (above market) but has never worked at a startup, or a scrappy senior engineer from a failed startup who wants $150K plus 1.5% equity.',
    stage: 'Seed',
    category: 'Team',
    choices: [
      {
        id: 'a',
        label: 'Hire the FAANG engineer',
        description: 'Pay the premium for prestigious experience.',
        outcome: 'They struggle with ambiguity and leave after 8 months. You spent $167K on salary plus recruiting fees, and delayed product by half a year.',
        isOptimal: false,
        impact: { runway: '-8 months', team: 'Disrupted', growth: 'Delayed', equity: 'Saved but time lost' },
      },
      {
        id: 'b',
        label: 'Hire the startup veteran',
        description: 'Value startup experience and skin in the game.',
        outcome: 'They hit the ground running, ship features in week one, and become instrumental in your Series A. Their equity aligns incentives perfectly.',
        isOptimal: true,
        impact: { runway: '-4 months', team: 'Strengthened', growth: 'Accelerated', equity: '-1.5% but 10x value' },
      },
      {
        id: 'c',
        label: 'Keep searching',
        description: 'Neither candidate is perfect. Wait for the right one.',
        outcome: 'Three months later youre still searching. The founding team is burned out, and you miss a market window. Eventually hire someone mediocre out of desperation.',
        isOptimal: false,
        impact: { runway: '-3 months', team: 'Burned out', growth: 'Missed window', equity: 'Unchanged' },
      },
    ],
    lesson: 'At early stage, startup experience and equity alignment often matter more than pedigree. Someone who has lived the chaos of a startup will adapt faster than someone from a structured environment.',
  },
  {
    id: 'd5',
    title: 'Feature Creep Crisis',
    context: 'Your product has 15 features. Analytics show only 3 are regularly used.',
    situation: 'Your largest customer ($50K ARR) threatens to leave unless you build a specific integration they need. It would take 2 months of engineering time.',
    stage: 'Seed',
    category: 'Product',
    choices: [
      {
        id: 'a',
        label: 'Build the integration',
        description: 'Keep the customer happy at any cost.',
        outcome: 'You build it. They stay but request three more custom features. Soon youre their outsourced dev shop. Other customers receive no improvements, and churn increases.',
        isOptimal: false,
        impact: { runway: 'Unchanged', team: 'Distracted', growth: '-5% other customers', equity: 'Unchanged' },
      },
      {
        id: 'b',
        label: 'Decline and lose the customer',
        description: 'Stay focused on the product roadmap for the broader market.',
        outcome: 'They leave, but you ship two core improvements that increase conversion by 25% and close 4 new customers worth $120K ARR combined.',
        isOptimal: true,
        impact: { runway: 'Improved', team: 'Focused', growth: '+$70K net ARR', equity: 'Unchanged' },
      },
      {
        id: 'c',
        label: 'Offer a discount to buy time',
        description: 'Reduce their price by 40% while you figure out the roadmap.',
        outcome: 'They take the discount but still demand the feature. Three months later, you build it anyway AND lost $20K in revenue.',
        isOptimal: false,
        impact: { runway: '-$20K', team: 'Compromised', growth: 'Zero', equity: 'Unchanged' },
      },
    ],
    lesson: 'Not all revenue is good revenue. Building for one customer at the expense of product direction can trap you in a services business. Focus on features that benefit multiple customers.',
  },
  {
    id: 'd6',
    title: 'The Competitor Threat',
    context: 'Youve been growing steadily in a niche market. Your product has strong customer love.',
    situation: 'A well-funded competitor (raised $50M) just launched a similar product at 50% of your price. Your sales team is panicking.',
    stage: 'Series A',
    category: 'Strategy',
    choices: [
      {
        id: 'a',
        label: 'Match their pricing',
        description: 'Cut prices to compete and protect market share.',
        outcome: 'Revenue drops 40%. You burn through runway trying to outspend them. Eventually, you both survive but margins never recover.',
        isOptimal: false,
        impact: { runway: '-50%', team: 'Demoralized', growth: 'Revenue down', equity: 'Unchanged' },
      },
      {
        id: 'b',
        label: 'Double down on differentiation',
        description: 'Focus on your strengths: better product, better service, premium positioning.',
        outcome: 'You lose some price-sensitive customers but retain your best ones. The competitor struggles with churn and support. Two years later, they pivot away.',
        isOptimal: true,
        impact: { runway: 'Stable', team: 'Mission-focused', growth: 'Quality over quantity', equity: 'Unchanged' },
      },
      {
        id: 'c',
        label: 'Pivot to a different market',
        description: 'Avoid the competition entirely by going after a new segment.',
        outcome: 'The pivot fails. You had strong product-market fit in your original market, and the new segment doesnt respond. Revenue drops 60%.',
        isOptimal: false,
        impact: { runway: '-60%', team: 'Confused', growth: 'Reset', equity: 'Unchanged' },
      },
    ],
    lesson: 'Competing on price is a losing game against better-funded competitors. Differentiation, customer relationships, and product quality create sustainable competitive advantages.',
  },
  {
    id: 'd7',
    title: 'Remote vs Office',
    context: 'Your 15-person startup has been fully remote since COVID. Culture is good but collaboration is slowing.',
    situation: 'You have the budget to open a small office in your city. 60% of the team is local, but your best engineer is fully remote in another state.',
    stage: 'Seed',
    category: 'Team',
    choices: [
      {
        id: 'a',
        label: 'Stay fully remote',
        description: 'Keep the current structure that everyone is used to.',
        outcome: 'Collaboration continues to slow. Your best performers become isolated. Two key people leave for companies with better culture.',
        isOptimal: false,
        impact: { runway: 'Unchanged', team: '-2 people', growth: 'Slowing', equity: 'Unchanged' },
      },
      {
        id: 'b',
        label: 'Hybrid with flexibility',
        description: 'Open an office, make it optional, and invest in remote culture for distributed team members.',
        outcome: 'Local team builds stronger bonds. Remote employees feel valued with quarterly onsites and async-first practices. Productivity increases 20%.',
        isOptimal: true,
        impact: { runway: '-$5K/mo', team: 'Strengthened', growth: '+20% productivity', equity: 'Unchanged' },
      },
      {
        id: 'c',
        label: 'Mandate return to office',
        description: 'Require everyone local to be in-office 4 days a week.',
        outcome: 'Your best engineer and two others quit. The remaining team resents the mandate. It takes 6 months to backfill the roles.',
        isOptimal: false,
        impact: { runway: 'Unchanged', team: '-3 people', growth: 'Stalled', equity: 'Unchanged' },
      },
    ],
    lesson: 'The best policy balances collaboration needs with individual flexibility. Investing in both in-person and remote culture creates a more resilient team.',
  },
  {
    id: 'd8',
    title: 'The Technical Debt Decision',
    context: 'Your MVP was built fast to validate the market. It worked - you have paying customers.',
    situation: 'Your codebase is a mess. Simple features take 5x longer than they should. Your engineers want to spend 3 months rebuilding the core platform.',
    stage: 'Pre-Seed',
    category: 'Product',
    choices: [
      {
        id: 'a',
        label: 'Full rewrite now',
        description: 'Stop feature development and rebuild properly.',
        outcome: 'Three months turns into six. You lose 30% of customers who needed features. A competitor takes your market position.',
        isOptimal: false,
        impact: { runway: '-6 months', team: 'Happy engineers', growth: '-30% customers', equity: 'Unchanged' },
      },
      {
        id: 'b',
        label: 'Ignore it and ship features',
        description: 'Focus purely on growth. Technical debt is a future problem.',
        outcome: 'Velocity decreases 20% each quarter. Within a year, even small changes take weeks. Your best engineer quits from frustration.',
        isOptimal: false,
        impact: { runway: 'Unchanged', team: 'Frustrated', growth: 'Slowing', equity: 'Unchanged' },
      },
      {
        id: 'c',
        label: 'Incremental refactoring',
        description: 'Dedicate 20% of engineering time to debt reduction while still shipping.',
        outcome: 'Velocity stabilizes. Over 6 months, the worst code is improved. You maintain growth while building a more sustainable foundation.',
        isOptimal: true,
        impact: { runway: '-10%', team: 'Balanced', growth: 'Maintained', equity: 'Unchanged' },
      },
    ],
    lesson: 'Technical debt is inevitable but manageable. Incremental improvement lets you keep shipping while avoiding catastrophic slowdowns. Balance is key.',
  },
  {
    id: 'd9',
    title: 'The Strategic Investor',
    context: 'You are raising a Series A and have two term sheets on the table.',
    situation: 'A top VC offers $8M at $32M valuation. A strategic investor (potential customer) offers $6M at $30M valuation, but hints at a major contract if you take their money.',
    stage: 'Series A',
    category: 'Fundraising',
    choices: [
      {
        id: 'a',
        label: 'Take the VC money',
        description: 'Better terms and no strings attached.',
        outcome: 'Clean capital structure. The VC provides great board help. You win customers on your own merit and raise Series B at $100M valuation.',
        isOptimal: true,
        impact: { runway: '+24 months', team: 'Focused', growth: 'Independent', equity: '75% retained' },
      },
      {
        id: 'b',
        label: 'Take the strategic money',
        description: 'Smaller round but potential customer relationship.',
        outcome: 'The "hint" at a contract never materializes. They have information rights and try to influence your roadmap. Other potential customers see them on your cap table and become hesitant.',
        isOptimal: false,
        impact: { runway: '+18 months', team: 'Conflicted', growth: 'Constrained', equity: '77% retained' },
      },
      {
        id: 'c',
        label: 'Try to get both to invest',
        description: 'Negotiate a split round with both investors.',
        outcome: 'The VC walks away - they wanted to lead. You end up with just the strategic at worse terms. The negotiation damaged the relationship.',
        isOptimal: false,
        impact: { runway: '+15 months', team: 'Stressed', growth: 'Uncertain', equity: '80% retained' },
      },
    ],
    lesson: 'Strategic investors can be valuable, but hints at future business are often illusory. Clean capital from experienced VCs is usually better than complicated strategic relationships.',
  },
  {
    id: 'd10',
    title: 'The Burnout Question',
    context: 'You have been working 80-hour weeks for 18 months. The company is growing but you are exhausted.',
    situation: 'Your co-founder suggests you both take 2 weeks off and promote your head of product to acting CEO temporarily. You are worried about losing momentum.',
    stage: 'Seed',
    category: 'Team',
    choices: [
      {
        id: 'a',
        label: 'Push through',
        description: 'Rest is for the weak. Keep working until Series A.',
        outcome: 'You make increasingly poor decisions. Two months later, you have a complete breakdown and are forced to take 6 weeks off. The company nearly dies.',
        isOptimal: false,
        impact: { runway: 'Unchanged', team: 'Worried', growth: 'Erratic', equity: 'Unchanged' },
      },
      {
        id: 'b',
        label: 'Take the time off',
        description: 'Trust your team and take the break.',
        outcome: 'Your head of product handles everything well. You return refreshed with clearer thinking. The company actually grows 15% while you are gone.',
        isOptimal: true,
        impact: { runway: 'Unchanged', team: 'Empowered', growth: '+15%', equity: 'Unchanged' },
      },
      {
        id: 'c',
        label: 'Take one week instead',
        description: 'Compromise with a shorter break.',
        outcome: 'One week isnt enough to truly recover. You come back slightly better but still running on fumes. The cycle continues.',
        isOptimal: false,
        impact: { runway: 'Unchanged', team: 'Unchanged', growth: 'Unchanged', equity: 'Unchanged' },
      },
    ],
    lesson: 'Founder burnout is a company-killing risk. Taking care of yourself is taking care of the company. Strong teams can handle temporary leadership transitions.',
  },
];

// Scoring
export const DILEMMA_SCORING = {
  optimal: { points: 100, xp: 15 },
  suboptimal: { points: 25, xp: 5 },
};
