import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FileText,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sliders,
  ShieldAlert
} from 'lucide-react';
import { enquiryApi } from '../services/api';
import SEO from '../components/common/SEO';

const QuotePage = () => {
  const [searchParams] = useSearchParams();
  const prefilledService = searchParams.get('service') || 'Industrial Electroplating Job Work';

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const consent = formData.get('consent') === 'on';

    if (!consent) {
      setErrorMsg('Please accept the privacy policy consent before proceeding.');
      setLoading(false);
      return;
    }

    const payload = {
      name: formData.get('name')?.toString() || '',
      companyName: formData.get('companyName')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      phone: formData.get('phone')?.toString() || '',
      enquiryType: 'quote',
      relatedProductOrService: formData.get('componentName')?.toString() || prefilledService,
      message: formData.get('additionalNotes')?.toString() || `Quote requested for ${formData.get('componentName')}`,
      requirements: {
        componentName: formData.get('componentName')?.toString() || '',
        estimatedQuantity: formData.get('quantity')?.toString() || '',
        material: formData.get('material')?.toString() || '',
        requiredFinish: formData.get('requiredFinish')?.toString() || prefilledService,
        targetDate: formData.get('targetDate')?.toString() || '',
        additionalNotes: formData.get('additionalNotes')?.toString() || ''
      },
      consentGiven: true
    };

    try {
      const res = await enquiryApi.submitQuote(payload);
      if (res?.success) {
        setSuccessData({
          referenceNumber: res.referenceNumber,
          message: res.message
        });
        e.currentTarget.reset();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit quote request. Please check required fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Request a Job-Work Quote | Anant Metal Finishers (AMF) Nashik"
        description="Submit your industrial component specifications for electroplating job work review. Receive a factual feasibility assessment from our MIDC Ambad workshop."
      />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800">
            Official B2B Job-Work Quotation
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Request an Electroplating Job-Work Quote
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Share your component drawings, substrate metallurgy, and batch requirements. Our technical desk in MIDC Ambad, Nashik will evaluate bath feasibility and turnaround.
          </p>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 border-b border-slate-200 py-3 text-xs text-slate-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-700">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Request a Quote</span>
        </div>
      </div>

      {/* Main Quote Form Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
            {/* Process Explanation */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Commercial Evaluation Process:</span>
                We do not issue automated algorithmic prices. Every component requirement is manually assessed by our workshop personnel against drawing tolerances, chemical bath compatibility, and current production loading.
              </div>
            </div>

            {successData ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-xl space-y-5 text-emerald-900">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-emerald-950">Quote Request Submitted</h3>
                    <p className="text-xs text-emerald-700">{successData.message}</p>
                  </div>
                </div>

                <div className="p-5 bg-white rounded-xl border border-emerald-200 space-y-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Your Official Quote Reference Number:
                  </span>
                  <div className="text-2xl font-mono font-extrabold text-blue-700 tracking-wider">
                    {successData.referenceNumber}
                  </div>
                  <p className="text-xs text-slate-600">
                    Your submission is securely registered in our system. Please quote this reference code when discussing drawings or sending sample parts to our workshop.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setSuccessData(null)}
                    className="btn-secondary text-xs"
                  >
                    Submit Another Quote Request
                  </button>
                  <Link to="/" className="text-xs font-semibold text-blue-700 hover:text-blue-900">
                    Return to Homepage →
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Section 1: Contact Information */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-200 mb-4">
                    1. Customer / Organization Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Your Name"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Company Name / Manufacturing Unit
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        placeholder="E.g. Sahyadri Auto Ancillaries"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Official Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="procurement@company.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Mobile / Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+91 98XXX XXXXX"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        Required for technical specification discussion
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Component Specifications */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-200 mb-4">
                    2. Component &amp; Job-Work Requirements
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-medium text-slate-700 mb-1">
                        Component or Part Name *
                      </label>
                      <input
                        type="text"
                        name="componentName"
                        required
                        defaultValue={prefilledService}
                        placeholder="E.g. M16 Hex Studs / Flange Bushing / Gear Shaft"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Estimated Batch Quantity
                      </label>
                      <input
                        type="text"
                        name="quantity"
                        placeholder="E.g. 5,000 pcs per month or 50 pcs trial"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Base Substrate / Metal Grade
                      </label>
                      <input
                        type="text"
                        name="material"
                        placeholder="E.g. Mild Steel EN1A, EN8, Cast Iron, Brass"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Desired Surface Finish / Treatment
                      </label>
                      <input
                        type="text"
                        name="requiredFinish"
                        placeholder="E.g. Electroplating Job Work / Metal Finishing"
                        defaultValue={prefilledService}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Target Completion Date (Optional)
                      </label>
                      <input
                        type="date"
                        name="targetDate"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium text-slate-700 mb-1">
                        Additional Technical Details / Drawing Notes
                      </label>
                      <textarea
                        name="additionalNotes"
                        rows="4"
                        placeholder="Describe drawing tolerances, critical contact points, thickness requirements, or special packaging needs."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Consent & Submission */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      name="consent"
                      required
                      className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>
                      I understand that Anant Metal Finishers will manually evaluate these component specifications to assess shop feasibility, and I consent to storing this enquiry under the{' '}
                      <Link to="/privacy-policy" className="text-blue-700 underline" target="_blank">
                        Privacy Notice
                      </Link>
                      . *
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-accent w-full justify-center text-sm sm:text-base py-3.5 shadow-md font-bold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      <span>Recording Quote Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Request for Quotation</span>
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default QuotePage;
