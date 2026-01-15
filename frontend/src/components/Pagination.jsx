const Pagination = ({ currentPage, totalPages, onNext, onPrev }) => {
  if (totalPages <= 1) return null;
  return (
    <div
      style={{
        marginTop: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
      }}
    >
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        style={{
          padding: "8px 14px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          background: currentPage === 1 ? "#f3f3f3" : "#fff",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
        }}
      >
        Prev
      </button>
      <span style={{ fontWeight: 500 }}>
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        style={{
          padding: "8px 14px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          background: currentPage === totalPages ? "#f3f3f3" : "#fff",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
        }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
