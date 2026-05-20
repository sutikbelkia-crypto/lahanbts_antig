import { Site } from "@/types";

export function StatusBadge({ status }: { status: Site["status"] }) {
  return status === "AKTIF"
    ? <span className="badge badge-aktif">✓ AKTIF</span>
    : <span className="badge badge-terminasi">✗ {status}</span>;
}

export function KIBBadge({ val }: { val: Site["tercatat_kib"] }) {
  if (!val || val === "-") return <span className="badge badge-dash">-</span>;
  return val.toLowerCase() === "sudah"
    ? <span className="badge badge-sudah">✓ Sudah</span>
    : <span className="badge badge-belum">⚠ Belum</span>;
}

export function KawasanBadge({ val }: { val: Site["kawasan"] }) {
  if (!val || val === "-") return <span className="badge badge-dash">-</span>;
  return val === "APL"
    ? <span className="badge badge-apl">APL</span>
    : <span className="badge badge-hutan">🌳 Hutan</span>;
}

export function KeteranganBadge({ ket }: { ket: string | null }) {
  if (!ket || ket === "-") return <span className="text-gray-300 text-xs">-</span>;
  if (ket.toLowerCase().includes("2026"))
    return <span className="badge badge-hibah">📅 Hibah 2026</span>;
  return <span className="text-yellow-600 text-xs">⚠ Belum disampaikan</span>;
}
