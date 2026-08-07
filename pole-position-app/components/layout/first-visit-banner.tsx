"use client";

import { usePreferences } from "@/store/preferences";
import { detectTimezone } from "@/lib/time";
import { Button } from "@/components/ui/button";
import { Globe, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export function FirstVisitBanner() {
  const { bannerDismissed, dismissBanner, setTimezone, firstVisitDone, markFirstVisitDone } =
    usePreferences();
  const [detected] = useState(() => detectTimezone());

  if (firstVisitDone || bannerDismissed || !detected) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -80, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-4 left-1/2 z-50 -translate-x-1/2 max-w-lg w-full mx-4"
      >
        <div className="rounded-2xl border border-border bg-elevated p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-electric-blue/10">
              <Globe className="h-5 w-5 text-electric-blue" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                We detected your timezone as{" "}
                <span className="text-electric-blue">{detected}</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Want to use it for all race times?
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setTimezone(detected);
                  markFirstVisitDone();
                }}
              >
                Use {detected.split("/").pop()?.replace(/_/g, " ")}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  dismissBanner();
                  markFirstVisitDone();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
