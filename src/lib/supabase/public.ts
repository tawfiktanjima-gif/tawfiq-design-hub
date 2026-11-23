import { createClient } from "@supabase/supabase-js";
/** Cookie-less anon client for public static data (sitemap). RLS still applies. */
export const supabasePublic = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
