import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldAlert,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  Layers
} from 'lucide-react';
import { adminApi, authApi } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

const AdminSettingsPage = () => {
  const { refreshSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Settings State
  const [settings, setSettings] = useState({
    companyName: 'Anant Metal Finishers',
    brandAbbreviation: 'AMP',
    businessCategory: 'Industrial metal finishing and electroplating job work',
    locationAddress: {
      street: 'G-8, MIDC Ambad',
      city: 'Nashik',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '422010'
    },
    phone: '',
    whatsappNumber: '',
    email: '',
    contactNotificationEmail: '',
    workingHours: '',
    gstNumber: '',
    aboutStory: '',
    mission: '',
    values: '',
    googleMapsUrl: '',
    socialLinks: {
      linkedin: '',
      facebook: '',
      instagram: '',
      twitter: ''
    },
    seoDefaults: {
      metaTitle: '',
      metaDescription: ''
    }
  });

  // Password Change State
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(null);
  const [pwError, setPwError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getSettings();
        if (res?.data) {
          setSettings((prev) => ({
            ...prev,
            ...res.data,
            locationAddress: { ...prev.locationAddress, ...(res.data.locationAddress || {}) },
            socialLinks: { ...prev.socialLinks, ...(res.data.socialLinks || {}) },
            seoDefaults: { ...prev.seoDefaults, ...(res.data.seoDefaults || {}) }
          }));
        }
      } catch (err) {
        setErrorMsg('Failed to load company settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await adminApi.updateSettings(settings);
      setSuccessMsg('Company settings updated successfully.');
      refreshSettings();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update company settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwSaving(true);
    setPwSuccess(null);
    setPwError(null);

    if (pwNew !== pwConfirm) {
      setPwError('New passwords do not match.');
      setPwSaving(false);
      return;
    }

    try {
      await authApi.changePassword({
        currentPassword: pwCurrent,
        newPassword: pwNew
      });
      setPwSuccess('Password updated successfully. Please use your new password next time.');
      setPwCurrent('');
      setPwNew('');
      setPwConfirm('');
      setTimeout(() => setPwSuccess(null), 5000);
    } catch (err) {
      setPwError(err.message || 'Failed to change password. Check current password.');
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
        <span>Loading company configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Company Settings &amp; Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage contact details, workshop location, factual descriptions, and security credentials.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-950/70 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-950/70 border border-red-800 rounded-xl text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
        {/* Section 1: Business Identity */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            1. Business Identity &amp; Location
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Company Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Brand Abbreviation</label>
              <input
                type="text"
                value={settings.brandAbbreviation}
                onChange={(e) => setSettings({ ...settings, brandAbbreviation: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-medium mb-1">Street Address</label>
              <input
                type="text"
                value={settings.locationAddress?.street}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    locationAddress: { ...settings.locationAddress, street: e.target.value }
                  })
                }
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">City</label>
              <input
                type="text"
                value={settings.locationAddress?.city}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    locationAddress: { ...settings.locationAddress, city: e.target.value }
                  })
                }
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Postal Code (PIN)</label>
              <input
                type="text"
                value={settings.locationAddress?.postalCode}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    locationAddress: { ...settings.locationAddress, postalCode: e.target.value }
                  })
                }
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Channels & Notification */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            2. Contact Details &amp; Notification Email
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Official Phone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder="Leave blank until verified by business"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="+91..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Published Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="info@anantmetalfinishers.com"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Notification Email (Receives Enquiries)
              </label>
              <input
                type="email"
                value={settings.contactNotificationEmail}
                onChange={(e) => setSettings({ ...settings, contactNotificationEmail: e.target.value })}
                placeholder="admin@anantmetalfinishers.com"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Working Hours</label>
              <input
                type="text"
                value={settings.workingHours}
                onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                placeholder="E.g. Mon - Sat: 9:00 AM - 6:30 PM"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">GST Number (Optional)</label>
              <input
                type="text"
                value={settings.gstNumber}
                onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                placeholder="Enter verified GSTIN..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Company Story, Mission & Values */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            3. Editorial Story, Mission &amp; Values
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">About Story (Overview)</label>
              <textarea
                rows="3"
                value={settings.aboutStory}
                onChange={(e) => setSettings({ ...settings, aboutStory: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Mission Statement</label>
              <textarea
                rows="2"
                value={settings.mission}
                onChange={(e) => setSettings({ ...settings, mission: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Values &amp; Principles</label>
              <textarea
                rows="2"
                value={settings.values}
                onChange={(e) => setSettings({ ...settings, values: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Section 4: Social Links */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            4. Social Media URLs (Only active URLs will appear on website)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">LinkedIn Profile</label>
              <input
                type="url"
                value={settings.socialLinks?.linkedin}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, linkedin: e.target.value }
                  })
                }
                placeholder="https://linkedin.com/company/..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Facebook Profile</label>
              <input
                type="url"
                value={settings.socialLinks?.facebook}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                  })
                }
                placeholder="https://facebook.com/..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary text-xs py-2.5 px-5 bg-blue-700 hover:bg-blue-600 shadow inline-flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Configuration...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Company Settings</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Section 5: Administrator Security & Password Change */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-sky-400" />
          <span>Security &amp; Password Update</span>
        </h2>
        <p className="text-slate-400 text-xs">
          Maintain dashboard access security by updating your administrator password regularly.
        </p>

        {pwSuccess && (
          <div className="p-3 bg-emerald-950/70 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{pwSuccess}</span>
          </div>
        )}

        {pwError && (
          <div className="p-3 bg-red-950/70 border border-red-800 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{pwError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md pt-2">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Current Password *
            </label>
            <input
              type="password"
              required
              value={pwCurrent}
              onChange={(e) => setPwCurrent(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              New Password * (Min 8 characters)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={pwNew}
              onChange={(e) => setPwNew(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={pwConfirm}
              onChange={(e) => setPwConfirm(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={pwSaving}
            className="btn-secondary text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 inline-flex items-center gap-1.5"
          >
            {pwSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <span>Update Password</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
