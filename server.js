const express = require('express');
const { connect } = require('http2');
const app = express();
app.use(express.json());

const Port = 5000;
const {connectDB} = require('./config/db');
connectDB();
const {User} = require('./Model/User');
const {Post} = require('./Model/Post');
const {RegisterUser , AuthenticateUser} = require('./Controller/Authentication');
const {authenticate} = require('./Midlleare/Authmiddleware');
const {FollowUser,UnFollowUser,UserProfile} = require('./Controller/Action');
const {CreatePost,LikePost,UnLikePost,AddComments,GetPost,GetAllPosts,DeletePost} = require('./Controller/post_controller')



// lets just run the api for registering the user
app.post('/api/register_user',RegisterUser)
//  api to authenticate the use and return the jwt token
app.post('/api/authenticate',AuthenticateUser);
// api to follow the user
app.post('/api/follow/:id',authenticate,FollowUser);
// api to unfollow the user
app.post('/api/unfollow/:id',authenticate,UnFollowUser);
// api to return the respective user profile
app.get('/api/user',authenticate,UserProfile);

// api to create the post
app.post('/api/posts',authenticate,CreatePost);
// api to like the post
app.post('/api/like/:id',authenticate,LikePost);
// api to unlike the post 
app.post('/api/unlike/:id',authenticate,UnLikePost);
// api to add a comment 
app.post('/api/comment/:id',authenticate,AddComments);
// api to find a post and get the likes and comment
app.get('/api/posts/:id',authenticate,GetPost);
// api to get all the posts
app.get('/api/all_posts',authenticate,GetAllPosts);
// api to delete the post
app.delete('/api/posts/:id',authenticate,DeletePost);


app.listen(5000,()=>{
    console.log(`server is listen on the port ${Port}`);
})