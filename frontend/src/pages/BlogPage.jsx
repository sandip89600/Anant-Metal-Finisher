import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Clock, Calendar, ArrowRight, BookOpen, ChevronRight } from 'lucide-react';
import { blogApi } from '../services/api';
import SEO from '../components/common/SEO';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);

  const currentCategory = searchParams.get('category') || 'All';
  const currentSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await blogApi.getCategories();
        if (res?.data) {
          setCategories(['All', ...res.data]);
        }
      } catch (err) {
        setCategories(['All', 'Industrial Finishing Guides']);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 9
        };
        if (currentCategory !== 'All') params.category = currentCategory;
        if (currentSearch.trim()) params.search = currentSearch.trim();

        const res = await blogApi.getBlogs(params);
        if (res?.data) {
          setPosts(res.data);
          setTotalPosts(res.pagination?.total || res.data.length);
        }
      } catch (err) {
        console.error('Failed to load blog posts', err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
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
        title="Technical Blog &amp; Industrial Finishing Guides | Anant Metal Finishers"
        description="Educational guides on industrial electroplating, surface preparation, part handling, and engineering job-work enquiries by Anant Metal Finishers."
      />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-blue-900/60 px-2.5 py-1 rounded border border-blue-700/60">
              Technical Resources
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              Metal Finishing Knowledge &amp; Guides
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              Fact-checked educational articles on industrial electroplating fundamentals, part preparation, and job-work planning.
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 border-b border-slate-200 py-3 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-700">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Technical Blog</span>
        </div>
      </div>

      {/* Main Blog Listing Section */}
      <section className="py-12 bg-slate-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Controls Bar */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Topic:</span>
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
                placeholder="Search articles & topics..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing {posts.length} of {totalPosts} published educational article{totalPosts === 1 ? '' : 's'}
            </span>
          </div>

          {/* Posts Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{post.readingTime}</span>
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="hover:text-blue-700 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {post.summary}
                    </p>

                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {post.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(post.publicationDate || post.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
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
            <EmptyState
              title="No articles found"
              description="No guides match the selected category or search query."
              actionText="Clear Filters"
              onAction={() => setSearchParams({})}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default BlogPage;
