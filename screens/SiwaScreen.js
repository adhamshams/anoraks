import React, { useState, useEffect } from "react";
import { Animated, Text, ScrollView, Image, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { View as MView, Text as MText, Image as MImage, AnimatePresence, useAnimationState } from 'moti';
import { getAuth } from "firebase/auth";
import { doc, onSnapshot, getDocs, collection } from 'firebase/firestore'
import { db } from '../firebase'
import { RFValue } from 'react-native-responsive-fontsize';
import Button from "../components/Button";
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

const _heightOffset = height * .25;

function SiwaScreen({ navigation, route }) {

    const scrollY = React.useRef(new Animated.Value(0)).current;
    const ref = React.useRef();

    const opacity = scrollY.interpolate({
        inputRange: [0, height - _heightOffset],
        outputRange: [1, 0]
    })
    const opacityReversed = scrollY.interpolate({
        inputRange: [0, height - _heightOffset],
        outputRange: [0, 1]
    })
    const scale = scrollY.interpolate({
        inputRange: [0, height - _heightOffset],
        outputRange: [1, 2],
        extrapolateLeft: 'clamp'
    })

    const useFadeInDown = useAnimationState({
        from: {
            opacity: 0,
            translateY: 100,
        },
        to: {
            opacity: 1,
            translateY: 0,
        },
    })

    useEffect(() => {
        scrollY.addListener(({ value }) => {
            if (value >= height - _heightOffset) {
                useFadeInDown.transitionTo('to')
                return;
            }

            useFadeInDown.transitionTo(state => {
                if (state === 'to') {
                    return 'from';
                }
            })
        })

        return () => {
            scrollY.removeAllListeners();
        }
    }, [])

    return (
        <Animated.ScrollView
            snapToOffsets={[height - _heightOffset, height - _heightOffset + 1, height - _heightOffset + 2]}
            decelerationRate="fast"
            contentContainerStyle={{ paddingTop: height - _heightOffset }}
            scrollEventThrottle={16}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
            )}
        >
            <View style={{ width, height, position: 'absolute', top: 0, left: 0, overflow: 'hidden' }}>
                <Animated.Image
                    ref={ref}
                    source={require("../assets/siwa.jpg")}
                    style={{ width, height, opacity, resizeMode: 'cover', transform: [{ scale }] }}
                />
                <TouchableOpacity style={{ backgroundColor: '#fff', width: RFValue(40), height: RFValue(40), borderRadius: 12, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: height * 0.08, left: width * 0.07 }} onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={24} color="#124c7d" />
                </TouchableOpacity>
            </View>
            <View style={{ padding: 20, minHeight: height }}>
                <View style={{ alignItems: 'center', height: _heightOffset, justifyContent: 'center' }}>
                        <Animated.Text style={{ fontSize: RFValue(30), fontWeight: '800', textTransform: 'uppercase', color: 'white', opacity, textAlign: 'center'}} >SIWA</Animated.Text>
                        <Animated.Text style={{ fontSize: RFValue(30), fontWeight: '800', textTransform: 'uppercase', position: 'absolute', opacity: opacityReversed, textAlign: 'center' }} >SIWA</Animated.Text>
                </View>
                {/* {[...Array(10).keys()].map((index) => (
                    <MText transition={{ delay: 50 * index }} state={useFadeInDown} key={index} style={{ marginBottom: 20, fontSize: 16, lineHeight: 24, fontFamily: 'Georgia' }}>hi</MText>
                ))} */}
                <Text style={{ marginBottom: 20, fontSize: RFValue(16), fontWeight: 'bold' }}>Trip Overview</Text>
                <View style={{ display: 'flex', flexDirection: 'column', gap: height * 0.02 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="bed" size={40} color="#124c7d" />
                        <Text style={{ fontSize: RFValue(20), marginLeft: 10 }}>3 Nights</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="calendar-outline" size={24} color="#124c7d" />
                        <Text style={{ fontSize: RFValue(16), marginLeft: 10 }}>Every Friday</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="people-outline" size={24} color="#124c7d" />
                        <Text style={{ fontSize: RFValue(16), marginLeft: 10 }}>Group Tour</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="location-outline" size={24} color="#124c7d" />
                        <Text style={{ fontSize: RFValue(16), marginLeft: 10 }}>Siwa Oasis</Text>
                    </View>
                </View>
            </View>
        </Animated.ScrollView>
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

export default SiwaScreen;