const {User} = require('../Model/User');


// api to follow the user
const FollowUser = async(req,res) =>{

    const userId = req.user.id;
    const followId = req.params.id;
    if (userId === followId) {
      return res.status(400).send('You cannot follow yourself');
    }
    const user = await User.findByIdAndUpdate(userId, { $addToSet: { following: followId } });
    if (!user) {
      return res.status(404).send('User not found');
    }
    await User.findByIdAndUpdate(followId, { $addToSet: { followers: userId } });
    res.send('User followed successfully');
}
const UnFollowUser = async(req,res) => {

  try {
    const userId = req.user.id;
    const unfollowUserId = req.params.id;

    // check if the user is trying to unfollow themselves
    if (userId === unfollowUserId) {
      return res.status(400).json({ message: 'Cannot unfollow yourself' });
    }

    // find the user who wants to unfollow
    const user = await User.findById(userId);

    // check if the user is already following the unfollow user
    if (!user.following.includes(unfollowUserId)) {
      return res.status(400).json({ message: 'You are not following this user' });
    }

    // remove the unfollow user from the following array of the user
    user.following.pull(unfollowUserId);
    await user.save();

    // remove the authenticated user from the followers array of the unfollow user
    const unfollowUser = await User.findById(unfollowUserId);
    unfollowUser.followers.pull(userId);
    await unfollowUser.save();

    // return success message
    return res.json({ message: 'Unfollowed successfully' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// api to return the profile of respective user
const UserProfile = async (req,res) => {
  try {
    const userId = req.user.id;

    // find the current logged in user
    const user = await User.findById(userId);
    const profile = {
      name: user.name,
      followers: user.followers.length,
      followings: user.following.length
    };

    // return the user profile
    return res.json(profile);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {FollowUser,UnFollowUser,UserProfile};

