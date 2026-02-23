import { Playlist, Video, Channel, Course, CourseModule, GlossaryTerm, FastChannel, LevelDefinition, Achievement } from './types';

export const INITIAL_VIDEOS: Video[] = [
  // ============================================
  // MODULE 1: IDEATION & VALIDATION
  // ============================================
  {
    id: 'm1-v1',
    title: 'How to Evaluate Startup Ideas',
    expert: 'Kevin Hale',
    thumbnail: 'https://img.youtube.com/vi/DOtCl5PU8F0/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=DOtCl5PU8F0',
    embedUrl: 'https://www.youtube.com/embed/DOtCl5PU8F0',
    duration: 2700,
    platform: 'youtube',
    tags: ['ideas', 'validation', 'y-combinator']
  },
  {
    id: 'm1-v2',
    title: 'How to Get and Evaluate Startup Ideas',
    expert: 'Jared Friedman',
    thumbnail: 'https://img.youtube.com/vi/f4_14pZlJBs/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=f4_14pZlJBs',
    embedUrl: 'https://www.youtube.com/embed/f4_14pZlJBs',
    duration: 1800,
    platform: 'youtube',
    tags: ['ideas', 'validation', 'y-combinator']
  },
  {
    id: 'm1-v3',
    title: 'Should You Start a Startup?',
    expert: 'Aaron Harris',
    thumbnail: 'https://img.youtube.com/vi/17XZGUX_9iM/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=17XZGUX_9iM',
    embedUrl: 'https://www.youtube.com/embed/17XZGUX_9iM',
    duration: 1500,
    platform: 'youtube',
    tags: ['ideas', 'decision', 'y-combinator']
  },
  {
    id: 'm1-v4',
    title: 'How to Talk to Users',
    expert: 'Gustaf Alstromer',
    thumbnail: 'https://img.youtube.com/vi/C27RVio2rOs/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=C27RVio2rOs',
    embedUrl: 'https://www.youtube.com/embed/C27RVio2rOs',
    duration: 1200,
    platform: 'youtube',
    tags: ['users', 'validation', 'y-combinator']
  },

  // ============================================
  // MODULE 2: BUILDING YOUR MVP
  // ============================================
  {
    id: 'm2-v1',
    title: 'How to Plan an MVP',
    expert: 'Michael Seibel',
    thumbnail: 'https://img.youtube.com/vi/ii1jcLg-eIQ/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=ii1jcLg-eIQ',
    embedUrl: 'https://www.youtube.com/embed/ii1jcLg-eIQ',
    duration: 900,
    platform: 'youtube',
    tags: ['mvp', 'product', 'y-combinator']
  },
  {
    id: 'm2-v2',
    title: 'How to Launch an MVP',
    expert: 'Kat Manalac',
    thumbnail: 'https://img.youtube.com/vi/XcCmMOWuAF4/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=XcCmMOWuAF4',
    embedUrl: 'https://www.youtube.com/embed/XcCmMOWuAF4',
    duration: 1200,
    platform: 'youtube',
    tags: ['mvp', 'launch', 'y-combinator']
  },
  {
    id: 'm2-v3',
    title: 'How to Build an MVP',
    expert: 'Michael Seibel',
    thumbnail: 'https://img.youtube.com/vi/1hHMwLxN6EM/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=1hHMwLxN6EM',
    embedUrl: 'https://www.youtube.com/embed/1hHMwLxN6EM',
    duration: 900,
    platform: 'youtube',
    tags: ['mvp', 'product', 'execution']
  },
  {
    id: 'm2-v4',
    title: 'How to Make Something People Want',
    expert: 'Kevin Hale',
    thumbnail: 'https://img.youtube.com/vi/sz_LgBAGYyo/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=sz_LgBAGYyo',
    embedUrl: 'https://www.youtube.com/embed/sz_LgBAGYyo',
    duration: 1800,
    platform: 'youtube',
    tags: ['product', 'users', 'y-combinator']
  },

  // ============================================
  // MODULE 3: FINDING PRODUCT-MARKET FIT
  // ============================================
  {
    id: 'm3-v1',
    title: 'How to Find Product Market Fit',
    expert: 'David Rusenko',
    thumbnail: 'https://img.youtube.com/vi/hyYCn_kAngI/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=hyYCn_kAngI',
    embedUrl: 'https://www.youtube.com/embed/hyYCn_kAngI',
    duration: 1800,
    platform: 'youtube',
    tags: ['pmf', 'product', 'y-combinator']
  },
  {
    id: 'm3-v2',
    title: 'How to Get Your First Customers',
    expert: 'Gustaf Alstromer',
    thumbnail: 'https://img.youtube.com/vi/aAb7hSCtvGw/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=aAb7hSCtvGw',
    embedUrl: 'https://www.youtube.com/embed/aAb7hSCtvGw',
    duration: 1500,
    platform: 'youtube',
    tags: ['customers', 'sales', 'y-combinator']
  },
  {
    id: 'm3-v3',
    title: 'Why Startups Fail',
    expert: 'Dalton Caldwell',
    thumbnail: 'https://img.youtube.com/vi/5RR4VXNX3jA/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=5RR4VXNX3jA',
    embedUrl: 'https://www.youtube.com/embed/5RR4VXNX3jA',
    duration: 1500,
    platform: 'youtube',
    tags: ['failure', 'lessons', 'y-combinator']
  },

  // ============================================
  // MODULE 4: GROWTH & MARKETING
  // ============================================
  {
    id: 'm4-v1',
    title: 'How to Get Users and Grow',
    expert: 'Adora Cheung',
    thumbnail: 'https://img.youtube.com/vi/raIUQP71SBU/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=raIUQP71SBU',
    embedUrl: 'https://www.youtube.com/embed/raIUQP71SBU',
    duration: 1800,
    platform: 'youtube',
    tags: ['growth', 'users', 'y-combinator']
  },
  {
    id: 'm4-v2',
    title: 'How to Market Your Startup',
    expert: 'Gustaf Alstromer',
    thumbnail: 'https://img.youtube.com/vi/T9ikpoF2GH0/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=T9ikpoF2GH0',
    embedUrl: 'https://www.youtube.com/embed/T9ikpoF2GH0',
    duration: 1500,
    platform: 'youtube',
    tags: ['marketing', 'growth', 'y-combinator']
  },
  {
    id: 'm4-v3',
    title: 'How to Set KPIs and Goals',
    expert: 'Anu Hariharan',
    thumbnail: 'https://img.youtube.com/vi/oQOC-qy-GDY/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=oQOC-qy-GDY',
    embedUrl: 'https://www.youtube.com/embed/oQOC-qy-GDY',
    duration: 1200,
    platform: 'youtube',
    tags: ['metrics', 'kpis', 'y-combinator']
  },

  // ============================================
  // MODULE 5: FUNDRAISING
  // ============================================
  {
    id: 'm5-v1',
    title: 'How to Fundraise',
    expert: 'Kirsty Nathoo',
    thumbnail: 'https://img.youtube.com/vi/5ZXU84_sGXo/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=5ZXU84_sGXo',
    embedUrl: 'https://www.youtube.com/embed/5ZXU84_sGXo',
    duration: 1800,
    platform: 'youtube',
    tags: ['fundraising', 'vc', 'y-combinator']
  },
  {
    id: 'm5-v2',
    title: 'How to Pitch Your Startup',
    expert: 'Michael Seibel',
    thumbnail: 'https://img.youtube.com/vi/Th8JoIan4dg/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=Th8JoIan4dg',
    embedUrl: 'https://www.youtube.com/embed/Th8JoIan4dg',
    duration: 1200,
    platform: 'youtube',
    tags: ['pitch', 'fundraising', 'y-combinator']
  },
  {
    id: 'm5-v3',
    title: 'How to Split Equity Among Co-Founders',
    expert: 'Michael Seibel',
    thumbnail: 'https://img.youtube.com/vi/uvw-u99yj8w/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=uvw-u99yj8w',
    embedUrl: 'https://www.youtube.com/embed/uvw-u99yj8w',
    duration: 900,
    platform: 'youtube',
    tags: ['equity', 'cofounders', 'y-combinator']
  },

  // ============================================
  // MODULE 6: SCALING & OPERATIONS
  // ============================================
  {
    id: 'm6-v1',
    title: 'Team and Execution',
    expert: 'Sam Altman',
    thumbnail: 'https://img.youtube.com/vi/CVfnkM44Urs/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=CVfnkM44Urs',
    embedUrl: 'https://www.youtube.com/embed/CVfnkM44Urs',
    duration: 2900,
    platform: 'youtube',
    tags: ['team', 'execution', 'stanford']
  },
  {
    id: 'm6-v2',
    title: 'How to Hire',
    expert: 'Sam Altman',
    thumbnail: 'https://img.youtube.com/vi/6fQHLK1aIBs/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=6fQHLK1aIBs',
    embedUrl: 'https://www.youtube.com/embed/6fQHLK1aIBs',
    duration: 1500,
    platform: 'youtube',
    tags: ['hiring', 'team', 'y-combinator']
  },
  {
    id: 'm6-v3',
    title: 'Ideas, Products, Teams and Execution',
    expert: 'Sam Altman',
    thumbnail: 'https://img.youtube.com/vi/CxKXJWf-WMg/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=CxKXJWf-WMg',
    embedUrl: 'https://www.youtube.com/embed/CxKXJWf-WMg',
    duration: 2700,
    platform: 'youtube',
    tags: ['execution', 'strategy', 'stanford']
  },

  // ============================================
  // MODULE 7: MINDSET & INSPIRATION
  // ============================================
  {
    id: 'm7-v1',
    title: 'Start With Why',
    expert: 'Simon Sinek',
    thumbnail: 'https://img.youtube.com/vi/qp0HIF3SfI4/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=qp0HIF3SfI4',
    embedUrl: 'https://www.youtube.com/embed/qp0HIF3SfI4',
    duration: 1080,
    platform: 'youtube',
    tags: ['leadership', 'vision', 'ted']
  },
  {
    id: 'm7-v2',
    title: 'The Golden Circle',
    expert: 'Simon Sinek',
    thumbnail: 'https://img.youtube.com/vi/u4ZoJKF_VuA/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=u4ZoJKF_VuA',
    embedUrl: 'https://www.youtube.com/embed/u4ZoJKF_VuA',
    duration: 1080,
    platform: 'youtube',
    tags: ['leadership', 'purpose', 'mindset']
  },
  {
    id: 'm7-v3',
    title: 'Stanford Commencement Address',
    expert: 'Steve Jobs',
    thumbnail: 'https://img.youtube.com/vi/UF8uR6Z6KLc/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=UF8uR6Z6KLc',
    embedUrl: 'https://www.youtube.com/embed/UF8uR6Z6KLc',
    duration: 900,
    platform: 'youtube',
    tags: ['inspiration', 'vision', 'stanford']
  },
  {
    id: 'm7-v4',
    title: 'How to Get Rich Without Getting Lucky',
    expert: 'Naval Ravikant',
    thumbnail: 'https://img.youtube.com/vi/HiYo14wylQw/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=HiYo14wylQw',
    embedUrl: 'https://www.youtube.com/embed/HiYo14wylQw',
    duration: 4200,
    platform: 'youtube',
    tags: ['wealth', 'mindset', 'philosophy']
  },
  {
    id: 'm7-v5',
    title: 'Good.',
    expert: 'Jocko Willink',
    thumbnail: 'https://img.youtube.com/vi/IdTMDpizis8/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=IdTMDpizis8',
    embedUrl: 'https://www.youtube.com/embed/IdTMDpizis8',
    duration: 140,
    platform: 'youtube',
    tags: ['resilience', 'mindset', 'leadership']
  },
  {
    id: 'm7-v6',
    title: 'The Founders Story',
    expert: 'Y Combinator',
    thumbnail: 'https://img.youtube.com/vi/0lJKucu6HJc/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=0lJKucu6HJc',
    embedUrl: 'https://www.youtube.com/embed/0lJKucu6HJc',
    duration: 3600,
    platform: 'youtube',
    tags: ['documentary', 'yc', 'inspiration']
  },

  // ============================================
  // BONUS: AI & TECH
  // ============================================
  {
    id: 'bonus-v1',
    title: 'OpenAI DevDay Keynote',
    expert: 'Sam Altman',
    thumbnail: 'https://img.youtube.com/vi/U9mJuUkhUzk/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=U9mJuUkhUzk',
    embedUrl: 'https://www.youtube.com/embed/U9mJuUkhUzk',
    duration: 2700,
    platform: 'youtube',
    tags: ['ai', 'tech', 'openai']
  },

  // ============================================
  // MODULE 8: BOOTSTRAPPING & INDIE HACKING
  // ============================================
  {
    id: 'm8-v1',
    title: 'Indie Hacking: Building 40+ Startups Solo',
    expert: 'Pieter Levels',
    thumbnail: 'https://img.youtube.com/vi/oFtjKbXKqbg/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=oFtjKbXKqbg',
    embedUrl: 'https://www.youtube.com/embed/oFtjKbXKqbg',
    duration: 13414,
    platform: 'youtube',
    tags: ['indie', 'bootstrapping', 'solo-founder']
  },
  {
    id: 'm8-v2',
    title: 'The Minimalist Entrepreneur',
    expert: 'Sahil Lavingia',
    thumbnail: 'https://img.youtube.com/vi/6reLWfFNer0/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=6reLWfFNer0',
    embedUrl: 'https://www.youtube.com/embed/6reLWfFNer0',
    duration: 3600,
    platform: 'youtube',
    tags: ['bootstrapping', 'indie', 'gumroad']
  },
  {
    id: 'm8-v3',
    title: '12 Startups in 12 Months Challenge',
    expert: 'Pieter Levels',
    thumbnail: 'https://img.youtube.com/vi/6reLWfFNer0/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=6reLWfFNer0',
    embedUrl: 'https://www.youtube.com/embed/6reLWfFNer0',
    duration: 1200,
    platform: 'youtube',
    tags: ['indie', 'shipping', 'challenge']
  },

  // ============================================
  // MODULE 9: AI & VIBE CODING
  // ============================================
  {
    id: 'm9-v1',
    title: 'Intro to Large Language Models',
    expert: 'Andrej Karpathy',
    thumbnail: 'https://img.youtube.com/vi/zjkBMFhNj_g/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=zjkBMFhNj_g',
    embedUrl: 'https://www.youtube.com/embed/zjkBMFhNj_g',
    duration: 3600,
    platform: 'youtube',
    tags: ['ai', 'llm', 'tech']
  },
  {
    id: 'm9-v2',
    title: 'Deep Dive into LLMs like ChatGPT',
    expert: 'Andrej Karpathy',
    thumbnail: 'https://img.youtube.com/vi/7xTGNNLPyMI/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=7xTGNNLPyMI',
    embedUrl: 'https://www.youtube.com/embed/7xTGNNLPyMI',
    duration: 12660,
    platform: 'youtube',
    tags: ['ai', 'llm', 'deep-dive']
  },
  {
    id: 'm9-v3',
    title: 'Building AI Products',
    expert: 'Sam Altman',
    thumbnail: 'https://img.youtube.com/vi/U9mJuUkhUzk/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=U9mJuUkhUzk',
    embedUrl: 'https://www.youtube.com/embed/U9mJuUkhUzk',
    duration: 2700,
    platform: 'youtube',
    tags: ['ai', 'product', 'openai']
  },

  // ============================================
  // MODULE 10: DESIGN FOR FOUNDERS
  // ============================================
  {
    id: 'm10-v1',
    title: 'Design for Non-Designers',
    expert: 'Tracy Osborn',
    thumbnail: 'https://img.youtube.com/vi/ZbrzdMaumNk/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=ZbrzdMaumNk',
    embedUrl: 'https://www.youtube.com/embed/ZbrzdMaumNk',
    duration: 2400,
    platform: 'youtube',
    tags: ['design', 'ui', 'founders']
  },
  {
    id: 'm10-v2',
    title: 'UI Design Fundamentals',
    expert: 'Refactoring UI',
    thumbnail: 'https://img.youtube.com/vi/7Z9rrryIOC4/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=7Z9rrryIOC4',
    embedUrl: 'https://www.youtube.com/embed/7Z9rrryIOC4',
    duration: 1800,
    platform: 'youtube',
    tags: ['design', 'ui', 'tailwind']
  },
  {
    id: 'm10-v3',
    title: 'The First Rule of Design',
    expert: 'Mike Monteiro',
    thumbnail: 'https://img.youtube.com/vi/E-MdX-YbWGo/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=E-MdX-YbWGo',
    embedUrl: 'https://www.youtube.com/embed/E-MdX-YbWGo',
    duration: 3000,
    platform: 'youtube',
    tags: ['design', 'ethics', 'product']
  },

  // ============================================
  // MODULE 11: PRODUCT MANAGEMENT
  // ============================================
  {
    id: 'm11-v1',
    title: 'Empowered Product Teams',
    expert: 'Marty Cagan',
    thumbnail: 'https://img.youtube.com/vi/UYN6W1cxn_I/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=UYN6W1cxn_I',
    embedUrl: 'https://www.youtube.com/embed/UYN6W1cxn_I',
    duration: 3600,
    platform: 'youtube',
    tags: ['product', 'management', 'teams']
  },
  {
    id: 'm11-v2',
    title: 'Product Discovery',
    expert: 'Marty Cagan',
    thumbnail: 'https://img.youtube.com/vi/l7-5x0ra2tc/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=l7-5x0ra2tc',
    embedUrl: 'https://www.youtube.com/embed/l7-5x0ra2tc',
    duration: 2700,
    platform: 'youtube',
    tags: ['product', 'discovery', 'validation']
  },
  {
    id: 'm11-v3',
    title: 'How to Talk to Users',
    expert: 'Gustaf Alstromer',
    thumbnail: 'https://img.youtube.com/vi/z1iF1c8w5Lg/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=z1iF1c8w5Lg',
    embedUrl: 'https://www.youtube.com/embed/z1iF1c8w5Lg',
    duration: 1500,
    platform: 'youtube',
    tags: ['users', 'research', 'y-combinator']
  },

  // ============================================
  // MODULE 12: HUSTLE & MOTIVATION
  // ============================================
  {
    id: 'm12-v1',
    title: 'Document, Dont Create',
    expert: 'Gary Vaynerchuk',
    thumbnail: 'https://img.youtube.com/vi/RVKofRN1dyI/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=RVKofRN1dyI',
    embedUrl: 'https://www.youtube.com/embed/RVKofRN1dyI',
    duration: 360,
    platform: 'youtube',
    tags: ['content', 'marketing', 'hustle']
  },
  {
    id: 'm12-v2',
    title: 'Patience is the Key',
    expert: 'Gary Vaynerchuk',
    thumbnail: 'https://img.youtube.com/vi/xSxBjXJrOdE/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=xSxBjXJrOdE',
    embedUrl: 'https://www.youtube.com/embed/xSxBjXJrOdE',
    duration: 480,
    platform: 'youtube',
    tags: ['mindset', 'patience', 'hustle']
  },
  {
    id: 'm12-v3',
    title: 'Stop Caring What People Think',
    expert: 'Gary Vaynerchuk',
    thumbnail: 'https://img.youtube.com/vi/Cwi4Xo5KYog/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=Cwi4Xo5KYog',
    embedUrl: 'https://www.youtube.com/embed/Cwi4Xo5KYog',
    duration: 540,
    platform: 'youtube',
    tags: ['mindset', 'confidence', 'hustle']
  },

  // ============================================
  // MODULE 13: STARTUP 101
  // ============================================
  {
    id: 'm13-v1',
    title: 'Before the Startup',
    expert: 'Paul Graham',
    thumbnail: 'https://img.youtube.com/vi/ii1jcLg-eIQ/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=ii1jcLg-eIQ',
    embedUrl: 'https://www.youtube.com/embed/ii1jcLg-eIQ',
    duration: 2700,
    platform: 'youtube',
    tags: ['startup', 'basics', 'stanford']
  },
  {
    id: 'm13-v2',
    title: 'How to Start a Startup',
    expert: 'Sam Altman',
    thumbnail: 'https://img.youtube.com/vi/CBYhVcO4WgI/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=CBYhVcO4WgI',
    embedUrl: 'https://www.youtube.com/embed/CBYhVcO4WgI',
    duration: 2880,
    platform: 'youtube',
    tags: ['startup', 'basics', 'y-combinator']
  },
  {
    id: 'm13-v3',
    title: 'Startup Mechanics',
    expert: 'Kirsty Nathoo',
    thumbnail: 'https://img.youtube.com/vi/5ZXU84_sGXo/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=5ZXU84_sGXo',
    embedUrl: 'https://www.youtube.com/embed/5ZXU84_sGXo',
    duration: 1800,
    platform: 'youtube',
    tags: ['startup', 'legal', 'y-combinator']
  },

  // ============================================
  // MODULE 14: SALES & BIZ DEV
  // ============================================
  {
    id: 'm14-v1',
    title: 'How to Sell',
    expert: 'Tyler Bosmeny',
    thumbnail: 'https://img.youtube.com/vi/xZi4kTJG-LE/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=xZi4kTJG-LE',
    embedUrl: 'https://www.youtube.com/embed/xZi4kTJG-LE',
    duration: 1500,
    platform: 'youtube',
    tags: ['sales', 'startup', 'y-combinator']
  },
  {
    id: 'm14-v2',
    title: 'How to Get Meetings with Anyone',
    expert: 'YC Partners',
    thumbnail: 'https://img.youtube.com/vi/aAb7hSCtvGw/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=aAb7hSCtvGw',
    embedUrl: 'https://www.youtube.com/embed/aAb7hSCtvGw',
    duration: 1200,
    platform: 'youtube',
    tags: ['sales', 'networking', 'outreach']
  },
  {
    id: 'm14-v3',
    title: 'Building Business Relationships',
    expert: 'Reid Hoffman',
    thumbnail: 'https://img.youtube.com/vi/Sb_-wfmJnRM/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=Sb_-wfmJnRM',
    embedUrl: 'https://www.youtube.com/embed/Sb_-wfmJnRM',
    duration: 2400,
    platform: 'youtube',
    tags: ['networking', 'bizdev', 'linkedin']
  },

  // ============================================
  // VERTICAL / SHORTS
  // ============================================
  {
    id: 'short-v1',
    title: 'Build in Public Strategy',
    expert: 'Pieter Levels',
    thumbnail: 'https://img.youtube.com/vi/oFtjKbXKqbg/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/oFtjKbXKqbg',
    embedUrl: 'https://www.youtube.com/embed/oFtjKbXKqbg',
    duration: 56,
    platform: 'youtube',
    tags: ['indie', 'building', 'shorts'],
    isVertical: true
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'module-1',
    title: 'Module 1: Ideation & Validation',
    description: 'Learn how to find startup ideas and validate them before writing any code. Talk to users, evaluate opportunities, and decide if you should start a startup.',
    videoIds: ['m1-v1', 'm1-v2', 'm1-v3', 'm1-v4'],
    locked: false,
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800'
  },
  {
    id: 'module-2',
    title: 'Module 2: Building Your MVP',
    description: 'Master the art of building a minimum viable product. Learn to plan, build, and launch something users actually want.',
    videoIds: ['m2-v1', 'm2-v2', 'm2-v3', 'm2-v4'],
    locked: false,
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800'
  },
  {
    id: 'module-3',
    title: 'Module 3: Finding Product-Market Fit',
    description: 'Understand how to find product-market fit, get your first customers, and learn from startup failures.',
    videoIds: ['m3-v1', 'm3-v2', 'm3-v3'],
    locked: false,
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800'
  },
  {
    id: 'module-4',
    title: 'Module 4: Growth & Marketing',
    description: 'Learn how to grow your user base, market your startup, and set meaningful KPIs and goals.',
    videoIds: ['m4-v1', 'm4-v2', 'm4-v3'],
    locked: false,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800'
  },
  {
    id: 'module-5',
    title: 'Module 5: Fundraising',
    description: 'Master the fundamentals of fundraising, from crafting your pitch to navigating co-founder equity.',
    videoIds: ['m5-v1', 'm5-v2', 'm5-v3'],
    locked: false,
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800'
  },
  {
    id: 'module-6',
    title: 'Module 6: Scaling & Operations',
    description: 'Learn how to build and manage teams, hire effectively, and execute at scale.',
    videoIds: ['m6-v1', 'm6-v2', 'm6-v3'],
    locked: false,
    coverImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800'
  },
  {
    id: 'module-7',
    title: 'Module 7: Founder Mindset',
    description: 'Develop the mindset of successful founders. Leadership, resilience, and timeless wisdom from the greats.',
    videoIds: ['m7-v1', 'm7-v2', 'm7-v3', 'm7-v4', 'm7-v5', 'm7-v6'],
    locked: false,
    coverImage: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=800'
  }
];

export const CHANNELS: Channel[] = [
  {
    id: 'c1',
    name: 'Startup School',
    description: 'The essential YC curriculum for early-stage founders.',
    category: 'Education',
    videoIds: ['m1-v1', 'm1-v2', 'm2-v1', 'm2-v2', 'm3-v1', 'm3-v2'],
    logo: '🎓'
  },
  {
    id: 'c2',
    name: 'Growth Academy',
    description: 'Master user acquisition, marketing, and metrics.',
    category: 'Growth',
    videoIds: ['m4-v1', 'm4-v2', 'm4-v3', 'm3-v2', 'm3-v3'],
    logo: '📈'
  },
  {
    id: 'c3',
    name: 'Fundraising 101',
    description: 'Everything you need to know about raising capital.',
    category: 'Finance',
    videoIds: ['m5-v1', 'm5-v2', 'm5-v3'],
    logo: '💰'
  },
  {
    id: 'c4',
    name: 'Leadership Lab',
    description: 'Building teams, hiring, and scaling operations.',
    category: 'Management',
    videoIds: ['m6-v1', 'm6-v2', 'm6-v3', 'm7-v1', 'm7-v2'],
    logo: '👥'
  },
  {
    id: 'c5',
    name: 'Founder Mindset',
    description: 'Inspiration and wisdom from legendary founders.',
    category: 'Inspiration',
    videoIds: ['m7-v3', 'm7-v4', 'm7-v5', 'm7-v6', 'bonus-v1'],
    logo: '🧠'
  }
];

// ============================================
// FAST CHANNELS (Pluto TV Style Linear TV)
// ============================================
export const FAST_CHANNELS: FastChannel[] = [
  {
    id: 'fast-1',
    number: 1,
    name: 'Startup School',
    shortName: 'YC',
    description: 'The essential YC curriculum for early-stage founders.',
    category: 'learning',
    logo: '🎓',
    color: '#FF6B35',
    videoIds: ['m1-v1', 'm1-v2', 'm1-v3', 'm1-v4', 'm2-v1', 'm2-v2'],
  },
  {
    id: 'fast-2',
    number: 2,
    name: 'Growth Academy',
    shortName: 'GRW',
    description: 'Master user acquisition, marketing, and metrics.',
    category: 'learning',
    logo: '📈',
    color: '#34D399',
    videoIds: ['m4-v1', 'm4-v2', 'm4-v3', 'm3-v2'],
  },
  {
    id: 'fast-3',
    number: 3,
    name: 'Fundraising 101',
    shortName: 'FUND',
    description: 'Everything you need to know about raising capital.',
    category: 'learning',
    logo: '💰',
    color: '#FBBF24',
    videoIds: ['m5-v1', 'm5-v2', 'm5-v3'],
  },
  {
    id: 'fast-4',
    number: 4,
    name: 'Leadership Lab',
    shortName: 'LEAD',
    description: 'Building teams, hiring, and scaling operations.',
    category: 'learning',
    logo: '👥',
    color: '#60A5FA',
    videoIds: ['m6-v1', 'm6-v2', 'm6-v3'],
  },
  {
    id: 'fast-5',
    number: 5,
    name: 'Founder Mindset',
    shortName: 'MIND',
    description: 'Inspiration and wisdom from legendary founders.',
    category: 'inspiration',
    logo: '🧠',
    color: '#A78BFA',
    videoIds: ['m7-v1', 'm7-v2', 'm7-v3', 'm7-v4', 'm7-v5'],
  },
  {
    id: 'fast-6',
    number: 6,
    name: 'AI & Tech',
    shortName: 'AI',
    description: 'Future of technology, AI tools, and tech trends.',
    category: 'tech',
    logo: '🤖',
    color: '#06B6D4',
    videoIds: ['bonus-v1', 'm7-v6', 'short-v1'],
  },
  {
    id: 'fast-7',
    number: 7,
    name: 'YC Classics',
    shortName: 'CLASS',
    description: 'Timeless YC lectures from Sam Altman and legends.',
    category: 'learning',
    logo: '🏆',
    color: '#F97316',
    videoIds: ['m6-v1', 'm6-v3', 'm1-v1'],
  },
  {
    id: 'fast-8',
    number: 8,
    name: 'Quick Hits',
    shortName: 'QUICK',
    description: 'Shorts and rapid fire motivation under 5 minutes.',
    category: 'inspiration',
    logo: '⚡',
    color: '#EC4899',
    videoIds: ['m7-v5', 'short-v1', 'm5-v3'],
  },
  {
    id: 'fast-9',
    number: 9,
    name: 'PMF Channel',
    shortName: 'PMF',
    description: 'Finding product-market fit and first customers.',
    category: 'learning',
    logo: '🎯',
    color: '#10B981',
    videoIds: ['m3-v1', 'm3-v2', 'm3-v3', 'm2-v4'],
  },
  {
    id: 'fast-10',
    number: 10,
    name: 'MVP Masters',
    shortName: 'MVP',
    description: 'Build fast, ship faster. MVP planning and launching.',
    category: 'learning',
    logo: '🔨',
    color: '#8B5CF6',
    videoIds: ['m2-v1', 'm2-v2', 'm2-v3', 'm2-v4'],
  },
  {
    id: 'fast-11',
    number: 11,
    name: 'Indie Hackers',
    shortName: 'INDIE',
    description: 'Bootstrapping and building solo. No VC required.',
    category: 'learning',
    logo: '🛠️',
    color: '#10B981',
    videoIds: ['m8-v1', 'm8-v2', 'm8-v3'],
  },
  {
    id: 'fast-12',
    number: 12,
    name: 'AI Academy',
    shortName: 'AI+',
    description: 'Learn AI fundamentals and vibe coding.',
    category: 'tech',
    logo: '🤖',
    color: '#8B5CF6',
    videoIds: ['m9-v1', 'm9-v2', 'm9-v3', 'bonus-v1'],
  },
  {
    id: 'fast-13',
    number: 13,
    name: 'Design School',
    shortName: 'DSN',
    description: 'UI/UX design essentials for founders.',
    category: 'learning',
    logo: '🎨',
    color: '#F472B6',
    videoIds: ['m10-v1', 'm10-v2', 'm10-v3'],
  },
  {
    id: 'fast-14',
    number: 14,
    name: 'GaryVee TV',
    shortName: 'GARY',
    description: 'Hustle, content, and entrepreneur motivation.',
    category: 'inspiration',
    logo: '🔥',
    color: '#EF4444',
    videoIds: ['m12-v1', 'm12-v2', 'm12-v3'],
  },
  {
    id: 'fast-15',
    number: 15,
    name: 'Sales Channel',
    shortName: 'SALES',
    description: 'Sell like a founder. Close deals and partnerships.',
    category: 'learning',
    logo: '🤝',
    color: '#F59E0B',
    videoIds: ['m14-v1', 'm14-v2', 'm14-v3'],
  },
];

// Helper to extract Youtube ID
export const getYoutubeId = (url: string): string | null => {
  const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) {
    return shortsMatch[1];
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// ============================================
// COURSES (Curated Learning Paths)
// ============================================
export const COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Ideation & Validation',
    description: 'Learn how to find startup ideas and validate them before writing any code. Talk to users, evaluate opportunities, and decide if you should start a startup.',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800',
    videoIds: ['m1-v1', 'm1-v2', 'm1-v3', 'm1-v4'],
    topic: 'Ideas',
    iconEmoji: '💡',
    color: '#FBBF24',
    order: 1,
    hasModularCurriculum: true,
    modules: [
      {
        id: 'course-1-module-1',
        title: 'Finding Great Ideas',
        description: 'Learn how to discover and evaluate startup ideas that have real potential.',
        order: 1,
        videoIds: ['m1-v1', 'm1-v2'],
        quizId: 'quiz-ideation-m1',
        keyTermIds: ['term-mvp', 'term-pmf', 'term-incorporation'],
      },
      {
        id: 'course-1-module-2',
        title: 'Should You Start?',
        description: 'Understand when the time is right to take the leap into entrepreneurship.',
        order: 2,
        videoIds: ['m1-v3'],
        keyTermIds: ['term-vesting', 'term-c-corp'],
      },
      {
        id: 'course-1-module-3',
        title: 'Validating with Users',
        description: 'Master the art of talking to users and validating your assumptions.',
        order: 3,
        videoIds: ['m1-v4'],
        quizId: 'quiz-ideation',
        keyTermIds: ['term-pmf', 'term-mvp'],
      },
    ],
  },
  {
    id: 'course-2',
    title: 'Building Your MVP',
    description: 'Master the art of building a minimum viable product. Learn to plan, build, and launch something users actually want.',
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800',
    videoIds: ['m2-v1', 'm2-v2', 'm2-v3', 'm2-v4'],
    topic: 'Product',
    iconEmoji: '🔨',
    color: '#60A5FA',
    order: 2,
    hasModularCurriculum: true,
    modules: [
      {
        id: 'course-2-module-1',
        title: 'Planning Your MVP',
        description: 'Learn how to plan an MVP that solves a real problem with minimal features.',
        order: 1,
        videoIds: ['m2-v1'],
        keyTermIds: ['term-mvp'],
      },
      {
        id: 'course-2-module-2',
        title: 'Building & Launching',
        description: 'Master the process of building quickly and getting your MVP in front of users.',
        order: 2,
        videoIds: ['m2-v2', 'm2-v3'],
        keyTermIds: ['term-mvp', 'term-pmf'],
      },
      {
        id: 'course-2-module-3',
        title: 'Making Something People Want',
        description: 'Understand what it takes to build products users truly love.',
        order: 3,
        videoIds: ['m2-v4'],
        quizId: 'quiz-mvp',
        keyTermIds: ['term-pmf'],
      },
    ],
  },
  {
    id: 'course-3',
    title: 'Finding Product-Market Fit',
    description: 'Understand how to find product-market fit, get your first customers, and learn from startup failures.',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800',
    videoIds: ['m3-v1', 'm3-v2', 'm3-v3'],
    topic: 'Growth',
    iconEmoji: '🎯',
    color: '#34D399',
    order: 3,
    hasModularCurriculum: true,
    modules: [
      {
        id: 'course-3-module-1',
        title: 'Understanding PMF',
        description: 'Learn what product-market fit really means and how to recognize it.',
        order: 1,
        videoIds: ['m3-v1'],
        keyTermIds: ['term-pmf'],
      },
      {
        id: 'course-3-module-2',
        title: 'Getting First Customers',
        description: 'Strategies for acquiring your first paying customers.',
        order: 2,
        videoIds: ['m3-v2'],
        keyTermIds: ['term-cac', 'term-ltv'],
      },
      {
        id: 'course-3-module-3',
        title: 'Learning from Failure',
        description: 'Understand common reasons startups fail and how to avoid them.',
        order: 3,
        videoIds: ['m3-v3'],
        quizId: 'quiz-pmf',
        keyTermIds: ['term-pmf', 'term-runway'],
      },
    ],
  },
  {
    id: 'course-4',
    title: 'Growth & Marketing',
    description: 'Learn how to grow your user base, market your startup, and set meaningful KPIs and goals.',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800',
    videoIds: ['m4-v1', 'm4-v2', 'm4-v3'],
    topic: 'Growth',
    iconEmoji: '📈',
    color: '#F97316',
    order: 4,
    hasModularCurriculum: true,
    modules: [
      {
        id: 'course-4-module-1',
        title: 'User Acquisition',
        description: 'Learn how to get users and grow your startup.',
        order: 1,
        videoIds: ['m4-v1'],
        keyTermIds: ['term-cac'],
      },
      {
        id: 'course-4-module-2',
        title: 'Marketing Strategies',
        description: 'Effective marketing tactics for early-stage startups.',
        order: 2,
        videoIds: ['m4-v2'],
        keyTermIds: ['term-cac', 'term-ltv'],
      },
      {
        id: 'course-4-module-3',
        title: 'KPIs & Goals',
        description: 'Set meaningful metrics and track your progress.',
        order: 3,
        videoIds: ['m4-v3'],
        quizId: 'quiz-growth',
        keyTermIds: ['term-ltv'],
      },
    ],
  },
  {
    id: 'course-5',
    title: 'Fundraising',
    description: 'Master the fundamentals of fundraising, from crafting your pitch to navigating co-founder equity.',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800',
    videoIds: ['m5-v1', 'm5-v2', 'm5-v3'],
    topic: 'Finance',
    iconEmoji: '💰',
    color: '#EC4899',
    order: 5,
    hasModularCurriculum: true,
    modules: [
      {
        id: 'course-5-module-1',
        title: 'Fundraising Fundamentals',
        description: 'Understand the basics of raising capital for your startup.',
        order: 1,
        videoIds: ['m5-v1'],
        keyTermIds: ['term-safe', 'term-valuation-cap', 'term-runway'],
      },
      {
        id: 'course-5-module-2',
        title: 'Perfecting Your Pitch',
        description: 'Learn how to craft and deliver a compelling pitch to investors.',
        order: 2,
        videoIds: ['m5-v2'],
        quizId: 'quiz-fundraising-pitch',
        keyTermIds: ['term-valuation-cap'],
      },
      {
        id: 'course-5-module-3',
        title: 'Equity & Co-Founders',
        description: 'Navigate the complexities of equity splits and co-founder relationships.',
        order: 3,
        videoIds: ['m5-v3'],
        quizId: 'quiz-fundraising',
        keyTermIds: ['term-vesting', 'term-c-corp'],
      },
    ],
  },
  {
    id: 'course-6',
    title: 'Scaling & Operations',
    description: 'Learn how to build and manage teams, hire effectively, and execute at scale.',
    coverImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800',
    videoIds: ['m6-v1', 'm6-v2', 'm6-v3'],
    topic: 'Operations',
    iconEmoji: '🚀',
    color: '#8B5CF6',
    order: 6,
    hasModularCurriculum: true,
    modules: [
      {
        id: 'course-6-module-1',
        title: 'Team & Execution',
        description: 'Build a high-performing team and execute with precision.',
        order: 1,
        videoIds: ['m6-v1'],
        keyTermIds: ['term-vesting'],
      },
      {
        id: 'course-6-module-2',
        title: 'Hiring Great People',
        description: 'Learn how to hire effectively for your startup.',
        order: 2,
        videoIds: ['m6-v2'],
        keyTermIds: ['term-vesting'],
      },
      {
        id: 'course-6-module-3',
        title: 'Ideas to Execution',
        description: 'Master the full cycle from idea to execution.',
        order: 3,
        videoIds: ['m6-v3'],
        quizId: 'quiz-scaling',
        keyTermIds: ['term-runway'],
      },
    ],
  },
  {
    id: 'course-7',
    title: 'Founder Mindset',
    description: 'Develop the mindset of successful founders. Leadership, resilience, and timeless wisdom from the greats.',
    coverImage: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=800',
    videoIds: ['m7-v1', 'm7-v2', 'm7-v3', 'm7-v4', 'm7-v5', 'm7-v6'],
    topic: 'Mindset',
    iconEmoji: '🧠',
    color: '#06B6D4',
    order: 7,
    hasModularCurriculum: true,
    modules: [
      {
        id: 'course-7-module-1',
        title: 'Start With Why',
        description: 'Understand the power of purpose and vision.',
        order: 1,
        videoIds: ['m7-v1', 'm7-v2'],
        keyTermIds: [],
      },
      {
        id: 'course-7-module-2',
        title: 'Wisdom from Legends',
        description: 'Learn from the greatest entrepreneurs of our time.',
        order: 2,
        videoIds: ['m7-v3', 'm7-v4'],
        keyTermIds: [],
      },
      {
        id: 'course-7-module-3',
        title: 'Resilience & Grit',
        description: 'Build mental toughness and founder resilience.',
        order: 3,
        videoIds: ['m7-v5', 'm7-v6'],
        quizId: 'quiz-mindset',
        keyTermIds: [],
      },
    ],
  },
  {
    id: 'course-8',
    title: 'Bootstrapping & Indie Hacking',
    description: 'Build profitable businesses without VC funding. Learn from indie hackers who built multi-million dollar solo businesses.',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800',
    videoIds: ['m8-v1', 'm8-v2', 'm8-v3'],
    topic: 'Bootstrapping',
    iconEmoji: '🛠️',
    color: '#10B981',
    order: 8,
    hasModularCurriculum: true,
    modules: [
      {
        id: 'course-8-module-1',
        title: 'The Indie Hacker Philosophy',
        description: 'Learn the mindset and approach of successful solo founders.',
        order: 1,
        videoIds: ['m8-v1'],
        keyTermIds: ['term-mvp', 'term-runway'],
      },
      {
        id: 'course-8-module-2',
        title: 'Minimalist Entrepreneurship',
        description: 'Build profitable businesses without venture capital.',
        order: 2,
        videoIds: ['m8-v2'],
        keyTermIds: ['term-ltv', 'term-cac'],
      },
      {
        id: 'course-8-module-3',
        title: 'Shipping Fast',
        description: 'Master the art of rapid iteration and shipping products quickly.',
        order: 3,
        videoIds: ['m8-v3'],
        quizId: 'quiz-bootstrapping',
        keyTermIds: ['term-mvp', 'term-pmf'],
      },
    ],
  },
  {
    id: 'course-9',
    title: 'AI & Vibe Coding',
    description: 'Understand AI fundamentals and learn to build products faster with AI coding assistants like Claude and Cursor.',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800',
    videoIds: ['m9-v1', 'm9-v2', 'm9-v3'],
    topic: 'AI',
    iconEmoji: '🤖',
    color: '#8B5CF6',
    order: 9,
    hasModularCurriculum: true,
    modules: [
      {
        id: 'course-9-module-1',
        title: 'Intro to LLMs',
        description: 'Understand how large language models work.',
        order: 1,
        videoIds: ['m9-v1'],
        keyTermIds: ['term-llm'],
      },
      {
        id: 'course-9-module-2',
        title: 'Deep Dive into AI',
        description: 'Advanced concepts in AI and machine learning.',
        order: 2,
        videoIds: ['m9-v2'],
        keyTermIds: ['term-llm'],
      },
      {
        id: 'course-9-module-3',
        title: 'Building AI Products',
        description: 'Apply AI to build innovative products.',
        order: 3,
        videoIds: ['m9-v3'],
        keyTermIds: ['term-llm'],
      },
    ],
  },
  {
    id: 'course-10',
    title: 'Design for Founders',
    description: 'Essential design skills for non-designers. Create beautiful, functional products without a design team.',
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800',
    videoIds: ['m10-v1', 'm10-v2', 'm10-v3'],
    topic: 'Design',
    iconEmoji: '🎨',
    color: '#F472B6',
    order: 10,
    hasModularCurriculum: true,
    modules: [
      {
        id: 'course-10-module-1',
        title: 'Design Basics',
        description: 'Learn essential design principles for non-designers.',
        order: 1,
        videoIds: ['m10-v1'],
        keyTermIds: [],
      },
      {
        id: 'course-10-module-2',
        title: 'UI Fundamentals',
        description: 'Core UI design concepts and best practices.',
        order: 2,
        videoIds: ['m10-v2'],
        keyTermIds: [],
      },
      {
        id: 'course-10-module-3',
        title: 'Design Ethics',
        description: 'Build products with responsibility and intention.',
        order: 3,
        videoIds: ['m10-v3'],
        keyTermIds: [],
      },
    ],
  },
  {
    id: 'course-11',
    title: 'Product Management',
    description: 'Build empowered product teams. Learn discovery, strategy, and how to create products customers love.',
    coverImage: 'https://images.unsplash.com/photo-1531498860502-7c67cf02f657?q=80&w=800',
    videoIds: ['m11-v1', 'm11-v2', 'm11-v3'],
    topic: 'Product',
    iconEmoji: '📋',
    color: '#3B82F6',
    order: 11,
    hasModularCurriculum: true,
    modules: [
      {
        id: 'course-11-module-1',
        title: 'Empowered Teams',
        description: 'Build product teams that innovate and deliver.',
        order: 1,
        videoIds: ['m11-v1'],
        keyTermIds: [],
      },
      {
        id: 'course-11-module-2',
        title: 'Product Discovery',
        description: 'Master the art of discovering what to build.',
        order: 2,
        videoIds: ['m11-v2'],
        keyTermIds: ['term-pmf'],
      },
      {
        id: 'course-11-module-3',
        title: 'User Research',
        description: 'Learn how to talk to users effectively.',
        order: 3,
        videoIds: ['m11-v3'],
        keyTermIds: ['term-pmf'],
      },
    ],
  },
  {
    id: 'course-12',
    title: 'Hustle & Motivation',
    description: 'Entrepreneurship mindset from Gary Vee. Content strategy, patience, and building in public.',
    coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800',
    videoIds: ['m12-v1', 'm12-v2', 'm12-v3'],
    topic: 'Mindset',
    iconEmoji: '🔥',
    color: '#EF4444',
    order: 12,
    hasModularCurriculum: true,
    modules: [
      {
        id: 'course-12-module-1',
        title: 'Document, Dont Create',
        description: 'Learn the power of building in public.',
        order: 1,
        videoIds: ['m12-v1'],
        keyTermIds: [],
      },
      {
        id: 'course-12-module-2',
        title: 'Patience is Key',
        description: 'Understand the long game of entrepreneurship.',
        order: 2,
        videoIds: ['m12-v2'],
        keyTermIds: [],
      },
      {
        id: 'course-12-module-3',
        title: 'Confidence & Mindset',
        description: 'Build unshakeable confidence as a founder.',
        order: 3,
        videoIds: ['m12-v3'],
        keyTermIds: [],
      },
    ],
  },
  {
    id: 'course-13',
    title: 'Startup 101',
    description: 'The absolute basics of starting a startup. Perfect for first-time founders and those exploring entrepreneurship.',
    coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=800',
    videoIds: ['m13-v1', 'm13-v2', 'm13-v3'],
    topic: 'Basics',
    iconEmoji: '🎓',
    color: '#6366F1',
    order: 13,
    hasModularCurriculum: true,
    modules: [
      {
        id: 'course-13-module-1',
        title: 'Before You Start',
        description: 'Essential knowledge every aspiring founder needs before starting.',
        order: 1,
        videoIds: ['m13-v1'],
        keyTermIds: ['term-incorporation', 'term-c-corp'],
      },
      {
        id: 'course-13-module-2',
        title: 'Starting a Startup',
        description: 'The definitive guide to launching your startup journey.',
        order: 2,
        videoIds: ['m13-v2'],
        keyTermIds: ['term-mvp', 'term-pmf', 'term-vesting'],
      },
      {
        id: 'course-13-module-3',
        title: 'Startup Mechanics',
        description: 'Legal, financial, and operational foundations for your startup.',
        order: 3,
        videoIds: ['m13-v3'],
        quizId: 'quiz-startup101',
        keyTermIds: ['term-safe', 'term-valuation-cap', 'term-vesting'],
      },
    ],
  },
  {
    id: 'course-14',
    title: 'Sales & Business Development',
    description: 'Close deals and build partnerships. Learn to sell as a founder and grow through strategic relationships.',
    coverImage: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=800',
    videoIds: ['m14-v1', 'm14-v2', 'm14-v3'],
    topic: 'Sales',
    iconEmoji: '🤝',
    color: '#F59E0B',
    order: 14,
    hasModularCurriculum: true,
    modules: [
      {
        id: 'course-14-module-1',
        title: 'How to Sell',
        description: 'Master the fundamentals of startup sales.',
        order: 1,
        videoIds: ['m14-v1'],
        keyTermIds: ['term-cac', 'term-ltv'],
      },
      {
        id: 'course-14-module-2',
        title: 'Getting Meetings',
        description: 'Learn how to reach anyone and get meetings.',
        order: 2,
        videoIds: ['m14-v2'],
        keyTermIds: [],
      },
      {
        id: 'course-14-module-3',
        title: 'Building Relationships',
        description: 'Develop strategic business relationships.',
        order: 3,
        videoIds: ['m14-v3'],
        keyTermIds: [],
      },
    ],
  },
];

// Alias for profile page compatibility
export const LEARNING_MODULES = COURSES;

// ============================================
// GLOSSARY TERMS (for Resources section)
// ============================================
export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // Starting a Company
  {
    id: 'term-incorporation',
    term: 'Incorporation',
    definition: 'The legal process of forming a company as a separate entity.',
    fullExplanation: `Incorporation is the legal process of forming a corporation or company. When you incorporate, you create a separate legal entity that can own property, enter contracts, and be liable for its own debts.\n\n**Common incorporation types:**\n- **C-Corp**: Standard corporation, required for VC funding\n- **S-Corp**: Pass-through taxation, limited shareholders\n- **LLC**: Flexible structure, simpler to manage\n\n**Delaware Incorporation**: Most startups incorporate in Delaware due to its business-friendly laws and established legal precedent.`,
    category: 'starting_company',
    relatedTerms: ['term-c-corp', 'term-llc'],
    videoIds: [],
    examples: ['Stripe is incorporated in Delaware as a C-Corp'],
  },
  {
    id: 'term-c-corp',
    term: 'C-Corporation',
    definition: 'A standard corporation structure required for VC investment.',
    fullExplanation: `A C-Corporation (C-Corp) is the standard corporate structure for venture-backed startups. It allows for multiple classes of stock, unlimited shareholders, and is the required structure for most institutional investors.\n\n**Key characteristics:**\n- Double taxation (corporate and personal level)\n- Unlimited shareholders allowed\n- Multiple stock classes (common, preferred)\n- Required for institutional VC investment`,
    category: 'starting_company',
    relatedTerms: ['term-incorporation', 'term-preferred-stock'],
    videoIds: ['m5-v1'],
    examples: ['Apple, Google, and most YC companies are C-Corps'],
  },
  {
    id: 'term-vesting',
    term: 'Vesting',
    definition: 'The process by which founders and employees earn their equity over time.',
    fullExplanation: `Vesting is a mechanism that ensures founders and employees earn their equity over time, rather than receiving it all at once. This protects the company if someone leaves early.\n\n**Standard vesting terms:**\n- 4-year vesting period\n- 1-year cliff (no equity until year 1 complete)\n- Monthly vesting after the cliff\n- Acceleration clauses for acquisitions`,
    category: 'starting_company',
    relatedTerms: ['term-equity', 'term-cliff'],
    videoIds: ['m5-v3'],
    examples: ['If you have 4-year vesting with 1-year cliff, you get 25% after year 1'],
  },
  // Raising Money
  {
    id: 'term-safe',
    term: 'SAFE',
    definition: 'Simple Agreement for Future Equity - a popular early-stage investment instrument.',
    fullExplanation: `A SAFE (Simple Agreement for Future Equity) is an investment contract invented by Y Combinator. It allows startups to raise money without setting a valuation, converting to equity in a future priced round.\n\n**Key SAFE terms:**\n- **Valuation Cap**: Maximum valuation for conversion\n- **Discount**: Percentage discount on future round price\n- **Pro-rata Rights**: Right to maintain ownership percentage\n- **MFN**: Most Favored Nation clause`,
    category: 'raising_money',
    relatedTerms: ['term-valuation-cap', 'term-convertible-note'],
    videoIds: ['m5-v1'],
    examples: ['Raising $500K on a SAFE with $5M cap and 20% discount'],
  },
  {
    id: 'term-valuation-cap',
    term: 'Valuation Cap',
    definition: 'The maximum company valuation at which an investment will convert to equity.',
    fullExplanation: `A valuation cap sets the maximum price at which a SAFE or convertible note will convert to equity. It protects early investors by ensuring they get a good price even if the company's valuation increases significantly.`,
    category: 'raising_money',
    relatedTerms: ['term-safe', 'term-dilution'],
    videoIds: ['m5-v1'],
    examples: ['A $10M valuation cap means investors convert at $10M or the actual valuation, whichever is lower'],
  },
  {
    id: 'term-runway',
    term: 'Runway',
    definition: 'How long your startup can operate before running out of money.',
    fullExplanation: `Runway is the amount of time your startup can survive with its current cash and burn rate. It's crucial for planning fundraising and managing growth.\n\n**Runway Formula:**\nRunway (months) = Cash in Bank / Monthly Burn Rate\n\n**Guidelines:**\n- Always know your runway\n- Start fundraising with 6+ months runway\n- Aim for 18-24 months post-funding`,
    category: 'raising_money',
    relatedTerms: ['term-burn-rate'],
    videoIds: ['m5-v1'],
    examples: ['$500K in the bank with $50K monthly burn = 10 months runway'],
  },
  // Product
  {
    id: 'term-mvp',
    term: 'MVP',
    definition: 'Minimum Viable Product - the simplest version of a product that can be released.',
    fullExplanation: `An MVP (Minimum Viable Product) is the most basic version of your product that still delivers core value to users. The goal is to learn as quickly as possible with minimum investment.\n\n**MVP principles:**\n- Focus on one core value proposition\n- Build in weeks, not months\n- Learn from real users\n- Iterate based on feedback`,
    category: 'prototyping',
    relatedTerms: ['term-pmf', 'term-iteration'],
    videoIds: ['m2-v1', 'm2-v2', 'm2-v3'],
    examples: ['Dropbox\'s MVP was just a video showing the concept'],
  },
  {
    id: 'term-pmf',
    term: 'Product-Market Fit',
    definition: 'When a product satisfies strong market demand.',
    fullExplanation: `Product-market fit (PMF) is when your product meets a strong market need. Marc Andreessen describes it as "being in a good market with a product that can satisfy that market."\n\n**Signs of PMF:**\n- Organic word-of-mouth growth\n- High retention rates\n- Users would be "very disappointed" without you\n- Demand exceeds your capacity`,
    category: 'prototyping',
    relatedTerms: ['term-mvp', 'term-retention'],
    videoIds: ['m3-v1'],
    examples: ['When Slack launched, teams adopted it so fast they couldn\'t keep up with demand'],
  },
  // Growth
  {
    id: 'term-cac',
    term: 'CAC',
    definition: 'Customer Acquisition Cost - the cost to acquire a new customer.',
    fullExplanation: `CAC (Customer Acquisition Cost) is how much you spend on average to acquire a new customer. It's calculated by dividing total acquisition costs by the number of new customers.\n\n**CAC Formula:**\nCAC = Total Marketing & Sales Costs / Number of New Customers`,
    category: 'growth',
    relatedTerms: ['term-ltv', 'term-payback'],
    videoIds: ['m4-v3'],
    examples: ['If you spend $10K on marketing and get 100 customers, CAC = $100'],
  },
  {
    id: 'term-ltv',
    term: 'LTV',
    definition: 'Lifetime Value - the total revenue expected from a customer over their relationship.',
    fullExplanation: `LTV (Lifetime Value) is the total revenue you expect to earn from a customer over their entire relationship with your company.\n\n**LTV Formula:**\nLTV = Average Revenue Per User x Customer Lifetime\n\n**LTV:CAC Ratio:**\n- 3:1 or higher is healthy\n- Below 1:1 means you're losing money`,
    category: 'growth',
    relatedTerms: ['term-cac', 'term-churn'],
    videoIds: ['m4-v3'],
    examples: ['A $50/month subscription with 24-month average lifetime = $1,200 LTV'],
  },
  // AI
  {
    id: 'term-llm',
    term: 'LLM',
    definition: 'Large Language Model - AI models that understand and generate human language.',
    fullExplanation: `Large Language Models (LLMs) are AI systems trained on massive amounts of text data to understand and generate human language. They power tools like ChatGPT, Claude, and many AI applications.\n\n**Key concepts:**\n- **Training**: Learning from billions of text examples\n- **Fine-tuning**: Customizing for specific tasks\n- **Prompting**: Giving instructions to the model`,
    category: 'ai',
    relatedTerms: ['term-prompt-engineering'],
    videoIds: ['bonus-v1'],
    examples: ['GPT-4, Claude, and Llama are all examples of LLMs'],
  },
];

// ============================================
// VOD CATEGORIES (Pluto TV Style On Demand)
// ============================================
export interface VODCategory {
  id: string;
  name: string;
  icon: string;
  description?: string;
  filter: (video: Video) => boolean;
}

export const VOD_CATEGORIES: VODCategory[] = [
  {
    id: 'continue',
    name: 'Continue Watching',
    icon: '▶️',
    description: 'Pick up where you left off',
    filter: () => true, // Handled separately via watch history
  },
  {
    id: 'featured',
    name: 'Featured',
    icon: '⭐',
    description: 'Hand-picked videos for founders',
    filter: (v) => ['m1-v1', 'm2-v1', 'm3-v1', 'm5-v1', 'm7-v1', 'm6-v1'].includes(v.id),
  },
  {
    id: 'trending',
    name: 'Trending Now',
    icon: '🔥',
    description: 'Most watched this week',
    filter: (v) => v.tags.includes('y-combinator') || v.tags.includes('stanford'),
  },
  {
    id: 'yc',
    name: 'YC Content',
    icon: '🎓',
    description: 'Official Y Combinator content',
    filter: (v) => v.tags.includes('y-combinator'),
  },
  {
    id: 'fundraising',
    name: 'Fundraising',
    icon: '💰',
    description: 'Raise capital like a pro',
    filter: (v) => v.tags.includes('fundraising') || v.tags.includes('vc') || v.tags.includes('pitch') || v.tags.includes('equity'),
  },
  {
    id: 'product',
    name: 'Product & MVP',
    icon: '🔨',
    description: 'Build what users want',
    filter: (v) => v.tags.includes('mvp') || v.tags.includes('product') || v.tags.includes('pmf'),
  },
  {
    id: 'growth',
    name: 'Growth',
    icon: '📈',
    description: 'Scale your startup',
    filter: (v) => v.tags.includes('growth') || v.tags.includes('marketing') || v.tags.includes('users') || v.tags.includes('customers'),
  },
  {
    id: 'mindset',
    name: 'Mindset',
    icon: '🧠',
    description: 'Founder wisdom & inspiration',
    filter: (v) => v.tags.includes('mindset') || v.tags.includes('inspiration') || v.tags.includes('leadership') || v.tags.includes('vision'),
  },
  {
    id: 'tech',
    name: 'AI & Tech',
    icon: '🤖',
    description: 'Technology trends',
    filter: (v) => v.tags.includes('ai') || v.tags.includes('tech') || v.tags.includes('openai'),
  },
  {
    id: 'quickhits',
    name: 'Quick Hits',
    icon: '⚡',
    description: 'Under 5 minutes',
    filter: (v) => v.duration < 300,
  },
  {
    id: 'deepdives',
    name: 'Deep Dives',
    icon: '🎬',
    description: 'Long-form content 30+ min',
    filter: (v) => v.duration >= 1800,
  },
];

// ============================================
// LIVE TV CATEGORIES (Channel Groups)
// ============================================
export interface LiveTVCategory {
  id: string;
  name: string;
  filter: (channel: FastChannel) => boolean;
}

export const LIVE_TV_CATEGORIES: LiveTVCategory[] = [
  {
    id: 'all',
    name: 'All Channels',
    filter: () => true,
  },
  {
    id: 'learning',
    name: 'Learning',
    filter: (ch) => ch.category === 'learning',
  },
  {
    id: 'inspiration',
    name: 'Inspiration',
    filter: (ch) => ch.category === 'inspiration',
  },
  {
    id: 'tech',
    name: 'Tech',
    filter: (ch) => ch.category === 'tech',
  },
];

// Helper to get all unique topics from videos
export const getTopics = (): string[] => {
  const topics = new Set<string>();
  INITIAL_VIDEOS.forEach(video => {
    video.tags.forEach(tag => topics.add(tag));
  });
  return Array.from(topics).sort();
};

// Helper to get all unique experts
export const getExperts = (): string[] => {
  const experts = new Set<string>();
  INITIAL_VIDEOS.forEach(video => {
    experts.add(video.expert);
  });
  return Array.from(experts).sort();
};

// Helper to format duration
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Helper to get total course duration
export const getCourseDuration = (course: Course): number => {
  return course.videoIds.reduce((total, videoId) => {
    const video = INITIAL_VIDEOS.find(v => v.id === videoId);
    return total + (video?.duration || 0);
  }, 0);
};

// === GAMIFICATION CONSTANTS ===

export const LEVEL_DEFINITIONS: LevelDefinition[] = [
  { level: 1, name: 'Dreamer', title: 'Aspiring Founder', minXP: 0, maxXP: 99, color: '#9CA3AF', icon: '💭' },
  { level: 2, name: 'Scout', title: 'Opportunity Hunter', minXP: 100, maxXP: 249, color: '#60A5FA', icon: '🔍' },
  { level: 3, name: 'Hustler', title: 'Side Project Mode', minXP: 250, maxXP: 499, color: '#34D399', icon: '💪' },
  { level: 4, name: 'Builder', title: 'Shipping Mode', minXP: 500, maxXP: 999, color: '#FBBF24', icon: '🔨' },
  { level: 5, name: 'Launcher', title: 'Ready for Liftoff', minXP: 1000, maxXP: 1999, color: '#F59E0B', icon: '🚀' },
  { level: 6, name: 'Founder', title: 'Making It Happen', minXP: 2000, maxXP: 3999, color: '#EC4899', icon: '👔' },
  { level: 7, name: 'Scaler', title: 'Growth Mode', minXP: 4000, maxXP: 7999, color: '#8B5CF6', icon: '📈' },
  { level: 8, name: 'Leader', title: 'Building Teams', minXP: 8000, maxXP: 14999, color: '#6366F1', icon: '👑' },
  { level: 9, name: 'Visionary', title: 'Seeing The Future', minXP: 15000, maxXP: 29999, color: '#F5C518', icon: '✨' },
  { level: 10, name: 'Legend', title: 'Founder Hall of Fame', minXP: 30000, maxXP: 999999, color: '#EF4444', icon: '🏆' },
];

export const ACHIEVEMENTS: Achievement[] = [
  // Learning Achievements
  {
    id: 'first-video',
    name: 'First Steps',
    description: 'Crush your first session',
    icon: '🎬',
    category: 'learning',
    xpReward: 25,
    condition: { type: 'first_video', value: 1 },
    rarity: 'common',
  },
  {
    id: 'video-marathon-5',
    name: 'On a Roll',
    description: 'Crush 5 sessions',
    icon: '📺',
    category: 'learning',
    xpReward: 50,
    condition: { type: 'videos_watched', value: 5 },
    rarity: 'common',
  },
  {
    id: 'video-marathon-25',
    name: 'Grind Master',
    description: 'Crush 25 sessions',
    icon: '🎥',
    category: 'learning',
    xpReward: 150,
    condition: { type: 'videos_watched', value: 25 },
    rarity: 'rare',
  },
  {
    id: 'video-marathon-100',
    name: 'Absolute Unit',
    description: 'Crush 100 sessions like a boss',
    icon: '🎓',
    category: 'learning',
    xpReward: 500,
    condition: { type: 'videos_watched', value: 100 },
    rarity: 'epic',
  },

  // Streak Achievements
  {
    id: 'streak-3',
    name: 'Building Momentum',
    description: 'Keep the grind going for 3 days',
    icon: '🔥',
    category: 'streak',
    xpReward: 30,
    condition: { type: 'streak_days', value: 3 },
    rarity: 'common',
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: '7 days of non-stop hustle',
    icon: '⚡',
    category: 'streak',
    xpReward: 75,
    condition: { type: 'streak_days', value: 7 },
    rarity: 'rare',
  },
  {
    id: 'streak-30',
    name: 'Monthly Grinder',
    description: '30 days of pure dedication',
    icon: '💫',
    category: 'streak',
    xpReward: 300,
    condition: { type: 'streak_days', value: 30 },
    rarity: 'epic',
  },
  {
    id: 'streak-100',
    name: 'Unstoppable',
    description: '100 days - you are built different',
    icon: '🌟',
    category: 'streak',
    xpReward: 1000,
    condition: { type: 'streak_days', value: 100 },
    rarity: 'legendary',
  },

  // Quiz Achievements
  {
    id: 'first-quiz',
    name: 'Challenge Accepted',
    description: 'Take on your first challenge',
    icon: '📝',
    category: 'quiz',
    xpReward: 20,
    condition: { type: 'first_quiz', value: 1 },
    rarity: 'common',
  },
  {
    id: 'perfect-quiz',
    name: 'Flawless Victory',
    description: 'Perfect score - you crushed it',
    icon: '💯',
    category: 'quiz',
    xpReward: 100,
    condition: { type: 'perfect_quiz', value: 1 },
    rarity: 'rare',
  },
  {
    id: 'quiz-master-10',
    name: 'Quiz Master',
    description: 'Pass 10 quizzes',
    icon: '🧠',
    category: 'quiz',
    xpReward: 200,
    condition: { type: 'quizzes_passed', value: 10 },
    rarity: 'epic',
  },

  // XP Milestones
  {
    id: 'xp-100',
    name: 'Centurion',
    description: 'Earn 100 XP',
    icon: '💎',
    category: 'milestone',
    xpReward: 25,
    condition: { type: 'xp_total', value: 100 },
    rarity: 'common',
  },
  {
    id: 'xp-1000',
    name: 'XP Collector',
    description: 'Earn 1,000 XP',
    icon: '💰',
    category: 'milestone',
    xpReward: 100,
    condition: { type: 'xp_total', value: 1000 },
    rarity: 'rare',
  },
  {
    id: 'xp-10000',
    name: 'XP Legend',
    description: 'Earn 10,000 XP',
    icon: '👑',
    category: 'milestone',
    xpReward: 500,
    condition: { type: 'xp_total', value: 10000 },
    rarity: 'legendary',
  },

  // Module Achievements
  {
    id: 'module-complete-1',
    name: 'Module Master',
    description: 'Complete your first module',
    icon: '📚',
    category: 'milestone',
    xpReward: 100,
    condition: { type: 'module_complete', value: 1 },
    rarity: 'rare',
  },
  {
    id: 'module-complete-5',
    name: 'Curriculum Champion',
    description: 'Complete 5 modules',
    icon: '🏅',
    category: 'milestone',
    xpReward: 300,
    condition: { type: 'module_complete', value: 5 },
    rarity: 'epic',
  },
];
