import React, {useState, useEffect} from "react";
import {StyleSheet, View, StatusBar, SafeAreaView, Image, Text, ScrollView, TouchableOpacity, Dimensions, ImageBackground, BackHandler} from "react-native";
import { getAuth } from "firebase/auth";
import {doc, onSnapshot} from 'firebase/firestore'
import { db } from '../firebase'

function HomeScreen({navigation, user}) {

    var today = new Date();
    var hour = today.getHours()

    const [time, setTime] = useState()

    const auth = getAuth();
    const [userData, setUserData] = useState(user)

    useEffect(() => {
      const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
        setUserData(doc.data())
      });
      return () => unsub()
    }, [])

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
        <StatusBar/>
          <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
            {/* <View style={{width: '100%', height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <TouchableOpacity style={{width: 55, height: 55, marginLeft: 50}} onPress={() => navigation.navigate('ProfileScreen', {user: userData})}>
                <Image source={userData.profileUri ? {uri: userData.profileUri} : require("../assets/profileicon.png")} style={{width: '100%', height: '100%', borderRadius: 22}}/>
              </TouchableOpacity>
              <TouchableOpacity style={{width: 25, height: 25, marginRight: 50}} onPress={() => navigation.navigate('PersonalSettings', {user: userData})}>
                <Image source={require("../assets/settings.png")} style={{width: '100%', height: '100%'}}/>
              </TouchableOpacity>
            </View>
            <Text style={{marginLeft: 50, color: '#eeebdd', fontSize: 35, fontFamily: 'roboto-regular', fontWeight: '300'}}>Good {time},</Text>
            <Text style={{marginLeft: 50, color: '#eeebdd', fontSize: 28, fontFamily: 'roboto-700', marginTop: 10}}>{userData.firstName}</Text>
            <ImageBackground imageStyle={{borderRadius: 25}} source={require("../assets/banner2.png")} style={{width: Dimensions.get('window').width * 0.9, height: 150, alignSelf: 'center', marginTop: 20, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <View style={{display: 'flex', flexDirection: 'column', marginLeft: 20}}>
                <Text style={{color: '#eeebdd', fontFamily: 'roboto-700', fontSize: 20}}>Live Updates</Text>
                <Text style={{color: '#eeebdd', fontFamily: 'roboto-regular', fontSize: 18}}>from WHO</Text>
              </View>
              <ButtonIcon onPress={() => navigation.navigate('Statistics')} style={{marginRight: 20, backgroundColor: '#e2676f', tintColor: '#eeebdd'}}/>
            </ImageBackground> */}
          </ScrollView>
      </SafeAreaView> 
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#1B1717',
    display: 'flex',
    flexDirection: 'column',
  },
});

export default HomeScreen;