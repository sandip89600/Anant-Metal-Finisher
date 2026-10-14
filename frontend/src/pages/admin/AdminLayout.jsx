import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  FileText,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  User,
  KeyRound,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Capabilities', path: '/admin/capabilities', icon: Layers },
    { name: 'Gallery & Work', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Blog Articles', path: '/admin/blog', icon: FileText },
    { name: 'Contact Messages', path: '/admin/messages', icon: Mail },
    { name: 'Company Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex text-slate-100 font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-950 border-r border-slate-800 shrink-0 select-none">
        {/* Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 to-sky-500 flex items-center justify-center font-extrabold text-white text-base shadow">
              AMF
            </div>
            <div>
              <span className="font-bold text-white text-sm block leading-tight">
                AMF Admin
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Workshop Operations
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5" aria-label="Admin Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-700 text-white font-semibold shadow-sm shadow-blue-900/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Quick View Website Link */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs transition-colors border border-slate-800"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span>Live Website</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">View</span>
          </Link>

          {/* User Profile Bar */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="block text-xs font-semibold text-slate-200 truncate">
                  {user?.name || 'Administrator'}
                </span>
                <span className="block text-[10px] text-slate-500 truncate">
                  {user?.email}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
        {/* Top Bar for Mobile Menu & Notifications */}
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-mono hidden sm:inline">AMF Workshop Portal (G-8, MIDC Ambad)</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors"
            >
              <span>View Public Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="btn-secondary text-xs py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              <span>Log Out</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                      isActive
                        ? 'bg-blue-700 text-white font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
