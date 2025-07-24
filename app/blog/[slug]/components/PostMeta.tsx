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
    <aside ref={sidebarRef} className="space-y-12 lg:space-y-16">
      {/* Author Card - Improved spacing and layout */}
      {author && (
        <div className="bg-white p-8 lg:p-10 xl:p-12 rounded-xl border border-stone-200 shadow-sm">
          <div className="border-b border-stone-100 pb-6 mb-8">
            <h3 
              className="text-xl xl:text-2xl font-bold"
              style={{ 
                fontFamily: 'Minion Pro, serif',
                color: '#152239'
              }}
            >
              Sobre el Autor
            </h3>
          </div>
          
          <div className="mb-10">
            <div className="flex items-start space-x-6 mb-8">
              <div className="w-24 h-24 xl:w-28 xl:h-28 bg-gradient-to-br from-slate-300 to-stone-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-xl xl:text-2xl font-medium text-white">
                  {author.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 
                  className="text-lg xl:text-xl font-bold text-slate-800 mb-3 leading-tight"
                  style={{ fontFamily: 'Minion Pro, serif' }}
                >
                  {author.name}
                </h4>
                <p 
                  className="text-base xl:text-lg font-medium leading-relaxed"
                  style={{ color: '#B79F76' }}
                >
                  {author.position}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-10">
            <p className="text-base xl:text-lg text-slate-700 font-light leading-relaxed">
              {author.bio}
            </p>
          </div>
          
          <div className="border-t border-stone-100 pt-8">
            <h5 className="text-base xl:text-lg font-semibold text-slate-800 mb-6">
              Especialidades:
            </h5>
            <div className="flex flex-wrap gap-3">
              {author.expertise.map((skill, index) => (
                <span
                  key={index}
                  className="inline-block px-4 py-3 text-sm xl:text-base font-medium bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 rounded-lg border border-amber-200 shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Table of Contents */}
      <div className="bg-gradient-to-br from-stone-50 to-slate-50 p-8 lg:p-10 xl:p-12 rounded-xl border border-stone-200">
        <div className="border-b border-stone-200 pb-6 mb-8">
          <h3 
            className="text-xl xl:text-2xl font-bold"
            style={{ 
              fontFamily: 'Minion Pro, serif',
              color: '#152239'
            }}
          >
            Contenido
          </h3>
        </div>
        
        <nav className="space-y-1">
          <a 
            href="#introduccion" 
            className="flex items-center text-base xl:text-lg text-slate-600 hover:text-amber-600 transition-all duration-200 py-3 px-4 rounded-lg hover:bg-white/50 hover:shadow-sm group"
          >
            <span className="w-2 h-2 bg-stone-400 rounded-full mr-4 group-hover:bg-amber-500 transition-colors duration-200"></span>
            <span>Introducción</span>
          </a>
          <a 
            href="#marco-legal" 
            className="flex items-center text-base xl:text-lg text-slate-600 hover:text-amber-600 transition-all duration-200 py-3 px-4 rounded-lg hover:bg-white/50 hover:shadow-sm group"
          >
            <span className="w-2 h-2 bg-stone-400 rounded-full mr-4 group-hover:bg-amber-500 transition-colors duration-200"></span>
            <span>Marco Legal</span>
          </a>
          <a 
            href="#implicaciones" 
            className="flex items-center text-base xl:text-lg text-slate-600 hover:text-amber-600 transition-all duration-200 py-3 px-4 rounded-lg hover:bg-white/50 hover:shadow-sm group"
          >
            <span className="w-2 h-2 bg-stone-400 rounded-full mr-4 group-hover:bg-amber-500 transition-colors duration-200"></span>
            <span>Implicaciones Prácticas</span>
          </a>
          <a 
            href="#recomendaciones" 
            className="flex items-center text-base xl:text-lg text-slate-600 hover:text-amber-600 transition-all duration-200 py-3 px-4 rounded-lg hover:bg-white/50 hover:shadow-sm group"
          >
            <span className="w-2 h-2 bg-stone-400 rounded-full mr-4 group-hover:bg-amber-500 transition-colors duration-200"></span>
            <span>Recomendaciones</span>
          </a>
          <a 
            href="#conclusion" 
            className="flex items-center text-base xl:text-lg text-slate-600 hover:text-amber-600 transition-all duration-200 py-3 px-4 rounded-lg hover:bg-white/50 hover:shadow-sm group"
          >
            <span className="w-2 h-2 bg-stone-400 rounded-full mr-4 group-hover:bg-amber-500 transition-colors duration-200"></span>
            <span>Conclusiones</span>
          </a>
        </nav>
      </div>

      {/* Social Share - Redesigned layout */}
      <div className="bg-white p-10 xl:p-12 rounded-xl border border-stone-200 shadow-sm">
        <h3 
          className="text-xl xl:text-2xl font-bold mb-8"
          style={{ 
            fontFamily: 'Minion Pro, serif',
            color: '#152239'
          }}
        >
          Compartir Artículo
        </h3>
        
        <div className="space-y-5">
          {/* Twitter */}
          <button className="w-full flex items-center px-6 py-4 xl:px-8 xl:py-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
            <div className="w-12 h-12 xl:w-14 xl:h-14 bg-white/20 rounded-lg flex items-center justify-center mr-5">
              <svg className="w-6 h-6 xl:w-7 xl:h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-base xl:text-lg">Compartir en Twitter</div>
              <div className="text-blue-100 text-sm xl:text-base">Comparte con tus seguidores</div>
            </div>
          </button>

          {/* LinkedIn */}
          <button className="w-full flex items-center px-6 py-4 xl:px-8 xl:py-5 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-900 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
            <div className="w-12 h-12 xl:w-14 xl:h-14 bg-white/20 rounded-lg flex items-center justify-center mr-5">
              <svg className="w-6 h-6 xl:w-7 xl:h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-base xl:text-lg">Compartir en LinkedIn</div>
              <div className="text-blue-200 text-sm xl:text-base">Comparte profesionalmente</div>
            </div>
          </button>

          {/* WhatsApp */}
          <button className="w-full flex items-center px-6 py-4 xl:px-8 xl:py-5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
            <div className="w-12 h-12 xl:w-14 xl:h-14 bg-white/20 rounded-lg flex items-center justify-center mr-5">
              <svg className="w-6 h-6 xl:w-7 xl:h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.484 3.488"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-base xl:text-lg">Compartir en WhatsApp</div>
              <div className="text-green-200 text-sm xl:text-base">Envía a tus contactos</div>
            </div>
          </button>
        </div>
        
        <div className="mt-8 pt-8 border-t border-stone-200">
          <button className="w-full flex items-center justify-center px-6 py-4 xl:px-8 xl:py-5 bg-gradient-to-r from-stone-100 to-stone-200 text-slate-700 rounded-lg hover:from-stone-200 hover:to-stone-300 transition-all duration-300 transform hover:scale-105">
            <svg className="w-6 h-6 xl:w-7 xl:h-7 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="font-semibold text-base xl:text-lg">Copiar Enlace del Artículo</span>
          </button>
        </div>
      </div>

      {/* Article Stats */}
      <div className="bg-gradient-to-br from-amber-50 to-stone-50 p-8 xl:p-10 rounded-xl border border-amber-200">
        <h3 
          className="text-xl xl:text-2xl font-bold mb-6"
          style={{ 
            fontFamily: 'Minion Pro, serif',
            color: '#152239'
          }}
        >
          Estadísticas
        </h3>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-base xl:text-lg text-slate-600">Publicado:</span>
            <span className="text-base xl:text-lg font-medium text-slate-800">
              {new Intl.DateTimeFormat('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }).format(post.publishedAt!)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base xl:text-lg text-slate-600">Vistas:</span>
            <span className="text-base xl:text-lg font-medium text-slate-800">
              {post.viewCount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base xl:text-lg text-slate-600">Categoría:</span>
            <span 
              className="text-base xl:text-lg font-medium"
              style={{ color: category?.color || '#B79F76' }}
            >
              {category?.name || 'Legal'}
            </span>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-slate-800 p-10 xl:p-12 rounded-xl text-white">
        <h3 
          className="text-xl xl:text-2xl font-bold mb-6"
          style={{ fontFamily: 'Minion Pro, serif' }}
        >
          Newsletter Legal
        </h3>
        <p className="text-slate-300 text-base xl:text-lg mb-8 font-light leading-relaxed">
          Reciba insights legales y actualizaciones directamente en su correo.
        </p>
        <div className="space-y-5">
          <input
            type="email"
            placeholder="Su correo electrónico"
            className="w-full px-6 py-4 xl:px-8 xl:py-5 text-slate-800 text-base xl:text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button className="w-full px-6 py-4 xl:px-8 xl:py-5 bg-amber-600 text-white text-base xl:text-lg font-medium hover:bg-amber-700 transition-colors duration-300 rounded-lg">
            Suscribirse
          </button>
        </div>
      </div>
    </aside>
  );
}