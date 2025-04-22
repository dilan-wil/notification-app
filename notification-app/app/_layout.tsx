import { Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Platform, Text, ScrollView } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Required: Handler that shows alerts for received notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        if (!Device.isDevice) {
          setError('Notifications require a physical device.');
          return;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          setError('Notification permissions not granted');
          return;
        }

        const tokenData = await Notifications.getExpoPushTokenAsync();
        console.log('Expo Push Token:', tokenData.data);
        setExpoPushToken(tokenData.data);

        const foregroundSub = Notifications.addNotificationReceivedListener(notification => {
          console.log('Foreground notification:', notification);
          storeNotification(notification.request.content);
        });

        const responseSub = Notifications.addNotificationResponseReceivedListener(response => {
          console.log('Notification tapped:', response);
        });

        return () => {
          foregroundSub.remove();
          responseSub.remove();
        };
      } catch (err: any) {
        console.error('Notification setup error:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setIsReady(true);
      }
    };

    setupNotifications();
  }, []);

  const storeNotification = async (content: any) => {
    try {
      const history = await AsyncStorage.getItem('notifications') || '[]';
      const newNotification = {
        title: content.title,
        body: content.body,
        data: content.data || null,
        timestamp: new Date().toISOString()
      };
      const newHistory = [newNotification, ...JSON.parse(history)];
      await AsyncStorage.setItem('notifications', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Storage error:', error);
    }
  };

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
      {error ? (
        <Text style={{ color: 'red', textAlign: 'center', marginBottom: 20 }}>{error}</Text>
      ) : null}
      {expoPushToken ? (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Expo Push Token:</Text>
          <Text
            selectable
            style={{
              textAlign: 'center',
              color: '#333',
              fontSize: 12,
              marginTop: 5,
              paddingHorizontal: 10,
            }}
          >
            {expoPushToken}
          </Text>
        </View>
      ) : null}
      <Slot />
    </ScrollView>
  );
}
