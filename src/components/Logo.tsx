export default function Logo({ size = 44 }: { size?: number }) {
  return (<svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="29" fill="#0f7a2f" stroke="#7be08a" strokeWidth="3" /><path d="M14 20h28M28 20v26" stroke="#fff" strokeWidth="7" strokeLinecap="round" fill="none" /><path d="M36 28h6c7 0 11 4 11 9s-4 9-11 9h-6z" fill="none" stroke="#ffd400" strokeWidth="5" strokeLinejoin="round" /></svg>);
}
