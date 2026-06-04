import React from "react";
import "../../styles/pagination.css"; // Importa los estilos

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  // Optimizar render: mostrar solo páginas cercanas + ellipsis
  const getVisiblePages = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    range.push(1);
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i >= 2 && i < totalPages) {
        range.push(i);
      }
    }
    range.push(totalPages);

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className="pagination-container">
      <button
        className={`pagination-btn pagination-nav-btn ${
          currentPage === 1 ? "disabled" : ""
        }`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Anterior
      </button>

      {getVisiblePages().map((page, idx) => (
        <React.Fragment key={idx}>
          {page === "..." ? (
            <span className="pagination-ellipsis">...</span>
          ) : (
            <button
              className={`pagination-btn ${
                currentPage === page ? "pagination-btn--active" : ""
              }`}
              onClick={() => onPageChange(Number(page))}
              disabled={currentPage === page}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        className={`pagination-btn pagination-nav-btn ${
          currentPage === totalPages ? "disabled" : ""
        }`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Siguiente →
      </button>
    </div>
  );
};
