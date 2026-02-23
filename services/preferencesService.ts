// Preferences Service - Handles user preferences persistence via localStorage

const PREFERENCES_STORAGE_KEY = 'fasterclass_user_preferences';
const PREFERENCES_VERSION = '1.0';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: ThemeMode;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

interface StoredPreferences {
  version: string;
  preferences: UserPreferences;
  savedAt: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  reducedMotion: false,
  fontSize: 'medium',
};

function createDefaultPreferences(): UserPreferences {
  return { ...DEFAULT_PREFERENCES };
}

export const preferencesService = {
  /**
   * Get user preferences from localStorage
   */
  getPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (stored) {
        const data: StoredPreferences = JSON.parse(stored);
        if (data.version === PREFERENCES_VERSION) {
          return {
            ...createDefaultPreferences(),
            ...data.preferences,
          };
        }
      }
      return createDefaultPreferences();
    } catch (error) {
      console.error('Error loading preferences:', error);
      return createDefaultPreferences();
    }
  },

  /**
   * Save user preferences to localStorage
   */
  savePreferences(preferences: UserPreferences): void {
    try {
      const data: StoredPreferences = {
        version: PREFERENCES_VERSION,
        preferences,
        savedAt: Date.now(),
      };
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  },

  /**
   * Update a single preference
   */
  updatePreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, [key]: value };
    this.savePreferences(updated);
    return updated;
  },

  /**
   * Reset preferences to defaults
   */
  resetPreferences(): UserPreferences {
    const defaults = createDefaultPreferences();
    this.savePreferences(defaults);
    return defaults;
  },

  /**
   * Get the effective theme based on user preference and system setting
   */
  getEffectiveTheme(preference: ThemeMode): 'light' | 'dark' {
    if (preference === 'system') {
      // Check system preference
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }
      return 'dark'; // Default to dark if can't detect
    }
    return preference;
  },
};

export default preferencesService;
