import React, { useEffect } from "react";
import { View, Image, StyleSheet, Text, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      setTimeout(() => {
        if (token) {
          navigation.replace("Welcome");
        } else {
          navigation.replace("Login");
        }
      }, 2000);
    } catch (error) {
      navigation.replace("Login");
    }
  };

  return (
    <LinearGradient
      colors={["#FFF8FB", "#FFF1F5", "#FFFFFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF8FB" />

        

        <View style={styles.logoCard}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />
        </View>

        <Text style={styles.appName}>eMessenger</Text>
        <Text style={styles.tagline}>Agrawal Group's Communication App</Text>

        <View style={styles.loaderRow}>
          <View style={styles.dot} />
          <View style={styles.dotMiddle} />
          <View style={styles.dot} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 24
  },

  

  logoCard: {
    width: 180,
    height: 180,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F5DCE6",
    shadowColor: "#1F2937",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    marginBottom: 24
  },

  logo: {
    width: 110,
    height: 110,
    resizeMode: "contain"
  },

  appName: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: 0.3,
    marginBottom: 8
  },

  tagline: {
    fontSize: 15,
    color: "#8A94A6",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 26
  },

  loaderRow: {
    flexDirection: "row",
    alignItems: "center"
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F3B6CB",
    marginHorizontal: 5
  },

  dotMiddle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#D7265E",
    marginHorizontal: 5
  }
});