import { useState, useMemo } from "react";

export default function usePagination({ totalItems, itemsPerPage = 10 }) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = useMemo(() => Math.ceil(totalItems / itemsPerPage), [totalItems, itemsPerPage]);

    const currentItemsRange = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, totalItems);
        return { start, end };
    }, [currentPage, itemsPerPage, totalItems]);

    const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    return { currentPage, totalPages, currentItemsRange, goToPage, nextPage, prevPage };
}

