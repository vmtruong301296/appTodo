import { call, put, takeEvery } from "redux-saga/effects";
import { toast } from "../../../helpers/toast_helper";

// ForgetPassword Redux States
import { FORGET_PASSWORD } from "./actionTypes";
import { userForgetPasswordSuccess, userForgetPasswordError } from "./actions";

// Include Helper
import { postFakeForgetPwd, postForgetPwd } from "../../../helpers/fakebackend_helper_native";

function* forgetUser({ payload: { user, router } }) {
  try {
    // You can implement forget password logic here
    // For now, just show a message
    toast.info("Reset password feature coming soon!", { autoClose: 2000 });
  } catch (error) {
    yield put(userForgetPasswordError(error));
    toast.error(error?.message || "Reset password failed", { autoClose: 3000 });
  }
}

function* forgetPasswordSaga() {
  yield takeEvery(FORGET_PASSWORD, forgetUser);
}

export default forgetPasswordSaga;

