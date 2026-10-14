import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Image as ImageIcon, MapPin, ZoomIn } from 'lucide-react';
import { galleryApi } from '../services/api';
import SEO from '../components/common/SEO';
import Lightbox from '../components/common/Lightbox';

const GalleryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const categories = [
    'All',
    'Factory',
    'Exterior',
    'Machinery',
    'Components',
    'Finished Work',
    'Company'
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const res = await galleryApi.getGallery({
          category: selectedCategory !== 'All' ? selectedCategory : undefined
        });
        if (res?.data) {
          setItems(res.data);
        }
      } catch (err) {
        console.error('Failed to load gallery items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [selectedCategory]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <SEO
        title="Photo Gallery | Anant Metal Finishers | MIDC Ambad, Nashik"
        description="Comprehensive photo gallery of Anant Metal Finishers: workshop facility, immersion baths, heavy machinery, component preparation, and finished metal work in Nashik, Maharashtra."
      />

      {/* Header Banner */}
      <section className="bg-slate-900 py-14 sm:py-20 text-white relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 opacity-95" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-blue-900/60 px-3 py-1 rounded border border-blue-700/60">
              Corporate Visual Showcase
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mt-4">
              Company &amp; Workshop Gallery
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-3 leading-relaxed">
              Explore authentic photographs of our industrial facility, electroplating immersion lines, component racking, and finished parts at Plot G-8, MIDC Ambad, Nashik.
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 border-b border-slate-200 py-3 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-700">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Gallery</span>
        </div>
      </div>

      {/* Gallery Section */}
      <section className="py-14 bg-white min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shadow-sm border ${
                  selectedCategory === cat
                    ? 'bg-blue-700 text-white border-blue-700 shadow-blue-500/20'
                    : 'bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="break-inside-avoid bg-slate-100 rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200 p-8">
              <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900">No photos in this category</h3>
              <p className="text-sm text-slate-500 mt-1">
                Try selecting "All" or another category tab.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="mt-4 btn-primary text-xs"
              >
                View All Photographs
              </button>
            </div>
          ) : (
            /* Fluid Masonry Grid Layout */
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {items.map((item, idx) => (
                <div
                  key={item._id}
                  onClick={() => openLightbox(idx)}
                  className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-slate-900 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer border border-slate-200"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient Info Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-600/90 text-white px-2.5 py-1 rounded backdrop-blur-sm shadow">
                        {item.category}
                      </span>
                      <span className="p-2 rounded-lg bg-slate-900/80 text-white backdrop-blur-sm shadow">
                        <ZoomIn className="w-4 h-4" />
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white tracking-tight drop-shadow">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                      <span className="text-[10px] text-sky-400 font-mono mt-2 block">
                        Click to enlarge &amp; details
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Location Verification Banner */}
          <div className="mt-16 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-700 shrink-0" />
              <span>
                <strong>Workshop Address:</strong> Plot G-8, MIDC Ambad, Nashik, Maharashtra, India – 422010
              </span>
            </div>
            <Link to="/contact" className="text-blue-700 hover:text-blue-800 font-semibold underline shrink-0">
              Contact &amp; Map Directions →
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

export default GalleryPage;
