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

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100">
        <Header activePage={page} onNavigate={setPage} />
        <div className={page === "data"     ? "block" : "hidden"}><DataPage /></div>
        <div className={page === "edit"     ? "block" : "hidden"}><EditPage /></div>
        <div className={page === "analisis" ? "block" : "hidden"}><AnalisisPage /></div>
      </div>
    </ToastProvider>
  );
}
