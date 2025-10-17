import React from "react";

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

  return (
    <div style={{ marginTop: "20px" }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{ marginRight: 5 }}
      >
        Anterior
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          disabled={currentPage === i + 1}
          style={{
            marginRight: 5,
            backgroundColor: currentPage === i + 1 ? "#ccc" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "5px 10px",
            cursor: currentPage === i + 1 ? "default" : "pointer",
          }}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Siguiente
      </button>
    </div>
  );
};
