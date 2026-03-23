//REGISTER
export const POST_FAKE_REGISTER = "/auth/signup";

//LOGIN
export const POST_FAKE_LOGIN = "/auth/signin";
export const POST_LOGIN = "/api/login";
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login";
export const POST_FAKE_PASSWORD_FORGET = "/auth/forgot-password";
export const POST_PASSWORD_FORGET = "/api/forgot-password";
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd";
export const SOCIAL_LOGIN = "/social-login";

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile";
export const POST_EDIT_PROFILE = "/user";

// Calendar
export const GET_EVENTS = "/events";
export const GET_CATEGORIES = "/categories";
export const GET_UPCOMMINGEVENT = "/upcommingevents";
export const ADD_NEW_EVENT = "/add/event";
export const UPDATE_EVENT = "/update/event";
export const DELETE_EVENT = "/delete/event";

// Chat
export const GET_DIRECT_CONTACT = "/chat";
export const GET_MESSAGES = "/messages";
export const ADD_MESSAGE = "add/message";
export const GET_CHANNELS = "/channels";
export const DELETE_MESSAGE = "delete/message";

//Mailbox
export const GET_MAIL_DETAILS = "/mail";
export const DELETE_MAIL = "/delete/mail";

// Ecommerce
// Product
export const GET_PRODUCTS = "/apps/product";
export const DELETE_PRODUCT = "/apps/product";
export const ADD_NEW_PRODUCT = "/apps/product";
export const UPDATE_PRODUCT = "/apps/product";

// Orders
export const GET_ORDERS = "/apps/order";
export const ADD_NEW_ORDER = "/apps/order";
export const UPDATE_ORDER = "/apps/order";
export const DELETE_ORDER = "/apps/order";

// Customers
export const GET_CUSTOMERS = "/apps/customer";
export const ADD_NEW_CUSTOMER = "/apps/customer";
export const UPDATE_CUSTOMER = "/apps/customer";
export const DELETE_CUSTOMER = "/apps/customer";

// Sellers
export const GET_SELLERS = "/sellers";

// Project list
export const GET_PROJECT_LIST = "/project/list";

// Task
export const GET_TASK_LIST = "/apps/task";
export const ADD_NEW_TASK = "/apps/task";
export const UPDATE_TASK = "/apps/task";
export const DELETE_TASK = "/apps/task";

// CRM
// Conatct
export const GET_CONTACTS = "/apps/contact";
export const ADD_NEW_CONTACT = "/apps/contact";
export const UPDATE_CONTACT = "/apps/contact";
export const DELETE_CONTACT = "/apps/contact";

// Companies
export const GET_COMPANIES = "/apps/company";
export const ADD_NEW_COMPANIES = "/apps/company";
export const UPDATE_COMPANIES = "/apps/company";
export const DELETE_COMPANIES = "/apps/company";

// Lead
export const GET_LEADS = "/apps/lead";
export const ADD_NEW_LEAD = "/apps/lead";
export const UPDATE_LEAD = "/apps/lead";
export const DELETE_LEAD = "/apps/lead";

// Deals
export const GET_DEALS = "/deals";

// Crypto
export const GET_TRANSACTION_LIST = "/transaction-list";
export const GET_ORDRER_LIST = "/order-list";

// Invoice
export const GET_INVOICES = "/apps/invoice";
export const ADD_NEW_INVOICE = "/apps/invoice";
export const UPDATE_INVOICE = "/apps/invoice";
export const DELETE_INVOICE = "/apps/invoice";

// TicketsList
export const GET_TICKETS_LIST = "/apps/ticket";
export const ADD_NEW_TICKET = "/apps/ticket";
export const UPDATE_TICKET = "/apps/ticket";
export const DELETE_TICKET = "/apps/ticket";

// Dashboard Analytics

// Sessions by Countries
export const GET_ALL_DATA = "/all-data";
export const GET_HALFYEARLY_DATA = "/halfyearly-data";
export const GET_MONTHLY_DATA = "/monthly-data";

// Audiences Metrics
export const GET_ALLAUDIENCESMETRICS_DATA = "/allAudiencesMetrics-data";
export const GET_MONTHLYAUDIENCESMETRICS_DATA = "/monthlyAudiencesMetrics-data";
export const GET_HALFYEARLYAUDIENCESMETRICS_DATA = "/halfyearlyAudiencesMetrics-data";
export const GET_YEARLYAUDIENCESMETRICS_DATA = "/yearlyAudiencesMetrics-data";

// Users by Device
export const GET_TODAYDEVICE_DATA = "/todayDevice-data";
export const GET_LASTWEEKDEVICE_DATA = "/lastWeekDevice-data";
export const GET_LASTMONTHDEVICE_DATA = "/lastMonthDevice-data";
export const GET_CURRENTYEARDEVICE_DATA = "/currentYearDevice-data";

// Audiences Sessions by Country
export const GET_TODAYSESSION_DATA = "/todaySession-data";
export const GET_LASTWEEKSESSION_DATA = "/lastWeekSession-data";
export const GET_LASTMONTHSESSION_DATA = "/lastMonthSession-data";
export const GET_CURRENTYEARSESSION_DATA = "/currentYearSession-data";

// Dashboard CRM

// Balance Overview
export const GET_TODAYBALANCE_DATA = "/todayBalance-data";
export const GET_LASTWEEKBALANCE_DATA = "/lastWeekBalance-data";
export const GET_LASTMONTHBALANCE_DATA = "/lastMonthBalance-data";
export const GET_CURRENTYEARBALANCE_DATA = "/currentYearBalance-data";

// Deal type
export const GET_TODAYDEAL_DATA = "/todayDeal-data";
export const GET_WEEKLYDEAL_DATA = "/weeklyDeal-data";
export const GET_MONTHLYDEAL_DATA = "/monthlyDeal-data";
export const GET_YEARLYDEAL_DATA = "/yearlyDeal-data";

// Sales Forecast

export const GET_OCTSALES_DATA = "/octSales-data";
export const GET_NOVSALES_DATA = "/novSales-data";
export const GET_DECSALES_DATA = "/decSales-data";
export const GET_JANSALES_DATA = "/janSales-data";

// Dashboard Ecommerce
// Revenue
export const GET_ALLREVENUE_DATA = "/allRevenue-data";
export const GET_MONTHREVENUE_DATA = "/monthRevenue-data";
export const GET_HALFYEARREVENUE_DATA = "/halfYearRevenue-data";
export const GET_YEARREVENUE_DATA = "/yearRevenue-data";

// Dashboard Crypto
// Portfolio
export const GET_BTCPORTFOLIO_DATA = "/btcPortfolio-data";
export const GET_USDPORTFOLIO_DATA = "/usdPortfolio-data";
export const GET_EUROPORTFOLIO_DATA = "/euroPortfolio-data";

// Market Graph
export const GET_ALLMARKETDATA_DATA = "/allMarket-data";
export const GET_YEARMARKET_DATA = "/yearMarket-data";
export const GET_MONTHMARKET_DATA = "/monthMarket-data";
export const GET_WEEKMARKET_DATA = "/weekMarket-data";
export const GET_HOURMARKET_DATA = "/hourMarket-data";

// Dashboard Crypto
// Project Overview
export const GET_ALLPROJECT_DATA = "/allProject-data";
export const GET_MONTHPROJECT_DATA = "/monthProject-data";
export const GET_HALFYEARPROJECT_DATA = "/halfYearProject-data";
export const GET_YEARPROJECT_DATA = "/yearProject-data";

// Project Status
export const GET_ALLPROJECTSTATUS_DATA = "/allProjectStatus-data";
export const GET_WEEKPROJECTSTATUS_DATA = "/weekProjectStatus-data";
export const GET_MONTHPROJECTSTATUS_DATA = "/monthProjectStatus-data";
export const GET_QUARTERPROJECTSTATUS_DATA = "/quarterProjectStatus-data";

// Dashboard NFT
// Marketplace
export const GET_ALLMARKETPLACE_DATA = "/allMarketplace-data";
export const GET_MONTHMARKETPLACE_DATA = "/monthMarketplace-data";
export const GET_HALFYEARMARKETPLACE_DATA = "/halfYearMarketplace-data";
export const GET_YEARMARKETPLACE_DATA = "/yearMarketplace-data";

// Project
export const ADD_NEW_PROJECT = "/add/project";
export const UPDATE_PROJECT = "/update/project";
export const DELETE_PROJECT = "/delete/project";

// Pages > Team
export const GET_TEAMDATA = "/teamData";
export const DELETE_TEAMDATA = "/delete/teamData";
export const ADD_NEW_TEAMDATA = "/add/teamData";
export const UPDATE_TEAMDATA = "/update/teamData";

// File Manager
// Folder
export const GET_FOLDERS = "/folder";
export const DELETE_FOLDER = "/delete/folder";
export const ADD_NEW_FOLDER = "/add/folder";
export const UPDATE_FOLDER = "/update/folder";

// File
export const GET_FILES = "/file";
export const DELETE_FILE = "/delete/file";
export const ADD_NEW_FILE = "/add/file";
export const UPDATE_FILE = "/update/file";

// To do
export const GET_TODOS = "/todo";
export const DELETE_TODO = "/delete/todo";
export const ADD_NEW_TODO = "/add/todo";
export const UPDATE_TODO = "/update/todo";

// To do Project
export const GET_PROJECTS = "/projects";
export const ADD_NEW_TODO_PROJECT = "/add/project";

//Search VPN
export const GET_PRODUCT_PRICE_XERO = "/api/getProductPriceXero";
export const GET_PRODUCT_PRICE = "/api/erp/pricing/products";
export const GET_PRODUCT_PRICE_QUOTE_IN = "/api/getProductPriceQuoteIn";

//ERP
export const GET_PRODUCT_ERP = "/api/stock-by-products-new";
export const GET_LIST_SERIAL_NUMBER = "/api/stock-list-serials-new";
export const GET_AMOUNT_PRODUCT_ERP = "/api/get-amount-products";

//Monitor
export const GET_LIST_SERIAL_ERRORS = "/api/list-data/list-serial-errors";
export const UPDATE_SERIAL_ACCEPT = "/api/list-data/serial-accept";
export const UPDATE_SERIAL_NO_ACCEPT = "/api/list-data/serial-noaccept";

//Config Template
export const UPDATE_CONFIG_USER = "/api/update-config-template";

//Master data
export const GET_LIST_MODEL = "/api/product-list-combobox-new";
export const GET_LIST_SUPPLIER = "/api/supplier-list-combobox-new";
export const GET_LIST_WAREHOUSE = "/api/warehouse-list-combobox-new";
export const GET_LIST_DICTIONARY = "/api/dictionary-list-combobox-new";
export const GET_LIST_ORGANIZATION = "/api/organization/list-combo-box";
export const GET_LIST_POSITION = "/api/position/list-combo-box";

//Customer
export const GET_LIST_EBAY_CUSTOMER = "/api/getEbayCustomer";
export const GET_EXPORT_LIST_CUSTOMER = "/api/customer-export";

//Xero invoice
export const GET_XERO_INVOICE = "/api/getXeroInvoiceByNumber";

//Users
export const GET_LIST_USERS = "/api/user/users-list";
export const DELETE_USER = "/api/user/delete-user";
export const ADD_NEW_USER = "/api/user/create-user";
export const EDIT_USER = "/api/user/edit-user";
export const GET_USER_BY_ID = "/api/user/getInfo";

//New Item
export const GET_LIST_NEW_ITEM = "/api/items";
export const GET_BLACK_LIST_CATEGORIES = "/api/category/blacklist";
export const GET_BLACK_LIST_SELLERS = "/api/seller/blacklist";
export const GET_BLACK_LIST_KEYWORDS = "/api/keyWords/blacklist";
export const POST_CLEAR_ALL_DATA = "/api/items/truncate";
export const GET_HOST_LIST_ITEM = "/api/v1/disti/api/hotitem";
export const GET_HOT_ITEM_KEY_WORD = "/api/hotItemKeyWord/getHotItemKeyWord";
export const ADD_HOT_ITEM_KEY_WORD = "/api/hotItemKeyWord/addHotItemKeyWord";
export const DELETE_HOT_ITEM_KEY_WORD = "/api/hotItemKeyWord/deleteHotItemKeyWord";
export const GET_HOT_ITEM = "/api/hotItemKeyWord/getListHotItem";
export const GET_LIST_MARKET = "/api/ebaySite/getListMarket";
export const POST_LIST_MARKET = "/api/ebaySite/updateFlagEbaySite";
export const GET_LIST_CONFIG_CUSTOM = "/api/newItemsConfig";
export const ADD_CONFIG_CUSTOM = "/api/newItemsConfig/add";
export const UPDATE_CONFIG_CUSTOM = "/api/newItemsConfig/update";
export const DELETE_CONFIG_CUSTOM = "/api/newItemsConfig/delete";

//Permission Group
export const GET_PERMISSION = "/api/user/permission";
export const GET_GROUP_LIST = "/api/permissionsgroup/grouplist";
export const GET_PERMISSION_LIST = "/api/permissionsgroup/getPermissionList";
export const GET_PERMISSION_LIST_BY_ID_GROUP = "/api/permissionsgroup/getPermissionListByIdGroup";
export const GET_GROUP_INFO = "/api/permissionsgroup/groupinfo";
export const POST_PERMISSION_GROUP = "/api/permissionsgroup/save";
export const DELETE_PERMISSION_GROUP = "/api/permissionsgroup/delete";

//Partner Management
export const GET_LIST_PARTNER = "/api/organization/get-list-partner";
export const GET_LIST_DATA = "/api/dictionary/get-list-data";
export const GET_INFO_NOTE_BY_ID = "/api/notes/get-info";
export const ADD_NOTE = "/api/notes/data-save";
export const DELETE_PARTNER = "/api/organization/delete-partner";
export const ADD_PARTNER = "/api/organization/partner-save";
export const GET_INFO_PARTNER_BY_ID_API = "/api/organization/get-info-partner-by-id";
export const GET_LIST_COMBO_PARTNER = "/api/organization/get-list-combo-partner";

//Partner Add
export const GET_LIST_COMBOBOX_USER = "/api/user/list-combo-box";
export const GET_LIST_COMBOBOX_CONFIGURATIONTERM = "/api/configurationterm/list-combo-box";
export const GET_LIST_COMBOBOX_LOCATION = "/api/location/list-combo-box";

//Ebay chats
// export const GET_LIST_EBAY_ACCOUNT = "/api/chats/getListEbayAccount";
// export const GET_EBAY_CHAT = "/api/chats/getListSender?account_contact=";
// export const GET_EBAY_MESSAGES = "/api/chats/getMessage?";
// export const SEND_MESSAGE = "/api/chats/sendMessage?";
// export const GET_NEW_MESSAGES = "/api/chats/getNewMessage?username=";
// export const UPDATE_STATUS_CONVERSATION = "/api/chats/updateStatusConversation?message_information_id=";

export const GET_LIST_EBAY_ACCOUNT = "/api/v1/disti/api/chatv2/account/all";
export const GET_EBAY_CHAT = "/api/v1/disti/api/chatv2/conversation/all";
export const GET_EBAY_MESSAGES = "/api/v1/disti/api/chatv2/message/getMessage";
export const SEND_MESSAGE = "/api/chats/sendMessage?";
export const GET_NEW_MESSAGES = "/api/chats/getNewMessage?username=";
export const UPDATE_STATUS_CONVERSATION = "/api/v1/disti/api/chatv2/updateStatusConversation";

export const GET_LIST_GROUP = "/api/v1/disti/api/chatv2/group/all";
export const GET_LIST_MEMBER = "/api/v1/disti/api/chatv2/conversation-member/all";
export const POST_CONVERSATION_MEMBER = "/api/v1/disti/api/chatv2/conversation-member/add";
export const DELETE_CONVERSATION_MEMBER = "/api/v1/disti/api/chatv2/conversation-member/delete";

export const GET_LIST_READER = "/api/v1/disti/api/chatv2/conversation-reader/all";
export const POST_CONVERSATION_READER = "/api/v1/disti/api/chatv2/conversation-reader/read";
export const DELETE_CONVERSATION_READER = "/api/v1/disti/api/chatv2/conversation-reader/unread";

export const GET_LABEL = "/api/v1/disti/api/chatv2/conversation-label";
export const POST_LABEL = "/api/v1/disti/api/chatv2/conversation-label/add";
export const UPDATE_LABEL = "/api/v1/disti/api/chatv2/conversation-label/edit";
export const DELETE_LABEL = "/api/v1/disti/api/chatv2/conversation-label/delete";
export const SAVE_LABEL = "/api/v1/disti/api/chatv2/conversation-label/save";
export const REMOVE_LABEL = "/api/v1/disti/api/chatv2/conversation-label/remove";

export const LIST_ACCOUNT_QR = "/api/v1/disti/api/chatv2/account/all";

//List Quotes
export const GET_LIST_QUOTES = "/api/quote/get-list";
export const ADD_NEW_QUOTE = "/api/quote/data-save";
export const GET_LIST_QUOTES_NOTES = "/api/notes/get-info";
export const GET_LIST_QUOTES_PRODUCT_CODE = "/api/product-model/search-product-price";
export const GET_LIST_QUOTES_SERIAL_NUMBER = "/api/stock-model-serial/list-combo-box";
export const GET_QUOTE_BY_ID = "/api/quote/get-info";
export const DELETE_QUOTE = "/api/quote/delete";
export const SAVE_QUOTE = "/api/quote/data-save";
export const QUICK_ADD_PARTNER = "/api/organization/quick-add";
export const QUOTES_ADD_EMAIL = "/api/quote/send-email";

export const TRANSFER_GET_DATA = "/api/transferGetData";
export const TRANSFER_POST_DATA = "/api/transferPostData";
export const TRANSFER_DELETE_DATA = "/api/transferDeleteData";

//List ebay product
export const POST_DATA_LISTING = "/api/ebay/getItemDescription";
export const GET_LIST_CURRENCY = "/api/v1/disti/api/ebay/getAccountCurrency";
export const GET_SELLER_ACCOUNT = "api/v1/disti/api/ebay/getSellerAccount";
export const GET_LIST_OLD_ITEM = "/api/v1/disti/api/ebay/getListOldItem";
export const POST_DATA_OLD_EBAY = "/api/v1/disti/api/ebay/post-old-item";
export const POST_ITEM_TO_WAITING = "/api/v1/disti/api/ebay/updateItemStatus";
export const SYNC_ITEM_FROM_EBAY = "/api/v1/disti/api/ebay/syncItemFromEbay";
export const GET_LAST_SYNC_DATE = "/api/v1/disti/api/ebay/getSyncEbayItemTime";
export const GET_ALL_WAITING_ITEM = "/api/v1/disti/api/ebay/getAllWaitingItem";

export const POST_DATA_LIST_IMAGE_EXE_EBAY = process.env.REACT_APP_SERVER_EXECUTE_IMAGE_URL;
export const GET_ACCOUNT_CONFIG_EXECUTE = "/api/v1/disti/api/accountEbayFrame/getConfigAccount";
export const UPLOAD_EXE_IMAGE = "/api/uploadImageOfListing";

export const GET_LIST_IMAGE_OLD_EBAY = "/api/v1/disti/api/ebay/getItemImage";
export const SAVE_SELECTED_IMAGE_OLD_ITEM_EBAY = "/api/v1/disti/api/ebay/saveImageSelected";
export const GET_LIST_MODEL_OLD_EBAY = "/api/v1/disti/api/ebay/searchModelExistItem";
export const POST_LIST_IMAGE_EXE_OLD_EBAY = "/api/v1/disti/api/ebay/saveExecuteImage";
export const UPLOAD_NEW_IMAGE_TO_OLD_EBAY = "/api/v1/disti/api/ebay/saveNewImageItem";
export const DELETE_IMAGE_FROM_OLD_EBAY = "/api/v1/disti/api/ebay/deleteItemImage";
export const GET_LIST_SHIPPING_POLICY = "/api/v1/disti/api/ebay/getListPolicy";

//Permissions
export const GET_LIST_PERMISSIONS = "/api/permissionsgroup/grouplist";
export const GET_USER_PERMISSIONS = "/api/user/permission";
export const SET_USER_PERMISSION = "/api/user/setpermission";

export const DOWNLOAD_FILE = "/api/downloadFile";

export const UPLOAD_FILE = "/api/uploadFile";

export const UPLOAD_FILE_BASE64 = "/api/uploadImageBas64";

//Offer manager
export const GET_LIST_BUYER_INITIATED = "/api/v1/disti/api/ebay/getOfferItem";
export const GET_LIST_ELIGIBLE_ITEM = "/api/v1/disti/api/ebay/getEligibleItem";
export const GET_LIST_HISTORY = "/api/v1/disti/api/ebay/getOfferItemHistory";
export const GET_LIST_ELIGIBLE_HISTORY = "/api/v1/disti/api/ebay/getEligibleItemHistory";
export const POST_BEST_OFFER_ACTION = "/api/v1/disti/api/ebay/respondToBestOffer";
export const POST_SEND_OFFER = "/api/v1/disti/api/ebay/sendOfferToInterestedBuyers";
export const UPDATE_SEEN_OFFER = "/api/v1/disti/api/ebay/updateSeenOffer";
export const SYNC_ITEM_OFFER = "/api/v1/disti/api/ebay/syncHistoryOneItem";

//Purchase order sync ebay
export const SYNC_EBAY_PURCHASE_ORDERS = "/api/ebay/sync-data";

//Scan log
export const GET_SCAN_LOG_TEXT = "/api/v1/autoscan/api/getParagraph";

//Watchlist
export const GET_WATCH_LIST = "/api/v1/disti/api/ebay/showWatchList";
export const GET_WATCH_LIST_EBAY_ACCOUNT = "/api/chats/getListEbayAccount";

//List product disti
export const GET_LIST_PRODUCT_DISTI = "/api/v1/disti/api/erp/getListProductDisti";
export const GET_LIST_CONFIG_DATA_FILTER = "/api/v1/disti/api/erp/getValueConfigDataFilter";
export const POST_DATA_PRODUCT_DISTI = "/api/v1/disti/api/erp/updateProductDistiData";
export const GET_LIST_PRODUCT_PRICE_HISTORY_DISTI = "/api/v1/disti/api/erp/getPriceHistory";

//List bid
export const GET_LIST_BID = "/api/v1/disti/api/allbids/getListItemBid";
export const POST_UPDATE_SHOW_STATUS_ITEM = "api/v1/disti/api/allbids/updateShowStatus";
export const GET_DATA_BID_ITEM_BY_ID = "api/v1/disti/api/allbids/updateOrCreateCurrentBid";

//List config
export const GET_LIST_CONFIG = "/api/v1/disti/api/listConfig/getListConfig";
export const GET_LIST_FILTER_CONFIG = "/api/v1/disti/api/listConfig/getListFilterConfig";
export const POST_NEW_CONFIG = "/api/v1/disti/api/listConfig/addConfig";
export const DELETE_CONFIG = "/api/v1/disti/api/listConfig/deleteConfig";

//Config template
export const GET_LIST_CONFIG_TEMPLATE = "/api/v1/disti/api/configTemplate/getListConfigTemplate";
export const GET_DATA_CONFIG_TEMPLATE_BY_ID = "/api/v1/disti/api/configTemplate/getDataConfigTemplate";
export const GET_LIST_CONFIG_ACCOUNT = "/api/v1/disti/api/configTemplate/getListEbayAccount";
export const GET_LIST_TEMPLATE_KEYWORD = "/api/v1/disti/api/configTemplate/getListTemplateKeyword";
export const POST_NEW_TEMPLATE_CONFIG = "/api/v1/disti/api/configTemplate/addConfigTemplate";
export const EDIT_NEW_TEMPLATE_CONFIG = "/api/v1/disti/api/configTemplate/editConfigTemplate";
export const DELETE_NEW_TEMPLATE_CONFIG = "/api/v1/disti/api/configTemplate/deleteConfigTemplate";

//Move data account ebay
export const GET_LIST_ACCOUNT_MOVE_DATA = "/api/v1/disti/api/ebay/getAccountMoveData";
export const GET_LIST_STATUS_MOVE_DATA = "/api/v1/disti/api/ebay/getStatusMoveData";
export const GET_LIST_ITEM_MOVE_DATA = "/api/v1/disti/api/ebay/getListMoveItem";
export const UPLOAD_DATA_MOVE_ITEM = "/api/v1/disti/api/ebay/listingToEbay";
export const DELETE_MOVE_ITEM_IMAGES = "/api/v1/disti/api/ebay/deleteMoveItemImage";
export const UPDATE_STATUS_ITEM = "/api/v1/disti/api/ebay/updateStatusMoveItem";

//Data Scrap
export const DATA_SCRAP_GET_LIST = "/api/v1/disti/api/scrap-data-list";
export const DATA_SCRAP_GET_BY_ID = "/api/v1/disti/api/scrap-data-info";
export const DATA_SCRAP_GET_LIST_SOURCE = "/api/v1/disti/api/scrap-data-sources";
export const DATA_SCRAP_GET_LIST_CATEGORY = "/api/v1/disti/api/scrap-data-category-level-1";
export const DATA_SCRAP_GET_LIST_BRAND = "/api/v1/disti/api/scrap-data-list-brand";
export const DATA_SCRAP_GET_BY_CODE = "/api/v1/disti/api/scrap-data-info-by-code";
export const DATA_SCRAP_GET_BY_CODE_ERP = "/api/product-model/get-info-by-code";

//Datafeed
export const DATA_FEED_GET_LIST = "/api/v1/disti/api/datafeed/getListDatafeed";
export const DATA_FEED_GET_LIST_DESTINATION = "/api/v1/disti/api/datafeed/getListDestination";
export const DATA_FEED_GET_LIST_BRAND = "/api/v1/disti/api/datafeed/getListBrand";
export const DATA_FEED_GET_LIST_SOURCE = "/api/v1/disti/api/datafeed/getListSource";
export const DATA_FEED_GET_LIST_CATEGORY = "/api/v1/disti/api/datafeed/getCategoryImport";
export const DATA_FEED_GET_LIST_MAPPING_CATEGORY = "/api/v1/disti/api/datafeed/getMappingCategory";
export const DATA_FEED_SAVE_MAPPING_CATE = "/api/v1/disti/api/datafeed/saveMappingCategory";
export const DATA_FEED_DELETE_MAPPING_CATE = "/api/v1/disti/api/datafeed/removeMappingCategory";
export const DATA_FEED_SAVE_CONFIG_DESTINATION = "/api/v1/disti/api/datafeed/saveConfigDestination";
export const DATA_FEED_SAVE_CONFIG_PERCENT_MARKUP = "/api/v1/disti/api/datafeed/savePecentAutoMarkUp";
export const DATA_FEED_UPLOAD_PRODUCT = "/api/v1/disti/api/datafeed/uploadItemDatafeed";
export const DATA_FEED_UNLIST_PRODUCT = "/api/v1/disti/api/datafeed/unListItemDatafeed";

export const GET_HTML_TEMPLATE = "/api/v1/disti/api/configTemplate/getHtmlTemplate";
export const GET_HTML_FRAME = "/api/v1/disti/api/accountEbayFrame/getHtmlFrame";

export const SAVE_USER_OPTION_VIEW = "/api/user/set-list-optionview";

