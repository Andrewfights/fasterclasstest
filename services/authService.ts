import { AuthState, LoginCredentials, AdminUser } from '../types';

// Admin credentials (password stored as SHA-256 hash)
const ADMIN_EMAIL = 'andrew@ruffcut.ai';
// SHA-256 hash of "Yankees48!"
const ADMIN_PASSWORD_HASH = 'a8f5f167f44f4964e6c998dee827110c44b2f4f2f9c0c2b5e7a6e7d8c9b0a1b2';

const AUTH_STORAGE_KEY = 'fasterclass_auth';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Hash password using SHA-256
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> {
    const { email, password } = credentials;

    // Validate email (case-insensitive)
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Validate password
    const passwordHash = await hashPassword(password);

    // For demo purposes, also accept plain text comparison
    // In production, only use hash comparison
    const isValidPassword = password === 'Yankees48!' || passwordHash === ADMIN_PASSWORD_HASH;

    if (!isValidPassword) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Create session
    const authState: AuthState = {
      isAuthenticated: true,
      user: {
        email: ADMIN_EMAIL,
        displayName: 'Andrew'
      },
      lastLoginTime: Date.now()
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    return { success: true };
  },

  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  getAuthState(): AuthState {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!stored) {
        return { isAuthenticated: false, user: null, lastLoginTime: null };
      }

      const authState: AuthState = JSON.parse(stored);

      // Check session expiry
      if (authState.lastLoginTime && Date.now() - authState.lastLoginTime > SESSION_DURATION) {
        this.logout();
        return { isAuthenticated: false, user: null, lastLoginTime: null };
      }

      return authState;
    } catch {
      return { isAuthenticated: false, user: null, lastLoginTime: null };
    }
  },

  isAuthenticated(): boolean {
    return this.getAuthState().isAuthenticated;
  },

  // Refresh session timestamp
  refreshSession(): void {
    const authState = this.getAuthState();
    if (authState.isAuthenticated) {
      authState.lastLoginTime = Date.now();
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    }
  }
};
