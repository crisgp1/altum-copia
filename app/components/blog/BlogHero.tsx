'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { BlogPost } from '@/app/lib/domain/entities/BlogPost';
import { formatBlogDate, calculateReadingTime } from '@/app/lib/data/blogPosts';

interface BlogHeroProps {
  featuredPosts: BlogPost[];
}

export default function BlogHero({ featuredPosts }: BlogHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const featuredCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )
    .fromTo(subtitleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    )
    .fromTo(featuredCardRef.current,
      { y: 80, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' },
      '-=0.6'
    );
  }, []);

  const featuredPost = featuredPosts[0];
  if (!featuredPost) return null;

  return (
    <section ref={heroRef} className="relative py-24 bg-gradient-to-br from-slate-50 to-stone-100 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-stone-300/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-slate-200/40 to-amber-100/30 rounded-full blur-xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <h1 
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight"
            style={{ color: '#000000' }}
          >
            <span className="altum-brand">ALTUM</span>{' '}
            <span className="legal-brand" style={{ color: '#B79F76' }}>Legal</span>
            <span className="block text-2xl md:text-3xl lg:text-4xl mt-4 font-light" style={{ color: '#152239' }}>
              Insights Jurídicos
            </span>
          </h1>
          <p 
            ref={subtitleRef}
            className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Análisis experto, tendencias legales y insights estratégicos para profesionales del derecho 
            y líderes empresariales en México y Latinoamérica.
          </p>
        </div>

        {/* Featured Post Card */}
        <div ref={featuredCardRef} className="max-w-5xl mx-auto">
          <div className="relative group cursor-pointer">
            <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-amber-200">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Featured Image */}
                <div className="relative h-64 lg:h-96 bg-gradient-to-br from-stone-200 via-slate-200 to-stone-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
                    </svg>
                  </div>
                  
                  {/* Featured Badge */}
                  <div className="absolute top-6 left-6">
                    <span 
                      className="px-4 py-2 text-sm font-medium text-white rounded-full"
                      style={{ backgroundColor: '#B79F76' }}
                    >
                      Artículo Destacado
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  {/* Category */}
                  <div className="mb-4">
                    <span 
                      className="text-sm font-medium uppercase tracking-wider"
                      style={{ color: '#B79F76' }}
                    >
                      Derecho Corporativo
                    </span>
                  </div>

                  {/* Title */}
                  <h2 
                    className="text-2xl lg:text-3xl mb-4 leading-tight group-hover:opacity-80 transition-opacity duration-300"
                    style={{ 
                      fontFamily: 'Minion Pro, serif',
                      fontWeight: 'bold',
                      color: '#152239'
                    }}
                  >
                    {featuredPost.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-slate-600 mb-6 font-light leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <span>{formatBlogDate(featuredPost.publishedAt!)}</span>
                      <span>•</span>
                      <span>{calculateReadingTime(featuredPost.content)} min lectura</span>
                      <span>•</span>
                      <span>{featuredPost.viewCount.toLocaleString()} vistas</span>
                    </div>
                    
                    {/* Read More Arrow */}
                    <div className="flex items-center text-slate-600 group-hover:translate-x-2 transition-transform duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}