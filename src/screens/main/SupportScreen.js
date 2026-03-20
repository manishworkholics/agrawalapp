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

export default function SupportScreen() {

  const callSupport = () => {
    Linking.openURL("tel:+919999999999");
  };

  const emailSupport = () => {
    Linking.openURL("mailto:support@app.com");
  };

  return (

    <SafeAreaView style={styles.safeArea}>

      <Text style={styles.title}>Support</Text>

      <View style={styles.card}>

        <TouchableOpacity style={styles.item} onPress={callSupport}>
          <Icon name="call-outline" size={22} color="#374151" />
          <Text style={styles.text}>Call Support</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.item} onPress={emailSupport}>
          <Icon name="mail-outline" size={22} color="#374151" />
          <Text style={styles.text}>Email Support</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.item}>
          <Icon name="time-outline" size={22} color="#374151" />
          <Text style={styles.text}>Mon - Sat : 10AM - 6PM</Text>
        </View>

      </View>

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: "#F2F4F7"
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    margin: 20,
    color: "#111827"
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 20,
    elevation: 4
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18
  },

  text: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "500"
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginLeft: 50
  }

});