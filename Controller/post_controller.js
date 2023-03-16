const {Post} = require('../Model/Post');

const CreatePost = async (req,res) =>{
    
    try {
        const userId = req.user.id;
        const { title, description } = req.body;
    
        // create a new post with the provided title and description
        const post = new Post({
          title,
          description,
          user: userId
        });
    
        // save the post to the database
        await post.save();
    
        // return the post ID, title, description, and creation time
        return res.json({
          id: post._id,
          title: post.title,
          description: post.description,
          created_at: post.createdAt.toISOString()
        });
    
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
}

const LikePost = async (req,res) =>{

    const postId = req.params.id;
    const userId = req.user._id;
   
  
    try {
      const post = await Post.findOne({ _id: postId });
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      if (post.likes.includes(userId)) {
        return res.status(400).json({ message: 'You have already liked this post' });
      }
  
      post.likes.push(userId);
      await post.save();
  
      return res.status(200).json(post);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }

}
const UnLikePost = async (req,res) => {
    try {
        
        // Get post by ID
        const postId = req.params.id;
        const userId = req.user._id;
        const post = await Post.findById(postId);
    
        //  check post exist or not
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }
    
        // Check if user has already liked the post
        if (!post.likes.includes(userId)) {
          return res.status(400).json({ message: 'User has not liked this post' });
        }
        await post.likes.pull(userId)
        await post.save();
    
        return res.status(200).json({ message: 'Post unliked' });
      } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'NOT AUTHORIZED, TOKEN FAILED' });
      }
}

const AddComments = async(req,res) =>{

  try {
    
    const userId = req.user.id;
    const postId = req.params.id;
    
    const post = await Post.findById(postId);

    // Check if post exists
    if (!post) {
      return res.status(404).json({ message: 'Post not found' }); ``
    }

    // Create new comment
    const comment =  {
      text: req.body.comment,
      author: userId
    };
    
    // Add comment to post
    post.comments.push(comment);
    await post.save();
    const newCommentId = await post.comments[post.comments.length - 1]._id;
    return res.status(200).json({ commentId: newCommentId });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'NOT AUTHORIZED, TOKEN FAILED' });
  }

}

const GetPost = async (req,res) =>{

  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate('user', 'name').exec();
    const likesCount = post.likes.length;
    const commentsCount = post.comments.length;
    res.json({
      id: post._id,
      title: post.title,
      description: post.description,
      created_at: post.createdAt,
      likes: likesCount,
      comments: commentsCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

const GetAllPosts = async (req,res) =>{

  try {
    
    const posts = await Post.find({ user: req.user.id }).sort({ createdAt: 'desc' });
     
    const all_posts = [];
    // loop through each post and extract desired fields
    posts.forEach(post => {
      const data = {
        id: post._id,
        title: post.title,
        desc: post.description,
        created_at: post.createdAt,
        comments: post.comments,
        likes: post.likes.length
      };
      // add formatted post to array
      all_posts.push(data);
    });
    // return formatted posts data
    res.json(all_posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

}

// controller function to delete the particular post
 const DeletePost = async(req,res) =>{

  const { id } = req.params;
  const userId = req.user.id;

  try {
    const deletedPost = await Post.findByIdAndDelete(id);
  if (!deletedPost) {
    return res.status(404).json({ error: 'Post not found' });
  }
  return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }

 }

module.exports = {CreatePost,LikePost,UnLikePost,AddComments,GetPost,GetAllPosts,DeletePost};