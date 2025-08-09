'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { BlogPost } from '@/app/lib/domain/entities/BlogPost';

interface PostMetaProps {
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

export default function PostMeta({ post, author, category }: PostMetaProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sidebarRef.current) {
      gsap.fromTo(sidebarRef.current.children,
        { x: 30, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.2, 
          ease: 'power2.out',
          delay: 1
        }
      );
    }
  }, []);

  return (
    <aside ref={sidebarRef} className="space-y-6">
      {/* Author Card - Medium Style */}
      {author && (
        <div className="border-b border-gray-100 pb-6">
          <h3
            className="text-base font-semibold mb-4 text-gray-900"
            style={{
              fontFamily: 'Bennet, serif',
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Sobre el Autor
          </h3>
          
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-gray-600">
                {author.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <h4
                className="text-base font-semibold text-gray-900 mb-1 break-words"
                style={{ fontFamily: 'Bennet, serif', fontWeight: '600' }}
              >
                {author.name}
              </h4>
              <p
                className="text-sm text-gray-600 mb-2 break-words"
                style={{ fontFamily: 'Bennet, serif', fontWeight: 'normal' }}
              >
                {author.position}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Bennet, serif', fontWeight: 'normal' }}>
                {author.bio}
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              {author.expertise.map((skill, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                  style={{ fontFamily: 'Bennet, serif', fontWeight: 'normal' }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Table of Contents - Medium Style */}
      <div className="border-b border-gray-100 pb-6">
        <h3
          className="text-base font-semibold mb-4 text-gray-900"
          style={{
            fontFamily: 'Bennet, serif',
            fontSize: '14px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          Contenido
        </h3>
        
        <nav className="space-y-2">
          <a
            href="#introduccion"
            className="block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            style={{ fontFamily: 'Bennet, serif', fontWeight: 'normal' }}
          >
            Introducción
          </a>
          <a
            href="#marco-legal"
            className="block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            style={{ fontFamily: 'Bennet, serif', fontWeight: 'normal' }}
          >
            Marco Legal
          </a>
          <a
            href="#implicaciones"
            className="block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            style={{ fontFamily: 'Bennet, serif', fontWeight: 'normal' }}
          >
            Implicaciones Prácticas
          </a>
          <a
            href="#recomendaciones"
            className="block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            style={{ fontFamily: 'Bennet, serif', fontWeight: 'normal' }}
          >
            Recomendaciones
          </a>
          <a
            href="#conclusion"
            className="block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            style={{ fontFamily: 'Bennet, serif', fontWeight: 'normal' }}
          >
            Conclusiones
          </a>
        </nav>
      </div>

      {/* Social Share - Medium Style */}
      <div className="border-b border-gray-100 pb-6">
        <h3
          className="text-base font-semibold mb-4 text-gray-900"
          style={{
            fontFamily: 'Bennet, serif',
            fontSize: '14px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          Compartir
        </h3>
        
        <div className="flex space-x-3">
          {/* Twitter */}
          <button className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded transition-colors duration-200">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
          </button>

          {/* LinkedIn */}
          <button className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded transition-colors duration-200">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </button>

          {/* Copy Link */}
          <button className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded transition-colors duration-200">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Article Stats - Medium Style */}
      <div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600" style={{ fontFamily: 'Bennet, serif', fontWeight: 'normal' }}>Publicado:</span>
            <span className="text-sm text-gray-900 font-semibold" style={{ fontFamily: 'Bennet, serif', fontWeight: '600' }}>
              {new Intl.DateTimeFormat('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }).format(post.publishedAt!)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600" style={{ fontFamily: 'Bennet, serif', fontWeight: 'normal' }}>Vistas:</span>
            <span className="text-sm text-gray-900 font-semibold" style={{ fontFamily: 'Bennet, serif', fontWeight: '600' }}>
              {post.viewCount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600" style={{ fontFamily: 'Bennet, serif', fontWeight: 'normal' }}>Categoría:</span>
            <span
              className="text-sm font-semibold"
              style={{
                color: category?.color || '#1a8917',
                fontFamily: 'Bennet, serif',
                fontWeight: '600'
              }}
            >
              {category?.name || 'Legal'}
            </span>
          </div>
        </div>
      </div>

      {/* Newsletter Signup - Removed as not typical in Medium style */}
    </aside>
  );
}