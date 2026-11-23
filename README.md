# Tawfiq Design Hub (Next.js 14 + TypeScript + Tailwind + Supabase)

বাংলা ডিজাইন রিসোর্স লাইব্রেরি। দর্শনার্থীরা রিসোর্স খুঁজে ডাউনলোড করতে পারে; আপনি `/admin` থেকে আপলোড ও ম্যানেজ করেন।

## ফোল্ডার
- `src/app` রুট (হোম, `/resources`, `/category/[slug]`, `/resource/[slug]`, `/privacy`, `/terms`, `/admin/*`, `/api/download/[id]`, sitemap, robots)
- `src/components` UI, `src/components/admin` অ্যাডমিন UI, `src/lib` ডাটা/সুপাবেস/ইউটিল, `src/middleware.ts` /admin গার্ড
- `supabase/` SQL ফাইল, `original/homepage-prototype.html` প্রথম HTML প্রোটোটাইপ

## ১. লোকালে চালানো
1. `npm install`
2. `.env.example` কপি করে `.env.local` বানান, নিচের ভ্যারিয়েবলগুলো পূরণ করুন
3. Supabase সেটআপ (নিচে) শেষ করুন
4. `npm run dev` → http://localhost:3000

## ২. Supabase সেটআপ
1. https://supabase.com এ নতুন প্রজেক্ট তৈরি করুন।
2. **SQL Editor**-এ এই ক্রমে ফাইলগুলো চালান: `supabase/schema.sql` → `supabase/step4-download.sql` → `supabase/seed.sql`।
   এতে টেবিল, RLS পলিসি, স্টোরেজ বাকেট (`previews` পাবলিক; `resource-files` প্রাইভেট; `site` পাবলিক), ডাউনলোড ফাংশন ও ১৬টি ক্যাটাগরি তৈরি হবে।
3. **Authentication → Users → Add user** দিয়ে আপনার ইমেইল ও শক্তিশালী পাসওয়ার্ডে একটি ইউজার বানান (Auto Confirm চালু রাখুন)।
4. SQL Editor-এ চালান (ইমেইল বদলে নিন):
   `update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}' where email='আপনার@ইমেইল';`
5. **Project Settings → API** থেকে `Project URL`, `anon public` ও `service_role` কী কপি করুন।
6. ফাইলের সাইজ: Supabase ফ্রি প্ল্যানে প্রতি ফাইল সর্বোচ্চ ৫০ MB। বড় ফাইল লাগলে প্ল্যান আপগ্রেড করে Storage settings-এ সীমা বাড়ান এবং `src/lib/files.ts`-এ `MAX_FILE` মিলিয়ে নিন।
7. (ঐচ্ছিক) Authentication → Settings-এ নতুন সাইন-আপ বন্ধ রাখুন, কারণ সিঙ্গেল অ্যাডমিন যথেষ্ট।

## ৩. Environment Variables
| নাম | কাজ | গোপন? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase প্রজেক্ট URL | না |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon কী (RLS দিয়ে সুরক্ষিত) | না |
| `SUPABASE_SERVICE_ROLE_KEY` | ডাউনলোড API-তে সাইন্ড URL ও কাউন্টারের জন্য | **হ্যাঁ, কখনো `NEXT_PUBLIC_` দেবেন না** |
| `DOWNLOAD_HASH_SALT` | IP হ্যাশের লবণ (`openssl rand -hex 32`) | **হ্যাঁ** |
| `NEXT_PUBLIC_SITE_URL` | আপনার ডোমেইন, যেমন `https://example.com` (sitemap, SEO) | না |
| `DOWNLOAD_RATE_MAX` / `DOWNLOAD_RATE_WINDOW_MIN` | ঐচ্ছিক; ডিফল্ট ১০ মিনিটে ২০টি | না |

## ৪. Vercel-এ ডেপ্লয়
1. প্রজেক্টটি GitHub-এ পুশ করুন (`.env.local` পুশ করবেন না; `.gitignore`-এ আছে)।
2. https://vercel.com → **Add New → Project** → রিপোজিটরি ইমপোর্ট করুন (Framework: Next.js, ডিফল্ট সেটিং)।
3. **Environment Variables**-এ উপরের সব ভ্যারিয়েবল বসান, তারপর **Deploy**।
4. ডেপ্লয় শেষে `NEXT_PUBLIC_SITE_URL` আসল ডোমেইনে সেট করে আবার Redeploy করুন। কাস্টম ডোমেইন Vercel → Settings → Domains থেকে যুক্ত করুন।
5. ফাইল আপলোড সরাসরি ব্রাউজার থেকে Supabase-এ যায়, তাই Vercel-এর রিকোয়েস্ট সাইজ সীমা সমস্যা করে না।

## ৫. ডেপ্লয়ের পর চেকলিস্ট
- `/admin/login` দিয়ে লগইন হয় কিনা
- একটি ছোট PNG আপলোড করে প্রকাশ করুন, হোমপেজে দেখা যায় কিনা
- রিসোর্স পেজে "ডাউনলোড করুন" চাপলে ফাইল নামে এবং ডাউনলোড সংখ্যা বাড়ে কিনা
- `/sitemap.xml` ও `/robots.txt` খোলে কিনা
- সেটিংসে Facebook লিংক, ফোন ও WhatsApp নম্বর ঠিক আছে কিনা

## ৬. ডাউনলোড ও নিরাপত্তা কীভাবে কাজ করে
- ফাইল প্রাইভেট বাকেটে থাকে; সরাসরি লিংক নেই। বাটন চাপলে `/api/download/[id]` রিসোর্স প্রকাশিত কিনা দেখে ৬০ সেকেন্ডের সাইন্ড URL দেয়।
- প্রতি IP থেকে ১০ মিনিটে ২০টির বেশি অনুরোধ হলে সাময়িক বাধা (৪২৯)। একই IP একই রিসোর্স ঘণ্টায় একবারই গণনায় ধরা হয়। মূল IP সংরক্ষিত হয় না, শুধু হ্যাশ।
- ডাউনলোড সংখ্যা সাইন্ড URL ইস্যু করার সময় গণনা হয় (ব্রাউজারে ডাউনলোড শেষ হওয়া সার্ভার জানতে পারে না)। বট/ক্রলার গণনায় ধরা হয় না।
- অ্যাডমিনের প্রতিটি অ্যাকশন সার্ভারে যাচাই হয় এবং ডাটাবেস RLS-ও আটকায়।

## ৭. সমস্যা হলে
- **ডাউনলোডে "সেবা চালু নেই"**: `SUPABASE_SERVICE_ROLE_KEY` বা `DOWNLOAD_HASH_SALT` সেট নেই।
- **লগইন হয় কিন্তু `/admin` খোলে না**: ধাপ ২.৪-এর অ্যাডমিন কমান্ড চালানো হয়নি; লগআউট করে আবার লগইন করুন।
- **ছবি দেখা যায় না**: `NEXT_PUBLIC_SUPABASE_URL` ঠিক আছে কিনা এবং `previews` বাকেট পাবলিক কিনা দেখুন।
- **ডাউনলোডে ৫০০**: `step4-download.sql` চালানো হয়েছে কিনা দেখুন।

## বাকি কাজ
স্বয়ংক্রিয় টেস্ট, সার্চ পেজ নিয়ে ফাইনাল পরীক্ষা ও পারফরম্যান্স অডিট।
