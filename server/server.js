const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
require('./src/utils/auth/index');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mainRoutes = require('./src/api/main/main.routes');
const userRoutes = require('./src/api/users/user.routes');
const postRoutes = require('./src/api/posts/post.routes'); // Importa las rutas de posts

const db = require('./src/utils/database/db');
dotenv.config();
db.connect();

// const PORT = 4500;
const PORT = 5000;

const app = express();

// Mueve el middleware CORS antes de las configuraciones de body parsing
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Asegúrate de que las cabeceras CORS estén configuradas adecuadamente
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json({ limit: '50mb' })); // Aumenta el límite máximo de tamaño del cuerpo JSON
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Aumenta el límite para solicitudes URL codificadas


app.use(session({
  secret: 'ASD12sasdjkq!woiej213_SAd!asdljiasjd',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 120 * 60 * 1000,
  },
  store: MongoStore.create({ mongoUrl: db.DB_URL })
}));

app.use(passport.initialize());
app.use(passport.session());

// Rutas de la API
app.use('/', mainRoutes); // Rutas principales
app.use('/users', userRoutes); // Rutas de usuarios
app.use('/api/posts', postRoutes); // Monta las rutas de posts en /api/posts

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});
