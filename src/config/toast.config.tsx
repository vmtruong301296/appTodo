import React from 'react';
import { View, Text } from 'react-native';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react-native';

/**
 * Custom Toast Config for react-native-toast-message
 * Provides beautiful, modern toast notifications
 */

export const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      shadowColor: '#10b981',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
      borderLeftWidth: 4,
      borderLeftColor: '#10b981',
    }}>
      <View style={{
        width: 40,
        height: 40,
        backgroundColor: '#d1fae5',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
      }}>
        <CheckCircle size={22} color="#10b981" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 2 }}>
          {text1}
        </Text>
        {text2 && (
          <Text style={{ fontSize: 13, color: '#6b7280' }}>
            {text2}
          </Text>
        )}
      </View>
    </View>
  ),

  error: ({ text1, text2 }: any) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      shadowColor: '#ef4444',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
      borderLeftWidth: 4,
      borderLeftColor: '#ef4444',
    }}>
      <View style={{
        width: 40,
        height: 40,
        backgroundColor: '#fee2e2',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
      }}>
        <XCircle size={22} color="#ef4444" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 2 }}>
          {text1}
        </Text>
        {text2 && (
          <Text style={{ fontSize: 13, color: '#6b7280' }}>
            {text2}
          </Text>
        )}
      </View>
    </View>
  ),

  info: ({ text1, text2 }: any) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      shadowColor: '#3b82f6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
      borderLeftWidth: 4,
      borderLeftColor: '#3b82f6',
    }}>
      <View style={{
        width: 40,
        height: 40,
        backgroundColor: '#dbeafe',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
      }}>
        <Info size={22} color="#3b82f6" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 2 }}>
          {text1}
        </Text>
        {text2 && (
          <Text style={{ fontSize: 13, color: '#6b7280' }}>
            {text2}
          </Text>
        )}
      </View>
    </View>
  ),

  warning: ({ text1, text2 }: any) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      shadowColor: '#f59e0b',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
      borderLeftWidth: 4,
      borderLeftColor: '#f59e0b',
    }}>
      <View style={{
        width: 40,
        height: 40,
        backgroundColor: '#fef3c7',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
      }}>
        <AlertTriangle size={22} color="#f59e0b" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 2 }}>
          {text1}
        </Text>
        {text2 && (
          <Text style={{ fontSize: 13, color: '#6b7280' }}>
            {text2}
          </Text>
        )}
      </View>
    </View>
  ),
};

