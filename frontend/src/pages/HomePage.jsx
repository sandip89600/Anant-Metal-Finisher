import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ExternalLink,
  ChevronRight,
  Eye,
  Factory,
  Layers,
  Phone,
  Mail,
  Clock
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { capabilitiesApi, galleryApi, blogApi } from '../services/api';
import SEO from '../components/common/SEO';
import Lightbox from '../components/common/Lightbox';

const HomePage = () => {
  const { settings } = useSettings();
  const [capabilities, setCapabilities] = useState([]);
  const [workItems, setWorkItems] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItems, setLightboxItems] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [capsRes, workRes, galleryRes, blogRes] = await Promise.all([
          capabilitiesApi.getProducts({ limit: 4 }),
          galleryApi.getWork({ limit: 6 }),
          galleryApi.getGallery({ limit: 8, featured: 'true' }),
          blogApi.getBlogs({ limit: 3 })
        ]);

        if (capsRes?.data) setCapabilities(capsRes.data);
        if (workRes?.data) setWorkItems(workRes.data);
        if (galleryRes?.data) setGalleryItems(galleryRes.data);
        if (blogRes?.data) setBlogs(blogRes.data);
      } catch (err) {
        console.error('Failed to load homepage showcase data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const openLightboxWith = (list, index) => {
    setLightboxItems(list);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <SEO
        title="Anant Metal Finishers (AMF) | Industrial Metal Finishing & Electroplating | Nashik"
        description="Official corporate portal for Anant Metal Finishers (AMF), located in G-8, MIDC Ambad, Nashik, Maharashtra. Explore our verified industrial metal finishing and electroplating capabilities, work gallery, and facility."
      />

      {/* ==================================================
          SECTION 1 — HERO
          ================================================== */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center bg-slate-950 text-white overflow-hidden border-b border-slate-800">
        {/* Background Visual with Subtle Industrial Film Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=2000&q=85"
            alt="Anant Metal Finishers Industrial Workshop"
            className="w-full h-full object-cover opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/80 text-xs font-semibold text-sky-400 backdrop-blur-sm shadow-sm">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span>Plot G-8, MIDC Ambad • Nashik, Maharashtra</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Anant Metal Finishers
            </h1>

            <p className="text-xl sm:text-2xl font-semibold text-sky-300 tracking-tight">
              Industrial Metal Finishing &amp; Electroplating
            </p>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              An industrial finishing company based in MIDC Ambad, Nashik, focused on metal finishing and electroplating capabilities.
            </p>

            {/* Buttons: Explore Company & View Gallery */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/about"
                className="btn-primary gap-2 text-base shadow-xl shadow-blue-900/30 bg-blue-700 hover:bg-blue-600 px-7 py-3.5"
              >
                <span>Explore Company</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/gallery"
                className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold border border-slate-700 text-base transition-colors flex items-center gap-2 backdrop-blur-sm"
              >
                <span>View Gallery</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 2 — COMPANY INTRODUCTION
          ================================================== */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded border border-blue-200">
                  Company Overview
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                  About Anant Metal Finishers
                </h2>
              </div>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Anant Metal Finishers is an industrial company located in G-8, MIDC Ambad, Nashik, Maharashtra.
              </p>

              <p className="text-slate-600 text-base leading-relaxed">
                Operating within one of Maharashtra’s key manufacturing hubs, our workshop is dedicated to metal finishing and electroplating job work for mechanical engineering components, machined hardware, and precision assemblies.
              </p>

              <p className="text-slate-600 text-base leading-relaxed">
                We focus on dependable surface treatment where component pre-cleaning, chemical immersion cycles, and final rinsing are managed strictly in accordance with component drawing tolerances.
              </p>

              <div>
                <Link
                  to="/about"
                  className="btn-primary gap-2 text-sm bg-blue-700 hover:bg-blue-800"
                >
                  <span>Know More About Us</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Industrial Photograph Illustration */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80"
                  alt="Anant Metal Finishers Industrial Workshop Facility"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white text-xs font-mono">
                    <span className="text-sky-400 font-semibold block">G-8, MIDC Ambad</span>
                    <span>Nashik, Maharashtra – 422010</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 3 — COMPANY HIGHLIGHTS
          ================================================== */}
      <section className="py-16 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Key Business Facts
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Company Highlights
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 01 Industrial Location */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <span className="text-3xl font-extrabold text-blue-100 absolute top-4 right-4 select-none">
                01
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-2">
                Industrial Location
              </span>
              <h4 className="text-lg font-extrabold text-slate-900">
                G-8, MIDC Ambad, Nashik
              </h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Situated in MIDC Ambad, the manufacturing core of Nashik, Maharashtra.
              </p>
            </div>

            {/* 02 Business Focus */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <span className="text-3xl font-extrabold text-blue-100 absolute top-4 right-4 select-none">
                02
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-2">
                Business Focus
              </span>
              <h4 className="text-lg font-extrabold text-slate-900">
                Metal Finishing
              </h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Substrate preparation, descaling, protective coating, and surface conditioning.
              </p>
            </div>

            {/* 03 Industrial Capability */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <span className="text-3xl font-extrabold text-blue-100 absolute top-4 right-4 select-none">
                03
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-2">
                Industrial Capability
              </span>
              <h4 className="text-lg font-extrabold text-slate-900">
                Electroplating
              </h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Commercial electrolytic plating job work for engineered metal parts.
              </p>
            </div>

            {/* 04 Brand */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <span className="text-3xl font-extrabold text-blue-100 absolute top-4 right-4 select-none">
                04
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-2">
                Brand
              </span>
              <h4 className="text-lg font-extrabold text-slate-900">
                {settings.brandAbbreviation || 'AMF'}
              </h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Anant Metal Finishers official brand identity and workshop symbol.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 4 — CAPABILITIES
          ================================================== */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded border border-blue-200">
                Verified Industrial Job Work
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                Our Capabilities
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl">
                Displaying confirmed capabilities managed through our workshop. Technical specifications are evaluated against customer drawings.
              </p>
            </div>

            <Link
              to="/capabilities"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors"
            >
              <span>View All Capabilities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((cap) => (
              <div
                key={cap._id}
                className="group bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="h-44 overflow-hidden bg-slate-900 relative">
                    <img
                      src={cap.mainImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'}
                      alt={cap.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-sky-400 px-2 py-0.5 rounded backdrop-blur-sm border border-slate-700">
                      {cap.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {cap.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {cap.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/capabilities/${cap.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors"
                  >
                    <span>View details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 5 — OUR WORK (Visual Component Portfolio)
          ================================================== */}
      <section className="py-20 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-blue-950 px-3 py-1 rounded border border-blue-800">
                Component Showcase
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
                Our Work
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
                Real photographs of metal components, finished hardware, and plating work handled at our MIDC Ambad facility.
              </p>
            </div>

            <Link
              to="/our-work"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-400 hover:text-sky-300 transition-colors"
            >
              <span>Explore Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Work Items Grid with Lightbox Trigger */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workItems.map((item, idx) => (
              <div
                key={item._id}
                onClick={() => openLightboxWith(workItems, idx)}
                className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600/90 px-3 py-1.5 rounded-lg backdrop-blur-sm shadow">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Enlarge Photo</span>
                    </span>
                  </div>
                  {item.category && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-sky-400 px-2.5 py-1 rounded border border-slate-800">
                      {item.category}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h4 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 6 — FACTORY / COMPANY
          ================================================== */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Column: Signboard / Workshop Image */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1200&q=80"
                  alt="Industrial Presence in Nashik - G-8, MIDC Ambad"
                  className="w-full h-80 sm:h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent flex items-end p-6 sm:p-8">
                  <div className="text-white space-y-1">
                    <span className="text-xs font-mono text-sky-400 uppercase tracking-wider block">
                      Official Workshop Address
                    </span>
                    <h4 className="text-lg sm:text-xl font-bold">
                      Plot G-8, MIDC Ambad, Nashik – 422010
                    </h4>
                    <p className="text-xs text-slate-300">
                      Maharashtra, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Column */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded border border-blue-200">
                  Location &amp; Infrastructure
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                  Industrial Presence in Nashik
                </h2>
              </div>

              <div className="space-y-3 text-slate-600 text-base leading-relaxed">
                <p>
                  <strong>Anant Metal Finishers</strong> operates from Plot G-8 in the Ambad industrial area of Nashik, one of Western India's most prominent automotive and engineering manufacturing belts.
                </p>
                <p>
                  Our workshop location offers seamless logistics connectivity for industrial component manufacturers, jobbing machine shops, and engineering OEMs across Nashik and neighboring industrial regions.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600 font-mono">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-700 shrink-0" />
                  <span><strong>Plot:</strong> G-8, MIDC Ambad</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4" />
                  <span><strong>City:</strong> Nashik, Maharashtra 422010, India</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={settings.googleMapsUrl || 'https://maps.google.com/?q=G-8,+MIDC+Ambad,+Nashik,+Maharashtra+422010'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary gap-2 text-sm bg-blue-700 hover:bg-blue-800"
                >
                  <span>View on Google Maps</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 7 — PHOTO GALLERY PREVIEW
          ================================================== */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded border border-blue-200">
                Visual Archive
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                Photo Gallery Preview
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl">
                A selection of photographs showing our factory operations, machinery, and component finishing.
              </p>
            </div>

            <Link
              to="/gallery"
              className="btn-primary gap-2 text-sm bg-blue-700 hover:bg-blue-800"
            >
              <span>View Complete Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 6-8 Photographs Grid with Lightbox */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {galleryItems.slice(0, 8).map((item, idx) => (
              <div
                key={item._id}
                onClick={() => openLightboxWith(galleryItems, idx)}
                className="group relative rounded-2xl overflow-hidden bg-slate-900 aspect-square cursor-pointer border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                    {item.category}
                  </span>
                  <h5 className="text-xs font-bold truncate mt-0.5">
                    {item.title}
                  </h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 8 — COMPANY INFORMATION CTA
          ================================================== */}
      <section className="py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white relative overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-blue-900/60 px-3.5 py-1.5 rounded-full border border-blue-700/60 inline-block">
            Official Industrial Presence
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Explore Anant Metal Finishers
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover our company, capabilities, industrial presence and work through our website.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/about"
              className="btn-primary gap-2 text-base px-8 py-3.5 bg-blue-600 hover:bg-blue-500 shadow-xl"
            >
              <span>About the Company</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/capabilities"
              className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold border border-slate-700 text-base transition-colors"
            >
              <span>Our Capabilities</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 9 — CONTACT PREVIEW
          ================================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded border border-blue-200">
              Direct Communication
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Contact Anant Metal Finishers
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Reach out for component finishing inquiries, workshop visits, and drawing assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Address */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Workshop Address</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-mono">
                G-8, MIDC Ambad, Nashik, Maharashtra – 422010, India
              </p>
              <a
                href={settings.googleMapsUrl || 'https://maps.google.com/?q=G-8,+MIDC+Ambad,+Nashik,+Maharashtra+422010'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 mt-2 inline-flex"
              >
                <span>Google Maps Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Telephone (Verified only) */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Telephone</h4>
              {settings.phone ? (
                <a
                  href={`tel:${settings.phone}`}
                  className="text-sm font-semibold text-slate-800 hover:text-blue-700 block font-mono"
                >
                  {settings.phone}
                </a>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Contact details available via business message form.
                </p>
              )}
            </div>

            {/* Email (Verified only) */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Official Email</h4>
              {settings.email ? (
                <a
                  href={`mailto:${settings.email}`}
                  className="text-sm font-semibold text-slate-800 hover:text-blue-700 block font-mono"
                >
                  {settings.email}
                </a>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Submit inquiries through our verified contact desk.
                </p>
              )}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="text-center pt-4">
            <Link
              to="/contact"
              className="btn-primary text-base gap-2 px-8 py-3.5 bg-blue-700 hover:bg-blue-800 inline-flex shadow-lg"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Global Interactive Lightbox Modal */}
      <Lightbox
        items={lightboxItems}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={(newIdx) => setLightboxIndex(newIdx)}
      />
    </>
  );
};

export default HomePage;
