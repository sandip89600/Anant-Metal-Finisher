import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ShieldCheck, MapPin, Phone } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Capabilities', path: '/capabilities' },
    { name: 'Our Work', path: '/our-work' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      {/* Top Industrial Notice Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>G-8, MIDC Ambad, Nashik, Maharashtra – 422010</span>
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Industrial Metal Finishing &amp; Electroplating</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {settings.phone ? (
              <a href={`tel:${settings.phone}`} className="flex items-center gap-1 hover:text-white transition-colors">
                <Phone className="w-3 h-3 text-sky-400" />
                <span>{settings.phone}</span>
              </a>
            ) : (
              <span className="text-slate-400">MIDC Ambad Industrial Area</span>
            )}
            <Link to="/admin/login" className="text-slate-400 hover:text-slate-200 transition-colors text-[11px]">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-200'
            : 'bg-white py-3.5 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Treatment */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.companyName || 'Anant Metal Finishers'}
                className="h-10 w-auto object-contain rounded"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-blue-900 to-sky-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm border border-slate-800 group-hover:scale-105 transition-transform">
                {settings.brandAbbreviation || 'AMF'}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-base sm:text-lg leading-tight tracking-tight">
                {settings.companyName || 'Anant Metal Finishers'}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Industrial Metal Finishing &amp; Electroplating
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-700 bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Action CTA: Contact Us */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/contact"
              className="btn-primary text-xs xl:text-sm shadow-sm gap-2 bg-blue-700 hover:bg-blue-800"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-fadeIn">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-700 bg-blue-50 font-semibold'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-3 border-t border-slate-100 mt-2 space-y-2">
                <Link
                  to="/contact"
                  className="w-full btn-primary text-sm justify-center gap-2"
                >
                  <span>Contact Us</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="px-3 py-2 text-xs text-slate-500 text-center">
                  G-8, MIDC Ambad, Nashik – 422010
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
