-- ============================================================
-- SUPABASE SCHEMA untuk Aset Lahan BTS
-- ============================================================

-- Buat tabel sites
CREATE TABLE IF NOT EXISTS sites (
  id BIGSERIAL PRIMARY KEY,
  site_id VARCHAR(50) NOT NULL UNIQUE,
  site_id_opsel VARCHAR(50) NOT NULL,
  kecamatan VARCHAR(100) NOT NULL,
  desa VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('AKTIF', 'Terminasi 2025')),
  tercatat_kib VARCHAR(10) CHECK (tercatat_kib IN ('Sudah', 'Belum', '-')),
  nilai_kib BIGINT,
  luas INTEGER,
  sertifikat VARCHAR(100),
  kawasan VARCHAR(20) CHECK (kawasan IN ('APL', 'Hutan', '-')),
  keterangan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_sites_site_id ON sites(site_id);
CREATE INDEX IF NOT EXISTS idx_sites_kecamatan ON sites(kecamatan);
CREATE INDEX IF NOT EXISTS idx_sites_status ON sites(status);
CREATE INDEX IF NOT EXISTS idx_sites_tercatat_kib ON sites(tercatat_kib);
CREATE INDEX IF NOT EXISTS idx_sites_kawasan ON sites(kawasan);

-- Trigger untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sites_updated_at 
  BEFORE UPDATE ON sites 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- RLS: Disable untuk akses publik (aplikasi tanpa auth)
ALTER TABLE sites DISABLE ROW LEVEL SECURITY;

-- Komentar tabel
COMMENT ON TABLE sites IS 'Data aset lahan BTS (Base Transceiver Station)';
COMMENT ON COLUMN sites.site_id IS 'Kode unik site BTS';
COMMENT ON COLUMN sites.site_id_opsel IS 'Kode operator seluler';
COMMENT ON COLUMN sites.status IS 'Status operasi: AKTIF atau Terminasi 2025';
COMMENT ON COLUMN sites.tercatat_kib IS 'Status pencatatan di KIB: Sudah, Belum, atau - (terminasi)';
COMMENT ON COLUMN sites.nilai_kib IS 'Nilai yang tercatat di KIB dalam Rupiah';
COMMENT ON COLUMN sites.luas IS 'Luas lahan dalam meter persegi';
COMMENT ON COLUMN sites.kawasan IS 'Status kawasan: APL, Hutan, atau - (tidak diketahui)';