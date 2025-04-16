import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { Audio } from 'expo-av';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  useEffect(() => {
    const setup = async () => {
      // Request permissions
      await messaging().requestPermission();
      
      // Get and send FCM token
      const token = await messaging().getToken();
      console.log(token)
      // await fetch('http://YOUR_NODE_RED_IP:1880/save-token', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token })
      // });

      // Notification handlers
      messaging().onMessage(async remoteMessage => {
        // await playAlertSound();
        await storeNotification(remoteMessage.data);
      });

      messaging().setBackgroundMessageHandler(async remoteMessage => {
        await storeNotification(remoteMessage.data);
      });
    };

    setup();
  }, []);

  const playAlertSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/alert.mp3')
    );
    await sound.playAsync();
  };

  const storeNotification = async (data: any) => {
    const history = await AsyncStorage.getItem('notifications') || '[]';
    const newNotification = {
      title: data.title,
      body: data.body,
      image: data.image,
      timestamp: data.timestamp
    };
    const newHistory = [newNotification, ...JSON.parse(history)];
    await AsyncStorage.setItem('notifications', JSON.stringify(newHistory));
  };

  return <Slot />;
}