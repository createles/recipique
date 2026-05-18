import { prisma } from '../lib/prisma.js';

export const createPost = async (req, res) => {
  const data = req.body;
  const userId = req.user.id;

  try {
    const newPost = await prisma.post.create({
      data: {
        title: data.title,
        summary: data.summary || '',
        content: data.content,
        ingredients: data.ingredients || '',
        prepTime: data.prepTime || '',
        cookTime: data.cookTime || '',
        imageUrl: data.imageUrl || '',
        published: Boolean(data.published), // Strictly evaluate as Boolean
        authorId: userId
      }
    });

    return res.status(201).json({
      message: 'Post successfully created.',
      post: newPost
    });
  } catch (err) {
    console.error('Failed to create post:', err);
    return res.status(500).json({ message: 'Could not create post. Try again.' });
  }
}

export const getAllPublishedPosts = async (req, res) => {
  try {
    const published = await prisma.post.findMany({
      where: {
        published: true
      }
    })

    return res.status(200).json({
      message: 'Successfully fetched published posts.',
      posts: published
    })
  } catch (err) {
    console.error('Failed to fetch published posts:', err);
    return res.status(500).json({
      message: 'Could not fetch published posts. Please try again.'
    })
  }
}

export const getAllPosts = async (req, res) => {
  const user = req.user;

  try {
    const allPosts = await prisma.post.findMany({
      where: {
        authorId: user.id
      }
    })

    return res.status(200).json({
      message: 'Successfully fetched all posts.',
      posts: allPosts
    })
  } catch (err) {
    console.error('Failed to get all posts:', err);
    return res.status(500).json({
      message: 'Failed to fetch all posts. Please try again.'
    })
  }
}

export const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: id
      }
    });

    if (!post) return res.status(404).json({
      message: `Failed to fetch post ${id}: Post not found.`
    })

    return res.status(200).json({
      message: `Successfully fetched post id: ${id}.`,
      post: post
    })
  } catch (err) {
    console.error('Failed to fetch post:', err);
    return res.status(500).json({
      message: 'Failed to fetch post. Please try again.'
    })
  }
}

export const deletePost = async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  try {
    const deleteResult = await prisma.post.deleteMany({ 
      // used instead of basic .delete due to its constraint
      // of only using unique identifiers in conditional check
      where: {
        id: id,
        authorId: user.id
      }
    }) 
    
    // Handle edge case where post ID doesn't exist or belong to the user
    if (deleteResult.count === 0) {
      return res.status(404).json({
        message: 'Post not found or you do not have the neccessary permissions to delete it.'
      })
    }

    return res.status(200).json({
      message: `Successfully deleted post id: ${id}`,
    })
  } catch (err) {
    console.error('Failed to delete post:', err);
    return res.status(500).json({
      message: 'Failed to delete post. Please try again.'
    })
  }
}

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const user = req.user;

  try {
    const updatedPost = await prisma.post.updateMany({
      where: { 
        id: id, 
        authorId: user.id
      },
      data: {
        title: data.title,
        summary: data.summary,
        content: data.content,
        ingredients: data.ingredients,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        imageUrl: data.imageUrl,
        // Only update published if it's explicitly provided in the request body
        published: data.published !== undefined ? Boolean(data.published) : undefined,
        updatedAt: new Date() // Ensure updatedAt is set to current time
      }
    });

    // Handle case where post not found or user doesn't own it
    if (updatedPost.count === 0) {
      return res.status(404).json({
        message: 'Post not found or you do not have the neccessary permissions to edit it.'
      });
    }

    return res.status(200).json({
      message: `Successfully updated post id: ${id}`
    });

  } catch (err) {
    console.error('Failed to update post:', err);
    return res.status(500).json({
      message: 'Failed to update post. Please try again.'
    });
  }
};