import AsyncStorage from "@react-native-async-storage/async-storage";
import { APIClient } from "./api_helper_native";
import * as url from "./url_helper";

const api = new APIClient();

// Gets the logged in user data from AsyncStorage
export const getLoggedInUser = async () => {
	try {
		const user = await AsyncStorage.getItem("authUser");
		if (user) return JSON.parse(user);
		return null;
	} catch (error) {
		console.error("Error getting logged in user:", error);
		return null;
	}
};

// is user authenticated
export const isUserAuthenticated = async () => {
	const user = await getLoggedInUser();
	return user !== null;
};

// Register Method
export const postFakeRegister = (data) => api.create(url.POST_FAKE_REGISTER, data);

// Login Method
export const postFakeLogin = (data) => api.create(url.POST_FAKE_LOGIN, data);
export const postLogin = (data) => api.create(url.POST_LOGIN, data);

// postForgetPwd
export const postFakeForgetPwd = (data) => api.create(url.POST_FAKE_PASSWORD_FORGET, data);
export const postForgetPwd = (data) => api.create(url.POST_PASSWORD_FORGET, data);

// Edit profile
export const postJwtProfile = (data) => api.create(url.POST_EDIT_JWT_PROFILE, data);
export const postFakeProfile = (data) => api.update(url.POST_EDIT_PROFILE + "/" + data.idx, data);

// Register Method
export const postJwtRegister = (url_path, data) => {
	return api.create(url_path, data).catch((err) => {
		var message;
		if (err.response && err.response.status) {
			switch (err.response.status) {
				case 404:
					message = "Sorry! the page you are looking for could not be found";
					break;
				case 500:
					message = "Sorry! something went wrong, please contact our support team";
					break;
				case 401:
					message = "Invalid credentials";
					break;
				default:
					message = err[1];
					break;
			}
		}
		throw message;
	});
};

// Login Method
export const postJwtLogin = (data) => api.create(url.POST_FAKE_JWT_LOGIN, data);

// postSocialLogin
export const postSocialLogin = (data) => api.create(url.SOCIAL_LOGIN, data);

//New Item
export const getAllListNewItem = (data) => api.get(url.GET_LIST_NEW_ITEM, data);
export const getBlackListCategories = () => api.get(url.GET_BLACK_LIST_CATEGORIES);
export const getBlackListSellers = () => api.get(url.GET_BLACK_LIST_SELLERS);
export const getBlackListKeywords = () => api.get(url.GET_BLACK_LIST_KEYWORDS);
export const getHotListItem = () => api.get(url.GET_HOST_LIST_ITEM);

export const getConfigCustom = async (search) =>
	api.get(process.env.REACT_APP_SOCKET_HOST + url.GET_LIST_CONFIG_CUSTOM, search, [{ name: "x-key", value: "CanTho#1" }]);
export const addConfigCustom = (data) =>
	api.create(process.env.REACT_APP_SOCKET_HOST + url.UPDATE_CONFIG_CUSTOM, data, [{ name: "x-key", value: "CanTho#1" }]);
export const updateConfigCustom = (data) =>
	api.create(process.env.REACT_APP_SOCKET_HOST + url.UPDATE_CONFIG_CUSTOM, data, [{ name: "x-key", value: "CanTho#1" }]);
export const deleteConfigCustom = (data) =>
	api.get(process.env.REACT_APP_SOCKET_HOST + url.DELETE_CONFIG_CUSTOM + "/" + data?.id, null, [{ name: "x-key", value: "CanTho#1" }]);

export const postBlackListSeller = (data) => api.create(url.GET_BLACK_LIST_SELLERS, data);
export const postBlackListCategory = (data) => api.create(url.GET_BLACK_LIST_CATEGORIES, data);
export const postBlackListKeyword = (data) => api.create(url.GET_BLACK_LIST_KEYWORDS, data);
export const postClearAllData = () => api.create(url.POST_CLEAR_ALL_DATA);
export const postHotItem = (data) => api.create(url.GET_HOST_LIST_ITEM, data);

export const getHotItemKeyWord = (data) => api.create(url.GET_HOT_ITEM_KEY_WORD, data);
export const postHotItemKeyWord = (data) => api.create(url.ADD_HOT_ITEM_KEY_WORD, data);
export const deleteHotItemKeyWord = (data) => api.create(url.DELETE_HOT_ITEM_KEY_WORD, data);
export const getListMarket = (search) => api.get(url.GET_LIST_MARKET, search);
export const postListMarket = (data) => api.create(url.POST_LIST_MARKET, data);

export const getHotItem = () => api.get(url.GET_HOT_ITEM);

// ─── Transfer proxy (used by all ERP API calls) ───────────────────────────────
// GET-style: transferGetData({ urlAPI, filter }) → POST /api/transferGetData
// POST-style: transferPostData({ urlAPI, data }) → POST /api/transferPostData
export const transferGetData = (data) => api.create(url.TRANSFER_GET_DATA, data);
export const transferPostData = (data) => api.create(url.TRANSFER_POST_DATA, data);
