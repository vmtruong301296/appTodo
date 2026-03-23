import { View, Text, Pressable, ScrollView, Alert, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutUser } from "../../src/store/actions";
import { Image } from "expo-image";
import { useTheme } from "../../src/context/ThemeContext";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Edit3,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Moon,
  Sun
} from "lucide-react-native";

const ProfileItem = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  onPress, 
  showArrow = true 
}: {
  icon: any;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
}) => {
  const { colors } = useTheme();
  
  return (
    <Pressable 
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }}
    >
      <View style={{ width: 40, height: 40, backgroundColor: colors.surface, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
        <Icon size={20} color={colors.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }}>{title}</Text>
        {subtitle && (
          <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4 }}>{subtitle}</Text>
        )}
      </View>
      {showArrow && (
        <ChevronRight size={16} color={colors.textSecondary} />
      )}
    </Pressable>
  );
};

const StatCard = ({ title, value, color }: {
  title: string;
  value: string;
  color: string;
}) => {
  const { colors } = useTheme();
  
  return (
    <View style={{ 
      backgroundColor: colors.card, 
      borderRadius: 16, 
      padding: 16, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.06, 
      shadowRadius: 8, 
      elevation: 3, 
      flex: 1, 
      marginHorizontal: 6,
      borderWidth: 1,
      borderColor: colors.border
    }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color }}>{value}</Text>
      <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4 }}>{title}</Text>
    </View>
  );
};

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { theme, toggleTheme, colors } = useTheme();
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
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Đăng xuất", 
          style: "destructive",
          onPress: () => dispatch(logoutUser(router))
        }
      ]
    );
  };

  const handleEditProfile = () => {
    console.log("Edit profile");
  };

  const handleSettings = () => {
    console.log("Settings");
  };

  const handleNotifications = () => {
    console.log("Notifications");
  };

  const handleSecurity = () => {
    console.log("Security");
  };

  const handleHelp = () => {
    console.log("Help");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ backgroundColor: colors.card, paddingHorizontal: 16, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>Hồ sơ</Text>
            <Pressable 
              onPress={handleEditProfile}
              style={{ padding: 8, backgroundColor: '#eff6ff', borderRadius: 8 }}
            >
              <Edit3 size={16} color="#3b82f6" />
            </Pressable>
          </View>

          {/* User Info */}
          <View style={{ alignItems: 'center' }}>
            <View style={{ position: 'relative', marginBottom: 16 }}>
              <View style={{ 
                width: 80, 
                height: 80, 
                borderRadius: 40, 
                backgroundColor: '#3b82f6',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>
                  {user?.firstName?.charAt(0) || 'U'}
                </Text>
              </View>
              <View style={{ position: 'absolute', bottom: -4, right: -4, width: 24, height: 24, backgroundColor: '#10b981', borderRadius: 12, borderWidth: 2, borderColor: 'white' }} />
            </View>
            
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 4 }}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={{ color: colors.textSecondary, marginBottom: 8, fontSize: 14 }}>{user?.userEmail}</Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
              <Award size={14} color="#3b82f6" />
              <Text style={{ color: '#3b82f6', fontWeight: '600', marginLeft: 6, fontSize: 13 }}>
                {user?.userActive === 1 ? 'Active User' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>Thống kê</Text>
          <View style={{ flexDirection: 'row', marginBottom: 12, marginHorizontal: -6 }}>
            <StatCard
              title="Đơn hàng xử lý"
              value="1,234"
              color="#3b82f6"
            />
            <StatCard
              title="Khách hàng"
              value="856"
              color="#10b981"
            />
          </View>
          <View style={{ flexDirection: 'row', marginHorizontal: -6 }}>
            <StatCard
              title="Doanh thu"
              value="₫125M"
              color="#8b5cf6"
            />
            <StatCard
              title="Đánh giá"
              value="4.8★"
              color="#f59e0b"
            />
          </View>
        </View>

        {/* Contact Info */}
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>Thông tin liên hệ</Text>
          <View style={{ backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 }}>
            <ProfileItem
              icon={Mail}
              title="Email"
              subtitle={user?.userEmail}
              onPress={() => {}}
            />
            <ProfileItem
              icon={Phone}
              title="Số điện thoại"
              subtitle="+84 123 456 789"
              onPress={() => {}}
            />
            <ProfileItem
              icon={MapPin}
              title="Địa chỉ"
              subtitle="123 Đường ABC, Quận 1, TP.HCM"
              onPress={() => {}}
            />
            <ProfileItem
              icon={Calendar}
              title="User ID"
              subtitle={user?.userId || 'N/A'}
              onPress={() => {}}
              showArrow={false}
            />
          </View>
        </View>

        {/* Settings */}
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>Cài đặt</Text>
          <View style={{ backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 }}>
            {/* Theme Toggle */}
            <Pressable 
              onPress={toggleTheme}
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }}
            >
              <View style={{ width: 40, height: 40, backgroundColor: theme === 'dark' ? '#1e293b' : '#fef3c7', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                {theme === 'dark' ? (
                  <Moon size={20} color="#fbbf24" />
                ) : (
                  <Sun size={20} color="#f59e0b" />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }}>
                  Giao diện {theme === 'dark' ? 'Tối' : 'Sáng'}
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4 }}>
                  Chuyển đổi chế độ hiển thị
                </Text>
              </View>
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: '#d1d5db', true: '#60a5fa' }}
                thumbColor={theme === 'dark' ? '#f1f5f9' : '#ffffff'}
                ios_backgroundColor="#d1d5db"
              />
            </Pressable>
            
            <ProfileItem
              icon={Settings}
              title="Cài đặt chung"
              subtitle="Ngôn ngữ, múi giờ, hiển thị"
              onPress={handleSettings}
            />
            <ProfileItem
              icon={Bell}
              title="Thông báo"
              subtitle="Quản lý thông báo và cảnh báo"
              onPress={handleNotifications}
            />
            <ProfileItem
              icon={Shield}
              title="Bảo mật"
              subtitle="Mật khẩu, xác thực 2 bước"
              onPress={handleSecurity}
            />
            <ProfileItem
              icon={HelpCircle}
              title="Trợ giúp & Hỗ trợ"
              subtitle="FAQ, liên hệ hỗ trợ"
              onPress={handleHelp}
            />
          </View>
        </View>

        {/* Logout */}
        <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
          <Pressable 
            onPress={handleLogout}
            style={{ backgroundColor: 'white', borderRadius: 16, borderWidth: 1.5, borderColor: '#fecaca', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 }}>
              <View style={{ width: 40, height: 40, backgroundColor: '#fee2e2', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <LogOut size={20} color="#ef4444" />
              </View>
              <Text style={{ color: '#ef4444', fontWeight: '600', flex: 1, fontSize: 15 }}>Đăng xuất</Text>
            </View>
          </Pressable>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </View>
  );
}
