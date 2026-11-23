export const bn = (n: number | string) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
export function fmtSize(b?: number | null) { if (!b) return ""; const u = ["B", "KB", "MB", "GB"]; let i = 0, v = b; while (v >= 1024 && i < 3) { v /= 1024; i++; } return `${v.toFixed(i ? 1 : 0)} ${u[i]}`; }
/** Bangladesh number -> international digits for wa.me (01974933285 -> 8801974933285) */
export function waNumber(n: string) { const d = n.replace(/\D/g, ""); return d.startsWith("880") ? d : "880" + d.replace(/^0/, ""); }
export const waLink = (n: string, text?: string) => `https://wa.me/${waNumber(n)}` + (text ? `?text=${encodeURIComponent(text)}` : "");
/** preview_image may be a full URL or a path inside the public `previews` bucket */
export const previewUrl = (v?: string | null) => !v ? null : v.startsWith("http") ? v : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/previews/${v}`;
export const fmtDate = (d: string) => new Date(d).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" });
export const isNew = (d: string) => Date.now() - new Date(d).getTime() < 7 * 864e5;
