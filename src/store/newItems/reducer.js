import {
	SHOW_EXCLUDE_MODAL,
	GET_ITEM_DATA,
	API_RESPONSE_SUCCESS,
	API_RESPONSE_ERROR,
	API_REFRESH_LOADING,
	GET_KEY_WORD_LIST,
	RESET_INIT_BL_CATEGORIES_DATA,
	RESET_INIT_BL_SELLERS_DATA,
	RESET_INIT_BL_KEYWORDS_DATA,
	RESET_INIT_HL_ITEM_DATA,
	API_GET_NEW_ITEM_LIST,
	API_GET_BLACK_LIST_CATEGORIES,
	API_GET_BLACK_LIST_SELLERS,
	API_GET_BLACK_LIST_KEYWORDS,
	API_GET_HOT_LIST_ITEM,
	API_POST_BLACK_LIST_CATEGORY,
	API_POST_BLACK_LIST_SELLER,
	API_POST_BLACK_LIST_KEYWORD,
	API_POST_HOT_ITEM,
	ADD_HOT_ITEM_SUCCESS,
	ADD_HOT_ITEM_FAIL,
	API_DELETE_BLACK_LIST_CATEGORY,
	API_DELETE_BLACK_LIST_SELLER,
	API_DELETE_BLACK_LIST_KEYWORD,
	API_DELETE_HOT_ITEM,
	DELETE_HOT_ITEM_SUCCESS,
	DELETE_HOT_ITEM_FAIL,
	API_POST_CLEAR_ALL_DATA,
	API_GET_HOT_ITEM_KEYWORD,
	ADD_HOT_ITEM_KEYWORD_SUCCESS,
	ADD_HOT_ITEM_KEYWORD_FAIL,
	DELETE_HOT_ITEM_KEYWORD_SUCCESS,
	DELETE_HOT_ITEM_KEYWORD_FAIL,
	API_GET_HOT_ITEM,
	API_GET_LIST_MARKET,
	UPDATE_LIST_MARKET_SUCCESS,
	UPDATE_LIST_MARKET_FAIL,
	DELETE_LIST_MARKET_SUCCESS,
	DELETE_LIST_MARKET_FAIL,
	NEW_ITEMS_API_GET_LIST_CUSTOM_CONFIG,
	NEW_ITEMS_API_DELETE_CONFIG_CUSTOM_SUCCESS,
	NEW_ITEMS_API_DELETE_CONFIG_CUSTOM_FAIL,
	NEW_ITEMS_API_SAVE_CONFIG_CUSTOM_SUCCESS,
	NEW_ITEMS_API_SAVE_CONFIG_CUSTOM_FAIL,
} from "./actionType";

const INIT_STATE = {
	dataListNewItem: [],
	itemData: {},
	dataListKeyWord: [],
	keyWordData: [],
	dataBlackListCategories: [],
	dataBlackListSellers: [],
	dataBlackListKeywords: [],
	dataHotListItem: [],
	dataHotItemKeyWord: [],
	loadingHotItemKeyWord: false,
	loadingHotList: false,
	showExcludeModal: false,
	erroNewItem: null,
	errorCategories: null,
	errorSellers: null,
	errorKeywords: null,
	errorHotItems: null,
	errorHotItemKeyWord: null,
	refreshState: false,
	listMarket: [],
	dataListConfigCustom: [],
};

const DashboardNewItems = (state = INIT_STATE, action) => {
	switch (action.type) {
		case API_RESPONSE_SUCCESS:
			switch (action.payload.actionType) {
				case API_GET_NEW_ITEM_LIST:
					return {
						...state,
						dataListNewItem: action.payload.data,
					};
				case API_GET_BLACK_LIST_CATEGORIES:
					return {
						...state,
						dataBlackListCategories: action.payload.data,
					};
				case API_GET_BLACK_LIST_SELLERS:
					return {
						...state,
						dataBlackListSellers: action.payload.data,
					};
				case API_GET_BLACK_LIST_KEYWORDS:
					return {
						...state,
						dataBlackListKeywords: action.payload.data,
					};
				case API_GET_HOT_LIST_ITEM:
					return {
						...state,
						dataHotListItem: action.payload.data,
						loadingHotList: true,
					};
				case API_POST_BLACK_LIST_CATEGORY:
					return {
						...state,
					};
				case API_POST_BLACK_LIST_SELLER:
					return {
						...state,
					};
				case API_POST_BLACK_LIST_KEYWORD:
					return {
						...state,
					};
				case API_POST_CLEAR_ALL_DATA:
					return {
						...state,
					};
				case API_POST_HOT_ITEM:
					return {
						...state,
						dataHotListItem: [...state.dataHotListItem, action.payload.data.data],
					};
				case API_DELETE_BLACK_LIST_CATEGORY:
					return {
						...state,
						refreshState: !state.refreshState,
					};
				case API_DELETE_BLACK_LIST_SELLER:
					return {
						...state,
						refreshState: !state.refreshState,
					};
				case API_DELETE_BLACK_LIST_KEYWORD:
					return {
						...state,
						refreshState: !state.refreshState,
					};
				case API_GET_HOT_ITEM_KEYWORD:
					return {
						...state,
						dataHotItemKeyWord: action.payload.data.data,
						loadingHotItemKeyWord: true,
					};
				case API_GET_HOT_ITEM:
					return {
						...state,
						dataListNewItem: action.payload.data.data,
					};
				case API_GET_LIST_MARKET:
					return {
						...state,
						listMarket: action.payload.data.data,
					};
				case NEW_ITEMS_API_GET_LIST_CUSTOM_CONFIG:
					return {
						...state,
						dataListConfigCustom: action.payload.data,
					};
				default:
					return state;
			}
		case API_RESPONSE_ERROR:
			switch (action.payload.actionType) {
				case API_GET_NEW_ITEM_LIST:
					return {
						...state,
						erroNewItem: action.payload,
					};
				case API_GET_BLACK_LIST_CATEGORIES:
					return {
						...state,
						errorCategories: action.payload,
					};
				case API_GET_BLACK_LIST_SELLERS:
					return {
						...state,
						errorSellers: action.payload,
					};
				case API_GET_BLACK_LIST_KEYWORDS:
					return {
						...state,
						errorKeywords: action.payload,
					};
				case API_GET_HOT_LIST_ITEM:
					return {
						...state,
						errorHotItems: action.payload,
					};
				case API_POST_BLACK_LIST_CATEGORY:
					return {
						...state,
						errorCategories: action.payload,
					};
				case API_POST_BLACK_LIST_SELLER:
					return {
						...state,
						errorSellers: action.payload,
					};
				case API_POST_BLACK_LIST_KEYWORD:
					return {
						...state,
						errorKeywords: action.payload,
					};
				case API_POST_HOT_ITEM:
					return {
						...state,
						errorHotItems: action.payload,
					};
				case API_DELETE_BLACK_LIST_CATEGORY:
					return {
						...state,
						errorCategories: action.payload,
					};
				case API_DELETE_BLACK_LIST_SELLER:
					return {
						...state,
						errorSellers: action.payload,
					};
				case API_DELETE_BLACK_LIST_KEYWORD:
					return {
						...state,
						errorKeywords: action.payload,
					};
				case API_DELETE_HOT_ITEM:
					return {
						...state,
						errorHotItems: action.payload,
					};
				case API_GET_HOT_ITEM_KEYWORD:
					return {
						...state,
						errorHotItemKeyWord: action.payload,
					};
				case API_GET_HOT_ITEM:
					return {
						...state,
						erroNewItem: action.payload,
					};
				default:
					return state;
			}
		case SHOW_EXCLUDE_MODAL:
			return {
				...state,
				showExcludeModal: action.payload.data,
			};
		case GET_ITEM_DATA:
			return {
				...state,
				itemData: action.payload.data,
			};
		case GET_KEY_WORD_LIST:
			return {
				...state,
				dataListKeyWord: action.payload.data,
			};
		case RESET_INIT_BL_CATEGORIES_DATA:
			return {
				...state,
				dataBlackListCategories: [],
			};
		case RESET_INIT_BL_SELLERS_DATA:
			return {
				...state,
				dataBlackListSellers: [],
			};
		case RESET_INIT_BL_KEYWORDS_DATA:
			return {
				...state,
				dataBlackListKeywords: [],
			};
		case RESET_INIT_HL_ITEM_DATA:
			return {
				...state,
				dataHotListItem: [],
				loadingHotList: false,
			};
		case ADD_HOT_ITEM_SUCCESS:
			return {
				...state,
				dataHotListItem: [...state.dataHotListItem, action.payload.data.data],
			};
		case ADD_HOT_ITEM_FAIL:
			return {
				...state,
				error: action.payload.message,
			};
		case DELETE_HOT_ITEM_SUCCESS:
			return {
				...state,
				refreshState: !state.refreshState,
			};
		case DELETE_HOT_ITEM_FAIL:
			return {
				...state,
				error: action.payload.message,
			};
		case ADD_HOT_ITEM_KEYWORD_SUCCESS:
			return {
				...state,
				dataHotItemKeyWord: action.payload.data ? [...state.dataHotItemKeyWord, action.payload.data] : state.dataHotItemKeyWord,
			};
		case ADD_HOT_ITEM_KEYWORD_FAIL:
			return {
				...state,
				errorHotItemKeyWord: action.payload.message,
			};
		case DELETE_HOT_ITEM_KEYWORD_SUCCESS:
			return {
				...state,
				dataHotItemKeyWord: state.dataHotItemKeyWord.filter((el) => el.id.toString() !== action.payload.id[0]),
			};
		case DELETE_HOT_ITEM_KEYWORD_FAIL:
			return {
				...state,
				errorHotItemKeyWord: action.payload.message,
			};
		case UPDATE_LIST_MARKET_SUCCESS:
			return {
				...state,
				listMarket: state.listMarket.map((el) => (el.id.toString() === action.payload.id[0] ? { ...el, ...{ flag: 1 } } : el)),
			};
		case UPDATE_LIST_MARKET_FAIL:
			return {
				...state,
				error: action.payload.msg,
			};
		case DELETE_LIST_MARKET_SUCCESS:
			return {
				...state,
				listMarket: state.listMarket.map((el) => (el.id.toString() === action.payload.id[0] ? { ...el, ...{ flag: 0 } } : el)),
			};
		case DELETE_LIST_MARKET_FAIL:
			return {
				...state,
				error: action.payload.msg,
			};
		case NEW_ITEMS_API_SAVE_CONFIG_CUSTOM_SUCCESS:
			return {
				...state,
				dataListConfigCustom: state.dataListConfigCustom?.find((el) => el?.id === action.payload?.id)?.id
					? state.dataListConfigCustom.map((el) => (el?.id === action.payload?.id ? { ...el, ...action.payload } : el))
					: [...state.dataListConfigCustom, action.payload],
			};
		case NEW_ITEMS_API_SAVE_CONFIG_CUSTOM_FAIL:
			return {
				...state,
				error: action.payload.msg,
			};
		case NEW_ITEMS_API_DELETE_CONFIG_CUSTOM_SUCCESS:
			return {
				...state,
				// dataListConfigCustom: state.dataListConfigCustom.filter((el) => el.id.toString() !== action.payload?.data?.id),
			};
		case NEW_ITEMS_API_DELETE_CONFIG_CUSTOM_FAIL:
			return {
				...state,
				error: action.payload.msg,
			};
		default:
			return state;
	}
};
export default DashboardNewItems;
