import { call, put, takeEvery } from "redux-saga/effects";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toast } from "../../../helpers/toast_helper";

// Register Redux States
import { REGISTER_USER } from "./actionTypes";
import { registerUserSuccessful, registerUserFailed } from "./actions";

// Include Helper
import { postJwtRegister, postFakeRegister } from "../../../helpers/fakebackend_helper_native";

function* registerUser({ payload: { user, router } }) {
  try {
    // You can implement registration logic here
    // For now, just show a message
    toast.info("Registration feature coming soon!", { autoClose: 2000 });
  } catch (error) {
    yield put(registerUserFailed(error));
    toast.error(error?.message || "Registration failed", { autoClose: 3000 });
  }
}

function* accountSaga() {
  yield takeEvery(REGISTER_USER, registerUser);
}

export default accountSaga;

