import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Lock, Mail, Terminal } from 'lucide-react';
import { api } from '../services/api';
import { ApiError } from '../services/apiError';

const Login = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.auth.login(email, password);
      localStorage.setItem('access_token', res.access_token);
      login(res.user);
      navigate('/');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('ACCESS DENIED: Invalid credentials.');
      } else {
        setError('CONNECTION ERROR: Unable to reach server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Ambient Background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-bg-panel border border-border-subtle rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.15)]">
            <Terminal className="h-8 w-8 text-indigo-400" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-light tracking-tight text-text-main">
          GCG <span className="font-bold">SYS.OPS</span>
        </h2>
        <p className="mt-2 text-center text-sm font-mono text-text-faint uppercase tracking-widest">
          Authentication Required
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-bg-panel/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-border-subtle">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
                Identity (Email)
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-text-faint" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 bg-bg-base border border-border-subtle rounded-lg py-2.5 text-text-secondary text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder:text-text-faint"
                  placeholder="admin@gcgc.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
                Security Key
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-text-faint" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 bg-bg-base border border-border-subtle rounded-lg py-2.5 text-text-secondary text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder:text-text-faint"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-xs font-mono text-center bg-red-500/10 border border-red-500/20 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-text-main bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-base focus:ring-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'AUTHENTICATING...' : 'INITIALIZE SESSION'}
              </button>
            </div>
          </form>

          {import.meta.env.DEV && (
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-subtle" />
                </div>
                <div className="relative flex justify-center text-xs font-mono">
                  <span className="px-2 bg-bg-panel text-text-fainter uppercase tracking-widest">Dev Credentials</span>
                </div>
              </div>
              <div className="mt-6">
                <div className="text-xs font-mono text-text-faint text-center space-y-2">
                  <p className="flex justify-between px-4 py-1.5 bg-bg-subtle rounded"><span className="text-text-muted">Admin:</span> <span>admin@gcgc.com</span></p>
                  <p className="flex justify-between px-4 py-1.5 bg-bg-subtle rounded"><span className="text-text-muted">Tech:</span> <span>john@gcgc.com</span></p>
                  <p className="flex justify-between px-4 py-1.5 bg-bg-subtle rounded"><span className="text-text-muted">User:</span> <span>alice@hotel.com</span></p>
                  <p className="flex justify-between px-4 py-1.5 bg-bg-subtle rounded"><span className="text-text-muted">Desk:</span> <span>bob@gcgc.com</span></p>
                  <p className="pt-2 text-text-fainter">Password: <span className="text-indigo-400">gcgc2024</span></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
