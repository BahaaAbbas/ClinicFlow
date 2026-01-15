import { useState, useEffect } from "react";

const usePagination = (data = [], defaultPerPage = 3) => {
  const getItemsPerPage = () => {
    if (data.length <= defaultPerPage) return data.length || 1;
    return defaultPerPage;
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  useEffect(() => {
    setItemsPerPage(getItemsPerPage());
    setCurrentPage(1);
  }, [data.length]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const next = () => {
    setCurrentPage((p) => Math.min(p + 1, totalPages));
  };

  const prev = () => {
    setCurrentPage((p) => Math.max(p - 1, 1));
  };

  return {
    currentData,
    currentPage,
    totalPages,
    itemsPerPage,
    next,
    prev,
  };
};

export default usePagination;
