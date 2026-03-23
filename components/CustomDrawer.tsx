import { View, Text, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutUser } from '../src/store/actions';
import { 
  LayoutDashboard,
  Package,
  ShoppingCart,
  User,
  Settings,
  LogOut,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export function CustomDrawerContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const authUser = await AsyncStorage.getItem('authUser');
        if (authUser) {
          const parsed = JSON.parse(authUser);
          setUser(parsed.data);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser(router));
  };

  const menuItems = [
    { 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      route: '/(tabs)/dashboard' 
    },
    { 
      label: 'Sản phẩm', 
      icon: Package, 
      route: '/(tabs)/products' 
    },
    { 
      label: 'Đơn hàng', 
      icon: ShoppingCart, 
      route: '/(tabs)/orders' 
    },
    { 
      label: 'Hồ sơ', 
      icon: User, 
      route: '/(tabs)/profile' 
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView style={{ flex: 1 }}>
        {/* User Profile Section */}
        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ 
              width: 50, 
              height: 50, 
              borderRadius: 25, 
              backgroundColor: '#3b82f6',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                {user?.firstName?.charAt(0) || 'U'}
              </Text>
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={{ fontSize: 14, color: '#6b7280' }}>
                {user?.userEmail}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <View style={{ 
                  width: 8, 
                  height: 8, 
                  backgroundColor: '#10b981', 
                  borderRadius: 4, 
                  marginRight: 8 
                }} />
                <Text style={{ fontSize: 12, color: '#10b981', fontWeight: '500' }}>
                  {user?.userActive === 1 ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Navigation Items */}
        <View style={{ paddingVertical: 8 }}>
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Pressable
                key={index}
                onPress={() => router.push(item.route as any)}
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  paddingHorizontal: 16, 
                  paddingVertical: 12 
                }}
              >
                <View style={{ 
                  width: 40, 
                  height: 40, 
                  backgroundColor: '#f3f4f6', 
                  borderRadius: 20, 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: 12
                }}>
                  <IconComponent size={20} color="#6b7280" />
                </View>
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: '500', 
                  color: '#374151',
                  flex: 1
                }}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Divider */}
        <View style={{ 
          height: 1, 
          backgroundColor: '#e5e7eb', 
          marginHorizontal: 16, 
          marginVertical: 8 
        }} />

        {/* Settings */}
        <View style={{ paddingVertical: 8 }}>
          <Pressable
            style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              paddingHorizontal: 16, 
              paddingVertical: 12 
            }}
          >
            <View style={{ 
              width: 40, 
              height: 40, 
              backgroundColor: '#f3f4f6', 
              borderRadius: 20, 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: 12
            }}>
              <Settings size={20} color="#6b7280" />
            </View>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '500', 
              color: '#374151',
              flex: 1
            }}>
              Cài đặt
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Logout Button */}
      <View style={{ 
        borderTopWidth: 1, 
        borderTopColor: '#f3f4f6', 
        padding: 16 
      }}>
        <Pressable 
          onPress={handleLogout}
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            paddingHorizontal: 16, 
            paddingVertical: 12, 
            backgroundColor: '#fef2f2', 
            borderRadius: 8 
          }}
        >
          <LogOut size={20} color="#ef4444" />
          <Text style={{ 
            color: '#ef4444', 
            fontWeight: '500', 
            marginLeft: 12 
          }}>
            Đăng xuất
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
