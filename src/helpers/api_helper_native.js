import axios from "axios";
import { api } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

// default
axios.defaults.baseURL = api.API_URL;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

// Get token from AsyncStorage
const getToken = async () => {
  try {
    const authUser = await AsyncStorage.getItem("authUser");
    if (authUser) {
      const parsed = JSON.parse(authUser);
      return parsed.token || null;
    }
  } catch (error) {
    console.error("Error getting token:", error);
  }
  return null;
};

// Initialize token
(async () => {
  const token = await getToken();
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
})();

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  async function (error) {
    let response = error.response;
    let message;
    
    if (!response) {
      message = "Network error. Please check your connection.";
      Alert.alert("Error", message);
      return Promise.reject(message);
    }

    switch (response.status) {
      case 500:
        message = response.data?.message || "Internal Server Error";
        break;
      case 401:
        message = response.data?.message || "Invalid credentials";
        break;
      case 404:
        message = response.data?.message || "Sorry! the data you are looking for could not be found";
        break;
      default:
        message = response.data?.message || response;
    }

    if (response.status !== 401) {
      Alert.alert("Error", message);
    }

    if (response.status === 401) {
      await AsyncStorage.setItem("sessionExpired", "true");
      setTimeout(async () => {
        // Navigation will be handled by auth listener
        return Promise.reject(message);
      }, 1000);
    } else {
      return response.data ? response.data : response;
    }
  }
);

/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  get = (url, params, headers) => {
    let response;
    if (headers && headers?.length > 0)
      headers?.forEach((value) => {
        axios.defaults.headers.get[value?.name] = value?.value;
      });
    let paramKeys = [];
    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + "=" + encodeURIComponent(Array.isArray(params[key]) ? JSON.stringify(params[key]) : params[key]));
        return paramKeys;
      });
      const queryString = paramKeys && paramKeys.length ? paramKeys.join("&") : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return response;
  };

  create = (url, data, headers) => {
    if (headers && headers?.length > 0)
      headers?.forEach((value) => {
        axios.defaults.headers.post[value?.name] = value?.value;
      });
    return axios.post(url, data);
  };

  update = (url, data) => {
    return axios.patch(url, data);
  };

  put = (url, data) => {
    return axios.put(url, data);
  };

  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };
}

const getLoggedinUser = async () => {
  try {
    const user = await AsyncStorage.getItem("authUser");
    if (!user) {
      return null;
    } else {
      return JSON.parse(user);
    }
  } catch (error) {
    console.error("Error getting logged in user:", error);
    return null;
  }
};

export { APIClient, setAuthorization, getLoggedinUser };

