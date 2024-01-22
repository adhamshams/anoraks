import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions, Text, BackHandler, TouchableOpacity, ImageBackground, FlatList } from "react-native";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from "expo-constants";
import Animated, { Extrapolate,  useSharedValue, useAnimatedStyle, interpolate, useAnimatedScrollHandler, } from 'react-native-reanimated';
import { RFValue } from 'react-native-responsive-fontsize';
import Button from "../components/Button";

const { height, width } = Dimensions.get('window');

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const _indicatorSize = 4;
const _spacing = 14;

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

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// async function registerForPushNotificationsAsync() {
//   let token;
//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = await Notifications.getExpoPushTokenAsync({
//       projectId: Constants.expoConfig.extra.eas.projectId,
//     });
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   return token;
// }

const Details = ({ scrollY, item, index }) => {
  const stylez = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [index - 1, index, index + 1],
        [0, 1, 0],
        Extrapolate.CLAMP
      ),
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [index - 1, index, index + 1],
            [20, 0, -20],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });
  return (
    <View
      style={[
        {
          position: 'absolute',
          width: '100%',
          zIndex: _data.length - index,
          overflow: 'hidden',
        },
      ]}>
      <Animated.View style={stylez}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    </View>
  );
};

const DetailsWrapper = ({ scrollY, data }) => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        top: '60%',
        alignItems: 'center',
        left: _spacing * 2 + _indicatorSize,
        right: _spacing,
      }}
      pointerEvents="none">
      {data.map((item, index) => {
        return <Details key={index} item={item} index={index} scrollY={scrollY} />;
      })}
    </View>
  );
};

const Item = ({ item, index }) => {
  return (
    <ImageBackground
      source={ item.image }
      style={{ width, height, backgroundColor: '#000' }}
      imageStyle={{ flex: 1, resizeMode: 'cover', opacity: 0.7 }}
    />
  );
};

const PaginationDot = ({ scrollY, index }) => {
  const stylez = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [index - 1, index, index + 1],
        [_indicatorSize, _indicatorSize * 6, _indicatorSize],
        Extrapolate.CLAMP
      ),
    };
  });
  
  return (
    <Animated.View
      style={[
        {
          width: _indicatorSize,
          height: _indicatorSize,
          borderRadius: _indicatorSize / 2,
          backgroundColor: 'white',
          marginBottom: _indicatorSize / 2,
        },
        stylez,
      ]}
    />
  );
};

const Pagination = ({ scrollY, data }) => {
  return (
    <View style={{ position: 'absolute', left: _spacing }}>
      {data.map((_, index) => {
        return <PaginationDot key={index} index={index} scrollY={scrollY} />;
      })}
    </View>
  );
};

function GetStartedScreen({navigation}) {

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (ev) => {
      scrollY.value = ev.contentOffset.y / height;
    },
    onMomentumEnd: (ev) => {
      scrollY.value = Math.floor(ev.contentOffset.y / height);
    },
  });

  // const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    // registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [])

  return (
    <View style={styles.container}>
      <AnimatedFlatList
        data={_data}
        renderItem={(props) => <Item {...props} />}
        onScroll={onScroll}
        scrollEventThrottle={16}
        pagingEnabled
        decelerationRate="fast"
        bounces={false}
      />
      <Pagination scrollY={scrollY} data={_data} />
      <DetailsWrapper scrollY={scrollY} data={_data} />
      <View style={{position: 'absolute', width: '100%', bottom: height * 0.05}}>
        <Button onPress={() => navigation.navigate('SignUpScreen')} title={'SIGN UP'} style={{height: RFValue(45), width: '85%', color: '#124c7d', backgroundColor: "#fff", fontSize: RFValue(15), alignSelf: 'center'}}/>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: height * 0.02}}>
          <Text style={{textAlign: 'center', fontWeight: 500, fontSize: RFValue(15), textAlign: 'center', color: '#fff'}}>
            Already have an account?{'  '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={{color: '#fff', fontWeight: 700, fontSize: RFValue(15)}}>
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
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontWeight: '900',
    fontSize: RFValue(25)
  },
  description: {
    color: '#fff',
    fontSize: RFValue(15),
    fontWeight: '700',
    marginTop: height * 0.02
  }
});

export default GetStartedScreen;
