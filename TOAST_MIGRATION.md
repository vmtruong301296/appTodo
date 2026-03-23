# Toast Migration Guide

## ✅ Đã migrate thành công từ `react-toastify` sang `react-native-toast-message`

---

## 📦 **Đã cài đặt:**
```bash
npm install react-native-toast-message
```

---

## 🔧 **Files đã tạo/cập nhật:**

### 1. **Helper**
- ✅ `src/helpers/toast_helper.js` - Toast helper với API giống react-toastify
- ✅ `src/config/toast.config.tsx` - Custom toast UI đẹp với Lucide icons

### 2. **Updated Files**
| File | Thay đổi |
|------|----------|
| `app/_layout.tsx` | ✅ Import `<Toast config={toastConfig} />` |
| `app/(auth)/login.tsx` | ✅ Dùng `toast.error()` thay `Alert.alert()` |
| `src/store/auth/login/saga_native.js` | ✅ Import toast helper |
| `src/store/newItems/saga.js` | ✅ Import toast helper (thay react-toastify) |

### 3. **Reference Code**
- ✅ `app/(auth)/_Authentication_Reference/` → `docs_reference_web_code/`
  - Di chuyển ra ngoài app/ để Metro không parse React Web code

---

## 🎨 **Toast Types:**

### Success Toast
```javascript
import { toast } from '../src/helpers/toast_helper';

toast.success("Login Successfully", { autoClose: 1000 });
```

### Error Toast
```javascript
toast.error("Login Failed", { autoClose: 3000 });
```

### Info Toast
```javascript
toast.info("Processing...", { autoClose: 2000 });
```

### Warning Toast
```javascript
toast.warning("Please check your input", { autoClose: 2000 });
```

---

## 🎯 **API (giống react-toastify):**

```javascript
toast.success(message, options)
toast.error(message, options)
toast.info(message, options)
toast.warning(message, options)

// Options:
{
  autoClose: 3000  // milliseconds (default: 3000)
}
```

---

## 🎨 **Custom Toast UI:**

Toast hiện tại có:
- ✅ Icon với màu sắc tương ứng (success/error/info/warning)
- ✅ Border màu bên trái
- ✅ Shadow đẹp
- ✅ Rounded corners
- ✅ Animation mượt
- ✅ Hiển thị ở top với topOffset: 60 (dưới status bar)

---

## 📱 **Toast Position:**

Mặc định: **Top** với offset 60px

Có thể customize trong `src/helpers/toast_helper.js`:
```javascript
Toast.show({
  type: 'success',
  text1: 'Thành công',
  text2: message,
  position: 'top',        // 'top' | 'bottom'
  topOffset: 60,          // Khoảng cách từ top
  visibilityTime: 3000,   // Duration
});
```

---

## 🔍 **Example Usage trong Saga:**

```javascript
import { toast } from "../../helpers/toast_helper";

function* loginUser({ payload: { user, router } }) {
  try {
    const response = yield call(postLogin, user);
    
    if (response.status === "success") {
      toast.success("Login Successfully", { autoClose: 1000 });
      router.replace("/(tabs)/dashboard");
    }
  } catch (error) {
    toast.error(error.message, { autoClose: 3000 });
  }
}
```

---

## 🎨 **Custom Toast Config:**

File `src/config/toast.config.tsx` chứa custom UI cho 4 toast types:
- ✅ Success (xanh lá) với CheckCircle icon
- ✅ Error (đỏ) với XCircle icon
- ✅ Info (xanh dương) với Info icon
- ✅ Warning (vàng cam) với AlertTriangle icon

Có thể customize thêm styles trong file này!

---

## 🚀 **Testing:**

1. ✅ App đã restart tự động
2. ✅ Reload Expo Go
3. ✅ Test login để xem toast

---

## 📚 **Tài liệu:**

- [react-native-toast-message](https://github.com/calintamas/react-native-toast-message)
- [Lucide React Native Icons](https://lucide.dev/)

---

## ✨ **Lợi ích:**

| react-toastify (Web) | react-native-toast-message (Native) |
|----------------------|--------------------------------------|
| ❌ Không hoạt động trên React Native | ✅ Native support |
| ❌ Web API (DOM) | ✅ React Native components |
| ❌ CSS styling | ✅ StyleSheet/inline styles |
| ✅ API dễ dùng | ✅ API tương tự, dễ migrate |

---

**🎉 Migration hoàn tất!** App giờ có toast notifications đẹp và mượt mà!

