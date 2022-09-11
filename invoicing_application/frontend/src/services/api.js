import axios from "axios";

// these are our routes, we can change them based on the environment
const baseUrl = process.env.REACT_APP_API_DEFAULT_URL || "http://localhost:3001/";
const createUrl = process.env.REACT_APP_API_create_URL || "http://localhost:3001/create";
const getUrl = process.env.REACT_APP_API_GET_URL || "http://localhost:3001/get";
const deleteUrl = process.env.REACT_APP_API_DELETE_URL || "http://localhost:3001/delete";

// this is the main api for all the axios requests
// we use axios to make requests to our backend server
const api = {
  get: (endpoint) => axios.get(getUrl + endpoint),
  create: (endpoint, data) => axios.post(createUrl + endpoint, data),
  remove: (endpoint, db_id) => axios.post(deleteUrl + endpoint, db_id),
};

export default api;
