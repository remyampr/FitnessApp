import React from 'react'
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

export const Pagination = ({currentPage,totalPages,onPageChange}) => {

const getPageNumbers=()=>{
    const pages=[];

    pages.push(1);

    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

    if (rangeStart > 2) {
        pages.push('...');
      }

      for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
      }

      if (rangeEnd < totalPages - 1) {
        pages.push('...');
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }

      return pages;
}

if (totalPages <= 1) return null;


  return (
    <div className="flex justify-center my-8">
    <div className="join">
      {/* Previous button */}
      <button 
        className="join-item btn btn-sm" 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FiChevronLeft />
      </button>
      
      {/* Page numbers */}
      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <button key={`ellipsis-${index}`} className="join-item btn btn-sm btn-disabled">...</button>
        ) : (
          <button 
            key={`page-${page}`}
            className={`join-item btn btn-sm ${currentPage === page ? 'btn-active' : ''}`}
            onClick={() => typeof page === 'number' && onPageChange(page)}
          >
            {page}
          </button>
        )
      ))}
      
      {/* Next button */}
      <button 
        className="join-item btn btn-sm" 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FiChevronRight />
      </button>
    </div>
  </div>
  )
}
