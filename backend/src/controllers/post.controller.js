import { v4 as uuid } from "uuid";
import { parseFile } from "../services/parser.service.js";
import { readPosts, writePosts } from "../services/storage.service.js";
import { sendApprovalEmail } from "../services/email.service.js";

export async function uploadPost(req, res) {
  try {
    const parsed = await parseFile(req.file);
    const posts = readPosts();

    const post = {
      id: uuid(),
      ...parsed,
      status: "draft",
      createdAt: new Date().toISOString(),
    };

    posts.push(post);
    writePosts(posts);

    res.json({ postId: post.id, ...parsed });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function submitPost(req, res) {
  const posts = readPosts();
  const post = posts.find(p => p.id === req.params.id);

  if (!post || post.status !== "draft") {
    return res.status(400).json({ message: "Invalid state" });
  }

  post.status = "pending";
  writePosts(posts);
  await sendApprovalEmail(post);

  res.json({ status: "pending" });
}

export function getPending(req, res) {
  const posts = readPosts().filter(p => p.status === "pending");
  res.json(posts);
}

export function approvePost(req, res) {
  const posts = readPosts();
  const post = posts.find(p => p.id === req.query.post_id);
  post.status = "approved";
  writePosts(posts);
  res.json({ status: "approved" });
}

export function rejectPost(req, res) {
  const posts = readPosts();
  const post = posts.find(p => p.id === req.query.post_id);
  post.status = "rejected";
  writePosts(posts);
  res.json({ status: "rejected" });
}
