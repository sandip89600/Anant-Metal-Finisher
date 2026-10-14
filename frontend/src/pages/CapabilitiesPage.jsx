import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, ArrowRight, ShieldCheck, CheckCircle2, Factory } from 'lucide-react';
import { capabilitiesApi } from '../services/api';
import SEO from '../components/common/SEO';
import { CardSkeleton } from '../components/common/LoadingSkeleton';

const CapabilitiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentCategory = searchParams.get('category') || 'All';
  const currentSearch = searchParams.get('search') || '';

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await capabilitiesApi.getCategories();
        if (res?.data) {
          setCategories(['All', ...res.data]);
        }
      } catch (err) {
        setCategories(['All', 'Metal Finishing', 'Electroplating Job Work']);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchCapabilities = async () => {
      setLoading(true);
      try {
        const params = { limit: 20 };
        if (currentCategory !== 'All') params.category = currentCategory;
        if (currentSearch.trim()) params.search = currentSearch.trim();

        const res = await capabilitiesApi.getProducts(params);
        if (res?.data) {
          setItems(res.data);
        }
      } catch (err) {
        console.error('Failed to load capabilities:', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCapabilities();
  }, [currentCategory, currentSearch]);

  const handleCategoryChange = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchVal = formData.get('search')?.toString() || '';
    const newParams = new URLSearchParams(searchParams);
    if (searchVal.trim()) {
      newParams.set('search', searchVal.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  return (
    <>
      <SEO
        title="Industrial Capabilities | Anant Metal Finishers | MIDC Ambad, Nashik"
        description="Explore verified industrial electroplating, metal finishing, and component surface treatment capabilities at Anant Metal Finishers in Nashik, Maharashtra."
      />

      {/* Hero Banner */}
      <section className="bg-slate-900 py-14 sm:py-20 text-white relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 opacity-95" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-blue-900/60 px-3 py-1 rounded border border-blue-700/60">
              Industrial Service Showcase
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mt-4">
              Our Capabilities
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-3 leading-relaxed">
              Industrial electroplating, protective surface finishing, and component job work tailored to mechanical engineering tolerances in MIDC Ambad, Nashik.
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 border-b border-slate-200 py-3 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-700">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Capabilities</span>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="py-14 bg-slate-50 min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Controls: Search & Category Filter */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border ${
                    currentCategory === cat
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72 shrink-0">
              <input
                type="text"
                name="search"
                defaultValue={currentSearch}
                placeholder="Search capabilities..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </form>
          </div>

          {/* Strict Factual Banner */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3 text-xs text-blue-900">
            <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <strong>Informational Showcase:</strong> All listings describe verified job-work capabilities. Specific bath chemistries, tolerances, and batch lead times are scheduled upon technical drawing review.
            </div>
          </div>

          {/* Capabilities Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <CardSkeleton key={n} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <Factory className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900">No capabilities found</h3>
              <p className="text-sm text-slate-500 mt-1">
                Try modifying your search query or reset category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                >
                  <div>
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden bg-slate-900">
                      <img
                        src={item.mainImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 text-sky-400 px-2.5 py-1 rounded-md backdrop-blur-sm border border-slate-700">
                        {item.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {item.summary}
                      </p>

                      {/* Compatible Materials / Applications */}
                      {item.materials && item.materials.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                            Typical Applications / Materials:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.materials.slice(0, 3).map((mat) => (
                              <span
                                key={mat}
                                className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium"
                              >
                                {mat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <Link
                      to={`/capabilities/${item.slug}`}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1.5 transition-colors group/btn"
                    >
                      <span>Explore Capability</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to={`/contact?service=${encodeURIComponent(item.name)}`}
                      className="text-xs text-slate-500 hover:text-slate-900 font-medium"
                    >
                      Enquire
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contact Consultation Strip */}
          <div className="p-8 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Component Job Work
              </span>
              <h3 className="text-xl sm:text-2xl font-bold mt-1">
                Looking for a Metal-Finishing Job-Work Partner?
              </h3>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                Consult with Anant Metal Finishers regarding component drawing tolerances, surface protection requirements, and batch processing.
              </p>
            </div>
            <Link to="/contact" className="btn-primary bg-blue-600 hover:bg-blue-500 text-white font-bold shrink-0">
              <span>Contact Our Workshop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default CapabilitiesPage;
