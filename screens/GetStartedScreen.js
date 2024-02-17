import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Dimensions, Text, BackHandler, TouchableOpacity, ImageBackground, Animated } from "react-native";
import { RFValue } from 'react-native-responsive-fontsize';
import Button from "../components/Button";

const { height, width } = Dimensions.get('window');

const _data = [
  {
    title: "Lorem ipsum dolor sit amet.",
    image: require("../assets/slide1.jpg"),
    description: 'Nulla imperdiet posuere ultrices.'
  },
  {
    title: "Praesent nibh nisi, gravida semper felis.",
    image: require("../assets/slide2.jpg"),
    description: 'Vestibulum eleifend mollis rutrum.'
  },
  {
    title: "In ac justo sed ipsum finibus amet neque.",
    image: require("../assets/slide3.jpg"),
    description: 'Nulla nulla urna, mollis a suscipit a, porta vel ligula.'
  }
]

function GetStartedScreen({ navigation }) {

  const slide1Opacity = useRef(new Animated.Value(1)).current;
  const slide2Opacity = useRef(new Animated.Value(0)).current;
  const slide3Opacity = useRef(new Animated.Value(0)).current;

  const fadeInFadeOutAnimation = () => {
    return Animated.sequence([
      Animated.delay(5000),
      Animated.timing(slide1Opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slide2Opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(5000),
      Animated.timing(slide2Opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slide3Opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(5000),
      Animated.timing(slide3Opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slide1Opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]);
  };

  useEffect(() => {
    const animation = fadeInFadeOutAnimation();
    const loopedAnimation = Animated.loop(animation);
    loopedAnimation.start();

    return () => {
      loopedAnimation.stop();
    };
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [])

  return (
    <View style={styles.container}>
      <Animated.View style={[{ opacity: slide1Opacity, width, height }, styles.slide]}>
        <ImageBackground source={_data[0].image} style={{ width: '100%', height: '100%', backgroundColor: '#000' }} imageStyle={{ opacity: 0.7 }}/>
        <View style={{ position: 'absolute', bottom: height * 0.25, left: width * 0.075, display: 'flex', flexDirection: 'column', gap: height * 0.02, marginRight: width * 0.075 }}>
          <Text style={{ color: '#fff', fontSize: RFValue(25), fontWeight: 900 }}>{ _data[0].title }</Text>
          <Text style={{ color: '#fff', fontSize: RFValue(18), fontWeight: 700 }}>{ _data[0].description }</Text>
        </View>
      </Animated.View>
      <Animated.View style={[{ opacity: slide2Opacity, width, height }, styles.slide]}>
        <ImageBackground source={_data[1].image} style={{ width: '100%', height: '100%', backgroundColor: '#000' }} imageStyle={{ opacity: 0.7 }}/>
        <View style={{ position: 'absolute', bottom: height * 0.25, left: width * 0.075, display: 'flex', flexDirection: 'column', gap: height * 0.02, marginRight: width * 0.075}}>
          <Text style={{ color: '#fff', fontSize: RFValue(25), fontWeight: 900 }}>{ _data[1].title }</Text>
          <Text style={{ color: '#fff', fontSize: RFValue(18), fontWeight: 700 }}>{ _data[1].description }</Text>
        </View>
      </Animated.View>
      <Animated.View style={[{ opacity: slide3Opacity, width, height }, styles.slide]}>
        <ImageBackground source={_data[2].image} style={{ width: '100%', height: '100%', backgroundColor: '#000' }} imageStyle={{ opacity: 0.7 }}/>
        <View style={{ position: 'absolute', bottom: height * 0.25, left: width * 0.075, display: 'flex', flexDirection: 'column', gap: height * 0.02, marginRight: width * 0.075 }}>
          <Text style={{ color: '#fff', fontSize: RFValue(25), fontWeight: 900 }}>{ _data[2].title }</Text>
          <Text style={{ color: '#fff', fontSize: RFValue(18), fontWeight: 700 }}>{ _data[2].description }</Text>
        </View>
      </Animated.View>
      <View style={{ position: 'absolute', width: '100%', bottom: height * 0.05 }}>
        <Button onPress={() => navigation.navigate('SignUpScreen')} title={'SIGN UP'} style={{ height: RFValue(45), width: '85%', color: '#124c7d', backgroundColor: "#fff", fontSize: RFValue(15), alignSelf: 'center' }} />
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: height * 0.02 }}>
          <Text style={{ textAlign: 'center', fontWeight: 500, fontSize: RFValue(15), textAlign: 'center', color: '#fff' }}>
            Already have an account?{'  '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={{ color: '#fff', fontWeight: 700, fontSize: RFValue(15) }}>
              Login Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  slide: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default GetStartedScreen;
