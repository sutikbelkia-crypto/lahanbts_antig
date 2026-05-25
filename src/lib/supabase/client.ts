import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check your .env.local file."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        if (typeof document === 'undefined') return '';
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : '';
      },
      set(name: string, value: string, options: any) {
        if (typeof document === 'undefined') return;
        
        const rememberMatch = document.cookie.match(new RegExp('(^| )sb-remember-me=([^;]+)'));
        const rememberMe = rememberMatch ? rememberMatch[2] === 'true' : false;

        let cookieString = `${name}=${value}; path=${options.path || '/'}`;
        
        if (rememberMe && options.maxAge) {
          cookieString += `; max-age=${options.maxAge}`;
        }
        
        if (options.domain) cookieString += `; domain=${options.domain}`;
        if (options.secure) cookieString += `; secure`;
        if (options.sameSite) cookieString += `; samesite=${options.sameSite}`;
        
        document.cookie = cookieString;
      },
      remove(name: string, options: any) {
        if (typeof document === 'undefined') return;
        document.cookie = `${name}=; path=${options.path || '/'}; max-age=0`;
      }
    }
  });
}
