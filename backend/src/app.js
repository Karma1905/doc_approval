import "dotenv/config";
import express from "express";
import cors from "cors";
import postRoutes from "./routes/post.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", postRoutes);

app.listen(8000, () => {
  console.log("Backend running on http://localhost:8000");
});
