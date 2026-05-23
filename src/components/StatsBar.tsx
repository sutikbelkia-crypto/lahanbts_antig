"use client";

import { useEffect, useState } from "react";
import { fmt } from "@/lib/utils";

interface StatsBarProps {
  refreshKey?: number;
}

export function StatsBar({ refreshKey }: StatsBarProps) {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    // Add cache busting with timestamp to force fresh data
    const timestamp = Date.now();
    fetch(`/api/stats?t=${timestamp}`, { cache: "no-store" })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(j => {
        console.log("✅ StatsBar: Data fetched", j.stats);
        setStats(j.stats ?? {});
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ StatsBar: Error fetching stats:", err);
        setLoading(false);
      });
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
    blue: "bg-blue-50 border-blue-200", 
    emerald: "bg-emerald-50 border-emerald-200", 
    red: "bg-red-50 border-red-200",
    yellow: "bg-yellow-50 border-yellow-200", 
    teal: "bg-teal-50 border-teal-200", 
    purple: "bg-purple-50 border-purple-200",
  };
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
      {cards.map(c => (
        <div 
          key={c.label} 
          className={`card p-3 sm:p-4 flex flex-col items-start gap-2 hover:-translate-y-0.5 transition-transform border ${colorMap[c.color]} ${loading ? 'opacity-50' : ''}`}
        >
          <div className="text-lg sm:text-xl">{c.icon}</div>
          <div className="w-full">
            <div className="text-lg sm:text-xl font-bold text-gray-900 leading-none">{c.raw ?? (c.val ?? 0)}</div>
            <div className="text-xs text-gray-600 mt-0.5 line-clamp-2">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
