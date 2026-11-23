export const MAX_FILE = 50 * 1024 * 1024, MAX_PREVIEW = 5 * 1024 * 1024;
const bin = ["application/octet-stream", ""];
export const FILE_EXT: Record<string, string[]> = {
  png: ["image/png"], jpg: ["image/jpeg"], jpeg: ["image/jpeg"], webp: ["image/webp"], svg: ["image/svg+xml"], pdf: ["application/pdf"],
  zip: ["application/zip", "application/x-zip-compressed", ...bin], rar: ["application/vnd.rar", "application/x-rar-compressed", ...bin], "7z": ["application/x-7z-compressed", ...bin],
  ttf: ["font/ttf", "application/x-font-ttf", "application/font-sfnt", ...bin], otf: ["font/otf", "application/x-font-opentype", "application/font-sfnt", ...bin], woff: ["font/woff", "application/font-woff", ...bin], woff2: ["font/woff2", ...bin],
  mp4: ["video/mp4"], psd: ["image/vnd.adobe.photoshop", "application/x-photoshop", ...bin], ai: ["application/illustrator", "application/postscript", "application/pdf", ...bin], eps: ["application/postscript", "application/eps", ...bin], apk: ["application/vnd.android.package-archive", ...bin],
};
export const PREVIEW_EXT = ["png", "jpg", "jpeg", "webp"];
export const ACCEPT_FILE = Object.keys(FILE_EXT).map((e) => "." + e).join(",");
export const extOf = (n: string) => (n.split(".").pop() || "").toLowerCase();
/** Same rules run in the browser (fast feedback) and on the server (authoritative). Returns a Bengali error or null. */
export function validateFile(name: string, type: string, size: number, kind: "file" | "preview"): string | null {
  const ext = extOf(name);
  if (kind === "preview") { if (!PREVIEW_EXT.includes(ext)) return `প্রিভিউ ছবি শুধু PNG, JPG, JPEG বা WEBP হতে পারবে (${name})`; if (size > MAX_PREVIEW) return `প্রিভিউ ছবি ৫ MB-এর বেশি হতে পারবে না (${name})`; }
  else if (size > MAX_FILE) return `মূল ফাইল ৫০ MB-এর বেশি হতে পারবে না (${name})`;
  if (!size) return `ফাইলটি খালি (${name})`;
  const mimes = FILE_EXT[ext]; if (!mimes) return `এই ফাইল ফরম্যাট সমর্থিত নয়: .${ext}`;
  if (!mimes.includes(type)) return `ফাইলের ধরন ও এক্সটেনশন মিলছে না (${name})`;
  return null;
}
export const safeName = (n: string) => { const e = extOf(n); const b = n.slice(0, n.length - e.length - 1).normalize("NFKD").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "file"; return `${b}.${e}`; };
export const okPath = (p: string) => /^[0-9a-f-]{36}\/[\w.-]+$/.test(p) && !p.includes("..");
export const slugify = (s: string) => s.trim().toLowerCase().replace(/[^\p{L}\p{N}\p{M}]+/gu, "-").replace(/^-+|-+$/g, "").slice(0, 80);
