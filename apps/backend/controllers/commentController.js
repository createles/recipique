import { prisma } from '../lib/prisma.js';

export const createComment = async (req, res) => {
  const { postId } = req.params;
  const { text, username } = req.body;

  if (!text) return res.status(400).json({
    message: 'Missing text; Please include text in the comment body.'
  });

  if (!username) return res.status(400).json({
    message: 'Missing username; Please include a username in the comment body.'
  })

  try {
    const targetPostId = Number(id);

    const postExists = await prisma.post.findUnique({
      where: { id: targetPostId }
    });

    if (!postExists) {
      return res.status(404).json({
        message: `Cannot add comment: Post with id ${id} does not exist.`
      });
    }

    // Check whether authenticated user is logged in
    const authorId = req.user.id ? Number(req.user.id) : null;

    const comment = await prisma.comment.create({
      data: {
        text: text,
        username: username,
        postId: targetPostId,
        // Optional: attach userId to comment if authenticated, null if visitor
        userId: authorId
      }
    })

    return res.status(200).json({
      message: 'Successfully created comment.',
      comment: comment
    })

  } catch (err) {
    console.error('Failed to create comment:', err);
    return res.status(500).json({
      message: 'Failed to create comment. Please try again.'
    })
  }
}

export const getCommentsByPostId = async (req, res) => {
  const { postId } = req.params;
   
  if (!id) {
    return res.status(400).json({
      message: 'Missing post identification parameter.'
    });
  }

  try {
    const targetPostId = Number(id);
    
    const comments = await prisma.comment.findMany({
      where: {
        postId: targetPostId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.status(200).json({
      message: 'Successfully fetched comments for post.',
      comments: comments
    })
  } catch (err) {
    console.error('Failed to fetch comments for post:', err);
    return res.status(500).json({
      message: 'Failed to fetch comments for post. Please try again.'
    });
  }
}
