import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const TermsPage = () => {
  return (
    <>
      <SEO
        title="Terms &amp; Conditions | Anant Metal Finishers (AMP)"
        description="Standard job-work evaluation and inquiry terms for Anant Metal Finishers, MIDC Ambad, Nashik."
      />

      <section className="bg-slate-900 text-white py-12 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight">Terms &amp; Conditions</h1>
          <p className="text-slate-300 text-sm mt-2">
            Last Updated: October 2026 • Anant Metal Finishers (AMP)
          </p>
        </div>
      </section>

      <div className="bg-slate-100 border-b border-slate-200 py-3 text-xs text-slate-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-700">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Terms &amp; Conditions</span>
        </div>
      </div>

      <main className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate text-sm sm:text-base leading-relaxed space-y-6 text-slate-700">
          <h2>1. Scope of Website</h2>
          <p>
            This website provides commercial information regarding industrial electroplating and metal finishing job work provided by Anant Metal Finishers (G-8, MIDC Ambad, Nashik, Maharashtra). Content is intended for manufacturing businesses, engineering procurement teams, and industrial component suppliers.
          </p>

          <h2>2. Quotations and Job-Work Feasibility</h2>
          <p>
            Submission of an enquiry or quote request does not constitute a binding contract. Binding contracts and official purchase orders are established only after component drawing review, verification of base metallurgy, and agreement on commercial terms.
          </p>

          <h2>3. Intellectual Property and Technical Drawings</h2>
          <p>
            All proprietary trademarks, text, and structural design on this website belong to Anant Metal Finishers. Customer engineering drawings and design data submitted via quote forms remain the intellectual property of the respective customer.
          </p>

          <h2>4. Applicable Jurisdiction</h2>
          <p>
            Any commercial disputes or inquiries arising from business relationships with Anant Metal Finishers are subject to the exclusive jurisdiction of the competent courts in Nashik, Maharashtra, India.
          </p>
        </div>
      </main>
    </>
  );
};

export default TermsPage;
