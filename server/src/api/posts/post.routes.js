const { Router } = require("express");
const router = Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  editPost,
  deletePost
} = require("./post.controller");
const { isAuthenticated } = require("../../utils/auth");

// Middleware de debugging para rutas de posts
router.use((req, res, next) => {
  console.log('Ruta de posts - Session:', req.session);
  console.log('Ruta de posts - User:', req.user);
  console.log('Ruta de posts - IsAuthenticated:', req.isAuthenticated());
  next();
});

router.post('/', isAuthenticated, createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id', isAuthenticated, editPost);
router.delete('/:id', isAuthenticated, deletePost);

module.exports = router;
