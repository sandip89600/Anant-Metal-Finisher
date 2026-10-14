import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Trash2,
  X,
  Loader2,
  Eye,
  Check,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

const AdminProductsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Metal Finishing',
    summary: '',
    description: '',
    materials: '',
    availabilityNotes: '',
    seoTitle: '',
    seoDescription: '',
    isVerified: false,
    isPublished: false
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();
      const res = await adminApi.getProducts(params);
      if (res?.data) {
        setItems(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [statusFilter, search]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      slug: '',
      category: 'Electroplating Job Work',
      summary: '',
      description: '',
      materials: 'Steel, Iron, Machined Components',
      availabilityNotes: 'Job work evaluated upon drawing review.',
      seoTitle: '',
      seoDescription: '',
      isVerified: false,
      isPublished: false
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      slug: item.slug || '',
      category: item.category || 'Metal Finishing',
      summary: item.summary || '',
      description: item.description || '',
      materials: Array.isArray(item.materials) ? item.materials.join(', ') : '',
      availabilityNotes: item.availabilityNotes || '',
      seoTitle: item.seoTitle || '',
      seoDescription: item.seoDescription || '',
      isVerified: !!item.isVerified,
      isPublished: !!item.isPublished
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);

    const payload = {
      ...formData,
      materials: formData.materials
        ? formData.materials.split(',').map((m) => m.trim()).filter(Boolean)
        : []
    };

    try {
      if (editingItem) {
        await adminApi.updateProduct(editingItem._id, payload);
      } else {
        await adminApi.createProduct(payload);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      setModalError(err.message || 'Operation failed. Check required fields.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await adminApi.deleteProduct(deleteTarget._id);
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete service');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleTogglePublish = async (item) => {
    try {
      // If verifying & publishing, update both
      await adminApi.updateProduct(item._id, {
        isPublished: !item.isPublished
      });
      fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to toggle publish status');
    }
  };

  const handleToggleVerified = async (item) => {
    try {
      await adminApi.updateProduct(item._id, {
        isVerified: !item.isVerified
      });
      fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to toggle verification status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Products &amp; Metal-Finishing Services
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage catalogue entries, process verification statuses, and public visibility.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="btn-primary text-xs py-2 px-3.5 bg-blue-700 hover:bg-blue-600 gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service / Product</span>
        </button>
      </div>

      {/* Strict Factual Policy Callout */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-200 block mb-0.5">Verification Rule:</span>
          Only items with both <span className="text-emerald-400 font-semibold">[Verified = YES]</span> and{' '}
          <span className="text-sky-400 font-semibold">[Published = YES]</span> are visible to live visitors on the public catalogue. Unconfirmed processes remain safe drafts.
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Status:</span>
          {['all', 'published', 'draft'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg font-medium capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-blue-700 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or category..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-5 py-3">Service Name</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Factual Verification</th>
                  <th className="px-5 py-3">Public Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-100">{item.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">/{item.slug}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleVerified(item)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                            item.isVerified
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {item.isVerified ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified Capability</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3" />
                              <span>Unconfirmed (Click to Verify)</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(item)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                            item.isPublished
                              ? 'bg-sky-950 text-sky-400 border border-sky-800'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          <span>{item.isPublished ? 'Published Live' : 'Draft / Hidden'}</span>
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Service"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">
                      No services match your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Service / Capability' : 'Create New Service'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3.5 bg-red-950/60 border border-red-800 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E.g. Industrial Electroplating Job Work"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="E.g. Electroplating Job Work"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  URL Slug (Optional - auto-generated if blank)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. electroplating-job-work"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Short Summary * (Max 300 chars)
                </label>
                <textarea
                  required
                  rows="2"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Brief factual explanation shown on cards..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows="5"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive description of process, inspection review, sample trials, etc."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Compatible Materials (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.materials}
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  placeholder="E.g. Mild Steel, EN8, Cast Iron, Brass"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Availability / Capability Notes
                </label>
                <input
                  type="text"
                  value={formData.availabilityNotes}
                  onChange={(e) => setFormData({ ...formData, availabilityNotes: e.target.value })}
                  placeholder="E.g. Job work evaluated upon component drawing review."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              {/* Strict Verification and Publication Controls */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="font-semibold text-slate-200 block text-xs">
                  Factual Verification &amp; Visibility Controls:
                </span>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    Verified Capability (I confirm that Anant Metal Finishers physically operates this process)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    Publish to Public Website (Must also be verified to show live)
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="btn-primary text-xs bg-blue-700 hover:bg-blue-600"
                >
                  {modalLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingItem ? 'Update Service' : 'Create Service'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Deletion</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-white">"{deleteTarget.name}"</span>? This action removes the entry from the database.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="btn-secondary text-xs bg-slate-800 text-slate-300 border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="btn-primary text-xs bg-rose-700 hover:bg-rose-800"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
