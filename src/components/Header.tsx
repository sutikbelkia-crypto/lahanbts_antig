"use client";

import { PageKey } from "./AppShell";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const tabs: { key: PageKey; label: string; icon: string }[] = [
  { key: "data",     label: "Data Aset",   icon: "📋" },
  { key: "edit",     label: "Kelola Data", icon: "✏️" },
  { key: "analisis", label: "Analisis",    icon: "📊" },
];

interface HeaderProps {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
}

export function Header({ activePage, onNavigate }: HeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg sticky top-0 z-50 no-print">
      <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center text-2xl shrink-0">
            📡
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Pengelolaan Aset Tetap – Lahan BTS</h1>
            <p className="text-xs text-blue-200 mt-0.5">Sistem Informasi Manajemen Aset Lahan Base Transceiver Station</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Keluar
        </button>
      </div>

      {/* Nav Tabs */}
      <nav className="bg-black/15 border-t border-white/10">
        <div className="max-w-screen-2xl mx-auto px-6 flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => onNavigate(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-[3px] transition-all
                ${activePage === tab.key
                  ? "text-white border-white bg-white/10"
                  : "text-blue-200 border-transparent hover:text-white hover:bg-white/8"
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
