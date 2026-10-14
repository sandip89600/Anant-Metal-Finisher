import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Layers,
  FileText,
  Sliders,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { productsApi, blogApi } from '../services/api';
import IndustrialHeroVisual from '../components/home/IndustrialHeroVisual';
import SEO from '../components/common/SEO';
import { CardSkeleton } from '../components/common/LoadingSkeleton';

const HomePage = () => {
  const { settings } = useSettings();
  const [featuredServices, setFeaturedServices] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [servicesRes, blogsRes] = await Promise.all([
          productsApi.getProducts({ limit: 3 }),
          blogApi.getBlogs({ limit: 3 })
        ]);
        if (servicesRes?.data) setFeaturedServices(servicesRes.data);
        if (blogsRes?.data) setLatestBlogs(blogsRes.data);
      } catch (err) {
        console.error('Failed to load homepage dynamic data', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <>
      <SEO
        title="Industrial Electroplating & Metal Finishing Job Work | MIDC Ambad, Nashik"
        description="Anant Metal Finishers (AMP) provides industrial electroplating and metal finishing job work for components in MIDC Ambad, Nashik, Maharashtra."
      />

      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white overflow-hidden py-16 lg:py-24 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/60 border border-blue-700/60 text-xs font-semibold text-sky-300">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                <span>Industrial Metal Finishing & Electroplating Job Work</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
                Industrial Electroplating &amp;{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-200 to-white">
                  Metal Finishing Solutions
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Explore electroplating job-work solutions for industrial components. Share your component specifications and production requirements to enquire about suitable finishing services.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/quote"
                  className="btn-accent gap-2 text-base shadow-lg shadow-amber-900/30"
                >
                  <span>Request a Quote</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/products"
                  className="px-6 py-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-white font-medium border border-slate-700 text-base transition-colors flex items-center gap-2"
                >
                  <span>Explore Services</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Factual Highlights Bar */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-800/80 text-xs text-slate-400">
                <div>
                  <span className="block font-semibold text-slate-200 text-sm">G-8, MIDC Ambad</span>
                  <span>Nashik Industrial Corridor</span>
                </div>
                <div>
                  <span className="block font-semibold text-slate-200 text-sm">B2B Job Work</span>
                  <span>Component Batch Processing</span>
                </div>
                <div>
                  <span className="block font-semibold text-slate-200 text-sm">Specification First</span>
                  <span>Drawing & Sample Review</span>
                </div>
              </div>
            </div>

            {/* Right Column: Industrial Hero Visual */}
            <div className="lg:col-span-5">
              <IndustrialHeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMPANY INTRODUCTION */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                Facility Overview
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Anant Metal Finishers (AMP)
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                {settings.aboutStory ||
                  'Anant Metal Finishers is an industrial electroplating and metal finishing job-work facility located at G-8, MIDC Ambad, Nashik, Maharashtra. We provide dependable surface treatment and protective finishing for engineering components, machine parts, and component suppliers.'}
              </p>
              <p className="text-slate-600 leading-relaxed text-base">
                Operating within Nashik’s core industrial hub, we evaluate parts against engineering tolerances, base substrate conditions, and required protective finishes to deliver reliable job work.
              </p>
              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 font-semibold text-sm group"
                >
                  <span>Learn more about our facility and values</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-700" />
                <span>Strategic MIDC Location</span>
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Conveniently situated in Ambad MIDC to support precision machining shops, automotive ancillaries, and industrial fabricators across Nashik.
              </p>
              <div className="text-xs font-mono bg-white p-3 rounded-lg border border-slate-200 text-slate-700">
                Plot G-8, MIDC Ambad, Nashik – 422010
              </div>
              <Link
                to="/contact"
                className="w-full btn-secondary text-xs justify-center gap-2"
              >
                <span>View Directions & Contact Details</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES (Strictly verified and published services only!) */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/60 px-2.5 py-1 rounded border border-blue-200">
                Verified Capabilities
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-2">
                Featured Metal-Finishing Services
              </h2>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                Displaying only confirmed and administrator-verified job-work capabilities.
              </p>
            </div>
            <Link
              to="/products"
              className="mt-4 md:mt-0 text-sm font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
            >
              <span>View full catalogue</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : featuredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredServices.map((service) => (
                <div
                  key={service._id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
                        {service.category}
                      </span>
                      <span className="badge-verified">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      <Link
                        to={`/products/${service.slug}`}
                        className="hover:text-blue-700 transition-colors"
                      >
                        {service.name}
                      </Link>
                    </h3>

                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {service.summary}
                    </p>

                    {service.materials?.length > 0 && (
                      <div className="mb-4">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                          Compatible Substrates
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {service.materials.map((mat, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                            >
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/products/${service.slug}`}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900"
                    >
                      View Details →
                    </Link>
                    <Link
                      to={`/quote?service=${encodeURIComponent(service.name)}`}
                      className="btn-primary text-xs py-1.5 px-3"
                    >
                      Enquire for Job Work
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-600 text-sm">
                Electroplating job work is currently undergoing specification review.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4. WHY CHOOSE US (Administrator managed & strictly factual) */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              Our Operational Focus
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-2">
              Why Partner With Anant Metal Finishers
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Dependable industrial job work built on technical transparency, inspection discipline, and responsive coordination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Drawing &amp; Specification Review</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We review component base materials, surface conditions, dimensional allowances, and plating thickness targets before accepting job work.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Local Industrial Presence</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Located in G-8, MIDC Ambad, Nashik, providing seamless logistics and direct technical communication for local manufacturing units.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Sample &amp; Batch Trials</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                For regular production requirements, we support trial batches to align finish consistency and bath suitability with your quality benchmarks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BUSINESS ENQUIRY CTA SECTION */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-sky-400 bg-blue-900/60 px-3 py-1 rounded-full border border-blue-700/60">
            Industrial Job-Work Inquiries
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white max-w-2xl mx-auto tracking-tight">
            Looking for an Electroplating Job-Work Partner?
          </h2>

          <p className="text-slate-300 max-w-xl mx-auto text-base leading-relaxed">
            Send us your component drawings, surface finish requirements, and expected batch quantities for a technical review.
          </p>

          <div className="pt-2">
            <Link
              to="/quote"
              className="btn-accent px-8 py-3.5 text-base shadow-xl gap-2 font-bold"
            >
              <span>Discuss Your Requirements</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. LATEST BLOG ARTICLES (Real database records) */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/60 px-2.5 py-1 rounded border border-blue-200">
                Technical Knowledge
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-2">
                Latest Articles &amp; Finishing Guides
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Practical insights on industrial electroplating, surface preparation, and job-work planning.
              </p>
            </div>
            <Link
              to="/blog"
              className="mt-4 md:mt-0 text-sm font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
            >
              <span>Browse all articles</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : latestBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestBlogs.map((post) => (
                <article
                  key={post._id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readingTime}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="hover:text-blue-700 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>

                  <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      {new Date(post.publicationDate || post.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-500 text-sm">Educational articles will appear here once published.</p>
            </div>
          )}
        </div>
      </section>

      {/* 7. CONTACT PREVIEW */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-2xl text-white p-8 sm:p-12 border border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                  Contact Anant Metal Finishers
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Reach Our Ambad Industrial Workshop
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
                  Whether you are planning prototype trials or regular metal finishing job work, connect with our team to discuss your component specifications.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-400" />
                    <span>G-8, MIDC Ambad, Nashik – 422010</span>
                  </div>
                  {settings.phone ? (
                    <div className="flex items-center gap-2">
                      <span>Phone: {settings.phone}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                <Link
                  to="/contact"
                  className="btn-primary text-center text-sm py-3 bg-blue-600 hover:bg-blue-700"
                >
                  Contact Us
                </Link>
                <a
                  href={settings.googleMapsUrl || 'https://maps.google.com/?q=G-8,+MIDC+Ambad,+Nashik,+Maharashtra+422010'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-center text-sm font-medium border border-slate-700 transition-colors"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
