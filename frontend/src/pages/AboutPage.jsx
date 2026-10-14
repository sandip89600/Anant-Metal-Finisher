import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Target,
  Eye,
  ShieldCheck,
  ArrowRight,
  Layers,
  FileCheck,
  ExternalLink,
  Factory,
  CheckCircle2,
  User
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import SEO from '../components/common/SEO';

const AboutPage = () => {
  const { settings } = useSettings();

  // Filter verified leadership only (strict factual integrity rule)
  const verifiedLeaders = settings.leadership?.filter((l) => l.isVerified && l.name) || [];

  return (
    <>
      <SEO
        title="About Us | Anant Metal Finishers (AMF) | MIDC Ambad, Nashik"
        description="Learn about Anant Metal Finishers (AMF), our industrial metal finishing and electroplating operations in Plot G-8, MIDC Ambad, Nashik, Maharashtra."
      />

      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 opacity-90" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-blue-950 px-3 py-1 rounded border border-blue-800">
              Who We Are
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Anant Metal Finishers
            </h1>
            <p className="text-sky-300 text-lg sm:text-xl font-semibold">
              Industrial Metal Finishing &amp; Electroplating
            </p>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Operating from G-8, MIDC Ambad, Nashik, providing surface treatment and protective finishing solutions tailored to component manufacturing specifications.
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 border-b border-slate-200 py-3 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-700">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">About Us</span>
        </div>
      </div>

      {/* Main Content & Facility Profile */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Who We Are & Company Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded border border-blue-200">
                  Company Overview
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-2">
                  Our Business &amp; Operations
                </h2>
              </div>

              <p className="text-slate-600 text-base leading-relaxed">
                {settings.aboutStory ||
                  'Anant Metal Finishers (AMF) operates an industrial metal finishing and electroplating job-work facility in G-8, MIDC Ambad, Nashik, Maharashtra. We deliver dependable job-work solutions for industrial engineering manufacturers, machinery component suppliers, and precision jobbing shops.'}
              </p>

              <p className="text-slate-600 text-base leading-relaxed">
                Surface treatment plays an essential role in mechanical component durability, preventing premature oxidation, and enhancing substrate longevity. Our workshop focuses on providing consistent job work where bath chemistries, immersion cycles, and component pre-cleaning are matched against customer drawing tolerances.
              </p>

              {/* Factual Integrity Banner */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">Strict Factual Policy:</span>
                  All capabilities and process parameters listed on this portal reflect verified workshop job work. We do not publish unverified certifications, awards, or arbitrary capacity claims.
                </div>
              </div>
            </div>

            {/* Industrial Facility Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-2xl text-white border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-lg">
                  {settings.brandAbbreviation || 'AMF'}
                </div>
                <div>
                  <h3 className="font-bold text-base">{settings.companyName || 'Anant Metal Finishers'}</h3>
                  <span className="text-xs text-slate-400">MIDC Ambad Industrial Zone</span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="border-t border-slate-800 pt-3">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-mono">Workshop Location</span>
                  <span className="font-medium text-white">Plot G-8, MIDC Ambad, Nashik – 422010</span>
                </div>
                <div className="border-t border-slate-800 pt-3">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-mono">Business Category</span>
                  <span className="font-medium text-white">Industrial Metal Finishing &amp; Electroplating</span>
                </div>
                <div className="border-t border-slate-800 pt-3">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-mono">Primary Focus</span>
                  <span className="font-medium text-white">Engineering Components, Machined Hardware, Turned Parts</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/contact"
                  className="w-full btn-primary justify-center text-sm bg-blue-700 hover:bg-blue-600"
                >
                  <span>Contact Our Workshop</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Our Values & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* Mission */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Our Operational Mission</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {settings.mission ||
                  'To deliver reliable, specification-conscious electroplating and surface finishing job work supporting manufacturing and engineering enterprises across Nashik and neighboring industrial regions.'}
              </p>
            </div>

            {/* Values */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Our Principles &amp; Values</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {settings.values ||
                  'Factual technical clarity, consistent surface treatment standards, transparent communication on job work capabilities, and dependable turnaround.'}
              </p>
            </div>
          </div>

          {/* Industrial Presence & Company Photograph */}
          <div className="bg-slate-900 text-white rounded-3xl overflow-hidden border border-slate-800 p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-blue-950 px-3 py-1 rounded border border-blue-800">
                  Industrial Presence
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Workshop in MIDC Ambad, Nashik
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Located at Plot G-8 in the Ambad industrial estate, our workshop is situated amidst Nashik’s prominent precision machining and automotive component manufacturing clusters.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <a
                    href={settings.googleMapsUrl || 'https://maps.google.com/?q=G-8,+MIDC+Ambad,+Nashik,+Maharashtra+422010'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold"
                  >
                    <span>View Location on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                  <img
                    src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1000&q=80"
                    alt="Plot G-8, MIDC Ambad, Nashik Facility"
                    className="w-full h-72 sm:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                    <span className="text-xs font-mono text-slate-200">
                      G-8, MIDC Ambad, Nashik – 422010
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leadership Section — Displayed strictly ONLY if verified */}
          {verifiedLeaders.length > 0 && (
            <div className="space-y-6 pt-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded border border-blue-200">
                  Leadership
                </span>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-2">
                  Management &amp; Leadership
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {verifiedLeaders.map((leader, i) => (
                  <div key={i} className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm">
                    {leader.photoUrl ? (
                      <img
                        src={leader.photoUrl}
                        alt={leader.name}
                        className="w-20 h-20 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-base text-slate-900">{leader.name}</h4>
                      <p className="text-xs font-semibold text-blue-700">{leader.designation}</p>
                    </div>
                    {leader.bio && (
                      <p className="text-xs text-slate-600 leading-relaxed">{leader.bio}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact CTA Banner */}
          <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold">Have an Industrial Finishing Requirement?</h3>
              <p className="text-slate-300 text-sm">
                Discuss component specifications and drawing requirements directly with our team.
              </p>
            </div>
            <Link
              to="/contact"
              className="btn-primary text-sm px-6 py-3 bg-blue-700 hover:bg-blue-600 whitespace-nowrap"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
