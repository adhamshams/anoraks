import React, { useState, useEffect, useCallback } from 'react';
import { Image, LogBox } from "react-native";
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AnimatedSplashScreen from './screens/AnimatedSplashScreen';
import GetStartedScreen from './screens/GetStartedScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

export default function App() {

  LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.'])
  LogBox.ignoreLogs(['No native ExpoFirebaseCore module found, are you sure the expo-firebase-core module is linked properly?'])

  const [appIsReady, setAppIsReady] = useState(false);

  function MainTabs({route, navigation}) {
    return (
      <BottomTab.Navigator screenOptions={{headerShown: true, headerStyle: {backgroundColor: '#151010', shadowColor: '#100505'}, headerTintColor: '#eeebdd', tabBarStyle: {backgroundColor: '#151010', borderTopColor: '#393939'}, tabBarInactiveTintColor: '#eeebdd', tabBarActiveTintColor: '#ce1212' }}>
        <BottomTab.Screen name="Home" options={{tabBarIcon: ({tintColor, focused}) => <Image source={focused ? require("./assets/homeS.png") : require("./assets/home.png")} style={{width: 25, height: 25}}/>, headerShown: false}}>
          {() => <HomeScreen user={route.params.user} navigation={navigation} />}
        </BottomTab.Screen>
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
          require('./assets/home.png'),
          require('./assets/homeS.png'),
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
      <Stack.Navigator screenOptions={{headerStyle: {backgroundColor: '#193657', shadowColor: '#100505'}, headerTintColor: '#fff', headerBackTitleVisible: false}}>
        <Stack.Screen name="AnimatedSplashScreen" component={AnimatedSplashScreen} options={{headerShown: false}}/>
        <Stack.Screen name="GetStartedScreen" component={GetStartedScreen} options={{headerShown: false, animationEnabled: false, gestureEnabled: false}}/>
        <Stack.Screen name='LoginScreen' component={LoginScreen} options={{headerShown: false}}/>
        <Stack.Screen name='SignUpScreen' component={SignUpScreen} options={{headerShown: false}}/>
        <Stack.Screen name="MainTabs" component={MainTabs} options={{headerShown: false, gestureEnabled: false, animationEnabled: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
