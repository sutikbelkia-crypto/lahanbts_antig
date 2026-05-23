"use client";

import { useCallback, useEffect, useState } from "react";
import { Site, KecamatanSummary } from "@/types";
import { fmt, pctOf } from "@/lib/utils";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface Stats {
  total: number; aktif: number; terminasi: number;
  kib_sudah: number; kib_belum: number;
  kawasan_hutan: number; kawasan_apl: number;
  hibah_2026: number; total_nilai_kib: number; avg_nilai_kib: number;
}

interface AnalisisPageProps {
  onDataChange?: () => void;
  refreshKey?: number;
}

const norm = (s: string | null | undefined) => (s ?? "").toLowerCase().trim();

export function AnalisisPage({ refreshKey }: AnalisisPageProps) {
  const [stats, setStats] = useState<Stats>({
    total: 0, aktif: 0, terminasi: 0, kib_sudah: 0, kib_belum: 0,
    kawasan_hutan: 0, kawasan_apl: 0, hibah_2026: 0,
    total_nilai_kib: 0, avg_nilai_kib: 0,
  });
  const [kecSummary, setKecSummary] = useState<KecamatanSummary[]>([]);
  const [allSites, setAllSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const t = Date.now();
      const opts: RequestInit = { cache: "no-store", headers: { "Cache-Control": "no-cache" } };
      const [sRes, dRes] = await Promise.all([
        fetch(`/api/stats?t=${t}`, opts),
        fetch(`/api/sites?page=1&perPage=500&t=${t}`, opts),
      ]);

      if (!sRes.ok) {
        const e = await sRes.json().catch(() => ({}));
        throw new Error(e.error || `Stats gagal: HTTP ${sRes.status}`);
      }
      if (!dRes.ok) {
        const e = await dRes.json().catch(() => ({}));
        throw new Error(e.error || `Sites gagal: HTTP ${dRes.status}`);
      }

      const sData = await sRes.json();
      const dData = await dRes.json();

      if (!sData.stats) throw new Error("Response stats tidak valid");
      if (!Array.isArray(dData.data)) throw new Error("Response sites tidak valid");

      setStats(sData.stats);
      setKecSummary(sData.kecamatan_summary ?? []);
      setAllSites(dData.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [refreshKey, fetchData]);

  // Derived counts
  const kawasan = {
    apl:   allSites.filter(s => norm(s.kawasan) === "apl").length,
    hutan: allSites.filter(s => norm(s.kawasan) === "hutan").length,
    lain:  allSites.filter(s => norm(s.kawasan) !== "apl" && norm(s.kawasan) !== "hutan").length,
  };
  const hibah = {
    selesai:   stats.kib_sudah,
    proses:    stats.hibah_2026,
    belum:     Math.max(0, stats.kib_belum - stats.hibah_2026),
    terminasi: stats.terminasi,
  };
  const avgNilai = stats.kib_sudah > 0 ? (stats.total_nilai_kib ?? 0) / stats.kib_sudah : 0;

  // Alert lists
  const hutanBelum   = allSites.filter(s => norm(s.kawasan) === "hutan" && norm(s.tercatat_kib) === "belum");
  const hibah2026    = allSites.filter(s => norm(s.keterangan).includes("2026"));

  // Chart configs
  const donutOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };
  const barOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: {
      label: (ctx: { parsed: { y: number } }) => ` ${ctx.parsed.y} site`,
    }}},
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: { beginAtZero: true, grid: { color: "#f1f5f9" }, ticks: { stepSize: 1 } },
    },
  };

  const chartStatus = {
    labels: ["AKTIF", "Terminasi 2025"],
    datasets: [{ data: [stats.aktif, stats.terminasi], backgroundColor: ["#10b981", "#ef4444"], borderWidth: 3, borderColor: "#fff" }],
  };
  const chartKIB = {
    labels: ["Sudah KIB", "Belum KIB", "Terminasi (-)"],
    datasets: [{ data: [stats.kib_sudah, stats.kib_belum, stats.total - stats.kib_sudah - stats.kib_belum], backgroundColor: ["#10b981", "#f59e0b", "#94a3b8"], borderWidth: 3, borderColor: "#fff" }],
  };
  const chartKawasan = {
    labels: ["APL", "Kawasan Hutan", "Lainnya"],
    datasets: [{ data: [kawasan.apl, kawasan.hutan, kawasan.lain], backgroundColor: ["#3b82f6", "#065f46", "#94a3b8"], borderWidth: 3, borderColor: "#fff" }],
  };
  const chartHibah = {
    labels: ["Selesai", "Proses 2026", "Belum", "Terminasi"],
    datasets: [{ data: [hibah.selesai, hibah.proses, hibah.belum, hibah.terminasi], backgroundColor: ["#10b981", "#8b5cf6", "#f59e0b", "#ef4444"], borderWidth: 3, borderColor: "#fff" }],
  };
  const chartBar = {
    labels: kecSummary.slice(0, 12).map(k => k.kecamatan),
    datasets: [{
      label: "Jumlah Site",
      data: kecSummary.slice(0, 12).map(k => k.total),
      backgroundColor: kecSummary.slice(0, 12).map((_, i) =>
        ["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#84cc16","#ec4899","#14b8a6","#6366f1","#a78bfa"][i % 12]
      ),
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">📊</span> Analisis Data Aset BTS
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Visualisasi &amp; ringkasan statistik pengelolaan aset lahan BTS
            {lastUpdated && (
              <span className="ml-2 text-xs text-gray-400">
                · Diperbarui {lastUpdated.toLocaleTimeString("id-ID")}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
          >
            <span className={loading ? "animate-spin inline-block" : ""}>🔄</span>
            {loading ? "Memuat..." : "Refresh"}
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition no-print">
            🖨 Cetak
          </button>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-2xl shrink-0">⚠️</span>
          <div className="flex-1">
            <p className="font-semibold text-red-800">Gagal memuat data analisis</p>
            <p className="text-sm text-red-600 mt-0.5 font-mono">{error}</p>
            <button onClick={fetchData} className="mt-2 text-sm font-semibold text-red-700 underline hover:text-red-900">
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      {/* ── Loading Skeleton ── */}
      {loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      )}

      {/* ── KPI Cards ── */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <KPICard icon="📡" label="Total Site BTS" value={stats.total} sub="Seluruh wilayah" gradient="from-blue-500 to-blue-700" />
            <KPICard icon="✅" label="Site Aktif" value={stats.aktif} sub={pctOf(stats.aktif, stats.total)} gradient="from-emerald-500 to-emerald-700" />
            <KPICard icon="❌" label="Terminasi" value={stats.terminasi} sub={pctOf(stats.terminasi, stats.total)} gradient="from-red-500 to-red-700" />
            <KPICard icon="📋" label="Tercatat KIB" value={stats.kib_sudah} sub={`${pctOf(stats.kib_sudah, stats.aktif)} dari aktif`} gradient="from-amber-500 to-amber-700" />
            <KPICard icon="💰" label="Total Nilai KIB" value={fmt(stats.total_nilai_kib)} sub={`Rata-rata: ${fmt(avgNilai)}`} gradient="from-purple-500 to-purple-700" />
          </div>

          {/* ── Progress Bars ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ProgressCard label="Pencatatan KIB" done={stats.kib_sudah} total={stats.aktif} color="emerald" icon="📋" />
            <ProgressCard label="Site Aktif" done={stats.aktif} total={stats.total} color="blue" icon="✅" />
            <ProgressCard label="Kawasan APL" done={kawasan.apl} total={stats.total} color="violet" icon="🗺️" />
          </div>

          {/* ── 4 Donut Charts ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <DonutCard title="Status Operasi Site">
              <div className="h-44"><Doughnut data={chartStatus} options={donutOpts} /></div>
              <Legend items={[
                { label: "AKTIF", value: stats.aktif, color: "#10b981" },
                { label: "Terminasi 2025", value: stats.terminasi, color: "#ef4444" },
              ]} />
            </DonutCard>

            <DonutCard title="Status Pencatatan KIB">
              <div className="h-44"><Doughnut data={chartKIB} options={donutOpts} /></div>
              <Legend items={[
                { label: "Sudah KIB", value: stats.kib_sudah, color: "#10b981" },
                { label: "Belum KIB", value: stats.kib_belum, color: "#f59e0b" },
                { label: "Terminasi (-)", value: stats.total - stats.kib_sudah - stats.kib_belum, color: "#94a3b8" },
              ]} />
            </DonutCard>

            <DonutCard title="Status Kawasan">
              <div className="h-44"><Doughnut data={chartKawasan} options={donutOpts} /></div>
              <Legend items={[
                { label: "APL", value: kawasan.apl, color: "#3b82f6" },
                { label: "Kawasan Hutan", value: kawasan.hutan, color: "#065f46" },
                { label: "Lainnya", value: kawasan.lain, color: "#94a3b8" },
              ]} />
            </DonutCard>

            <DonutCard title="Progres Dokumen Hibah">
              <div className="h-44"><Doughnut data={chartHibah} options={donutOpts} /></div>
              <Legend items={[
                { label: "Selesai", value: hibah.selesai, color: "#10b981" },
                { label: "Proses 2026", value: hibah.proses, color: "#8b5cf6" },
                { label: "Belum", value: hibah.belum, color: "#f59e0b" },
                { label: "Terminasi", value: hibah.terminasi, color: "#ef4444" },
              ]} />
            </DonutCard>
          </div>

          {/* ── Bar Chart ── */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">📍 Jumlah Site per Kecamatan</h3>
              <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full">Top {Math.min(kecSummary.length, 12)}</span>
            </div>
            <div className="h-72"><Bar data={chartBar} options={barOpts} /></div>
          </div>

          {/* ── Tabel Ringkasan per Kecamatan ── */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">📊 Ringkasan per Kecamatan</h3>
              <span className="text-xs text-gray-400">{kecSummary.length} kecamatan</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                    <th className="px-4 py-3 text-left font-semibold">Kecamatan</th>
                    <th className="px-3 py-3 text-center font-semibold">Total</th>
                    <th className="px-3 py-3 text-center font-semibold">Aktif</th>
                    <th className="px-3 py-3 text-center font-semibold">Terminasi</th>
                    <th className="px-3 py-3 text-center font-semibold">KIB ✅</th>
                    <th className="px-3 py-3 text-center font-semibold">KIB ⚠️</th>
                    <th className="px-3 py-3 text-center font-semibold">Hutan</th>
                    <th className="px-3 py-3 text-right font-semibold">Nilai KIB</th>
                    <th className="px-4 py-3 text-center font-semibold">% KIB</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {kecSummary.map((k, idx) => {
                    const pct = k.aktif > 0 ? Math.round((k.kib_sudah / k.aktif) * 100) : 0;
                    return (
                      <tr key={k.kecamatan} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                        <td className="px-4 py-2.5 font-medium text-gray-800">{k.kecamatan}</td>
                        <td className="px-3 py-2.5 text-center font-bold text-gray-900">{k.total}</td>
                        <td className="px-3 py-2.5 text-center">
                          <span className="inline-flex items-center justify-center min-w-[28px] px-1.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">{k.aktif}</span>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          {k.terminasi > 0
                            ? <span className="inline-flex items-center justify-center min-w-[28px] px-1.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">{k.terminasi}</span>
                            : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <span className="inline-flex items-center justify-center min-w-[28px] px-1.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">{k.kib_sudah}</span>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          {k.kib_belum > 0
                            ? <span className="inline-flex items-center justify-center min-w-[28px] px-1.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">{k.kib_belum}</span>
                            : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          {k.kawasan_hutan > 0
                            ? <span className="inline-flex items-center justify-center min-w-[28px] px-1.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">{k.kawasan_hutan}</span>
                            : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-3 py-2.5 text-right text-xs font-semibold text-gray-700">{k.total_nilai > 0 ? fmt(k.total_nilai) : "—"}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden min-w-[40px]">
                              <div className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444" }} />
                            </div>
                            <span className="text-xs font-semibold text-gray-600 w-8 text-right">{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Alert Cards ── */}
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-3">🚨 Item yang Perlu Perhatian</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AlertCard
                title="⚠️ Kawasan Hutan – Belum Ada Dokumen Hibah"
                count={hutanBelum.length}
                items={hutanBelum.slice(0, 8)}
                accentColor="border-amber-400"
                badgeColor="bg-amber-500"
              />
              <AlertCard
                title="📅 Dokumen Hibah Diproses Tahun 2026"
                count={hibah2026.length}
                items={hibah2026.slice(0, 8)}
                accentColor="border-violet-400"
                badgeColor="bg-violet-600"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

function KPICard({ icon, label, value, sub, gradient }: {
  icon: string; label: string; value: string | number; sub: string; gradient: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${gradient} text-white rounded-xl p-4 shadow-sm flex items-center gap-3`}>
      <div className="text-3xl shrink-0 drop-shadow">{icon}</div>
      <div className="min-w-0">
        <div className="text-2xl font-extrabold leading-none truncate">{value}</div>
        <div className="text-xs font-semibold opacity-90 mt-1 leading-tight">{label}</div>
        <div className="text-xs opacity-70 mt-0.5 leading-tight">{sub}</div>
      </div>
    </div>
  );
}

function ProgressCard({ label, done, total, color, icon }: {
  label: string; done: number; total: number; color: string; icon: string;
}) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const barColor: Record<string, string> = {
    emerald: "bg-emerald-500", blue: "bg-blue-500", violet: "bg-violet-500",
  };
  const textColor: Record<string, string> = {
    emerald: "text-emerald-700", blue: "text-blue-700", violet: "text-violet-700",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <span>{icon}</span>{label}
        </span>
        <span className={`text-lg font-extrabold ${textColor[color]}`}>{pct}%</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${barColor[color]}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between mt-1.5 text-xs text-gray-400">
        <span>{done} dari {total}</span>
        <span>{total - done} tersisa</span>
      </div>
    </div>
  );
}

function DonutCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-4 text-center">{title}</h3>
      {children}
    </div>
  );
}

function Legend({ items }: { items: { label: string; value: number; color: string }[] }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1.5 justify-center mt-4">
      {items.map(item => (
        <div key={item.label} className="flex items-center gap-1.5 text-xs text-gray-600">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
          <span>{item.label}:</span>
          <strong className="text-gray-800">{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

function AlertCard({ title, count, items, accentColor, badgeColor }: {
  title: string; count: number; items: Site[]; accentColor: string; badgeColor: string;
}) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden border-l-4 ${accentColor}`}>
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">{title}</span>
        <span className={`${badgeColor} text-white text-xs font-bold px-2.5 py-0.5 rounded-full`}>{count}</span>
      </div>
      <div className="max-h-52 overflow-y-auto divide-y divide-gray-50">
        {items.length === 0 ? (
          <div className="px-4 py-4 text-sm text-gray-400 text-center">✅ Tidak ada item</div>
        ) : items.map(s => (
          <div key={s.id} className="px-4 py-2 flex items-center gap-2 text-xs hover:bg-gray-50 transition">
            <span className="font-bold text-blue-700 font-mono min-w-[90px]">{s.site_id}</span>
            <span className="text-gray-600 truncate">{s.desa}</span>
            <span className="text-gray-400 shrink-0">— {s.kecamatan}</span>
          </div>
        ))}
        {count > items.length && (
          <div className="px-4 py-2 text-xs text-gray-400 italic text-center">
            + {count - items.length} lainnya
          </div>
        )}
      </div>
    </div>
  );
}
