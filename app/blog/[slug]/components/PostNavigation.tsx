'use client';

import { BlogPost } from '@/app/lib/domain/entities/BlogPost';

interface PostNavigationProps {
  currentPost: BlogPost;
  allPosts: BlogPost[];
}

export default function PostNavigation({ currentPost, allPosts }: PostNavigationProps) {
  // Find current post index
  const currentIndex = allPosts.findIndex(post => post.id === currentPost.id);
  
  // Get previous and next posts
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  if (!previousPost && !nextPost) return null;

  return (
    <section className="py-16 bg-white border-t border-stone-100">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Previous Post */}
          {previousPost ? (
            <a
              href={`/blog/${previousPost.slug}`}
              className="group flex items-center p-6 bg-gradient-to-br from-stone-50 to-slate-50 border border-stone-200 rounded-xl hover:border-amber-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center group-hover:bg-amber-100 transition-colors duration-300">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-slate-500 mb-1 font-medium uppercase tracking-wider">
                  Artículo Anterior
                </div>
                <h3 
                  className="text-lg font-medium leading-tight group-hover:opacity-80 transition-opacity duration-300 line-clamp-2"
                  style={{ 
                    fontFamily: 'Minion Pro, serif',
                    color: '#152239'
                  }}
                >
                  {previousPost.title}
                </h3>
              </div>
            </a>
          ) : (
            <div></div>
          )}

          {/* Next Post */}
          {nextPost ? (
            <a
              href={`/blog/${nextPost.slug}`}
              className="group flex items-center p-6 bg-gradient-to-br from-stone-50 to-slate-50 border border-stone-200 rounded-xl hover:border-amber-200 hover:shadow-lg transition-all duration-300 md:text-right"
            >
              <div className="flex-1 min-w-0 md:order-1">
                <div className="text-sm text-slate-500 mb-1 font-medium uppercase tracking-wider">
                  Siguiente Artículo
                </div>
                <h3 
                  className="text-lg font-medium leading-tight group-hover:opacity-80 transition-opacity duration-300 line-clamp-2"
                  style={{ 
                    fontFamily: 'Minion Pro, serif',
                    color: '#152239'
                  }}
                >
                  {nextPost.title}
                </h3>
              </div>
              <div className="flex-shrink-0 ml-4 md:order-2 md:ml-0 md:mr-4">
                <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center group-hover:bg-amber-100 transition-colors duration-300">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ) : (
            <div></div>
          )}
        </div>

        {/* Back to Blog */}
        <div className="text-center mt-12 pt-8 border-t border-stone-200">
          <a
            href="/blog"
            className="inline-flex items-center px-6 py-3 text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200"
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