import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const signin = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);
    dispatch({ type: AUTH, data });

    window.location = "/dashboard";
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const signup = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);
    alert("Signup Successful! You will now be logged in automatically.");
    dispatch({ type: AUTH, data });

    window.location = "/dashboard";
  } catch (error) {
    alert(error.response.data.message);
  }
};