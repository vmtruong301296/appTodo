import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useTheme } from "../../src/context/ThemeContext";
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck,
  Package,
  Eye,
  MoreVertical
} from "lucide-react-native";

type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';

type Order = {
  id: string;
  customerName: string;
  items: number;
  total: number;
  status: OrderStatus;
  date: string;
  address: string;
};

const mockOrders: Order[] = [
  {
    id: "#ORD-001",
    customerName: "Nguyễn Văn A",
    items: 3,
    total: 1250000,
    status: "pending",
    date: "2024-10-01",
    address: "123 Đường ABC, Quận 1, TP.HCM"
  },
  {
    id: "#ORD-002", 
    customerName: "Trần Thị B",
    items: 1,
    total: 850000,
    status: "confirmed",
    date: "2024-10-01",
    address: "456 Đường XYZ, Quận 3, TP.HCM"
  },
  {
    id: "#ORD-003",
    customerName: "Lê Văn C", 
    items: 2,
    total: 2100000,
    status: "shipping",
    date: "2024-09-30",
    address: "789 Đường DEF, Quận 7, TP.HCM"
  },
  {
    id: "#ORD-004",
    customerName: "Phạm Thị D",
    items: 4,
    total: 3200000,
    status: "delivered",
    date: "2024-09-29",
    address: "321 Đường GHI, Quận 2, TP.HCM"
  },
  {
    id: "#ORD-005",
    customerName: "Hoàng Văn E",
    items: 1,
    total: 450000,
    status: "cancelled",
    date: "2024-09-28",
    address: "654 Đường JKL, Quận 5, TP.HCM"
  }
];

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return { 
          text: 'Chờ xử lý', 
          bgColor: '#fef3c7', 
          textColor: '#92400e',
          icon: Clock 
        };
      case 'confirmed':
        return { 
          text: 'Đã xác nhận', 
          bgColor: '#dbeafe', 
          textColor: '#1e40af',
          icon: CheckCircle 
        };
      case 'shipping':
        return { 
          text: 'Đang giao', 
          bgColor: '#f3e8ff', 
          textColor: '#6b21a8',
          icon: Truck 
        };
      case 'delivered':
        return { 
          text: 'Đã giao', 
          bgColor: '#d1fae5', 
          textColor: '#065f46',
          icon: Package 
        };
      case 'cancelled':
        return { 
          text: 'Đã hủy', 
          bgColor: '#fee2e2', 
          textColor: '#991b1b',
          icon: XCircle 
        };
      default:
        return { 
          text: 'Không xác định', 
          bgColor: '#f3f4f6', 
          textColor: '#374151',
          icon: Clock 
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <View style={{ 
      flexDirection: 'row', 
      alignItems: 'center', 
      paddingHorizontal: 8, 
      paddingVertical: 4, 
      borderRadius: 12,
      backgroundColor: config.bgColor,
      marginLeft: 8
    }}>
      <Icon size={12} color={config.textColor} />
      <Text style={{ 
        fontSize: 11, 
        fontWeight: '600', 
        marginLeft: 4,
        color: config.textColor
      }}>
        {config.text}
      </Text>
    </View>
  );
};

const OrderCard = ({ order }: { order: Order }) => {
  const { colors } = useTheme();
  
  return (
    <View style={{
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border
    }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>{order.id}</Text>
        <StatusBadge status={order.status} />
      </View>
      <Pressable style={{ padding: 4 }}>
        <MoreVertical size={16} color={colors.textSecondary} />
      </Pressable>
    </View>

    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: colors.text, fontWeight: '600', fontSize: 15 }}>{order.customerName}</Text>
      <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }} numberOfLines={1}>
        {order.address}
      </Text>
    </View>

    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 13, color: colors.textSecondary }}>{order.items} sản phẩm</Text>
        <View style={{ width: 4, height: 4, backgroundColor: colors.textSecondary, borderRadius: 2, marginHorizontal: 8 }} />
        <Text style={{ fontSize: 13, color: colors.textSecondary }}>{order.date}</Text>
      </View>
      <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#10b981' }}>
        ₫{order.total.toLocaleString()}
      </Text>
    </View>

    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
      <Pressable style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#eff6ff', borderRadius: 8 }}>
        <Eye size={14} color="#3b82f6" />
        <Text style={{ color: '#3b82f6', fontWeight: '600', marginLeft: 4, fontSize: 13 }}>Chi tiết</Text>
      </Pressable>
      
      {order.status === 'pending' && (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#d1fae5', borderRadius: 8 }}>
            <Text style={{ color: '#059669', fontWeight: '600', fontSize: 13 }}>Xác nhận</Text>
          </Pressable>
          <Pressable style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fee2e2', borderRadius: 8 }}>
            <Text style={{ color: '#dc2626', fontWeight: '600', fontSize: 13 }}>Hủy</Text>
          </Pressable>
        </View>
      )}
      
      {order.status === 'confirmed' && (
        <Pressable style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#f3e8ff', borderRadius: 8 }}>
          <Text style={{ color: '#7c3aed', fontWeight: '600', fontSize: 13 }}>Giao hàng</Text>
        </Pressable>
      )}
    </View>
  </View>
  );
};

const StatusFilter = ({ 
  activeStatus, 
  onStatusChange 
}: { 
  activeStatus: OrderStatus | 'all';
  onStatusChange: (status: OrderStatus | 'all') => void;
}) => {
  const { colors } = useTheme();
  const statuses: Array<{ key: OrderStatus | 'all'; label: string; count: number }> = [
    { key: 'all', label: 'Tất cả', count: mockOrders.length },
    { key: 'pending', label: 'Chờ xử lý', count: mockOrders.filter(o => o.status === 'pending').length },
    { key: 'confirmed', label: 'Đã xác nhận', count: mockOrders.filter(o => o.status === 'confirmed').length },
    { key: 'shipping', label: 'Đang giao', count: mockOrders.filter(o => o.status === 'shipping').length },
    { key: 'delivered', label: 'Đã giao', count: mockOrders.filter(o => o.status === 'delivered').length },
  ];

  return (
    <View style={{ height: 48 }}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingRight: 16, alignItems: 'center', height: 48 }}
      >
        {statuses.map((status) => (
          <Pressable
            key={status.key}
            onPress={() => onStatusChange(status.key)}
            style={{
              marginRight: 8,
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderRadius: 18,
              borderWidth: 1.5,
              backgroundColor: activeStatus === status.key ? '#3b82f6' : colors.card,
              borderColor: activeStatus === status.key ? '#3b82f6' : colors.border,
              height: 32
            }}
          >
            <Text style={{
              fontWeight: '600',
              fontSize: 12,
              color: activeStatus === status.key ? 'white' : colors.text,
              lineHeight: 16
            }}>
              {status.label} ({status.count})
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default function Orders() {
  const { colors } = useTheme();
  const [activeStatus, setActiveStatus] = useState<OrderStatus | 'all'>('all');

  const filteredOrders = activeStatus === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === activeStatus);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header with Stats */}
      <View style={{ backgroundColor: colors.card, paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>Đơn hàng</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Pressable style={{ padding: 8, backgroundColor: colors.surface, borderRadius: 8 }}>
              <Search size={18} color={colors.textSecondary} />
            </Pressable>
            <Pressable style={{ padding: 8, backgroundColor: colors.surface, borderRadius: 8 }}>
              <Filter size={18} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.surface, borderRadius: 12, padding: 16 }}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.text }}>{mockOrders.length}</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>Tổng đơn</Text>
          </View>
          <View style={{ width: 1, backgroundColor: colors.border }} />
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#10b981' }}>
              ₫{(mockOrders.reduce((sum, order) => sum + order.total, 0) / 1000000).toFixed(1)}M
            </Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>Tổng giá trị</Text>
          </View>
          <View style={{ width: 1, backgroundColor: colors.border }} />
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#3b82f6' }}>
              {mockOrders.filter(o => o.status === 'pending').length}
            </Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>Chờ xử lý</Text>
          </View>
        </View>
      </View>

      {/* Status Filter */}
      <StatusFilter 
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
      />

      {/* Orders List */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingVertical: 8 }}>
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </View>
        <View style={{ height: 16 }} />
      </ScrollView>
    </View>
  );
}
