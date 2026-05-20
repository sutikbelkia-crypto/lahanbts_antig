"use client";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmModal({ open, title, message, onConfirm, onCancel, loading }: ConfirmModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-[600] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
          <p className="text-xs text-red-600 mt-2">⚠️ Tindakan ini tidak dapat dibatalkan.</p>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onCancel} className="btn btn-outline">Batal</button>
          <button onClick={onConfirm} disabled={loading} className="btn btn-danger">
            {loading ? "Menghapus…" : "🗑 Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
