'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BlogPost } from '@/app/lib/domain/entities/BlogPost';
import { formatBlogDate, calculateReadingTime, blogCategories } from '@/app/lib/data/blogPosts';

gsap.registerPlugin(ScrollTrigger);

interface RelatedPostsProps {
  posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      });

      tl.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo(cardsRef.current?.children || [],
        { y: 80, opacity: 0, scale: 0.95 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 0.8, 
          stagger: 0.2, 
          ease: 'power3.out' 
        },
        '-=0.4'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (posts.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-stone-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl mb-6 leading-tight"
            style={{ 
              fontFamily: 'Minion Pro, serif',
              fontWeight: 'bold',
              color: '#152239'
            }}
          >
            Artículos <span style={{ color: '#B79F76', fontStyle: 'italic' }}>Relacionados</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
            Explore más contenido relevante de nuestra biblioteca de insights legales
          </p>
        </div>

        {/* Related Posts Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => {
            const category = blogCategories.find(cat => cat.id === post.categoryId);
            
            return (
              <article 
                key={post.id}
                className="group bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden hover:shadow-xl hover:border-amber-200 hover:-translate-y-2 transition-all duration-500 cursor-pointer"
              >
                {/* Featured Image */}
                <div className="relative h-48 bg-gradient-to-br from-stone-200 via-slate-200 to-stone-300 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
                    </svg>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span 
                      className="px-3 py-1 text-xs font-medium text-white rounded-full"
                      style={{ backgroundColor: category?.color || '#B79F76' }}
                    >
                      {category?.name || 'Legal'}
                    </span>
                  </div>

                  {/* Reading Time */}
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 text-xs font-medium bg-black/70 text-white rounded-full backdrop-blur-sm">
                      {calculateReadingTime(post.content)} min
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 
                    className="text-xl mb-3 leading-tight group-hover:opacity-80 transition-opacity duration-300 line-clamp-2"
                    style={{ 
                      fontFamily: 'Minion Pro, serif',
                      fontWeight: 'bold',
                      color: '#152239'
                    }}
                  >
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-slate-600 mb-4 font-light leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <div className="text-sm text-slate-500">
                      <p>{formatBlogDate(post.publishedAt!)}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 text-sm text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{post.viewCount.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center text-slate-400 group-hover:translate-x-1 group-hover:text-slate-600 transition-all duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* View All Articles CTA */}
        <div className="text-center mt-12">
          <a
            href="/blog"
            className="inline-flex items-center px-8 py-4 bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors duration-300 rounded-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Ver Todos los Artículos
          </a>
        </div>
      </div>
    </section>
  );
}