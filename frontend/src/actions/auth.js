import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index.js';
import {toast} from 'react-toastify'

export const signin = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);
    dispatch({ type: AUTH, data });

    window.location = "/dashboard";
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const signup = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);
    toast.success("Signup Successful! You will now be logged in automatically.");
    dispatch({ type: AUTH, data });

    window.location = "/dashboard";
  } catch (error) {
    toast.error(error.response.data.message);
  }
};