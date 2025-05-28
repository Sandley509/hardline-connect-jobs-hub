
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, User } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  created_at: string;
  author_id: string;
  published: boolean;
  slug: string;
  profiles?: {
    username: string;
  };
}

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles(username)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    }
  });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest insights, tips, and news from Hardline Connect.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {posts?.map((post) => (
              <Card key={post.id} className="p-8 hover:shadow-lg transition-shadow">
                <article>
                  <header className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      {post.title}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{post.profiles?.username || 'Admin'}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </header>
                  
                  <div className="prose prose-orange max-w-none">
                    {post.excerpt ? (
                      <p className="text-gray-600 text-lg leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    ) : null}
                    
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }}
                    />
                  </div>
                </article>
              </Card>
            ))}

            {(!posts || posts.length === 0) && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No blog posts available at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Blog;
