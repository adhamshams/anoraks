import React, { useState, useEffect } from "react";
import { StyleSheet, View, StatusBar, SafeAreaView, Image, Text, ScrollView, TouchableOpacity, Dimensions, ImageBackground, BackHandler } from "react-native";
import { getAuth } from "firebase/auth";
import { RFValue } from 'react-native-responsive-fontsize';
import { AntDesign } from '@expo/vector-icons';
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

const { width, height } = Dimensions.get('window');

function PersonalizeTrip({ navigation }) {

    const auth = getAuth();

    return (
        <SafeAreaView style={styles.background}>
            <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={{ backgroundColor: '#124c7d', width: RFValue(40), height: RFValue(40), borderRadius: 12, justifyContent: 'center', marginTop: height * 0.02, marginHorizontal: width * 0.07, alignItems: 'center' }} onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={{ color: '#124c7d', fontSize: RFValue(15), fontWeight: 700, marginTop: height * 0.02, marginHorizontal: width * 0.07 }}>Trip Type</Text>
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

export default PersonalizeTrip;