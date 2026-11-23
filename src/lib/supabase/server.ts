import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
export const hasSupabase = () => !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
/** Server client bound to the visitor's session (RLS applies). */
export function supabaseServer() {
  const store = cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => store.getAll(), setAll: (list: { name: string; value: string; options?: Parameters<typeof store.set>[2] }[]) => { try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch {} } },
  });
}
