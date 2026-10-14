import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import SEO from '../components/common/SEO';

const NotFoundPage = () => {
  return (
    <>
      <SEO title="404 Page Not Found | Anant Metal Finishers" />

      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-widest">
              Error 404
            </span>
            <h1 className="text-2xl font-bold text-slate-900">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The page or resource you requested does not exist or may have been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/"
              className="btn-primary w-full justify-center text-xs gap-1.5"
            >
              <Home className="w-4 h-4" />
              <span>Go to Home</span>
            </Link>

            <Link
              to="/products"
              className="btn-secondary w-full justify-center text-xs gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>View Services</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
