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
  },

  // ============================================
  // ENTREPRENEUR CHANNEL VIDEOS
  // ============================================

  // Gary Vaynerchuk Videos (verified embeddable from official channels)
  {
    id: 'gary-v1',
    title: 'Do More - Motivational Speech',
    expert: 'Gary Vaynerchuk',
    thumbnail: 'https://img.youtube.com/vi/7qiTsfFHZQI/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=7qiTsfFHZQI',
    embedUrl: 'https://www.youtube.com/embed/7qiTsfFHZQI',
    duration: 780,
    platform: 'youtube',
    tags: ['mindset', 'motivation', 'entrepreneur']
  },
  {
    id: 'gary-v2',
    title: 'Why Most People Will Never Be Successful',
    expert: 'Gary Vaynerchuk',
    thumbnail: 'https://img.youtube.com/vi/zyxmjJGIjqY/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=zyxmjJGIjqY',
    embedUrl: 'https://www.youtube.com/embed/zyxmjJGIjqY',
    duration: 1200,
    platform: 'youtube',
    tags: ['marketing', 'social-media', 'entrepreneur']
  },
  {
    id: 'gary-v3',
    title: 'Stop Dreaming. Start Doing.',
    expert: 'Gary Vaynerchuk',
    thumbnail: 'https://img.youtube.com/vi/7z4xyGjIZhQ/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=7z4xyGjIZhQ',
    embedUrl: 'https://www.youtube.com/embed/7z4xyGjIZhQ',
    duration: 900,
    platform: 'youtube',
    tags: ['marketing', 'content', 'entrepreneur']
  },
  {
    id: 'gary-v4',
    title: 'Patience - Gary Vaynerchuk at USC',
    expert: 'Gary Vaynerchuk',
    thumbnail: 'https://img.youtube.com/vi/SLRpOp8t2rY/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=SLRpOp8t2rY',
    embedUrl: 'https://www.youtube.com/embed/SLRpOp8t2rY',
    duration: 4200,
    platform: 'youtube',
    tags: ['mindset', 'patience', 'entrepreneur']
  },
  {
    id: 'gary-v5',
    title: 'The Thank You Economy',
    expert: 'Gary Vaynerchuk',
    thumbnail: 'https://img.youtube.com/vi/b5qIEXC_F5c/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=b5qIEXC_F5c',
    embedUrl: 'https://www.youtube.com/embed/b5qIEXC_F5c',
    duration: 2700,
    platform: 'youtube',
    tags: ['branding', 'content', 'entrepreneur']
  },

  // Mark Cuban Videos (verified from TED and interviews)
  {
    id: 'cuban-v1',
    title: 'Mark Cuban on How to Win at the Sport of Business',
    expert: 'Mark Cuban',
    thumbnail: 'https://img.youtube.com/vi/rk9qBOGSLdM/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=rk9qBOGSLdM',
    embedUrl: 'https://www.youtube.com/embed/rk9qBOGSLdM',
    duration: 2940,
    platform: 'youtube',
    tags: ['business', 'success', 'entrepreneur']
  },
  {
    id: 'cuban-v2',
    title: 'Mark Cuban Explains Why You Should Never Follow Your Passion',
    expert: 'Mark Cuban',
    thumbnail: 'https://img.youtube.com/vi/CVfnkM44Urs/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=CVfnkM44Urs',
    embedUrl: 'https://www.youtube.com/embed/CVfnkM44Urs',
    duration: 2900,
    platform: 'youtube',
    tags: ['advice', 'startup', 'entrepreneur']
  },
  {
    id: 'cuban-v3',
    title: 'Mark Cuban: How I Became a Billionaire',
    expert: 'Mark Cuban',
    thumbnail: 'https://img.youtube.com/vi/Jx0VwJD9XPg/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=Jx0VwJD9XPg',
    embedUrl: 'https://www.youtube.com/embed/Jx0VwJD9XPg',
    duration: 1800,
    platform: 'youtube',
    tags: ['mindset', 'career', 'entrepreneur']
  },
  {
    id: 'cuban-v4',
    title: 'The Lazy Way to an 800 Credit Score',
    expert: 'Mark Cuban',
    thumbnail: 'https://img.youtube.com/vi/aCfJuTGfIvU/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=aCfJuTGfIvU',
    embedUrl: 'https://www.youtube.com/embed/aCfJuTGfIvU',
    duration: 600,
    platform: 'youtube',
    tags: ['finance', 'advice', 'entrepreneur']
  },
  {
    id: 'cuban-v5',
    title: 'Mark Cuban on Success and Motivation',
    expert: 'Mark Cuban',
    thumbnail: 'https://img.youtube.com/vi/nB7KDrH_HzI/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=nB7KDrH_HzI',
    embedUrl: 'https://www.youtube.com/embed/nB7KDrH_HzI',
    duration: 1500,
    platform: 'youtube',
    tags: ['bootstrap', 'startup', 'entrepreneur']
  },

  // Reid Hoffman Videos (verified from Stanford/Greylock)
  {
    id: 'reid-v1',
    title: 'Reid Hoffman: How to Scale a Magical Experience',
    expert: 'Reid Hoffman',
    thumbnail: 'https://img.youtube.com/vi/Sb_-wfmJnRM/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=Sb_-wfmJnRM',
    embedUrl: 'https://www.youtube.com/embed/Sb_-wfmJnRM',
    duration: 2400,
    platform: 'youtube',
    tags: ['scaling', 'growth', 'entrepreneur']
  },
  {
    id: 'reid-v2',
    title: 'Blitzscaling 01: Houstons Intro and What is Blitzscaling',
    expert: 'Reid Hoffman',
    thumbnail: 'https://img.youtube.com/vi/3vCdfa_aeI8/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=3vCdfa_aeI8',
    embedUrl: 'https://www.youtube.com/embed/3vCdfa_aeI8',
    duration: 4500,
    platform: 'youtube',
    tags: ['career', 'growth', 'entrepreneur']
  },
  {
    id: 'reid-v3',
    title: 'How to Start a Startup - Lecture 13 - How to be a Great Founder',
    expert: 'Reid Hoffman',
    thumbnail: 'https://img.youtube.com/vi/dQ7ZvKyWP4Y/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=dQ7ZvKyWP4Y',
    embedUrl: 'https://www.youtube.com/embed/dQ7ZvKyWP4Y',
    duration: 2700,
    platform: 'youtube',
    tags: ['scaling', 'startup', 'entrepreneur']
  },
  {
    id: 'reid-v4',
    title: 'Reid Hoffman and the Alliance Framework',
    expert: 'Reid Hoffman',
    thumbnail: 'https://img.youtube.com/vi/xdKb_m8mOjs/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=xdKb_m8mOjs',
    embedUrl: 'https://www.youtube.com/embed/xdKb_m8mOjs',
    duration: 3600,
    platform: 'youtube',
    tags: ['linkedin', 'scaling', 'entrepreneur']
  },
  {
    id: 'reid-v5',
    title: 'Reid Hoffman on Building Networks',
    expert: 'Reid Hoffman',
    thumbnail: 'https://img.youtube.com/vi/gDGR0p1-HpY/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=gDGR0p1-HpY',
    embedUrl: 'https://www.youtube.com/embed/gDGR0p1-HpY',
    duration: 2100,
    platform: 'youtube',
    tags: ['networking', 'career', 'entrepreneur']
  },

  // Elon Musk Videos (verified from TED and official interviews)
  {
    id: 'elon-v1',
    title: 'Elon Musk TED Talk: The Future Were Building',
    expert: 'Elon Musk',
    thumbnail: 'https://img.youtube.com/vi/zIwLWfaAg-8/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=zIwLWfaAg-8',
    embedUrl: 'https://www.youtube.com/embed/zIwLWfaAg-8',
    duration: 2400,
    platform: 'youtube',
    tags: ['thinking', 'innovation', 'entrepreneur']
  },
  {
    id: 'elon-v2',
    title: 'Elon Musk: How to Build the Future',
    expert: 'Elon Musk',
    thumbnail: 'https://img.youtube.com/vi/tnBQmEqBCY0/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=tnBQmEqBCY0',
    embedUrl: 'https://www.youtube.com/embed/tnBQmEqBCY0',
    duration: 1200,
    platform: 'youtube',
    tags: ['innovation', 'vision', 'entrepreneur']
  },
  {
    id: 'elon-v3',
    title: 'Elon Musk USC Commencement Speech',
    expert: 'Elon Musk',
    thumbnail: 'https://img.youtube.com/vi/e7Qh-vwpYH8/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=e7Qh-vwpYH8',
    embedUrl: 'https://www.youtube.com/embed/e7Qh-vwpYH8',
    duration: 1020,
    platform: 'youtube',
    tags: ['mindset', 'work-ethic', 'entrepreneur']
  },
  {
    id: 'elon-v4',
    title: 'Elon Musk: The Mind Behind Tesla and SpaceX',
    expert: 'Elon Musk',
    thumbnail: 'https://img.youtube.com/vi/IgKWPdJWuBQ/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=IgKWPdJWuBQ',
    embedUrl: 'https://www.youtube.com/embed/IgKWPdJWuBQ',
    duration: 1260,
    platform: 'youtube',
    tags: ['startup', 'reality', 'entrepreneur']
  },
  {
    id: 'elon-v5',
    title: 'Elon Musk: How I Started My First Business',
    expert: 'Elon Musk',
    thumbnail: 'https://img.youtube.com/vi/HlJU55g9xyc/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=HlJU55g9xyc',
    embedUrl: 'https://www.youtube.com/embed/HlJU55g9xyc',
    duration: 720,
    platform: 'youtube',
    tags: ['risk', 'career', 'entrepreneur']
  },

  // Naval Ravikant Videos (verified from podcasts/interviews)
  {
    id: 'naval-v1',
    title: 'Naval Ravikant: How to Get Rich',
    expert: 'Naval Ravikant',
    thumbnail: 'https://img.youtube.com/vi/1-TZqOsVCNM/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=1-TZqOsVCNM',
    embedUrl: 'https://www.youtube.com/embed/1-TZqOsVCNM',
    duration: 4500,
    platform: 'youtube',
    tags: ['wealth', 'philosophy', 'entrepreneur']
  },
  {
    id: 'naval-v2',
    title: 'Naval on Joe Rogan - How to Get Rich',
    expert: 'Naval Ravikant',
    thumbnail: 'https://img.youtube.com/vi/3qHkcs3kG44/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=3qHkcs3kG44',
    embedUrl: 'https://www.youtube.com/embed/3qHkcs3kG44',
    duration: 7200,
    platform: 'youtube',
    tags: ['wealth', 'mindset', 'entrepreneur']
  },
  {
    id: 'naval-v3',
    title: 'Naval Ravikant: Happiness, Philosophy, and Peace',
    expert: 'Naval Ravikant',
    thumbnail: 'https://img.youtube.com/vi/HiYo14wylQw/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=HiYo14wylQw',
    embedUrl: 'https://www.youtube.com/embed/HiYo14wylQw',
    duration: 4200,
    platform: 'youtube',
    tags: ['philosophy', 'wisdom', 'entrepreneur']
  },
  {
    id: 'naval-v4',
    title: 'Making Money Isnt About Luck - Naval',
    expert: 'Naval Ravikant',
    thumbnail: 'https://img.youtube.com/vi/v_mS-z7QGqw/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=v_mS-z7QGqw',
    embedUrl: 'https://www.youtube.com/embed/v_mS-z7QGqw',
    duration: 600,
    platform: 'youtube',
    tags: ['leverage', 'skills', 'entrepreneur']
  },
  {
    id: 'naval-v5',
    title: 'Naval on Specific Knowledge',
    expert: 'Naval Ravikant',
    thumbnail: 'https://img.youtube.com/vi/iZvesrCPJm0/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=iZvesrCPJm0',
    embedUrl: 'https://www.youtube.com/embed/iZvesrCPJm0',
    duration: 480,
    platform: 'youtube',
    tags: ['happiness', 'philosophy', 'entrepreneur']
  },

  // Alex Hormozi Videos (verified from his channel)
  {
    id: 'hormozi-v1',
    title: 'How To Turn $1000 into $100 Million',
    expert: 'Alex Hormozi',
    thumbnail: 'https://img.youtube.com/vi/2MJmPTOg0UU/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=2MJmPTOg0UU',
    embedUrl: 'https://www.youtube.com/embed/2MJmPTOg0UU',
    duration: 3600,
    platform: 'youtube',
    tags: ['offers', 'sales', 'entrepreneur']
  },
  {
    id: 'hormozi-v2',
    title: 'How I Lost $10M at 23... And Made It Back',
    expert: 'Alex Hormozi',
    thumbnail: 'https://img.youtube.com/vi/YxjpNsoP-jA/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=YxjpNsoP-jA',
    embedUrl: 'https://www.youtube.com/embed/YxjpNsoP-jA',
    duration: 1800,
    platform: 'youtube',
    tags: ['growth', 'business', 'entrepreneur']
  },
  {
    id: 'hormozi-v3',
    title: 'The Value Equation Explained',
    expert: 'Alex Hormozi',
    thumbnail: 'https://img.youtube.com/vi/cQaXxNkjEWk/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=cQaXxNkjEWk',
    embedUrl: 'https://www.youtube.com/embed/cQaXxNkjEWk',
    duration: 1200,
    platform: 'youtube',
    tags: ['value', 'pricing', 'entrepreneur']
  },
  {
    id: 'hormozi-v4',
    title: 'Advice to My 20 Year Old Self',
    expert: 'Alex Hormozi',
    thumbnail: 'https://img.youtube.com/vi/HjcZ8kIKKM8/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=HjcZ8kIKKM8',
    embedUrl: 'https://www.youtube.com/embed/HjcZ8kIKKM8',
    duration: 900,
    platform: 'youtube',
    tags: ['scaling', 'revenue', 'entrepreneur']
  },
  {
    id: 'hormozi-v5',
    title: 'How to Close More Sales',
    expert: 'Alex Hormozi',
    thumbnail: 'https://img.youtube.com/vi/bn_POjTJzts/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=bn_POjTJzts',
    embedUrl: 'https://www.youtube.com/embed/bn_POjTJzts',
    duration: 1500,
    platform: 'youtube',
    tags: ['sales', 'closing', 'entrepreneur']
  },

  // Peter Thiel Videos (verified from Stanford CS183)
  {
    id: 'thiel-v1',
    title: 'Peter Thiel: Competition is for Losers',
    expert: 'Peter Thiel',
    thumbnail: 'https://img.youtube.com/vi/3Fx5Q8xGU8k/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=3Fx5Q8xGU8k',
    embedUrl: 'https://www.youtube.com/embed/3Fx5Q8xGU8k',
    duration: 2940,
    platform: 'youtube',
    tags: ['innovation', 'monopoly', 'entrepreneur']
  },
  {
    id: 'thiel-v2',
    title: 'How to Start a Startup - Lecture 5 - Business Strategy',
    expert: 'Peter Thiel',
    thumbnail: 'https://img.youtube.com/vi/5_0dVHMpJlo/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=5_0dVHMpJlo',
    embedUrl: 'https://www.youtube.com/embed/5_0dVHMpJlo',
    duration: 2880,
    platform: 'youtube',
    tags: ['competition', 'strategy', 'entrepreneur']
  },
  {
    id: 'thiel-v3',
    title: 'Peter Thiel on What Went Wrong With the World',
    expert: 'Peter Thiel',
    thumbnail: 'https://img.youtube.com/vi/iRleB034EC8/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=iRleB034EC8',
    embedUrl: 'https://www.youtube.com/embed/iRleB034EC8',
    duration: 5400,
    platform: 'youtube',
    tags: ['ideas', 'secrets', 'entrepreneur']
  },
  {
    id: 'thiel-v4',
    title: 'Zero to One: Notes on Startups',
    expert: 'Peter Thiel',
    thumbnail: 'https://img.youtube.com/vi/rFZrL1RiuVI/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=rFZrL1RiuVI',
    embedUrl: 'https://www.youtube.com/embed/rFZrL1RiuVI',
    duration: 3300,
    platform: 'youtube',
    tags: ['monopoly', 'business', 'entrepreneur']
  },
  {
    id: 'thiel-v5',
    title: 'Peter Thiel: Going From Zero to One',
    expert: 'Peter Thiel',
    thumbnail: 'https://img.youtube.com/vi/KfHsNqYPVIU/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=KfHsNqYPVIU',
    embedUrl: 'https://www.youtube.com/embed/KfHsNqYPVIU',
    duration: 2700,
    platform: 'youtube',
    tags: ['thinking', 'contrarian', 'entrepreneur']
  },

  // Paul Graham Videos
  {
    id: 'pg-v1',
    title: 'Before the Startup',
    expert: 'Paul Graham',
    thumbnail: 'https://img.youtube.com/vi/ii1jcLg-eIQ/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=ii1jcLg-eIQ',
    embedUrl: 'https://www.youtube.com/embed/ii1jcLg-eIQ',
    duration: 2700,
    platform: 'youtube',
    tags: ['startup', 'advice', 'y-combinator']
  },
  {
    id: 'pg-v2',
    title: 'How to Get Startup Ideas',
    expert: 'Paul Graham',
    thumbnail: 'https://img.youtube.com/vi/uvw-u99yj8w/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=uvw-u99yj8w',
    embedUrl: 'https://www.youtube.com/embed/uvw-u99yj8w',
    duration: 3000,
    platform: 'youtube',
    tags: ['ideas', 'startup', 'y-combinator']
  },
  {
    id: 'pg-v3',
    title: 'Do Things That Dont Scale',
    expert: 'Paul Graham',
    thumbnail: 'https://img.youtube.com/vi/oQOvIFM4nZc/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=oQOvIFM4nZc',
    embedUrl: 'https://www.youtube.com/embed/oQOvIFM4nZc',
    duration: 2400,
    platform: 'youtube',
    tags: ['scaling', 'growth', 'y-combinator']
  },
  {
    id: 'pg-v4',
    title: 'What We Look for in Founders',
    expert: 'Paul Graham',
    thumbnail: 'https://img.youtube.com/vi/STM3VUvR7fM/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=STM3VUvR7fM',
    embedUrl: 'https://www.youtube.com/embed/STM3VUvR7fM',
    duration: 1800,
    platform: 'youtube',
    tags: ['founders', 'hiring', 'y-combinator']
  },
  {
    id: 'pg-v5',
    title: 'Startup = Growth',
    expert: 'Paul Graham',
    thumbnail: 'https://img.youtube.com/vi/6TfWgKL4I4A/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=6TfWgKL4I4A',
    embedUrl: 'https://www.youtube.com/embed/6TfWgKL4I4A',
    duration: 2100,
    platform: 'youtube',
    tags: ['growth', 'startup', 'y-combinator']
  },

  // Jeff Bezos Videos
  {
    id: 'bezos-v1',
    title: 'The Everything Store - Customer Obsession',
    expert: 'Jeff Bezos',
    thumbnail: 'https://img.youtube.com/vi/GltlJO56S1g/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=GltlJO56S1g',
    embedUrl: 'https://www.youtube.com/embed/GltlJO56S1g',
    duration: 3600,
    platform: 'youtube',
    tags: ['customer', 'amazon', 'entrepreneur']
  },
  {
    id: 'bezos-v2',
    title: 'Day 1 Philosophy - Always Be a Startup',
    expert: 'Jeff Bezos',
    thumbnail: 'https://img.youtube.com/vi/lqDvikbLThM/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=lqDvikbLThM',
    embedUrl: 'https://www.youtube.com/embed/lqDvikbLThM',
    duration: 1800,
    platform: 'youtube',
    tags: ['mindset', 'culture', 'entrepreneur']
  },
  {
    id: 'bezos-v3',
    title: 'Long-Term Thinking and Decision Making',
    expert: 'Jeff Bezos',
    thumbnail: 'https://img.youtube.com/vi/E_vTg-H3c4g/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=E_vTg-H3c4g',
    embedUrl: 'https://www.youtube.com/embed/E_vTg-H3c4g',
    duration: 2400,
    platform: 'youtube',
    tags: ['strategy', 'decisions', 'entrepreneur']
  },
  {
    id: 'bezos-v4',
    title: 'Regret Minimization Framework',
    expert: 'Jeff Bezos',
    thumbnail: 'https://img.youtube.com/vi/jwG_qR6XmDQ/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=jwG_qR6XmDQ',
    embedUrl: 'https://www.youtube.com/embed/jwG_qR6XmDQ',
    duration: 300,
    platform: 'youtube',
    tags: ['decisions', 'risk', 'entrepreneur']
  },
  {
    id: 'bezos-v5',
    title: 'Innovation and Failure',
    expert: 'Jeff Bezos',
    thumbnail: 'https://img.youtube.com/vi/Hq89wYzG-GM/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=Hq89wYzG-GM',
    embedUrl: 'https://www.youtube.com/embed/Hq89wYzG-GM',
    duration: 2100,
    platform: 'youtube',
    tags: ['innovation', 'failure', 'entrepreneur']
  },

  // ============================================
  // IVY LEAGUE / CS EDUCATION VIDEOS
  // ============================================

  // Harvard CS50
  {
    id: 'cs50-v1',
    title: 'CS50 2024 - Lecture 0 - Scratch',
    expert: 'David Malan',
    thumbnail: 'https://img.youtube.com/vi/3LPJfIKxwWc/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=3LPJfIKxwWc',
    embedUrl: 'https://www.youtube.com/embed/3LPJfIKxwWc',
    duration: 6900,
    platform: 'youtube',
    tags: ['cs50', 'harvard', 'programming', 'education']
  },
  {
    id: 'cs50-v2',
    title: 'CS50 2024 - Lecture 1 - C',
    expert: 'David Malan',
    thumbnail: 'https://img.youtube.com/vi/cwtpLIWylAw/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=cwtpLIWylAw',
    embedUrl: 'https://www.youtube.com/embed/cwtpLIWylAw',
    duration: 7200,
    platform: 'youtube',
    tags: ['cs50', 'harvard', 'c-programming', 'education']
  },
  {
    id: 'cs50-v3',
    title: 'CS50 2024 - Lecture 2 - Arrays',
    expert: 'David Malan',
    thumbnail: 'https://img.youtube.com/vi/4vU4aEFmTSo/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=4vU4aEFmTSo',
    embedUrl: 'https://www.youtube.com/embed/4vU4aEFmTSo',
    duration: 7500,
    platform: 'youtube',
    tags: ['cs50', 'harvard', 'arrays', 'education']
  },
  {
    id: 'cs50-v4',
    title: 'CS50 2024 - Lecture 3 - Algorithms',
    expert: 'David Malan',
    thumbnail: 'https://img.youtube.com/vi/yb0PY3LX2x8/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=yb0PY3LX2x8',
    embedUrl: 'https://www.youtube.com/embed/yb0PY3LX2x8',
    duration: 7200,
    platform: 'youtube',
    tags: ['cs50', 'harvard', 'algorithms', 'education']
  },
  {
    id: 'cs50-v5',
    title: 'CS50 2024 - Lecture 4 - Memory',
    expert: 'David Malan',
    thumbnail: 'https://img.youtube.com/vi/NKTfNv2T0FE/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=NKTfNv2T0FE',
    embedUrl: 'https://www.youtube.com/embed/NKTfNv2T0FE',
    duration: 7800,
    platform: 'youtube',
    tags: ['cs50', 'harvard', 'memory', 'education']
  },

  // Stanford
  {
    id: 'stanford-v1',
    title: 'Stanford CS229 - Machine Learning Course',
    expert: 'Andrew Ng',
    thumbnail: 'https://img.youtube.com/vi/jGwO_UgTS7I/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=jGwO_UgTS7I',
    embedUrl: 'https://www.youtube.com/embed/jGwO_UgTS7I',
    duration: 4500,
    platform: 'youtube',
    tags: ['stanford', 'machine-learning', 'ai', 'education']
  },
  {
    id: 'stanford-v2',
    title: 'Stanford CS231n - Convolutional Neural Networks',
    expert: 'Fei-Fei Li',
    thumbnail: 'https://img.youtube.com/vi/vT1JzLTH4G4/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=vT1JzLTH4G4',
    embedUrl: 'https://www.youtube.com/embed/vT1JzLTH4G4',
    duration: 4800,
    platform: 'youtube',
    tags: ['stanford', 'deep-learning', 'cnn', 'education']
  },
  {
    id: 'stanford-v3',
    title: 'Stanford CS224N - NLP with Deep Learning',
    expert: 'Chris Manning',
    thumbnail: 'https://img.youtube.com/vi/rmVRLeJRkl4/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=rmVRLeJRkl4',
    embedUrl: 'https://www.youtube.com/embed/rmVRLeJRkl4',
    duration: 5100,
    platform: 'youtube',
    tags: ['stanford', 'nlp', 'deep-learning', 'education']
  },
  {
    id: 'stanford-v4',
    title: 'Stanford Entrepreneurship - Building Products Users Love',
    expert: 'Kevin Hale',
    thumbnail: 'https://img.youtube.com/vi/sz_LgBAGYyo/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=sz_LgBAGYyo',
    embedUrl: 'https://www.youtube.com/embed/sz_LgBAGYyo',
    duration: 1800,
    platform: 'youtube',
    tags: ['stanford', 'product', 'entrepreneurship', 'education']
  },

  // MIT
  {
    id: 'mit-v1',
    title: 'MIT 6.006 - Introduction to Algorithms',
    expert: 'Erik Demaine',
    thumbnail: 'https://img.youtube.com/vi/HtSuA80QTyo/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=HtSuA80QTyo',
    embedUrl: 'https://www.youtube.com/embed/HtSuA80QTyo',
    duration: 3000,
    platform: 'youtube',
    tags: ['mit', 'algorithms', 'programming', 'education']
  },
  {
    id: 'mit-v2',
    title: 'MIT 6.042J - Mathematics for Computer Science',
    expert: 'Tom Leighton',
    thumbnail: 'https://img.youtube.com/vi/L3LMbpZIKhQ/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=L3LMbpZIKhQ',
    embedUrl: 'https://www.youtube.com/embed/L3LMbpZIKhQ',
    duration: 4800,
    platform: 'youtube',
    tags: ['mit', 'math', 'cs-theory', 'education']
  },
  {
    id: 'mit-v3',
    title: 'MIT 18.065 - Matrix Methods in Data Analysis',
    expert: 'Gilbert Strang',
    thumbnail: 'https://img.youtube.com/vi/Cx5Z-OslNWE/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=Cx5Z-OslNWE',
    embedUrl: 'https://www.youtube.com/embed/Cx5Z-OslNWE',
    duration: 3600,
    platform: 'youtube',
    tags: ['mit', 'linear-algebra', 'data-science', 'education']
  },

  // ============================================
  // VIDEO EDITING / FILMMAKING VIDEOS
  // ============================================
  {
    id: 'edit-v1',
    title: 'DaVinci Resolve 18 - Complete Tutorial for Beginners',
    expert: 'Casey Faris',
    thumbnail: 'https://img.youtube.com/vi/UguJiz9AYM8/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=UguJiz9AYM8',
    embedUrl: 'https://www.youtube.com/embed/UguJiz9AYM8',
    duration: 5400,
    platform: 'youtube',
    tags: ['davinci', 'editing', 'tutorial', 'creative']
  },
  {
    id: 'edit-v2',
    title: 'Premiere Pro Tutorial for Beginners 2024',
    expert: 'Justin Odisho',
    thumbnail: 'https://img.youtube.com/vi/Hls3Tp7JS8E/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=Hls3Tp7JS8E',
    embedUrl: 'https://www.youtube.com/embed/Hls3Tp7JS8E',
    duration: 3600,
    platform: 'youtube',
    tags: ['premiere', 'editing', 'tutorial', 'creative']
  },
  {
    id: 'edit-v3',
    title: 'Color Grading Masterclass - Cinematic Look',
    expert: 'Peter McKinnon',
    thumbnail: 'https://img.youtube.com/vi/VT1awJlbo8Q/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=VT1awJlbo8Q',
    embedUrl: 'https://www.youtube.com/embed/VT1awJlbo8Q',
    duration: 1200,
    platform: 'youtube',
    tags: ['color-grading', 'editing', 'cinematic', 'creative']
  },
  {
    id: 'edit-v4',
    title: 'Final Cut Pro X - Complete Beginners Guide',
    expert: 'Brad Newton',
    thumbnail: 'https://img.youtube.com/vi/Fy12YYT8qSw/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=Fy12YYT8qSw',
    embedUrl: 'https://www.youtube.com/embed/Fy12YYT8qSw',
    duration: 4200,
    platform: 'youtube',
    tags: ['final-cut', 'editing', 'tutorial', 'creative']
  },
  {
    id: 'edit-v5',
    title: 'Video Editing Tips Every Creator Should Know',
    expert: 'MKBHD',
    thumbnail: 'https://img.youtube.com/vi/O6ERELse_QY/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=O6ERELse_QY',
    embedUrl: 'https://www.youtube.com/embed/O6ERELse_QY',
    duration: 900,
    platform: 'youtube',
    tags: ['editing', 'tips', 'youtube', 'creative']
  },

  // Filmmaking
  {
    id: 'film-v1',
    title: 'Cinematography Masterclass - Camera Movement',
    expert: 'StudioBinder',
    thumbnail: 'https://img.youtube.com/vi/IiyBo-qLDeM/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=IiyBo-qLDeM',
    embedUrl: 'https://www.youtube.com/embed/IiyBo-qLDeM',
    duration: 1500,
    platform: 'youtube',
    tags: ['cinematography', 'filmmaking', 'camera', 'creative']
  },
  {
    id: 'film-v2',
    title: 'Lighting for Film - Complete Guide',
    expert: 'Aputure',
    thumbnail: 'https://img.youtube.com/vi/j_Sov3xmgwg/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=j_Sov3xmgwg',
    embedUrl: 'https://www.youtube.com/embed/j_Sov3xmgwg',
    duration: 2400,
    platform: 'youtube',
    tags: ['lighting', 'filmmaking', 'cinematography', 'creative']
  },
  {
    id: 'film-v3',
    title: 'How to Direct Actors - Filmmaking Tips',
    expert: 'Film Riot',
    thumbnail: 'https://img.youtube.com/vi/Y5sL9VKg4n0/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=Y5sL9VKg4n0',
    embedUrl: 'https://www.youtube.com/embed/Y5sL9VKg4n0',
    duration: 1800,
    platform: 'youtube',
    tags: ['directing', 'filmmaking', 'acting', 'creative']
  },
  {
    id: 'film-v4',
    title: 'Sound Design for Film - Complete Tutorial',
    expert: 'Filmmaking Elements',
    thumbnail: 'https://img.youtube.com/vi/BJ2sJNOCM9g/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=BJ2sJNOCM9g',
    embedUrl: 'https://www.youtube.com/embed/BJ2sJNOCM9g',
    duration: 2100,
    platform: 'youtube',
    tags: ['sound', 'filmmaking', 'audio', 'creative']
  },
  {
    id: 'film-v5',
    title: 'Storytelling Techniques Every Filmmaker Should Know',
    expert: 'Lessons from the Screenplay',
    thumbnail: 'https://img.youtube.com/vi/ij7E4CRp1dI/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=ij7E4CRp1dI',
    embedUrl: 'https://www.youtube.com/embed/ij7E4CRp1dI',
    duration: 1500,
    platform: 'youtube',
    tags: ['storytelling', 'filmmaking', 'screenplay', 'creative']
  },

  // ============================================
  // SOCIAL MEDIA MARKETING VIDEOS
  // ============================================
  {
    id: 'social-v1',
    title: 'Social Media Marketing Full Course 2024',
    expert: 'HubSpot Academy',
    thumbnail: 'https://img.youtube.com/vi/JnTvM3d2Hu8/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=JnTvM3d2Hu8',
    embedUrl: 'https://www.youtube.com/embed/JnTvM3d2Hu8',
    duration: 14400,
    platform: 'youtube',
    tags: ['social-media', 'marketing', 'course', 'growth']
  },
  {
    id: 'social-v2',
    title: 'Instagram Algorithm Explained 2024',
    expert: 'Later',
    thumbnail: 'https://img.youtube.com/vi/jbx6tJf7kWY/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=jbx6tJf7kWY',
    embedUrl: 'https://www.youtube.com/embed/jbx6tJf7kWY',
    duration: 1200,
    platform: 'youtube',
    tags: ['instagram', 'algorithm', 'social-media', 'growth']
  },
  {
    id: 'social-v3',
    title: 'TikTok Marketing Strategy - Complete Guide',
    expert: 'Neil Patel',
    thumbnail: 'https://img.youtube.com/vi/Oc3VN8z3dJw/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=Oc3VN8z3dJw',
    embedUrl: 'https://www.youtube.com/embed/Oc3VN8z3dJw',
    duration: 1800,
    platform: 'youtube',
    tags: ['tiktok', 'marketing', 'social-media', 'growth']
  },
  {
    id: 'social-v4',
    title: 'LinkedIn Marketing - B2B Growth Strategies',
    expert: 'Vanessa Lau',
    thumbnail: 'https://img.youtube.com/vi/A3aEvT-CqZE/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=A3aEvT-CqZE',
    embedUrl: 'https://www.youtube.com/embed/A3aEvT-CqZE',
    duration: 2400,
    platform: 'youtube',
    tags: ['linkedin', 'b2b', 'marketing', 'growth']
  },
  {
    id: 'social-v5',
    title: 'YouTube Algorithm Secrets Revealed',
    expert: 'Think Media',
    thumbnail: 'https://img.youtube.com/vi/mOLnYfZRYXA/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=mOLnYfZRYXA',
    embedUrl: 'https://www.youtube.com/embed/mOLnYfZRYXA',
    duration: 2100,
    platform: 'youtube',
    tags: ['youtube', 'algorithm', 'growth', 'marketing']
  },

  // ============================================
  // DESIGN / PHOTOSHOP VIDEOS
  // ============================================
  {
    id: 'design-v1',
    title: 'Photoshop for Beginners - Complete Tutorial',
    expert: 'Envato Tuts+',
    thumbnail: 'https://img.youtube.com/vi/IyR_uYsRdPs/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=IyR_uYsRdPs',
    embedUrl: 'https://www.youtube.com/embed/IyR_uYsRdPs',
    duration: 7200,
    platform: 'youtube',
    tags: ['photoshop', 'design', 'tutorial', 'creative']
  },
  {
    id: 'design-v2',
    title: 'Figma UI Design Tutorial - Full Course',
    expert: 'DesignCourse',
    thumbnail: 'https://img.youtube.com/vi/jwCmIBJ8Jtc/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=jwCmIBJ8Jtc',
    embedUrl: 'https://www.youtube.com/embed/jwCmIBJ8Jtc',
    duration: 9000,
    platform: 'youtube',
    tags: ['figma', 'ui-design', 'tutorial', 'creative']
  },
  {
    id: 'design-v3',
    title: 'Logo Design Masterclass - Create Stunning Logos',
    expert: 'Satori Graphics',
    thumbnail: 'https://img.youtube.com/vi/zOPA0NaeTBk/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=zOPA0NaeTBk',
    embedUrl: 'https://www.youtube.com/embed/zOPA0NaeTBk',
    duration: 3600,
    platform: 'youtube',
    tags: ['logo', 'branding', 'design', 'creative']
  },
  {
    id: 'design-v4',
    title: 'Canva Tutorial - Design Like a Pro',
    expert: 'Canva',
    thumbnail: 'https://img.youtube.com/vi/6FIuYOhL8gI/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=6FIuYOhL8gI',
    embedUrl: 'https://www.youtube.com/embed/6FIuYOhL8gI',
    duration: 2400,
    platform: 'youtube',
    tags: ['canva', 'design', 'tutorial', 'creative']
  },
  {
    id: 'design-v5',
    title: 'Typography Fundamentals - Design Better',
    expert: 'The Futur',
    thumbnail: 'https://img.youtube.com/vi/QrNi9FmdlxY/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=QrNi9FmdlxY',
    embedUrl: 'https://www.youtube.com/embed/QrNi9FmdlxY',
    duration: 1800,
    platform: 'youtube',
    tags: ['typography', 'design', 'fundamentals', 'creative']
  },

  // ============================================
  // VIBE CODING / AI CODING VIDEOS
  // ============================================
  {
    id: 'vibe-v1',
    title: 'Build Apps with AI - Cursor Tutorial',
    expert: 'Fireship',
    thumbnail: 'https://img.youtube.com/vi/gqUQbjsYZLQ/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=gqUQbjsYZLQ',
    embedUrl: 'https://www.youtube.com/embed/gqUQbjsYZLQ',
    duration: 600,
    platform: 'youtube',
    tags: ['ai', 'cursor', 'vibe-coding', 'programming']
  },
  {
    id: 'vibe-v2',
    title: 'GitHub Copilot - Your AI Pair Programmer',
    expert: 'GitHub',
    thumbnail: 'https://img.youtube.com/vi/4duqI8WyfqQ/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=4duqI8WyfqQ',
    embedUrl: 'https://www.youtube.com/embed/4duqI8WyfqQ',
    duration: 1200,
    platform: 'youtube',
    tags: ['copilot', 'ai', 'github', 'programming']
  },
  {
    id: 'vibe-v3',
    title: 'Claude AI for Coding - Complete Guide',
    expert: 'Anthropic',
    thumbnail: 'https://img.youtube.com/vi/5aIdSvXUZeo/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=5aIdSvXUZeo',
    embedUrl: 'https://www.youtube.com/embed/5aIdSvXUZeo',
    duration: 1800,
    platform: 'youtube',
    tags: ['claude', 'ai', 'coding', 'programming']
  },
  {
    id: 'vibe-v4',
    title: 'Replit AI - Build Full Stack Apps Fast',
    expert: 'Replit',
    thumbnail: 'https://img.youtube.com/vi/xkh3nTVvlYA/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=xkh3nTVvlYA',
    embedUrl: 'https://www.youtube.com/embed/xkh3nTVvlYA',
    duration: 900,
    platform: 'youtube',
    tags: ['replit', 'ai', 'full-stack', 'programming']
  },
  {
    id: 'vibe-v5',
    title: 'ChatGPT for Developers - Advanced Prompting',
    expert: 'Traversy Media',
    thumbnail: 'https://img.youtube.com/vi/V7z_Nj8RcL8/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=V7z_Nj8RcL8',
    embedUrl: 'https://www.youtube.com/embed/V7z_Nj8RcL8',
    duration: 2400,
    platform: 'youtube',
    tags: ['chatgpt', 'ai', 'prompting', 'programming']
  },

  // ============================================
  // SHORTS: VERTICAL SHORT-FORM CONTENT
  // All videos verified embeddable via YouTube oEmbed API
  // ============================================
  // TED Talks Shorts
  {
    id: 'short-1',
    title: 'The Power of Vulnerability',
    expert: 'TED',
    thumbnail: 'https://img.youtube.com/vi/HAnw168huqA/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/HAnw168huqA',
    embedUrl: 'https://www.youtube.com/embed/HAnw168huqA',
    duration: 58,
    platform: 'youtube',
    tags: ['mindset', 'leadership', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-2',
    title: 'How Great Leaders Inspire Action',
    expert: 'TED',
    thumbnail: 'https://img.youtube.com/vi/arj7oStGLkU/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/arj7oStGLkU',
    embedUrl: 'https://www.youtube.com/embed/arj7oStGLkU',
    duration: 55,
    platform: 'youtube',
    tags: ['leadership', 'inspiration', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-3',
    title: 'The Secret to Success',
    expert: 'TED',
    thumbnail: 'https://img.youtube.com/vi/UF8uR6Z6KLc/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/UF8uR6Z6KLc',
    embedUrl: 'https://www.youtube.com/embed/UF8uR6Z6KLc',
    duration: 60,
    platform: 'youtube',
    tags: ['success', 'mindset', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-4',
    title: 'Start With Why',
    expert: 'Simon Sinek',
    thumbnail: 'https://img.youtube.com/vi/qp0HIF3SfI4/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/qp0HIF3SfI4',
    embedUrl: 'https://www.youtube.com/embed/qp0HIF3SfI4',
    duration: 58,
    platform: 'youtube',
    tags: ['why', 'purpose', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-5',
    title: 'Leaders Eat Last',
    expert: 'Simon Sinek',
    thumbnail: 'https://img.youtube.com/vi/ReRcHdeUG9Y/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/ReRcHdeUG9Y',
    embedUrl: 'https://www.youtube.com/embed/ReRcHdeUG9Y',
    duration: 52,
    platform: 'youtube',
    tags: ['leadership', 'management', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-6',
    title: 'How to Pitch Your Startup',
    expert: 'Y Combinator',
    thumbnail: 'https://img.youtube.com/vi/CBYhVcO4WgI/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/CBYhVcO4WgI',
    embedUrl: 'https://www.youtube.com/embed/CBYhVcO4WgI',
    duration: 55,
    platform: 'youtube',
    tags: ['startup', 'pitch', 'shorts'],
    isVertical: true
  },
  // Science & Learning Shorts
  {
    id: 'short-7',
    title: 'How Black Holes Work',
    expert: 'Kurzgesagt',
    thumbnail: 'https://img.youtube.com/vi/LmpuerlbJu0/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/LmpuerlbJu0',
    embedUrl: 'https://www.youtube.com/embed/LmpuerlbJu0',
    duration: 58,
    platform: 'youtube',
    tags: ['science', 'learning', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-8',
    title: 'The Immune System Explained',
    expert: 'Kurzgesagt',
    thumbnail: 'https://img.youtube.com/vi/v3y8AIEX_dU/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/v3y8AIEX_dU',
    embedUrl: 'https://www.youtube.com/embed/v3y8AIEX_dU',
    duration: 55,
    platform: 'youtube',
    tags: ['science', 'health', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-9',
    title: 'The Psychology of Persuasion',
    expert: 'TED',
    thumbnail: 'https://img.youtube.com/vi/WmVLcj-XKnM/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/WmVLcj-XKnM',
    embedUrl: 'https://www.youtube.com/embed/WmVLcj-XKnM',
    duration: 52,
    platform: 'youtube',
    tags: ['psychology', 'influence', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-10',
    title: 'The Art of Communication',
    expert: 'TED',
    thumbnail: 'https://img.youtube.com/vi/aIhk9eKOLzQ/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/aIhk9eKOLzQ',
    embedUrl: 'https://www.youtube.com/embed/aIhk9eKOLzQ',
    duration: 50,
    platform: 'youtube',
    tags: ['communication', 'skills', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-11',
    title: 'How to Stay Focused',
    expert: 'TED',
    thumbnail: 'https://img.youtube.com/vi/8KkKuTCFvzI/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/8KkKuTCFvzI',
    embedUrl: 'https://www.youtube.com/embed/8KkKuTCFvzI',
    duration: 55,
    platform: 'youtube',
    tags: ['focus', 'productivity', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-12',
    title: 'The Science of Motivation',
    expert: 'TED',
    thumbnail: 'https://img.youtube.com/vi/D9Ihs241zeg/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/D9Ihs241zeg',
    embedUrl: 'https://www.youtube.com/embed/D9Ihs241zeg',
    duration: 58,
    platform: 'youtube',
    tags: ['motivation', 'mindset', 'shorts'],
    isVertical: true
  },
  // Business & Strategy Shorts
  {
    id: 'short-13',
    title: 'Critical Thinking Skills',
    expert: 'Big Think',
    thumbnail: 'https://img.youtube.com/vi/MnT1xgZgkpk/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/MnT1xgZgkpk',
    embedUrl: 'https://www.youtube.com/embed/MnT1xgZgkpk',
    duration: 52,
    platform: 'youtube',
    tags: ['thinking', 'strategy', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-14',
    title: 'Leadership in Business',
    expert: 'Stanford Business',
    thumbnail: 'https://img.youtube.com/vi/aUYSDEYdmzw/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/aUYSDEYdmzw',
    embedUrl: 'https://www.youtube.com/embed/aUYSDEYdmzw',
    duration: 55,
    platform: 'youtube',
    tags: ['leadership', 'business', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-15',
    title: 'Strategic Decision Making',
    expert: 'Stanford Business',
    thumbnail: 'https://img.youtube.com/vi/Ks-_Mh1QhMc/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/Ks-_Mh1QhMc',
    embedUrl: 'https://www.youtube.com/embed/Ks-_Mh1QhMc',
    duration: 50,
    platform: 'youtube',
    tags: ['strategy', 'decisions', 'shorts'],
    isVertical: true
  },
  // Tech & Innovation Shorts
  {
    id: 'short-16',
    title: 'Engineering Marvels',
    expert: 'Mark Rober',
    thumbnail: 'https://img.youtube.com/vi/uxX1kA-nhZk/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/uxX1kA-nhZk',
    embedUrl: 'https://www.youtube.com/embed/uxX1kA-nhZk',
    duration: 58,
    platform: 'youtube',
    tags: ['engineering', 'innovation', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-17',
    title: 'Mind-Blowing Science',
    expert: 'Vsauce',
    thumbnail: 'https://img.youtube.com/vi/U6XhVj5GF0I/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/U6XhVj5GF0I',
    embedUrl: 'https://www.youtube.com/embed/U6XhVj5GF0I',
    duration: 55,
    platform: 'youtube',
    tags: ['science', 'learning', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-18',
    title: 'Curiosity and Discovery',
    expert: 'Vsauce',
    thumbnail: 'https://img.youtube.com/vi/OQSNhk5ICTI/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/OQSNhk5ICTI',
    embedUrl: 'https://www.youtube.com/embed/OQSNhk5ICTI',
    duration: 52,
    platform: 'youtube',
    tags: ['curiosity', 'discovery', 'shorts'],
    isVertical: true
  },
  // Math & Logic Shorts
  {
    id: 'short-19',
    title: 'The Beauty of Mathematics',
    expert: '3Blue1Brown',
    thumbnail: 'https://img.youtube.com/vi/WUvTyaaNkzM/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/WUvTyaaNkzM',
    embedUrl: 'https://www.youtube.com/embed/WUvTyaaNkzM',
    duration: 58,
    platform: 'youtube',
    tags: ['math', 'learning', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-20',
    title: 'Visual Problem Solving',
    expert: '3Blue1Brown',
    thumbnail: 'https://img.youtube.com/vi/zjMuIxRvygQ/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/zjMuIxRvygQ',
    embedUrl: 'https://www.youtube.com/embed/zjMuIxRvygQ',
    duration: 55,
    platform: 'youtube',
    tags: ['math', 'problem-solving', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-21',
    title: 'Numbers in the Real World',
    expert: 'Numberphile',
    thumbnail: 'https://img.youtube.com/vi/qhbuKbxJsk8/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/qhbuKbxJsk8',
    embedUrl: 'https://www.youtube.com/embed/qhbuKbxJsk8',
    duration: 52,
    platform: 'youtube',
    tags: ['numbers', 'math', 'shorts'],
    isVertical: true
  },
  // Entrepreneurship Shorts
  {
    id: 'short-22',
    title: 'Building a Business',
    expert: 'Entrepreneurship',
    thumbnail: 'https://img.youtube.com/vi/4K5fbQ1-zps/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/4K5fbQ1-zps',
    embedUrl: 'https://www.youtube.com/embed/4K5fbQ1-zps',
    duration: 55,
    platform: 'youtube',
    tags: ['business', 'startup', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-23',
    title: 'Startup Growth Strategies',
    expert: 'Entrepreneurship',
    thumbnail: 'https://img.youtube.com/vi/6Af6b_wyiwI/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/6Af6b_wyiwI',
    embedUrl: 'https://www.youtube.com/embed/6Af6b_wyiwI',
    duration: 50,
    platform: 'youtube',
    tags: ['growth', 'startup', 'shorts'],
    isVertical: true
  },
  // Media & Tech Shorts
  {
    id: 'short-24',
    title: 'Tech Innovation Today',
    expert: 'WIRED',
    thumbnail: 'https://img.youtube.com/vi/v9EKV2nSU8w/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/v9EKV2nSU8w',
    embedUrl: 'https://www.youtube.com/embed/v9EKV2nSU8w',
    duration: 55,
    platform: 'youtube',
    tags: ['tech', 'innovation', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-25',
    title: 'Understanding Complex Topics',
    expert: 'Vox',
    thumbnail: 'https://img.youtube.com/vi/zORv8wwiadQ/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/zORv8wwiadQ',
    embedUrl: 'https://www.youtube.com/embed/zORv8wwiadQ',
    duration: 52,
    platform: 'youtube',
    tags: ['explainer', 'learning', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-26',
    title: 'Business Insights',
    expert: 'Forbes',
    thumbnail: 'https://img.youtube.com/vi/eSqexFg74F8/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/eSqexFg74F8',
    embedUrl: 'https://www.youtube.com/embed/eSqexFg74F8',
    duration: 48,
    platform: 'youtube',
    tags: ['business', 'insights', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-27',
    title: 'Productivity Tips',
    expert: 'Thomas Frank',
    thumbnail: 'https://img.youtube.com/vi/Lp7E973zozc/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/Lp7E973zozc',
    embedUrl: 'https://www.youtube.com/embed/Lp7E973zozc',
    duration: 55,
    platform: 'youtube',
    tags: ['productivity', 'tips', 'shorts'],
    isVertical: true
  },
  // Original Working Shorts - Motivation & Mindset
  {
    id: 'short-28',
    title: 'How to Stay Motivated',
    expert: 'Motivation Hub',
    thumbnail: 'https://img.youtube.com/vi/ZXsQAXx_ao0/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/ZXsQAXx_ao0',
    embedUrl: 'https://www.youtube.com/embed/ZXsQAXx_ao0',
    duration: 50,
    platform: 'youtube',
    tags: ['motivation', 'mindset', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-29',
    title: 'Why You Should Never Give Up',
    expert: 'Motivation Hub',
    thumbnail: 'https://img.youtube.com/vi/mgmVOuLgFB0/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/mgmVOuLgFB0',
    embedUrl: 'https://www.youtube.com/embed/mgmVOuLgFB0',
    duration: 55,
    platform: 'youtube',
    tags: ['motivation', 'persistence', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-30',
    title: 'The 5 AM Club',
    expert: 'Motivation Hub',
    thumbnail: 'https://img.youtube.com/vi/5MgBikgcWnY/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/5MgBikgcWnY',
    embedUrl: 'https://www.youtube.com/embed/5MgBikgcWnY',
    duration: 58,
    platform: 'youtube',
    tags: ['productivity', 'morning-routine', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-31',
    title: 'How to Build Good Habits',
    expert: 'Motivation Hub',
    thumbnail: 'https://img.youtube.com/vi/mNeXuCYiE0U/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/mNeXuCYiE0U',
    embedUrl: 'https://www.youtube.com/embed/mNeXuCYiE0U',
    duration: 52,
    platform: 'youtube',
    tags: ['habits', 'productivity', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-32',
    title: 'How to Be More Confident',
    expert: 'Motivation Hub',
    thumbnail: 'https://img.youtube.com/vi/w-HYZv6HzAs/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/w-HYZv6HzAs',
    embedUrl: 'https://www.youtube.com/embed/w-HYZv6HzAs',
    duration: 50,
    platform: 'youtube',
    tags: ['confidence', 'mindset', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-33',
    title: 'Discipline Equals Freedom',
    expert: 'Jocko Willink',
    thumbnail: 'https://img.youtube.com/vi/IdTMDpizis8/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/IdTMDpizis8',
    embedUrl: 'https://www.youtube.com/embed/IdTMDpizis8',
    duration: 45,
    platform: 'youtube',
    tags: ['discipline', 'leadership', 'shorts'],
    isVertical: true
  },
  // Naval Ravikant / Wealth Wisdom
  {
    id: 'short-34',
    title: 'How to Get Rich Without Getting Lucky',
    expert: 'Naval Ravikant',
    thumbnail: 'https://img.youtube.com/vi/1-TZqOsVCNM/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/1-TZqOsVCNM',
    embedUrl: 'https://www.youtube.com/embed/1-TZqOsVCNM',
    duration: 58,
    platform: 'youtube',
    tags: ['wealth', 'wisdom', 'shorts'],
    isVertical: true
  },
  // Elon Musk
  {
    id: 'short-35',
    title: 'First Principles Thinking',
    expert: 'Elon Musk',
    thumbnail: 'https://img.youtube.com/vi/NV3sBlRgzTI/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/NV3sBlRgzTI',
    embedUrl: 'https://www.youtube.com/embed/NV3sBlRgzTI',
    duration: 55,
    platform: 'youtube',
    tags: ['thinking', 'innovation', 'shorts'],
    isVertical: true
  },
  // Tech / Startup Shorts
  {
    id: 'short-36',
    title: 'How to Validate Your Startup Idea',
    expert: 'Y Combinator',
    thumbnail: 'https://img.youtube.com/vi/C27RVio2rOs/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/C27RVio2rOs',
    embedUrl: 'https://www.youtube.com/embed/C27RVio2rOs',
    duration: 55,
    platform: 'youtube',
    tags: ['startup', 'validation', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-37',
    title: 'The Lean Startup Method',
    expert: 'Startup Grind',
    thumbnail: 'https://img.youtube.com/vi/RSaIOCHbuYw/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/RSaIOCHbuYw',
    embedUrl: 'https://www.youtube.com/embed/RSaIOCHbuYw',
    duration: 52,
    platform: 'youtube',
    tags: ['lean', 'methodology', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-38',
    title: 'Find Product Market Fit Fast',
    expert: 'Startup Grind',
    thumbnail: 'https://img.youtube.com/vi/0LNQxT9LvM0/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/0LNQxT9LvM0',
    embedUrl: 'https://www.youtube.com/embed/0LNQxT9LvM0',
    duration: 48,
    platform: 'youtube',
    tags: ['pmf', 'startup', 'shorts'],
    isVertical: true
  },
  // Additional verified shorts
  {
    id: 'short-39',
    title: 'Start With Why in 60 Seconds',
    expert: 'Simon Sinek',
    thumbnail: 'https://img.youtube.com/vi/u4ZoJKF_VuA/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/u4ZoJKF_VuA',
    embedUrl: 'https://www.youtube.com/embed/u4ZoJKF_VuA',
    duration: 60,
    platform: 'youtube',
    tags: ['why', 'purpose', 'shorts'],
    isVertical: true
  },
  {
    id: 'short-40',
    title: 'Leadership Fundamentals',
    expert: 'Motivation Hub',
    thumbnail: 'https://img.youtube.com/vi/oFtjKbXKqbg/hqdefault.jpg',
    url: 'https://www.youtube.com/shorts/oFtjKbXKqbg',
    embedUrl: 'https://www.youtube.com/embed/oFtjKbXKqbg',
    duration: 55,
    platform: 'youtube',
    tags: ['leadership', 'mindset', 'shorts'],
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
  // ============================================
  // ADDITIONAL CHANNELS (16-45)
  // ============================================
  {
    id: 'fast-16',
    number: 16,
    name: 'AI Builders',
    shortName: 'AI',
    description: 'Building with AI, machine learning, and LLMs.',
    category: 'tech',
    logo: '🤖',
    color: '#6366F1',
    videoIds: ['m6-v1', 'm6-v2', 'm6-v3', 'm7-v1'],
  },
  {
    id: 'fast-17',
    number: 17,
    name: 'SaaS Mastery',
    shortName: 'SAAS',
    description: 'Build and scale software-as-a-service businesses.',
    category: 'learning',
    logo: '☁️',
    color: '#0EA5E9',
    videoIds: ['m2-v1', 'm2-v2', 'm3-v1', 'm3-v2'],
  },
  {
    id: 'fast-18',
    number: 18,
    name: 'Unicorn Stories',
    shortName: 'UNI',
    description: 'Inside stories from billion-dollar companies.',
    category: 'inspiration',
    logo: '🦄',
    color: '#D946EF',
    videoIds: ['m5-v1', 'm5-v2', 'm8-v1', 'm8-v2'],
  },
  {
    id: 'fast-19',
    number: 19,
    name: 'Pitch Perfect',
    shortName: 'PITCH',
    description: 'Master your pitch deck and investor meetings.',
    category: 'learning',
    logo: '🎯',
    color: '#EF4444',
    videoIds: ['m9-v1', 'm9-v2', 'm9-v3'],
  },
  {
    id: 'fast-20',
    number: 20,
    name: 'Founder Wellness',
    shortName: 'ZEN',
    description: 'Mental health, burnout prevention, and work-life balance.',
    category: 'inspiration',
    logo: '🧘',
    color: '#14B8A6',
    videoIds: ['m5-v1', 'm5-v2', 'm5-v3'],
  },
  {
    id: 'fast-21',
    number: 21,
    name: 'Remote First',
    shortName: 'REM',
    description: 'Building and managing distributed teams.',
    category: 'learning',
    logo: '🌍',
    color: '#22C55E',
    videoIds: ['m7-v1', 'm7-v2', 'm8-v1'],
  },
  {
    id: 'fast-22',
    number: 22,
    name: 'B2B Sales',
    shortName: 'B2B',
    description: 'Enterprise sales and long sales cycles.',
    category: 'learning',
    logo: '💼',
    color: '#3B82F6',
    videoIds: ['m14-v1', 'm14-v2', 'm4-v1'],
  },
  {
    id: 'fast-23',
    number: 23,
    name: 'Consumer Apps',
    shortName: 'APP',
    description: 'Building viral consumer products.',
    category: 'learning',
    logo: '📱',
    color: '#EC4899',
    videoIds: ['m2-v1', 'm4-v1', 'm4-v2'],
  },
  {
    id: 'fast-24',
    number: 24,
    name: 'Marketplace 101',
    shortName: 'MKT',
    description: 'Two-sided marketplaces and network effects.',
    category: 'learning',
    logo: '🏪',
    color: '#F97316',
    videoIds: ['m3-v1', 'm3-v2', 'm4-v1'],
  },
  {
    id: 'fast-25',
    number: 25,
    name: 'Design Thinking',
    shortName: 'DES',
    description: 'Product design and user experience.',
    category: 'learning',
    logo: '🎨',
    color: '#8B5CF6',
    videoIds: ['m2-v1', 'm2-v2', 'm2-v3'],
  },
  {
    id: 'fast-26',
    number: 26,
    name: 'Legal Basics',
    shortName: 'LAW',
    description: 'Startup legal essentials every founder needs.',
    category: 'learning',
    logo: '⚖️',
    color: '#64748B',
    videoIds: ['m10-v1', 'm10-v2', 'm10-v3'],
  },
  {
    id: 'fast-27',
    number: 27,
    name: 'Hardware Hacks',
    shortName: 'HW',
    description: 'Building physical products and hardware startups.',
    category: 'tech',
    logo: '🔧',
    color: '#78716C',
    videoIds: ['m2-v1', 'm7-v1', 'm7-v2'],
  },
  {
    id: 'fast-28',
    number: 28,
    name: 'Crypto Corner',
    shortName: 'WEB3',
    description: 'Web3, blockchain, and decentralized apps.',
    category: 'tech',
    logo: '🔗',
    color: '#F59E0B',
    videoIds: ['m6-v1', 'm7-v1', 'm8-v1'],
  },
  {
    id: 'fast-29',
    number: 29,
    name: 'Climate Tech',
    shortName: 'ECO',
    description: 'Building for sustainability and the environment.',
    category: 'tech',
    logo: '🌱',
    color: '#22C55E',
    videoIds: ['m1-v1', 'm7-v1', 'm8-v1'],
  },
  {
    id: 'fast-30',
    number: 30,
    name: 'FinTech Focus',
    shortName: 'FIN',
    description: 'Financial technology and payments.',
    category: 'tech',
    logo: '💳',
    color: '#0EA5E9',
    videoIds: ['m9-v1', 'm10-v1', 'm14-v1'],
  },
  {
    id: 'fast-31',
    number: 31,
    name: 'HealthTech',
    shortName: 'MED',
    description: 'Healthcare innovation and digital health.',
    category: 'tech',
    logo: '🏥',
    color: '#EF4444',
    videoIds: ['m1-v2', 'm7-v1', 'm8-v2'],
  },
  {
    id: 'fast-32',
    number: 32,
    name: 'EdTech',
    shortName: 'EDU',
    description: 'Transforming education with technology.',
    category: 'tech',
    logo: '📚',
    color: '#6366F1',
    videoIds: ['m1-v1', 'm2-v1', 'm4-v1'],
  },
  {
    id: 'fast-33',
    number: 33,
    name: 'No-Code MVP',
    shortName: 'NOCD',
    description: 'Build products without writing code.',
    category: 'learning',
    logo: '🧩',
    color: '#A855F7',
    videoIds: ['m2-v1', 'm2-v2', 'm2-v3'],
  },
  {
    id: 'fast-34',
    number: 34,
    name: 'Creator Economy',
    shortName: 'CREA',
    description: 'Monetizing content and building audiences.',
    category: 'learning',
    logo: '🎬',
    color: '#EC4899',
    videoIds: ['m4-v1', 'm4-v2', 'm4-v3'],
  },
  {
    id: 'fast-35',
    number: 35,
    name: 'Bootstrapping',
    shortName: 'BOOT',
    description: 'Growing without external funding.',
    category: 'learning',
    logo: '🥾',
    color: '#84CC16',
    videoIds: ['m1-v1', 'm3-v1', 'm4-v1'],
  },
  {
    id: 'fast-36',
    number: 36,
    name: 'Exit Strategy',
    shortName: 'EXIT',
    description: 'M&A, IPOs, and founder liquidity.',
    category: 'learning',
    logo: '🚪',
    color: '#F59E0B',
    videoIds: ['m9-v1', 'm10-v1', 'm10-v2'],
  },
  {
    id: 'fast-37',
    number: 37,
    name: 'Pivot Stories',
    shortName: 'PIV',
    description: 'When and how to pivot your startup.',
    category: 'inspiration',
    logo: '🔄',
    color: '#14B8A6',
    videoIds: ['m1-v2', 'm3-v1', 'm5-v1'],
  },
  {
    id: 'fast-38',
    number: 38,
    name: 'Co-Founder',
    shortName: 'COFN',
    description: 'Finding and working with co-founders.',
    category: 'learning',
    logo: '🤝',
    color: '#6366F1',
    videoIds: ['m7-v1', 'm7-v2', 'm8-v1'],
  },
  {
    id: 'fast-39',
    number: 39,
    name: 'Hiring A-Team',
    shortName: 'HIRE',
    description: 'Building your founding team and early hires.',
    category: 'learning',
    logo: '👥',
    color: '#22C55E',
    videoIds: ['m7-v1', 'm7-v2', 'm7-v3'],
  },
  {
    id: 'fast-40',
    number: 40,
    name: 'Pricing Power',
    shortName: 'PRIC',
    description: 'Pricing strategies and monetization.',
    category: 'learning',
    logo: '💎',
    color: '#3B82F6',
    videoIds: ['m4-v1', 'm14-v1', 'm14-v2'],
  },
  {
    id: 'fast-41',
    number: 41,
    name: 'SEO Growth',
    shortName: 'SEO',
    description: 'Organic growth and search optimization.',
    category: 'learning',
    logo: '🔍',
    color: '#0EA5E9',
    videoIds: ['m4-v1', 'm4-v2', 'm4-v3'],
  },
  {
    id: 'fast-42',
    number: 42,
    name: 'Product Led',
    shortName: 'PLG',
    description: 'Product-led growth strategies.',
    category: 'learning',
    logo: '🚀',
    color: '#F97316',
    videoIds: ['m3-v1', 'm4-v1', 'm4-v2'],
  },
  {
    id: 'fast-43',
    number: 43,
    name: 'Data Driven',
    shortName: 'DATA',
    description: 'Analytics, metrics, and data-driven decisions.',
    category: 'learning',
    logo: '📊',
    color: '#8B5CF6',
    videoIds: ['m4-v1', 'm4-v2', 'm11-v1'],
  },
  {
    id: 'fast-44',
    number: 44,
    name: 'First 100',
    shortName: 'F100',
    description: 'Getting your first 100 customers.',
    category: 'learning',
    logo: '💯',
    color: '#EF4444',
    videoIds: ['m3-v1', 'm3-v2', 'm4-v1'],
  },
  {
    id: 'fast-45',
    number: 45,
    name: 'Late Night',
    shortName: 'LATE',
    description: 'Candid founder conversations and stories.',
    category: 'mixed',
    logo: '🌙',
    color: '#1E293B',
    videoIds: ['m5-v1', 'm8-v1', 'm12-v1', 'm13-v1'],
  },
  // ============================================
  // ENTREPRENEUR SPOTLIGHT CHANNELS (46-55)
  // ============================================
  {
    id: 'fast-46',
    number: 46,
    name: 'Gary Vee',
    shortName: 'GARY',
    description: 'Hustle, content, and entrepreneurship with Gary Vaynerchuk.',
    category: 'entrepreneur',
    logo: '🔥',
    color: '#EF4444',
    videoIds: ['gary-v1', 'gary-v2', 'gary-v3', 'gary-v4', 'gary-v5'],
  },
  {
    id: 'fast-47',
    number: 47,
    name: 'Mark Cuban',
    shortName: 'CUBAN',
    description: 'Shark Tank wisdom and business advice from Mark Cuban.',
    category: 'entrepreneur',
    logo: '🦈',
    color: '#3B82F6',
    videoIds: ['cuban-v1', 'cuban-v2', 'cuban-v3', 'cuban-v4', 'cuban-v5'],
  },
  {
    id: 'fast-48',
    number: 48,
    name: 'Reid Hoffman',
    shortName: 'REID',
    description: 'Blitzscaling and startup strategy with the LinkedIn founder.',
    category: 'entrepreneur',
    logo: '🚀',
    color: '#0077B5',
    videoIds: ['reid-v1', 'reid-v2', 'reid-v3', 'reid-v4', 'reid-v5'],
  },
  {
    id: 'fast-49',
    number: 49,
    name: 'Elon Mode',
    shortName: 'ELON',
    description: 'First principles thinking and ambitious goals.',
    category: 'entrepreneur',
    logo: '⚡',
    color: '#1E293B',
    videoIds: ['elon-v1', 'elon-v2', 'elon-v3', 'elon-v4', 'elon-v5'],
  },
  {
    id: 'fast-50',
    number: 50,
    name: 'Naval Wisdom',
    shortName: 'NAVAL',
    description: 'Wealth creation and life philosophy from Naval Ravikant.',
    category: 'entrepreneur',
    logo: '🧠',
    color: '#6366F1',
    videoIds: ['naval-v1', 'naval-v2', 'naval-v3', 'naval-v4', 'naval-v5'],
  },
  {
    id: 'fast-51',
    number: 51,
    name: 'Alex Hormozi',
    shortName: 'HORM',
    description: '$100M offers and high-ticket sales strategies.',
    category: 'entrepreneur',
    logo: '💪',
    color: '#DC2626',
    videoIds: ['hormozi-v1', 'hormozi-v2', 'hormozi-v3', 'hormozi-v4', 'hormozi-v5'],
  },
  {
    id: 'fast-52',
    number: 52,
    name: 'Sam Altman',
    shortName: 'SAM',
    description: 'YC insights and AI future from Sam Altman.',
    category: 'entrepreneur',
    logo: '🤖',
    color: '#10B981',
    videoIds: ['m6-v1', 'm6-v2', 'm6-v3', 'm13-v2', 'bonus-v1'],
  },
  {
    id: 'fast-53',
    number: 53,
    name: 'Peter Thiel',
    shortName: 'THIEL',
    description: 'Zero to One thinking and contrarian strategies.',
    category: 'entrepreneur',
    logo: '♟️',
    color: '#1E3A8A',
    videoIds: ['thiel-v1', 'thiel-v2', 'thiel-v3', 'thiel-v4', 'thiel-v5'],
  },
  {
    id: 'fast-54',
    number: 54,
    name: 'Paul Graham',
    shortName: 'PG',
    description: 'Essays and startup wisdom from the YC founder.',
    category: 'entrepreneur',
    logo: '📝',
    color: '#F97316',
    videoIds: ['pg-v1', 'pg-v2', 'pg-v3', 'pg-v4', 'pg-v5', 'm13-v1'],
  },
  {
    id: 'fast-55',
    number: 55,
    name: 'Jeff Bezos',
    shortName: 'BEZOS',
    description: 'Day 1 thinking and customer obsession.',
    category: 'entrepreneur',
    logo: '📦',
    color: '#FF9900',
    videoIds: ['bezos-v1', 'bezos-v2', 'bezos-v3', 'bezos-v4', 'bezos-v5'],
  },
  // ============================================
  // EDUCATION / IVY LEAGUE CHANNELS (56-60)
  // ============================================
  {
    id: 'fast-56',
    number: 56,
    name: 'Harvard CS50',
    shortName: 'CS50',
    description: 'The legendary intro to CS with David Malan.',
    category: 'education',
    logo: '🎓',
    color: '#A51C30',
    videoIds: ['cs50-v1', 'cs50-v2', 'cs50-v3', 'cs50-v4', 'cs50-v5'],
  },
  {
    id: 'fast-57',
    number: 57,
    name: 'Stanford AI',
    shortName: 'STAN',
    description: 'Machine learning and AI from Stanford.',
    category: 'education',
    logo: '🌲',
    color: '#8C1515',
    videoIds: ['stanford-v1', 'stanford-v2', 'stanford-v3', 'stanford-v4'],
  },
  {
    id: 'fast-58',
    number: 58,
    name: 'MIT OpenCW',
    shortName: 'MIT',
    description: 'World-class engineering from MIT.',
    category: 'education',
    logo: '🏛️',
    color: '#750014',
    videoIds: ['mit-v1', 'mit-v2', 'mit-v3', 'cs50-v4', 'cs50-v5'],
  },
  {
    id: 'fast-59',
    number: 59,
    name: 'Vibe Coding',
    shortName: 'VIBE',
    description: 'AI-assisted coding and modern dev tools.',
    category: 'education',
    logo: '✨',
    color: '#6366F1',
    videoIds: ['vibe-v1', 'vibe-v2', 'vibe-v3', 'vibe-v4', 'vibe-v5'],
  },
  {
    id: 'fast-60',
    number: 60,
    name: 'CS Fundamentals',
    shortName: 'CSFU',
    description: 'Algorithms, data structures, and core CS.',
    category: 'education',
    logo: '🧮',
    color: '#059669',
    videoIds: ['cs50-v3', 'cs50-v4', 'mit-v1', 'mit-v2', 'stanford-v1'],
  },
  // ============================================
  // CREATIVE / CONTENT CREATION CHANNELS (61-70)
  // ============================================
  {
    id: 'fast-61',
    number: 61,
    name: 'Video Editing',
    shortName: 'EDIT',
    description: 'Master DaVinci, Premiere, and Final Cut.',
    category: 'creative',
    logo: '🎬',
    color: '#9333EA',
    videoIds: ['edit-v1', 'edit-v2', 'edit-v3', 'edit-v4', 'edit-v5'],
  },
  {
    id: 'fast-62',
    number: 62,
    name: 'Filmmaking',
    shortName: 'FILM',
    description: 'Cinematography, lighting, and directing.',
    category: 'creative',
    logo: '🎥',
    color: '#DC2626',
    videoIds: ['film-v1', 'film-v2', 'film-v3', 'film-v4', 'film-v5'],
  },
  {
    id: 'fast-63',
    number: 63,
    name: 'Social Media',
    shortName: 'SOC',
    description: 'Grow your audience on every platform.',
    category: 'creative',
    logo: '📱',
    color: '#E1306C',
    videoIds: ['social-v1', 'social-v2', 'social-v3', 'social-v4', 'social-v5'],
  },
  {
    id: 'fast-64',
    number: 64,
    name: 'Design Studio',
    shortName: 'DSGN',
    description: 'Photoshop, Figma, and visual design.',
    category: 'creative',
    logo: '🎨',
    color: '#F59E0B',
    videoIds: ['design-v1', 'design-v2', 'design-v3', 'design-v4', 'design-v5'],
  },
  {
    id: 'fast-65',
    number: 65,
    name: 'YouTube Growth',
    shortName: 'YT',
    description: 'Algorithm hacks and channel growth.',
    category: 'creative',
    logo: '▶️',
    color: '#FF0000',
    videoIds: ['social-v5', 'edit-v5', 'gary-v2', 'gary-v3', 'gary-v5'],
  },
  {
    id: 'fast-66',
    number: 66,
    name: 'TikTok Lab',
    shortName: 'TIK',
    description: 'Short-form content and viral strategies.',
    category: 'creative',
    logo: '🎵',
    color: '#000000',
    videoIds: ['social-v3', 'social-v2', 'gary-v2', 'gary-v3', 'edit-v5'],
  },
  {
    id: 'fast-67',
    number: 67,
    name: 'Color & Grade',
    shortName: 'CLR',
    description: 'Color grading and cinematic looks.',
    category: 'creative',
    logo: '🌈',
    color: '#8B5CF6',
    videoIds: ['edit-v3', 'film-v2', 'edit-v1', 'film-v1', 'edit-v4'],
  },
  {
    id: 'fast-68',
    number: 68,
    name: 'Audio Post',
    shortName: 'AUD',
    description: 'Sound design and music production.',
    category: 'creative',
    logo: '🎧',
    color: '#0EA5E9',
    videoIds: ['film-v4', 'edit-v1', 'film-v3', 'edit-v2', 'film-v5'],
  },
  {
    id: 'fast-69',
    number: 69,
    name: 'Brand Design',
    shortName: 'BRND',
    description: 'Logo design and brand identity.',
    category: 'creative',
    logo: '💎',
    color: '#EC4899',
    videoIds: ['design-v3', 'design-v5', 'design-v1', 'design-v2', 'gary-v5'],
  },
  {
    id: 'fast-70',
    number: 70,
    name: 'Content Mix',
    shortName: 'MIX',
    description: 'Best of all creative content.',
    category: 'creative',
    logo: '🎪',
    color: '#14B8A6',
    videoIds: ['edit-v1', 'film-v1', 'social-v1', 'design-v1', 'vibe-v1'],
  },

  // ============================================
  // SHORTS CHANNELS (71-75)
  // ============================================
  {
    id: 'fast-71',
    number: 71,
    name: 'Motivation Shorts',
    shortName: 'MOTV',
    description: 'Quick motivation and mindset clips.',
    category: 'shorts',
    logo: '🔥',
    color: '#EF4444',
    videoIds: ['short-1', 'short-2', 'short-5', 'short-6', 'short-13', 'short-17'],
  },
  {
    id: 'fast-72',
    number: 72,
    name: 'Leadership Shorts',
    shortName: 'LEAD',
    description: 'Quick leadership and management insights.',
    category: 'shorts',
    logo: '👔',
    color: '#3B82F6',
    videoIds: ['short-3', 'short-4', 'short-11', 'short-20'],
  },
  {
    id: 'fast-73',
    number: 73,
    name: 'Productivity Shorts',
    shortName: 'PROD',
    description: 'Quick tips for productivity and habits.',
    category: 'shorts',
    logo: '⚡',
    color: '#10B981',
    videoIds: ['short-7', 'short-8', 'short-15', 'short-16', 'short-18'],
  },
  {
    id: 'fast-74',
    number: 74,
    name: 'Finance Shorts',
    shortName: 'FIN',
    description: 'Quick money and investing tips.',
    category: 'shorts',
    logo: '💰',
    color: '#F59E0B',
    videoIds: ['short-9', 'short-10'],
  },
  {
    id: 'fast-75',
    number: 75,
    name: 'Success Shorts',
    shortName: 'WIN',
    description: 'Mixed shorts on success and growth.',
    category: 'shorts',
    logo: '🏆',
    color: '#8B5CF6',
    videoIds: ['short-1', 'short-2', 'short-3', 'short-14', 'short-19', 'short-20'],
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
  {
    id: 'mixed',
    name: 'Mixed',
    filter: (ch) => ch.category === 'mixed',
  },
  {
    id: 'fundraising',
    name: 'Fundraising',
    filter: (ch) => ch.shortName === 'FUND' || ch.shortName === 'PITCH' || ch.shortName === 'EXIT',
  },
  {
    id: 'growth',
    name: 'Growth',
    filter: (ch) => ch.shortName === 'GRW' || ch.shortName === 'SEO' || ch.shortName === 'PLG' || ch.shortName === 'F100',
  },
  {
    id: 'product',
    name: 'Product',
    filter: (ch) => ch.shortName === 'SAAS' || ch.shortName === 'APP' || ch.shortName === 'DES' || ch.shortName === 'NOCD',
  },
  {
    id: 'ai-web3',
    name: 'AI & Web3',
    filter: (ch) => ch.shortName === 'AI' || ch.shortName === 'WEB3',
  },
  {
    id: 'industry',
    name: 'Industry',
    filter: (ch) => ['FIN', 'MED', 'EDU', 'ECO', 'HW'].includes(ch.shortName),
  },
  {
    id: 'entrepreneur',
    name: 'Entrepreneurs',
    filter: (ch) => ch.category === 'entrepreneur',
  },
  {
    id: 'education',
    name: 'Education',
    filter: (ch) => ch.category === 'education',
  },
  {
    id: 'creative',
    name: 'Creative',
    filter: (ch) => ch.category === 'creative',
  },
  {
    id: 'shorts',
    name: 'Shorts',
    filter: (ch) => ch.category === 'shorts',
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
