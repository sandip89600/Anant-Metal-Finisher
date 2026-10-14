import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  Send,
  Loader2,
  Calendar,
  Building
} from 'lucide-react';
import { productsApi, enquiryApi } from '../services/api';
import SEO from '../components/common/SEO';
import { DetailSkeleton } from '../components/common/LoadingSkeleton';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quick Inline Enquiry Form State
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(null);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await productsApi.getProductBySlug(slug);
        if (res?.data) {
          setItem(res.data);
          if (res.related) setRelated(res.related);
        } else {
          setError('Product or service not found or currently unverified.');
        }
      } catch (err) {
        setError(err.message || 'Product or service not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleInlineEnquirySubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name')?.toString() || '',
      companyName: formData.get('companyName')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      phone: formData.get('phone')?.toString() || '',
      enquiryType: 'quote',
      relatedProductOrService: item?.name || 'Metal Finishing',
      message: `Quote enquiry for ${item?.name}: ${formData.get('notes')?.toString() || ''}`,
      requirements: {
        componentName: item?.name || 'Component Finishing',
        estimatedQuantity: formData.get('quantity')?.toString() || '',
        material: formData.get('material')?.toString() || '',
        requiredFinish: item?.name || '',
        additionalNotes: formData.get('notes')?.toString() || ''
      },
      consentGiven: true
    };

    try {
      const res = await enquiryApi.submitQuote(payload);
      if (res?.success) {
        setFormSuccess({
          referenceNumber: res.referenceNumber,
          message: res.message
        });
        e.currentTarget.reset();
      }
    } catch (err) {
      setFormError(err.message || 'Failed to submit quote enquiry. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !item) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Service Not Available</h1>
        <p className="text-slate-600 text-sm">{error || 'This service listing is not currently verified or published.'}</p>
        <Link to="/products" className="btn-primary text-xs inline-flex">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={item.seoTitle || `${item.name} | Anant Metal Finishers`}
        description={item.seoDescription || item.summary}
      />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-300 bg-blue-900/80 px-2.5 py-1 rounded">
                {item.category}
              </span>
              <span className="badge-verified bg-emerald-950/80 text-emerald-400 border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Capability</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {item.name}
            </h1>

            <p className="text-slate-300 text-base leading-relaxed">
              {item.summary}
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 border-b border-slate-200 py-3 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-700">Home</Link>
          <span>/</span>
          <Link to="/capabilities" className="hover:text-blue-700">Capabilities</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{item.name}</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left 8 Cols: Detailed Description & Technical Specifications */}
            <div className="lg:col-span-8 space-y-10">
              {/* Detailed Description */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
                  Service Description &amp; Job-Work Scope
                </h2>
                <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
                  {item.description.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Compatible Materials */}
              {item.materials?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900">
                    Compatible Base Materials &amp; Components
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.materials.map((mat, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg font-medium border border-slate-200"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Specifications Table */}
              {item.technicalSpecs?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900">
                    Technical Evaluation Parameters
                  </h3>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Parameter</th>
                          <th className="px-4 py-3 font-semibold">Workshop Standard</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {item.technicalSpecs.map((spec, index) => (
                          <tr key={index} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-medium text-slate-900 bg-slate-50/30 w-1/3">
                              {spec.label}
                            </td>
                            <td className="px-4 py-3 text-slate-700">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Availability Notice */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-900 block">Capability &amp; Capacity Notice:</span>
                <p>
                  {item.availabilityNotes ||
                    'All electroplating job work is accepted based on prior physical inspection or component drawing review. Turnaround schedules are confirmed at the time of quotation.'}
                </p>
              </div>

              {/* Related Services */}
              {related.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-slate-200">
                  <h3 className="text-base font-bold text-slate-900">
                    Other Verified Capabilities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {related.map((rel) => (
                      <Link
                        key={rel._id}
                        to={`/products/${rel.slug}`}
                        className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-sm transition-all group block bg-slate-50/50"
                      >
                        <span className="text-xs font-semibold text-blue-700 mb-1 block">
                          {rel.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {rel.name}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {rel.summary}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 Cols: Quick Job-Work Enquiry Box */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/60 px-2.5 py-0.5 rounded border border-blue-200">
                    Direct Job-Work Enquiry
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">
                    Enquire for {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Share your component details for feasibility feedback and commercial estimates.
                  </p>
                </div>

                {formSuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-800">
                    <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Enquiry Recorded!</span>
                    </div>
                    <p>{formSuccess.message}</p>
                    <div className="p-2 bg-white rounded border border-emerald-200 font-mono text-center font-bold text-emerald-700 text-sm">
                      Ref: {formSuccess.referenceNumber}
                    </div>
                    <p className="text-[11px] text-emerald-600">
                      Please note this reference number for all future communication.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleInlineEnquirySubmit} className="space-y-3.5 text-xs">
                    {formError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {formError}
                      </div>
                    )}

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Your Name"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Company Name (Optional)
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        placeholder="E.g. Precision Engineering Works"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="procurement@company.com"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+91 98XXX XXXXX"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-medium text-slate-700 mb-1">
                          Est. Quantity
                        </label>
                        <input
                          type="text"
                          name="quantity"
                          placeholder="E.g. 500 pcs/mo"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-slate-700 mb-1">
                          Base Metal
                        </label>
                        <input
                          type="text"
                          name="material"
                          placeholder="E.g. Mild Steel"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Component Notes / Dimensions
                      </label>
                      <textarea
                        name="notes"
                        rows="3"
                        placeholder="Mention critical drawing tolerances, finish requirements, etc."
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      ></textarea>
                    </div>

                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={formSubmitting}
                        className="w-full btn-accent justify-center text-xs py-2.5 shadow"
                      >
                        {formSubmitting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                            <span>Submitting Enquiry...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Job-Work Enquiry</span>
                            <Send className="w-3.5 h-3.5 ml-1.5" />
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 text-center">
                      Your enquiry will be recorded securely in our database.
                    </p>
                  </form>
                )}

                <div className="border-t border-slate-200 pt-3 text-[11px] text-slate-500 space-y-1">
                  <span className="font-semibold block text-slate-700">Workshop Location:</span>
                  <p>Plot G-8, MIDC Ambad, Nashik, Maharashtra – 422010</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetailPage;
