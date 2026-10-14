import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Target, Eye, ShieldCheck, ArrowRight, Layers, FileCheck } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import SEO from '../components/common/SEO';

const AboutPage = () => {
  const { settings } = useSettings();

  return (
    <>
      <SEO
        title="About Us | Anant Metal Finishers (AMP) Nashik"
        description="Learn about Anant Metal Finishers (AMP), our industrial electroplating facility in G-8, MIDC Ambad, Nashik, Maharashtra, and our operational values."
      />

      {/* Page Header */}
      <section className="bg-slate-900 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-blue-900/60 px-2.5 py-1 rounded border border-blue-700/60">
              About Anant Metal Finishers
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              Reliable Industrial Metal Finishing &amp; Electroplating Job Work
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
              Operating in MIDC Ambad, Nashik, providing surface treatment and protective finishing solutions tailored to component manufacturing specifications.
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Our Workshop &amp; Industrial Operations
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                {settings.aboutStory ||
                  'Anant Metal Finishers (AMP) operates an industrial metal finishing and electroplating job-work facility in G-8, MIDC Ambad, Nashik, Maharashtra. We deliver dependable job-work solutions for industrial engineering manufacturers, machinery component suppliers, and precision jobbing shops.'}
              </p>
              <p className="text-slate-600 text-base leading-relaxed">
                Surface treatment plays an essential role in mechanical component durability, preventing premature oxidation, and enhancing substrate longevity. Our workshop focuses on providing consistent job work where bath chemistries, immersion cycles, and component pre-cleaning are matched against customer drawing tolerances.
              </p>

              {/* Factual Integrity Banner */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">Strict Factual Policy:</span>
                  All capabilities and process parameters listed on this portal reflect verified workshop job work. We do not make unsubstantiated claims regarding certifications or capacities without physical review of customer requirements.
                </div>
              </div>
            </div>

            {/* Industrial Facility Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-2xl text-white border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">
                  AMP
                </div>
                <div>
                  <h3 className="font-bold text-base">Facility Details</h3>
                  <span className="text-xs text-slate-400">MIDC Industrial Cluster</span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="border-t border-slate-800 pt-3">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-mono">Location Address</span>
                  <span className="font-medium text-white">Plot G-8, MIDC Ambad, Nashik – 422010</span>
                </div>
                <div className="border-t border-slate-800 pt-3">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-mono">Primary Focus</span>
                  <span className="font-medium text-white">Electroplating Job Work &amp; Metal Finishing</span>
                </div>
                <div className="border-t border-slate-800 pt-3">
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-mono">Target Industries</span>
                  <span className="font-medium text-white">Machinery Components, Automotive Ancillaries, Engineering Jobbing</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/quote"
                  className="w-full btn-accent justify-center text-sm"
                >
                  Request a Job-Work Quote
                </Link>
              </div>
            </div>
          </div>

          {/* Mission & Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
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

          {/* Capabilities & Job-Work Scope */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 space-y-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                Job-Work Scope
              </span>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-2">
                Metal Finishing &amp; Surface Treatment Capabilities
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                Our workshop processes parts based on drawing guidelines and verified capability parameters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Electroplating Job Work</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bath deposition for engineering parts, providing protective barriers against environmental corrosion.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Surface Pretreatment</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Degreasing, chemical cleaning, and descaling to ensure uniform coating adhesion on machined components.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>Drawing Review &amp; Trials</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Technical assessment of part dimensions, base metal chemistry, and initial trial batch review.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-blue-900 text-white p-8 sm:p-10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold">Have a Component Finishing Requirement?</h3>
              <p className="text-sky-200 text-sm">
                Discuss your job work parameters with our technical team in MIDC Ambad, Nashik.
              </p>
            </div>
            <Link
              to="/quote"
              className="btn-accent whitespace-nowrap text-sm px-6 py-3"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
