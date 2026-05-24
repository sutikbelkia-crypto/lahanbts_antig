"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Map username to a dummy email for Supabase Auth compatibility
    // Since Supabase Auth requires email or phone.
    const email = `${username}@btsaset.local`;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Username atau kata sandi salah.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {/* TopAppBar */}
      <header className="bg-surface-container-lowest dark:bg-inverse-surface w-full top-0 sticky border-b border-outline-variant dark:border-outline z-50">
        <div className="flex justify-between items-center px-margin-mobile md:px-gutter py-4 max-w-container-max mx-auto">
          <div className="flex items-center gap-3">
            <img
              alt="Pemkab Kapuas Hulu"
              className="h-10 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA21N3lfouG-zjau5i8Jioic8Ho_0YD_gzPtc0qEqwC3jvIkspssgt19nOzZRY4orFm4knPZTVdqqR86Ua-wTiROybvrkFo-kn98s3D2rg47rEljkTm2PsUlVhkwccxHpkuiXSgeuWOS5MQNlKoNUMPcxG49Mnb7dAecxXq-wMzOM7yELgy2SnGqiKE5Vu7n5SZDJGonWI-WmBJOt591K7MGbwlTmNhK8PZ0FwZJZD-KcAFsza3SGQeyN-L6QD56bQwoUTW7cRGgom-"
            />
            <span className="font-label-lg text-label-lg text-primary dark:text-primary-fixed-dim uppercase tracking-wider hidden sm:block">
              DATA ASET TETAP LAHAN BTS
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a
              className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors font-label-lg text-label-lg"
              href="#"
            >
              Beranda
            </a>
            <a
              className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors font-label-lg text-label-lg"
              href="#"
            >
              Panduan
            </a>
            <a
              className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors font-label-lg text-label-lg"
              href="#"
            >
              Kontak
            </a>
          </nav>
          <div className="md:hidden">
            <span className="material-symbols-outlined text-primary">menu</span>
          </div>
        </div>
      </header>

      {/* Main Content: Login Canvas */}
      <main className="flex-grow flex items-center justify-center px-margin-mobile py-stack-lg relative overflow-hidden">
        {/* Subtle Decorative Background Elements */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="w-full max-w-md z-10">
          {/* Login Card */}
          <div className="bg-surface-container-lowest border border-outline-variant p-8 md:p-10 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col items-center text-center mb-stack-lg">
              <img
                alt="Logo Kapuas Hulu"
                className="w-20 h-auto mb-4 drop-shadow-sm"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA21N3lfouG-zjau5i8Jioic8Ho_0YD_gzPtc0qEqwC3jvIkspssgt19nOzZRY4orFm4knPZTVdqqR86Ua-wTiROybvrkFo-kn98s3D2rg47rEljkTm2PsUlVhkwccxHpkuiXSgeuWOS5MQNlKoNUMPcxG49Mnb7dAecxXq-wMzOM7yELgy2SnGqiKE5Vu7n5SZDJGonWI-WmBJOt591K7MGbwlTmNhK8PZ0FwZJZD-KcAFsza3SGQeyN-L6QD56bQwoUTW7cRGgom-"
              />
              <h1 className="font-headline-md text-headline-md text-primary mb-1">
                DATA ASET TETAP LAHAN BTS
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Pemerintah Kabupaten Kapuas Hulu
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-error-container text-on-error-container text-sm rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label
                  className="font-label-lg text-label-lg text-on-surface block"
                  htmlFor="username"
                >
                  Nama Pengguna
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-tertiary transition-colors">
                    person
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-tertiary focus:border-tertiary outline-none transition-all font-body-md text-body-md"
                    id="username"
                    placeholder="Masukkan username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="font-label-lg text-label-lg text-on-surface block"
                  htmlFor="password"
                >
                  Kata Sandi
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-tertiary transition-colors">
                    lock
                  </span>
                  <input
                    className="w-full pl-10 pr-12 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-tertiary focus:border-tertiary outline-none transition-all font-body-md text-body-md"
                    id="password"
                    placeholder="Masukkan password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                    onClick={togglePassword}
                    type="button"
                  >
                    <span className="material-symbols-outlined" id="eye-icon">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary"
                    id="remember"
                    type="checkbox"
                  />
                  <label
                    className="ml-2 font-label-sm text-label-sm text-on-surface-variant"
                    htmlFor="remember"
                  >
                    Ingat Saya
                  </label>
                </div>
                <a
                  className="font-label-sm text-label-sm text-tertiary hover:underline"
                  href="#"
                >
                  Lupa Sandi?
                </a>
              </div>

              <button
                className="w-full bg-primary text-on-primary font-label-lg text-label-lg py-4 rounded-lg hover:bg-primary-container transition-all shadow-sm active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-70"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? "Memproses..." : "Masuk"}</span>
                <span className="material-symbols-outlined text-[20px]">
                  login
                </span>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-outline-variant flex flex-col items-center gap-4">
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Butuh bantuan akses?
              </p>
              <div className="flex gap-4">
                <span className="px-3 py-1 bg-secondary-container/10 text-on-secondary-container border border-secondary-container/20 rounded-full font-label-sm text-label-sm">
                  Internal Only
                </span>
                <span className="px-3 py-1 bg-primary-container/10 text-on-primary-fixed-variant border border-primary-container/20 rounded-full font-label-sm text-label-sm">
                  Secure Access
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low dark:bg-on-background w-full mt-auto border-t border-outline-variant dark:border-outline">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-gutter py-stack-lg max-w-container-max mx-auto gap-4">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-label-lg text-label-lg text-on-surface dark:text-inverse-on-surface mb-1">
              DATA ASET TETAP LAHAN BTS
            </span>
            <p className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant text-center md:text-left">
              © 2026 Pemerintah Kabupaten Kapuas Hulu. Hak Cipta Dilindungi.
            </p>
          </div>
          <div className="flex gap-6">
            <a
              className="text-on-surface-variant dark:text-surface-variant font-label-sm text-label-sm hover:text-primary dark:hover:text-primary-fixed underline transition-all duration-200"
              href="#"
            >
              Kebijakan Privasi
            </a>
            <a
              className="text-on-surface-variant dark:text-surface-variant font-label-sm text-label-sm hover:text-primary dark:hover:text-primary-fixed underline transition-all duration-200"
              href="#"
            >
              Syarat &amp; Ketentuan
            </a>
            <a
              className="text-on-surface-variant dark:text-surface-variant font-label-sm text-label-sm hover:text-primary dark:hover:text-primary-fixed underline transition-all duration-200"
              href="#"
            >
              Bantuan
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
