import 'react-native-gesture-handler';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '../src/store/index_native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../src/config/toast.config';
import { ThemeProvider } from '../src/context/ThemeContext';
import '../global.css';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();
const store = configureStore();

function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const [authUser, setAuthUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = setTimeout(() => {
      setIsNavigationReady(true);
    }, 100);

    return () => clearTimeout(unsubscribe);
  }, []);

  // Check AsyncStorage for authUser
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await AsyncStorage.getItem('authUser');
        setAuthUser(user ? JSON.parse(user) : null);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Poll for auth changes every 500ms when in auth screens
    const interval = setInterval(checkAuth, 500);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isNavigationReady || isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!authUser && !inAuthGroup) {
      // Redirect to the login page if user is not authenticated
      router.replace('/login');
    } else if (authUser && inAuthGroup) {
      // Redirect away from the login page if user is authenticated
      router.replace('/(tabs)/dashboard');
    }
  }, [authUser, segments, isNavigationReady, isLoading]);
}

export default function RootLayout() {
  useProtectedRoute();

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </SafeAreaProvider>
          </GestureHandlerRootView>
          <Toast config={toastConfig} />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
