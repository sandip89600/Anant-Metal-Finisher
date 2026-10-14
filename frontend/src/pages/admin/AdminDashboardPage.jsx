import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  FileText,
  Mail,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Download,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getDashboard();
        if (res?.data) {
          setMetrics(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <TableSkeleton rows={6} />;
  }

  if (error || !metrics) {
    return (
      <div className="p-6 bg-red-950/60 border border-red-800 rounded-xl text-red-300 text-sm flex items-center gap-3">
        <AlertCircle className="w-5 h-5" />
        <span>{error || 'Unable to load dashboard metrics.'}</span>
      </div>
    );
  }

  const { products, blogs, enquiries, recentEnquiries } = metrics;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Operational Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time workshop activity, verified services catalogue, and enquiry processing metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={adminApi.exportCsvUrl()}
            className="btn-secondary text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Enquiries (CSV)</span>
          </a>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Contact Messages */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
              Contact Messages
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-950/60 text-sky-400 border border-sky-800 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {enquiries.total || 0}
            </span>
            <span className="text-xs text-slate-400">total messages</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-900 flex justify-between">
            <span className="text-amber-400 font-medium">Unread: {enquiries.unread || enquiries.new || 0}</span>
            <span className="text-emerald-400 font-medium">Read: {enquiries.read || 0}</span>
            <Link to="/admin/messages" className="text-sky-400 hover:underline">
              View →
            </Link>
          </div>
        </div>

        {/* Card 2: Verified Capabilities */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Capabilities
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {products.published}
            </span>
            <span className="text-xs text-slate-400">verified &amp; live</span>
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-900 flex justify-between">
            <span>Draft / Review: {products.draft}</span>
            <Link to="/admin/capabilities" className="text-sky-400 hover:underline">
              Manage →
            </Link>
          </div>
        </div>

        {/* Card 3: Photo Gallery & Portfolio */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
              Photo Gallery
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-950/60 text-purple-400 border border-purple-800 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {metrics.gallery?.total || 0}
            </span>
            <span className="text-xs text-slate-400">photographs</span>
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-900 flex justify-between">
            <span>Featured: {metrics.gallery?.featured || 0}</span>
            <Link to="/admin/gallery" className="text-sky-400 hover:underline">
              Gallery →
            </Link>
          </div>
        </div>

        {/* Card 4: Published Articles */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Company Articles
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {blogs.published}
            </span>
            <span className="text-xs text-slate-400">published</span>
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-900 flex justify-between">
            <span>Drafts: {blogs.draft}</span>
            <Link to="/admin/blog" className="text-sky-400 hover:underline">
              Articles →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/admin/capabilities"
          className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-950 text-xs text-slate-200 transition-colors flex items-center gap-2.5 font-medium"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Manage Capabilities</span>
        </Link>

        <Link
          to="/admin/gallery"
          className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-950 text-xs text-slate-200 transition-colors flex items-center gap-2.5 font-medium"
        >
          <Layers className="w-4 h-4 text-purple-400 shrink-0" />
          <span>Photo Gallery</span>
        </Link>

        <Link
          to="/admin/messages"
          className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-950 text-xs text-slate-200 transition-colors flex items-center gap-2.5 font-medium"
        >
          <Mail className="w-4 h-4 text-sky-400 shrink-0" />
          <span>Contact Messages</span>
        </Link>

        <Link
          to="/admin/settings"
          className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-950 text-xs text-slate-200 transition-colors flex items-center gap-2.5 font-medium"
        >
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Company Settings</span>
        </Link>
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Recent Job-Work Submissions
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest incoming contact inquiries and quotation requests.
            </p>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1"
          >
            <span>View All Enquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentEnquiries?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-5 py-3">Reference</th>
                  <th className="px-5 py-3">Customer / Company</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Component / Service</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {recentEnquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-medium text-sky-400">
                      {enq.referenceNumber}
                    </td>
                    <td className="px-5 py-3.5 text-slate-200 font-medium">
                      <div>{enq.name}</div>
                      {enq.companyName && (
                        <div className="text-[10px] text-slate-500">{enq.companyName}</div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        enq.enquiryType === 'quote'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                          : 'bg-blue-950/80 text-blue-300 border border-blue-800/80'
                      }`}>
                        {enq.enquiryType.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 max-w-[180px] truncate">
                      {enq.requirements?.componentName || enq.relatedProductOrService || 'General Finishing'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        enq.status === 'new'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : enq.status === 'in_progress'
                          ? 'bg-sky-950 text-sky-400 border border-sky-800'
                          : enq.status === 'completed'
                          ? 'bg-slate-800 text-slate-300 border border-slate-700'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {enq.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-[11px]">
                      {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to={`/admin/enquiries`}
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                      >
                        Inspect →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            No enquiries received yet. Test by submitting from the public contact or quote forms!
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
