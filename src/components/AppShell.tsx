"use client";

import { useState } from "react";
import { Header } from "./Header";
import { DataPage } from "./DataPage";
import { EditPage } from "./EditPage";
import { AnalisisPage } from "./AnalisisPage";
import { ToastProvider } from "./Toast";

export type PageKey = "data" | "edit" | "analisis";

export function AppShell() {
  const [page, setPage] = useState<PageKey>("data");
  // Shared refresh key untuk sinkronisasi data antar tab
  const [refreshKey, setRefreshKey] = useState(0);

  // Function untuk trigger refresh semua komponen
  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100">
        <Header activePage={page} onNavigate={setPage} />
        <div className={page === "data"     ? "block" : "hidden"}>
          <DataPage key={`data-${refreshKey}`} onDataChange={triggerRefresh} />
        </div>
        <div className={page === "edit"     ? "block" : "hidden"}>
          <EditPage key={`edit-${refreshKey}`} onDataChange={triggerRefresh} />
        </div>
        <div className={page === "analisis" ? "block" : "hidden"}>
          <AnalisisPage key={`analisis-${refreshKey}`} />
        </div>
      </div>
    </ToastProvider>
  );
}
