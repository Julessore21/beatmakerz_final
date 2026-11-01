"use client";

import React from "react";
import Link from "next/link";

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const RetractationConsent = ({ checked, onChange }: Props) => (
  <label className="flex cursor-pointer items-start gap-2 text-left text-xs text-zinc-300">
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="mt-0.5 h-4 w-4 shrink-0 accent-[#7C5CFF]"
    />
    <span>
      Je demande la fourniture immédiate de mes contenus numériques, avant la fin du délai de rétractation de 14 jours, et je reconnais perdre mon droit de rétractation dès le début de la fourniture.{" "}
      <Link href="/web/retractation" target="_blank" rel="noreferrer" className="underline hover:text-white">
        En savoir plus
      </Link>
    </span>
  </label>
);

export default RetractationConsent;
