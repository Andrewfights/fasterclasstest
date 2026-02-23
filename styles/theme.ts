// Duolingo-inspired color palette
export const theme = {
  colors: {
    // Primary colors
    primary: '#58CC02',        // Duolingo green - success, XP, progress
    primaryDark: '#46A302',    // Darker green for hover states
    primaryLight: '#7FD32F',   // Lighter green for backgrounds

    // Secondary colors
    secondary: '#1CB0F6',      // Bright blue - buttons, links
    secondaryDark: '#1899D6',  // Darker blue
    secondaryLight: '#4FC3F7', // Lighter blue

    // Accent colors
    accent: '#FF9600',         // Orange - rewards, XP gains
    accentDark: '#E68600',     // Darker orange
    warning: '#FF4B4B',        // Red - errors, hearts
    warningLight: '#FF6B6B',   // Lighter red

    // Neutral colors
    background: '#FFFFFF',     // White background
    surface: '#F7F7F7',        // Light gray surface
    surfaceHover: '#EFEFEF',   // Hover state
    border: '#E5E5E5',         // Border color

    // Text colors
    text: '#3C3C3C',           // Primary text
    textSecondary: '#777777',  // Secondary text
    textMuted: '#AFAFAF',      // Muted text
    textInverse: '#FFFFFF',    // White text on dark backgrounds

    // Level colors
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
    diamond: '#B9F2FF',

    // Module colors (matching LEARNING_MODULES)
    module1: '#FBBF24',  // Yellow - Ideation
    module2: '#60A5FA',  // Blue - Building
    module3: '#34D399',  // Green - PMF
    module4: '#F97316',  // Orange - Growth
    module5: '#EC4899',  // Pink - Fundraising
    module6: '#8B5CF6',  // Purple - Scaling
    module7: '#06B6D4',  // Cyan - Mindset
  },

  gradients: {
    primary: 'linear-gradient(135deg, #58CC02 0%, #89E219 100%)',
    secondary: 'linear-gradient(135deg, #1CB0F6 0%, #4FC3F7 100%)',
    accent: 'linear-gradient(135deg, #FF9600 0%, #FFB347 100%)',
    gold: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    celebration: 'linear-gradient(135deg, #FF6B6B 0%, #FF9600 25%, #FFD700 50%, #58CC02 75%, #1CB0F6 100%)',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glow: '0 0 20px rgba(88, 204, 2, 0.3)',
  },

  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },

  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

// Tailwind-compatible class names
export const themeClasses = {
  // Buttons
  buttonPrimary: 'bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200',
  buttonSecondary: 'bg-[#1CB0F6] hover:bg-[#1899D6] text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200',
  buttonAccent: 'bg-[#FF9600] hover:bg-[#E68600] text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200',
  buttonOutline: 'border-2 border-[#E5E5E5] hover:border-[#1CB0F6] text-[#3C3C3C] font-bold py-3 px-6 rounded-xl hover:bg-[#F7F7F7] transition-all duration-200',

  // Cards
  card: 'bg-white rounded-2xl shadow-md border border-[#E5E5E5] p-6',
  cardHover: 'bg-white rounded-2xl shadow-md border border-[#E5E5E5] p-6 hover:shadow-lg hover:border-[#1CB0F6] transition-all duration-200',

  // Text
  heading: 'text-[#3C3C3C] font-bold',
  text: 'text-[#3C3C3C]',
  textSecondary: 'text-[#777777]',
  textMuted: 'text-[#AFAFAF]',
};
