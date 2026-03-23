import { combineReducers } from "redux";

// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer";

// NewItems
import DashboardNewItems from "./newItems/reducer";

// Tasks (ERP Todo)
import DashboardMasterData from "./tasks/reducer";

const rootReducer = combineReducers({
	Login,
	Account,
	ForgetPassword,
	Profile,
	DashboardNewItems,
	DashboardMasterData,
});

export default rootReducer;