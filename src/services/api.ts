const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ParsedPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
}

export interface UploadResponse {
  postId: string;
  title: string;
  content: string;
  imageUrl?: string;
}

export interface PendingPost {
  id: string;
  title: string;
  content: string;
  status: string;
}

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
}

export async function submitForApproval(postId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/submit/${postId}`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Submission failed' }));
    throw new Error(error.message || 'Submission failed');
  }
}

export async function getPendingPosts(): Promise<PendingPost[]> {
  const response = await fetch(`${API_BASE_URL}/pending`);

  if (!response.ok) {
    throw new Error('Failed to fetch pending posts');
  }

  return response.json();
}

export async function approvePost(postId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/approve?post_id=${postId}`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to approve post');
  }
}

export async function rejectPost(postId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/reject?post_id=${postId}`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to reject post');
  }
}
