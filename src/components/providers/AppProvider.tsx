"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Sidebar } from "@/components/navigation/Sidebar";

export function AppProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isFullscreen = pathname.startsWith("/present/");

  if (isFullscreen) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <div className="lg:pl-64 min-h-screen pb-20 lg:pb-0">
        {children}
      </div>
      <BottomNav />
    </>
  );
}
