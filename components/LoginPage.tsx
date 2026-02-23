import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Lock, Mail, AlertCircle, Loader2, ArrowLeft, User } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBack: () => void;
  initialMode?: 'signin' | 'signup';
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack, initialMode = 'signin' }) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    let result;
    if (mode === 'signin') {
      result = await login({ email, password });
    } else {
      result = await signup(email, password, displayName);
    }

    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.error || 'Authentication failed');
    }

    setIsSubmitting(false);
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center text-[#a3a3a3] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-[#c9a227] to-[#a88520] p-3 rounded-xl">
              <Zap className="h-8 w-8 text-black" />
            </div>
          </div>
          <h1 className="mc-heading text-3xl text-white">
            {mode === 'signin' ? 'Welcome Back' : 'Get Started'}
          </h1>
          <p className="text-[#a3a3a3] mt-2">
            {mode === 'signin'
              ? 'Sign in to continue learning'
              : 'Start your founder journey today'}
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center text-red-400">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-5">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-[#a3a3a3] mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="John Doe"
                    required
                    autoComplete="name"
                    className="w-full bg-black border border-[#2a2a2a] rounded-lg pl-11 pr-4 py-3 text-white placeholder-[#525252] focus:ring-2 focus:ring-[#c9a227] focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#a3a3a3] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full bg-[#0D0D12] border border-[#2a2a2a] rounded-lg pl-11 pr-4 py-3 text-white placeholder-[#525252] focus:ring-2 focus:ring-[#c9a227] focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#a3a3a3] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
                  required
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  className="w-full bg-[#0D0D12] border border-[#2a2a2a] rounded-lg pl-11 pr-4 py-3 text-white placeholder-[#525252] focus:ring-2 focus:ring-[#c9a227] focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#c9a227] hover:bg-[#d4af37] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin text-black" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Get Started'
              )}
            </button>
          </div>

          {/* Mode Switch */}
          <div className="mt-6 text-center">
            <p className="text-[#737373] text-sm">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={switchMode}
                className="ml-2 text-[#c9a227] hover:text-[#d4af37] font-medium transition-colors"
              >
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </form>

        {/* Demo Credentials Hint */}
        {mode === 'signin' && (
          <div className="mt-6 p-4 bg-[#141414]/50 border border-[#2a2a2a] rounded-lg">
            <p className="text-xs text-[#737373] text-center mb-2">Demo credentials:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => { setEmail('demo@fasterclass.com'); setPassword('demo123'); }}
                className="px-3 py-1 bg-[#2a2a2a] rounded text-xs text-[#a3a3a3] hover:text-white hover:bg-[#3a3a3a] transition-colors"
              >
                demo@fasterclass.com
              </button>
              <button
                type="button"
                onClick={() => { setEmail('founder@startup.com'); setPassword('founder'); }}
                className="px-3 py-1 bg-[#2a2a2a] rounded text-xs text-[#a3a3a3] hover:text-white hover:bg-[#3a3a3a] transition-colors"
              >
                founder@startup.com
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
