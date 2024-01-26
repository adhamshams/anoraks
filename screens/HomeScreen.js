import React, { useState, useEffect } from "react";
import { StyleSheet, View, StatusBar, SafeAreaView, Image, Text, ScrollView, TouchableOpacity, Dimensions, ImageBackground, BackHandler } from "react-native";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

function HomeScreen({ navigation }) {

  var today = new Date();
  var hour = today.getHours()

  const [time, setTime] = useState()

  const auth = getAuth();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [])

  useEffect(() => {
    if (hour < 12) {
      setTime('morning')
    } else if (hour < 18) {
      setTime('afternoon')
    } else {
      setTime('evening')
    }
  }, []);

  return (
    <SafeAreaView style={styles.background}>
      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
});

export default HomeScreen;