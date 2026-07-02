'use client';

import { useState } from 'react';
import { FadeIn } from '@/components/animations';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Subscription failed');
      }

      setStatus('success');
      setMessage('You\'re subscribed! Check your inbox for confirmation.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    }
  };

  return (
    <section id="newsletter" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Stay <span className="text-gradient-primary">Informed</span>
            </h2>
            <p className="text-muted-foreground">
              Get race reminders and exclusive updates delivered to your inbox
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <motion.div
            className="max-w-md mx-auto glass-card rounded-xl p-6 sm:p-8"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-12 h-12 rounded-full bg-[#e10600]/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-[#e10600]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== 'idle') setStatus('idle');
                  }}
                  placeholder="your@email.com"
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-white/10 focus:border-[#e10600]/50 focus:outline-none text-sm transition-colors disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="w-full px-6 py-3 rounded-lg bg-[#e10600] hover:bg-[#e10600]/90 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <motion.div
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                ) : status === 'success' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Subscribed
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Subscribe
                  </>
                )}
              </button>

              {message && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-xs text-center flex items-center justify-center gap-1 ${status === 'success' ? 'text-[#00d084]' : 'text-red-400'}`}
                >
                  {status === 'success' ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  {message}
                </motion.p>
              )}
            </form>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
