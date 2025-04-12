const { Router } = require("express");
const router = Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  editPost,
  deletePost
} = require("./post.controller");

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Usuario no autenticado' });
};

router.post('/', isAuthenticated, createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id', isAuthenticated, editPost);
router.delete('/:id', isAuthenticated, deletePost);

module.exports = router;
