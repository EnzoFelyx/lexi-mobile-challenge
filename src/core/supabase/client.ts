import 'expo-sqlite/localStorage/install';

import { createClient } from '@supabase/supabase-js';

import type { Database } from './database.types';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Client do Supabase, com a sessão salva no aparelho. Nulo sem o `.env`: o app é local-first, então
 * continua funcionando como visitante. Só o container da DI deve importar este módulo.
 */
export const supabase =
  url && publishableKey
    ? createClient<Database>(url, publishableKey, {
        auth: {
          storage: localStorage,
          autoRefreshToken: true,
          persistSession: true,
          // No celular, não há URL de onde ler uma sessão.
          detectSessionInUrl: false,
        },
      })
    : null;
