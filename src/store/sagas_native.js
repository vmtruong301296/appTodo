import { all, fork } from "redux-saga/effects";

// Auth - use React Native compatible sagas
import AuthSaga from "./auth/login/saga_native";
import AccountSaga from "./auth/register/saga_native";
import ForgetSaga from "./auth/forgetpwd/saga_native";
import ProfileSaga from "./auth/profile/saga_native";

// New Items
import dashboardNewItemsSaga from "./newItems/saga";

// Tasks (ERP Todo)
import tasksSaga from "./tasks/saga";

export default function* rootSaga() {
  yield all([
    fork(AccountSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(ProfileSaga),
    fork(dashboardNewItemsSaga),
    fork(tasksSaga),
  ]);
}

