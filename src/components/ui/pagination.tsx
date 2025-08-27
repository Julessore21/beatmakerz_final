import * as React from "react";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
};

const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const prev = () => currentPage > 1 && onPageChange(currentPage - 1);
  const next = () => currentPage < totalPages && onPageChange(currentPage + 1);

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={prev}
        disabled={currentPage === 1}
        className="rounded-full border border-white/10 px-3 py-1 text-sm disabled:opacity-40"
      >
        Précédent
      </button>
      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`rounded-full px-3 py-1 text-sm border ${
              p === currentPage
                ? "bg-white/10 border-white/10"
                : "border-white/10 hover:bg-white/5"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <button
        onClick={next}
        disabled={currentPage === totalPages}
        className="rounded-full border border-white/10 px-3 py-1 text-sm disabled:opacity-40"
      >
        Suivant
      </button>
    </div>
  );
};

export default Pagination;
