import { HomeworkAssignment } from '../types';

export const HOMEWORK_ASSIGNMENTS: HomeworkAssignment[] = [
  {
    id: 'hw-ideation-1',
    title: 'Customer Discovery',
    description: 'Apply what you learned about talking to users and validating your ideas.',
    actionItems: [
      {
        id: 'ai-1',
        task: 'Identify 5 potential customers for your idea',
        hint: 'Think about who has the problem you want to solve - where do they hang out?',
        isRequired: true,
      },
      {
        id: 'ai-2',
        task: 'Conduct 3 user interviews using the Mom Test principles',
        hint: 'Remember: ask about their life, not your idea. Focus on past behaviors.',
        isRequired: true,
      },
      {
        id: 'ai-3',
        task: 'Document key insights from each interview',
        hint: 'Write down quotes, pain points, and surprising discoveries.',
        isRequired: true,
      },
      {
        id: 'ai-4',
        task: 'Identify one assumption that was invalidated',
        hint: 'What did you believe before that turned out to be wrong?',
        isRequired: false,
      },
    ],
    dueAfterModule: 'module-ideation',
    xpReward: 100,
  },
  {
    id: 'hw-prototype-1',
    title: 'Build Your First Prototype',
    description: 'Create a quick prototype to test your core hypothesis.',
    actionItems: [
      {
        id: 'ai-5',
        task: 'Define your core hypothesis in one sentence',
        hint: 'We believe [users] will [action] because [reason].',
        isRequired: true,
      },
      {
        id: 'ai-6',
        task: 'Build a prototype in under 4 hours',
        hint: 'Use no-code tools, paper sketches, or a simple landing page.',
        isRequired: true,
      },
      {
        id: 'ai-7',
        task: 'Get feedback from 3 real potential users',
        hint: 'Watch them use it - don\'t explain. Note where they get confused.',
        isRequired: true,
      },
      {
        id: 'ai-8',
        task: 'List 3 things you would change based on feedback',
        hint: 'Prioritize changes that affect your core hypothesis.',
        isRequired: false,
      },
    ],
    dueAfterModule: 'module-prototype',
    xpReward: 150,
  },
  {
    id: 'hw-mvp-1',
    title: 'MVP Planning',
    description: 'Plan your minimum viable product with focus on what truly matters.',
    actionItems: [
      {
        id: 'ai-9',
        task: 'List all features you think your product needs',
        hint: 'Include everything - we\'ll cut later.',
        isRequired: true,
      },
      {
        id: 'ai-10',
        task: 'Cross out 80% of the features',
        hint: 'Keep only what\'s essential to test your core value prop.',
        isRequired: true,
      },
      {
        id: 'ai-11',
        task: 'Define success metrics for your MVP',
        hint: 'What numbers would prove people want this?',
        isRequired: true,
      },
      {
        id: 'ai-12',
        task: 'Set a launch deadline (within 2 weeks)',
        hint: 'Constraints breed creativity. Commit to a date.',
        isRequired: true,
      },
    ],
    dueAfterModule: 'module-mvp',
    xpReward: 120,
  },
  {
    id: 'hw-fundraising-1',
    title: 'Pitch Deck Draft',
    description: 'Create the first version of your investor pitch deck.',
    actionItems: [
      {
        id: 'ai-13',
        task: 'Write a one-sentence company description',
        hint: 'We help [who] do [what] by [how].',
        isRequired: true,
      },
      {
        id: 'ai-14',
        task: 'Create 10-slide pitch deck outline',
        hint: 'Problem, Solution, Market, Product, Traction, Team, Ask.',
        isRequired: true,
      },
      {
        id: 'ai-15',
        task: 'Practice your 2-minute pitch with a friend',
        hint: 'Record yourself and watch it back. Cringe is growth.',
        isRequired: true,
      },
      {
        id: 'ai-16',
        task: 'Get feedback from someone who\'s raised before',
        hint: 'Ask what\'s unclear or unconvincing.',
        isRequired: false,
      },
    ],
    dueAfterModule: 'module-fundraising',
    xpReward: 150,
  },
  {
    id: 'hw-growth-1',
    title: 'First 100 Users',
    description: 'Plan and execute your strategy to get your first 100 users.',
    actionItems: [
      {
        id: 'ai-17',
        task: 'List 10 places where your target users hang out online',
        hint: 'Subreddits, Discord servers, Twitter communities, forums.',
        isRequired: true,
      },
      {
        id: 'ai-18',
        task: 'Join 3 communities and provide value for a week',
        hint: 'Don\'t pitch. Help people. Build reputation first.',
        isRequired: true,
      },
      {
        id: 'ai-19',
        task: 'Create a waitlist or signup page',
        hint: 'Collect emails before you launch. Build anticipation.',
        isRequired: true,
      },
      {
        id: 'ai-20',
        task: 'Personally reach out to 10 potential early adopters',
        hint: 'DMs, emails, LinkedIn. Be genuine, not salesy.',
        isRequired: false,
      },
    ],
    dueAfterModule: 'module-growth',
    xpReward: 100,
  },
];

// Helper to get homework by ID
export const getHomeworkById = (id: string): HomeworkAssignment | undefined => {
  return HOMEWORK_ASSIGNMENTS.find(hw => hw.id === id);
};

// Helper to get homework for a module
export const getHomeworkForModule = (moduleId: string): HomeworkAssignment | undefined => {
  return HOMEWORK_ASSIGNMENTS.find(hw => hw.dueAfterModule === moduleId);
};
