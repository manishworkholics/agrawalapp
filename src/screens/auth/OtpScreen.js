import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function OtpScreen({ navigation, route }) {

  useFocusEffect(
    React.useCallback(() => {

      const onBackPress = () => {
        return true; // block back
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove();

    }, [])
  );

  const { mobile } = route.params;

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);

  const inputs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (text, index) => {

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }

    const otpCode = newOtp.join("");

    if (otpCode.length === 4) {
      verifyOtp(otpCode);
    }
  };

  const handleBackspace = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && !otp[index]) {
      inputs.current[index - 1].focus();
    }
  };

  const verifyOtp = async (code) => {

    const otpCode = code || otp.join("");

    if (otpCode.length !== 4) {
      Alert.alert("Error", "Enter complete OTP");
      return;
    }

    setLoading(true);

    try {

      const response = await axios.post(
        "https://apps.actindore.com/api/parents/otp-verify",
        {
          mobile_no: mobile,
          otp: otpCode,
        }
      );

      if (response.status === 200 && response.data.status) {

        const token = response.data.token;
        const user = response.data.user;

        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));

        navigation.reset({
          index: 0,
          routes: [{ name: "Welcome" }]
        });

      } else {

        Alert.alert(
          "Error",
          response.data.message || "OTP verification failed"
        );

        setOtp(["", "", "", ""]);
      }

    } catch (error) {

      Alert.alert("Error", "Error verifying OTP");

    } finally {

      setLoading(false);
    }
  };

  const resendOtp = async () => {

    setTimer(30);

    try {

      await axios.post(
        "https://apps.actindore.com/api/parents/otp",
        {
          mobile_no: mobile,
        }
      );

      Alert.alert("Success", "OTP resent successfully");

    } catch (error) {

      Alert.alert("Error", "Failed to resend OTP");

    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.container}>

        <Text style={styles.header}>OTP Verification</Text>

        <Text style={styles.subtitle}>
          Enter OTP sent to {mobile}
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={styles.otpBox}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleBackspace(e, index)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => verifyOtp()}
          disabled={loading}
        >

          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify OTP</Text>
          )}

        </TouchableOpacity>

        <View style={styles.resendContainer}>

          {timer > 0 ? (
            <Text style={styles.timer}>
              Resend OTP in {timer}s
            </Text>
          ) : (
            <TouchableOpacity onPress={resendOtp}>
              <Text style={styles.resend}>Resend OTP</Text>
            </TouchableOpacity>
          )}

        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: "#fff"
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center"
  },

  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0b1c57",
    marginBottom: 10
  },

  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 40
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly"
  },

  otpBox: {
    width: 65,
    height: 65,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
    fontSize: 24,
    backgroundColor: "#fafafa"
  },

  button: {
    marginTop: 40,
    height: 55,
    backgroundColor: "#B31217",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  },

  resendContainer: {
    marginTop: 25,
    alignItems: "center"
  },

  timer: {
    color: "#777"
  },

  resend: {
    color: "#e49719",
    fontWeight: "600"
  }

});