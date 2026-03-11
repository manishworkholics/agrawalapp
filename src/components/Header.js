import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";

export default function Header() {

  return (

    <LinearGradient
      colors={["#FF4B5C", "#B31217"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >

      <SafeAreaView edges={["top"]} style={styles.safeArea}>

        <View style={styles.container}>

          {/* LEFT SIDE */}

          <View style={styles.left}>

            <View style={styles.logoCircle}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.logo}
              />
            </View>

            <Text style={styles.appName}>eMessenger</Text>

          </View>

          {/* RIGHT SIDE */}

          <TouchableOpacity style={styles.searchBtn}>

            <Icon name="search" size={22} color="#fff" />

            <View style={styles.badge}>
              <Text style={styles.badgeText}>1</Text>
            </View>

          </TouchableOpacity>

        </View>

      </SafeAreaView>

    </LinearGradient>

  );

}

const styles = StyleSheet.create({

  safeArea: {
    backgroundColor: "transparent"
  },

  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18
  },

  left: {
    flexDirection: "row",
    alignItems: "center"
  },

  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },

  logo: {
    width: 24,
    height: 24,
    resizeMode: "contain"
  },

  appName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff"
  },

  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center"
  },

  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#FF3B30",
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center"
  },

  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700"
  }

});