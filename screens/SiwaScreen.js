import React, { useState, useEffect } from "react";
import { Text, ScrollView, Image, View, StyleSheet, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { View as MView, Text as MText, Image as MImage, AnimatePresence, useAnimationState } from 'moti';
import { getAuth } from "firebase/auth";
import { doc, onSnapshot, getDocs, collection } from 'firebase/firestore'
import { db } from '../firebase'
import { RFValue } from 'react-native-responsive-fontsize';
import Button from "../components/Button";
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated from "react-native-reanimated";
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

function SiwaScreen() {

    const navigation = useNavigation();

    return (
        <View style={{flex: 1, backgroundColor: '#fff', display: 'flex', flexDirection: 'column'}}>
            <Animated.Image sharedTransitionTag="siwa" source={require('../assets/siwa.jpg')} style={{ width, height: height * 0.5, alignSelf: 'center', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
        </View>
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