import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getPendingPosts, approvePost, rejectPost, type PendingPost } from '@/services/api';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { LogOut, RefreshCw } from 'lucide-react';

export default function ManagerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PendingPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getPendingPosts();
      setPosts(data);
    } catch (err) {
      setError('Failed to load pending posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await approvePost(id);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (err) {
      setError('Failed to approve post');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await rejectPost(id);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (err) {
      setError('Failed to reject post');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Manager Dashboard</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchPosts} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-lg font-medium mb-4">Pending Approvals</h2>

        {error && (
          <p className="mb-4 text-sm text-destructive">{error}</p>
        )}

        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/50">
            <p className="text-muted-foreground">No pending posts to review</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                status={post.status}
                onApprove={handleApprove}
                onReject={handleReject}
                isProcessing={processingId === post.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
