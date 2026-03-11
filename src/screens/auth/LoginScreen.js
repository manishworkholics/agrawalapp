import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";

import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen({ navigation }) {

  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMobileSubmit = async () => {

    if (mobile.length !== 10) {
      Alert.alert("Error", "Mobile number must be exactly 10 digits.");
      return;
    }

    setLoading(true);

    try {

      const response = await axios.post(
        "https://apps.actindore.com/api/parents/otp",
        {
          mobile_no: mobile,
        }
      );

      if (response.status === 200 && response.data.status) {

        navigation.replace("Otp", {
          mobile: mobile,
        });

      } else {

        Alert.alert(
          "Error",
          response.data.message || "Failed to send OTP."
        );

      }

    } catch (error) {

      Alert.alert("Error", "Error sending OTP. Please try again.");

    } finally {

      setLoading(false);

    }

  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.container}
      >

        {/* Header */}
        <Text style={styles.headerTitle}>Log In</Text>

        {/* Welcome */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Hi, Welcome 👋</Text>
          <Text style={styles.subText}>
            Agrawal Group's Communication App
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>

          <Text style={styles.label}>
            Enter registered mobile no
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Mobile Number"
            keyboardType="number-pad"
            maxLength={10}
            value={mobile}
            onChangeText={setMobile}
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleMobileSubmit}
            disabled={loading}
          >

            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginText}>Log In</Text>
            )}

          </TouchableOpacity>

        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  headerTitle: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#2c2c2c",
  },

  welcomeContainer: {
    marginBottom: 40,
  },

  welcomeText: {
    fontSize: 30,
    fontWeight: "700",
    color: "#0b1c57",
    marginBottom: 5,
  },

  subText: {
    fontSize: 16,
    color: "#777",
  },

  formContainer: {
    marginTop: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    color: "#333",
  },

  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 30,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },

  loginButton: {
    marginTop: 30,
    backgroundColor: "#B31217",
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

});