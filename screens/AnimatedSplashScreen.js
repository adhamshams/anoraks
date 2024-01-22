import React, { useState, useEffect } from "react";
import { Animated, StyleSheet, View, StatusBar } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { StackActions } from '@react-navigation/native';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase'

function AnimatedSplashScreen({ navigation }) {

  const opacity = useState(new Animated.Value(1))[0]
  const auth = getAuth();

  const getStartedPushAction = StackActions.replace('GetStartedScreen');
  const mainTabsPushAction = StackActions.replace('MainTabs');

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (auth.currentUser) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          setTimeout(() => {
            Animated.timing(opacity, {
              toValue: 0,
              timing: 500,
              useNativeDriver: true
            }).start(() => navigation.dispatch(mainTabsPushAction, { user: docSnap.data() }))
          }, 700)
        } catch (error) {
          setTimeout(() => {
            Animated.timing(opacity, {
              toValue: 0,
              timing: 500,
              useNativeDriver: true
            }).start(() => navigation.dispatch(getStartedPushAction))
          }, 700)
        }
      }
      else {
        setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            timing: 500,
            useNativeDriver: true
          }).start(() => navigation.dispatch(getStartedPushAction))
        }, 1700)
      }
    })
  }, [])

  return (
    <View style={styles.background}>
      <StatusBar />
      <Animated.Image
        source={require("../assets/splash.png")}
        resizeMode="contain"
        style={[
          {
            width: "100%",
            height: "100%",
            opacity
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#124c7d',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
});

export default AnimatedSplashScreen;
