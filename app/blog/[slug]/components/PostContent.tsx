'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BlogPost } from '@/app/lib/domain/entities/BlogPost';

gsap.registerPlugin(ScrollTrigger);

interface PostContentProps {
  post: BlogPost;
}

export default function PostContent({ post }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const excerptRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animation
      const tl = gsap.timeline({ delay: 0.8 });

      tl.fromTo(excerptRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
      )
      .fromTo(articleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(tagsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      );

      // Scroll-triggered animations for content elements
      gsap.utils.toArray('.content-section').forEach((section: any, index) => {
        gsap.fromTo(section,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }, contentRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <div ref={contentRef} className="py-12">
      {/* Article Excerpt */}
      <div 
        ref={excerptRef}
        className="mb-12 p-8 bg-gradient-to-br from-amber-50 to-stone-50 border-l-4 border-amber-400 rounded-r-xl"
      >
        <h2 
          className="text-lg font-medium mb-4"
          style={{ 
            fontFamily: 'Minion Pro, serif',
            color: '#152239'
          }}
        >
          Resumen Ejecutivo
        </h2>
        <p 
          className="text-lg leading-relaxed font-light"
          style={{ color: '#4A5568' }}
        >
          {post.excerpt}
        </p>
      </div>

      {/* Article Content */}
      <article 
        ref={articleRef}
        className="max-w-none"
        style={{
          fontFamily: 'Minion Pro, serif',
          lineHeight: '1.8'
        }}
      >
        <div 
          className="content-section prose-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Divider */}
      <div className="my-12 flex items-center">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent"></div>
        <div className="px-4">
          <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent"></div>
      </div>

      {/* Tags */}
      <div ref={tagsRef} className="content-section">
        <h3 
          className="text-xl mb-4 font-medium"
          style={{ 
            fontFamily: 'Minion Pro, serif',
            color: '#152239'
          }}
        >
          Temas Relacionados
        </h3>
        <div className="flex flex-wrap gap-3">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 text-sm font-medium bg-white border border-stone-200 rounded-full hover:border-amber-300 hover:bg-amber-50 transition-all duration-200 cursor-pointer"
              style={{ color: '#4A5568' }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="content-section mt-16 p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white">
        <div className="text-center">
          <h3 
            className="text-2xl mb-4 font-bold"
            style={{ fontFamily: 'Minion Pro, serif' }}
          >
            ¿Necesita Asesoría Legal Especializada?
          </h3>
          <p className="text-slate-300 mb-6 font-light leading-relaxed max-w-2xl mx-auto">
            Nuestro equipo de expertos está disponible para brindarle la asesoría legal 
            que su empresa necesita. Contacte con nosotros para una consulta personalizada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors duration-300 rounded-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contactar Ahora
            </a>
            <a
              href="/services"
              className="inline-flex items-center px-8 py-4 border border-slate-600 text-slate-300 font-medium hover:border-slate-500 hover:text-white transition-colors duration-300 rounded-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Nuestros Servicios
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}