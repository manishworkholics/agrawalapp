import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  logo: {
    width: 200,
    height: 80,
    resizeMode: "contain",
  },

});