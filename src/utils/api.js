// utils/api.js

const API_URL = 'http://localhost:3000'; // Your API URL

// Utility function to handle HTTP requests with flexible method
const httpRequest = async (url, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Ensure cookies are included with the request
  };

  if (body) {
    options.body = JSON.stringify(body);  // Only include body if provided
  }

  try {
    const response = await fetch(`${API_URL}${url}`, options);

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    return data;
  } catch (error) {
    console.error(`Error with ${method} request to ${url}:`, error);
    throw error;
  }
};

// POST request - login, signup, etc.
export const postRequest = (url, body) => {
    console.log(`Sending POST request to: ${API_URL}${url}`); // Log the full URL
    return httpRequest(url, 'POST', body);
  };  

// GET request - to fetch data
export const getRequest = (url) => {
  return httpRequest(url, 'GET');
};

// PUT request - to update data
export const putRequest = (url, body) => {
  return httpRequest(url, 'PUT', body);
};

// DELETE request - to delete data
export const deleteRequest = (url) => {
  return httpRequest(url, 'DELETE');
};

// Example of how you can use it
export const login = async ({ email, password }) => {
  return postRequest('/login', { email, password });
};

export const signUp = async ({ email, password }) => {
  return postRequest('/signup', { email, password });
};

export const getUserInfo = async () => {
  return getRequest('/user');
};

export const logout = async () => {
  return postRequest('/logout', {});
};

export const updateUser = async (userData) => {
  return putRequest('/user', userData);
};

export const deleteUser = async () => {
  return deleteRequest('/user');
};

export const fetchAlbums = async () => {
    return getRequest('/albums');
    }
