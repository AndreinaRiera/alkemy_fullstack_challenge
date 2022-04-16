import axios from 'axios';

export default axios.create({
  baseURL: `http://localhost:3030/`,
});

export const getHeadersRequestAPI = (userToken = false) => {

  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${(userToken || localStorage.getItem('userToken')).replace(/['"]+/g, '')}`,
    },
  };
}