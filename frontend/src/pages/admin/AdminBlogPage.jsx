import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  X,
  Loader2,
  Eye,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

const AdminBlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Industrial Finishing Guides',
    summary: '',
    content: '',
    author: 'Anant Metal Finishers Technical Desk',
    tags: '',
    readingTime: '4 min read',
    isPublished: false
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();
      const res = await adminApi.getBlogs(params);
      if (res?.data) {
        setPosts(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin blogs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [statusFilter, search]);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Industrial Finishing Guides',
      summary: '',
      content: '<p>Write your educational technical guide here...</p>',
      author: 'Anant Metal Finishers Technical Desk',
      tags: 'Electroplating, Job Work, Quality',
      readingTime: '4 min read',
      isPublished: false
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (post) => {
    try {
      setModalLoading(true);
      // Fetch full content
      const full = await adminApi.getBlog(post._id);
      const data = full?.data || post;
      setEditingPost(data);
      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        category: data.category || 'Industrial Finishing Guides',
        summary: data.summary || '',
        content: data.content || '',
        author: data.author || 'Anant Metal Finishers Technical Desk',
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
        readingTime: data.readingTime || '4 min read',
        isPublished: !!data.isPublished
      });
      setModalError(null);
      setIsModalOpen(true);
    } catch (err) {
      alert('Failed to load post content');
    } finally {
      setModalLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);

    const payload = {
      ...formData,
      tags: formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : []
    };

    try {
      if (editingPost) {
        await adminApi.updateBlog(editingPost._id, payload);
      } else {
        await adminApi.createBlog(payload);
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (err) {
      setModalError(err.message || 'Operation failed. Please check inputs.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await adminApi.deleteBlog(deleteTarget._id);
      setDeleteTarget(null);
      fetchBlogs();
    } catch (err) {
      alert(err.message || 'Failed to delete blog post');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleTogglePublish = async (post) => {
    try {
      await adminApi.updateBlog(post._id, {
        isPublished: !post.isPublished
      });
      fetchBlogs();
    } catch (err) {
      alert('Failed to toggle publish status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Educational Blog &amp; Finishing Guides
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Author and publish technical articles on industrial electroplating fundamentals.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="btn-primary text-xs py-2 px-3.5 bg-blue-700 hover:bg-blue-600 gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
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
            placeholder="Search articles..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Blog Table */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-5 py-3">Article Title</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Reading Time</th>
                  <th className="px-5 py-3">Visibility</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <tr key={post._id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-100">{post.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono">/{post.slug}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">
                        {post.readingTime}
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(post)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                            post.isPublished
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          <span>{post.isPublished ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(post)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Article"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(post)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">
                      No blog articles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingPost ? 'Edit Article' : 'Write New Article'}
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
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="E.g. What to Consider Before Sending Components for Metal Finishing Job Work"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Author / Desk Reference
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Short Summary *
                </label>
                <textarea
                  required
                  rows="2"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Brief synopsis shown on cards and in search results..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Rich Article Content (HTML formatted) *
                </label>
                <textarea
                  required
                  rows="9"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="<h2>Heading</h2><p>Article body paragraphs...</p>"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Electroplating, Surface Finishing, Fasteners, Engineering"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    Publish immediately (Visible publicly on /blog)
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs bg-slate-800 text-slate-300 border-slate-700"
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
                    <span>{editingPost ? 'Update Article' : 'Publish Article'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Deletion</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-white">"{deleteTarget.title}"</span>? This action cannot be undone.
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
                {deleteLoading ? 'Deleting...' : 'Delete Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogPage;
