import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Share2,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Copy,
  Check,
  Send
} from 'lucide-react';
import { blogApi } from '../services/api';
import SEO from '../components/common/SEO';
import { DetailSkeleton } from '../components/common/LoadingSkeleton';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await blogApi.getBlogBySlug(slug);
        if (res?.data) {
          setPost(res.data);
          if (res.related) setRelated(res.related);
        } else {
          setError('Article not found or currently unpublished.');
        }
      } catch (err) {
        setError(err.message || 'Article not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Article Unavailable</h1>
        <p className="text-slate-600 text-sm">{error || 'This article could not be loaded.'}</p>
        <Link to="/blog" className="btn-primary text-xs inline-flex">
          Return to Blog Listing
        </Link>
      </div>
    );
  }

  const articleUrl = window.location.href;
  const shareTitle = encodeURIComponent(post.title);

  return (
    <>
      <SEO
        title={post.seoTitle || `${post.title} | Anant Metal Finishers`}
        description={post.seoDescription || post.summary}
        ogType="article"
      />

      {/* Article Header Banner */}
      <section className="bg-slate-900 text-white py-14 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-sky-300 bg-blue-900/80 px-2.5 py-1 rounded">
              {post.category}
            </span>
            <span className="text-xs text-slate-400">Technical Resource</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-400" />
              <span>{post.author || 'Anant Metal Finishers Desk'}</span>
            </span>

            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>
                {new Date(post.publicationDate || post.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </span>

            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>{post.readingTime}</span>
            </span>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 border-b border-slate-200 py-3 text-xs text-slate-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-blue-700">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-blue-700">Blog</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate max-w-xs">{post.title}</span>
          </div>

          <Link to="/blog" className="text-blue-700 hover:text-blue-900 font-medium hidden sm:inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>All Articles</span>
          </Link>
        </div>
      </div>

      {/* Main Article Content */}
      <article className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Executive Summary */}
          <div className="p-5 rounded-xl bg-slate-50 border-l-4 border-blue-700 text-slate-700 text-sm sm:text-base italic leading-relaxed">
            {post.summary}
          </div>

          {/* Sanitized HTML Rich Body */}
          <div
            className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Tags:</span>
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Social Share & Action Bar */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Share2 className="w-4 h-4 text-blue-700" />
              <span>Share this guide:</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                LinkedIn
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${shareTitle}%20${encodeURIComponent(articleUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                WhatsApp
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(articleUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Twitter / X
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors inline-flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Related Articles */}
          {related.length > 0 && (
            <div className="pt-8 border-t border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                Related Industrial Guides
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((rel) => (
                  <Link
                    key={rel._id}
                    to={`/blog/${rel.slug}`}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-sm transition-all block group"
                  >
                    <span className="text-[11px] text-slate-400 block mb-1">
                      {rel.readingTime}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Job Work CTA Box */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-xl font-bold">Have Specific Plating Inquiries?</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Share your component drawings for factual finishing advice from our MIDC Ambad workshop.
              </p>
            </div>
            <Link
              to="/quote"
              className="btn-accent whitespace-nowrap text-xs px-5 py-2.5"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPostPage;
