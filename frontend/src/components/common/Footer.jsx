import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ExternalLink, ShieldAlert, Linkedin, Facebook, Instagram, Twitter } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { productsApi } from '../../services/api';

const Footer = () => {
  const { settings } = useSettings();
  const [verifiedServices, setVerifiedServices] = useState([]);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await productsApi.getProducts({ limit: 5 });
        if (res?.data) {
          setVerifiedServices(res.data);
        }
      } catch (err) {
        // Fallback default confirmed service
        setVerifiedServices([
          { name: 'Industrial Electroplating Job Work', slug: 'electroplating-job-work' }
        ]);
      }
    };
    fetchServices();
  }, []);

  const socialList = [
    { name: 'LinkedIn', url: settings.socialLinks?.linkedin, icon: Linkedin },
    { name: 'Facebook', url: settings.socialLinks?.facebook, icon: Facebook },
    { name: 'Instagram', url: settings.socialLinks?.instagram, icon: Instagram },
    { name: 'Twitter', url: settings.socialLinks?.twitter, icon: Twitter }
  ].filter((item) => item.url && item.url.trim() !== '');

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Company Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-sky-500 flex items-center justify-center text-white font-extrabold text-lg shadow-sm border border-slate-700">
                AMF
              </div>
              <div>
                <span className="block font-bold text-white text-base leading-tight">
                  {settings.companyName || 'Anant Metal Finishers'}
                </span>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  MIDC Ambad • Nashik
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Industrial electroplating and metal finishing job work for machined parts, engineering components, and automotive assemblies in Nashik, Maharashtra.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700/60">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Job Work Inquiries Welcome</span>
              </div>
            </div>

            {/* Configured Social Profiles Only */}
            {socialList.length > 0 && (
              <div className="pt-3">
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Connect With Us
                </span>
                <div className="flex items-center gap-2">
                  {socialList.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.name}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                        aria-label={`Official ${item.name} profile`}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-sky-500 pl-2.5">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/capabilities" className="text-slate-400 hover:text-white transition-colors">
                  Capabilities
                </Link>
              </li>
              <li>
                <Link to="/our-work" className="text-slate-400 hover:text-white transition-colors">
                  Our Work
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-slate-400 hover:text-white transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-slate-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Business */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-sky-500 pl-2.5">
              Business
            </h3>
            <ul className="space-y-2.5 text-sm">
              {verifiedServices.length > 0 ? (
                verifiedServices.map((service) => (
                  <li key={service.slug}>
                    <Link
                      to={`/capabilities/${service.slug}`}
                      className="text-slate-400 hover:text-white transition-colors block"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li className="text-slate-400">Metal Finishing</li>
                  <li className="text-slate-400">Electroplating</li>
                  <li className="text-slate-400">Industrial Surface Finishing</li>
                </>
              )}
            </ul>
            <div className="mt-4 p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300 block mb-1">Factual Notice:</span>
              Bath availability and plating specifications are confirmed strictly upon component drawing review.
            </div>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-sky-500 pl-2.5">
              Workshop Location
            </h3>

            <div className="flex items-start gap-2.5 text-sm text-slate-400">
              <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <span>
                G-8, MIDC Ambad, Nashik, Maharashtra, India – 422010
              </span>
            </div>

            {settings.phone ? (
              <div className="flex items-center gap-2.5 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </div>
            ) : null}

            {settings.email ? (
              <div className="flex items-center gap-2.5 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </div>
            ) : null}

            {settings.workingHours ? (
              <div className="flex items-center gap-2.5 text-sm text-slate-400">
                <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{settings.workingHours}</span>
              </div>
            ) : null}

            <div className="pt-2">
              <a
                href={settings.googleMapsUrl || 'https://maps.google.com/?q=G-8,+MIDC+Ambad,+Nashik,+Maharashtra+422010'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
              >
                <span>Get Directions on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {currentYear} Anant Metal Finishers (AMF). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/admin/login" className="hover:text-slate-300 transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
