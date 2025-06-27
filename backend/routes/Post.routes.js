const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.js");
const {isAuthenticated} = require("../middlewares/isAuthenticated.js");
const {
  createPost,
  deletePost,
  likePost,
  addComment,
  addReply,
  deleteComment,
  voteOnPoll,
  sharePost,
  getPost,
  getPosts
} = require("../controllers/Post.controller.js");

router.post("/", isAuthenticated, upload.single("image"), createPost);
router.delete("/:id", isAuthenticated, deletePost);
router.post("/:id/like", isAuthenticated, likePost);
router.post("/:id/comment", isAuthenticated, addComment);
router.post("/comment/:commentId/reply", isAuthenticated, addReply);
router.delete("/comment/:commentId", isAuthenticated, deleteComment);
router.post("/:id/vote", isAuthenticated, voteOnPoll);
router.post("/:id/share", isAuthenticated, sharePost);

router.get("/:id", getPost);
router.get("/", getPosts);

module.exports = router;