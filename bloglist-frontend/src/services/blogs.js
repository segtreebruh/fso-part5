import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
};

const getAll = (userId) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.get(`/api/users/${userId}`, config);
  console.log(request);
  return request.then(response => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
}

export default { getAll }