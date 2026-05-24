"use client";

import { useCallback, useEffect, useState } from "react";
import { Site, SiteFormData } from "@/types";
import { fmt, fmtLuas } from "@/lib/utils";
import { StatusBadge, KIBBadge, KawasanBadge, KeteranganBadge } from "./Badges";
import { Pagination } from "./Pagination";
import { SiteModal } from "./SiteModal";
import { StatsBar } from "./StatsBar";
import { useToast } from "./Toast";

const SORT_COLS: { key: keyof Site; label: string }[] = [
  { key: "id",           label: "No" },
  { key: "site_id",      label: "Site ID" },
  { key: "site_id_opsel",label: "Site ID Opsel" },
  { key: "kecamatan",    label: "Kecamatan" },
  { key: "desa",         label: "Desa" },
  { key: "status",       label: "Status" },
  { key: "tercatat_kib", label: "KIB" },
  { key: "nilai_kib",    label: "Nilai KIB" },
  { key: "luas",         label: "Luas" },
  { key: "kawasan",      label: "Kawasan" },
];

interface DataPageProps {
  onDataChange?: () => void;
  refreshKey?: number;
}

export function DataPage({ onDataChange, refreshKey }: DataPageProps) {
  const { showToast } = useToast();
  const [rows, setRows]       = useState<Site[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [sortCol, setSortCol] = useState<keyof Site>("id");
  const [sortDir, setSortDir] = useState<"asc"|"desc">("asc");
  const [search, setSearch]   = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fKIB, setFKIB]       = useState("");
  const [fKawasan, setFKawasan] = useState("");
  const [fKecamatan, setFKecamatan] = useState("");
  const [kecList, setKecList] = useState<string[]>([]);
  const [editSite, setEditSite] = useState<Site | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page), perPage: String(perPage),
      search, status: fStatus, kib: fKIB, kawasan: fKawasan,
      kecamatan: fKecamatan, sortCol: String(sortCol), sortDir,
      t: String(Date.now()), // Cache busting
    });
    const res = await fetch(`/api/sites?${params}`, { cache: "no-store" });
    const json = await res.json();
    setRows(json.data ?? []);
    setTotal(json.total ?? 0);
    setLoading(false);
  }, [page, perPage, search, fStatus, fKIB, fKawasan, fKecamatan, sortCol, sortDir]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Populate kecamatan list once
  useEffect(() => {
    fetch("/api/sites?page=1&perPage=999")
      .then(r => r.json())
      .then(j => {
        const kecs = [...new Set<string>((j.data ?? []).map((r: Site) => r.kecamatan))].sort();
        setKecList(kecs);
      });
  }, []);

  function handleSort(col: keyof Site) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
    setPage(1);
  }

  function resetFilters() {
    setSearch(""); setFStatus(""); setFKIB(""); setFKawasan(""); setFKecamatan(""); setPage(1);
    showToast("Filter direset");
  }

  async function handleSave(data: SiteFormData) {
    try {
      const res = await fetch(`/api/sites/${editSite!.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || json?.error) {
        showToast(`Gagal menyimpan: ${json?.error ?? "Terjadi kesalahan"}`, "error");
        return;
      }
      showToast(`Data ${data.site_id} berhasil diperbarui`, "success");
      setModalOpen(false);
      fetchData();
      // Trigger refresh untuk sinkronisasi dengan tab lain
      if (onDataChange) onDataChange();
    } catch {
      showToast("Gagal menyimpan: Koneksi bermasalah", "error");
    }
  }

  function exportCSV() {
    const headers = ["No","Site ID","Site ID Opsel","Kecamatan","Desa","Status","KIB","Nilai KIB","Luas","Kawasan","Keterangan"];
    const csvRows = rows.map((r, i) => [
      i+1, r.site_id, r.site_id_opsel, r.kecamatan, r.desa, r.status,
      r.tercatat_kib, r.nilai_kib ?? "", r.luas ?? "", r.kawasan, r.keterangan ?? ""
    ]);
    const csv = [headers, ...csvRows].map(row => row.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `Aset_BTS_${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
    showToast(`Export ${rows.length} data berhasil`, "success");
  }

  function exportExcel() {
    import("xlsx").then((XLSX) => {
      const headers = ["No","Site ID","Site ID Opsel","Kecamatan","Desa","Status","KIB","Nilai KIB","Luas","Kawasan","Keterangan"];
      const excelRows = rows.map((r, i) => [
        i+1, r.site_id, r.site_id_opsel, r.kecamatan, r.desa, r.status,
        r.tercatat_kib, r.nilai_kib ?? "", r.luas ?? "", r.kawasan, r.keterangan ?? ""
      ]);
      const data = [headers, ...excelRows];
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Aset BTS");
      XLSX.writeFile(wb, `Aset_BTS_${new Date().toISOString().slice(0,10)}.xlsx`);
      showToast(`Export ${rows.length} data Excel berhasil`, "success");
    });
  }

  const SortIcon = ({ col }: { col: keyof Site }) =>
    <span className={`ml-1 text-xs ${sortCol === col ? "text-blue-600" : "text-gray-300"}`}>
      {sortCol === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>;

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-5">
      {/* Stats */}
      <StatsBar refreshKey={refreshKey} />

      {/* Filters */}
      <div className="card p-5">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">🔍 Filter &amp; Pencarian</h3>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-[2] min-w-[200px]">
            <label className="label">Cari Site ID / Kecamatan / Desa</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input className="input pl-8" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Ketik untuk mencari..." />
            </div>
          </div>
          <div className="min-w-[140px]">
            <label className="label">Status</label>
            <select className="input" value={fStatus} onChange={e => { setFStatus(e.target.value); setPage(1); }}>
              <option value="">Semua Status</option>
              <option value="AKTIF">AKTIF</option>
              <option value="Terminasi 2025">Terminasi 2025</option>
            </select>
          </div>
          <div className="min-w-[120px]">
            <label className="label">KIB</label>
            <select className="input" value={fKIB} onChange={e => { setFKIB(e.target.value); setPage(1); }}>
              <option value="">Semua</option>
              <option value="Sudah">Sudah</option>
              <option value="Belum">Belum</option>
            </select>
          </div>
          <div className="min-w-[120px]">
            <label className="label">Kawasan</label>
            <select className="input" value={fKawasan} onChange={e => { setFKawasan(e.target.value); setPage(1); }}>
              <option value="">Semua</option>
              <option value="APL">APL</option>
              <option value="Hutan">Hutan</option>
            </select>
          </div>
          <div className="min-w-[160px]">
            <label className="label">Kecamatan</label>
            <select className="input" value={fKecamatan} onChange={e => { setFKecamatan(e.target.value); setPage(1); }}>
              <option value="">Semua Kecamatan</option>
              {kecList.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={resetFilters} className="btn btn-outline">↺ Reset</button>
            <button onClick={exportCSV} className="btn btn-success">⬇ CSV</button>
            <button onClick={exportExcel} className="btn btn-success">⬇ Excel</button>
            <button onClick={() => window.print()} className="btn btn-outline">🖨</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-800">Data Aset Lahan BTS</span>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">{total} data</span>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {SORT_COLS.map(c => (
                  <th key={c.key} onClick={() => handleSort(c.key)}>
                    {c.label}<SortIcon col={c.key} />
                  </th>
                ))}
                <th>Keterangan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={12} className="text-center py-12 text-gray-400">Memuat data…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={12} className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-2">🔍</div>Tidak ada data yang sesuai filter
                </td></tr>
              ) : rows.map((r, i) => (
                <tr key={r.id}>
                  <td className="text-gray-400 text-xs">{(page-1)*perPage + i + 1}</td>
                  <td className="font-bold text-blue-700 font-mono text-xs">{r.site_id}</td>
                  <td className="font-mono text-xs text-gray-500">{r.site_id_opsel}</td>
                  <td className="font-medium">{r.kecamatan}</td>
                  <td className="text-gray-600">{r.desa}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td><KIBBadge val={r.tercatat_kib} /></td>
                  <td className="text-right font-semibold text-xs">{r.nilai_kib ? fmt(r.nilai_kib) : "-"}</td>
                  <td className="text-center">{fmtLuas(r.luas)}</td>
                  <td><KawasanBadge val={r.kawasan} /></td>
                  <td><KeteranganBadge ket={r.keterangan} /></td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn btn-outline btn-sm" onClick={() => { setEditSite(r); setModalOpen(true); }}>✏️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} perPage={perPage} total={total}
          onPage={p => setPage(p)} onPerPage={n => { setPerPage(n); setPage(1); }} />
      </div>

      <SiteModal open={modalOpen} site={editSite} onClose={() => setModalOpen(false)}
        onSave={handleSave} kecamatanList={kecList} />
    </div>
  );
}
