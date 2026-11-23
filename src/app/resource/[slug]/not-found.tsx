import Link from "next/link";
export default function NF() { return (<div className="wrap py-24 text-center"><h1 className="text-2xl font-bold">রিসোর্সটি খুঁজে পাওয়া যায়নি</h1><p className="my-3 opacity-80">এটি সরানো হয়ে থাকতে পারে বা এখনো প্রকাশিত হয়নি।</p><Link href="/resources" className="btn">সব রিসোর্স দেখুন</Link></div>); }
