import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  createPost,
  getAllPublishedPosts,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} from '../controllers/postController.js';
import { createComment, getCommentsByPostId } from '../controllers/commentController.js';
import commentRouter from './commentRouter.js';

const postRouter = Router();

// === Static Protected Routes ===
postRouter.get('/all', verifyToken, getAllPosts); // Including unpublished posts

// === Standard Routes ===
postRouter.get('/', getAllPublishedPosts);
postRouter.post('/', verifyToken, createPost); // Protected Create Route

// === Specific Page Routes ====
postRouter.get('/:id', getPostById);
// Protected routes (Requires valid JWT verifyToken middleware)
postRouter.put('/:id', verifyToken, updatePost);
postRouter.delete('/:id', verifyToken, deletePost);

// === Mount Comment Router ===
postRouter.use('/:postId/comments', commentRouter);

export default postRouter;