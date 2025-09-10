'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { BlogPost } from '@/app/lib/domain/entities/BlogPost';
import { generateCategoriesFromPosts } from '@/app/lib/data/blogPosts';

interface BlogCategoriesProps {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  posts: BlogPost[];
}

export default function BlogCategories({ selectedCategory, onCategoryChange, posts }: BlogCategoriesProps) {
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  
  // Generate categories dynamically from posts
  const dynamicCategories = generateCategoriesFromPosts(posts);
  const totalPosts = posts.length;

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
    <section className="py-12 bg-gradient-to-b from-white to-stone-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 
            className="text-2xl md:text-3xl mb-3 leading-tight"
            style={{ 
              fontFamily: 'Minion Pro, serif',
              fontWeight: 'bold',
              color: '#152239'
            }}
          >
            Áreas de <span style={{ color: '#B79F76', fontStyle: 'italic' }}>Especialización</span>
          </h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto font-light">
            Explore nuestros insights organizados por área de práctica legal
          </p>
        </div>

        {/* Categories Tabs - Responsive and Aesthetic */}
        <div className="relative">
          {/* Tab Container with Fade Edges on Mobile */}
          <div className="relative overflow-x-auto scrollbar-hide">
            <div 
              ref={categoriesRef} 
              className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-2 md:gap-3 px-4 md:px-0 pb-2"
              style={{ minWidth: 'max-content' }}
            >
              {/* All Posts Tab */}
              <button
                onClick={() => handleCategoryClick(null)}
                onMouseEnter={() => setHoveredCategory('all')}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`group relative px-5 md:px-7 py-2.5 md:py-3 rounded-full text-sm md:text-[15px] font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${
                  selectedCategory === null 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-300/30' 
                    : 'bg-white text-slate-700 border border-stone-200 hover:border-amber-400 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:text-amber-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span style={{ fontFamily: 'Minion Pro, serif', letterSpacing: '0.3px' }}>
                    Todos los Artículos
                  </span>
                  <span className={`ml-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
                    selectedCategory === null 
                      ? 'bg-white/25 text-white' 
                      : 'bg-gradient-to-r from-stone-100 to-stone-200 text-slate-700'
                  }`}>
                    {totalPosts}
                  </span>
                </span>
              </button>

              {/* Individual Category Tabs */}
              {dynamicCategories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`group relative px-5 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-[15px] font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${
                    selectedCategory === category.id 
                      ? 'text-white shadow-lg' 
                      : 'bg-white text-slate-700 border border-stone-200 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.id 
                      ? category.color 
                      : hoveredCategory === category.id 
                        ? category.color 
                        : undefined,
                    boxShadow: selectedCategory === category.id 
                      ? `0 8px 20px -5px ${category.color}35` 
                      : undefined,
                    borderColor: hoveredCategory === category.id && selectedCategory !== category.id
                      ? category.color
                      : undefined
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span style={{ fontFamily: 'Minion Pro, serif', letterSpacing: '0.3px' }}>
                      {category.name}
                    </span>
                    <span 
                      className={`ml-1 px-2 py-0.5 text-xs font-semibold rounded-full transition-all duration-300 ${
                        selectedCategory === category.id || hoveredCategory === category.id
                          ? 'bg-white/25 text-white' 
                          : 'bg-gradient-to-r from-stone-100 to-stone-200 text-slate-700'
                      }`}
                    >
                      {category.postCount}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}