import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsApi } from '../services/api';

const defaultSettings = {
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
  workingHours: '',
  gstNumber: '',
  aboutStory: 'Anant Metal Finishers (AMP) operates an industrial metal finishing and electroplating job-work facility in MIDC Ambad, Nashik, Maharashtra. We deliver dependable job-work solutions for industrial engineering manufacturers, machinery component suppliers, and precision jobbing shops.',
  mission: 'To deliver reliable, specification-conscious electroplating and surface finishing job work supporting manufacturing enterprises across Nashik.',
  values: 'Factual technical clarity, consistent surface treatment standards, and dependable industrial turnaround.',
  verifiedCapabilities: ['Electroplating Job Work', 'Industrial Metal Finishing'],
  googleMapsUrl: 'https://maps.google.com/?q=G-8,+MIDC+Ambad,+Nashik,+Maharashtra+422010',
  socialLinks: {
    linkedin: '',
    facebook: '',
    instagram: '',
    twitter: ''
  },
  seoDefaults: {
    metaTitle: 'Anant Metal Finishers (AMP) | Industrial Electroplating Job Work | MIDC Ambad, Nashik',
    metaDescription: 'Industrial electroplating and metal finishing job work for components in MIDC Ambad, Nashik, Maharashtra.'
  }
};

const SettingsContext = createContext({
  settings: defaultSettings,
  loading: true,
  refreshSettings: () => {}
});

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await settingsApi.getPublicSettings();
      if (response?.data) {
        setSettings(response.data);
      }
    } catch (err) {
      console.warn('Could not load dynamic settings from API, using default factual configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
