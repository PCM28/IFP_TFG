import axios from "axios";
axios.defaults.headers.post["Content-Type"] = "application/json";

export const BASE_URL = "http://localhost:5000"; // url del backend

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
export const logout = async (user) => {
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
