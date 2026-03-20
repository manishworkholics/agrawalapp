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
  Image,
} from "react-native";

import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";

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
      <StatusBar barStyle="dark-content" backgroundColor="#F8F7FB" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.topHeader}>
          {/* <Text style={styles.headerTitle}>Log In</Text> */}
        </View>

        <View style={styles.content}>
          <View style={styles.logoSection}>
            <LinearGradient
              colors={["#FFF1F5", "#FFFFFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoWrap}
            >
              <Image
                source={require("../../assets/logo.png")}
                style={styles.logo}
              />
            </LinearGradient>
          </View>

          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Hi, Welcome 👋</Text>
            <Text style={styles.subText}>
              Agrawal Group's Communication App
            </Text>
          </View>

          <View style={styles.formCard}>
            

            <Text style={styles.label}>Enter registered mobile no</Text>

            <View style={styles.inputWrap}>
              <Text style={styles.countryCode}>+91</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter Mobile Number"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={10}
                value={mobile}
                onChangeText={setMobile}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.loginBtnOuter}
              onPress={handleMobileSubmit}
              disabled={loading}
            >
              <LinearGradient
                colors={["#FF7BA5", "#D7265E"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.loginButton}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginText}>Log In</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.helpText}>
              We will send an OTP to verify your number
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F7FB",
  },

  container: {
    flex: 1,
  },

  topHeader: {
    paddingTop: 8,
    paddingBottom: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2C2C2C",
    letterSpacing: 0.2,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  logoSection: {
    alignItems: "center",
    marginBottom: 26,
  },

  logoWrap: {
    width: 108,
    height: 108,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F5DCE6",
    shadowColor: "#1F2937",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  logo: {
    width: 64,
    height: 64,
    resizeMode: "contain",
  },

  welcomeContainer: {
    marginBottom: 28,
  },

  welcomeText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#142B6F",
    marginBottom: 8,
    letterSpacing: 0.2,
    marginLeft:19
    
  },

  subText: {
    fontSize: 16,
    color: "#7C8594",
    lineHeight: 24,
        marginLeft:17
    
  },

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: "#EEEAF4",
    shadowColor: "#1F2937",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
    overflow: "hidden",
  },

  cardGlowOne: {
    position: "absolute",
    top: -24,
    right: -18,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(215, 38, 94, 0.05)",
  },

  cardGlowTwo: {
    position: "absolute",
    bottom: -26,
    left: -16,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255, 123, 165, 0.04)",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
    color: "#374151",
  },

  inputWrap: {
    height: 58,
    borderWidth: 1,
    borderColor: "#E6EAF0",
    borderRadius: 16,
    backgroundColor: "#FAFBFD",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  countryCode: {
    fontSize: 15,
    fontWeight: "700",
    color: "#D7265E",
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },

  loginBtnOuter: {
    marginTop: 24,
    borderRadius: 16,
    overflow: "hidden",
  },

  loginButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#D7265E",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },

  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  helpText: {
    textAlign: "center",
    marginTop: 14,
    fontSize: 13,
    color: "#8A94A6",
    lineHeight: 20,
  },
});