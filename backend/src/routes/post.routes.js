import express from "express";
import multer from "multer";
import {
  uploadPost,
  submitPost,
  getPending,
  approvePost,
  rejectPost
} from "../controllers/post.controller.js";

const router = express.Router();
const upload = multer();

router.post("/upload", upload.single("file"), uploadPost);
router.post("/submit/:id", submitPost);
router.get("/pending", getPending);
router.post("/approve", approvePost);
router.post("/reject", rejectPost);

export default router;
