import { View, Text, Pressable, TextInput } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useTheme } from "../../src/context/ThemeContext";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2,
  Star,
  DollarSign
} from "lucide-react-native";

type Product = { 
  id: string; 
  title: string; 
  thumbnail: string; 
  price: number;
  category: string;
  rating: number;
  stock: number;
};

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("https://dummyjson.com/products?limit=30");
  const json = await res.json();
  return json.products.map((p: any) => ({
    id: String(p.id),
    title: p.title,
    thumbnail: p.thumbnail,
    price: p.price,
    category: p.category,
    rating: p.rating,
    stock: p.stock,
  }));
}

const ProductCard = ({ item, onEdit, onDelete }: { 
  item: Product; 
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
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
    <View style={{ flexDirection: 'row' }}>
      <Image 
        source={{ uri: item.thumbnail }} 
        style={{ width: 80, height: 80, borderRadius: 12 }} 
        transition={200} 
        contentFit="cover" 
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 4 }} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 8 }}>{item.category}</Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Star size={14} color="#fbbf24" fill="#fbbf24" />
              <Text style={{ fontSize: 13, color: '#374151', marginLeft: 4 }}>{item.rating.toFixed(1)}</Text>
              <Text style={{ fontSize: 13, color: '#9ca3af', marginLeft: 8 }}>Kho: {item.stock}</Text>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <DollarSign size={16} color="#10b981" />
                <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#10b981' }}>{item.price}</Text>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Pressable 
                  onPress={() => onEdit(item.id)}
                  style={{ padding: 8, backgroundColor: '#eff6ff', borderRadius: 8 }}
                >
                  <Edit3 size={16} color="#3b82f6" />
                </Pressable>
                <Pressable 
                  onPress={() => onDelete(item.id)}
                  style={{ padding: 8, backgroundColor: '#fef2f2', borderRadius: 8 }}
                >
                  <Trash2 size={16} color="#ef4444" />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  </View>
  );
};

export default function Products() {
  const { colors } = useTheme();
  const { data = [], isLoading } = useQuery({ 
    queryKey: ["products"], 
    queryFn: fetchProducts 
  });
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = data.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    console.log("Edit product:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete product:", id);
  };

  const handleAddProduct = () => {
    console.log("Add new product");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Search and Filter */}
      <View style={{ backgroundColor: colors.card, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 }}>
            <Search size={18} color={colors.textSecondary} />
            <TextInput
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ flex: 1, marginLeft: 8, fontSize: 15, color: colors.text }}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <Pressable 
            onPress={handleAddProduct}
            style={{ marginLeft: 8, backgroundColor: '#3b82f6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center' }}
          >
            <Plus size={18} color="white" />
            <Text style={{ color: 'white', fontWeight: '600', marginLeft: 4, fontSize: 14 }}>Thêm</Text>
          </Pressable>
        </View>
      </View>

      {/* Stats */}
      <View style={{ backgroundColor: colors.card, marginHorizontal: 16, marginTop: 16, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: colors.border }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text }}>{data.length}</Text>
            <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>Tổng sản phẩm</Text>
          </View>
          <View style={{ width: 1, backgroundColor: colors.border }} />
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#10b981' }}>
              {data.reduce((sum, p) => sum + p.stock, 0)}
            </Text>
            <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>Tồn kho</Text>
          </View>
          <View style={{ width: 1, backgroundColor: colors.border }} />
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#3b82f6' }}>
              {new Set(data.map(p => p.category)).size}
            </Text>
            <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>Danh mục</Text>
          </View>
        </View>
      </View>

      {/* Product List */}
      <View style={{ flex: 1, marginTop: 16 }}>
        <FlashList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          refreshing={isLoading}
          renderItem={({ item }) => (
            <ProductCard 
              item={item} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
}
