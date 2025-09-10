'use client';

import { useState, useEffect } from 'react';
import { BlogPost } from '@/app/lib/domain/entities/BlogPost';
import Navbar from '@/app/components/navigation/Navbar';
import Footer from '@/app/components/sections/Footer';
import BlogHero from '@/app/components/blog/BlogHero';
import BlogCategories from '@/app/components/blog/BlogCategories';
import BlogGrid from '@/app/components/blog/BlogGrid';
import BlogSearch from '@/app/components/blog/BlogSearch';

interface BlogPostAPI {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  authorId: string;
  categoryId: string;
  tags: string[];
  publishedAt: string;
  viewCount: number;
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch blog posts from API
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/blog/posts');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // Convert API response to BlogPost entities
            const posts = result.data
              .filter((post: BlogPostAPI) => post.publishedAt) // Only include posts with publishedAt
              .map((post: BlogPostAPI) => new BlogPost({
                id: post.id,
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                content: '', // Content not needed for listing
                featuredImage: post.featuredImage,
                authorId: post.authorId,
                categoryId: post.categoryId,
                tags: post.tags,
                status: 'PUBLISHED' as any,
                publishedAt: new Date(post.publishedAt),
                seoTitle: post.title,
                seoDescription: post.excerpt,
                viewCount: post.viewCount,
                createdAt: new Date(post.publishedAt),
                updatedAt: new Date(post.publishedAt)
              }));
            setBlogPosts(posts);
          }
        } else {
          console.error('Failed to fetch blog posts');
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);
  
  // Get featured posts (first 3 most viewed)
  const featuredPosts = [...blogPosts]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 3);

  // Determine which posts to display
  const displayPosts = isSearchActive ? searchResults : blogPosts;

  // Handle search results
  const handleSearchResults = (results: BlogPost[]) => {
    setSearchResults(results);
  };

  // Handle search term changes
  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
    setIsSearchActive(term.trim().length > 0);
    
    // Clear category selection when searching
    if (term.trim().length > 0) {
      setSelectedCategory(null);
    }
  };

  // Handle category changes
  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    
    // Clear search when changing categories
    if (!isSearchActive) {
      setSearchTerm('');
      setSearchResults([]);
    }
  };

  // Listen for reset category event
  useEffect(() => {
    const handleResetCategory = () => {
      setSelectedCategory(null);
      if (!isSearchActive) {
        setSearchTerm('');
        setSearchResults([]);
      }
    };

    window.addEventListener('resetCategory', handleResetCategory);
    return () => window.removeEventListener('resetCategory', handleResetCategory);
  }, [isSearchActive]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        {/* Hero Section with Featured Post */}
        <BlogHero featuredPosts={featuredPosts} />
      
      {/* Search Section */}
      <section className="py-12 bg-gradient-to-br from-white to-stone-50 relative" style={{ zIndex: 1 }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2
              className="text-2xl md:text-3xl mb-4 leading-tight"
              style={{
                fontFamily: 'Minion Pro, serif',
                fontWeight: 'bold',
                color: '#152239'
              }}
            >
              Buscar <span style={{ color: '#B79F76', fontStyle: 'italic' }}>Insights Legales</span>
            </h2>
            <p className="text-slate-600 font-light max-w-2xl mx-auto">
              Encuentre artículos especializados, análisis jurídicos y tendencias legales
            </p>
          </div>
          
          <BlogSearch
            posts={blogPosts}
            onSearchResults={handleSearchResults}
            onSearchTermChange={handleSearchTermChange}
          />
        </div>
      </section>

      {/* Search Results Summary - Moved outside search section */}
      {isSearchActive && (
        <section className="py-4 bg-stone-50 relative" style={{ zIndex: 1 }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-stone-200">
              <p className="text-slate-600 text-sm sm:text-base">
                {searchResults.length > 0 ? (
                  <>
                    <span className="block sm:inline">Se encontraron </span>
                    <strong className="text-amber-600">{searchResults.length}</strong>
                    <span className="block sm:inline"> resultado{searchResults.length !== 1 ? 's' : ''} para </span>
                    <strong className="text-slate-800 break-words">"{searchTerm}"</strong>
                  </>
                ) : (
                  <>
                    <span className="block sm:inline">No se encontraron resultados para </span>
                    <strong className="text-slate-800 break-words">"{searchTerm}"</strong>
                  </>
                )}
              </p>
              {searchResults.length === 0 && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setIsSearchActive(false);
                    setSearchResults([]);
                  }}
                  className="mt-3 px-4 py-2 text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200 bg-amber-50 hover:bg-amber-100 rounded-lg text-sm"
                >
                  Ver todos los artículos
                </button>
              )}
            </div>
          </div>
        </section>
      )}
      
      {/* Categories Filter - Hide when searching */}
      {!isSearchActive && (
        <BlogCategories 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          posts={blogPosts}
        />
      )}
      
      {/* Blog Posts Grid */}
      <BlogGrid
        posts={displayPosts}
        selectedCategory={isSearchActive ? null : selectedCategory}
        searchTerm={searchTerm}
        isSearchActive={isSearchActive}
      />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}