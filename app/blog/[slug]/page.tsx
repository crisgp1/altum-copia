'use client';

import { useEffect, useState } from 'react';
// Note: Author and category data should be fetched from API in a real implementation
import { BlogPost, PostStatus } from '@/app/lib/domain/entities/BlogPost';
import Navbar from '@/app/components/navigation/Navbar';
import Footer from '@/app/components/sections/Footer';
import PostHeader from './components/PostHeader';
import PostContent from './components/PostContent';
import PostMeta from './components/PostMeta';
import RelatedPosts from './components/RelatedPosts';
import PostNavigation from './components/PostNavigation';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{slug: string} | null>(null);
  const [author, setAuthor] = useState<{
    id: string;
    name: string;
    position: string;
    bio: string;
    avatar: string;
    expertise: string[];
  } | null>(null);

  useEffect(() => {
    params.then(p => setResolvedParams(p));
  }, [params]);

  useEffect(() => {
    if (!post) return;
    
    const fetchAuthor = async () => {
      try {
        // Try to fetch attorney data
        const attorneyResponse = await fetch('/api/attorneys/all-members');
        if (attorneyResponse.ok) {
          const attorneyResult = await attorneyResponse.json();
          // The API returns an array directly, not wrapped in a success object
          if (Array.isArray(attorneyResult)) {
            console.log('Available attorneys:', attorneyResult.map(a => ({ id: a.id, name: a.nombre })));
            console.log('Looking for authorId:', post.authorId);
            const foundAttorney = attorneyResult.find((att: any) => att.id === post.authorId);
            console.log('Found attorney:', foundAttorney);
            if (foundAttorney) {
              setAuthor({
                id: foundAttorney.id,
                name: foundAttorney.nombre,
                position: foundAttorney.cargo,
                bio: foundAttorney.descripcionCorta || 'Especialista en derecho con amplia experiencia en el área legal.',
                avatar: foundAttorney.imagenUrl || '',
                expertise: foundAttorney.especializaciones || ['Derecho Legal']
              });
              return;
            }
          }
        }
        
        // Fallback to placeholder data if attorney not found
        console.log('Attorney not found, using fallback for authorId:', post.authorId);
        setAuthor({
          id: post.authorId,
          name: post.authorId === 'admin' ? 'Equipo Altum Legal' : `Autor (ID: ${post.authorId})`,
          position: 'Abogado Especialista',
          bio: 'Especialista en derecho con amplia experiencia en el área legal.',
          avatar: '',
          expertise: ['Derecho Corporativo', 'Asesoría Legal', 'Litigios']
        });
      } catch (error) {
        console.error('Error fetching attorney:', error);
        // Fallback to placeholder data
        setAuthor({
          id: post.authorId,
          name: post.authorId === 'admin' ? 'Equipo Altum Legal' : `Autor (ID: ${post.authorId})`,
          position: 'Abogado Especialista',
          bio: 'Especialista en derecho con amplia experiencia en el área legal.',
          avatar: '',
          expertise: ['Derecho Corporativo', 'Asesoría Legal', 'Litigios']
        });
      }
    };
    
    fetchAuthor();
  }, [post]);

  useEffect(() => {
    if (!resolvedParams) return;
    
    const fetchPost = async () => {
      try {
        setLoading(true);
        
        // First, get all posts to find the one with the matching slug
        const postsResponse = await fetch('/api/blog/posts');
        if (!postsResponse.ok) {
          console.error('Failed to fetch posts');
          setLoading(false);
          return;
        }
        
        const postsResult = await postsResponse.json();
        if (!postsResult.success || !postsResult.data) {
          console.error('Invalid posts response');
          setLoading(false);
          return;
        }
        
        // Find the post with matching slug
        const foundPostData = postsResult.data.find((p: any) => p.slug === resolvedParams.slug);
        if (!foundPostData) {
          console.error('Post not found');
          setLoading(false);
          return;
        }
        
        // Get the full post content
        const postResponse = await fetch(`/api/admin/blog/posts/${foundPostData.id}`);
        if (!postResponse.ok) {
          console.error('Failed to fetch full post');
          setLoading(false);
          return;
        }
        
        const postResult = await postResponse.json();
        if (!postResult.success || !postResult.data) {
          console.error('Invalid post response');
          setLoading(false);
          return;
        }
        
        const postData = postResult.data;
        
        // Convert to BlogPost entity
        const foundPost = new BlogPost({
          id: postData.id,
          title: postData.title,
          slug: postData.slug,
          excerpt: postData.excerpt,
          content: postData.content,
          featuredImage: postData.featuredImage,
          authorId: postData.authorId,
          hasExternalCollaborator: postData.hasExternalCollaborator || false,
          externalCollaboratorName: postData.externalCollaboratorName || '',
          externalCollaboratorTitle: postData.externalCollaboratorTitle || '',
          categoryId: postData.categoryId,
          tags: postData.tags,
          status: PostStatus.PUBLISHED,
          publishedAt: postData.publishedAt ? new Date(postData.publishedAt) : new Date(),
          seoTitle: postData.seoTitle,
          seoDescription: postData.seoDescription,
          viewCount: postData.viewCount,
          formatConfig: postData.formatConfig || { lineHeight: 1.4, paragraphSpacing: 0.5 },
          createdAt: postData.createdAt ? new Date(postData.createdAt) : new Date(),
          updatedAt: postData.updatedAt ? new Date(postData.updatedAt) : new Date()
        });
        
        setPost(foundPost);
        
        // Get related posts (same category, different post)
        const related = postsResult.data
          .filter((p: any) => p.categoryId === foundPost.categoryId && p.id !== foundPost.id && p.publishedAt)
          .slice(0, 3)
          .map((p: any) => new BlogPost({
            id: p.id,
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt,
            content: '',
            featuredImage: p.featuredImage,
            authorId: p.authorId,
            hasExternalCollaborator: false,
            categoryId: p.categoryId,
            tags: p.tags,
            status: PostStatus.PUBLISHED,
            publishedAt: new Date(p.publishedAt),
            seoTitle: p.title,
            seoDescription: p.excerpt,
            viewCount: p.viewCount,
            createdAt: new Date(p.publishedAt),
            updatedAt: new Date(p.publishedAt)
          }));
        
        setRelatedPosts(related);
        
        // Increment view count
        try {
          await fetch(`/api/blog/posts/${foundPost.id}/view`, { method: 'POST' });
        } catch (error) {
          console.warn('Failed to increment view count:', error);
        }
        
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [resolvedParams]);

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
  
  const category = post ? {
    id: post.categoryId,
    name: post.categoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    slug: post.categoryId,
    description: '',
    color: '#B79F76'
  } : null;

  if (!author) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando información del autor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        {/* Post Header */}
        <PostHeader
          post={post}
          author={author}
          category={category!}
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
                    category={category!}
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile Sidebar - Below content on mobile */}
            <div className="lg:hidden max-w-2xl mx-auto mt-12">
              <PostMeta
                post={post}
                author={author}
                category={category!}
              />
            </div>
          </div>
        </div>
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <RelatedPosts posts={relatedPosts} />
        )}
        
        {/* Post Navigation */}
        <PostNavigation currentPost={post} allPosts={[]} />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}