import axios from "axios";
import { checkSession, login, logout, register } from "../../api"; //Aquí está simplificado, si hace falta un cambio, indicarlo a su origen
import { BASE_URL } from "../../api/auth.API";

export const LOGIN_USER_START = "LOGIN_USER_START";
export const LOGIN_USER_OK = "LOGIN_USER_OK";
export const LOGIN_USER_ERROR = "LOGIN_USER_ERROR";

export const REGISTER_USER_START = "REGISTER_USER_START";
export const REGISTER_USER_OK = "REGISTER_USER_OK";
export const REGISTER_USER_ERROR = "REGISTER_USER_ERROR";

export const CHECK_SESSION_START = "CHECK_SESSION_START";
export const CHECK_SESSION_OK = "CHECK_SESSION_OK";
export const CHECK_SESSION_ERROR = "CHECK_SESSION_ERROR";

export const LOGOUT_START = "LOGOUT_START";
export const LOGOUT_OK = "LOGOUT_OK";
export const LOGOUT_ERROR = "LOGOUT_ERROR";

export const UPDATE_START = "UPDATE_START";
export const UPDATE_OK = "UPDATE_OK";
export const UPDATE_ERROR = "UPDATE_ERROR";

export const DELETE_ROOM = "DELETE_ROOM";

export const loginUser = (user, navigate) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_USER_START });
    const response = await login(user);

    if (response && response._id) {
      // Hay usuario
      dispatch({ type: LOGIN_USER_OK, payload: response });
      navigate("/start");
    } else {
      // No hay usuario
      dispatch({ type: LOGIN_USER_ERROR, payload: response });
    }
  } catch (error) {
    // Ha ocurrido algún problema haciendo el fetch o ejecutando javascript
    dispatch({ type: LOGIN_USER_ERROR, payload: error.message });
  }
};

export const registerUser = (user, navigate) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_START });
    const response = await register(user);

    if (response && response._id) {
      // Se ha registrado el usuario
      dispatch({ type: REGISTER_USER_OK, payload: response });
      navigate("/auth/login");
    } else {
      // No se ha registrado correctamente
      dispatch({ type: REGISTER_USER_ERROR, payload: response.message || "Registro fallido" });
    }
  } catch (error) {
    // Ha ocurrido algún problema haciendo el fetch o ejecutando javascript
    dispatch({ type: REGISTER_USER_ERROR, payload: error.message });
  }
};

export const checkUser = (navigate) => async (dispatch) => {
  try {
    dispatch({ type: CHECK_SESSION_START });
    const user = await checkSession();
    if (user) dispatch({ type: CHECK_SESSION_OK, payload: user });
    if (!user) {
      dispatch({ type: CHECK_SESSION_ERROR });
      navigate("login");
    }
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    dispatch({ type: CHECK_SESSION_ERROR });
  }
};

export const logoutUser = (navigate) => async (dispatch) => {
  try {
    dispatch({ type: LOGOUT_START });
    const error = await logout();
    if (error) {
      dispatch({ type: LOGOUT_ERROR, payload: error });
    } else {
      dispatch({ type: LOGOUT_OK });
      navigate("/login");
    }
  } catch (error) {
    dispatch({ type: LOGOUT_OK, payload: error });
  }
};

export const updateUser = (id, data) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_START });
    console.log(data);
    const response = await axios.put(`${BASE_URL}/users/${id}`, data);
    console.log(response);
    dispatch({ type: UPDATE_OK, payload: response.data });
  } catch (error) {
    dispatch({ type: UPDATE_ERROR, payload: error });
  }
};

export const deleteRoom = (id) => async (dispatch) => {
  dispatch({
    type: DELETE_ROOM,
    payload: id,
  });
};
