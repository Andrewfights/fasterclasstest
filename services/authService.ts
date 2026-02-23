import { AuthState, LoginCredentials, AdminUser } from '../types';

// Demo users for testing (in production, this would be a backend)
interface DemoUser {
  email: string;
  password: string;
  displayName: string;
  isAdmin?: boolean;
}

const DEMO_USERS: DemoUser[] = [
  { email: 'andrew@ruffcut.ai', password: 'Yankees48!', displayName: 'Andrew', isAdmin: true },
  { email: 'demo@fasterclass.com', password: 'demo123', displayName: 'Demo User' },
  { email: 'founder@startup.com', password: 'founder', displayName: 'Startup Founder' },
];

const AUTH_STORAGE_KEY = 'fasterclass_auth';
const DEMO_USERS_KEY = 'fasterclass_demo_users';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Get all users (built-in + any registered demo users)
const getAllUsers = (): DemoUser[] => {
  try {
    const stored = localStorage.getItem(DEMO_USERS_KEY);
    const registeredUsers: DemoUser[] = stored ? JSON.parse(stored) : [];
    return [...DEMO_USERS, ...registeredUsers];
  } catch {
    return DEMO_USERS;
  }
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> {
    const { email, password } = credentials;
    const allUsers = getAllUsers();

    // Find user by email (case-insensitive)
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Validate password (simple comparison for demo)
    if (password !== user.password) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Create session
    const authState: AuthState = {
      isAuthenticated: true,
      user: {
        email: user.email,
        displayName: user.displayName
      },
      lastLoginTime: Date.now()
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    return { success: true };
  },

  // Sign up new demo user
  async signup(email: string, password: string, displayName: string): Promise<{ success: boolean; error?: string }> {
    const allUsers = getAllUsers();

    // Check if email already exists
    if (allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email already registered' };
    }

    // Validate inputs
    if (!email || !password || !displayName) {
      return { success: false, error: 'All fields are required' };
    }

    if (password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters' };
    }

    // Add new user to registered users
    const newUser: DemoUser = { email, password, displayName };
    const stored = localStorage.getItem(DEMO_USERS_KEY);
    const registeredUsers: DemoUser[] = stored ? JSON.parse(stored) : [];
    registeredUsers.push(newUser);
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(registeredUsers));

    // Auto-login after signup
    const authState: AuthState = {
      isAuthenticated: true,
      user: {
        email: newUser.email,
        displayName: newUser.displayName
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
