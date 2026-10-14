import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, CheckCircle2, ArrowRight, Layers, HelpCircle } from 'lucide-react';
import { productsApi } from '../services/api';
import SEO from '../components/common/SEO';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const currentCategory = searchParams.get('category') || 'All';
  const currentSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await productsApi.getCategories();
        if (res?.data) {
          setCategories(['All', ...res.data]);
        }
      } catch (err) {
        setCategories(['All', 'Metal Finishing', 'Electroplating Job Work']);
      }
    };
    fetchCats();
  }, []);

  // Fetch published & verified products/services
  useEffect(() => {
    const fetchCatalogue = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 12
        };
        if (currentCategory !== 'All') params.category = currentCategory;
        if (currentSearch.trim()) params.search = currentSearch.trim();

        const res = await productsApi.getProducts(params);
        if (res?.data) {
          setItems(res.data);
          setTotalItems(res.pagination?.total || res.data.length);
        }
      } catch (err) {
        console.error('Failed to load catalogue', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogue();
  }, [currentCategory, currentSearch, currentPage]);

  const handleCategoryChange = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    newParams.set('page', '1');
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
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <>
      <SEO
        title="Products &amp; Metal Finishing Services | Anant Metal Finishers"
        description="Explore verified industrial electroplating and metal finishing job-work capabilities at Anant Metal Finishers in MIDC Ambad, Nashik."
      />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-blue-900/60 px-2.5 py-1 rounded border border-blue-700/60">
              Industrial Job-Work Catalogue
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              Products &amp; Metal Finishing Services
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              Review our verified electroplating capabilities and job-work processing scope for industrial components.
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 border-b border-slate-200 py-3 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-700">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Products &amp; Services</span>
        </div>
      </div>

      {/* Main Section */}
      <section className="py-12 bg-slate-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Controls: Search and Categories */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Categories:</span>
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    currentCategory === cat
                      ? 'bg-blue-700 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative min-w-[260px]">
              <input
                type="text"
                name="search"
                defaultValue={currentSearch}
                placeholder="Search capabilities..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing {items.length} of {totalItems} verified capability listing{totalItems === 1 ? '' : 's'}
            </span>
            <span className="text-[11px] text-slate-400">
              Only administrator-verified entries are shown publicly
            </span>
          </div>

          {/* Grid of Items */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
                        {item.category}
                      </span>
                      <span className="badge-verified">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 mb-2">
                      <Link
                        to={`/products/${item.slug}`}
                        className="hover:text-blue-700 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </h2>

                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {item.summary}
                    </p>

                    {item.materials?.length > 0 && (
                      <div className="space-y-1 mb-4">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                          Compatible Materials:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {item.materials.map((mat, i) => (
                            <span
                              key={i}
                              className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                            >
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-700">Availability: </span>
                      {item.availabilityNotes || 'Job work evaluated upon component drawing review.'}
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/products/${item.slug}`}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                    >
                      <span>Specifications</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      to={`/quote?service=${encodeURIComponent(item.name)}`}
                      className="btn-primary text-xs py-1.5 px-3"
                    >
                      Request Quote
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No services match your criteria"
              description="Try adjusting your category filter or search keywords to find available metal finishing capabilities."
              actionText="Reset Filters"
              onAction={() => setSearchParams({})}
            />
          )}

          {/* Factual Information Notice */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-700" />
              <span>Job-Work Submission Guidance</span>
            </h4>
            <p className="leading-relaxed">
              Anant Metal Finishers operates primarily on industrial job-work arrangements. Specific coating thickness, bath temperature parameters, and turn-around schedules depend upon the base metallurgy, surface pre-clean condition, and part geometry. To receive a factual feasibility assessment, share your technical component drawing with our team.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductsPage;
