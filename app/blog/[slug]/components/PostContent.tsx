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
    <div ref={contentRef} className="py-8 lg:py-12">
      {/* Article Excerpt - Medium Style */}
      <div
        ref={excerptRef}
        className="mb-10 pb-8 border-b border-gray-100"
      >
        <p
          className="text-xl leading-relaxed text-gray-600 font-light"
          style={{
            fontFamily: 'Bennet, serif',
            fontSize: '22px',
            lineHeight: '1.58',
            fontWeight: 'normal'
          }}
        >
          {post.excerpt}
        </p>
      </div>

      {/* Article Content - Medium Style Typography */}
      <article
        ref={articleRef}
        className="medium-content"
        style={{
          fontFamily: 'Bennet, serif',
          fontSize: '20px',
          lineHeight: '1.58',
          color: '#292929',
          fontWeight: 'normal'
        }}
      >
        <div
          className="content-section medium-prose"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Medium Style Separator */}
      <div className="my-16 flex justify-center">
        <div className="flex space-x-2">
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        </div>
      </div>

      {/* Tags - Medium Style */}
      <div ref={tagsRef} className="content-section mb-12">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '13px'
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTA Section - Simplified for Medium Style */}
      <div className="content-section mt-20 pt-8 border-t border-gray-100">
        <div className="text-center">
          <h3
            className="text-2xl mb-4 font-semibold text-gray-900"
            style={{
              fontFamily: 'Bennet, serif',
              fontWeight: '600'
            }}
          >
            ¿Necesita Asesoría Legal Especializada?
          </h3>
          <p className="text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto" style={{
            fontSize: '18px',
            fontFamily: 'Bennet, serif',
            fontWeight: 'normal'
          }}>
            Nuestro equipo de expertos está disponible para brindarle la asesoría legal
            que su empresa necesita.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors duration-300 rounded"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Contactar Ahora
            </a>
            <a
              href="/services"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium hover:border-gray-400 transition-colors duration-300 rounded"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Nuestros Servicios
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}