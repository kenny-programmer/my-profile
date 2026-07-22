"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import GameZone from "./game-zone";

export default function GameButtonModal() {
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsGameOpen(true)}
        className="text-[10px] sm:text-xs font-bold text-muted-foreground hover:text-foreground border border-border bg-background px-3 py-1.5 rounded-full shadow-sm transition-all hover:scale-105 hover:bg-muted cursor-pointer whitespace-nowrap mt-1"
      >
        (Play Slime Slayer)
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {isGameOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              {/* Animated Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-3xl z-50 shadow-2xl"
              >
                {/* Close Button on Modal */}
                <button
                  onClick={() => setIsGameOpen(false)}
                  className="absolute top-4 right-4 z-50 p-2 bg-slate-900/80 hover:bg-slate-800 rounded-full border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer shadow-md"
                  title="Close Game"
                >
                  <X className="size-4.5" />
                </button>

                <GameZone onClose={() => setIsGameOpen(false)} />
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
