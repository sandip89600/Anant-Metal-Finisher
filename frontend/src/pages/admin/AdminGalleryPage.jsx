import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  Star,
  Layers,
  Upload,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { adminApi } from '../../services/api';

const AdminGalleryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Image Upload State
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Finished Work',
    imageUrl: '',
    isFeatured: false,
    isWorkItem: true,
    order: 0
  });

  const categories = [
    'Factory',
    'Exterior',
    'Machinery',
    'Components',
    'Finished Work',
    'Company',
    'Other'
  ];

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getGallery({
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: search.trim() || undefined,
        limit: 100
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

  useEffect(() => {
    fetchItems();
  }, [categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      category: 'Finished Work',
      imageUrl: '',
      isFeatured: false,
      isWorkItem: true,
      order: items.length + 1
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      category: item.category || 'Finished Work',
      imageUrl: item.imageUrl || '',
      isFeatured: item.isFeatured || false,
      isWorkItem: item.isWorkItem !== undefined ? item.isWorkItem : true,
      order: item.order || 0
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setModalError(null);
    const data = new FormData();
    data.append('image', file);

    try {
      const res = await adminApi.uploadImage(data);
      if (res?.url) {
        setFormData((prev) => ({ ...prev, imageUrl: res.url }));
      }
    } catch (err) {
      setModalError(err.message || 'Image upload failed. Please use an image URL instead.');
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);

    if (!formData.title.trim()) {
      setModalError('Title is required');
      setModalLoading(false);
      return;
    }

    if (!formData.imageUrl.trim()) {
      setModalError('Image URL or uploaded file is required');
      setModalLoading(false);
      return;
    }

    try {
      if (editingItem) {
        await adminApi.updateGalleryItem(editingItem._id, formData);
      } else {
        await adminApi.createGalleryItem(formData);
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (err) {
      setModalError(err.message || 'Failed to save gallery item');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await adminApi.deleteGalleryItem(deleteTarget._id);
      setDeleteTarget(null);
      fetchItems();
    } catch (err) {
      alert('Failed to delete item: ' + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Gallery &amp; Work Portfolio Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage factory photographs, machinery views, and component job-work portfolio images displayed across the website.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="btn-primary text-xs gap-1.5 self-start sm:self-auto bg-blue-600 hover:bg-blue-500 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Photograph</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              categoryFilter === 'all'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </form>
      </div>

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-slate-950 rounded-xl h-64 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center bg-slate-950 rounded-2xl border border-slate-800">
          <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No photographs found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Add a photograph to showcase the factory, machinery, or finished work.
          </p>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="mt-4 btn-primary text-xs"
          >
            Add First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="group bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
            >
              <div>
                {/* Image */}
                <div className="h-44 bg-slate-900 relative overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-sky-400 px-2 py-0.5 rounded border border-slate-800 backdrop-blur-sm">
                    {item.category}
                  </span>
                  {item.isFeatured && (
                    <span className="absolute top-2 right-2 p-1 rounded bg-amber-500/90 text-slate-950 shadow">
                      <Star className="w-3 h-3 fill-current" />
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 space-y-1">
                  <h4 className="font-bold text-sm text-white truncate">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  <div className="pt-2 flex items-center gap-2 text-[10px] text-slate-500">
                    <span>Order: {item.order || 0}</span>
                    <span>•</span>
                    <span>{item.isWorkItem ? 'Shows on Our Work' : 'Gallery only'}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(item)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-900 transition-colors text-xs flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Photograph' : 'Add New Photograph'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Immersion Bath Processing Line"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Image URL *</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://... or upload below"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-[11px]"
                  />
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? 'Uploading...' : 'Upload Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description of the photo, process, or component..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-800">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0"
                  />
                  <span>Feature on Homepage Preview</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isWorkItem}
                    onChange={(e) => setFormData({ ...formData, isWorkItem: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0"
                  />
                  <span>Show in 'Our Work' Portfolio</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="btn-primary text-xs px-5 py-2 bg-blue-600 hover:bg-blue-500"
                >
                  {modalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-950/80 text-rose-400 border border-rose-800/80 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Delete Photograph?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to remove <strong className="text-white">"{deleteTarget.title}"</strong> from the corporate gallery?
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                {deleteLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGalleryPage;
