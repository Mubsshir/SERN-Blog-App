const Feed = require("../model/feed");

exports.getFeeds = async (req, res) => {
  try {
    const result = await Feed.getPosts();
    if (result.length > 0) {
      return res.status(200).json(result);
    }
    return res.status(404).json({ message: "No post found" });
  } catch (err) {
    console.log("Something went wrong\n" + err);
    res.json({ message: "Error while Fetching posts: " + err });
  }
};

exports.postFeed = async (req, res) => {
  try {
    const { content, image } = req.body;
    const uid = req.userInfo.uid;
    const feed = new Feed(uid, content, image);
    const result = await feed.save();
    if (result) {
      return res.status(200).json({ message: "Post saved" });
    } else {
      return res.json({ message: "Opps something went wrong..." });
    }
  } catch (err) {
    return res.json({ message: err });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const uid = req.userInfo.uid;
    console.log(req.ip);  
    const result = await Feed.getPostsByUserID(uid);
    if (result.length > 0) {
      return res.status(200).json({status:1,records:result});
    }
    return res.status(200).json({status:0, message: "No post found" });
  } catch (err) {
    console.log("Something went wrong\n" + err);
    res.json({ message: "Error while Fetching post: " + err });
  }
};

exports.deleteFeed = async (req, res) => {
  try {
    const uid = req.userInfo.uid;
    const pid = req.body.pid;
    const result = await Feed.deletePost(uid, pid);
    console.log("Deleting Post: ",pid);
    console.log(result)
    if (result > 0) {
      console.log("Post Deleted")
      return res.status(200).json({ message: "Post deleted" });
    }
    return res.json({ message: "Post not found" });
  } catch (err) {
    console.log("Somthing went wrong\n" + err);
    res.json({ message: "Error while Deleting post: " + err });
  }
};

exports.postLike = async (req, res) => {
  try {
    const uid = req.userInfo.uid;
    const pid = req.body.postID;
    const result = await Feed.likePost(uid, pid);
    if (result > 0) {
      return res.status(200).json({ message: "Post Liked" });
    }
    return res.json({ message: "You already liked the post" });
  } catch (err) {
    console.log("Somthing went wrong\n" + err);
    res.json({ message: "Error while Liking the post: " + err });
  }
};


exports.postDislike = async (req, res) => {
  try {
    const uid = req.userInfo.uid;
    const pid = req.body.postID;
    const result = await Feed.dislikePost(uid, pid);
    if (result.status===1) {
      return res.status(200).json({ message: "Post disliked" });
    }
  } catch (err) {
    console.log("Somthing went wrong while disliking the post: \n" + err);
    res.json({ message: "Error while disliking the post: " + err });
  }
};



exports.fetchLikesInPost=async(req,res)=>{
  try{
    const pid=req.body.postID;
    console.log("Post ID: ",pid)
    const result=await Feed.fetchLikesInPost(pid);
    console.log(result)
    if(result.length>0){
      return res.status(200).json({status:1,likes:result})
    }
    return res.status(200).json({status:-1,likes:result})
  }catch(error){
    console.log("Error while fetching post likes : ",error);
    return res.status(500).json({status:0,message:error})
  }
}