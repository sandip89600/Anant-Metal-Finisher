import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/common/SEO';

const AdminLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Administrator Login | Anant Metal Finishers" />

      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Brand Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-sky-500 flex items-center justify-center font-extrabold text-white text-2xl shadow-xl mx-auto border border-slate-700">
              AMF
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Anant Metal Finishers
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Workshop Operations &amp; Administration Portal
              </p>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Staff Authentication
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/80">
                <span>Secure Session</span>
              </span>
            </div>

            {error && (
              <div className="p-3.5 bg-red-950/60 border border-red-800 rounded-xl text-red-300 text-xs flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Administrator Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@anantmetalfinishers.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Security Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary justify-center text-xs py-2.5 bg-blue-700 hover:bg-blue-600 shadow"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Log In to Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="border-t border-slate-800 pt-3 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Return to Public Website</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;
