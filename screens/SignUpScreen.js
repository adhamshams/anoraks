import React, { useState, useEffect } from "react";
import { View, SafeAreaView, Text, Dimensions, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import PhoneInput from 'react-native-phone-number-input';
import Button from "../components/Button";
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../firebase'
import { updateProfile, getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'
import { RFValue } from 'react-native-responsive-fontsize';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { MotiView, MotiText, useDynamicAnimation } from 'moti';
import { CodeField, Cursor, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { AntDesign } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

const InnerStack = createStackNavigator();

const { height, width } = Dimensions.get('window');

const InnerStackScreens = () => {
  return (
    <InnerStack.Navigator>
      <InnerStack.Screen name="PersonalInformation" component={PersonalInformation} options={{ headerShown: false }} />
      <InnerStack.Screen name="VerifyPhoneNumber" component={VerifyPhoneNumber} options={{ headerShown: false }} />
      <InnerStack.Screen name="SetEmailAndPassword" component={SetEmailAndPassword} options={{ headerShown: false, gestureEnabled: false }} />
    </InnerStack.Navigator>
  );
};

const PersonalInformation = ({ navigation }) => {

  const [loading, setLoading] = useState(false);

  const [focus, setFocus] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);

  const [countryCode, setCountryCode] = useState("+20");

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

  useEffect(() => {
    if (phoneNumber.includes(countryCode)) {
      const n = phoneNumber.replace(countryCode, '')
      setPhoneNumber(n)
    }
  }, [phoneNumber, countryCode])

  const checkData = async () => {
    setLoading(true)
    setFirstNameError(false)
    setLastNameError(false)
    setPhoneNumberError(false)
    if (firstName.length === 0) {
      setFirstNameError(true)
      alert('Please enter your first name')
      setLoading(false)
    }
    else if (lastName.length === 0) {
      setLastNameError(true)
      alert('Please enter your last name')
      setLoading(false)
    }
    else if (phoneNumber.length === 0) {
      setPhoneNumberError(true)
      alert('Please enter your phone number')
      setLoading(false)
    }
    else {
      const data = JSON.stringify({
        to: countryCode + phoneNumber,
        channel: "sms",
      });
      const response = await fetch(`${process.env.EXPO_PUBLIC_verify}/start-verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });
      const json = await response.json();
      if (json.success) {
        navigation.navigate('VerifyPhoneNumber', { firstName: firstName, lastName: lastName, phoneNumber: countryCode + phoneNumber })
        setLoading(false)
      }
      else {
        if (json.error.includes("Invalid parameter `To`:")) {
          setLoading(false)
          setErrorMsg('Please enter a valid phone number')
          setNumberError(true)
        }
        else {
          setLoading(false)
          setErrorMsg('An error has occured')
        }
      }
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#fff' }}>
      <MotiView state={dynamicAnimation} delay={300} style={{ paddingHorizontal: width * 0.07 }}>
        <MotiText state={dynamicAnimation} style={{ color: '#124c7d', fontSize: RFValue(15), fontWeight: 700, marginTop: height * 0.02 }}>First Name</MotiText>
        <BottomSheetTextInput
          placeholderTextColor="rgba(0,0,0,0.3)"
          shouldCancelWhenOutside
          placeholder="Ex: Adham"
          style={
            {
              borderBottomWidth: 2,
              borderBottomColor: firstNameError ? 'red' : '#124c7d',
              height: RFValue(45),
              fontSize: RFValue(15),
              color: '#124c7d'
            }
          }
          returnKeyType={'next'}
          onSubmitEditing={() => { this.secondTextInput.focus() }}
          blurOnSubmit={false}
          maxLength={50}
          textContentType="givenName"
          autoComplete="name-given"
          onFocus={() => setFocus(false)}
          keyboardAppearance="dark"
          onChangeText={(text) => { setFirstName(text); firstNameError ? setFirstNameError(false) : null }}
          value={firstName}
        />
        <MotiText state={dynamicAnimation} style={{ color: '#124c7d', fontSize: RFValue(15), fontWeight: 700, marginTop: height * 0.02 }}>Last Name</MotiText>
        <BottomSheetTextInput
          placeholderTextColor="rgba(0,0,0,0.3)"
          shouldCancelWhenOutside
          placeholder="Ex: Amr"
          ref={(input) => { this.secondTextInput = input }}
          style={
            {
              borderBottomWidth: 2,
              borderBottomColor: lastNameError ? 'red' : '#124c7d',
              height: RFValue(45),
              fontSize: RFValue(15),
              color: '#124c7d'
            }
          }
          returnKeyType={'next'}
          onSubmitEditing={() => setFocus(true)}
          blurOnSubmit={false}
          maxLength={50}
          textContentType="familyName"
          autoComplete="family-name"
          onFocus={() => setFocus(false)}
          keyboardAppearance="dark"
          onChangeText={(text) => { setLastName(text); lastNameError ? setLastNameError(false) : null }}
          value={lastName}
        />
        <MotiText state={dynamicAnimation} style={{ color: '#124c7d', fontSize: RFValue(15), fontWeight: 700, marginTop: height * 0.02 }}>Phone Number</MotiText>
        <PhoneInput
          value={phoneNumber}
          defaultCode="EG"
          layout="first"
          focus={focus}
          withDarkTheme={true}
          onChangeText={(text) => { setPhoneNumber(text); phoneNumberError ? setPhoneNumberError(false) : null }}
          onChangeCountry={(country) => {
            setCountryCode('+' + country.callingCode)
          }}
          containerStyle={{ backgroundColor: '#fff', borderBottomWidth: 2, borderBottomColor: phoneNumberError ? 'red' : '#124c7d', width: Dimensions.get('window').width * 0.85 }}
          textContainerStyle={{ backgroundColor: '#fff', height: '100%' }}
          textInputStyle={{ color: '#124c7d', fontSize: RFValue(15) }}
          codeTextStyle={{ color: '#124c7d' }}
          flagButtonStyle={{ color: '#124c7d' }}
        />
      </MotiView>
      <MotiView state={dynamicAnimation} delay={500} style={{ justifyContent: 'center', paddingHorizontal: width * 0.07, marginBottom: height * 0.01 }}>
        <Button isLoading={loading} onPress={() => checkData()} title={'NEXT STEP'} style={{ height: RFValue(45), width: '100%', color: '#fff', backgroundColor: "#124c7d", fontSize: RFValue(15), alignSelf: 'center' }} />
      </MotiView>
    </SafeAreaView>
  );
};

function VerifyPhoneNumber({ navigation, route }) {

  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState('');

  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let intervalId;

    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [timer]);

  useEffect(() => {
    if (otp.length === 6)
      verifyNumber();
  }, [otp]);

  const resendSMS = async () => {
    if (timer === 0) {

    }
  }

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    otp,
    setOtp,
  });

  const verifyNumber = async () => {
    setLoading(true);
    const data = JSON.stringify({
      to: route.params.phoneNumber,
      code: otp,
    });
    const response = await fetch(`${process.env.EXPO_PUBLIC_verify}/check-verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    const json = await response.json();
    if (json.success) {
      navigation.navigate('SetEmailAndPassword', { firstName: route.params.firstName, lastName: route.params.lastName, phoneNumber: route.params.phoneNumber })
      setLoading(false)
    }
    else {
      if (json.message === "Incorrect token.") {
        setLoading(false)
        alert('Invalid Code')
      }
      else {
        setLoading(false)
        alert('An error has occured')
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Text style={{ marginTop: height * 0.02, fontSize: RFValue(12), textAlign: 'center', color: '#124c7d', marginHorizontal: width * 0.07 }}>We've sent a code to {route.params.phoneNumber}</Text>
      <CodeField
        {...props}
        value={otp}
        autoFocus
        onChangeText={setOtp}
        cellCount={6}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        keyboardAppearance='dark'
        textContentType="oneTimeCode"
        autoComplete='sms-otp'
        blurOnSubmit={false}
        renderCell={({ index, symbol, isFocused }) => (
          <View
            // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[styles.cellRoot, isFocused && styles.focusCell]}>
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: height * 0.03, marginHorizontal: width * 0.07 }}>
        <Text style={{ fontSize: RFValue(12), color: '#193657' }}>Didn't receive an SMS?</Text>
        <TouchableOpacity onPress={() => resendSMS()}>
          <Text style={{ color: timer > 0 ? 'grey' : '#124c7d', fontWeight: 700, fontSize: RFValue(12) }}>
            {' '}{timer > 0 ? timer + 's' : 'Resend SMS'}
          </Text>
        </TouchableOpacity>
      </View>
      {loading ? <ActivityIndicator size="small" color="#124c7d" animating={true} style={{ marginTop: height * 0.02 }} /> : null}
    </SafeAreaView>
  )

}

const SetEmailAndPassword = ({ navigation, route }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [conditionsMet, setConditionsMet] = useState([]);
  const [passowrdStrength, setPasswordStrength] = useState('Weak');
  const [color, setColor] = useState('red');

  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    const arr = conditionsMet.slice()
    if (password.length >= 8 && !arr.includes('length')) {
      arr.push('length')
    }
    else if (password.length < 8 && arr.includes('length')) {
      arr.splice(arr.indexOf('length'), 1);
    }
    if (/\d/.test(password) && !arr.includes('number')) {
      arr.push('number')
    }
    else if (!/\d/.test(password) && arr.includes('number')) {
      arr.splice(arr.indexOf('number'), 1);
    }
    if (/[A-Z]/.test(password) && !arr.includes('upper')) {
      arr.push('upper')
    }
    else if (!/[A-Z]/.test(password) && arr.includes('upper')) {
      arr.splice(arr.indexOf('upper'), 1);
    }
    if (arr.length <= 1) {
      setPasswordStrength('Weak')
      setColor('red')
    }
    else if (arr.length === 2) {
      setPasswordStrength('Medium')
      setColor('orange')
    }
    else if (arr.length === 3) {
      setPasswordStrength('Strong')
      setColor('green')
    }
    setConditionsMet(arr)
  }, [password])

  const checkData = async () => {
    setLoading(true)
    setEmailError(false)
    setConfirmPasswordError(false)
    setPasswordError(false)
    if (email.length === 0) {
      setEmailError(true)
      alert('Please enter your email address')
      setLoading(false)
    }
    else if (password.length === 0) {
      setPasswordError(true)
      alert('Please enter a password')
      setLoading(false)
    }
    else if (passowrdStrength !== 'Strong') {
      setPasswordError(true)
      alert('Please fulfill all password requirements')
      setLoading(false)
    }
    else if (confirmPassword !== password) {
      setConfirmPasswordError(true)
      alert('Passwords do not match')
      setLoading(false)
    }
    else {
      createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
        const results = await Promise.allSettled([
          setDoc(doc(db, "users", auth.currentUser.uid), {
            firstName: route.params.firstName,
            lastName: route.params.lastName,
            phoneNumber: route.params.phoneNumber,
          }),
          updateProfile(auth.currentUser, {
            displayName: route.params.firstName
          }),
        ])
        if (results[0].status === 'rejected' || results[1].status === 'rejected') {
          setLoading(false)
          alert('An error has occured')
        } else {
          setLoading(false)
          navigation.navigate('MainTabs')
        }
      }
      ).catch((error) => {
        setLoading(false)
        if (error.code === 'auth/email-already-in-use') {
          alert('Email already in use')
        } else if (error.code === 'auth/invalid-email') {
          alert('Invalid email address')
        } else {
          alert('An error has occured')
        }
      })
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', display: 'flex' }}>
      <Text style={{ color: '#193657', fontSize: RFValue(12), textAlign: 'center', marginTop: height * 0.02, marginHorizontal: width * 0.07 }}>Your password should contain a minimum of eight characters. Please use a combination of uppercase and lowercase letters along with numbers.</Text>
      <Text style={{ color: '#124c7d', fontSize: RFValue(15), fontWeight: 700, marginTop: height * 0.02, marginHorizontal: width * 0.07 }}>Email</Text>
      <BottomSheetTextInput
        placeholderTextColor="rgba(0,0,0,0.3)"
        shouldCancelWhenOutside
        placeholder="Ex: name@mail.com"
        autoFocus
        style={
          {
            borderBottomWidth: 2,
            borderBottomColor: emailError ? 'red' : '#124c7d',
            height: RFValue(45),
            fontSize: RFValue(15),
            color: '#124c7d',
            marginHorizontal: width * 0.07
          }
        }
        returnKeyType={'next'}
        onSubmitEditing={() => { this.thirdTextInput.focus() }}
        blurOnSubmit={false}
        maxLength={50}
        autoComplete="email"
        keyboardType="email-address"
        keyboardAppearance="dark"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <Text style={{ color: '#124c7d', fontSize: RFValue(15), fontWeight: 700, marginTop: height * 0.02, marginHorizontal: width * 0.07 }}>Password</Text>
      <BottomSheetTextInput
        placeholderTextColor="rgba(0,0,0,0.3)"
        shouldCancelWhenOutside
        passwordRules="minlength: 8; required: lower; required: upper; required: digit;"
        placeholder="********"
        ref={(input) => { this.thirdTextInput = input }}
        style={
          {
            borderBottomWidth: 2,
            borderBottomColor: passwordError ? 'red' : '#124c7d',
            height: RFValue(45),
            fontSize: RFValue(15),
            color: '#124c7d',
            marginHorizontal: width * 0.07
          }
        }
        returnKeyType={'next'}
        onSubmitEditing={() => this.fourthTextInput.focus()}
        blurOnSubmit={false}
        maxLength={50}
        secureTextEntry={true}
        autoComplete="password-new"
        keyboardAppearance="dark"
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <Text style={{ color: '#124c7d', fontSize: RFValue(15), fontWeight: 700, marginTop: height * 0.02, marginHorizontal: width * 0.07 }}>Confirm Password</Text>
      <BottomSheetTextInput
        placeholderTextColor="rgba(0,0,0,0.3)"
        shouldCancelWhenOutside
        placeholder="********"
        ref={(input) => { this.fourthTextInput = input }}
        style={
          {
            borderBottomWidth: 2,
            borderBottomColor: confirmPasswordError ? 'red' : '#124c7d',
            height: RFValue(45),
            fontSize: RFValue(15),
            color: '#124c7d',
            marginHorizontal: width * 0.07
          }
        }
        returnKeyType={'done'}
        onSubmitEditing={() => checkData()}
        blurOnSubmit={false}
        maxLength={50}
        secureTextEntry={true}
        autoComplete="password-new"
        keyboardAppearance="dark"
        onChangeText={(text) => setConfirmPassword(text)}
        value={confirmPassword}
      />
      <View style={{ width: '100%', flexDirection: 'row', display: 'flex', marginTop: height * 0.02, alignItems: 'center' }}>
        <View style={{ width: '26%', height: 4, backgroundColor: password.length > 0 ? color : 'gray', marginLeft: width * 0.07 }} />
        <View style={{ width: '26%', height: 4, marginLeft: width * 0.04, backgroundColor: passowrdStrength !== 'Weak' && password.length > 0 ? color : 'gray' }} />
        <View style={{ width: '26%', height: 4, marginLeft: width * 0.04, backgroundColor: passowrdStrength === 'Strong' && password.length > 0 ? color : 'gray' }} />
      </View>
      <Text style={{ marginTop: height * 0.02, fontSize: RFValue(12), color: '#193657', textAlign: 'center' }}>Password Strength: <Text style={{ fontWeight: 900 }}>{password.length > 0 ? passowrdStrength : ''}</Text></Text>
      <View style={{ justifyContent: 'center', marginHorizontal: width * 0.07, marginTop: 'auto' }}>
        <Button isLoading={loading} onPress={() => checkData()} title={'SIGN UP'} style={{ height: RFValue(45), width: '100%', color: '#fff', backgroundColor: "#124c7d", fontSize: RFValue(15), alignSelf: 'center', marginBottom: height * 0.01 }} />
      </View>
    </SafeAreaView>
  )

}

function SignUpScreen({ navigation }) {

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
          <Text style={{ color: '#fff', fontSize: RFValue(35), fontWeight: 700, marginLeft: width * 0.07, marginTop: height * 0.02 }}>Create Your {'\n'}Account</Text>
          <BottomSheetModal handleIndicatorStyle={{ backgroundColor: 'transparent' }} enablePanDownToClose={false} ref={bottomSheetModalRef} keyboardBehavior="interactive" keyboardBlurBehavior="restore" snapPoints={snapPoints}>
            <InnerStackScreens />
          </BottomSheetModal>
        </SafeAreaView>
      </LinearGradient>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginTop: 20,
  },
  cellRoot: {
    width: 45,
    height: 50,
    borderBottomColor: '#124c7d',
    borderBottomWidth: 2,
    marginLeft: 10
  },
  cellText: {
    color: '#124c7d',
    fontSize: RFValue(25),
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: '#193657',
    borderBottomWidth: 2,
  }
});

export default SignUpScreen;