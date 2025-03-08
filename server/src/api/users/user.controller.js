const passport = require("passport");
const User = require("./user.model");

const registerPost = (req, res) => {

  const done = (error, user) => {
    if (error) return res.status(500).json(error.message);

    req.logIn(user, (error) => {
      if (error) return res.status(error.status || 500).json(error.message);
      return res.status(201).json(user);
    });
  };

  passport.authenticate("registrito", done)(req);
};

const loginPost = (req, res) => {
  const done = (error, user) => {
    if (error) return res.status(error.status || 500).json(error.message);

    req.logIn(user, (error) => {
      if (error) return res.status(error.status || 500).json(error.message);
      return res.status(200).json(user);
    });
  };

  passport.authenticate("logincito", done)(req);
};

const logoutPost = async (req, res) => {
  if (req.user) {
    await req.logout(() => {
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        return res
          .status(200)
          .json("Hasta pronto! Te has deslogueado correctamente");
      });
    });
  } else {
    return res.status(404).json("No hay usuario autenticado");
  }
};

const checkSessionGet = async (req, res, next) => {
  if (req.user) {
    const loggedUser = await User.findById(req.user._id).populate({
      path: "posts"
    });
    loggedUser.password = null;
    return res.status(200).json(loggedUser);
  } else {
    return res.status(200).json();
  }
};

const test = (req, res) => {
  console.log("Usuario autenticado", req.user);
  return res.status(200).json(req.user);
};

// CRUD DE HABITACIONES APARTIR DE AQUÍ
// const getAllUsers = async (req, res, next) => {
//   try{
//       const allUsers = await User.find().populate('rooms');
//       return res.status(200).json(allUsers);
//   } catch(error){
//       return next(error);
//   }
// }

// const getUser = async (req,res,next) =>{
//   try{
//       const {id} = req.params;//Forma de recoger la id con destructuring
//       const user = await User.findById(id).populate('rooms');//Como la linea 7 de ciema model
//       if(user) return res.status(200).json(user);
//       else return res.status(404).json('Usuario no encontrado');
//   }catch(error){
//       return next(error);
//   }
// }

// const postUser = async(req,res,next)=>{
//   try{
//       const newUser = new User(req.body);
//       const createUser = await newUser.save();
//       return res.status(201).json(createUser);
//   }catch(error){
//       return next(error);
//   }
// }

const putUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = new User(req.body);
    user._id = id;
    const updateUser = await User.findByIdAndUpdate(id, user);
    const newUpdateUser = await User.findById(id).populate({
      path: "posts"
    });
    return res.status(201).json(newUpdateUser);
  } catch (error) {
    return next(error);
  }
};

const getUserPosts = async (req, res) => {
  try {
      const userId = req.params.id;

      // Busca al usuario por ID y recupera sus posts relacionados
      const user = await User.findById(userId).populate('posts'); 

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Devuelve los posts del usuario
      res.status(200).json({ posts: user.posts });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching user posts", error });
  }
};

// const deleteUser = async(req,res,next) => {
//   try{
//       const {id} = req.params;
//       const userDb = await User.findByIdAndDelete(id);
//       return res.status(200).json(userDb);
//   } catch(error){
//       return next(error);
//   }
// }

module.exports = {
  registerPost,
  loginPost,
  logoutPost,
  test,
  checkSessionGet,
  putUser,
  getUserPosts
};
