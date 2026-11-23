import Link from "next/link";
export default function NotFound() {
  return (<div className="wrap py-24 text-center"><h1 className="text-5xl font-bold">৪০৪</h1><p className="my-3">দুঃখিত, পেজটি খুঁজে পাওয়া যায়নি।</p><Link href="/" className="btn">হোমে ফিরে যান</Link></div>);
}
