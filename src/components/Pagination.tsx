"use client";

interface PaginationProps {
  page: number;
  perPage: number;
  total: number;
  onPage: (p: number) => void;
  onPerPage: (n: number) => void;
}

export function Pagination({ page, perPage, total, onPage, onPerPage }: PaginationProps) {
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage + 1;
  const end   = Math.min(page * perPage, total);

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="px-5 py-3 flex items-center justify-between flex-wrap gap-3 border-t border-gray-100">
      <span className="text-sm text-gray-500">
        {total === 0 ? "Tidak ada data" : `Menampilkan ${start}–${end} dari ${total} data`}
      </span>
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-500 flex items-center gap-1.5">
          Tampilkan
          <select
            value={perPage}
            onChange={e => onPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 outline-none focus:border-blue-500"
          >
            {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          baris
        </label>
        <div className="flex gap-1">
          <PageBtn onClick={() => onPage(1)} disabled={page === 1}>«</PageBtn>
          <PageBtn onClick={() => onPage(page - 1)} disabled={page === 1}>‹</PageBtn>
          {pages.map((p, i) =>
            p === "..." ? (
              <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>
            ) : (
              <PageBtn key={p} onClick={() => onPage(p as number)} active={p === page}>{p}</PageBtn>
            )
          )}
          <PageBtn onClick={() => onPage(page + 1)} disabled={page === totalPages || totalPages === 0}>›</PageBtn>
          <PageBtn onClick={() => onPage(totalPages)} disabled={page === totalPages || totalPages === 0}>»</PageBtn>
        </div>
      </div>
    </div>
  );
}

function PageBtn({ children, onClick, disabled, active }: {
  children: React.ReactNode; onClick: () => void;
  disabled?: boolean; active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[32px] h-8 px-2 rounded-md text-sm border transition-all
        ${active ? "bg-blue-700 border-blue-700 text-white font-semibold"
                 : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400"}
        disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}
