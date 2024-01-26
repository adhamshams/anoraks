import React, { useState, useEffect } from "react";
import { View, SafeAreaView, Text, Dimensions, TouchableOpacity } from "react-native";
import { signInWithEmailAndPassword, getAuth, sendPasswordResetEmail } from 'firebase/auth'
import Button from "../components/Button";
import { LinearGradient } from 'expo-linear-gradient';
import { createStackNavigator } from '@react-navigation/stack';
import { RFValue } from 'react-native-responsive-fontsize';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { MotiView, MotiText, useDynamicAnimation } from 'moti';
import { AntDesign } from '@expo/vector-icons';

const InnerStack = createStackNavigator();

const { height, width } = Dimensions.get('window');

const InnerStackScreens = () => {
  return (
    <InnerStack.Navigator>
      <InnerStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <InnerStack.Screen name="ForgetPassword" component={ForgetPassword} options={{ headerShown: false }} />
    </InnerStack.Navigator>
  );
};

const Login = ({ navigation }) => {

  const dynamicAnimation = useDynamicAnimation(() => ({
    opacity: 0,
    translateY: 40,
  }));

  useEffect(() => {
    setTimeout(
      () =>
        dynamicAnimation.animateTo((current) => ({
          ...current,
          opacity: 1,
          translateY: 0,
        })),
      200
    );
  }, []);

  const auth = getAuth();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const checkData = async () => {
    setLoading(true)
    if (email.length === 0) {
      setEmailError(true)
      setLoading(false)
      alert('Please enter your email address')
    }
    else if (password.length === 0) {
      setLoading(false)
      setPasswordError(true)
      alert('Please enter your password')
    }
    else {
      signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        // Signed in
        navigation.navigate('MainTabs')
      })
      .catch((error) => {
        var errorMessage = error.message;
        console.log(errorMessage)
        if (errorMessage === "Firebase: Error (auth/invalid-credential).") {
          alert("Incorrect email or password")
          setEmailError(true)
          setPasswordError(true)
          setLoading(false)
        }
        else {
          alert("An error has occured")
          setLoading(false)
        }
      })
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#fff' }}>
      <MotiView style={{ marginHorizontal: width * 0.07 }} state={dynamicAnimation} delay={300}>
        <MotiText state={dynamicAnimation} style={{ color: '#124c7d', fontSize: RFValue(15), fontWeight: 700, marginTop: height * 0.02 }}>Email</MotiText>
        <BottomSheetTextInput
          placeholderTextColor="rgba(0,0,0,0.3)"
          shouldCancelWhenOutside
          placeholder="Ex: name@mail.com"
          style={
            {
              borderBottomWidth: 2,
              borderBottomColor: emailError ? 'red' : '#124c7d',
              height: RFValue(45),
              fontSize: RFValue(15),
              color: '#124c7d'
            }
          }
          returnKeyType={'next'}
          onSubmitEditing={() => { this.secondTextInput.focus() }}
          blurOnSubmit={false}
          maxLength={50}
          textContentType="emailAddress"
          autoComplete="email"
          keyboardType="email-address"
          keyboardAppearance="dark"
          onChangeText={(text) => { setEmail(text), emailError ? setEmailError(false) : null }}
          value={email}
        />
        <MotiText state={dynamicAnimation} style={{ color: '#124c7d', fontSize: RFValue(15), fontWeight: 700, marginTop: height * 0.02 }}>Password</MotiText>
        <BottomSheetTextInput
          placeholderTextColor="rgba(0,0,0,0.3)"
          shouldCancelWhenOutside
          placeholder="********"
          secureTextEntry={true}
          returnKeyType={'go'}
          ref={(input) => { this.secondTextInput = input }}
          style={
            {
              borderBottomWidth: 2,
              borderBottomColor: passwordError ? 'red' : '#124c7d',
              height: RFValue(45),
              fontSize: RFValue(15),
              color: '#124c7d'
            }
          }
          onSubmitEditing={() => checkData()}
          blurOnSubmit={false}
          maxLength={50}
          textContentType="password"
          autoComplete="password"
          keyboardAppearance="dark"
          onChangeText={(text) => { setPassword(text), passwordError ? setPasswordError(false) : null }}
          value={password}
        />
        <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')} style={{ marginLeft: 'auto' }}>
          <MotiText state={dynamicAnimation} style={{ color: '#124c7d', fontSize: RFValue(15), fontWeight: 700, marginTop: height * 0.02 }}>Forget Password?</MotiText>
        </TouchableOpacity>
      </MotiView>
      <MotiView state={dynamicAnimation} delay={500} style={{ justifyContent: 'center', marginHorizontal: width * 0.07, marginBottom: height * 0.01 }}>
        <Button isLoading={loading} onPress={() => checkData()} title={'LOGIN'} style={{ height: RFValue(45), width: '100%', color: '#fff', backgroundColor: "#124c7d", fontSize: RFValue(15), alignSelf: 'center' }} />
      </MotiView>
    </SafeAreaView>
  );
};

const ForgetPassword = () => {

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const checkData = async () => {
    setLoading(true)
    setSuccess(false)
    setEmailError(false)
    if (email.length === 0) {
      setEmailError(true)
      setLoading(false)
      alert('Please enter your email address')
    }
    else {
      const auth = getAuth();
      sendPasswordResetEmail(auth, email)
        .then(() => {
          // Password reset email sent!
          setLoading(false)
          setSuccess(true)
        })
        .catch((error) => {
          var errorMessage = error.message;
          if (errorMessage === "Firebase: Error (auth/invalid-email).") {
            alert("Please enter a valid email address")
            setEmailError(true)
            setLoading(false)
          }
          else {
            alert("An error has occured")
            setLoading(false)
          }
        });
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text style={{ marginTop: height * 0.02, fontSize: RFValue(12), textAlign: 'center', color: '#124c7d', marginHorizontal: width * 0.07 }}>Enter the email address associated with your account and we'll send you an email with instructions to reset your password.</Text>
      <BottomSheetTextInput
        keyboardType="email-address"
        autoCapitalize="none"
        textContentType="emailAddress"
        keyboardAppearance="dark"
        autoComplete='email'
        style={
          {
            borderBottomWidth: 2,
            borderBottomColor: emailError ? 'red' : '#124c7d',
            height: RFValue(45),
            fontSize: RFValue(15),
            color: '#124c7d',
            marginHorizontal: width * 0.07,
            marginTop: height * 0.02
          }
        }
        placeholderTextColor="rgba(0,0,0,0.3)"
        shouldCancelWhenOutside
        placeholder="Ex: name@mail.com"
        onChangeText={(text) => { setEmail(text); emailError ? setEmailError(false) : null }}
        value={email}
        returnKeyType={'go'}
        onSubmitEditing={() => checkData()}
        blurOnSubmit={false}
      />
      {success ? <Text style={{ color: 'green', fontSize: RFValue(12), marginTop: height * 0.02, textAlign: 'center' }}>An email has been sent.</Text> : null}
      <View style={{ justifyContent: 'center', marginHorizontal: width * 0.07, marginBottom: height * 0.01, marginTop: 'auto' }}>
        <Button isLoading={loading} onPress={() => checkData()} title={'SEND EMAIL'} style={{ height: RFValue(45), width: '100%', color: '#fff', backgroundColor: "#124c7d", fontSize: RFValue(15), alignSelf: 'center' }} />
      </View>
    </SafeAreaView>
  );
};

function LoginScreen({ navigation, route }) {

  const bottomSheetModalRef = React.useRef(null);
  const snapPoints = React.useMemo(() => ['70%']);

  const showModal = React.useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  useEffect(() => {
    showModal()
  }, [])

  return (
    <BottomSheetModalProvider>
      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#3470b4', '#275589', '#124c7d']} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <TouchableOpacity style={{ backgroundColor: '#fff', width: RFValue(40), height: RFValue(40), borderRadius: 12, justifyContent: 'center', marginTop: height * 0.02, marginHorizontal: width * 0.07, alignItems: 'center' }} onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color="#124c7d" />
          </TouchableOpacity>
          <Text style={{ color: '#fff', fontSize: RFValue(35), fontWeight: 700, marginTop: height * 0.02, marginLeft: width * 0.07 }}>Login To Your {'\n'}Account</Text>
          <BottomSheetModal handleIndicatorStyle={{ backgroundColor: 'transparent' }} enablePanDownToClose={false} ref={bottomSheetModalRef} keyboardBehavior="interactive" keyboardBlurBehavior="restore" snapPoints={snapPoints}>
            <InnerStackScreens />
          </BottomSheetModal>
        </SafeAreaView>
      </LinearGradient>
    </BottomSheetModalProvider>
  );
}

export default LoginScreen;