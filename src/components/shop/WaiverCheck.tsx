import Link from "next/link";
import { Check } from "lucide-react";

/**
 * Accord exprès exigé par le Code de la consommation (art. L221-28 13°) pour livrer
 * un contenu numérique tout de suite : sans lui, le droit de rétractation de 14 jours reste entier.
 */
export function WaiverCheck({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-fg-muted">
      <span className="relative mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer absolute inset-0 cursor-pointer appearance-none rounded-[5px] border border-line-strong bg-ink-850 checked:border-fg checked:bg-fg" />
        <Check className="pointer-events-none relative h-3 w-3 text-ink opacity-0 peer-checked:opacity-100" strokeWidth={3} />
      </span>
      <span>
        Je demande la fourniture immédiate de mes fichiers, avant la fin du délai de rétractation de 14 jours, et je reconnais perdre mon droit de rétractation dès le début de la fourniture.{" "}
        <Link href="/web/retractation" className="underline underline-offset-2 hover:text-fg">
          En savoir plus
        </Link>
      </span>
    </label>
  );
}
