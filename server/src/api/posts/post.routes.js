const { Router } = require("express");
const router = Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  editPost,
  deletePost
} = require("./post.controller");

router.post('/', createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id', editPost);
router.delete('/:id', deletePost);

module.exports = router;
