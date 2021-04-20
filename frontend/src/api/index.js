import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }

  return req;
});

//Signin/Signup related endpoints
export const signIn = (formData) => API.post("/user/signin", formData);
export const signUp = (formData) => API.post("/user/signup", formData);
export const verify = () => API.post("/user/verify");

//Secret related endpoints
export const createSecret = (formData) => API.post("/secret/create", formData);
export const getSharedByUser = () => API.post("/secret/get_shared_by_user");
export const getSharedWithUser = () => API.post("/secret/get_shared_with_user");
// export const verify = () => API.post('/user/verify');

//Recovery related endpoints
export const recoverSecret = (secretId) =>
  API.post("/recover/request/", { secretId });
export const approveRequest = (secretId, requester, shard) =>
  API.post(`/recover/approve/`, {
    secretId,
    requester,
    shard,
  });
export const rejectRequest = (secretId, requester) =>
  API.post(`/recover/reject`, { secretId, requester });
export const getRecoveryRequests = () =>
  API.post("/recover/getRecoveryRequests");
export const combineShards = (shardArray) =>
  API.post("/recover/combineShards", { shardArray });
export const deleteRequests = (secretId) =>
  API.post(`/recover/deleteRequests`, {secretId});
