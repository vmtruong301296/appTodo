import {
	SHOW_EXCLUDE_MODAL,
	GET_ITEM_DATA,
	GET_KEY_WORD_LIST,
	RESET_INIT_BL_CATEGORIES_DATA,
	RESET_INIT_BL_SELLERS_DATA,
	RESET_INIT_BL_KEYWORDS_DATA,
	RESET_INIT_HL_ITEM_DATA,
	API_GET_NEW_ITEM_LIST,
	API_GET_BLACK_LIST_CATEGORIES,
	API_GET_BLACK_LIST_SELLERS,
	API_GET_BLACK_LIST_KEYWORDS,
	API_POST_BLACK_LIST_CATEGORY,
	API_POST_BLACK_LIST_SELLER,
	API_POST_BLACK_LIST_KEYWORD,
	API_GET_HOT_LIST_ITEM,
	API_POST_CLEAR_ALL_DATA,
	API_POST_HOT_ITEM,
	ADD_HOT_ITEM_SUCCESS,
	ADD_HOT_ITEM_FAIL,
	API_DELETE_HOT_ITEM,
	DELETE_HOT_ITEM_SUCCESS,
	DELETE_HOT_ITEM_FAIL,
	API_DELETE_BLACK_LIST_CATEGORY,
	API_DELETE_BLACK_LIST_SELLER,
	API_DELETE_BLACK_LIST_KEYWORD,
	API_RESPONSE_SUCCESS,
	API_RESPONSE_ERROR,
	API_REFRESH_LOADING,
	API_GET_HOT_ITEM_KEYWORD,
	API_ADD_HOT_ITEM_KEYWORD,
	ADD_HOT_ITEM_KEYWORD_SUCCESS,
	ADD_HOT_ITEM_KEYWORD_FAIL,
	API_DELETE_HOT_ITEM_KEYWORD,
	DELETE_HOT_ITEM_KEYWORD_SUCCESS,
	DELETE_HOT_ITEM_KEYWORD_FAIL,
	API_GET_HOT_ITEM,
	API_GET_LIST_MARKET,
	API_UPDATE_LIST_MARKET,
	UPDATE_LIST_MARKET_SUCCESS,
	UPDATE_LIST_MARKET_FAIL,
	API_DELETE_LIST_MARKET,
	DELETE_LIST_MARKET_SUCCESS,
	DELETE_LIST_MARKET_FAIL,
	NEW_ITEMS_API_GET_LIST_NEW_ITEMS,
	NEW_ITEMS_API_GET_LIST_CUSTOM_CONFIG,
	NEW_ITEMS_API_SAVE_CONFIG_CUSTOM_FAIL,
	NEW_ITEMS_API_SAVE_CONFIG_CUSTOM_SUCCESS,
	NEW_ITEMS_API_SAVE_CONFIG_CUSTOM,
	NEW_ITEMS_API_DELETE_CONFIG_CUSTOM,
	NEW_ITEMS_API_DELETE_CONFIG_CUSTOM_SUCCESS,
	NEW_ITEMS_API_DELETE_CONFIG_CUSTOM_FAIL,
} from "./actionType";

export const toggleExcludeModal = (data) => ({
	type: SHOW_EXCLUDE_MODAL,
	payload: { data },
});

export const getItemData = (data) => ({
	type: GET_ITEM_DATA,
	payload: { data },
});

// common success
export const dashboardNewItemsApiSuccess = (actionType, data) => ({
	type: API_RESPONSE_SUCCESS,
	payload: { actionType, data },
});

// common error
export const dashboardNewItemsApiError = (actionType, error) => ({
	type: API_RESPONSE_ERROR,
	payload: { actionType, error },
});

export const getKeyWordList = () => ({
	type: GET_KEY_WORD_LIST,
});

export const resetInitBlCategoriesData = () => ({
	type: RESET_INIT_BL_CATEGORIES_DATA,
});

export const resetInitBlSellersData = () => ({
	type: RESET_INIT_BL_SELLERS_DATA,
});

export const resetInitBlKeywordsData = () => ({
	type: RESET_INIT_BL_KEYWORDS_DATA,
});

export const resetInitHlItem = () => ({
	type: RESET_INIT_HL_ITEM_DATA,
});

export const getListItemtData = (filter = "") => ({
	type: API_GET_NEW_ITEM_LIST,
	payload: { filter },
});

export const getBlackListCategories = () => ({
	type: API_GET_BLACK_LIST_CATEGORIES,
});

export const getBlackListSeller = () => ({
	type: API_GET_BLACK_LIST_SELLERS,
});

export const getBlackListKeywords = () => ({
	type: API_GET_BLACK_LIST_KEYWORDS,
});

export const getHotListItem = () => ({
	type: API_GET_HOT_LIST_ITEM,
});

//Post action
export const postBlackListCategory = (data) => ({
	type: API_POST_BLACK_LIST_CATEGORY,
	payload: data,
});

export const postBlackListSeller = (data) => ({
	type: API_POST_BLACK_LIST_SELLER,
	payload: { data },
});

export const postBlackListKeyword = (data = [], title = "") => ({
	type: API_POST_BLACK_LIST_KEYWORD,
	payload: { data, title },
});

export const postClearAllData = () => ({
	type: API_POST_CLEAR_ALL_DATA,
});

//ADD HOT ITEM keyword
export const postHotItem = (data) => ({
	type: API_POST_HOT_ITEM,
	payload: data,
});

export const postHotItemSuccess = (data) => ({
	type: ADD_HOT_ITEM_SUCCESS,
	payload: data,
});

export const postHotItemFail = (error) => ({
	type: ADD_HOT_ITEM_FAIL,
	payload: error,
});

//DELETE HOT ITEM keyword
export const deleteHotItem = (data) => ({
	type: API_DELETE_HOT_ITEM,
	payload: data,
});

export const deleteHotItemSuccess = (data) => ({
	type: DELETE_HOT_ITEM_SUCCESS,
	payload: data,
});

export const deleteHotItemFail = (error) => ({
	type: DELETE_HOT_ITEM_FAIL,
	payload: error,
});

//Delete action
export const deleteBlackListCategory = (data) => ({
	type: API_DELETE_BLACK_LIST_CATEGORY,
	payload: data,
});
export const deleteBlackListSeller = (data) => ({
	type: API_DELETE_BLACK_LIST_SELLER,
	payload: data,
});
export const deleteBlackListKeyword = (data) => ({
	type: API_DELETE_BLACK_LIST_KEYWORD,
	payload: data,
});

// Hot items keyword
export const getHotItemKeyWord = (data) => ({
	type: API_GET_HOT_ITEM_KEYWORD,
	payload: data,
});

export const addHotItemKeyWord = (data) => ({
	type: API_ADD_HOT_ITEM_KEYWORD,
	payload: data,
});

export const addHotItemKeyWordSuccess = (data) => ({
	type: ADD_HOT_ITEM_KEYWORD_SUCCESS,
	payload: data,
});

export const addHotItemKeyWordFail = (error) => ({
	type: ADD_HOT_ITEM_KEYWORD_FAIL,
	payload: error,
});

export const deleteHotItemKeyWord = (data) => ({
	type: API_DELETE_HOT_ITEM_KEYWORD,
	payload: data,
});

export const deleteHotItemKeyWordSuccess = (data) => ({
	type: DELETE_HOT_ITEM_KEYWORD_SUCCESS,
	payload: data,
});

export const deleteHotItemKeyWordFail = (error) => ({
	type: DELETE_HOT_ITEM_KEYWORD_FAIL,
	payload: error,
});

export const getListHotItem = () => ({
	type: API_GET_HOT_ITEM,
});

export const getListMarket = (search) => ({
	type: API_GET_LIST_MARKET,
	payload: search,
});

export const updateListMarket = (data) => ({
	type: API_UPDATE_LIST_MARKET,
	payload: data,
});

export const updateListMarketSuccess = (data) => ({
	type: UPDATE_LIST_MARKET_SUCCESS,
	payload: data,
});

export const updateListMarketFail = (error) => ({
	type: UPDATE_LIST_MARKET_FAIL,
	payload: error,
});

export const deleteListMarket = (data) => ({
	type: API_DELETE_LIST_MARKET,
	payload: data,
});

export const deleteListMarketSuccess = (data) => ({
	type: DELETE_LIST_MARKET_SUCCESS,
	payload: data,
});

export const deleteListMarketFail = (error) => ({
	type: DELETE_LIST_MARKET_FAIL,
	payload: error,
});

export const newItemsGetListConfigCustom = () => ({
	type: NEW_ITEMS_API_GET_LIST_CUSTOM_CONFIG,
});

export const newItemsSaveConfigCustom = (data) => ({
	type: NEW_ITEMS_API_SAVE_CONFIG_CUSTOM,
	payload: data,
});

export const newItemsSaveConfigCustomSuccess = (data) => ({
	type: NEW_ITEMS_API_SAVE_CONFIG_CUSTOM_SUCCESS,
	payload: data,
});

export const newItemsSaveConfigCustomFail = (error) => ({
	type: NEW_ITEMS_API_SAVE_CONFIG_CUSTOM_FAIL,
	payload: error,
});

export const newItemsDeleteConfigCustom = (data) => ({
	type: NEW_ITEMS_API_DELETE_CONFIG_CUSTOM,
	payload: data,
});

export const newItemsDeleteConfigCustomSuccess = (data) => ({
	type: NEW_ITEMS_API_DELETE_CONFIG_CUSTOM_SUCCESS,
	payload: data,
});

export const newItemsDeleteConfigCustomFail = (error) => ({
	type: NEW_ITEMS_API_DELETE_CONFIG_CUSTOM_FAIL,
	payload: error,
});
