'use client';

import { useEffect, useState } from 'react';
import { createBlogPosts, blogAuthors, blogCategories } from '@/app/lib/data/blogPosts';
import { BlogPost } from '@/app/lib/domain/entities/BlogPost';
import Navbar from '@/app/components/navigation/Navbar';
import Footer from '@/app/components/sections/Footer';
import PostHeader from './components/PostHeader';
import PostContent from './components/PostContent';
import PostMeta from './components/PostMeta';
import RelatedPosts from './components/RelatedPosts';
import PostNavigation from './components/PostNavigation';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allPosts = createBlogPosts();
    const foundPost = allPosts.find(p => p.slug === params.slug);
    
    if (foundPost) {
      setPost(foundPost);
      
      // Get related posts (same category, different post)
      const related = allPosts
        .filter(p => p.categoryId === foundPost.categoryId && p.id !== foundPost.id)
        .slice(0, 3);
      setRelatedPosts(related);
      
      // Increment view count (in a real app, this would be an API call)
      foundPost.incrementViewCount();
    }
    
    setLoading(false);
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando artículo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-24 h-24 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1
              className="text-3xl mb-4"
              style={{
                fontFamily: 'Minion Pro, serif',
                fontWeight: 'bold',
                color: '#152239'
              }}
            >
              Artículo no encontrado
            </h1>
            <p className="text-slate-600 mb-6">
              El artículo que buscas no existe o ha sido movido.
            </p>
            <a
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors duration-300 rounded-lg"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver al Blog
            </a>
          </div>
        </div>
      </div>
    );
  }

  const author = blogAuthors.find(a => a.id === post.authorId);
  const category = blogCategories.find(c => c.id === post.categoryId);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        {/* Post Header */}
        <PostHeader
          post={post}
          author={author}
          category={category}
        />
        
        {/* Post Content - Medium Style Layout */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              {/* Main Content - Medium Style Width */}
              <div className="w-full max-w-2xl">
                <PostContent post={post} />
              </div>
              
              {/* Sidebar - Sticky positioned like Medium */}
              <div className="hidden lg:block lg:w-80 lg:pl-12 lg:flex-shrink-0">
                <div className="sticky top-24 pt-8">
                  <PostMeta
                    post={post}
                    author={author}
                    category={category}
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile Sidebar - Below content on mobile */}
            <div className="lg:hidden max-w-2xl mx-auto mt-12">
              <PostMeta
                post={post}
                author={author}
                category={category}
              />
            </div>
          </div>
        </div>
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <RelatedPosts posts={relatedPosts} />
        )}
        
        {/* Post Navigation */}
        <PostNavigation currentPost={post} allPosts={createBlogPosts()} />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}