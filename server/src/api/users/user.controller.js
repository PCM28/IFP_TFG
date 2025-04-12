const passport = require("passport");
const User = require("./user.model");
const bcrypt = require("bcrypt");

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
  console.log('Iniciando proceso de login');
  
  const done = async (error, user) => {
    if (error) {
      console.error('Error en autenticación:', error);
      return res.status(error.status || 500).json(error.message);
    }

    if (!user) {
      console.error('Usuario no encontrado o credenciales inválidas');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    try {
      console.log('Intentando establecer sesión para usuario:', user._id);
      
      await new Promise((resolve, reject) => {
        req.logIn(user, (error) => {
          if (error) {
            console.error('Error en login:', error);
            reject(error);
          }
          console.log('Login completado exitosamente');
          resolve();
        });
      });

      // Regenerar la sesión para prevenir session fixation
      const oldSession = req.session;
      await new Promise((resolve) => {
        req.session.regenerate((err) => {
          if (err) {
            console.error('Error regenerando sesión:', err);
          }
          // Restaurar propiedades útiles de la sesión anterior
          Object.assign(req.session, oldSession);
          resolve();
        });
      });

      // Asegurarse de que la sesión se guarde antes de responder
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error('Error guardando sesión:', err);
            reject(err);
          }
          console.log('Sesión guardada correctamente');
          console.log('Usuario en sesión:', req.user);
          console.log('ID de sesión:', req.sessionID);
          resolve();
        });
      });

      // Enviar respuesta sin la contraseña
      const userResponse = { ...user };
      delete userResponse.password;
      
      console.log('Enviando respuesta al cliente');
      return res.status(200).json(userResponse);
    } catch (error) {
      console.error('Error en el proceso de login:', error);
      return res.status(500).json({ message: 'Error en el proceso de login' });
    }
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

const register = async (req, res, next) => {
    try {
        const { name, email, password, age, country } = req.body;
        
        const userInDb = await User.findOne({ email });
        if (userInDb) {
            return res.status(400).json({ message: 'Este email ya está registrado' });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashPassword,
            age,
            country,
        });

        // ... resto del código ...
    } catch (error) {
        return next(error);
    }
};

module.exports = {
  registerPost,
  loginPost,
  logoutPost,
  test,
  checkSessionGet,
  putUser,
  getUserPosts
};
