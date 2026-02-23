import { UserProfile, UserChecklist, ChecklistItem, ChecklistCategory } from '../types';

const PROFILE_STORAGE_KEY = 'fasterclass_user_profile';
const CHECKLIST_STORAGE_KEY = 'fasterclass_startup_checklist';

// Default startup checklist items
export const STARTUP_CHECKLIST: ChecklistItem[] = [
  // Legal
  {
    id: 'legal-1',
    title: 'Choose a Business Structure',
    description: 'Decide between LLC, C-Corp, S-Corp, or Sole Proprietorship based on your needs.',
    category: 'legal',
    order: 1,
    tips: [
      'Most startups choose Delaware C-Corp for fundraising',
      'LLCs are great for small businesses and tax flexibility',
      'Consult a lawyer for complex situations'
    ],
    resources: [
      { title: 'YC: Should I Form an LLC or Corporation?', videoId: 'startup-1' }
    ]
  },
  {
    id: 'legal-2',
    title: 'Register Your Business',
    description: 'File formation documents with your state and obtain a Certificate of Incorporation.',
    category: 'legal',
    order: 2,
    tips: [
      'Use Stripe Atlas, Clerky, or a lawyer',
      'Delaware is popular for C-Corps',
      'Your home state for LLCs'
    ]
  },
  {
    id: 'legal-3',
    title: 'Get an EIN (Tax ID)',
    description: 'Apply for an Employer Identification Number from the IRS - it\'s free!',
    category: 'legal',
    order: 3,
    tips: [
      'Apply online at IRS.gov - instant approval',
      'Needed for bank accounts and hiring',
      'Free and takes 5 minutes'
    ],
    resources: [
      { title: 'IRS EIN Application', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online' }
    ]
  },
  {
    id: 'legal-4',
    title: 'Draft Founder Agreement',
    description: 'Define equity splits, vesting schedules, roles, and IP assignment between co-founders.',
    category: 'legal',
    order: 4,
    tips: [
      '4-year vesting with 1-year cliff is standard',
      'Include IP assignment clauses',
      'Define decision-making processes'
    ]
  },
  {
    id: 'legal-5',
    title: 'Protect Your IP',
    description: 'File for trademarks, patents if applicable, and ensure proper IP assignment.',
    category: 'legal',
    order: 5,
    tips: [
      'Trademark your company name and logo',
      'Provisional patents are cheaper to start',
      'All employees should sign IP agreements'
    ]
  },

  // Finance
  {
    id: 'finance-1',
    title: 'Open a Business Bank Account',
    description: 'Separate personal and business finances with a dedicated business account.',
    category: 'finance',
    order: 1,
    tips: [
      'Mercury and Brex are popular for startups',
      'Keep personal and business finances separate',
      'Look for accounts with no monthly fees'
    ]
  },
  {
    id: 'finance-2',
    title: 'Set Up Accounting System',
    description: 'Choose accounting software and establish bookkeeping practices from day one.',
    category: 'finance',
    order: 2,
    tips: [
      'QuickBooks, Xero, or Pilot for startups',
      'Track every expense from the start',
      'Consider hiring a bookkeeper early'
    ]
  },
  {
    id: 'finance-3',
    title: 'Create Financial Projections',
    description: 'Build a 12-24 month financial model with revenue, expenses, and runway.',
    category: 'finance',
    order: 3,
    tips: [
      'Be conservative with revenue estimates',
      'Know your burn rate',
      'Plan for 18+ months of runway'
    ]
  },
  {
    id: 'finance-4',
    title: 'Understand Your Unit Economics',
    description: 'Calculate CAC, LTV, margins, and other key metrics for your business.',
    category: 'finance',
    order: 4,
    tips: [
      'LTV should be 3x+ your CAC',
      'Know your payback period',
      'Track cohort retention'
    ]
  },
  {
    id: 'finance-5',
    title: 'Get a Business Credit Card',
    description: 'Build business credit and earn rewards on startup expenses.',
    category: 'finance',
    order: 5,
    tips: [
      'Brex, Ramp, or Amex Business cards',
      'Pay off balance monthly',
      'Use for all business expenses'
    ]
  },

  // Product
  {
    id: 'product-1',
    title: 'Define Your Value Proposition',
    description: 'Clearly articulate the problem you solve and why your solution is unique.',
    category: 'product',
    order: 1,
    tips: [
      'Talk to 50+ potential customers first',
      'Focus on one core problem',
      'What would make people switch from competitors?'
    ]
  },
  {
    id: 'product-2',
    title: 'Build an MVP',
    description: 'Create the minimum viable product to test your hypothesis with real users.',
    category: 'product',
    order: 2,
    tips: [
      'Ship in weeks, not months',
      'Talk to users constantly',
      'Iterate based on feedback'
    ],
    resources: [
      { title: 'How to Build an MVP', videoId: 'startup-2' }
    ]
  },
  {
    id: 'product-3',
    title: 'Set Up Analytics',
    description: 'Implement tracking to understand user behavior and measure key metrics.',
    category: 'product',
    order: 3,
    tips: [
      'Mixpanel, Amplitude, or PostHog',
      'Define your North Star metric',
      'Track activation and retention'
    ]
  },
  {
    id: 'product-4',
    title: 'Create User Feedback Loop',
    description: 'Establish processes to continuously gather and act on user feedback.',
    category: 'product',
    order: 4,
    tips: [
      'Schedule weekly user calls',
      'Use tools like Intercom or Canny',
      'Prioritize feedback ruthlessly'
    ]
  },
  {
    id: 'product-5',
    title: 'Document Your Product Roadmap',
    description: 'Create a prioritized roadmap aligned with your business goals.',
    category: 'product',
    order: 5,
    tips: [
      'Focus on outcomes, not features',
      'Re-evaluate quarterly',
      'Share transparently with team'
    ]
  },

  // Marketing
  {
    id: 'marketing-1',
    title: 'Define Your Target Audience',
    description: 'Create detailed customer personas and identify your ideal customer profile.',
    category: 'marketing',
    order: 1,
    tips: [
      'Be specific - narrow is better',
      'Understand their pain points deeply',
      'Know where they hang out online'
    ]
  },
  {
    id: 'marketing-2',
    title: 'Build Your Brand Identity',
    description: 'Create your logo, color palette, typography, and brand guidelines.',
    category: 'marketing',
    order: 2,
    tips: [
      'Keep it simple and memorable',
      'Ensure it works in all sizes',
      'Be consistent everywhere'
    ]
  },
  {
    id: 'marketing-3',
    title: 'Launch Your Website',
    description: 'Build a professional website that clearly communicates your value proposition.',
    category: 'marketing',
    order: 3,
    tips: [
      'Mobile-first design',
      'Clear CTA above the fold',
      'Fast loading speeds'
    ]
  },
  {
    id: 'marketing-4',
    title: 'Set Up Social Media Presence',
    description: 'Create profiles on relevant platforms and establish your voice.',
    category: 'marketing',
    order: 4,
    tips: [
      'Focus on 1-2 platforms initially',
      'Consistency beats frequency',
      'Engage authentically'
    ]
  },
  {
    id: 'marketing-5',
    title: 'Create Content Strategy',
    description: 'Plan your content marketing approach to attract and engage customers.',
    category: 'marketing',
    order: 5,
    tips: [
      'SEO-focused blog content',
      'Share your journey (build in public)',
      'Repurpose across channels'
    ]
  },

  // Operations
  {
    id: 'ops-1',
    title: 'Set Up Business Email',
    description: 'Get professional email with your domain (yourname@company.com).',
    category: 'operations',
    order: 1,
    tips: [
      'Google Workspace or Microsoft 365',
      'Set up team aliases (hello@, support@)',
      'Configure SPF, DKIM, DMARC'
    ]
  },
  {
    id: 'ops-2',
    title: 'Choose Your Tech Stack',
    description: 'Select tools for communication, project management, and collaboration.',
    category: 'operations',
    order: 2,
    tips: [
      'Slack or Discord for communication',
      'Linear, Notion, or Asana for projects',
      'Google Drive or Notion for docs'
    ]
  },
  {
    id: 'ops-3',
    title: 'Create Standard Operating Procedures',
    description: 'Document key processes so anyone can follow them.',
    category: 'operations',
    order: 3,
    tips: [
      'Start with most repeated tasks',
      'Use video walkthroughs (Loom)',
      'Update as processes evolve'
    ]
  },
  {
    id: 'ops-4',
    title: 'Set Up Customer Support',
    description: 'Create channels and processes for handling customer inquiries.',
    category: 'operations',
    order: 4,
    tips: [
      'Intercom, Zendesk, or plain email',
      'Set response time expectations',
      'Create FAQ and help docs'
    ]
  },
  {
    id: 'ops-5',
    title: 'Implement Security Practices',
    description: 'Establish security protocols for data, access, and credentials.',
    category: 'operations',
    order: 5,
    tips: [
      'Use password manager (1Password)',
      '2FA on everything',
      'Regular security audits'
    ]
  },

  // Team
  {
    id: 'team-1',
    title: 'Define Your Culture',
    description: 'Articulate your company values and the culture you want to build.',
    category: 'team',
    order: 1,
    tips: [
      'Values should be actionable',
      'Hire for culture fit',
      'Lead by example'
    ]
  },
  {
    id: 'team-2',
    title: 'Create Hiring Process',
    description: 'Design a structured interview process that identifies great candidates.',
    category: 'team',
    order: 2,
    tips: [
      'Structured interviews reduce bias',
      'Include work samples/trials',
      'Move fast on great candidates'
    ]
  },
  {
    id: 'team-3',
    title: 'Set Up Payroll & Benefits',
    description: 'Choose payroll provider and establish employee benefits.',
    category: 'team',
    order: 3,
    tips: [
      'Gusto, Rippling, or Deel',
      'Competitive benefits attract talent',
      'Consider equity compensation'
    ]
  },
  {
    id: 'team-4',
    title: 'Create Employee Onboarding',
    description: 'Build a process to quickly integrate new team members.',
    category: 'team',
    order: 4,
    tips: [
      'First week schedule planned',
      'Buddy/mentor system',
      '30-60-90 day goals'
    ]
  },
  {
    id: 'team-5',
    title: 'Establish Meeting Rhythms',
    description: 'Set up regular check-ins, standups, and team meetings.',
    category: 'team',
    order: 5,
    tips: [
      'Weekly team sync',
      '1:1s with direct reports',
      'Quarterly planning sessions'
    ]
  }
];

export const CHECKLIST_CATEGORIES: { id: ChecklistCategory; label: string; icon: string; color: string }[] = [
  { id: 'legal', label: 'Legal & Formation', icon: '⚖️', color: '#8B5CF6' },
  { id: 'finance', label: 'Finance & Accounting', icon: '💰', color: '#10B981' },
  { id: 'product', label: 'Product & Development', icon: '🚀', color: '#3B82F6' },
  { id: 'marketing', label: 'Marketing & Brand', icon: '📣', color: '#F59E0B' },
  { id: 'operations', label: 'Operations & Tools', icon: '⚙️', color: '#6366F1' },
  { id: 'team', label: 'Team & Culture', icon: '👥', color: '#EC4899' }
];

export const profileService = {
  // Profile methods
  getProfile(email: string): UserProfile | null {
    try {
      const stored = localStorage.getItem(`${PROFILE_STORAGE_KEY}_${email}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  saveProfile(profile: UserProfile): void {
    try {
      profile.updatedAt = Date.now();
      localStorage.setItem(`${PROFILE_STORAGE_KEY}_${profile.email}`, JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  },

  createProfile(email: string, displayName: string): UserProfile {
    const profile: UserProfile = {
      id: `profile_${Date.now()}`,
      email,
      displayName,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.saveProfile(profile);
    return profile;
  },

  updateProfilePicture(email: string, base64Image: string): void {
    const profile = this.getProfile(email) || this.createProfile(email, 'User');
    profile.profilePicture = base64Image;
    this.saveProfile(profile);
  },

  updateCompanyInfo(email: string, companyName: string, companyLogo?: string): void {
    const profile = this.getProfile(email) || this.createProfile(email, 'User');
    profile.companyName = companyName;
    if (companyLogo) {
      profile.companyLogo = companyLogo;
    }
    this.saveProfile(profile);
  },

  // Checklist methods
  getUserChecklist(email: string): UserChecklist {
    try {
      const stored = localStorage.getItem(`${CHECKLIST_STORAGE_KEY}_${email}`);
      return stored ? JSON.parse(stored) : {
        completedItems: [],
        notes: {},
        lastUpdated: Date.now()
      };
    } catch {
      return {
        completedItems: [],
        notes: {},
        lastUpdated: Date.now()
      };
    }
  },

  saveUserChecklist(email: string, checklist: UserChecklist): void {
    try {
      checklist.lastUpdated = Date.now();
      localStorage.setItem(`${CHECKLIST_STORAGE_KEY}_${email}`, JSON.stringify(checklist));
    } catch (error) {
      console.error('Failed to save checklist:', error);
    }
  },

  toggleChecklistItem(email: string, itemId: string): boolean {
    const checklist = this.getUserChecklist(email);
    const isCompleted = checklist.completedItems.includes(itemId);

    if (isCompleted) {
      checklist.completedItems = checklist.completedItems.filter(id => id !== itemId);
    } else {
      checklist.completedItems.push(itemId);
    }

    this.saveUserChecklist(email, checklist);
    return !isCompleted;
  },

  updateChecklistNote(email: string, itemId: string, note: string): void {
    const checklist = this.getUserChecklist(email);
    if (note.trim()) {
      checklist.notes[itemId] = note;
    } else {
      delete checklist.notes[itemId];
    }
    this.saveUserChecklist(email, checklist);
  },

  getChecklistProgress(email: string): { completed: number; total: number; percentage: number } {
    const checklist = this.getUserChecklist(email);
    const total = STARTUP_CHECKLIST.length;
    const completed = checklist.completedItems.length;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  },

  getCategoryProgress(email: string, category: ChecklistCategory): { completed: number; total: number } {
    const checklist = this.getUserChecklist(email);
    const categoryItems = STARTUP_CHECKLIST.filter(item => item.category === category);
    const completed = categoryItems.filter(item => checklist.completedItems.includes(item.id)).length;
    return {
      completed,
      total: categoryItems.length
    };
  }
};
