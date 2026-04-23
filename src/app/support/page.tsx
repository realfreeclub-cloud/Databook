"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MessageCircle, Send, CheckCircle2, User, MessageSquare } from "lucide-react";

export default function SupportPage() {
  const [formData, setFormData] = useState({ name: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const contactNumber = "+919140946121";
  const whatsappNumber = "919140946121";
  const emailAddress = "devraj@lotusloop.in";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setFormData({ name: "", message: "" });
    }, 1500);
  };

  return (
    <main className="flex flex-col min-h-screen p-6 pt-10 pb-24">
      <header className="flex items-center mb-8 space-x-3">
        <Link href="/" className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Support</h1>
          <p className="text-muted-foreground text-sm">We're here to help you</p>
        </div>
      </header>

      {/* Contact Cards */}
      <div className="grid gap-4 mb-10">
        <div className="flex gap-4 p-5 bg-white border border-border rounded-2xl shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl h-fit">
            <Phone size={24} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Call Us</p>
            <p className="font-bold text-foreground mb-3">+91 9140946121</p>
            <a 
              href={`tel:${contactNumber}`}
              className="inline-flex items-center text-sm font-bold text-primary hover:underline"
            >
              Start Call
            </a>
          </div>
        </div>

        <div className="flex gap-4 p-5 bg-white border border-border rounded-2xl shadow-sm">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl h-fit">
            <MessageCircle size={24} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">WhatsApp</p>
            <p className="font-bold text-foreground mb-3">+91 9140946121</p>
            <a 
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-bold text-green-600 hover:underline"
            >
              Chat Now
            </a>
          </div>
        </div>

        <div className="flex gap-4 p-5 bg-white border border-border rounded-2xl shadow-sm">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl h-fit">
            <Mail size={24} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Email</p>
            <p className="font-bold text-foreground mb-3">{emailAddress}</p>
            <a 
              href={`mailto:${emailAddress}`}
              className="inline-flex items-center text-sm font-bold text-amber-600 hover:underline"
            >
              Send Email
            </a>
          </div>
        </div>
      </div>

      {/* Support Form */}
      <section className="bg-white border border-border rounded-3xl p-6 shadow-sm overflow-hidden relative">
        <h2 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
          <MessageSquare size={20} className="text-primary" />
          Send a Message
        </h2>

        {isSubmitted ? (
          <div className="py-10 flex flex-col items-center text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Thank you for reaching out. Our team will get back to you shortly.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="text-primary font-bold text-sm hover:underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Your Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-11 pr-4 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Issue Message
              </label>
              <textarea
                id="message"
                placeholder="Describe your issue or feedback..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full p-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary text-primary-foreground font-bold text-lg rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? "Sending..." : (
                <>
                  <Send size={18} />
                  Submit Request
                </>
              )}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
