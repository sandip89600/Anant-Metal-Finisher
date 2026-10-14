import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

const SEO = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage,
  structuredData
}) => {
  const { settings } = useSettings();
  const location = useLocation();

  const siteTitle = settings.companyName || 'Anant Metal Finishers';
  const pageTitle = title ? `${title} | ${siteTitle}` : (settings.seoDefaults?.metaTitle || `${siteTitle} | Electroplating Job Work`);
  const metaDescription = description || settings.seoDefaults?.metaDescription || 'Industrial electroplating and metal finishing job work for components in G-8, MIDC Ambad, Nashik, Maharashtra.';
  const currentUrl = canonicalUrl || `https://anantmetalfinishers.com${location.pathname}`;

  useEffect(() => {
    // Set document title
    document.title = pageTitle;

    // Update meta description
    let metaDescTag = document.querySelector('meta[name="description"]');
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta');
      metaDescTag.setAttribute('name', 'description');
      document.head.appendChild(metaDescTag);
    }
    metaDescTag.setAttribute('content', metaDescription);

    // Update canonical link
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', currentUrl);

    // Update OpenGraph tags
    const setOgMeta = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setOgMeta('og:title', pageTitle);
    setOgMeta('og:description', metaDescription);
    setOgMeta('og:url', currentUrl);
    setOgMeta('og:type', ogType);

    // Default LocalBusiness JSON-LD (strictly factual details only)
    const baseLocalBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Anant Metal Finishers',
      alternateName: 'AMF',
      description: 'Industrial electroplating and metal finishing job work facility.',
      url: 'https://anantmetalfinishers.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'G-8, MIDC Ambad',
        addressLocality: 'Nashik',
        addressRegion: 'Maharashtra',
        postalCode: '422010',
        addressCountry: 'IN'
      },
      hasMap: 'https://maps.google.com/?q=G-8,+MIDC+Ambad,+Nashik,+Maharashtra+422010'
    };

    if (settings.phone) {
      baseLocalBusinessSchema.telephone = settings.phone;
    }

    const activeSchema = structuredData || baseLocalBusinessSchema;

    let scriptTag = document.getElementById('amf-structured-data');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'amf-structured-data';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(activeSchema);

  }, [pageTitle, metaDescription, currentUrl, ogType, settings, structuredData]);

  return null;
};

export default SEO;
