'use client';

import { motion } from 'framer-motion';
import { FadeIn } from '@/components/animations/FadeIn';
import { Globe, ExternalLink, Heart } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <FadeIn>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white font-black text-sm">P</span>
                </div>
                <span className="font-bold text-lg">Pole Position</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The ultimate Formula One companion. Built for fans, by fans.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#hero" className="hover:text-foreground transition-colors">
                    Current Race
                  </a>
                </li>
                <li>
                  <a href="#standings" className="hover:text-foreground transition-colors">
                    Standings
                  </a>
                </li>
                <li>
                  <a href="#calendar" className="hover:text-foreground transition-colors">
                    Calendar
                  </a>
                </li>
                <li>
                  <a href="#circuits" className="hover:text-foreground transition-colors">
                    Circuits
                  </a>
                </li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    API Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Data Sources
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="p-2.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="p-2.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn>
          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Pole Position. Not affiliated with Formula 1.</p>
            <p className="flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-primary" /> for F1 fans
            </p>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
