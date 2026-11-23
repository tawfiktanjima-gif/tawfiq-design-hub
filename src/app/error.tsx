"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (<div className="wrap py-24 text-center" role="alert"><h1 className="text-2xl font-bold">কিছু একটা সমস্যা হয়েছে</h1><p className="my-3 opacity-80">তথ্য লোড করা যায়নি। একটু পরে আবার চেষ্টা করুন।</p><button onClick={reset} className="btn">আবার চেষ্টা করুন</button></div>);
}
