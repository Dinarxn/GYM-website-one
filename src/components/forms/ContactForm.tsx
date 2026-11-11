'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export type FormStatus = 'idle' | 'validating' | 'submitting' | 'success' | 'error';

export interface ContactFormValues {
  fullName: string;
  phone: string;
  email: string;
  membershipInterest: 'starter' | 'pro' | 'elite' | 'personal-training';
  message: string;
}

export interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  membershipInterest?: string;
  message?: string;
}

const INITIAL_VALUES: ContactFormValues = {
  fullName: '',
  phone: '',
  email: '',
  membershipInterest: 'pro',
  message: '',
};

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [submittedData, setSubmittedData] = useState<ContactFormValues | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!values.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    } else if (values.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(values.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    const phoneRegex = /^[+]?[0-9\s().-]{7,50}$/;
    if (!values.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (values.phone.trim().length < 7 || !phoneRegex.test(values.phone.trim())) {
      newErrors.phone = 'Please provide a valid phone number (min 7 digits).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('validating');

    const isValid = validate();
    if (!isValid) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    // Simulate genuine async network dispatch for demo mode
    setTimeout(() => {
      setSubmittedData({ ...values });
      setStatus('success');
    }, 900);
  };

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setStatus('idle');
    setSubmittedData(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-[#0E0E14] border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      {/* Violet Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-32 w-80 h-80 bg-[#7D39EB]/15 rounded-full blur-3xl"
      />

      {/* Demo Mode Notice */}
      <div className="mb-6 p-4 rounded-xl bg-[#7D39EB]/10 border border-[#7D39EB]/30 flex items-start gap-3">
        <Badge variant="demo" size="sm" className="mt-0.5 shrink-0">
          DEMO MODE
        </Badge>
        <p className="text-xs text-[#9E9EAF] leading-relaxed">
          Submissions are simulated for client demonstration. In production, this form connects to your CRM, webhook, or email pipeline.
        </p>
      </div>

      {status === 'success' && submittedData ? (
        <div
          role="status"
          aria-live="polite"
          className="text-center py-8 animate-in fade-in duration-300"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#C6FF33]/15 border border-[#C6FF33] flex items-center justify-center text-[#C6FF33]">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black uppercase text-white mb-2">
            Enquiry Dispatched!
          </h3>
          <p className="text-sm text-[#9E9EAF] max-w-md mx-auto mb-6">
            Thank you, <strong className="text-white">{submittedData.fullName}</strong>. Your request for the{' '}
            <strong className="text-[#C6FF33] uppercase">
              {submittedData.membershipInterest}
            </strong>{' '}
            tier has been recorded in demonstration mode.
          </p>

          <div className="bg-black/60 rounded-xl p-4 text-left border border-white/10 mb-6 text-xs text-[#9E9EAF] space-y-1 font-mono">
            <div>
              <span className="text-white">Email:</span> {submittedData.email}
            </div>
            <div>
              <span className="text-white">Phone:</span> {submittedData.phone}
            </div>
            <div>
              <span className="text-white">Interest:</span> {submittedData.membershipInterest}
            </div>
            {submittedData.message && (
              <div>
                <span className="text-white">Message:</span> {submittedData.message}
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="glass"
            size="md"
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={handleReset}
          >
            Submit Another Enquiry
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {status === 'error' && Object.keys(errors).length > 0 && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Please resolve the highlighted validation issues below.</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-xs font-bold uppercase tracking-wider text-[#9E9EAF] mb-2"
            >
              Full Name <span className="text-[#C6FF33]">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={values.fullName}
              onChange={handleChange}
              disabled={status === 'submitting'}
              placeholder="e.g. Marcus Vance"
              className={`w-full px-4 py-3 rounded-xl bg-black border text-white placeholder-white/30 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6FF33] transition-colors ${
                errors.fullName ? 'border-red-500' : 'border-white/15 focus:border-[#C6FF33]'
              }`}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            />
            {errors.fullName && (
              <p id="fullName-error" className="text-xs text-red-400 mt-1.5">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Phone & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-bold uppercase tracking-wider text-[#9E9EAF] mb-2"
              >
                Phone Number <span className="text-[#C6FF33]">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                disabled={status === 'submitting'}
                placeholder="+1 (555) 000-0000"
                className={`w-full px-4 py-3 rounded-xl bg-black border text-white placeholder-white/30 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6FF33] transition-colors ${
                  errors.phone ? 'border-red-500' : 'border-white/15 focus:border-[#C6FF33]'
                }`}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className="text-xs text-red-400 mt-1.5">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-[#9E9EAF] mb-2"
              >
                Email Address <span className="text-[#C6FF33]">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                disabled={status === 'submitting'}
                placeholder="athlete@ironforge.com"
                className={`w-full px-4 py-3 rounded-xl bg-black border text-white placeholder-white/30 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6FF33] transition-colors ${
                  errors.email ? 'border-red-500' : 'border-white/15 focus:border-[#C6FF33]'
                }`}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-red-400 mt-1.5">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Membership Interest */}
          <div>
            <label
              htmlFor="membershipInterest"
              className="block text-xs font-bold uppercase tracking-wider text-[#9E9EAF] mb-2"
            >
              Membership Interest <span className="text-[#C6FF33]">*</span>
            </label>
            <select
              id="membershipInterest"
              name="membershipInterest"
              value={values.membershipInterest}
              onChange={handleChange}
              disabled={status === 'submitting'}
              className="w-full px-4 py-3 rounded-xl bg-black border border-white/15 text-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6FF33] transition-colors"
            >
              <option value="starter">Starter Iron ($79/mo) — Access & Platforms</option>
              <option value="pro">Pro Athlete ($149/mo) — 24/7 & Contrast Recovery</option>
              <option value="elite">Elite Mastery ($249/mo) — Dedicated Coaching & VIP</option>
              <option value="personal-training">1-on-1 Bespoke Personal Coaching</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-xs font-bold uppercase tracking-wider text-[#9E9EAF] mb-2"
            >
              Training Goals & Message (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              value={values.message}
              onChange={handleChange}
              disabled={status === 'submitting'}
              placeholder="Tell us about your current lifting numbers, athletic background, or specific training goals..."
              className="w-full px-4 py-3 rounded-xl bg-black border border-white/15 text-white placeholder-white/30 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6FF33] transition-colors"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={status === 'submitting'}
            icon={<Send className="w-4 h-4" />}
          >
            {status === 'submitting' ? 'Submitting Enquiry...' : 'Claim 3-Day Trial Pass'}
          </Button>
        </form>
      )}
    </div>
  );
}
