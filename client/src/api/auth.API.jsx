import axios from "axios";

// Configuración global de axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const BASE_URL = import.meta.env.VITE_API_URL; // url del backend en Render

// Interceptor para manejar las cookies
axios.interceptors.request.use(function (config) {
  // Asegurarse de que withCredentials está habilitado en todas las peticiones
  config.withCredentials = true;
  return config;
}, function (error) {
  return Promise.reject(error);
});

//trata de registrar el usuario en nuestra API y devuelve la respuesta de la API
export const register = async (user) => {
  try {
    const res = await axios.post(`${BASE_URL}/users/register`, user, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

//trata de loguear el usuario en nuestra API y devuelve la respuesta de la API
export const login = async (user) => {
  try {
    const res = await axios.post(`${BASE_URL}/users/login`, user, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

export const product = async (device) => {
  try {
    const res = await axios.post(`${BASE_URL}/devices`, device, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};

//lanza a la API la petición para desloguear el usuario
export const logout = async () => {
  try {
    await axios.post(`${BASE_URL}/users/logout`, {}, { withCredentials: true });
    return null;
  } catch (error) {
    return error.response.data;
  }
};

//CheckSession consulta a la API si hay un usuario ya logueado y si está la API nos devuelve ese usuario
export const checkSession = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/users/check-session`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.log("error", error);
  }
};
