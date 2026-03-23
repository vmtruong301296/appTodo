import { call, put, takeEvery } from "redux-saga/effects";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toast } from "../../../helpers/toast_helper";

// Profile Redux States
import { EDIT_PROFILE } from "./actionTypes";
import { profileSuccess, profileError } from "./actions";

// Include Helper
import { postJwtProfile, postFakeProfile } from "../../../helpers/fakebackend_helper_native";

function* editProfile({ payload: { user } }) {
  try {
    // You can implement profile edit logic here
    // For now, just show a message
    toast.info("Profile edit feature coming soon!", { autoClose: 2000 });
  } catch (error) {
    yield put(profileError(error));
    toast.error(error?.message || "Profile update failed", { autoClose: 3000 });
  }
}

function* ProfileSaga() {
  yield takeEvery(EDIT_PROFILE, editProfile);
}

export default ProfileSaga;

