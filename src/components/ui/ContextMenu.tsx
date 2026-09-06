"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContextMenuItem {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  danger?: boolean;
}

interface ContextMenuProps {
  open: boolean;
  onClose: () => void;
  items: ContextMenuItem[];
  anchorRect: DOMRect | null;
}

export function ContextMenu({ open, onClose, items, anchorRect }: ContextMenuProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  const top = anchorRect ? anchorRect.bottom + 8 : 0;
  const left = anchorRect ? anchorRect.left : 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -4 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 min-w-48 bg-surface-raised border border-wire-subtle
              rounded-xl shadow-2xl overflow-hidden"
            style={{ top, left }}
          >
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-sm text-left
                  transition-colors duration-100
                  ${
                    item.danger
                      ? "text-red-400 hover:bg-red-500/10"
                      : "text-text-primary hover:bg-surface-base"
                  }
                `}
              >
                <span className="w-5 h-5 shrink-0">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
