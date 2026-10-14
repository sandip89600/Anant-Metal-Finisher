import React, { useState, useEffect } from 'react';
import {
  Mail,
  Search,
  Filter,
  Download,
  Clock,
  Eye,
  CheckCircle2,
  X,
  Plus,
  Send,
  Loader2,
  AlertCircle,
  Building,
  User,
  Phone,
  Calendar,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

const AdminEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // View / Inspect Modal
  const [activeEnquiry, setActiveEnquiry] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter !== 'all') params.type = typeFilter;
      if (search.trim()) params.search = search.trim();

      const res = await adminApi.getEnquiries(params);
      if (res?.data) {
        setEnquiries(res.data);
        if (res.statusCounts) setStatusCounts(res.statusCounts);
      }
    } catch (err) {
      console.error('Failed to load enquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter, typeFilter, search]);

  const handleOpenInspect = async (enquiry) => {
    try {
      setModalLoading(true);
      const res = await adminApi.getEnquiry(enquiry._id);
      setActiveEnquiry(res?.data || enquiry);
    } catch (err) {
      setActiveEnquiry(enquiry);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await adminApi.updateStatus(id, newStatus);
      if (activeEnquiry && activeEnquiry._id === id) {
        setActiveEnquiry({ ...activeEnquiry, status: newStatus });
      }
      fetchEnquiries();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !activeEnquiry) return;
    try {
      setNoteLoading(true);
      const res = await adminApi.addNote(activeEnquiry._id, newNote.trim());
      if (res?.data) {
        setActiveEnquiry(res.data);
        setNewNote('');
      }
    } catch (err) {
      alert(err.message || 'Failed to add note');
    } finally {
      setNoteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Job-Work Enquiries &amp; Quotations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track incoming technical requests, update shop progress, and record internal customer notes.
          </p>
        </div>

        <a
          href={adminApi.exportCsvUrl({ status: statusFilter, type: typeFilter })}
          className="btn-secondary text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 inline-flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Filtered Enquiries (CSV)</span>
        </a>
      </div>

      {/* Status Counters Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: 'all', label: 'All Submissions', color: 'text-slate-200' },
          { key: 'new', label: 'New / Unreviewed', color: 'text-emerald-400' },
          { key: 'in_progress', label: 'In Evaluation', color: 'text-sky-400' },
          { key: 'completed', label: 'Completed', color: 'text-slate-400' }
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatusFilter(tab.key)}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              statusFilter === tab.key
                ? 'bg-slate-900 border-blue-600 shadow-sm'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
              {tab.label}
            </span>
            <span className={`text-xl font-extrabold ${tab.color}`}>
              {statusCounts[tab.key] ?? (tab.key === 'all' ? enquiries.length : 0)}
            </span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400">Type:</span>
          {['all', 'quote', 'contact'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg font-medium uppercase transition-colors ${
                typeFilter === t
                  ? 'bg-blue-700 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ref, customer, email, phone..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Enquiries Table */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-5 py-3">Reference</th>
                  <th className="px-5 py-3">Customer &amp; Company</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Component / Finish</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {enquiries.length > 0 ? (
                  enquiries.map((enq) => (
                    <tr key={enq._id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-medium text-sky-400">
                        {enq.referenceNumber}
                      </td>
                      <td className="px-5 py-3.5 text-slate-200">
                        <div className="font-semibold">{enq.name}</div>
                        {enq.companyName && (
                          <div className="text-[10px] text-slate-400">{enq.companyName}</div>
                        )}
                        <div className="text-[10px] text-slate-500">{enq.email}</div>
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
                      <td className="px-5 py-3.5 text-slate-300 max-w-[200px] truncate">
                        {enq.requirements?.componentName || enq.relatedProductOrService || 'General Metal Finishing'}
                      </td>
                      <td className="px-5 py-3.5">
                        <select
                          value={enq.status}
                          onChange={(e) => handleUpdateStatus(enq._id, e.target.value)}
                          className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="new">New</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="spam">Spam</option>
                        </select>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-[11px]">
                        {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenInspect(enq)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-400 hover:text-sky-300 transition-colors inline-flex items-center gap-1 font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-500">
                      No enquiries match your selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Enquiry Modal */}
      {activeEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-sky-400">
                  {activeEnquiry.referenceNumber}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Enquiry Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveEnquiry(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Current Status:</span>
              <div className="flex items-center gap-2">
                {['new', 'in_progress', 'completed', 'spam'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleUpdateStatus(activeEnquiry._id, st)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold uppercase transition-colors ${
                      activeEnquiry.status === st
                        ? 'bg-blue-700 text-white shadow'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block mb-0.5">Customer Name</span>
                <span className="text-white font-semibold">{activeEnquiry.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Company</span>
                <span className="text-white">{activeEnquiry.companyName || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Email</span>
                <a href={`mailto:${activeEnquiry.email}`} className="text-sky-400 hover:underline">
                  {activeEnquiry.email}
                </a>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Phone</span>
                <span className="text-white">{activeEnquiry.phone || 'Not specified'}</span>
              </div>
            </div>

            {/* Quote Specifications If Present */}
            {activeEnquiry.enquiryType === 'quote' && activeEnquiry.requirements && (
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900/60 space-y-3 text-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-300 block">
                  Component Specifications:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Component / Part</span>
                    <span className="font-semibold text-white">{activeEnquiry.requirements.componentName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Est. Quantity</span>
                    <span className="font-semibold text-white">{activeEnquiry.requirements.estimatedQuantity || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Base Material</span>
                    <span className="font-semibold text-white">{activeEnquiry.requirements.material || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Required Finish</span>
                    <span className="font-semibold text-white">{activeEnquiry.requirements.requiredFinish || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Target Date</span>
                    <span className="font-semibold text-white">{activeEnquiry.requirements.targetDate || 'Flexible'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Message */}
            <div className="space-y-1.5 text-xs">
              <span className="text-slate-400 font-semibold uppercase tracking-wider">
                Customer Message / Notes:
              </span>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 whitespace-pre-wrap leading-relaxed">
                {activeEnquiry.message || 'No additional text provided.'}
              </div>
            </div>

            {/* Internal Admin Notes */}
            <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
              <span className="font-bold text-white text-xs block">
                Internal Workshop Notes (Admin Only)
              </span>

              {activeEnquiry.internalNotes?.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {activeEnquiry.internalNotes.map((n, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-semibold text-sky-400">{n.author}</span>
                        <span>{new Date(n.createdAt).toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-slate-200">{n.note}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-[11px]">No internal notes recorded yet.</p>
              )}

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add internal note (e.g. Drawings inspected, bath bath approved)..."
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={noteLoading || !newNote.trim()}
                  className="btn-primary text-xs py-2 px-3 bg-blue-700 hover:bg-blue-600 disabled:opacity-50"
                >
                  {noteLoading ? 'Saving...' : 'Add Note'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiriesPage;
