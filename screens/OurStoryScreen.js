import React, { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, ActivityIndicator, Text, ScrollView, TouchableOpacity, Dimensions, FlatList, BackHandler, ImageBackground } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
  interpolate,
  useDerivedValue,
  withRepeat,
  withSpring,
  Extrapolate,
} from 'react-native-reanimated';
import Constants from 'expo-constants';
import { RFValue } from 'react-native-responsive-fontsize';
import { query, collection, getDocs, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const { width, height } = Dimensions.get('window');
const _itemWidth = width * 0.6;
const _itemHeight = _itemWidth * 1.67;
const _spacing = 10;
const _itemWidthWithSpacing = _itemWidth + _spacing * 2;

function OurStoryScreen({ navigation }) {

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [])

  function Item({ item, index, scrollX, activeIndex }) {
    const currentIndex = useDerivedValue(() => {
      return scrollX.value / _itemWidthWithSpacing;
    });

    const inputRange = React.useMemo(() => [index - 1, index, index + 1]);

    const imageStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          currentIndex.value,
          inputRange,
          [0.5, 1, 0.5],
          Extrapolate.CLAMP
        ),
        transform: [
          {
            scale: interpolate(
              currentIndex.value,
              inputRange,
              [0.2, 1, 0],
              Extrapolate.CLAMP
            ),
          },
          {
            translateY:
              activeIndex.value === currentIndex.value
                ? withRepeat(
                  withTiming(-_spacing, { duration: 2000 }),
                  Infinity,
                  true
                )
                : withSpring(
                  interpolate(
                    currentIndex.value,
                    inputRange,
                    [_spacing * 4, -_spacing * 2, _spacing * 4],
                    Extrapolate.CLAMP
                  )
                ),
          },
        ],
      };
    });

    const containerStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateY: withSpring(
              interpolate(
                currentIndex.value,
                inputRange,
                [_itemHeight * 0.8, _itemHeight * 0.5, _itemHeight * 0.8],
                Extrapolate.CLAMP
              )
            ),
          },
        ],
      };
    });

    const wrapperStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateY: interpolate(
              currentIndex.value,
              inputRange,
              [_itemHeight * 0.1, 0, _itemHeight * 0.1],
              Extrapolate.CLAMP
            ),
          },
        ],
      };
    });
    return (
      <Animated.View
        style={[
          {
            width: _itemWidth,
            margin: _spacing,
            height: _itemHeight,
            overflow: 'hidden',
            borderRadius: 24,
          },
          wrapperStyle,
        ]}>
        <View
          style={{
            flex: 1,
            marginTop: height * 0.03,
            padding: _spacing,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                flex: 1,
                borderRadius: 24,
                backgroundColor: '#124c7d',
              },
              containerStyle,
            ]}
          />
          <View style={{ alignItems: 'center' }}>
            <Animated.Image
              source={{ uri: item.icon }}
              style={[
                {
                  width: _itemWidth * 0.7,
                  height: _itemWidth * 0.7,
                  marginBottom: _spacing,
                },
                imageStyle,
              ]}
            />
            <Text style={{ fontSize: 18, fontWeight: '700', color: 'white' }}>{item.name}</Text>
          </View>
        </View>
      </Animated.View>
    );
  }

  const scrollX = useSharedValue(0);
  const activeIndex = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onMomentumBegin: (ev) => {
      activeIndex.value = -1;
    },
    onMomentumEnd: (ev) => {
      activeIndex.value = Math.floor(
        ev.contentOffset.x / _itemWidthWithSpacing
      );
    },
    onScroll: (ev) => {
      scrollX.value = ev.contentOffset.x;
    },
  });

  const [loading, setLoading] = useState(true);

  const data = [
    {
      key: 1,
      name: 'Ahmed Beltagy',
      icon: "https://cdn-icons-png.flaticon.com/512/4331/4331014.png"
    },
    {
      key: 2,
      name: 'Adham Shams',
      icon: "https://cdn-icons-png.flaticon.com/512/4333/4333607.png"
    },
    {
      key: 3,
      name: 'Omar Ashraf',
      icon: "https://cdn-icons-png.flaticon.com/512/4333/4333609.png",
    },
    {
      key: 4,
      name: 'Salma Ahmed',
      icon: "https://cdn-icons-png.flaticon.com/512/4333/4333613.png",
    },
    {
      key: 5,
      name: 'Ibrahim Ashraf',
      icon: "https://cdn-icons-png.flaticon.com/512/4333/4333614.png",
    },
  ]

  const [lastFiveBlogs, setLastFiveBlogs] = useState([]);

  useEffect(() => {
    const getLastFiveItems = async () => {
      try {
        const q = query(collection(db, "blogs"), orderBy('timestamp', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.docs)
        const lastFiveItems = querySnapshot.docs.map(doc => doc.data());
        setLastFiveBlogs(lastFiveItems)
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    // Call the function to retrieve the last 5 items
    getLastFiveItems();
  }, []);

  return (
    <SafeAreaView style={styles.background}>
      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: RFValue(25), fontWeight: 'bold', marginTop: height * 0.02, marginLeft: 20 }}>Meet the Team</Text>
        <Text style={{ marginHorizontal: 20, fontSize: RFValue(12), marginTop: height * 0.01, marginBottom: -_itemHeight * 0.4 }}>Get to know the talented individuals who bring passion, expertise, and a collaborative spirit to our team, driving innovation and success.</Text>
        <AnimatedFlatList
          data={data}
          keyExtractor={(item) => item.key}
          style={{ flexGrow: 0 }}
          horizontal
          onScroll={onScroll}
          scrollEventThrottle={16}
          snapToInterval={_itemWidthWithSpacing}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: (width - _itemWidthWithSpacing) / 2,
          }}
          decelerationRate="fast"
          renderItem={({ item, index }) => {
            return (
              <Item
                item={item}
                index={index}
                scrollX={scrollX}
                activeIndex={activeIndex}
              />
            );
          }}
        />
        <Text style={{ marginHorizontal: 20, fontSize: RFValue(12), marginTop: height * 0.02 }}>Anoraks is a dynamic youth-focused travel agency that seeks to infuse energetic, humorous, and aesthetic elements into travel experiences, fostering the creation of unforgettable memories and bringing people together. At Anoraks, our guiding insight is rooted in our desire to share the transformative impact of travel that has bestowed upon us a heightened sense of self-confidence, valuable experiences, and the ability to weave compelling narratives. Through a commitment to novelty and perfectionism, we curate the most unique and unforgettable events.</Text>
        <Text style={{ marginHorizontal: 20, fontSize: RFValue(12), marginTop: height * 0.02 }}>Our journey began with the aspiration to share our travel adventures, connect with individuals of inspiring mindsets, and offer a reprieve from the daily stresses, encouraging people to bring out the best in themselves. The inception of Anoraks occurred on December 16, 2021. Our dedication to this endeavor has involved hard work, sacrifice of busy schedules, meticulous research for optimal destinations, handling reservations, negotiating deals, strategic planning, experimentation, and creative design.</Text>
        <Text style={{ marginHorizontal: 20, fontSize: RFValue(12), marginTop: height * 0.02 }}>As a brand, Anoraks surpasses all expectations, thanks to the tireless efforts of our team members. As we refine our online persona and set our meticulously crafted plans into action, we are poised to elevate the brand to new heights, continually enhancing the allure of our offerings.</Text>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: height * 0.02 }}>
          <Text style={{ fontSize: RFValue(25), fontWeight: 'bold', marginLeft: 20 }}>Blog Posts</Text>
          <TouchableOpacity onPress={() => null} style={{ marginLeft: 'auto', marginRight: 20 }}>
            <Text style={{ fontSize: RFValue(14), marginLeft: 20, color: '#1247cd', textDecorationLine: 'underline' }}>See All</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ marginVertical: height * 0.05, textAlign: 'center', fontSize: RFValue(15) }}>No blogs found</Text>
        <Text style={{ fontSize: RFValue(25), fontWeight: 'bold', marginTop: height * 0.02, marginLeft: 20 }}>Join the Team</Text>
        <Text style={{ marginHorizontal: 20, fontSize: RFValue(12), marginHorizontal: 20, marginTop: height * 0.01 }}>Explore exciting opportunities and join the team by selecting from our diverse range of roles, each offering a unique pathway to contribute your skills and expertise.</Text>
        <View style={{ marginHorizontal: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity>
            <ImageBackground source={require('../assets/content-creator.jpg')} style={{ width: width * 0.44, height: height * 0.2, marginTop: height * 0.02, backgroundColor: '#000', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }} imageStyle={{ borderRadius: 12, opacity: 0.7, resizeMode: 'cover' }}>
              <Text style={{ fontSize: RFValue(15), fontWeight: 'bold', color: '#fff', textDecorationLine: 'underline' }}>Content Creator</Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity>
            <ImageBackground source={require('../assets/investor.jpg')} style={{ width: width * 0.44, height: height * 0.2, marginTop: height * 0.02, backgroundColor: '#000', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }} imageStyle={{ borderRadius: 12, opacity: 0.7, resizeMode: 'cover' }}>
              <Text style={{ fontSize: RFValue(15), fontWeight: 'bold', color: '#fff', textDecorationLine: 'underline' }}>Investor</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <ImageBackground source={require('../assets/organizer.jpg')} style={{ width: width - 40, height: height * 0.2, marginTop: height * 0.02, alignSelf: 'center', backgroundColor: '#000', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }} imageStyle={{ borderRadius: 12, opacity: 0.7, resizeMode: 'cover' }}>
            <Text style={{ fontSize: RFValue(25), fontWeight: 'bold', color: '#fff', textDecorationLine: 'underline' }}>Organizer</Text>
          </ImageBackground>
        </TouchableOpacity>
        <Text style={{ textAlign: 'center', marginVertical: height * 0.02 }}>© {new Date().getFullYear()} Anoraks Travels</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OurStoryScreen;