'use client';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function BlogPagination({ currentPage, totalPages, onPageChange }: BlogPaginationProps) {
  // Don't show pagination if only one page
  if (totalPages <= 1) return null;

  // Generate page numbers array
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const pages: (number | string)[] = [];
    
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pages.push(i);
    }
    
    // Add first page
    if (currentPage - delta > 2) {
      pages.unshift('...');
    }
    pages.unshift(1);
    
    // Add last page
    if (currentPage + delta < totalPages - 1) {
      pages.push('...');
    }
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center space-x-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          currentPage === 1
            ? 'text-slate-400 cursor-not-allowed'
            : 'text-slate-600 hover:text-slate-800 hover:bg-stone-100'
        }`}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Anterior
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) => (
          page === '...' ? (
            <span key={index} className="px-3 py-2 text-slate-400">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                currentPage === page
                  ? 'text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-stone-100'
              }`}
              style={{
                backgroundColor: currentPage === page ? '#152239' : undefined
              }}
            >
              {page}
            </button>
          )
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          currentPage === totalPages
            ? 'text-slate-400 cursor-not-allowed'
            : 'text-slate-600 hover:text-slate-800 hover:bg-stone-100'
        }`}
      >
        Siguiente
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Page Info */}
      <div className="hidden md:flex items-center ml-8 text-sm text-slate-500">
        <span>
          Página {currentPage} de {totalPages}
        </span>
      </div>
    </nav>
  );
}