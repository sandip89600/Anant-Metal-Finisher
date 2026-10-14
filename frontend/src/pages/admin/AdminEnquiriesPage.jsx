import React, { useState, useEffect } from 'react';
import {
  Mail,
  MailOpen,
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
  ShieldCheck,
  Trash2,
  Check,
  AlertTriangle
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

const AdminEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [readTotal, setReadTotal] = useState(0);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all'); // 'all' | 'unread' | 'read'
  const [typeFilter, setTypeFilter] = useState('all');

  // View / Inspect Modal
  const [activeEnquiry, setActiveEnquiry] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);

  // Delete Confirmation State
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter !== 'all') params.type = typeFilter;
      if (readFilter === 'unread') params.isRead = 'false';
      if (readFilter === 'read') params.isRead = 'true';
      if (search.trim()) params.search = search.trim();

      const res = await adminApi.getEnquiries(params);
      if (res?.data) {
        setEnquiries(res.data);
        if (res.statusCounts) setStatusCounts(res.statusCounts);
        if (typeof res.unreadTotal === 'number') setUnreadTotal(res.unreadTotal);
        if (typeof res.readTotal === 'number') setReadTotal(res.readTotal);
      }
    } catch (err) {
      console.error('Failed to load enquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter, typeFilter, readFilter, search]);

  const handleOpenInspect = async (enquiry) => {
    try {
      setModalLoading(true);
      const res = await adminApi.getEnquiry(enquiry._id);
      const fetched = res?.data || enquiry;
      setActiveEnquiry(fetched);
      // Auto mark as read when viewed if not already read
      if (!fetched.isRead) {
        await handleToggleRead(fetched._id, true, false);
      }
    } catch (err) {
      setActiveEnquiry(enquiry);
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleRead = async (id, targetState = null, shouldRefetch = true) => {
    try {
      const res = await adminApi.toggleRead(id, targetState);
      const updated = res?.data;
      if (activeEnquiry && activeEnquiry._id === id && updated) {
        setActiveEnquiry({ ...activeEnquiry, isRead: updated.isRead });
      }
      if (shouldRefetch) {
        fetchEnquiries();
      } else {
        // Optimistic local update
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, isRead: updated?.isRead ?? !e.isRead } : e))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to update read status');
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

  const handleDeleteEnquiry = async () => {
    if (!enquiryToDelete) return;
    try {
      setDeleting(true);
      await adminApi.deleteEnquiry(enquiryToDelete._id);
      if (activeEnquiry && activeEnquiry._id === enquiryToDelete._id) {
        setActiveEnquiry(null);
      }
      setEnquiryToDelete(null);
      fetchEnquiries();
    } catch (err) {
      alert(err.message || 'Failed to delete message');
    } finally {
      setDeleting(false);
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

  const totalAllMessages = unreadTotal + readTotal || enquiries.length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-500" />
            Contact Messages &amp; Enquiries
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review incoming industrial inquiries, read messages, reply, manage read/unread status, and keep shop records.
          </p>
        </div>

        <a
          href={adminApi.exportCsvUrl({ status: statusFilter, type: typeFilter })}
          className="btn-secondary text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </a>
      </div>

      {/* Primary Read/Unread Status Tabs */}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setReadFilter('all')}
          className={`p-4 rounded-xl border text-left transition-all ${
            readFilter === 'all'
              ? 'bg-slate-900 border-blue-600 shadow-md ring-1 ring-blue-600/30'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
            All Messages
          </span>
          <span className="text-2xl font-extrabold text-white mt-0.5 block">
            {totalAllMessages}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setReadFilter('unread')}
          className={`p-4 rounded-xl border text-left transition-all ${
            readFilter === 'unread'
              ? 'bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500/30'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] uppercase tracking-wider text-amber-400 font-mono flex items-center justify-between">
            <span>Unread Messages</span>
            {unreadTotal > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </span>
          <span className="text-2xl font-extrabold text-amber-300 mt-0.5 block">
            {unreadTotal}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setReadFilter('read')}
          className={`p-4 rounded-xl border text-left transition-all ${
            readFilter === 'read'
              ? 'bg-slate-900 border-sky-500 shadow-md ring-1 ring-sky-500/30'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
            Read Messages
          </span>
          <span className="text-2xl font-extrabold text-sky-400 mt-0.5 block">
            {readTotal}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 text-[11px] font-mono uppercase">Category:</span>
          {['all', 'quote', 'contact'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg font-medium uppercase text-[11px] transition-colors ${
                typeFilter === t
                  ? 'bg-blue-700 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {t === 'quote' ? 'Quote Inquiries' : t === 'contact' ? 'Contact Messages' : 'All Types'}
            </button>
          ))}

          <span className="text-slate-500 mx-1">|</span>

          <span className="text-slate-400 text-[11px] font-mono uppercase">Status:</span>
          {['all', 'new', 'in_progress', 'completed'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st === 'all' ? 'All' : st === 'in_progress' ? 'In Review' : st.charAt(0).toUpperCase() + st.slice(1)}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, company, email, ref..."
            className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none placeholder-slate-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Enquiries Table */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Sender &amp; Company</th>
                  <th className="px-4 py-3">Subject / Service</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Received At</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {enquiries.length > 0 ? (
                  enquiries.map((enq) => (
                    <tr
                      key={enq._id}
                      className={`transition-colors ${
                        !enq.isRead
                          ? 'bg-blue-950/20 hover:bg-blue-950/30'
                          : 'hover:bg-slate-900/40'
                      }`}
                    >
                      {/* Read / Unread Status Badge */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleRead(enq._id, !enq.isRead)}
                          title={enq.isRead ? 'Mark as Unread' : 'Mark as Read'}
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                            enq.isRead
                              ? 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-700/60 hover:bg-amber-900/80'
                          }`}
                        >
                          {enq.isRead ? (
                            <>
                              <MailOpen className="w-3 h-3 text-slate-400" />
                              <span>Read</span>
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                              <span>Unread</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Reference Number */}
                      <td className="px-4 py-3.5 font-mono font-medium text-sky-400 whitespace-nowrap">
                        {enq.referenceNumber}
                      </td>

                      {/* Sender and Company Details */}
                      <td className="px-4 py-3.5 text-slate-200">
                        <div className={`font-semibold ${!enq.isRead ? 'text-white' : 'text-slate-200'}`}>
                          {enq.name}
                        </div>
                        {enq.companyName && (
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3 text-slate-500 inline" />
                            {enq.companyName}
                          </div>
                        )}
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {enq.email} {enq.phone ? `• ${enq.phone}` : ''}
                        </div>
                      </td>

                      {/* Subject / Service Inquiry */}
                      <td className="px-4 py-3.5 text-slate-300 max-w-[220px]">
                        <div className="font-medium text-slate-200 truncate">
                          {enq.subject || enq.requirements?.componentName || enq.relatedProductOrService || 'General Inquiry'}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {enq.message}
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            enq.enquiryType === 'quote'
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                              : 'bg-blue-950/80 text-blue-300 border border-blue-800/80'
                          }`}
                        >
                          {enq.enquiryType === 'quote' ? 'QUOTE' : 'CONTACT'}
                        </span>
                      </td>

                      {/* Date & Time Received */}
                      <td className="px-4 py-3.5 text-slate-400 text-[11px] whitespace-nowrap">
                        <div>
                          {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {new Date(enq.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Toggle Read Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleRead(enq._id, !enq.isRead)}
                            title={enq.isRead ? 'Mark Unread' : 'Mark Read'}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                          >
                            {enq.isRead ? (
                              <Mail className="w-3.5 h-3.5" />
                            ) : (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </button>

                          {/* View Modal Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenInspect(enq)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-400 hover:text-sky-300 transition-colors inline-flex items-center gap-1 font-semibold"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setEnquiryToDelete(enq)}
                            title="Delete Message"
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950/60 text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-10 text-center text-slate-500">
                      <Mail className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                      No contact messages match your selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Enquiry / Message Modal */}
      {activeEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-sky-400">
                    {activeEnquiry.referenceNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      activeEnquiry.isRead
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-amber-950 text-amber-300 border border-amber-700/60'
                    }`}
                  >
                    {activeEnquiry.isRead ? 'Read' : 'Unread'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  {activeEnquiry.subject || activeEnquiry.requirements?.componentName || activeEnquiry.relatedProductOrService || 'Customer Message'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleRead(activeEnquiry._id, !activeEnquiry.isRead)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 inline-flex items-center gap-1.5"
                >
                  {activeEnquiry.isRead ? (
                    <>
                      <Mail className="w-3.5 h-3.5" />
                      <span>Mark Unread</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Mark Read</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEnquiry(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 font-mono text-[11px] uppercase">
                Workflow Status:
              </span>
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
                <span className="text-slate-500 block mb-0.5">Customer / Contact Name</span>
                <span className="text-white font-semibold text-sm">{activeEnquiry.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Company Name</span>
                <span className="text-white">{activeEnquiry.companyName || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Email Address</span>
                <a href={`mailto:${activeEnquiry.email}`} className="text-sky-400 hover:underline">
                  {activeEnquiry.email}
                </a>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Phone Number</span>
                {activeEnquiry.phone ? (
                  <a href={`tel:${activeEnquiry.phone}`} className="text-slate-200 hover:text-white">
                    {activeEnquiry.phone}
                  </a>
                ) : (
                  <span className="text-slate-400">Not specified</span>
                )}
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Date &amp; Time Received</span>
                <span className="text-slate-300">
                  {new Date(activeEnquiry.createdAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Inquiry Type</span>
                <span className="text-slate-300 font-semibold uppercase">
                  {activeEnquiry.enquiryType}
                </span>
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

            {/* Customer Message Body */}
            <div className="space-y-1.5 text-xs">
              <span className="text-slate-400 font-semibold uppercase tracking-wider">
                Message Body:
              </span>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 whitespace-pre-wrap leading-relaxed select-text">
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

            {/* Modal Bottom Actions */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setEnquiryToDelete(activeEnquiry);
                }}
                className="text-xs text-red-400 hover:text-red-300 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-950/40"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Message</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveEnquiry(null)}
                className="btn-secondary text-xs px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {enquiryToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800/80 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Message</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete enquiry{' '}
              <span className="font-mono font-semibold text-sky-400">
                {enquiryToDelete.referenceNumber}
              </span>{' '}
              from{' '}
              <span className="font-semibold text-white">
                {enquiryToDelete.name}
              </span>
              ?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setEnquiryToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteEnquiry}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Message</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiriesPage;
