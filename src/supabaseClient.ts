import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase Cloud Configuration for Little Roses Academy
// Uses VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables only.
// No credentials or placeholder project IDs are hard-coded.

const envUrl = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  ''
).trim();

const envAnonKey = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  ''
).trim();

export const SUPABASE_URL: string = envUrl;
export const SUPABASE_ANON_KEY: string = envAnonKey;

// Evaluates whether user has connected their own Supabase project
export const isSupabaseConfigured: boolean = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  SUPABASE_URL.startsWith('http') &&
  !SUPABASE_URL.includes('your-project') &&
  !SUPABASE_URL.includes('placeholder')
);

function createSafeSupabaseClient(): SupabaseClient {
  if (isSupabaseConfigured) {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  // When unconfigured, create a safe proxy that prevents runtime crashes
  // while reporting clear unconfigured status without using fake credentials
  const unconfiguredError = {
    message: 'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.',
    code: 'UNCONFIGURED_SUPABASE'
  };

  const safeHandler: ProxyHandler<any> = {
    get(_target, prop) {
      if (prop === 'auth') {
        return {
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithPassword: async () => ({ data: null, error: unconfiguredError }),
          signOut: async () => ({ error: null }),
          getSession: async () => ({ data: { session: null }, error: null }),
          getUser: async () => ({ data: { user: null }, error: null })
        };
      }
      if (prop === 'storage') {
        return {
          from: () => ({
            upload: async () => ({ data: null, error: unconfiguredError }),
            remove: async () => ({ data: null, error: unconfiguredError }),
            getPublicUrl: () => ({ data: { publicUrl: '' } })
          })
        };
      }
      if (prop === 'from') {
        return () => {
          const chainable: any = {
            select: () => chainable,
            insert: () => chainable,
            upsert: () => chainable,
            update: () => chainable,
            delete: () => chainable,
            eq: () => chainable,
            order: () => chainable,
            maybeSingle: async () => ({ data: null, error: unconfiguredError }),
            then: (resolve: any) => Promise.resolve({ data: null, error: unconfiguredError }).then(resolve)
          };
          return chainable;
        };
      }
      return () => ({ data: null, error: unconfiguredError });
    }
  };

  return new Proxy({}, safeHandler) as SupabaseClient;
}

export const supabase: SupabaseClient = createSafeSupabaseClient();
