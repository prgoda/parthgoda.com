interface Props {
  /** Substack subdomain only, e.g. "fdedispatch" for https://fdedispatch.substack.com */
  publication?: string;
}

export default function SubstackEmbed({ publication }: Props) {
  // Until the Substack publication is wired, show a tasteful placeholder.
  if (!publication) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-5 py-4 text-sm text-zinc-500">
        Subscriptions open shortly, check back soon.
      </div>
    );
  }

  const base = `https://${publication}.substack.com`;

  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <iframe
          src={`${base}/embed`}
          title="Subscribe to the FDE Dispatch"
          width="100%"
          height="150"
          style={{ border: 0, background: "white" }}
          scrolling="no"
        />
      </div>
      <a
        href={`${base}/subscribe`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-xs font-medium uppercase tracking-widest text-zinc-500 underline underline-offset-4 hover:text-zinc-900"
      >
        Or subscribe on Substack ↗
      </a>
    </div>
  );
}
