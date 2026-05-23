"use client";

import { useCallback, useEffect, useState } from "react";
import { Site, SiteFormData } from "@/types";
import { fmtShort, fmtLuas } from "@/lib/utils";
import { StatusBadge, KIBBadge, KawasanBadge } from "./Badges";
import { Pagination } from "./Pagination";
import { SiteModal } from "./SiteModal";
import { ConfirmModal } from "./ConfirmModal";
import { useToast } from "./Toast";

interface EditPageProps {
  onDataChange?: () => void;
}

export function EditPage({ onDataChange }: EditPageProps) {
  const { showToast } = useToast();
  const [rows, setRows] = useState<Site[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [search, setSearch] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fKIB, setFKIB] = useState("");
  const [kecList, setKecList] = useState<string[]>([]);
  
  // Modals
  const [editSite, setEditSite] = useState<Site | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page), perPage: String(perPage),
      search, status: fStatus, kib: fKIB,
    });
    const res = await fetch(`/api/sites?${params}`);
    const json = await res.json();
    setRows(json.data ?? []);
    setTotal(json.total ?? 0);
    setLoading(false);
  }, [page, perPage, search, fStatus, fKIB]);

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

  function resetFilters() {
    setSearch(""); setFStatus(""); setFKIB(""); setPage(1);
    showToast("Filter direset");
  }

  function openAdd() {
    setEditSite(null);
    setModalOpen(true);
  }

  function openEdit(site: Site) {
    setEditSite(site);
    setModalOpen(true);
  }

  function promptDelete(id: number) {
    setDeleteId(id);
    setConfirmOpen(true);
  }

  async function handleSave(data: SiteFormData) {
    const url = editSite ? `/api/sites/${editSite.id}` : "/api/sites";
    const method = editSite ? "PATCH" : "POST";
    try {
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || json?.error) {
        showToast(`Gagal menyimpan: ${json?.error ?? "Terjadi kesalahan"}`, "error");
        return;
      }
      showToast(`Data ${data.site_id} berhasil ${editSite ? "diperbarui" : "ditambahkan"}`, "success");
      setModalOpen(false);
      fetchData();
      // Trigger refresh untuk sinkronisasi dengan tab lain
      if (onDataChange) onDataChange();
    } catch {
      showToast("Gagal menyimpan: Koneksi bermasalah", "error");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/sites/${deleteId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || json?.error) {
        showToast(`Gagal menghapus: ${json?.error ?? "Terjadi kesalahan"}`, "error");
        setDeleting(false);
        return;
      }
      showToast("Data berhasil dihapus", "success");
      setConfirmOpen(false);
      setDeleteId(null);
      fetchData();
      // Trigger refresh untuk sinkronisasi dengan tab lain
      if (onDataChange) onDataChange();
    } catch {
      showToast("Gagal menghapus: Koneksi bermasalah", "error");
    } finally {
      setDeleting(false);
    }
  }

  const deleteCandidate = deleteId ? rows.find(r => r.id === deleteId) : null;

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="page-title">✏️ Kelola Data Aset</h2>
          <p className="text-sm text-gray-500 mt-1">Tambah, ubah, atau hapus data site BTS</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary">➕ Tambah Data Baru</button>
      </div>

      {/* Filters */}
      <div className="card p-5">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-[2] min-w-[200px]">
            <label className="label">Cari data untuk diedit</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input className="input pl-8" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari Site ID, Kecamatan, Desa..." />
            </div>
          </div>
          <div className="min-w-[120px]">
            <label className="label">Status</label>
            <select className="input" value={fStatus} onChange={e => { setFStatus(e.target.value); setPage(1); }}>
              <option value="">Semua</option>
              <option value="AKTIF">AKTIF</option>
              <option value="Terminasi 2025">Terminasi 2025</option>
            </select>
          </div>
          <div className="min-w-[100px]">
            <label className="label">KIB</label>
            <select className="input" value={fKIB} onChange={e => { setFKIB(e.target.value); setPage(1); }}>
              <option value="">Semua</option>
              <option value="Sudah">Sudah</option>
              <option value="Belum">Belum</option>
            </select>
          </div>
          <button onClick={resetFilters} className="btn btn-outline">↺ Reset</button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-800">Daftar Data</span>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">{total} data</span>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{width:"40px"}}>No</th>
                <th>Site ID</th>
                <th>Site ID Opsel</th>
                <th>Kecamatan</th>
                <th>Desa</th>
                <th>Status</th>
                <th>KIB</th>
                <th>Nilai KIB</th>
                <th>Luas</th>
                <th>Kawasan</th>
                <th style={{minWidth:"180px"}}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={11} className="text-center py-12 text-gray-400">Memuat data…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={11} className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-2">🔍</div>Tidak ada data
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
                  <td className="text-right font-semibold text-xs">{r.nilai_kib ? fmtShort(r.nilai_kib) : "-"}</td>
                  <td className="text-center">{fmtLuas(r.luas)}</td>
                  <td><KawasanBadge val={r.kawasan} /></td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(r)} title="Edit">✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => promptDelete(r.id)} title="Hapus">🗑</button>
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

      <ConfirmModal open={confirmOpen}
        title="🗑 Konfirmasi Hapus"
        message={`Anda akan menghapus data site ${deleteCandidate?.site_id} (${deleteCandidate?.desa}, ${deleteCandidate?.kecamatan}). Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting} />
    </div>
  );
}