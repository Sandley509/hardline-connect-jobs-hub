
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  created_at: string;
  author_id: string;
  published: boolean;
  slug: string;
  author_username?: string;
}

const POSTS_PER_PAGE = 6;

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['blog-posts', currentPage],
    queryFn: async () => {
      // Get total count first
      const { count } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('published', true);

      // Get paginated posts
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE - 1);

      if (error) throw error;

      if (!data || data.length === 0) {
        return { posts: [], totalCount: count || 0 };
      }

      // Get author details
      const authorIds = [...new Set(data.map(post => post.author_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', authorIds);

      const postsWithAuthors = data.map(post => ({
        ...post,
        author_username: profiles?.find(p => p.id === post.author_id)?.username || 'Admin'
      }));

      return { posts: postsWithAuthors as BlogPost[], totalCount: count || 0 };
    }
  });

  const posts = postsData?.posts || [];
  const totalPages = Math.ceil((postsData?.totalCount || 0) / POSTS_PER_PAGE);

  const toggleExpanded = (postId: string) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit).trim() + '...';
  };

  return (
    <Layout>
      <div className="bg-gradient-to-b from-orange-50 to-white">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-orange-600">Blog</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the latest insights, industry trends, and expert tips from the Hardline Connect team. 
              Stay ahead with our comprehensive guides and thought leadership articles.
            </p>
          </div>

          {/* Featured Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{postsData?.totalCount || 0}</div>
              <div className="text-gray-600">Articles Published</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">50K+</div>
              <div className="text-gray-600">Monthly Readers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">Expert</div>
              <div className="text-gray-600">Industry Insights</div>
            </div>
          </div>
        </div>

        {/* Blog Posts Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {posts.map((post, index) => {
                  const isExpanded = expandedPosts.has(post.id);
                  const isLarge = index === 0; // Make first post featured
                  
                  return (
                    <Card 
                      key={post.id} 
                      className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                        isLarge ? 'md:col-span-2 lg:col-span-2' : ''
                      }`}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            Latest
                          </Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{getReadingTime(post.content)}</span>
                          </div>
                        </div>
                        
                        <h2 className={`font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors ${
                          isLarge ? 'text-2xl lg:text-3xl' : 'text-xl'
                        }`}>
                          {post.title}
                        </h2>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span className="font-medium">{post.author_username}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        {post.excerpt && (
                          <p className="text-gray-600 text-lg leading-relaxed mb-4">
                            {post.excerpt}
                          </p>
                        )}
                        
                        <div className="prose prose-gray max-w-none">
                          <div 
                            className="text-gray-700 leading-relaxed mb-4"
                            dangerouslySetInnerHTML={{ 
                              __html: isExpanded 
                                ? post.content.replace(/\n/g, '<br>') 
                                : truncateText(post.content.replace(/\n/g, ' '), isLarge ? 300 : 150).replace(/\n/g, '<br>')
                            }}
                          />
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          onClick={() => toggleExpanded(post.id)}
                          className="p-0 h-auto text-orange-600 hover:text-orange-700 font-medium"
                        >
                          {isExpanded ? 'Read Less' : 'Read More'}
                          <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Articles Yet</h3>
                <p className="text-gray-600 text-lg">
                  We're working on some amazing content for you. Check back soon for insightful articles and industry updates!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Newsletter Section */}
        <div className="bg-gray-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl text-gray-300 mb-8">
              Get the latest articles and insights delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 border-0 focus:ring-2 focus:ring-orange-500"
              />
              <Button className="bg-orange-600 hover:bg-orange-700 px-8 py-3">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
