import Divider from "@/components/ui/Divider";

export default function Footer() {
  return (
    <footer className="mt-20 pb-10 px-4">
      <Divider className="mb-8" />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-400">
        <p className="font-serif text-lg font-bold text-zinc-800">PARTH GODA</p>
        <p>
          © {new Date().getFullYear()} Parth Goda. Writing about AI, MBA life, and music.
        </p>
      </div>
    </footer>
  );
}
