import React from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [8, 12, 24, 48, 96],
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Page Size Selector */}
      <div className="flex items-center gap-2">
        <label htmlFor="pageSize" className="text-sm text-gray-600">
          Show
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="input input-sm w-20"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-600">items per page</span>
      </div>

      {/* Items Info */}
      <div className="text-sm text-gray-600">
        Showing {startItem} to {endItem} of {totalItems} items
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* Mobile: compact pagination */}
        <div className="flex sm:hidden gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-secondary btn-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center px-2 py-1"
            aria-label="Previous page"
          >
            <FiChevronLeft className="mr-1" />
          </button>
          <span className="w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center bg-primary-600 text-white">
            {currentPage}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-secondary btn-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center px-2 py-1"
            aria-label="Next page"
          >
            <FiChevronRight className="ml-1" />
          </button>
        </div>

        {/* Desktop: full pagination */}
        <div className="hidden sm:flex items-center space-x-2">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="btn btn-secondary btn-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            aria-label="First page"
          >
            <FiChevronsLeft className="mr-1" /> First
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-secondary btn-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            aria-label="Previous page"
          >
            <FiChevronLeft className="mr-1" /> Previous
          </button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  pageNum === currentPage
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label={`Page ${pageNum}`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-secondary btn-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            aria-label="Next page"
          >
            Next <FiChevronRight className="ml-1" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="btn btn-secondary btn-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            aria-label="Last page"
          >
            Last <FiChevronsRight className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination; 