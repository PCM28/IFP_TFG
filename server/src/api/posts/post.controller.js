const Post = require("./post.model");
const User = require("../users/user.model");


// Crear un nuevo post
const createPost = async (req, res) => {
  try {
    const { title, description, image } = req.body;
    const userId = req.user._id; // Obtenemos el ID del usuario de la sesión

    if (!title || !description) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    const newPost = new Post({
      title,
      description,
      user: userId,
      image
    });

    const savedPost = await newPost.save();

    // Actualizar los posts del usuario
    await User.findByIdAndUpdate(userId, {
      $push: { posts: savedPost._id }
    });

    // Poblar la información del usuario antes de enviar la respuesta
    const populatedPost = await Post.findById(savedPost._id).populate('user', 'name email');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creando el post' });
  }
};

// Obtener todos los posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({
        path: 'user',
        select: 'name email' // Solo traemos los campos necesarios
      })
      .sort({ createdAt: -1 }); // Ordenar por fecha de creación descendente
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo los posts' });
  }
};

// Obtener un post por ID
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo el post' });
  }
};

// Editar un post por ID
const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, description, image },
      { new: true } // Devuelve el post actualizado
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error actualizando el post' });
  }
};

// Borrar un post por ID
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Opcional: Eliminar el post del array de posts del usuario
    await User.updateOne(
      { posts: id },
      { $pull: { posts: id } }
    );

    res.status(200).json({ message: 'Post eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error eliminando el post' });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  editPost,
  deletePost,
};
