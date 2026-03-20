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
      colors={["#D2691E", "#DC143C", "#FF1493"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.container}>
          {/* LEFT SIDE */}
          <View style={styles.left}>
            <View style={styles.logoOuterGlow}>
              <View style={styles.logoCircle}>
                <Image
                  source={require("../assets/logo.png")}
                  style={styles.logo}
                />
              </View>
            </View>

            <View>
              <Text style={styles.appName}>eMessenger</Text>
              <Text style={styles.appTagline}>Smart communication hub</Text>
            </View>
          </View>

          {/* RIGHT SIDE */}
          <TouchableOpacity activeOpacity={0.85} style={styles.searchBtn}>
            <Icon name="search" size={22} color="#fff" />

            <LinearGradient
              colors={["#EE82EE", "#FF00FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.badge}
            >
              <Text style={styles.badgeText}>1</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Decorative glow circles */}
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    
    overflow: "hidden",
    paddingBottom: 10
  },

  safeArea: {
    backgroundColor: "transparent"
  },

  container: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 8,
    zIndex: 2
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },

  logoOuterGlow: {
    marginRight: 12,
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4
  },

  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center"
  },

  logo: {
    width: 26,
    height: 26,
    resizeMode: "contain"
  },

  appName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.3
  },

  appTagline: {
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(255,255,255,0.82)",
    marginTop: 2,
    letterSpacing: 0.2
  },

  searchBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5
  },

  badge: {
    position: "absolute",
    top: -2,
    right: -1,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.65)"
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800"
  },

  
});