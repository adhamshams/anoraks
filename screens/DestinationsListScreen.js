import React, { useEffect } from "react";
import { StyleSheet, View, ImageBackground, SafeAreaView, Text, ScrollView, TouchableOpacity, Dimensions, BackHandler } from "react-native";
import { RFValue } from 'react-native-responsive-fontsize';
import Animated from 'react-native-reanimated';

const { height, width } = Dimensions.get('window');

function DestinationsListScreen({ navigation }) {

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
    }, [])

    return (
        <SafeAreaView style={styles.background}>
            <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
                <Text style={{ fontSize: RFValue(23), fontWeight: 'bold', marginTop: height * 0.02, marginLeft: 20, marginBottom: height * 0.02 }}>Group Tours</Text>
                <TouchableOpacity onPress={() => navigation.navigate('PersonalizeTripScreen')}>
                    <ImageBackground source={require('../assets/personalize-trip.jpg')} style={{ width, height: height * 0.25, alignSelf: 'center', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }} imageStyle={{ opacity: 0.7, resizeMode: 'cover' }}>
                        <Text style={{ fontSize: RFValue(25), fontWeight: '800', color: '#fff', textAlign: 'center', marginHorizontal: 20 }}>PERSONALIZE YOUR TRIP</Text>
                    </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('SiwaScreen')}>
                <ImageBackground source={require('../assets/siwa.jpg')} style={{ width, height: height * 0.25, alignSelf: 'center', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }} imageStyle={{ opacity: 0.7, resizeMode: 'cover' }}>
                        <Text style={{ fontSize: RFValue(25), fontWeight: '800', color: '#fff', textAlign: 'center' }}>SIWA OASIS</Text>
                    </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity>
                    <ImageBackground source={require('../assets/black-and-white-desert.jpg')} style={{ width, height: height * 0.25, alignSelf: 'center', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }} imageStyle={{ opacity: 0.7, resizeMode: 'cover' }}>
                        <Text style={{ fontSize: RFValue(25), fontWeight: '800', color: '#fff', textAlign: 'center' }}>BLACK AND WHITE DESERT</Text>
                    </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity>
                    <ImageBackground source={require('../assets/luxor-and-aswan.jpg')} style={{ width, height: height * 0.25, alignSelf: 'center', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }} imageStyle={{ opacity: 0.7, resizeMode: 'cover' }}>
                        <Text style={{ fontSize: RFValue(25), fontWeight: '800', color: '#fff', textAlign: 'center' }}>LUXOR & ASWAN</Text>
                    </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity>
                    <ImageBackground source={require('../assets/marsa-alam.jpg')} style={{ width, height: height * 0.25, alignSelf: 'center', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }} imageStyle={{ opacity: 0.7, resizeMode: 'cover' }}>
                        <Text style={{ fontSize: RFValue(25), fontWeight: '800', color: '#fff', textAlign: 'center' }}>MARSA ALAM</Text>
                    </ImageBackground>
                </TouchableOpacity>
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

export default DestinationsListScreen;