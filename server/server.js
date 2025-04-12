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
const PORT = process.env.PORT || 5000;

const app = express();

// Configuración de CORS antes de cualquier middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://ifp-final-project.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Origin', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
}));

// Middleware para establecer headers adicionales de CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie');
  next();
});

// Configuración de express-session
app.use(session({
  secret: process.env.SESSION_SECRET || 'ASD12sasdjkq!woiej213_SAd!asdljiasjd',
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({ 
    mongoUrl: db.DB_URL,
    ttl: 24 * 60 * 60 // 1 día de duración de la sesión
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true en producción
    httpOnly: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000, // 1 día
  }
}));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware de debugging
app.use((req, res, next) => {
  console.log('Session:', req.session);
  console.log('User:', req.user);
  console.log('IsAuthenticated:', req.isAuthenticated());
  next();
});

// Rutas de la API
app.use('/', mainRoutes); // Rutas principales
app.use('/users', userRoutes); // Rutas de usuarios
app.use('/api/posts', postRoutes); // Monta las rutas de posts en /api/posts

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});
