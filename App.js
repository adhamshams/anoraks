import React, { useState, useEffect, useCallback } from 'react';
import { Image, LogBox, Dimensions, Easing } from "react-native";
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen'
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import AnimatedSplashScreen from './screens/AnimatedSplashScreen';
import GetStartedScreen from './screens/GetStartedScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import DestinationsListScreen from './screens/DestinationsListScreen';
import SiwaScreen from './screens/SiwaScreen';
import MoreScreen from './screens/MoreScreen';
import OurStoryScreen from './screens/OurStoryScreen';
import DigitalPassportScreen from './screens/DigitalPassportScreen';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

const { height, width } = Dimensions.get('window');

export default function App() {

  LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.'])
  LogBox.ignoreLogs(['No native ExpoFirebaseCore module found, are you sure the expo-firebase-core module is linked properly?'])

  const [appIsReady, setAppIsReady] = useState(false);

  function MainTabs({ route, navigation }) {
    return (
      <BottomTab.Navigator screenOptions={{ headerShown: true, headerStyle: { backgroundColor: '#fff', shadowColor: '#fff' }, headerTintColor: '#fff', tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#d6d8d8' }, tabBarInactiveTintColor: '#000', tabBarActiveTintColor: '#124c7d' }}>
        <BottomTab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ tintColor, focused }) => <MaterialCommunityIcons name="home" size={32} color={focused ? '#124c7d' : "black"} />, headerShown: false }} />
        <BottomTab.Screen name="Destinations" component={DestinationsListScreen} options={{ tabBarIcon: ({ tintColor, focused }) => <MaterialCommunityIcons name="map-marker-radius" size={32} color={focused ? '#124c7d' : "black"} />, headerShown: false }} />
        <BottomTab.Screen name="Our Story" component={OurStoryScreen} options={{ tabBarIcon: ({ tintColor, focused }) => <MaterialCommunityIcons name="newspaper-variant" size={25} color={focused ? '#124c7d' : "black"} />, headerShown: false }} />
        <BottomTab.Screen name="More" component={MoreScreen} options={{ tabBarIcon: ({ tintColor, focused }) => <FontAwesome name="bars" size={25} color={focused ? '#124c7d' : "black"} />, headerShown: false }} />
      </BottomTab.Navigator>
    );
  }

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load assets, make any API calls you need to do here
        let images = [
          require('./assets/splash.png'),
          require('./assets/slide1.jpg'),
          require('./assets/slide2.jpg'),
          require('./assets/slide3.jpg'),
          require('./assets/content-creator.jpg'),
          require('./assets/investor.jpg'),
          require('./assets/organizer.jpg'),
          require('./assets/black-and-white-desert.jpg'),
          require('./assets/siwa.jpg'),
          require('./assets/luxor-and-aswan.jpg'),
          require('./assets/marsa-alam.jpg'),
          require('./assets/personalize-trip.jpg'),
        ]

        let fonts = [
        ]

        const imageAssets = images.map((image) => {
          if (typeof image == "string") {
            return Image.prefetch(image);
          } else {
            return Asset.fromModule(image).downloadAsync();
          }
        });

        const fontAssets = fonts.map(font => Font.loadAsync(font));

        await Promise.all(imageAssets);
        await Promise.all(fontAssets);
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer onLayout={onLayoutRootView}>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#193657', shadowColor: '#100505' }, headerTintColor: '#fff', headerBackTitleVisible: false }}>
        <Stack.Screen name="AnimatedSplashScreen" component={AnimatedSplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GetStartedScreen" component={GetStartedScreen} options={{ headerShown: false, animationEnabled: false, gestureEnabled: false }} />
        <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name='SignUpScreen' component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false, gestureEnabled: false, animationEnabled: false }} />
        <Stack.Screen name="SiwaScreen" component={SiwaScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DigitalPassportScreen" component={DigitalPassportScreen} options={{ headerTitle: 'Digital Passport' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
