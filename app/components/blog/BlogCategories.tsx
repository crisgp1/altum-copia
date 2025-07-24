'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { blogCategories } from '@/app/lib/data/blogPosts';

interface BlogCategoriesProps {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export default function BlogCategories({ selectedCategory, onCategoryChange }: BlogCategoriesProps) {
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    if (categoriesRef.current) {
      gsap.fromTo(categoriesRef.current.children,
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: 'power2.out',
          delay: 0.2
        }
      );
    }
  }, []);

  const handleCategoryClick = (categoryId: string | null) => {
    onCategoryChange(categoryId);
    
    // Smooth scroll to blog grid
    const blogGrid = document.querySelector('#blog-grid');
    if (blogGrid) {
      blogGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="py-16 bg-white border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl mb-4 leading-tight"
            style={{ 
              fontFamily: 'Minion Pro, serif',
              fontWeight: 'bold',
              color: '#152239'
            }}
          >
            Áreas de <span style={{ color: '#B79F76', fontStyle: 'italic' }}>Especialización</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
            Explore nuestros insights organizados por área de práctica legal
          </p>
        </div>

        {/* Categories Grid */}
        <div ref={categoriesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* All Posts Category */}
          <button
            onClick={() => handleCategoryClick(null)}
            onMouseEnter={() => setHoveredCategory('all')}
            onMouseLeave={() => setHoveredCategory(null)}
            className={`group relative p-6 rounded-xl border-2 text-left transition-all duration-300 ${
              selectedCategory === null 
                ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-stone-50' 
                : 'border-stone-200 bg-white hover:border-amber-200 hover:bg-stone-50'
            }`}
          >
            {/* Decorative Circle */}
            <div className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              selectedCategory === null 
                ? 'bg-amber-200' 
                : 'bg-stone-100 group-hover:bg-amber-100'
            }`}>
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>

            <h3 
              className={`text-xl mb-2 font-bold transition-colors duration-300 ${
                selectedCategory === null ? 'text-amber-700' : 'text-slate-800 group-hover:text-amber-700'
              }`}
              style={{ fontFamily: 'Minion Pro, serif' }}
            >
              Todos los Artículos
            </h3>
            <p className="text-slate-600 text-sm font-light leading-relaxed">
              Explore todo nuestro contenido legal y insights especializados
            </p>
            
            {/* Count Badge */}
            <div className="mt-4">
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                selectedCategory === null 
                  ? 'bg-amber-200 text-amber-800' 
                  : 'bg-stone-200 text-slate-600 group-hover:bg-amber-200 group-hover:text-amber-800'
              }`}>
                6 artículos
              </span>
            </div>
          </button>

          {/* Individual Categories */}
          {blogCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`group relative p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                selectedCategory === category.id 
                  ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-stone-50' 
                  : 'border-stone-200 bg-white hover:border-amber-200 hover:bg-stone-50'
              }`}
            >
              {/* Decorative Circle */}
              <div 
                className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  selectedCategory === category.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
                }`}
                style={{ 
                  backgroundColor: selectedCategory === category.id ? category.color : `${category.color}20`
                }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
                </svg>
              </div>

              <h3 
                className={`text-xl mb-2 font-bold transition-colors duration-300 ${
                  selectedCategory === category.id ? 'opacity-100' : 'text-slate-800 group-hover:opacity-80'
                }`}
                style={{ 
                  fontFamily: 'Minion Pro, serif',
                  color: selectedCategory === category.id ? category.color : undefined
                }}
              >
                {category.name}
              </h3>
              <p className="text-slate-600 text-sm font-light leading-relaxed">
                {category.description}
              </p>
              
              {/* Count Badge */}
              <div className="mt-4">
                <span 
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 ${
                    selectedCategory === category.id 
                      ? 'text-white' 
                      : 'bg-stone-200 text-slate-600 group-hover:text-white'
                  }`}
                  style={{ 
                    backgroundColor: selectedCategory === category.id 
                      ? category.color 
                      : hoveredCategory === category.id 
                        ? category.color 
                        : undefined
                  }}
                >
                  1 artículo
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}