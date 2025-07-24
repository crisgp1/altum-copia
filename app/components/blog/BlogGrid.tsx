'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { BlogPost } from '@/app/lib/domain/entities/BlogPost';
import BlogCard from './BlogCard';
import BlogPagination from './BlogPagination';

interface BlogGridProps {
  posts: BlogPost[];
  selectedCategory: string | null;
  searchTerm?: string;
  isSearchActive?: boolean;
}

export default function BlogGrid({ posts, selectedCategory, searchTerm = '', isSearchActive = false }: BlogGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Filter posts by category
  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.categoryId === selectedCategory)
    : posts;

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Animate grid when posts change
  useEffect(() => {
    if (gridRef.current) {
      // Reset opacity for new posts
      gsap.set(gridRef.current.children, { opacity: 0, y: 80 });
      
      // Animate title
      gsap.fromTo(titleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
      
      // Animate grid items
      gsap.to(gridRef.current.children, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2
      });
    }
  }, [currentPosts, selectedCategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Smooth scroll to top of grid
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getCategoryName = () => {
    if (isSearchActive) {
      return `Resultados de búsqueda${searchTerm ? ` para "${searchTerm}"` : ''}`;
    }
    
    if (!selectedCategory) return 'Todos los Artículos';
    
    const categoryMap: { [key: string]: string } = {
      'derecho-corporativo': 'Derecho Corporativo',
      'derecho-fiscal': 'Derecho Fiscal',
      'derecho-digital': 'Derecho Digital',
      'derecho-internacional': 'Derecho Internacional',
      'propiedad-intelectual': 'Propiedad Intelectual',
      'compliance': 'Compliance'
    };
    
    return categoryMap[selectedCategory] || 'Artículos';
  };

  return (
    <section id="blog-grid" className="py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl mb-4 leading-tight"
            style={{ 
              fontFamily: 'Minion Pro, serif',
              fontWeight: 'bold',
              color: '#152239'
            }}
          >
            {getCategoryName()}
            <span style={{ color: '#B79F76', fontStyle: 'italic' }}>
              {isSearchActive 
                ? ` • ${posts.length} resultado${posts.length !== 1 ? 's' : ''}`
                : selectedCategory 
                  ? ` • ${filteredPosts.length} artículos` 
                  : ` • ${posts.length} artículos`
              }
            </span>
          </h2>
          
          {(selectedCategory || isSearchActive) && (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('resetCategory'))}
              className="text-slate-600 hover:text-amber-600 transition-colors duration-200 font-medium"
            >
              ← Ver todos los artículos
            </button>
          )}
        </div>

        {/* Posts Grid */}
        {currentPosts.length > 0 ? (
          <>
            <div 
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            >
              {currentPosts.map((post, index) => (
                <BlogCard 
                  key={post.id} 
                  post={post} 
                  index={index}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <BlogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
              </svg>
            </div>
            <h3 
              className="text-2xl mb-3"
              style={{ 
                fontFamily: 'Minion Pro, serif',
                fontWeight: 'bold',
                color: '#152239'
              }}
            >
              No hay artículos disponibles
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              No se encontraron artículos en esta categoría. Explore otras áreas o vea todos nuestros artículos.
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('resetCategory'))}
              className="px-6 py-3 bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors duration-300 rounded-lg"
            >
              Ver Todos los Artículos
            </button>
          </div>
        )}

        {/* Stats Bar */}
        <div className="mt-16 pt-8 border-t border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#B79F76' }}>
                {posts.length}+
              </div>
              <div className="text-slate-600 font-medium">Artículos Publicados</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#B79F76' }}>
                6
              </div>
              <div className="text-slate-600 font-medium">Áreas de Especialización</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2" style={{ color: '#B79F76' }}>
                {posts.reduce((total, post) => total + post.viewCount, 0).toLocaleString()}+
              </div>
              <div className="text-slate-600 font-medium">Lecturas Totales</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}