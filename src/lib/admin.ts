import "server-only";
import { supabaseServer, hasSupabase } from "./supabase/server";
/** Returns the session-bound client only for the single admin user (app_metadata.role === "admin"). RLS also enforces is_admin(). */
export async function getAdmin() {
  if (!hasSupabase()) return null;
  const db = supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  return user?.app_metadata?.role === "admin" ? { db, user } : null;
}
export async function requireAdmin() { const a = await getAdmin(); if (!a) throw new Error("unauthorized"); return a; }
