import { all, fork } from "redux-saga/effects";

//Auth
import AccountSaga from "./auth/register/saga";
import AuthSaga from "./auth/login/saga";
import ForgetSaga from "./auth/forgetpwd/saga";
import ProfileSaga from "./auth/profile/saga";

//New Items
import dashboardNewItemsSaga from "./newItems/saga";

export default function* rootSaga() {
	yield all([fork(AccountSaga), fork(AuthSaga), fork(ForgetSaga), fork(ProfileSaga), fork(dashboardNewItemsSaga)]);
}
