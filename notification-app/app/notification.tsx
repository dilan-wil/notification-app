import { FlatList, Image, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

interface Notification {
  title: string;
  body: string;
  image?: string;
  timestamp: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      const history = await AsyncStorage.getItem('notifications');
      setNotifications(JSON.parse(history || '[]'));
    };
    loadHistory();
  }, []);

  return (
    <FlatList
      data={notifications}
      renderItem={({ item }) => (
        <View style={{ padding: 15, borderBottomWidth: 1 }}>
          <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
          <Text>{item.body}</Text>
          <Text style={{ fontSize: 12, color: 'gray' }}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
          {item.image && (
            <Image 
              source={{ uri: item.image }} 
              style={{ width: 200, height: 200, marginTop: 10 }}
            />
          )}
        </View>
      )}
      keyExtractor={(item) => item.timestamp}
    />
  );
}