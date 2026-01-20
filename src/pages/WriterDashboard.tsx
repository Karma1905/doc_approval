import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { uploadFile, submitForApproval, type ParsedPost } from '@/services/api';
import FileUpload from '@/components/FileUpload';
import PostPreview from '@/components/PostPreview';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function WriterDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [post, setPost] = useState<ParsedPost | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError('');
    setSubmitError('');

    try {
      const response = await uploadFile(file);
      setPost({
        id: response.postId,
        title: response.title,
        content: response.content,
        imageUrl: response.imageUrl,
        status: 'draft',
      });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!post) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await submitForApproval(post.id);
      setPost({ ...post, status: 'pending' });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Writer Dashboard</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <section>
          <h2 className="text-lg font-medium mb-4">Upload Document</h2>
          <FileUpload
            onUpload={handleUpload}
            isLoading={isUploading}
            error={uploadError}
          />
        </section>

        {post && (
          <section>
            <h2 className="text-lg font-medium mb-4">Document Preview</h2>
            <PostPreview
              title={post.title}
              content={post.content}
              imageUrl={post.imageUrl}
              status={post.status}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
            {submitError && (
              <p className="mt-2 text-sm text-destructive">{submitError}</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
