import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toast } from "../../../helpers/toast_helper";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN } from "./actionTypes";
import { apiError, loginSuccess, logoutUserSuccess } from "./actions";

// Include Both Helper File with needed methods
import { postLogin, postJwtLogin, postSocialLogin } from "../../../helpers/fakebackend_helper_native";
import { setAuthorization } from "../../../helpers/api_helper_native";

function* loginUser({ payload: { user, history } }) {
  try {
    console.log('🔐 Login attempt:', user.username);
    
    const response = yield call(postLogin, {
      userEmail: user.username,
      password: user.password,
    });

    console.log('📡 API Response:', response);

    if (response && response.status === "success") {
      console.log('✅ Login success, saving to AsyncStorage...');
      
      // Save to AsyncStorage instead of localStorage
      yield call(AsyncStorage.setItem, "settingNewItem", JSON.stringify({
        valueBlackGreen: false,
        valueTimeBlackGreen: "",
      }));
      yield call(AsyncStorage.setItem, "authUser", JSON.stringify(response));
      yield call(AsyncStorage.setItem, "config_template", JSON.stringify(response.data?.config_template || {}));
      yield call(AsyncStorage.setItem, "roles", JSON.stringify(response.data?.roles || []));
      yield call(AsyncStorage.setItem, "pageView", JSON.stringify(response.data?.pageView || {}));
      yield call(AsyncStorage.setItem, "optionView", JSON.stringify(response.data?.optionView || {}));
      yield call(AsyncStorage.removeItem, "sessionExpired");

      setAuthorization(response.token);
      yield put(loginSuccess(response));
      
      toast.success("Login Successfully", { autoClose: 1000 });
      
      console.log('🚀 Navigating to Task Center...');
      
      // Navigate using Expo Router (Task Center)
      if (history) {
        setTimeout(() => {
          history.replace("/(tabs)/newitems");
        }, 500);
      }
    } else {
      console.log('❌ Login failed:', response);
      const errorMsg = response?.message || 'Login failed';
      toast.error(errorMsg, { autoClose: 3000 });
      yield put(apiError(errorMsg));
    }
  } catch (error) {
    console.error('🔥 Login error:', error);
    const errorMsg = error?.message || error?.toString() || 'Network error';
    toast.error(errorMsg, { autoClose: 3000 });
    yield put(apiError(errorMsg));
  }
}

function* logoutUser({ payload: { router } }) {
  try {
    yield call(AsyncStorage.removeItem, "sessionExpired");
    yield call(AsyncStorage.removeItem, "authUser");
    yield call(AsyncStorage.removeItem, "config_template");
    yield call(AsyncStorage.removeItem, "roles");
    yield call(AsyncStorage.removeItem, "pageView");
    yield call(AsyncStorage.removeItem, "filterChatMobile");
    
    yield put(logoutUserSuccess(LOGOUT_USER, true));
    
    // Navigate to login using Expo Router
    if (router) {
      router.replace("/login");
    }
  } catch (error) {
    yield put(apiError(LOGOUT_USER, error));
  }
}

function* socialLogin({ payload: { data, history, type } }) {
  try {
    const response = yield call(postSocialLogin, data);
    yield call(AsyncStorage.setItem, "authUser", JSON.stringify(response));
    yield put(loginSuccess(response));
    
    if (history) {
      history.replace("/(tabs)/newitems");
    }
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeLatest(SOCIAL_LOGIN, socialLogin);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;

