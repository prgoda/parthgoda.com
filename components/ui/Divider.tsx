export default function Divider({ className = "" }: { className?: string }) {
  return <hr className={`border-t border-zinc-200 ${className}`} />;
}
