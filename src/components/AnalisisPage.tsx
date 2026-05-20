"use client";

import { useEffect, useState } from "react";
import { Site, KecamatanSummary } from "@/types";
import { fmt, fmtShort, pctOf } from "@/lib/utils";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface Stats {
  total: number; aktif: number; terminasi: number;
  kib_sudah: number; kib_belum: number; kawasan_hutan: number;
  hibah_2026: number; total_nilai_kib: number;
}

export function AnalisisPage() {
  const [stats, setStats] = useState<Stats>({
    total: 0, aktif: 0, terminasi: 0, kib_sudah: 0, kib_belum: 0,
    kawasan_hutan: 0, hibah_2026: 0, total_nilai_kib: 0,
  });
  const [kecSummary, setKecSummary] = useState<KecamatanSummary[]>([]);
  const [allSites, setAllSites] = useState<Site[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then(r => r.json()),
      fetch("/api/sites?page=1&perPage=999").then(r => r.json()),
    ]).then(([statsRes, sitesRes]) => {
      setStats(statsRes.stats ?? {});
      setKecSummary(statsRes.kecamatan_summary ?? []);
      setAllSites(sitesRes.data ?? []);
    });
  }, []);

  const avgNilai = stats.kib_sudah > 0 ? stats.total_nilai_kib / stats.kib_sudah : 0;

  // Chart data
  const statusData = {
    labels: ["AKTIF", "Terminasi 2025"],
    datasets: [{
      data: [stats.aktif, stats.terminasi],
      backgroundColor: ["#059669", "#dc2626"],
      borderWidth: 2, borderColor: "#fff",
    }],
  };

  const kibData = {
    labels: ["Sudah di KIB", "Belum di KIB", "Terminasi (-)"],
    datasets: [{
      data: [stats.kib_sudah, stats.kib_belum, stats.total - stats.kib_sudah - stats.kib_belum],
      backgroundColor: ["#059669", "#d97706", "#9ca3af"],
      borderWidth: 2, borderColor: "#fff",
    }],
  };

  const kawasanCounts = {
    apl: allSites.filter(s => s.kawasan === "APL").length,
    hutan: allSites.filter(s => s.kawasan === "Hutan").length,
    lain: allSites.filter(s => !s.kawasan || s.kawasan === "-").length,
  };
  const kawasanData = {
    labels: ["APL", "Kawasan Hutan", "Tidak Diketahui"],
    datasets: [{
      data: [kawasanCounts.apl, kawasanCounts.hutan, kawasanCounts.lain],
      backgroundColor: ["#2563eb", "#065f46", "#9ca3af"],
      borderWidth: 2, borderColor: "#fff",
    }],
  };

  const hibahCounts = {
    selesai: stats.kib_sudah,
    proses2026: stats.hibah_2026,
    belum: stats.kib_belum - stats.hibah_2026,
    terminasi: stats.terminasi,
  };
  const hibahData = {
    labels: ["Dokumen Selesai", "Proses 2026", "Belum Disampaikan", "Terminasi"],
    datasets: [{
      data: [hibahCounts.selesai, hibahCounts.proses2026, hibahCounts.belum, hibahCounts.terminasi],
      backgroundColor: ["#059669", "#7c3aed", "#d97706", "#dc2626"],
      borderWidth: 2, borderColor: "#fff",
    }],
  };

  const kecamatanData = {
    labels: kecSummary.slice(0, 10).map(k => k.kecamatan),
    datasets: [{
      label: "Jumlah Site",
      data: kecSummary.slice(0, 10).map(k => k.total),
      backgroundColor: "#2563eb",
      borderRadius: 4,
    }],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  const barOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: "#f3f4f6" } },
    },
  };

  // Alert data
  const hutanBelum = allSites.filter(s => s.kawasan === "Hutan" && s.tercatat_kib === "Belum");
  const hibah2026Sites = allSites.filter(s => s.keterangan?.toLowerCase().includes("2026"));

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="page-title">📊 Analisis Data Aset BTS</h2>
          <p className="text-sm text-gray-500 mt-1">Visualisasi dan ringkasan statistik pengelolaan aset lahan BTS</p>
        </div>
        <button onClick={() => window.print()} className="btn btn-outline no-print">🖨 Cetak Laporan</button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard icon="📡" label="Total Site BTS" value={stats.total} sub="Seluruh wilayah" color="blue" />
        <KPICard icon="✅" label="Site Aktif" value={stats.aktif} sub={pctOf(stats.aktif, stats.total)} color="emerald" />
        <KPICard icon="📋" label="Tercatat di KIB" value={stats.kib_sudah} sub={`${pctOf(stats.kib_sudah, stats.aktif)} dari aktif`} color="orange" />
        <KPICard icon="⚠️" label="Belum di KIB" value={stats.kib_belum} sub={`${pctOf(stats.kib_belum, stats.aktif)} dari aktif`} color="red" />
        <KPICard icon="💰" label="Total Nilai KIB" value={fmt(stats.total_nilai_kib)} sub={`Rata-rata: ${fmt(avgNilai)}`} color="purple" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <ChartCard title="Status Operasi Site" badge="Donut">
          <div className="h-48"><Doughnut data={statusData} options={chartOptions} /></div>
          <ChartLegend items={[
            { label: "AKTIF", value: stats.aktif, color: "#059669" },
            { label: "Terminasi 2025", value: stats.terminasi, color: "#dc2626" },
          ]} />
        </ChartCard>
        <ChartCard title="Status Pencatatan KIB" badge="Donut">
          <div className="h-48"><Doughnut data={kibData} options={chartOptions} /></div>
          <ChartLegend items={[
            { label: "Sudah di KIB", value: stats.kib_sudah, color: "#059669" },
            { label: "Belum di KIB", value: stats.kib_belum, color: "#d97706" },
            { label: "Terminasi (-)", value: stats.total - stats.kib_sudah - stats.kib_belum, color: "#9ca3af" },
          ]} />
        </ChartCard>
        <ChartCard title="Status Kawasan" badge="Donut">
          <div className="h-48"><Doughnut data={kawasanData} options={chartOptions} /></div>
          <ChartLegend items={[
            { label: "APL", value: kawasanCounts.apl, color: "#2563eb" },
            { label: "Kawasan Hutan", value: kawasanCounts.hutan, color: "#065f46" },
            { label: "Tidak Diketahui", value: kawasanCounts.lain, color: "#9ca3af" },
          ]} />
        </ChartCard>
        <ChartCard title="Progres Dokumen Hibah" badge="Donut">
          <div className="h-48"><Doughnut data={hibahData} options={chartOptions} /></div>
          <ChartLegend items={[
            { label: "Dokumen Selesai", value: hibahCounts.selesai, color: "#059669" },
            { label: "Proses 2026", value: hibahCounts.proses2026, color: "#7c3aed" },
            { label: "Belum Disampaikan", value: hibahCounts.belum, color: "#d97706" },
            { label: "Terminasi", value: hibahCounts.terminasi, color: "#dc2626" },
          ]} />
        </ChartCard>
      </div>

      {/* Chart Row 2 - Full Width */}
      <ChartCard title="Jumlah Site per Kecamatan (Top 10)" badge="Bar Chart" className="col-span-full">
        <div className="h-80"><Bar data={kecamatanData} options={barOptions} /></div>
      </ChartCard>

      {/* Table Ringkasan */}
      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <span className="font-semibold text-gray-800">📍 Ringkasan per Kecamatan</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Kecamatan</th>
                <th className="text-center">Total Site</th>
                <th className="text-center">Aktif</th>
                <th className="text-center">Terminasi</th>
                <th className="text-center">KIB Sudah</th>
                <th className="text-center">KIB Belum</th>
                <th className="text-center">Kaw. Hutan</th>
                <th className="text-right">Total Nilai KIB</th>
                <th className="text-center">% KIB</th>
              </tr>
            </thead>
            <tbody>
              {kecSummary.map(k => {
                const pctKIB = k.aktif > 0 ? Math.round((k.kib_sudah / k.aktif) * 100) : 0;
                return (
                  <tr key={k.kecamatan}>
                    <td className="font-medium">{k.kecamatan}</td>
                    <td className="text-center font-semibold">{k.total}</td>
                    <td className="text-center"><span className="badge badge-aktif">{k.aktif}</span></td>
                    <td className="text-center">{k.terminasi > 0 ? <span className="badge badge-terminasi">{k.terminasi}</span> : <span className="text-gray-300">-</span>}</td>
                    <td className="text-center"><span className="badge badge-sudah">{k.kib_sudah}</span></td>
                    <td className="text-center"><span className="badge badge-belum">{k.kib_belum}</span></td>
                    <td className="text-center">{k.kawasan_hutan > 0 ? <span className="badge badge-hutan">{k.kawasan_hutan}</span> : <span className="text-gray-300">-</span>}</td>
                    <td className="text-right text-xs font-semibold">{k.total_nilai > 0 ? fmt(k.total_nilai) : "-"}</td>
                    <td className="text-center">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 transition-all" style={{width: `${Math.min(pctKIB, 100)}%`}} />
                        </div>
                        <span className="text-xs text-gray-500 w-8">{pctKIB}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-800">🚨 Daftar Item yang Perlu Perhatian</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AlertCard
            title="⚠️ Kawasan Hutan – Belum Ada Dokumen Hibah"
            count={hutanBelum.length}
            items={hutanBelum.slice(0, 8)}
            color="yellow"
          />
          <AlertCard
            title="📅 Dokumen Hibah Diproses Tahun 2026"
            count={hibah2026Sites.length}
            items={hibah2026Sites.slice(0, 8)}
            color="purple"
          />
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon, label, value, sub, color }: {
  icon: string; label: string; value: string | number; sub: string; color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "from-blue-600 to-blue-800",
    emerald: "from-emerald-600 to-emerald-800",
    orange: "from-orange-600 to-orange-800",
    red: "from-red-600 to-red-800",
    purple: "from-purple-600 to-purple-800",
  };
  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} text-white rounded-xl p-4 flex items-center gap-3`}>
      <div className="text-2xl shrink-0">{icon}</div>
      <div>
        <div className="text-xl font-bold leading-none">{value}</div>
        <div className="text-xs opacity-90 mt-1">{label}</div>
        <div className="text-xs opacity-75 mt-0.5">{sub}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, badge, children, className = "" }: {
  title: string; badge: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full uppercase tracking-wide">{badge}</span>
      </div>
      {children}
    </div>
  );
}

function ChartLegend({ items }: { items: { label: string; value: number; color: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-3">
      {items.map(item => (
        <div key={item.label} className="flex items-center gap-1.5 text-xs text-gray-600">
          <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: item.color}} />
          <span>{item.label}: <strong>{item.value}</strong></span>
        </div>
      ))}
    </div>
  );
}

function AlertCard({ title, count, items, color }: {
  title: string; count: number; items: Site[]; color: string;
}) {
  const colorMap: Record<string, string> = {
    yellow: "border-yellow-500",
    purple: "border-purple-500",
  };
  return (
    <div className={`card overflow-hidden border-l-4 ${colorMap[color]}`}>
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">{title}</span>
        <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
      </div>
      <div className="max-h-48 overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-4 py-3 text-xs text-gray-400">Tidak ada data</div>
        ) : items.map(s => (
          <div key={s.id} className="px-4 py-2 border-b border-gray-50 last:border-b-0 flex items-center gap-2 text-xs">
            <span className="font-bold text-blue-700 font-mono min-w-[80px]">{s.site_id}</span>
            <span className="text-gray-600">{s.desa}</span>
            <span className="text-gray-400">— {s.kecamatan}</span>
          </div>
        ))}
        {items.length < count && (
          <div className="px-4 py-2 text-xs text-gray-400 italic">... dan {count - items.length} lainnya</div>
        )}
      </div>
    </div>
  );
}