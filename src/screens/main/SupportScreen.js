import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

export default function SupportScreen() {

  const callSupport = () => {
    Linking.openURL("tel:+919999999999");
  };

  const emailSupport = () => {
    Linking.openURL("mailto:support@app.com");
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* HEADER */}
      <Text style={styles.title}>Support</Text>
      <Text style={styles.subHeading}>
        We're here to help you anytime
      </Text>

      {/* CARD */}
      <View style={styles.card}>

        {/* CALL */}
        <TouchableOpacity style={styles.item} onPress={callSupport}>
          <View style={styles.iconBox}>
            <Icon name="call-outline" size={20} color="#D7265E" />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.label}>Call Support</Text>
            <Text style={styles.value}>+91 99999 99999</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* EMAIL */}
        <TouchableOpacity style={styles.item} onPress={emailSupport}>
          <View style={styles.iconBox}>
            <Icon name="mail-outline" size={20} color="#D7265E" />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.label}>Email Support</Text>
            <Text style={styles.value}>support@app.com</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* TIMING */}
        <View style={styles.item}>
          <View style={styles.iconBox}>
            <Icon name="time-outline" size={20} color="#D7265E" />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.label}>Working Hours</Text>
            <Text style={styles.value}>Mon - Sat : 10AM - 6PM</Text>
          </View>
        </View>

      </View>

      {/* FOOTER CARD */}
      <LinearGradient
        colors={["#FF7BA5", "#D7265E"]}
        style={styles.footerCard}
      >
        <Text style={styles.footerTitle}>Need Quick Help?</Text>
        <Text style={styles.footerText}>
          Our team usually responds within 24 hours
        </Text>
      </LinearGradient>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: "#F8F7FB"
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#D7265E",
    marginTop: 10,
    marginLeft: 28
  },

  subHeading: {
    fontSize: 13,
    fontWeight: "500",
    color: "#8A94A6",
    marginLeft: 28,
    marginBottom: 12
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 10,
    borderWidth: 1,
    borderColor: "#EEEAF4",
    shadowColor: "#1F2937",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFF1F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },

  textWrap: {
    flex: 1
  },

  label: {
    fontSize: 13,
    color: "#8A94A6",
    fontWeight: "600"
  },

  value: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginTop: 2
  },

  divider: {
    height: 1,
    backgroundColor: "#F1E7EC",
    marginLeft: 60
  },

  footerCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 18
  },

  footerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff"
  },

  footerText: {
    fontSize: 13,
    color: "#fff",
    marginTop: 4,
    opacity: 0.9
  }

});