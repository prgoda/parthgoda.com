import Link from "next/link";
import Divider from "@/components/ui/Divider";
import { format } from "date-fns";

export default function Masthead() {
  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <div className="text-center pt-10 pb-4 px-4">
      <p className="text-xs text-zinc-400 uppercase tracking-widest mb-3">{today}</p>
      <Link href="/">
        <h1 className="font-serif text-5xl md:text-7xl font-black tracking-tight text-zinc-900 hover:text-indigo-600 transition-colors">
          PARTH GODA
        </h1>
      </Link>
      <p className="text-zinc-400 text-sm mt-2 tracking-widest uppercase">
        AI · MBA Life · Music
      </p>
      <Divider className="mt-6" />
    </div>
  );
}
