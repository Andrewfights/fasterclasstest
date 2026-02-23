// Pitch Tank Game Data
// Checklist-based pitch builder with scoring

export interface PitchSection {
  id: string;
  title: string;
  description: string;
  placeholder: string;
  minWords: number;
  optimalWords: number;
  tips: string[];
  scoringCriteria: string[];
}

export const PITCH_SECTIONS: PitchSection[] = [
  {
    id: 'problem',
    title: 'Problem',
    description: 'What problem are you solving? Who experiences this pain?',
    placeholder: 'We noticed that [target customer] struggles with [specific problem]. This costs them [time/money/frustration] because [reason]...',
    minWords: 15,
    optimalWords: 50,
    tips: [
      'Be specific about who has this problem',
      'Quantify the pain if possible ($, hours, etc.)',
      'Show you understand the root cause',
      'Make it relatable and urgent',
    ],
    scoringCriteria: [
      'Clearly identifies target customer',
      'Quantifies the problem impact',
      'Shows understanding of root cause',
    ],
  },
  {
    id: 'solution',
    title: 'Solution',
    description: 'How does your product solve this problem?',
    placeholder: 'Our platform [core functionality] by [how it works]. Unlike [alternatives], we [key differentiator]...',
    minWords: 15,
    optimalWords: 50,
    tips: [
      'Explain what your product does simply',
      'Highlight your unique approach',
      'Connect directly back to the problem',
      'Avoid jargon and buzzwords',
    ],
    scoringCriteria: [
      'Clear explanation of product',
      'Direct connection to problem',
      'Differentiation from alternatives',
    ],
  },
  {
    id: 'market',
    title: 'Market Size',
    description: 'How big is the opportunity? TAM, SAM, SOM.',
    placeholder: 'The total addressable market is $XXB, with [industry] growing at XX% annually. Our serviceable market of [segment] represents $XXM...',
    minWords: 15,
    optimalWords: 40,
    tips: [
      'Use TAM, SAM, SOM framework',
      'Cite credible sources',
      'Show market is growing',
      'Be realistic, not outlandish',
    ],
    scoringCriteria: [
      'Includes market size figures',
      'Shows growth trend',
      'Defines serviceable market',
    ],
  },
  {
    id: 'traction',
    title: 'Traction',
    description: 'What evidence do you have that this works?',
    placeholder: 'Since launching, we have acquired [X customers/users] with [revenue/engagement metrics]. Our growth rate is [X%] MoM...',
    minWords: 10,
    optimalWords: 40,
    tips: [
      'Lead with your strongest metric',
      'Show growth over time',
      'Include customer testimonials or logos if notable',
      'Be honest about stage',
    ],
    scoringCriteria: [
      'Includes concrete metrics',
      'Shows growth trajectory',
      'Demonstrates product-market fit signals',
    ],
  },
  {
    id: 'team',
    title: 'Team',
    description: 'Why is your team the one to build this?',
    placeholder: 'Our team brings [X years] of combined experience in [relevant domain]. Previously, our founders [relevant achievements]...',
    minWords: 10,
    optimalWords: 35,
    tips: [
      'Highlight relevant domain expertise',
      'Mention notable past companies or achievements',
      'Show founder-market fit',
      'Include complementary skills',
    ],
    scoringCriteria: [
      'Demonstrates relevant expertise',
      'Shows complementary skills',
      'Establishes credibility',
    ],
  },
  {
    id: 'ask',
    title: 'The Ask',
    description: 'What are you raising and what will you do with it?',
    placeholder: 'We are raising $X at $Y valuation. This will fund [key milestones] over the next [timeframe], including [specific uses]...',
    minWords: 10,
    optimalWords: 35,
    tips: [
      'Be specific about amount and terms',
      'Explain use of funds',
      'Connect to clear milestones',
      'Show path to next round or profitability',
    ],
    scoringCriteria: [
      'Clear funding amount',
      'Specific use of funds',
      'Defined milestones',
    ],
  },
];

// Scoring thresholds
export const PITCH_SCORING = {
  perSection: {
    empty: 0,
    minimal: 10,  // Has some content but below minWords
    complete: 25, // Meets minWords
    optimal: 40,  // Meets optimalWords and criteria
  },
  bonuses: {
    allSections: 50,  // Bonus for completing all sections
  },
  xpRates: {
    perSection: 5,
    allComplete: 20,
  },
};

// Pitch evaluation messages
export const PITCH_FEEDBACK = {
  excellent: {
    threshold: 250,
    message: 'Excellent pitch! You covered all key areas with compelling detail. Investors would be intrigued.',
    emoji: '🚀',
  },
  good: {
    threshold: 180,
    message: 'Good pitch! Strong foundation with room to add more specific metrics and differentiation.',
    emoji: '👍',
  },
  developing: {
    threshold: 100,
    message: 'Your pitch is taking shape. Focus on quantifying your traction and sharpening your problem statement.',
    emoji: '📝',
  },
  needsWork: {
    threshold: 0,
    message: 'Keep building your pitch. Try to address each section with specific details and metrics.',
    emoji: '💡',
  },
};

// Sample pitch for reference
export const SAMPLE_PITCH = {
  problem: 'Small business owners spend 10+ hours per week on manual bookkeeping, leading to $5,000 in average annual accounting errors and tax penalties. 60% report bookkeeping as their most frustrating administrative task.',
  solution: 'AutoBooks uses AI to automatically categorize transactions, reconcile accounts, and prepare tax-ready reports. Unlike QuickBooks, our system learns from each correction and requires zero manual data entry after initial setup.',
  market: 'The US small business accounting software market is $12B, growing at 8% annually. Our initial focus on e-commerce businesses represents a $2B serviceable market with 500,000 potential customers.',
  traction: 'Launched 8 months ago. Currently serving 340 paying customers ($42K MRR) with 15% month-over-month growth. NPS of 72. Reduced average customer bookkeeping time from 10 hours to 45 minutes weekly.',
  team: 'Co-founders previously built the expense management system at Stripe. Combined 15 years in fintech. CTO led ML teams at Plaid. Advisor network includes CFOs from Shopify and Square.',
  ask: 'Raising $3M seed at $15M post-money valuation. Funds will hire 4 engineers and 2 sales reps, targeting 2,000 customers and $400K MRR in 18 months. Clear path to Series A with these metrics.',
};
