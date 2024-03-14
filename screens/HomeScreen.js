import React, { useState, useEffect } from "react";
import { StyleSheet, View, RefreshControl, SafeAreaView, Image, Text, ScrollView, TouchableOpacity, Dimensions, ImageBackground, BackHandler } from "react-native";
import { getAuth } from "firebase/auth";
import { RFValue } from 'react-native-responsive-fontsize';
import { FontAwesome, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { doc, getDoc, where, query, collection, getDocs, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase'
import ContentLoader, { Rect } from 'react-content-loader/native'

const { height, width } = Dimensions.get('window');

function HomeScreen({ navigation }) {

  var today = new Date();
  var hour = today.getHours()

  const [time, setTime] = useState()
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState()
  const [trips, setTrips] = useState([])

  const levelTags = ['Novice Traveler', 'Explorer', 'Wanderer', 'Voyager']

  const auth = getAuth();

  useEffect(() => {
    async function getData() {
      const results = await Promise.allSettled([
        fetchUserData(),
        fetchTrips()
      ])
      if (results[0].status === 'fulfilled' && results[1].status === 'fulfilled') {
        setUserData(results[0].value)
        setTrips(results[1].value)
        setLoading(false)
        setRefreshing(false)
      } else {
        alert('An error occurred while fetching data')
      }
    }
    getData()
  }, [refreshing])

  const fetchUserData = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    return docSnap.data()
  }

  const fetchTrips = async () => {
    const q = query(collection(db, "trips"), where("date", ">", new Date()), orderBy("date", "asc"), limit(5));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data())
  }

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
      <ScrollView refreshControl={<RefreshControl tintColor={'#000'} refreshing={refreshing} onRefresh={() => setRefreshing(true)} />} horizontal={false} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: width * 0.05 }}>
          <View>
            <Text style={{ color: '#000', fontSize: RFValue(23), fontWeight: 800 }}>Good {time},</Text>
            <Text style={{ color: '#000', fontSize: RFValue(20), fontWeight: 500, marginTop: 10 }}>{auth.currentUser.displayName} ✈️</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('More')}>
            {auth.currentUser.photoURL ? <Image source={{ uri: auth.currentUser.photoURL }} style={{ width: 40, height: 40, borderRadius: 100 }} /> : <FontAwesome name="user-circle" size={40} color="black" />}
          </TouchableOpacity>
        </View>
        {loading ?
          <ContentLoader viewBox="0 0 380 80">
            <Rect x="10" y="10" rx="4" ry="4" width="355" height="70" />
          </ContentLoader>
          :
          <View>
            {userData.trips.length === 0 ?
              <ImageBackground source={require('../assets/personalize-trip.jpg')} style={{ width: width * 0.9, height: height * 0.15, alignSelf: 'center', backgroundColor: '#000', borderRadius: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: height * 0.01, justifyContent: 'space-between', paddingHorizontal: width * 0.025 }} imageStyle={{ borderRadius: 12, opacity: 0.4, resizeMode: 'cover' }}>
                <View style={{ display: 'flex', flexDirection: 'column', width: '75%' }}>
                  <Text style={{ fontSize: RFValue(15), color: '#fff', fontWeight: 700 }}>Discover your next escape</Text>
                  <Text style={{ fontSize: RFValue(12), color: '#fff', marginTop: height * 0.01 }}>Get 10% off on your first trip with Anoraks Travels</Text>
                </View>
                <TouchableOpacity style={{ backgroundColor: '#fff', width: RFValue(40), height: RFValue(40), borderRadius: 12, justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate('Destinations')}>
                  <AntDesign name="arrowright" size={24} color="#124c7d" />
                </TouchableOpacity>
              </ImageBackground>
              : 
              <ImageBackground source={require('../assets/personalize-trip.jpg')} style={{ width: width * 0.9, height: height * 0.15, alignSelf: 'center', backgroundColor: '#000', borderRadius: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: height * 0.01, justifyContent: 'space-between', paddingHorizontal: width * 0.025 }} imageStyle={{ borderRadius: 12, opacity: 0.4, resizeMode: 'cover' }}>
                <View style={{ display: 'flex', flexDirection: 'column', width: '75%' }}>
                  <Text style={{ fontSize: RFValue(15), color: '#fff', fontWeight: 700 }}>Discover your next escape</Text>
                  <Text style={{ fontSize: RFValue(12), color: '#fff', marginTop: height * 0.01 }}>Go on adventures and meet like minded individuals all around the world</Text>
                </View>
                <TouchableOpacity style={{ backgroundColor: '#fff', width: RFValue(40), height: RFValue(40), borderRadius: 12, justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate('Destinations')}>
                  <AntDesign name="arrowright" size={24} color="#124c7d" />
                </TouchableOpacity>
              </ImageBackground>
              }
            <TouchableOpacity style={{ backgroundColor: '#124c7d', width: width * 0.9, height: height * 0.11, marginTop: height * 0.01, borderRadius: 12, alignSelf: 'center', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome5 name="trophy" size={28} color="white" style={{ marginLeft: width * 0.025 }} />
              <View style={{ display: 'flex', flexDirection: 'column', marginLeft: width * 0.025 }}>
                <Text style={{ color: '#fff', fontSize: RFValue(11), fontWeight: 700 }}>{userData.level < 5 ? levelTags[userData.level] : 'Nomad'}<Text style={{ fontWeight: 500, opacity: 0.7 }}>{' (Level ' + userData.level + ')'}</Text></Text>
                <Text style={{ color: '#fff', marginTop: height * 0.02, fontSize: RFValue(9.5) }}>{1000 - userData.points} Points to Level {userData.level + 1}</Text>
                <View style={{ width: '110%', height: 4, backgroundColor: 'gray', borderRadius: 5, overflow: 'hidden', marginTop: 7 }}>
                  <View
                    style={{
                      backgroundColor: 'white', // Change to white for a white progress bar
                      height: '100%',
                      width: `${(userData.points / 1000) * 100}%`,
                    }}
                  />
                </View>
              </View>
              <View style={{ width: RFValue(40), height: RFValue(40), borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: width * 0.025, marginLeft: 'auto' }}>
                <FontAwesome name="angle-right" size={24} color="white" />
              </View>
            </TouchableOpacity>
            <Text style={{ fontSize: RFValue(23), fontWeight: 'bold', marginTop: height * 0.02, marginLeft: width * 0.05 }}>Upcoming Trips</Text>
            {trips.length === 0 ?
              <View style={{ width: '100%', height: height * 0.15, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: RFValue(15), fontWeight: 500 }}>No upcoming trips</Text>
              </View>
              :
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: '100%', display: 'flex', flexDirection: 'row', marginTop: height * 0.02 }}>
                {trips.map((trip, index) => {
                  let soldOut = trip.users.length === trip.capacity
                  let imageSource;
                  switch (trip.destination) {
                    case 'Siwa Oasis':
                      imageSource = require('../assets/siwa.jpg');
                      break;
                    default:
                      imageSource = require('../assets/siwa.jpg');
                  }
                  return (
                    <TouchableOpacity onPress={() => {!soldOut ? null : null}} key={index} style={{ width: width * 0.7, height: height * 0.2, backgroundColor: '#000', borderRadius: 12, display: 'flex', flexDirection: 'column', marginLeft: width * 0.05 }}>
                      <ImageBackground source={imageSource} style={{ width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 12, display: 'flex', flexDirection: 'column' }} imageStyle={{ borderRadius: 12, opacity: 0.7 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 15, marginLeft: 15 }}>
                        <FontAwesome name="map-marker" size={20} color="#fff" />
                          <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>{trip.destination}</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto', marginBottom: 15, gap: 5, marginLeft: 15 }}>
                          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome name="calendar" size={20} color="#fff" />
                            <Text style={{ color: '#fff', fontSize: 15, marginLeft: 10, fontWeight: 'bold' }}>{trip.date.toDate().toDateString()}</Text>
                          </View>
                          {soldOut ? <Text style={{ color: '#fff', fontSize: 15, marginTop: 5, fontWeight: '500' }}>SOLD OUT</Text> : <Text style={{ color: '#fff', fontSize: 15, marginTop: 5, fontWeight: '500' }}>Starting from EGP {trip.price}</Text>}
                        </View>
                      </ImageBackground>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            }
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: height * 0.02, justifyContent: 'space-between', paddingHorizontal: width * 0.05 }}>
              <Text style={{ fontSize: RFValue(23), fontWeight: 'bold' }}>Blog Posts</Text>
              <TouchableOpacity onPress={() => null}>
                <Text style={{ fontSize: RFValue(14), color: '#1247cd', textDecorationLine: 'underline' }}>See All</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ marginVertical: height * 0.05, textAlign: 'center', fontSize: RFValue(15) }}>No blogs found</Text>
          </View>
        }
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