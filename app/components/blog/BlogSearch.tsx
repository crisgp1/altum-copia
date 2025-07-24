'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { BlogPost } from '@/app/lib/domain/entities/BlogPost';
import { blogCategories } from '@/app/lib/data/blogPosts';

interface BlogSearchProps {
  posts: BlogPost[];
  onSearchResults: (results: BlogPost[]) => void;
  onSearchTermChange: (term: string) => void;
}

export default function BlogSearch({ posts, onSearchResults, onSearchTermChange }: BlogSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState<BlogPost[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchRef.current) {
      gsap.fromTo(searchRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  // Search functionality
  const performSearch = (term: string) => {
    const trimmedTerm = term.trim().toLowerCase();
    
    if (!trimmedTerm) {
      onSearchResults(posts);
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const searchResults = posts.filter(post => {
      const searchFields = [
        post.title.toLowerCase(),
        post.excerpt.toLowerCase(),
        post.content.toLowerCase().replace(/<[^>]*>/g, ''), // Remove HTML tags
        ...post.tags.map(tag => tag.toLowerCase()),
        blogCategories.find(cat => cat.id === post.categoryId)?.name.toLowerCase() || ''
      ];

      return searchFields.some(field => field.includes(trimmedTerm));
    });

    // Sort by relevance (title matches first, then excerpt, then content)
    searchResults.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(trimmedTerm) ? 1 : 0;
      const bTitle = b.title.toLowerCase().includes(trimmedTerm) ? 1 : 0;
      const aExcerpt = a.excerpt.toLowerCase().includes(trimmedTerm) ? 1 : 0;
      const bExcerpt = b.excerpt.toLowerCase().includes(trimmedTerm) ? 1 : 0;
      
      if (aTitle !== bTitle) return bTitle - aTitle;
      if (aExcerpt !== bExcerpt) return bExcerpt - aExcerpt;
      return b.viewCount - a.viewCount; // Fallback to view count
    });

    onSearchResults(searchResults);
    setSuggestions(searchResults.slice(0, 5)); // Show top 5 suggestions
    setShowSuggestions(searchResults.length > 0);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchTermChange(value);
    performSearch(value);
    setSelectedSuggestion(-1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
    setShowSuggestions(false);
    inputRef.current?.blur();
    
    // Scroll to results
    const resultsSection = document.querySelector('#blog-grid');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSuggestionClick = (post: BlogPost) => {
    window.location.href = `/blog/${post.slug}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestion >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestion]);
        } else {
          handleSearchSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
    if (searchTerm && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay to allow suggestion clicks
    setTimeout(() => {
      setIsExpanded(false);
      setShowSuggestions(false);
      setSelectedSuggestion(-1);
    }, 200);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearchTermChange('');
    onSearchResults(posts);
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? 
        <mark key={index} className="bg-amber-200 text-amber-900 px-1 rounded">{part}</mark> : 
        part
    );
  };

  return (
    <div ref={searchRef} className="relative">
      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className={`relative transition-all duration-300 ${
          isExpanded ? 'transform scale-105' : ''
        }`}>
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg 
                className={`w-5 h-5 transition-colors duration-200 ${
                  isExpanded ? 'text-amber-500' : 'text-slate-400'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder="Buscar artículos, temas legales, categorías..."
              className={`w-full pl-12 pr-12 py-4 text-slate-700 bg-white/80 backdrop-blur-md border border-stone-200 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 ${
                isExpanded 
                  ? 'focus:ring-amber-400 focus:border-amber-300 shadow-lg' 
                  : 'focus:ring-amber-400 focus:border-amber-300'
              }`}
              style={{
                fontFamily: 'Minion Pro, serif',
                fontSize: '16px'
              }}
            />

            {/* Clear Button */}
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-12 flex items-center pr-2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Search Button */}
            <button
              type="submit"
              className={`absolute inset-y-0 right-0 flex items-center pr-4 transition-colors duration-200 ${
                searchTerm ? 'text-amber-600 hover:text-amber-700' : 'text-slate-400'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-stone-200 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-2">
              <div className="text-xs font-medium text-slate-500 px-3 py-2 border-b border-stone-100">
                Sugerencias de búsqueda
              </div>
              {suggestions.map((post, index) => {
                const category = blogCategories.find(cat => cat.id === post.categoryId);
                return (
                  <button
                    key={post.id}
                    onClick={() => handleSuggestionClick(post)}
                    className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                      selectedSuggestion === index 
                        ? 'bg-amber-50 border-amber-200' 
                        : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: category?.color || '#B79F76' }}
                        ></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 
                          className="text-sm font-medium text-slate-800 line-clamp-1 mb-1"
                          style={{ fontFamily: 'Minion Pro, serif' }}
                        >
                          {getHighlightedText(post.title, searchTerm)}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {getHighlightedText(post.excerpt, searchTerm)}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span 
                            className="text-xs font-medium"
                            style={{ color: category?.color || '#B79F76' }}
                          >
                            {category?.name}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-400">
                            {post.viewCount.toLocaleString()} vistas
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Search All Results */}
            <div className="border-t border-stone-100 p-2">
              <button
                onClick={handleSearchSubmit}
                className="w-full p-3 text-center text-sm font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors duration-200"
              >
                Ver todos los resultados para "{searchTerm}"
              </button>
            </div>
          </div>
        )}

        {/* No Results */}
        {showSuggestions && suggestions.length === 0 && searchTerm && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-stone-200 rounded-xl shadow-xl z-50 p-6 text-center">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 
              className="text-lg font-medium mb-2"
              style={{ 
                fontFamily: 'Minion Pro, serif',
                color: '#152239'
              }}
            >
              No se encontraron resultados
            </h3>
            <p className="text-slate-600 text-sm">
              No hay artículos que coincidan con "<strong>{searchTerm}</strong>". 
              Intente con otros términos de búsqueda.
            </p>
          </div>
        )}
      </form>

      {/* Search Tips */}
      {isExpanded && !searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-amber-50 to-stone-50 border border-amber-200 rounded-xl p-4 z-40">
          <h4 
            className="text-sm font-medium mb-2"
            style={{ 
              fontFamily: 'Minion Pro, serif',
              color: '#152239'
            }}
          >
            Consejos de búsqueda
          </h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• Busque por tema: "fusiones", "contratos", "compliance"</li>
            <li>• Busque por categoría: "derecho corporativo", "fiscal"</li>
            <li>• Use palabras clave específicas para mejores resultados</li>
            <li>• Navegue con las flechas del teclado en las sugerencias</li>
          </ul>
        </div>
      )}
    </div>
  );
}