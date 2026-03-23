import Toast from 'react-native-toast-message';

/**
 * React Native Toast Message helper
 * Thay thế cho react-toastify (web)
 */

export const toast = {
  success: (message, options = {}) => {
    Toast.show({
      type: 'success',
      text1: 'Thành công',
      text2: message,
      position: 'top',
      visibilityTime: options.autoClose || 3000,
      autoHide: true,
      topOffset: 60,
    });
  },
  
  error: (message, options = {}) => {
    Toast.show({
      type: 'error',
      text1: 'Lỗi',
      text2: message,
      position: 'top',
      visibilityTime: options.autoClose || 3000,
      autoHide: true,
      topOffset: 60,
    });
  },
  
  info: (message, options = {}) => {
    Toast.show({
      type: 'info',
      text1: 'Thông báo',
      text2: message,
      position: 'top',
      visibilityTime: options.autoClose || 3000,
      autoHide: true,
      topOffset: 60,
    });
  },
  
  warning: (message, options = {}) => {
    Toast.show({
      type: 'warning',
      text1: 'Cảnh báo',
      text2: message,
      position: 'top',
      visibilityTime: options.autoClose || 3000,
      autoHide: true,
      topOffset: 60,
    });
  },
};

