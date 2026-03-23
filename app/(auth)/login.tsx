import { View, TextInput, Text, Pressable, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { loginUser, apiError as resetApiError } from '../../src/store/actions';
import { toast } from '../../src/helpers/toast_helper';

const schema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập hoặc email'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});
type Form = z.infer<typeof schema>;

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Get Redux state with shallowEqual to prevent unnecessary re-renders
  const { loading, error, user } = useSelector((state: any) => ({
    loading: state.Login.loading,
    error: state.Login.error,
    user: state.Login.user,
  }), shallowEqual);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } =
    useForm<Form>({ resolver: zodResolver(schema) });

  // Navigation is handled by saga after successful login

  // Display error if any
  useEffect(() => {
    if (error) {
      toast.error(error, { autoClose: 3000 });
      // Reset error after showing
      setTimeout(() => {
        dispatch(resetApiError(''));
      }, 3000);
    }
  }, [error]);

  const onSubmit = async (data: Form) => {
    // Dispatch Redux action
    dispatch(loginUser(data, router));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 32, justifyContent: 'center' }}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <View style={{ 
              width: 80, 
              height: 80, 
              backgroundColor: '#2563eb', 
              borderRadius: 40, 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: 16,
              shadowColor: '#2563eb',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8
            }}>
              <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>👋</Text>
            </View>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 8, textAlign: 'center' }}>
              Chào mừng trở lại!
            </Text>
            <Text style={{ color: '#6b7280', textAlign: 'center', fontSize: 16, lineHeight: 24 }}>
              Đăng nhập để tiếp tục sử dụng ứng dụng
            </Text>
          </View>


          {/* Form */}
          <View style={{ gap: 16 }}>
            <View>
              <Text style={{ color: '#374151', fontWeight: '500', marginBottom: 8, fontSize: 16 }}>
                Tên đăng nhập / Email
              </Text>
              <TextInput
                style={{ 
                  backgroundColor: 'white', 
                  borderWidth: 1, 
                  borderColor: '#e5e7eb', 
                  borderRadius: 12, 
                  paddingHorizontal: 16, 
                  paddingVertical: 16, 
                  fontSize: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 2
                }}
                placeholder="Nhập tên đăng nhập hoặc email"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                blurOnSubmit={false}
                onChangeText={(t) => setValue('username', t, { shouldValidate: true })}
                {...register('username')}
              />
              {errors.username && (
                <Text style={{ color: '#ef4444', fontSize: 14, marginTop: 4, marginLeft: 4 }}>
                  {errors.username.message}
                </Text>
              )}
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#374151', fontWeight: '500', marginBottom: 8, fontSize: 16 }}>
                Mật khẩu
              </Text>
              <TextInput
                style={{ 
                  backgroundColor: 'white', 
                  borderWidth: 1, 
                  borderColor: '#e5e7eb', 
                  borderRadius: 12, 
                  paddingHorizontal: 16, 
                  paddingVertical: 16, 
                  fontSize: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 2
                }}
                placeholder="Nhập mật khẩu của bạn"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
                onChangeText={(t) => setValue('password', t, { shouldValidate: true })}
                {...register('password')}
              />
              {errors.password && (
                <Text style={{ color: '#ef4444', fontSize: 14, marginTop: 4, marginLeft: 4 }}>
                  {errors.password.message}
                </Text>
              )}
            </View>

            <Pressable
              disabled={isSubmitting || loading}
              onPress={handleSubmit(onSubmit)}
              style={({ pressed }) => ({
                backgroundColor: (isSubmitting || loading || pressed) ? '#1d4ed8' : '#2563eb',
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center',
                marginTop: 16,
                shadowColor: '#2563eb',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
                opacity: (isSubmitting || loading) ? 0.7 : 1,
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8
              })}
            >
              {(isSubmitting || loading) && (
                <ActivityIndicator color="white" />
              )}
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 18 }}>
                {(isSubmitting || loading) ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View style={{ alignItems: 'center', marginTop: 32 }}>
            <Text style={{ color: '#6b7280', fontSize: 14 }}>
              Chưa có tài khoản?{' '}
              <Text style={{ color: '#2563eb', fontWeight: '500' }}>Đăng ký ngay</Text>
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
