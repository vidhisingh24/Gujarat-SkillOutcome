import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const PaginationControl: React.FC<PaginationControlProps> = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIdx = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(totalCount, currentPage * pageSize);

  return (
    <div className="pagination-control-flex">
      <div className="pagination-info">
        Showing <span className="font-bold">{startIdx}</span>–<span className="font-bold">{endIdx}</span> of <span className="font-bold">{totalCount}</span>
      </div>

      <div className="pagination-actions flex items-center gap-4">
        {/* Rows per page selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="rows-per-page" className="text-xs text-muted">Rows per page:</label>
          <select 
            id="rows-per-page"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rows-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
            aria-label="Previous Page"
          >
            <ChevronLeft size={14} />
            <span>Prev</span>
          </button>
          
          <span className="text-xs text-muted font-semibold">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
            aria-label="Next Page"
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <style>{`
        .pagination-control-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-card);
          font-size: 13px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .pagination-info {
          color: var(--text-muted);
        }
        .font-bold {
          font-weight: 600;
          color: var(--text-primary);
        }
        .rows-select {
          padding: 4px 8px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-input);
          background-color: var(--bg-card);
          color: var(--text-primary);
          font-size: 12px;
          cursor: pointer;
          outline: none;
        }
        .rows-select:focus {
          border-color: var(--accent-icon);
        }
        .pagination-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-button);
          background-color: var(--bg-card);
          color: var(--text-primary);
          cursor: pointer;
          font-weight: 600;
          font-size: 12px;
          transition: all 0.15s ease;
        }
        .pagination-btn:hover:not(:disabled) {
          background-color: var(--bg-primary);
          border-color: var(--border-color-hover);
          color: var(--text-brown);
        }
        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @media (max-width: 600px) {
          .pagination-control-flex {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};
export default PaginationControl;
