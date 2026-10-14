import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { enquiryApi } from '../services/api';
import SEO from '../components/common/SEO';

const ContactPage = () => {
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name')?.toString() || '',
      companyName: formData.get('companyName')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      phone: formData.get('phone')?.toString() || '',
      enquiryType: formData.get('enquiryType')?.toString() || 'contact',
      relatedProductOrService: formData.get('service')?.toString() || '',
      message: formData.get('message')?.toString() || '',
      consentGiven: formData.get('consent') === 'on'
    };

    if (!payload.consentGiven) {
      setErrorMsg('You must consent to the privacy notice before submitting your enquiry.');
      setLoading(false);
      return;
    }

    try {
      const res = await enquiryApi.submitContact(payload);
      if (res?.success) {
        setSuccessData({
          referenceNumber: res.referenceNumber,
          message: 'Thank you. Your message has been received.'
        });
        e.currentTarget.reset();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit enquiry. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us | Anant Metal Finishers (AMF) Nashik"
        description="Get in touch with Anant Metal Finishers (AMF) at G-8, MIDC Ambad, Nashik, Maharashtra – 422010. Submit an enquiry for electroplating job work."
      />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-blue-900/60 px-2.5 py-1 rounded border border-blue-700/60">
              Get In Touch
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              Contact Anant Metal Finishers
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              Reach our industrial workshop in MIDC Ambad, Nashik for electroplating job work, component feasibility, and commercial enquiries.
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 border-b border-slate-200 py-3 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-700">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Contact Us</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left 5 Cols: Workshop & Verified Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    Verified Location
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">
                    Anant Metal Finishers (AMF)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Industrial metal finishing and electroplating job work facility.
                  </p>
                </div>

                <div className="space-y-4 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-semibold">Workshop Address:</strong>
                      <span>G-8, MIDC Ambad, Nashik, Maharashtra, India – 422010</span>
                    </div>
                  </div>

                  {settings.phone ? (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-slate-900 font-semibold">Phone:</strong>
                        <a href={`tel:${settings.phone}`} className="hover:text-blue-700">
                          {settings.phone}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      Direct telephone number will be published once officially confirmed by company administrator.
                    </div>
                  )}

                  {settings.email ? (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-slate-900 font-semibold">Email:</strong>
                        <a href={`mailto:${settings.email}`} className="hover:text-blue-700">
                          {settings.email}
                        </a>
                      </div>
                    </div>
                  ) : null}

                  {settings.workingHours ? (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-slate-900 font-semibold">Working Hours:</strong>
                        <span>{settings.workingHours}</span>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Map Directions Action */}
                <div className="pt-2 border-t border-slate-100">
                  <a
                    href={settings.googleMapsUrl || 'https://maps.google.com/?q=G-8,+MIDC+Ambad,+Nashik,+Maharashtra+422010'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full justify-center text-xs gap-2"
                  >
                    <span>View Directions on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Quote CTA Promotion Card */}
              <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white p-6 rounded-2xl border border-blue-800 space-y-3">
                <span className="text-xs font-semibold text-sky-300 uppercase tracking-wider block">
                  Need a Detailed Quote?
                </span>
                <h3 className="text-lg font-bold">Have Specific Part Drawings?</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  If you have component quantities, drawing tolerances, and target dates ready, use our dedicated Request a Quote workflow.
                </p>
                <Link
                  to="/quote"
                  className="btn-accent text-xs w-full justify-center"
                >
                  Open Quote Request Form →
                </Link>
              </div>
            </div>

            {/* Right 7 Cols: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Send an Industrial Enquiry
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill out the form below. All enquiries are recorded securely with an audit reference number.
                  </p>
                </div>

                {successData ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl space-y-4 text-emerald-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-emerald-950 text-base">Thank you. Your message has been received.</h3>
                        <p className="text-xs text-emerald-700">Our operations team will review your enquiry.</p>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-lg border border-emerald-200 space-y-1">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                        Your Official Reference Number:
                      </span>
                      <div className="text-lg font-mono font-bold text-blue-700">
                        {successData.referenceNumber}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Please save this reference code. Our operations team reviews incoming enquiries against workshop capacity.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSuccessData(null)}
                      className="btn-secondary text-xs"
                    >
                      Submit Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                    {errorMsg && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium text-slate-700 mb-1">
                          Full Name *
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
                          Company / Organization
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          placeholder="E.g. Precision Gears Pvt Ltd"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium text-slate-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="name@company.com"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-slate-700 mb-1">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+91 98XXX XXXXX"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium text-slate-700 mb-1">
                          Enquiry Type
                        </label>
                        <select
                          name="enquiryType"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                        >
                          <option value="contact">General Inquiry</option>
                          <option value="quote">Job-Work Quotation</option>
                          <option value="general">Facility / Logistics</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-medium text-slate-700 mb-1">
                          Service of Interest
                        </label>
                        <input
                          type="text"
                          name="service"
                          placeholder="E.g. Industrial Electroplating Job Work"
                          defaultValue="Industrial Electroplating Job Work"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Message / Component Requirements *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows="4"
                        placeholder="Please describe your component type, base material, batch frequency, or questions."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      ></textarea>
                    </div>

                    {/* Privacy Notice Consent */}
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                        <input
                          type="checkbox"
                          name="consent"
                          required
                          className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>
                          I consent to Anant Metal Finishers storing and reviewing this enquiry data to respond to my business request, in accordance with the{' '}
                          <Link to="/privacy-policy" className="text-blue-700 underline" target="_blank">
                            Privacy Policy
                          </Link>
                          . *
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full justify-center text-sm py-3"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          <span>Submitting Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Business Enquiry</span>
                          <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
