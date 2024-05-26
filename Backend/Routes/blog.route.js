import express from "express";
import blog from "../Controller/blog.controller.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";
const router = express.Router();

// POST endpoint to create a new blog post
router.post('/blogs' ,blog);

export default router;

