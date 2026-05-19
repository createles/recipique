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

const postRouter = Router();

// Public routes (No authentication required)
postRouter.get('/', getAllPublishedPosts);
postRouter.get('/:id', getPostById);

// Protected routes (Requires valid JWT verifyToken middleware)
postRouter.get('/all', verifyToken, getAllPosts);
postRouter.post('/', verifyToken, createPost);
postRouter.put('/:id', verifyToken, updatePost);
postRouter.delete('/:id', verifyToken, deletePost);

export default postRouter;