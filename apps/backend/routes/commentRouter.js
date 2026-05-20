import { Router } from 'express';
import { createComment, deleteComment, getCommentsByPostId, updateComment } from '../controllers/commentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const commentRouter = Router({ mergeParams: true }); // passes down :postId from parent postRouter 

// === Post Nested Endpoints ===
// requests to /api/posts/:postId/comments
commentRouter.get('/', getCommentsByPostId);
commentRouter.post('/', createComment);

// === Standalon Endpoints ===
// requests to /api/comments/:id
commentRouter.delete('/:id', verifyToken, deleteComment);
commentRouter.put('/:id', verifyToken, updateComment);

export default commentRouter;