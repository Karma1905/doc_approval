import fs from "fs";
import path from "path";

const filePath = path.resolve("src/data/posts.json");

export function readPosts() {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function writePosts(posts) {
  fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
}
