export function PageTitle({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: React.ReactNode }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h1 className="text-[36px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[44px]">{title}</h1>
      {text && <p className="mt-3 text-[16px] leading-relaxed text-fg-muted">{text}</p>}
    </div>
  );
}
