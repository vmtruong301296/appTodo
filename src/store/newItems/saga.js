import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";
import { toast } from "../../helpers/toast_helper";

import {
	API_GET_NEW_ITEM_LIST,
	API_GET_BLACK_LIST_CATEGORIES,
	API_GET_BLACK_LIST_SELLERS,
	API_GET_BLACK_LIST_KEYWORDS,
	API_GET_HOT_LIST_ITEM,
	API_POST_BLACK_LIST_SELLER,
	API_POST_BLACK_LIST_KEYWORD,
	API_POST_BLACK_LIST_CATEGORY,
	API_POST_HOT_ITEM,
	API_DELETE_BLACK_LIST_CATEGORY,
	API_DELETE_BLACK_LIST_SELLER,
	API_DELETE_BLACK_LIST_KEYWORD,
	API_DELETE_HOT_ITEM,
	API_POST_CLEAR_ALL_DATA,
	API_GET_HOT_ITEM_KEYWORD,
	API_ADD_HOT_ITEM_KEYWORD,
	API_DELETE_HOT_ITEM_KEYWORD,
	API_GET_HOT_ITEM,
	API_GET_LIST_MARKET,
	API_UPDATE_LIST_MARKET,
	API_DELETE_LIST_MARKET,
	NEW_ITEMS_API_SAVE_CONFIG_CUSTOM,
	NEW_ITEMS_API_GET_LIST_CUSTOM_CONFIG,
	NEW_ITEMS_API_DELETE_CONFIG_CUSTOM,
} from "./actionType";

import {
	dashboardNewItemsApiSuccess,
	dashboardNewItemsApiError,
	postHotItemSuccess,
	postHotItemFail,
	deleteHotItemSuccess,
	deleteHotItemFail,
	addHotItemKeyWordSuccess,
	addHotItemKeyWordFail,
	deleteHotItemKeyWordSuccess,
	deleteHotItemKeyWordFail,
	updateListMarketSuccess,
	updateListMarketFail,
	deleteListMarketSuccess,
	deleteListMarketFail,
	newItemsSaveConfigCustomSuccess,
	newItemsSaveConfigCustomFail,
	newItemsDeleteConfigCustomSuccess,
	newItemsDeleteConfigCustomFail,
} from "./action";

import {
	getAllListNewItem,
	getBlackListCategories,
	getBlackListSellers,
	getBlackListKeywords,
	getHotListItem,
	postBlackListSeller,
	postBlackListCategory,
	postBlackListKeyword,
	postHotItem,
	postClearAllData,
	deleteBlackListCategory,
	deleteBlackListSeller,
	deleteBlackListKeyword,
	deleteHotItem,
	getHotItemKeyWord,
	postHotItemKeyWord,
	deleteHotItemKeyWord,
	getHotItem,
	getListMarket,
	postListMarket,
	getConfigCustom,
	updateConfigCustom,
	deleteConfigCustom,
} from "../../helpers/fakebackend_helper_native";

function* getListNewItemSaga({ payload: data }) {
	try {
		console.log('🔥 getListNewItemSaga called with filter:', data?.filter);
		var response = yield call(getAllListNewItem, data);
		if (response.Status === "ERROR" || Number(response.Status) >= 400) {
			yield put(dashboardNewItemsApiError(API_GET_NEW_ITEM_LIST, response));
		} else if (typeof response.error !== "undefined") {
			yield put(dashboardNewItemsApiError(API_GET_NEW_ITEM_LIST, response));
		} else if (!Array.isArray(response)) {
			yield put(dashboardNewItemsApiError(API_GET_NEW_ITEM_LIST, response));
		} else {
			yield put(dashboardNewItemsApiSuccess(API_GET_NEW_ITEM_LIST, response));
		}
	} catch (error) {
		yield put(dashboardNewItemsApiError(API_GET_NEW_ITEM_LIST, error));
	}
}

function* getBlackListCategoriesSaga() {
	try {
		var response = yield call(getBlackListCategories);
		yield put(dashboardNewItemsApiSuccess(API_GET_BLACK_LIST_CATEGORIES, response));
	} catch (error) {
		yield put(dashboardNewItemsApiError(API_GET_BLACK_LIST_CATEGORIES, error));
	}
}

function* getBlackListSellersSaga() {
	try {
		var response = yield call(getBlackListSellers);
		yield put(dashboardNewItemsApiSuccess(API_GET_BLACK_LIST_SELLERS, response));
	} catch (error) {
		yield put(dashboardNewItemsApiError(API_GET_BLACK_LIST_SELLERS, error));
	}
}

function* getBlackListKeywordsSaga() {
	try {
		var response = yield call(getBlackListKeywords);
		yield put(dashboardNewItemsApiSuccess(API_GET_BLACK_LIST_KEYWORDS, response));
	} catch (error) {
		yield put(dashboardNewItemsApiError(API_GET_BLACK_LIST_KEYWORDS, error));
	}
}

function* getHotListItemSaga() {
	try {
		var response = yield call(getHotListItem);
		if (!response.success) {
			yield put(dashboardNewItemsApiError(API_GET_HOT_LIST_ITEM, response));
		} else {
			yield put(dashboardNewItemsApiSuccess(API_GET_HOT_LIST_ITEM, response));
		}
	} catch (error) {
		yield put(dashboardNewItemsApiError(API_GET_HOT_LIST_ITEM, error));
	}
}

//Post
function* postBlackListCategorySaga({ payload: data }) {
	try {
		var response = yield call(postBlackListCategory, data);
		if (response.errors) {
			toast.error(response.message, { autoClose: 1000 });
		} else {
			yield put(dashboardNewItemsApiSuccess(API_POST_BLACK_LIST_CATEGORY, response));
			toast.success(response.data.message, { autoClose: 1000 });
		}
	} catch (error) {
		yield put(dashboardNewItemsApiError(API_POST_BLACK_LIST_CATEGORY, error));
	}
}
function* postBlackListSellerSaga({ payload: data }) {
	try {
		var response = yield call(postBlackListSeller, data);
		if (response.errors) {
			toast.error(response.message, { autoClose: 1000 });
		} else {
			yield put(dashboardNewItemsApiSuccess(API_POST_BLACK_LIST_SELLER, response));
			toast.success(response.data.message, { autoClose: 1000 });
		}
	} catch (error) {
		yield put(dashboardNewItemsApiError(API_POST_BLACK_LIST_SELLER, error));
	}
}

function* postBlackListKeyWordSaga({ payload: data }) {
	try {
		var response = yield call(postBlackListKeyword, data);
		yield put(dashboardNewItemsApiSuccess(API_POST_BLACK_LIST_KEYWORD, response));
		toast.success("Add seller to blacklist successfully", { autoClose: 1000 });
	} catch (error) {
		yield put(dashboardNewItemsApiError(API_POST_BLACK_LIST_KEYWORD, error));
		toast.error("Add seller to blacklist failed", { autoClose: 1000 });
	}
}

function* postClearAllDataSaga() {
	try {
		var response = yield call(postClearAllData);
		yield put(dashboardNewItemsApiSuccess(API_POST_CLEAR_ALL_DATA, response));
		toast.success("Clear all data successfully", { autoClose: 1000 });
	} catch (error) {
		yield put(dashboardNewItemsApiError(API_POST_CLEAR_ALL_DATA, error));
		toast.error("Clear all data failed", { autoClose: 1000 });
	}
}

function* postHotListSaga({ payload: data }) {
	try {
		const response = yield call(postHotItem, data);
		yield put(postHotItemSuccess(response));
		toast.success(response.data.message, { autoClose: 1000 });
	} catch (error) {
		yield put(postHotItemFail(error));
		toast.error("Hot key add Failed", { autoClose: 1000 });
	}
}

//delete
function* deleteBlackListCategorySaga({ payload: data }) {
	try {
		var response = yield call(deleteBlackListCategory, data);
		yield put(dashboardNewItemsApiSuccess(API_DELETE_BLACK_LIST_CATEGORY, response));
		toast.success("Delete category from blacklist successfully", { autoClose: 1000 });
	} catch (error) {
		yield put(dashboardNewItemsApiError(API_DELETE_BLACK_LIST_CATEGORY, error));
		toast.error("Delete category from blacklist failed", { autoClose: 1000 });
	}
}

function* deleteBlackListSellerSaga({ payload: data }) {
	try {
		var response = yield call(deleteBlackListSeller, data);
		yield put(dashboardNewItemsApiSuccess(API_DELETE_BLACK_LIST_SELLER, response));
		toast.success("Delete seller from blacklist successfully", { autoClose: 1000 });
	} catch (error) {
		yield put(dashboardNewItemsApiError(API_DELETE_BLACK_LIST_SELLER, error));
		toast.error("Delete seller from blacklist failed", { autoClose: 1000 });
	}
}

function* deleteBlackListKeywordSaga({ payload: data }) {
	try {
		var response = yield call(deleteBlackListKeyword, data);
		yield put(dashboardNewItemsApiSuccess(API_DELETE_BLACK_LIST_KEYWORD, response));
		toast.success("Delete keyword from blacklist successfully", { autoClose: 1000 });
	} catch (error) {
		yield put(dashboardNewItemsApiError(API_DELETE_BLACK_LIST_KEYWORD, error));
		toast.error("Delete keyword from blacklist failed", { autoClose: 1000 });
	}
}

function* deleteHotItemSaga({ payload: data }) {
	try {
		const response = yield call(deleteHotItem, data);
		yield put(deleteHotItemSuccess(response));
		toast.success(response.data.message, { autoClose: 1000 });
	} catch (error) {
		yield put(deleteHotItemFail(error));
		toast.error("Delete item from hot list failed", { autoClose: 1000 });
	}
}

// get list data hot item keyword
function* getHotItemKeyWordSaga({ payload: data }) {
	try {
		const response = yield call(getHotItemKeyWord, data);
		if (!response.success) {
			yield put(dashboardNewItemsApiError(API_GET_HOT_ITEM_KEYWORD, response));
		} else {
			yield put(dashboardNewItemsApiSuccess(API_GET_HOT_ITEM_KEYWORD, response));
		}
	} catch (error) {
		yield put(dashboardNewItemsApiError(API_GET_HOT_ITEM_KEYWORD, error));
	}
}
export function* watchGetHotItemKeyWordSaga() {
	yield takeEvery(API_GET_HOT_ITEM_KEYWORD, getHotItemKeyWordSaga);
}

// add hotitem keyword
function* postHotItemKeyWordSaga({ payload: data }) {
	try {
		const response = yield call(postHotItemKeyWord, data);
		yield put(addHotItemKeyWordSuccess(response));
		toast.success("Hot item keyword Added Successfully", { autoClose: 1000 });
	} catch (error) {
		yield put(addHotItemKeyWordFail(error));
		toast.error("Hot item keyword Added Failed", { autoClose: 1000 });
	}
}
export function* watchPostHotItemKeyWordSaga() {
	yield takeEvery(API_ADD_HOT_ITEM_KEYWORD, postHotItemKeyWordSaga);
}

// delete hotitem keyword
function* deleteHotItemKeyWordSaga({ payload: data }) {
	try {
		const response = yield call(deleteHotItemKeyWord, data);
		yield put(deleteHotItemKeyWordSuccess(response));
		toast.success("Hot item keyword Deleted Successfully", { autoClose: 1000 });
	} catch (error) {
		yield put(deleteHotItemKeyWordFail(error));
		toast.error("Hot item keyword Deleted Failed", { autoClose: 1000 });
	}
}
export function* watchDeleteHotItemKeyWordSaga() {
	yield takeEvery(API_DELETE_HOT_ITEM_KEYWORD, deleteHotItemKeyWordSaga);
}

// get list hot item
function* getListHotItemSaga() {
	try {
		const respone = yield call(getHotItem);
		yield put(dashboardNewItemsApiSuccess(API_GET_HOT_ITEM, respone));
	} catch (error) {
		yield put(dashboardNewItemsApiError(API_GET_HOT_ITEM, error));
	}
}
export function* watchGetListHotItemSaga() {
	yield takeEvery(API_GET_HOT_ITEM, getListHotItemSaga);
}

// get list market
function* getDataListMarketSaga({ payload: data }) {
	try {
		const respone = yield call(getListMarket, data);
		yield put(dashboardNewItemsApiSuccess(API_GET_LIST_MARKET, respone));
	} catch (error) {
		yield put(dashboardNewItemsApiError(API_GET_LIST_MARKET, error));
	}
}
export function* watchGetDataListMarketSaga() {
	yield takeEvery(API_GET_LIST_MARKET, getDataListMarketSaga);
}

// update list market
function* updateListMarketSaga({ payload: data }) {
	try {
		const respone = yield call(postListMarket, data);
		yield put(updateListMarketSuccess(respone));
		toast.success("Market Added Successfully", { autoClose: 1000 });
	} catch (error) {
		yield put(updateListMarketFail(error));
		toast.error("Market Added Failed", { autoClose: 1000 });
	}
}
export function* watchUpdateListMarketSaga() {
	yield takeEvery(API_UPDATE_LIST_MARKET, updateListMarketSaga);
}

// delete list market
function* deleteListMarketSaga({ payload: data }) {
	try {
		const respone = yield call(postListMarket, data);
		yield put(deleteListMarketSuccess(respone));
		toast.success("Market Deleted Successfully", { autoClose: 1000 });
	} catch (error) {
		yield put(deleteListMarketFail(error));
		toast.error("Market Deleted Failed", { autoClose: 1000 });
	}
}
export function* watchDeleteListMarketSaga() {
	yield takeEvery(API_DELETE_LIST_MARKET, deleteListMarketSaga);
}

//Watcher
export function* watchGetListNewItemSaga() {
	yield takeEvery(API_GET_NEW_ITEM_LIST, getListNewItemSaga);
}

export function* watchGetBlackListCategoriesSaga() {
	yield takeEvery(API_GET_BLACK_LIST_CATEGORIES, getBlackListCategoriesSaga);
}

export function* watchGetBlackListSellersSaga() {
	yield takeEvery(API_GET_BLACK_LIST_SELLERS, getBlackListSellersSaga);
}

export function* watchGetBlackListKeywordsSaga() {
	yield takeEvery(API_GET_BLACK_LIST_KEYWORDS, getBlackListKeywordsSaga);
}

export function* watchGetHotListItemSaga() {
	yield takeEvery(API_GET_HOT_LIST_ITEM, getHotListItemSaga);
}

export function* watchPostBlackListSellerSaga() {
	yield takeEvery(API_POST_BLACK_LIST_SELLER, postBlackListSellerSaga);
}

export function* watchPostBlackListCategorySaga() {
	yield takeEvery(API_POST_BLACK_LIST_CATEGORY, postBlackListCategorySaga);
}

export function* watchPostBlackListKeyWordSaga() {
	yield takeEvery(API_POST_BLACK_LIST_KEYWORD, postBlackListKeyWordSaga);
}

export function* watchPostClearAllDataSaga() {
	yield takeEvery(API_POST_CLEAR_ALL_DATA, postClearAllDataSaga);
}

export function* watchPostHotListSaga() {
	yield takeEvery(API_POST_HOT_ITEM, postHotListSaga);
}

export function* watchDeleteBlackListCategorySaga() {
	yield takeEvery(API_DELETE_BLACK_LIST_CATEGORY, deleteBlackListCategorySaga);
}

export function* watchDeleteBlackListSeller() {
	yield takeEvery(API_DELETE_BLACK_LIST_SELLER, deleteBlackListSellerSaga);
}

export function* watchDeleteBlackListKeywordSaga() {
	yield takeEvery(API_DELETE_BLACK_LIST_KEYWORD, deleteBlackListKeywordSaga);
}

export function* watchDeleteHotItemSaga() {
	yield takeEvery(API_DELETE_HOT_ITEM, deleteHotItemSaga);
}

function* newItemsGetListConfigCustom({ payload: data }) {
	try {
		var response = yield call(getConfigCustom, data);
		if (response.Status === "ERROR" || Number(response.Status) >= 400) {
			yield put(dashboardNewItemsApiError(NEW_ITEMS_API_GET_LIST_CUSTOM_CONFIG, response));
		} else if (typeof response.error !== "undefined") {
			yield put(dashboardNewItemsApiError(NEW_ITEMS_API_GET_LIST_CUSTOM_CONFIG, response));
		} else if (!Array.isArray(response)) {
			yield put(dashboardNewItemsApiError(NEW_ITEMS_API_GET_LIST_CUSTOM_CONFIG, response));
		} else {
			yield put(dashboardNewItemsApiSuccess(NEW_ITEMS_API_GET_LIST_CUSTOM_CONFIG, response));
		}
	} catch (error) {
		yield put(dashboardNewItemsApiError(NEW_ITEMS_API_GET_LIST_CUSTOM_CONFIG, error));
	}
}

export function* watchNewItemsGetListConfigCustom() {
	yield takeEvery(NEW_ITEMS_API_GET_LIST_CUSTOM_CONFIG, newItemsGetListConfigCustom);
}

// update
function* newItemsSaveConfigCustom({ payload: data }) {
	try {
		const respone = yield call(updateConfigCustom, data);
		yield put(newItemsSaveConfigCustomSuccess(respone));
		if (data?.id) toast.success("Config Update Successfully", { autoClose: 1000 });
		else toast.success("Config Add Successfully", { autoClose: 1000 });
	} catch (error) {
		yield put(newItemsSaveConfigCustomFail(error));
		if (data?.id) toast.success("Config Update Failed", { autoClose: 1000 });
		else toast.success("Config Add Failed", { autoClose: 1000 });
	}
}
export function* watchNewItemsSaveConfigCustom() {
	yield takeEvery(NEW_ITEMS_API_SAVE_CONFIG_CUSTOM, newItemsSaveConfigCustom);
}

// update
function* newItemsDeleteConfigCustom({ payload: data }) {
	try {
		const respone = yield call(deleteConfigCustom, data);
		yield put(newItemsDeleteConfigCustomSuccess(respone));
		toast.success("Delete Config Successfully", { autoClose: 1000 });
	} catch (error) {
		yield put(newItemsDeleteConfigCustomFail(error));
		toast.error("Delete Config Failed", { autoClose: 3000 });
	}
}
export function* watchNewItemsDeleteConfigCustom() {
	yield takeEvery(NEW_ITEMS_API_DELETE_CONFIG_CUSTOM, newItemsDeleteConfigCustom);
}

function* dashboardNewItemsSaga() {
	yield all([
		fork(watchGetListNewItemSaga),
		fork(watchGetBlackListCategoriesSaga),
		fork(watchGetBlackListSellersSaga),
		fork(watchGetBlackListKeywordsSaga),
		fork(watchPostBlackListCategorySaga),
		fork(watchPostBlackListSellerSaga),
		fork(watchPostBlackListKeyWordSaga),
		fork(watchDeleteBlackListCategorySaga),
		fork(watchDeleteBlackListSeller),
		fork(watchPostClearAllDataSaga),
		fork(watchDeleteBlackListKeywordSaga),
		fork(watchPostHotListSaga),
		fork(watchGetHotListItemSaga),
		fork(watchDeleteHotItemSaga),
		fork(watchGetHotItemKeyWordSaga),
		fork(watchDeleteHotItemKeyWordSaga),
		fork(watchPostHotItemKeyWordSaga),
		fork(watchGetListHotItemSaga),
		fork(watchGetDataListMarketSaga),
		fork(watchUpdateListMarketSaga),
		fork(watchDeleteListMarketSaga),
		fork(watchNewItemsGetListConfigCustom),
		fork(watchNewItemsSaveConfigCustom),
		fork(watchNewItemsDeleteConfigCustom),
	]);
}

export default dashboardNewItemsSaga;
