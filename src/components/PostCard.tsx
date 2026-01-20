import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  status: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isProcessing: boolean;
}

export default function PostCard({
  id,
  title,
  content,
  status,
  onApprove,
  onReject,
  isProcessing,
}: PostCardProps) {
  const truncatedContent = content.length > 100 
    ? content.substring(0, 100) + '...' 
    : content;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <CardTitle className="text-lg leading-tight">{title}</CardTitle>
        <Badge variant="secondary">{status}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{truncatedContent}</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => onApprove(id)}
            disabled={isProcessing}
            className="flex-1"
          >
            <Check className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onReject(id)}
            disabled={isProcessing}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
