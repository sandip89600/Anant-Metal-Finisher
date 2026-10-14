import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, Eye, ShieldCheck, Factory } from 'lucide-react';
import { galleryApi } from '../services/api';
import SEO from '../components/common/SEO';
import Lightbox from '../components/common/Lightbox';

const OurWorkPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const categories = [
    'All',
    'Components',
    'Metal Finishing',
    'Electroplating',
    'Factory',
    'Machinery',
    'Finished Work'
  ];

  useEffect(() => {
    const fetchWork = async () => {
      setLoading(true);
      try {
        const res = await galleryApi.getWork({
          category: activeCategory !== 'All' ? activeCategory : undefined
        });
        if (res?.data) {
          setItems(res.data);
        }
      } catch (err) {
        console.error('Failed to load portfolio work items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWork();
  }, [activeCategory]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <SEO
        title="Our Work | Industrial Metal Finishing Portfolio | Anant Metal Finishers"
        description="Visual portfolio of industrial electroplating, metal finishing, and component job work processed by Anant Metal Finishers in MIDC Ambad, Nashik."
      />

      {/* Header Banner */}
      <section className="bg-slate-900 py-14 sm:py-20 text-white relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 opacity-90" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-blue-900/60 px-3 py-1 rounded border border-blue-700/60">
              Work Showcase &amp; Portfolio
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mt-4">
              Our Work
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-3 leading-relaxed">
              A visual showcase of finished metal components, surface finishing job work, and workshop operations at G-8, MIDC Ambad, Nashik.
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 border-b border-slate-200 py-3 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-700">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Our Work</span>
        </div>
      </div>

      {/* Main Portfolio Grid Section */}
      <section className="py-14 bg-slate-50 min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shadow-sm border ${
                  activeCategory === cat
                    ? 'bg-blue-700 text-white border-blue-700 shadow-blue-500/20'
                    : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
                  <div className="h-64 bg-slate-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-6 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
              <Factory className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900">No items in this category yet</h3>
              <p className="text-sm text-slate-500 mt-1">
                Select another filter or view all work items.
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory('All')}
                className="mt-4 btn-primary text-xs"
              >
                Reset to All
              </button>
            </div>
          ) : (
            /* Masonry-Style Portfolio Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item, idx) => (
                <div
                  key={item._id}
                  onClick={() => openLightbox(idx)}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
                >
                  {/* Photo Container */}
                  <div className="relative h-64 overflow-hidden bg-slate-900 select-none">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600/90 px-3 py-1.5 rounded-lg backdrop-blur-sm shadow">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Enlarge Photograph</span>
                      </span>
                    </div>
                    {item.category && (
                      <span className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 text-sky-400 px-2.5 py-1 rounded-md backdrop-blur-sm border border-slate-700 shadow">
                        {item.category}
                      </span>
                    )}
                  </div>

                  {/* Information Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                      <span>Anant Metal Finishers</span>
                      <span className="text-blue-600 font-semibold group-hover:underline">View details</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contact Consultation Strip */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-blue-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-blue-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Job Work Inquiry
              </span>
              <h3 className="text-xl sm:text-2xl font-bold mt-1">
                Have Components Requiring Finishing?
              </h3>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                Share your component specifications and drawings with our technical team in MIDC Ambad, Nashik.
              </p>
            </div>
            <Link to="/contact" className="btn-primary bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shrink-0">
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <Lightbox
        items={items}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={(newIdx) => setLightboxIndex(newIdx)}
      />
    </>
  );
};

export default OurWorkPage;
