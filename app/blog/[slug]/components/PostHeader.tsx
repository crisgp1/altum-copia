'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { BlogPost } from '@/app/lib/domain/entities/BlogPost';
import { formatBlogDate, calculateReadingTime } from '@/app/lib/data/blogPosts';

interface PostHeaderProps {
  post: BlogPost;
  author?: {
    id: string;
    name: string;
    position: string;
    bio: string;
    avatar: string;
    expertise: string[];
  };
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    color: string;
  };
}

export default function PostHeader({ post, author, category }: PostHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(breadcrumbRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
    )
    .fromTo(categoryRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    )
    .fromTo(titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo(metaRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    )
    .fromTo(imageRef.current,
      { y: 60, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' },
      '-=0.6'
    );
  }, []);

  return (
    <header ref={headerRef} className="relative py-16 bg-gradient-to-br from-slate-50 to-stone-100 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-stone-300/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-slate-200/30 to-amber-100/20 rounded-full blur-xl"></div>
      
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav ref={breadcrumbRef} className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <a 
              href="/" 
              className="hover:text-slate-700 transition-colors duration-200"
            >
              Inicio
            </a>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <a 
              href="/blog" 
              className="hover:text-slate-700 transition-colors duration-200"
            >
              Blog
            </a>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-700 font-medium">{category?.name || 'Artículo'}</span>
          </div>
        </nav>

        {/* Category Badge */}
        <div ref={categoryRef} className="mb-6">
          <span 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-full"
            style={{ backgroundColor: category?.color || '#B79F76' }}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
            </svg>
            {category?.name || 'Legal'}
          </span>
        </div>

        {/* Title */}
        <h1 
          ref={titleRef}
          className="text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight"
          style={{ 
            fontFamily: 'Minion Pro, serif',
            fontWeight: 'bold',
            color: '#152239'
          }}
        >
          {post.title}
        </h1>

        {/* Meta Information */}
        <div ref={metaRef} className="flex flex-wrap items-center gap-6 mb-8 text-slate-600">
          {/* Author */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-300 to-stone-400 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {author?.name.split(' ').map(n => n[0]).join('') || 'AL'}
              </span>
            </div>
            <div>
              <p className="font-medium text-slate-800">{author?.name || 'ALTUM Legal'}</p>
              <p className="text-sm text-slate-500">{author?.position || 'Equipo Legal'}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-stone-300"></div>

          {/* Date & Reading Time */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatBlogDate(post.publishedAt!)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{calculateReadingTime(post.content)} min lectura</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{post.viewCount.toLocaleString()} vistas</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div 
          ref={imageRef} 
          className="relative h-64 md:h-80 lg:h-96 bg-gradient-to-br from-stone-200 via-slate-200 to-stone-300 rounded-2xl overflow-hidden shadow-xl"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
            </svg>
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>
    </header>
  );
}