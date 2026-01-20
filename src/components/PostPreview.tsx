import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PostPreviewProps {
  title: string;
  content: string;
  imageUrl?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function PostPreview({
  title,
  content,
  imageUrl,
  status,
  onSubmit,
  isSubmitting,
}: PostPreviewProps) {
  const getStatusVariant = () => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const isSubmittable = status === 'draft';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">{title || 'Untitled Document'}</CardTitle>
        <Badge variant={getStatusVariant()}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {imageUrl && (
          <div className="rounded-md overflow-hidden border">
            <img
              src={imageUrl}
              alt="Document preview"
              className="w-full h-48 object-cover"
            />
          </div>
        )}
        <div className="prose prose-sm max-w-none">
          <div className="p-4 bg-muted rounded-md max-h-64 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
              {content}
            </pre>
          </div>
        </div>
        <Button
          onClick={onSubmit}
          disabled={!isSubmittable || isSubmitting}
          className="w-full"
        >
          {isSubmitting
            ? 'Submitting...'
            : status === 'pending'
            ? 'Awaiting Approval'
            : status === 'approved'
            ? 'Approved'
            : status === 'rejected'
            ? 'Rejected'
            : 'Submit for Approval'}
        </Button>
      </CardContent>
    </Card>
  );
}
