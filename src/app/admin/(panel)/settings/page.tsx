import SettingsForm from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/data";
export default async function Page() { return <div><h1 className="mb-4 text-2xl font-bold">ওয়েবসাইট সেটিংস ও প্রোফাইল</h1><SettingsForm s={await getSettings()} /></div>; }
