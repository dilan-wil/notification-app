import { Slot, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { initializeApp } from '@react-native-firebase/app';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import {PermissionsAndroid} from 'react-native';
// Initialisation Firebase
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_PROJECT.firebaseapp.com",
//   projectId: "YOUR_PROJECT",
//   storageBucket: "YOUR_BUCKET.appspot.com",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

// const app = initializeApp(firebaseConfig);

export default function TabLayout() {
  const [fcmToken, setFcmToken] = useState(''); // État pour stocker le toke

  useEffect(() => {
    const setupNotifications = async () => {
      // Demander les permissions
      await messaging().requestPermission();
      
      // Récupérer et envoyer le token FCM
      const token = await messaging().getToken();
        console.log("FCM Token:", token);
        setFcmToken(token);
        
      setFcmToken(token); // Stocker le token dans l'état

      // await fetch('http://VOTRE_IP_NODE_RED:1880/save-token', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token })
      // });

      // Gestionnaire de notifications
      messaging().onMessage(async remoteMessage => {
        // await playAlertSound();
        await storeNotification(remoteMessage.data);
      });

      messaging().setBackgroundMessageHandler(async remoteMessage => {
        await storeNotification(remoteMessage.data);
      });
    };

    setupNotifications();
  }, []);

  // const playAlertSound = async () => {
  //   try {
  //     const { sound } = await Audio.Sound.createAsync(
  //       require('../../assets/alert.mp3')
  //     );
  //     await sound.playAsync();
  //   } catch (error) {
  //     console.error('Erreur son alerte:', error);
  //   }
  // };

  const storeNotification = async (data: any) => {
    try {
      const history = await AsyncStorage.getItem('notifications') || '[]';
      const newNotification = {
        title: data.title,
        body: data.body,
        image: data.image,
        timestamp: data.timestamp
      };
      const newHistory = [newNotification, ...JSON.parse(history)];
      await AsyncStorage.setItem('notifications', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Erreur stockage notification:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Bannière avec le token */}
      <View style={{ 
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderColor: '#ccc'
      }}>
        <Text style={{ fontSize: 12 }} numberOfLines={1} ellipsizeMode="tail">
          FCM Token: {fcmToken || 'Chargement...'}
        </Text>
      </View>

      {/* Onglets */}
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Accueil',
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explorateur',
            tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}