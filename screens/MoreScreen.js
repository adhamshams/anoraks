import React, { useEffect, useState } from "react";
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, Dimensions, BackHandler, Linking, ActivityIndicator } from "react-native";
import { AntDesign, FontAwesome5, Ionicons, Feather, FontAwesome } from '@expo/vector-icons';
import app from '../app.json';
import { RFValue } from 'react-native-responsive-fontsize';
import { getAuth } from "firebase/auth";
import { StackActions } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

function MoreScreen({ navigation }) {

    const [loading, setLoading] = useState(false)

    const auth = getAuth()

    const pushAction = StackActions.replace('GetStartedScreen');

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
    }, [])

    const handleSignOut = async () => {
        try {
            setLoading(true)
            await auth.signOut()
            navigation.dispatch(pushAction)
        } catch (error) {
            setLoading(false)
            alert("An error has occured")
        }
    }

    const openFacebookPage = () => {
        // Replace 'YOUR_FACEBOOK_PAGE_URL' with the actual URL of your Facebook page
        const facebookPageUrl = 'https://facebook.com/Anorakstravel/?_rdc=1&_rdr';

        Linking.openURL(facebookPageUrl)
            .catch((err) => alert('Error opening Facebook page'));
    };

    const openInstagramPage = () => {
        // Replace 'YOUR_INSTAGRAM_USERNAME' with your Instagram username
        const instagramUsername = 'anorakstravels';

        // Instagram app URL
        const instagramAppUrl = `instagram://user?username=${instagramUsername}`;

        // Instagram web URL
        const instagramWebUrl = `https://www.instagram.com/${instagramUsername}/`;

        Linking.openURL(instagramAppUrl)
            .catch(() => {
                // If the Instagram app is not installed, open in the browser
                Linking.openURL(instagramWebUrl)
                    .catch((err) => alert('Error opening Instagram page'));
            });
    };

    const openWhatsAppChat = () => {
        // Replace 'PHONE_NUMBER' with the actual phone number, including the country code
        const phoneNumber = '+201024528496';

        // WhatsApp URL
        const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;

        Linking.openURL(whatsappUrl)
            .catch((err) => alert('Error opening WhatsApp chat'));
    };

    return (
        <SafeAreaView style={styles.background}>
            <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
                <Text style={{ fontSize: RFValue(23), fontWeight: 'bold', paddingVertical: height * 0.02, textAlign: 'center' }}>Anoraks Travels</Text>
                <TouchableOpacity onPress={() => null} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingVertical: 20 }}>
                    <View style={{ width: 30, height: 30, marginLeft: width * 0.05, justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome5 name="user-alt" size={21} color="black" />
                    </View>
                    <Text style={{ fontSize: 20, marginLeft: width * 0.03 }}>Edit Profile</Text>
                    <AntDesign name="right" size={24} color="black" style={{ marginLeft: 'auto', marginRight: width * 0.05, opacity: 0.4 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('DigitalPassportScreen')} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingVertical: 20 }}>
                    <View style={{ width: 30, height: 30, marginLeft: width * 0.05, justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome5 name="passport" size={24} color="black" />
                    </View>
                    <Text style={{ fontSize: 20, marginLeft: width * 0.03 }}>Digital Passport</Text>
                    <AntDesign name="right" size={24} color="black" style={{ marginLeft: 'auto', marginRight: width * 0.05, opacity: 0.4 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => null} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingVertical: 20 }}>
                    <View style={{ width: 30, height: 30, marginLeft: width * 0.05, justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome5 name="plane" size={22} color="black" />
                    </View>
                    <Text style={{ fontSize: 20, marginLeft: width * 0.03 }}>My Trips</Text>
                    <AntDesign name="right" size={24} color="black" style={{ marginLeft: 'auto', marginRight: width * 0.05, opacity: 0.4 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => null} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingVertical: 20 }}>
                    <View style={{ width: 30, height: 30, marginLeft: width * 0.05, justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome5 name="trophy" size={22} color="black" />
                    </View>
                    <Text style={{ fontSize: 20, marginLeft: width * 0.03 }}>Anoraks Rewards</Text>
                    <AntDesign name="right" size={24} color="black" style={{ marginLeft: 'auto', marginRight: width * 0.05, opacity: 0.4 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => null} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingVertical: 20 }}>
                    <View style={{ width: 30, height: 30, marginLeft: width * 0.05, justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome5 name="hand-holding-heart" size={22} color="black" />
                    </View>
                    <Text style={{ fontSize: 20, marginLeft: width * 0.03 }}>Refer a Friend</Text>
                    <AntDesign name="right" size={24} color="black" style={{ marginLeft: 'auto', marginRight: width * 0.05, opacity: 0.4 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => null} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingVertical: 20 }}>
                    <View style={{ width: 30, height: 30, marginLeft: width * 0.05, justifyContent: 'center', alignItems: 'center' }}>
                        <AntDesign name="questioncircle" size={24} color="black" />
                    </View>
                    <Text style={{ fontSize: 20, marginLeft: width * 0.03 }}>Help</Text>
                    <AntDesign name="right" size={24} color="black" style={{ marginLeft: 'auto', marginRight: width * 0.05, opacity: 0.4 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => null} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingVertical: 20 }}>
                    <View style={{ width: 30, height: 30, marginLeft: width * 0.05, justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome name="file-text" size={22} color="black" />
                    </View>
                    <Text style={{ fontSize: 20, marginLeft: width * 0.03 }}>Terms and Conditions</Text>
                    <AntDesign name="right" size={24} color="black" style={{ marginLeft: 'auto', marginRight: width * 0.05, opacity: 0.4 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSignOut()} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingVertical: 20 }}>
                    <View style={{ width: 30, height: 30, marginLeft: width * 0.05, justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name="log-out" size={25} color="black" />
                    </View>
                    <Text style={{ fontSize: 20, marginLeft: width * 0.03 }}>Log Out</Text>
                    {!loading ? <AntDesign name="right" size={24} color="black" style={{ marginLeft: 'auto', marginRight: width * 0.05, opacity: 0.4 }} /> : <ActivityIndicator size={24} color={'black'} style={{marginLeft: 'auto', marginRight: width * 0.05}}/>}
                </TouchableOpacity>
                <View style={{ marginTop: height * 0.02, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: width * 0.07 }}>
                    <TouchableOpacity onPress={openFacebookPage}>
                        <Feather name="facebook" size={40} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openInstagramPage}>
                        <AntDesign name="instagram" size={40} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openWhatsAppChat}>
                        <FontAwesome5 name="whatsapp" size={40} color="black" />
                    </TouchableOpacity>
                </View>
                <Text style={{ fontSize: RFValue(12), paddingVertical: height * 0.02, textAlign: 'center' }}><Text>Version: {app.expo.version}</Text></Text>
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

export default MoreScreen;