/** PUT a file to a Supabase signed upload URL with progress (0..1). */
export function putSigned(url: string, file: File, onProgress: (p: number) => void): Promise<void> {
  return new Promise((res, rej) => {
    const x = new XMLHttpRequest(); x.open("PUT", url);
    x.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    x.onload = () => (x.status < 300 ? res() : rej(new Error(`আপলোড ব্যর্থ হয়েছে (${x.status})`)));
    x.onerror = () => rej(new Error("নেটওয়ার্ক সমস্যা, আপলোড হয়নি"));
    const f = new FormData(); f.append("cacheControl", "3600"); f.append("", file); x.send(f);
  });
}
