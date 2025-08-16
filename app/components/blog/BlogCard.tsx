'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { BlogPost } from '@/app/lib/domain/entities/BlogPost';
import { formatBlogDate, calculateReadingTime, blogCategories, blogAuthors } from '@/app/lib/data/blogPosts';

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export default function BlogCard({ post, index }: BlogCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Get category and author info
  const category = blogCategories.find(cat => cat.id === post.categoryId);
  const author = blogAuthors.find(auth => auth.id === post.authorId);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(entry.target,
              { y: 80, opacity: 0, scale: 0.95 },
              { 
                y: 0, 
                opacity: 1, 
                scale: 1, 
                duration: 0.8, 
                delay: index * 0.1,
                ease: 'power3.out' 
              }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  const handleMouseEnter = () => {
    gsap.to(imageRef.current, {
      scale: 1.05,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  return (
    <article 
      ref={cardRef}
      className="group opacity-0"
    >
      <Link 
        href={`/blog/${post.slug}`}
        className="block cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-amber-200 hover:-translate-y-2">
        {/* Featured Image */}
        <div className="relative h-48 bg-gradient-to-br from-stone-200 via-slate-200 to-stone-300 overflow-hidden">
          <div 
            ref={imageRef}
            className="absolute inset-0 flex items-center justify-center"
          >
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

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, tagIndex) => (
              <span 
                key={tagIndex}
                className="px-2 py-1 text-xs font-medium bg-stone-100 text-slate-600 rounded-md hover:bg-stone-200 transition-colors duration-200"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2 py-1 text-xs font-medium text-slate-500">
                +{post.tags.length - 3} más
              </span>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <div className="flex items-center space-x-3">
              {/* Author Avatar */}
              <div className="w-8 h-8 bg-gradient-to-br from-slate-300 to-stone-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {author?.name.split(' ').map(n => n[0]).join('') || 'AL'}
                </span>
              </div>
              
              {/* Author & Date */}
              <div className="text-sm text-slate-500">
                <p className="font-medium">{author?.name || 'ALTUM Legal'}</p>
                <p>{formatBlogDate(post.publishedAt!)}</p>
              </div>
            </div>

            {/* Views & Arrow */}
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
      </div>
      </Link>
    </article>
  );
}