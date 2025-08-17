'use client';

interface MediaFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterType: string;
  onFilterTypeChange: (type: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  selectedCount: number;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
  selectAllLabel: string;
}

export const MediaFilters = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  viewMode,
  onViewModeChange,
  selectedCount,
  onSelectAll,
  onDeleteSelected,
  selectAllLabel
}: MediaFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center">
      {/* Search Input */}
      <div className="flex-1 min-w-[200px] order-1">
        <input
          type="search"
          placeholder="Buscar archivos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      
      {/* Filter Type Select */}
      <select
        value={filterType}
        onChange={(e) => onFilterTypeChange(e.target.value)}
        className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 order-2 min-w-[140px] sm:min-w-[180px]"
      >
        <option value="all">Todos los archivos</option>
        <option value="images">Imágenes</option>
        <option value="videos">Videos</option>
        <option value="documents">Documentos</option>
      </select>

      {/* View Mode Toggle */}
      <div className="flex rounded-lg border border-stone-200 overflow-hidden order-3">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`px-3 sm:px-4 py-2 transition-colors duration-200 ${
            viewMode === 'grid' 
              ? 'bg-amber-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          title="Vista en cuadrícula"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`px-3 sm:px-4 py-2 transition-colors duration-200 ${
            viewMode === 'list' 
              ? 'bg-amber-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          title="Vista en lista"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Select All Button */}
      <button
        onClick={onSelectAll}
        className="text-xs sm:text-sm text-amber-600 hover:text-amber-700 px-2 sm:px-3 py-2 rounded-lg hover:bg-amber-50 transition-colors order-4"
      >
        <span className="hidden sm:inline">{selectAllLabel}</span>
        <span className="sm:hidden">Sel. Todo</span>
      </button>

      {/* Delete Selected Button */}
      {selectedCount > 0 && (
        <button
          onClick={onDeleteSelected}
          className="px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm order-5"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="hidden sm:inline">Eliminar ({selectedCount})</span>
          <span className="sm:hidden">({selectedCount})</span>
        </button>
      )}
    </div>
  );
};