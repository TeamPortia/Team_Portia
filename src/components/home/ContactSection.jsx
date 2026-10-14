// src/components/home/ContactSection.jsx
import React, { useState } from "react";
import { useData } from "../../contexts/DataContext";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Button } from "../common/Button";
import toast from "react-hot-toast";

export const ContactSection = () => {
  const { teamSettings, sendContactMessage } = useData();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      if (sendContactMessage) {
        await sendContactMessage(formData);
      }
      setSubmitted(true);
      toast.success("Thank you! Your message has been sent to our team.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
            <Mail className="w-3.5 h-3.5" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Let's Collaborate On Your Next Big Project
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Have a project idea, partnership inquiry, or technical question? Reach out to our engineering lead team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-gray-950 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <h3 className="text-2xl font-bold mb-3">Team HQ & Channels</h3>
            <p className="text-xs text-indigo-200/80 mb-8 leading-relaxed">
              We respond promptly to all developer inquiries, project proposals, and open source collaboration requests.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-indigo-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-indigo-200">Email Address</p>
                  <a
                    href={`mailto:${teamSettings?.contactEmail || "inovexatechnologies2026@gmail.com"}`}
                    className="text-sm font-semibold text-white hover:text-indigo-300 transition"
                  >
                    {teamSettings?.contactEmail || "inovexatechnologies2026@gmail.com"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-indigo-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-indigo-200">Direct Phone</p>
                  <p className="text-sm font-semibold text-white">
                    {teamSettings?.contactPhone || "+91 98765 43210"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-indigo-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-indigo-200">Innovation Center</p>
                  <p className="text-sm font-semibold text-white leading-snug">
                    {teamSettings?.address || "Innovation Valley Tech Park, Sector 4"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-indigo-300">
              <span>Timezone: IST (UTC +5:30)</span>
              <span>Mon – Sat (9am - 7pm)</span>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/80 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">Message Sent Successfully!</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Thank you for reaching out. One of our engineers or team coordinators will reply shortly.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Miller"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="david@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Subject / Project Domain
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AI Application Architecture Inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your requirements, project timeline, or collaboration ideas..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <Button type="submit" loading={loading} icon={Send} className="w-full sm:w-auto">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
