# Redux Saga Migration Guide

## ✅ Đã hoàn thành

### 1. **Cài đặt dependencies**
```bash
npm install redux react-redux redux-saga axios
```

### 2. **React Native Compatible Files**
- ✅ `src/helpers/api_helper_native.js` - AsyncStorage thay localStorage
- ✅ `src/helpers/fakebackend_helper_native.js` - React Native compatible
- ✅ `src/store/index_native.js` - Redux store cho React Native
- ✅ `src/store/sagas_native.js` - Root saga
- ✅ `src/store/auth/login/saga_native.js` - Login saga với AsyncStorage + Expo Router

### 3. **Updated Files**
- ✅ `app/_layout.tsx` - Tích hợp Redux Provider
- ✅ `app/(auth)/login.tsx` - Login với Redux Saga
- ✅ `components/CustomDrawer.tsx` - Logout với Redux
- ✅ `src/config.js` - API URL configuration

## 📝 Cấu hình API URL

Mở file `src/config.js` và đặt API URL của bạn:

```javascript
api: {
  API_URL: "https://your-api-url.com"
}
```

## 🔧 Cách sử dụng

### Login
```typescript
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../src/store/actions';

const dispatch = useDispatch();
const { loading, error, user } = useSelector((state: any) => state.Login);

// Login
dispatch(loginUser({ username, password }, router));
```

### Logout
```typescript
import { logoutUser } from '../src/store/actions';

dispatch(logoutUser(router));
```

### Check Auth Status
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const authUser = await AsyncStorage.getItem('authUser');
if (authUser) {
  const user = JSON.parse(authUser);
  console.log(user);
}
```

## 🗂️ Redux Store Structure

```
state: {
  Login: {
    loading: boolean,
    error: string | null,
    user: object | null
  },
  Account: { ... },
  ForgetPassword: { ... },
  Profile: { ... },
  DashboardNewItems: { ... }
}
```

## 🔄 API Response Format

Login API phải trả về format:

```json
{
  "status": "success",
  "token": "jwt_token_here",
  "data": {
    "name": "User Name",
    "email": "user@example.com",
    "avatar": "https://...",
    "role": "Admin",
    "config_template": { ... },
    "roles": [ ... ],
    "pageView": { ... },
    "optionView": { ... }
  }
}
```

## 🚀 Testing

1. Start app:
```bash
npm start
```

2. Test login với credentials:
   - Username: your_username
   - Password: your_password

3. Kiểm tra AsyncStorage sau login:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const authUser = await AsyncStorage.getItem('authUser');
console.log('Auth User:', JSON.parse(authUser));
```

## ⚠️ Lưu ý

1. **API URL**: Phải cấu hình đúng trong `src/config.js`
2. **API Format**: API phải trả về đúng format như trên
3. **Token**: Token sẽ được lưu trong AsyncStorage và gửi kèm headers
4. **Error Handling**: Lỗi sẽ được hiển thị qua Alert native

## 🔍 Debug

### Check Redux State
```typescript
import { useSelector } from 'react-redux';

const state = useSelector((state: any) => state);
console.log('Redux State:', state);
```

### Check API Call
```typescript
// Trong src/helpers/api_helper_native.js
// Đã có interceptor để log errors
```

### Check AsyncStorage
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const keys = await AsyncStorage.getAllKeys();
console.log('Storage Keys:', keys);

for (const key of keys) {
  const value = await AsyncStorage.getItem(key);
  console.log(key, value);
}
```

## 📚 Tài liệu tham khảo

- [Redux Saga Documentation](https://redux-saga.js.org/)
- [React Redux Hooks](https://react-redux.js.org/api/hooks)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Expo Router](https://docs.expo.dev/router/introduction/)

