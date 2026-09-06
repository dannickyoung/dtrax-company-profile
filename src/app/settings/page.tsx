"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";

export default function SettingsPage() {
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const handleClearData = async () => {
    const { db } = await import("@/lib/db");
    await db.delete();
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-surface-deepest">
      <div className="max-w-xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-text-primary mb-8">Settings</h1>

        <div className="space-y-4">
          <Card>
            <h2 className="text-sm font-medium text-text-secondary mb-1">
              Event Decks
            </h2>
            <p className="text-sm text-text-muted mb-3">
              Premium event presentation dashboard
            </p>
            <p className="text-2xs text-text-muted">Version 1.0.0</p>
          </Card>

          <Card>
            <h2 className="text-sm font-medium text-red-400 mb-3">
              Danger Zone
            </h2>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setClearDialogOpen(true)}
            >
              Clear All Data
            </Button>
          </Card>
        </div>
      </div>

      <Dialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        title="Clear All Data"
        actions={
          <>
            <Button variant="ghost" onClick={() => setClearDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleClearData}>
              Clear Everything
            </Button>
          </>
        }
      >
        <p>
          This will permanently delete all presentations, slides, and media.
          This action cannot be undone.
        </p>
      </Dialog>
    </main>
  );
}
