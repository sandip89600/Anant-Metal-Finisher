import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const PrivacyPolicyPage = () => {
  return (
    <>
      <SEO
        title="Privacy Policy | Anant Metal Finishers (AMF)"
        description="Privacy policy and data handling practices for business enquiries at Anant Metal Finishers, MIDC Ambad, Nashik."
      />

      <section className="bg-slate-900 text-white py-12 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-slate-300 text-sm mt-2">
            Last Updated: October 2026 • Anant Metal Finishers (AMF), MIDC Ambad, Nashik
          </p>
        </div>
      </section>

      <div className="bg-slate-100 border-b border-slate-200 py-3 text-xs text-slate-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-700">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Privacy Policy</span>
        </div>
      </div>

      <main className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate text-sm sm:text-base leading-relaxed space-y-6 text-slate-700">
          <h2>1. Introduction</h2>
          <p>
            Anant Metal Finishers ("AMF", "we", "our") respects your privacy. This policy outlines how we handle commercial business enquiries and quote requests submitted through our website.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            When you contact us or request a job-work quotation, we collect:
          </p>
          <ul>
            <li>Contact details: Name, company or business name, email address, and phone number.</li>
            <li>Component specifications: Part names, quantities, base materials, surface finish notes, and drawing specifications.</li>
            <li>Technical data: IP address and submission timestamps for spam prevention and enquiry reference integrity.</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>
            Information submitted is strictly utilized to:
          </p>
          <ul>
            <li>Assess manufacturing feasibility for electroplating and metal finishing job work.</li>
            <li>Prepare and communicate commercial quotations and lead-time feedback.</li>
            <li>Coordinate technical drawing clarifications and sample evaluations.</li>
          </ul>

          <h2>4. Data Protection &amp; Confidentiality</h2>
          <p>
            We do not sell, rent, or trade your contact information. Customer drawings and component specifications are held in commercial confidence strictly for job-work evaluation.
          </p>

          <h2>5. Contact for Inquiries</h2>
          <p>
            If you have questions regarding this privacy policy or wish to update your recorded information, contact Anant Metal Finishers at Plot G-8, MIDC Ambad, Nashik, Maharashtra – 422010.
          </p>
        </div>
      </main>
    </>
  );
};

export default PrivacyPolicyPage;
