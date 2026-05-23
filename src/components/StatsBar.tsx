"use client";

import { useEffect, useState } from "react";
import { fmt } from "@/lib/utils";

interface StatsBarProps {
  refreshKey?: number;
}

export function StatsBar({ refreshKey }: StatsBarProps) {
  const [stats, setStats] = useState<Record<string, number>>({});
  
  useEffect(() => {
    fetch("/api/stats")
      .then(r => r.json())
      .then(j => setStats(j.stats ?? {}));
  }, [refreshKey]); // Re-fetch when refreshKey changes

  const cards = [
    { icon: "📡", label: "Total Site",    val: stats.total,          color: "blue" },
    { icon: "✅", label: "Aktif",         val: stats.aktif,          color: "emerald" },
    { icon: "❌", label: "Terminasi",     val: stats.terminasi,      color: "red" },
    { icon: "📋", label: "Sudah KIB",     val: stats.kib_sudah,      color: "emerald" },
    { icon: "⚠️", label: "Belum KIB",    val: stats.kib_belum,      color: "yellow" },
    { icon: "🌳", label: "Kaw. Hutan",   val: stats.kawasan_hutan,  color: "teal" },
    { icon: "📅", label: "Hibah 2026",   val: stats.hibah_2026,     color: "purple" },
    { icon: "💰", label: "Total Nilai",  val: null, raw: fmt(stats.total_nilai_kib ?? null), color: "blue" },
  ];
  
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50", emerald: "bg-emerald-50", red: "bg-red-50",
    yellow: "bg-yellow-50", teal: "bg-teal-50", purple: "bg-purple-50",
  };
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {cards.map(c => (
        <div key={c.label} className="card p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
          <div className={`w-10 h-10 ${colorMap[c.color]} rounded-xl flex items-center justify-center text-xl shrink-0`}>{c.icon}</div>
          <div>
            <div className="text-xl font-bold text-gray-900 leading-none">{c.raw ?? (c.val ?? 0)}</div>
            <div className="text-xs text-gray-500 mt-0.5">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
