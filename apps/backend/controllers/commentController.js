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

export const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const targetComment = Number(id);
    
    // Use delete many to prevent exceptions for missing records / record not found
    const deletedComment = await prisma.comment.deleteMany({
      where: {
        id: targetComment
      }
    })

    // Check whether a record was deleted or not
    if (deletedComment.count === 0) {
      return res.status(404).json({
        message: `Comment with id ${id} not found.`
      })
    }

    return res.status(200).json({
      message: `Successfully delete comment ${id}.`
    });
  } catch (err) {
    console.error('Failed to delete comment:', err);
    return res.status(500).json({
      message: 'Failed to delete comment. Please try again.'
    });
  }
}

export const updateComment = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({
      message: 'Please provide modified text content.'
    });
  }

  try {
    const targetCommentId = Number(id);

    const updatedComment = await prisma.comment.updateMany({
      where: {
        id: targetCommentId,
        userId: user.id
      },
      data: {
        text: text
      }
    })

    if (updatedComment.count === 0) {
      return res.status(403).json({
        message: 'Comment not found.'
      })
    }

    const updatedCommentPayload = await prisma.comment.findUnique({
      where: { id: targetCommentId }
    });

    return res.status(200).json({
      message: `Successfully edited comment ${id}.`,
      updatedComment: updatedCommentPayload
    })

  } catch (err) {
    console.error('Failed to update comment:', err);
    return res.status(500).json({
      message: 'Failed to update comment. Please try again.'
    });
  }
}