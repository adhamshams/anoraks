import React, { useState, useEffect } from "react";
import { Text, ScrollView, ImageBackground, Image, View, StyleSheet, Dimensions, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import { getAuth } from "firebase/auth";
import { doc, getDoc, where, query, collection, getDocs, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase'
import { RFValue } from 'react-native-responsive-fontsize';
import { Video } from 'expo-av';
import Button from "../components/Button";
import { AntDesign, FontAwesome } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

function SiwaScreen({ navigation }) {

    const auth = getAuth();

    const [loading, setLoading] = useState(true)

    const [reviews, setReviews] = useState([])
    const [trips, setTrips] = useState([])

    useEffect(() => {
        async function getData() {
            const results = await Promise.allSettled([
                fetchReviews(),
                fetchTrips()
            ])
            if (results[0].status === 'fulfilled') {
                setReviews(results[0].value)
            } else {
                alert('An error occurred while fetching reviews')
            }
            if (results[1].status === 'fulfilled') {
                setTrips(results[1].value)
            } else {
                alert('An error occurred while fetching trips')
            }
            setLoading(false)
        }
        getData()
    }, [])

    const fetchReviews = async () => {
        const q = query(collection(db, "reviews"), where("destination", "==", "Siwa Oasis"), orderBy("date", "desc"), limit(5));
        const querySnapshot = await getDocs(q);
        let reviews = querySnapshot.docs.map(doc => doc.data());
        if (reviews.length > 0) {
            await Promise.all(reviews.map(async (review) => {
                const docSnap = await getDoc(doc(db, "users", review.userID))
                review.name = docSnap.data().firstName + ' ' + docSnap.data().lastName
                review.profilePhotoURL = docSnap.data().photoURL
            }))
        }
        return reviews;
    }

    const fetchTrips = async () => {
        const q = query(collection(db, "trips"), where("date", ">", new Date()), where("destination", "==", "Siwa Oasis"), orderBy("date", "asc"), limit(5));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data())
    }

    return (
        <ScrollView contentContainerStyle={{ backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
            <Video shouldPlay isLooping source={require('../assets/siwa.mp4')} resizeMode="cover" style={{ opacity: 1, width, height: height * 0.4 }} />
            <SafeAreaView style={{ position: 'absolute' }}>
                <TouchableOpacity style={{ backgroundColor: '#fff', width: RFValue(40), height: RFValue(40), borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: width * 0.07, marginTop: height * 0.02 }} onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={24} color="#124c7d" />
                </TouchableOpacity>
            </SafeAreaView>
            <Text style={{ fontSize: RFValue(15), fontWeight: '400', color: '#000', marginTop: height * 0.02, marginHorizontal: width * 0.05 }}>Siwa Oasis is an urban oasis in Egypt between the Qattara Depression and the Great Sand Sea in the Western Desert, nearly 50 km (30 mi) east of the Libyan border, and 560 km (350 mi) from Cairo.</Text>
            <Text style={{ fontSize: RFValue(15), fontWeight: '400', color: '#000', marginTop: height * 0.02, marginHorizontal: width * 0.05 }}>Siwa is one of Egypt's most isolated settlements, with 23,000 people, mostly Berbers who developed a unique culture and a distinct language of the Berber family called Siwi. Its fame lies primarily in its ancient role as the home to an oracle of Amon, the ruins of which are a popular tourist attraction which gave the oasis its ancient name Ammonium.</Text>
            <Text style={{ fontSize: RFValue(15), fontWeight: '400', color: '#000', marginTop: height * 0.02, marginHorizontal: width * 0.05 }}>Siwa was also the site of some fighting during World War I and World War II. It is also the origin of the Egyptian musician Hakim.</Text>
            <Text style={{ fontSize: RFValue(23), fontWeight: '800', color: '#000', marginTop: height * 0.02, marginLeft: width * 0.05 }}>Upcoming Trips</Text>
            {trips.length === 0 ?
                <View style={{ width: '100%', height: height * 0.15, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: RFValue(15), fontWeight: 500 }}>No upcoming trips</Text>
                </View>
                :
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: '100%', display: 'flex', flexDirection: 'row', marginTop: height * 0.02 }}>
                    {trips.map((trip, index) => {
                        let soldOut = trip.users.length === trip.capacity
                        return (
                            <TouchableOpacity onPress={() => { !soldOut ? null : null }} key={index} style={{ width: width * 0.7, height: height * 0.2, backgroundColor: '#000', borderRadius: 12, display: 'flex', flexDirection: 'column', marginLeft: width * 0.05 }}>
                                <ImageBackground source={require('../assets/siwa.jpg')} style={{ width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 12, display: 'flex', flexDirection: 'column' }} imageStyle={{ borderRadius: 12, opacity: 0.7 }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 15, marginLeft: 15 }}>
                                        <FontAwesome name="hotel" size={20} color="#fff" />
                                        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>{trip.hotel}</Text>
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
            <View style={{ display: 'flex', flexDirection: 'row', marginTop: height * 0.02, alignItems: 'center' }}>
                <Text style={{ fontSize: RFValue(23), fontWeight: '800', color: '#000', marginLeft: width * 0.05 }}>Reviews</Text>
                <TouchableOpacity style={{ marginLeft: 'auto', marginRight: width * 0.05 }} onPress={() => null}>
                    <Text style={{ fontSize: RFValue(14), color: '#1247cd', textDecorationLine: 'underline' }}>See All</Text>
                </TouchableOpacity>
            </View>
            {reviews.length === 0 ?
                <View style={{ width: '100%', height: height * 0.15, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: RFValue(15), fontWeight: 500 }}>No reviews</Text>
                </View>
                :
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: '100%', display: 'flex', flexDirection: 'row', marginTop: height * 0.02, marginBottom: height * 0.05, paddingHorizontal: width * 0.05, gap: width * 0.05 }}>
                    {reviews.map((review, index) => {
                        return (
                            <View key={index} style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#124c7d', borderRadius: 12, height: height * 0.2, width: width * 0.80, paddingHorizontal: width * 0.02, paddingVertical: height * 0.01 }}>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    {review.profilePhotoURL ? <Image source={{ uri: review.profilePhotoURL }} style={{ width: RFValue(25), height: RFValue(25), borderRadius: 100 }} /> : <FontAwesome name="user-circle" size={25} color="white" />}
                                    <Text style={{ fontSize: RFValue(14), marginLeft: 5, color: '#fff', fontWeight: '600' }}>{review.name}</Text>
                                    <View style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#aaaaaa', alignItems: 'center', marginLeft: 'auto', padding: 5, borderRadius: 30 }}>
                                        <FontAwesome name="star" size={15} color="#f8d64e" />
                                        <Text style={{ marginLeft: 5, color: '#000', marginRight: 5, fontSize: 15, fontWeight: 800 }}>{review.rating}</Text>
                                    </View>
                                </View>
                                <Text adjustsFontSizeToFit style={{ color: '#fff', marginTop: 10, fontSize: 16 }}>{review.review}</Text>
                            </View>
                        )
                    })}
                </ScrollView>
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
});

export default SiwaScreen;