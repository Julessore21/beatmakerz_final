import { ChevronDown } from "lucide-react";

/** Questions et réponses repliées : une ligne par question, la réponse s'ouvre en dessous. */
export function Accordion({ items }: { items: { q: string; a: React.ReactNode }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it) => (
        <details key={it.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[16px] font-medium [&::-webkit-details-marker]:hidden">
            {it.q}
            <ChevronDown className="h-4 w-4 shrink-0 text-fg-faint transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <div className="-mt-1 max-w-prose pb-6 text-[15px] leading-7 text-fg-muted">{it.a}</div>
        </details>
      ))}
    </div>
  );
}
