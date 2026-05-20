"use client";

import { useEffect, useState } from "react";
import { Site, SiteFormData } from "@/types";
import { fmt } from "@/lib/utils";

const EMPTY: SiteFormData = {
  site_id: "", site_id_opsel: "", kecamatan: "", desa: "",
  status: "AKTIF", tercatat_kib: "Belum", nilai_kib: null,
  luas: null, sertifikat: null, kawasan: "APL", keterangan: "",
};

const KET_CHIPS = [
  "Dokumen Hibah belum di sampaikan",
  "Dokumen hibah di lakukan pada tahun 2026",
  "Dokumen Hibah belum di sampaikan / Kawasan Hutan",
  "-",
];

interface SiteModalProps {
  open: boolean;
  site: Site | null;       // null = tambah baru
  onClose: () => void;
  onSave: (data: SiteFormData) => Promise<void>;
  onDelete?: () => void;
  kecamatanList: string[];
}

export function SiteModal({ open, site, onClose, onSave, onDelete, kecamatanList }: SiteModalProps) {
  const [form, setForm] = useState<SiteFormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SiteFormData, string>>>({});

  useEffect(() => {
    if (open) {
      setForm(site ? {
        site_id: site.site_id, site_id_opsel: site.site_id_opsel,
        kecamatan: site.kecamatan, desa: site.desa, status: site.status,
        tercatat_kib: site.tercatat_kib, nilai_kib: site.nilai_kib,
        luas: site.luas, sertifikat: site.sertifikat ?? null,
        kawasan: site.kawasan, keterangan: site.keterangan ?? "",
      } : { ...EMPTY });
      setErrors({});
    }
  }, [open, site]);

  const set = (k: keyof SiteFormData, v: unknown) =>
    setForm(prev => ({ ...prev, [k]: v }));

  function validate() {
    const e: typeof errors = {};
    if (!form.site_id.trim())    e.site_id    = "Wajib diisi";
    if (!form.kecamatan.trim())  e.kecamatan  = "Wajib diisi";
    if (!form.desa.trim())       e.desa       = "Wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try { await onSave(form); onClose(); }
    finally { setSaving(false); }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[500] flex items-center justify-center p-4"
         onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {site ? `Edit Site: ${site.site_id}` : "Tambah Data Site Baru"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {site ? `ID: ${site.id} | ${site.desa}, ${site.kecamatan}` : "Isi semua field yang bertanda *"}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-lg transition-colors">✕</button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          {/* Identitas */}
          <div>
            <div className="section-title">📍 Identitas Site</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Site ID *" error={errors.site_id}>
                <input className="input" value={form.site_id} onChange={e => set("site_id", e.target.value)} placeholder="Contoh: KLB00289" />
              </Field>
              <Field label="Site ID Opsel *" error={errors.site_id_opsel}>
                <input className="input" value={form.site_id_opsel} onChange={e => set("site_id_opsel", e.target.value)} placeholder="Contoh: ZZJ722" />
              </Field>
              <Field label="Status Operasi">
                <select className="input" value={form.status} onChange={e => set("status", e.target.value)}>
                  <option value="AKTIF">AKTIF</option>
                  <option value="Terminasi 2025">Terminasi 2025</option>
                </select>
              </Field>
              <Field label="Kecamatan *" error={errors.kecamatan}>
                <input className="input" value={form.kecamatan} onChange={e => set("kecamatan", e.target.value)}
                  list="kec-list" placeholder="Nama kecamatan" />
                <datalist id="kec-list">
                  {kecamatanList.map(k => <option key={k} value={k} />)}
                </datalist>
              </Field>
              <Field label="Desa *" error={errors.desa}>
                <input className="input" value={form.desa} onChange={e => set("desa", e.target.value)} placeholder="Nama desa" />
              </Field>
              <Field label="Status Kawasan">
                <select className="input" value={form.kawasan} onChange={e => set("kawasan", e.target.value)}>
                  <option value="">— Pilih —</option>
                  <option value="APL">APL (Area Penggunaan Lain)</option>
                  <option value="Hutan">Kawasan Hutan</option>
                  <option value="-">- (Terminasi)</option>
                </select>
              </Field>
            </div>
          </div>

          {/* KIB */}
          <div>
            <div className="section-title">📋 Data KIB</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Tercatat di KIB">
                <select className="input" value={form.tercatat_kib} onChange={e => set("tercatat_kib", e.target.value)}>
                  <option value="">— Pilih —</option>
                  <option value="Sudah">Sudah</option>
                  <option value="Belum">Belum</option>
                  <option value="-">- (Terminasi)</option>
                </select>
              </Field>
              <Field label="Nilai KIB (Rp)">
                <input className="input" type="number" min={0} step={1000}
                  value={form.nilai_kib ?? ""} onChange={e => set("nilai_kib", e.target.value ? Number(e.target.value) : null)}
                  placeholder="0" />
                {form.nilai_kib ? <span className="text-xs text-gray-400 mt-1">{fmt(form.nilai_kib)}</span> : null}
              </Field>
              <Field label="Luas Lahan (M²)">
                <input className="input" type="number" min={0}
                  value={form.luas ?? ""} onChange={e => set("luas", e.target.value ? Number(e.target.value) : null)}
                  placeholder="0" />
              </Field>
              <Field label="Penyerahan Sertifikat">
                <select className="input" value={form.sertifikat ?? ""} onChange={e => set("sertifikat", e.target.value || null)}>
                  <option value="">— Pilih —</option>
                  <option value="Sudah">Sudah</option>
                  <option value="Belum bersertifikat">Belum bersertifikat</option>
                </select>
              </Field>
            </div>
          </div>

          {/* Keterangan */}
          <div>
            <div className="section-title">📝 Keterangan</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {KET_CHIPS.map(c => (
                <button key={c} type="button" onClick={() => set("keterangan", c)}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors">
                  {c.length > 35 ? c.slice(0, 35) + "…" : c}
                </button>
              ))}
            </div>
            <textarea className="input resize-none" rows={3}
              value={form.keterangan ?? ""} onChange={e => set("keterangan", e.target.value)}
              placeholder="Masukkan keterangan..." />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
          {site && onDelete ? (
            <button onClick={onDelete} className="btn btn-danger btn-sm">🗑 Hapus Data</button>
          ) : <div />}
          <div className="flex gap-2">
            <button onClick={onClose} className="btn btn-outline">Batal</button>
            <button onClick={handleSave} disabled={saving} className="btn btn-primary">
              {saving ? "Menyimpan…" : "💾 Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="label">{label}</label>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
