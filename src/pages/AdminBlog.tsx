
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  created_at: string;
  author_id: string;
  published: boolean;
  slug: string;
}

const AdminBlog = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    published: false
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    }
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const slug = await generateSlug(postData.title);
      
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          ...postData,
          author_id: user.id,
          slug
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      setIsCreating(false);
      setFormData({ title: '', content: '', excerpt: '', published: false });
      toast({
        title: "Blog post created",
        description: "Your blog post has been created successfully.",
      });
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, ...postData }: { id: string } & typeof formData) => {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          ...postData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      setEditingPost(null);
      setFormData({ title: '', content: '', excerpt: '', published: false });
      toast({
        title: "Blog post updated",
        description: "Your blog post has been updated successfully.",
      });
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({
        title: "Blog post deleted",
        description: "The blog post has been deleted successfully.",
      });
    }
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase
        .from('blog_posts')
        .update({ published: !published })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({
        title: "Post status updated",
        description: "The blog post publish status has been updated.",
      });
    }
  });

  const generateSlug = async (title: string) => {
    const { data } = await supabase.rpc('generate_slug', { title });
    return data || title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      updatePostMutation.mutate({ id: editingPost.id, ...formData });
    } else {
      createPostMutation.mutate(formData);
    }
  };

  const startEditing = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      published: post.published
    });
    setIsCreating(false);
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingPost(null);
    setFormData({ title: '', content: '', excerpt: '', published: false });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          {!isCreating && !editingPost && (
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Post
            </Button>
          )}
        </div>

        {(isCreating || editingPost) && (
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-semibold">
                {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter blog post title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Excerpt</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief description of the post"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your blog post content here..."
                  rows={10}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                />
                <label htmlFor="published" className="text-sm font-medium">
                  Publish immediately
                </label>
              </div>

              <div className="flex space-x-4">
                <Button 
                  type="submit" 
                  disabled={createPostMutation.isPending || updatePostMutation.isPending}
                >
                  {editingPost ? 'Update Post' : 'Create Post'}
                </Button>
                <Button type="button" variant="outline" onClick={cancelForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">All Blog Posts</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {posts?.map((post) => (
                <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{post.title}</h3>
                      {post.excerpt && (
                        <p className="text-sm text-gray-600 mt-1">{post.excerpt}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Created: {new Date(post.created_at).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded ${
                          post.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePublishMutation.mutate({ 
                          id: post.id, 
                          published: post.published 
                        })}
                      >
                        {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(post)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this post?')) {
                            deletePostMutation.mutate(post.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {(!posts || posts.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No blog posts yet. Create your first post!</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;
