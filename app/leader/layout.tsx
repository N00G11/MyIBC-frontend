import type React from "react";
import { LeaderHeader } from "@/components/leader/leader-header";

export default function LeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <LeaderHeader />
      <main className="container mx-auto px-4 py-6 max-w-6xl">{children}</main>
    </div>
  );
}
