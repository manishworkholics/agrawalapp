import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

export default function TermsConditionScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >

        {/* HEADER */}
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.subHeading}>
          Please read carefully before using the app
        </Text>

        {/* CARD */}
        <View style={styles.card}>

          {/* SECTION 1 */}
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.iconBox}>
                <Icon name="checkmark-done-outline" size={18} color="#D7265E" />
              </View>
              <Text style={styles.sectionTitle}>Acceptance of Terms</Text>
            </View>
            <Text style={styles.text}>
              By using this application, you agree to follow all rules and
              regulations defined by the platform.
            </Text>
          </View>

          {/* SECTION 2 */}
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.iconBox}>
                <Icon name="person-outline" size={18} color="#D7265E" />
              </View>
              <Text style={styles.sectionTitle}>User Responsibilities</Text>
            </View>
            <Text style={styles.text}>
              Users must provide accurate information while registering and
              using the application.
            </Text>
          </View>

          {/* SECTION 3 */}
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.iconBox}>
                <Icon name="lock-closed-outline" size={18} color="#D7265E" />
              </View>
              <Text style={styles.sectionTitle}>Privacy</Text>
            </View>
            <Text style={styles.text}>
              Your data is securely stored and used only for service related
              operations.
            </Text>
          </View>

          {/* SECTION 4 */}
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.iconBox}>
                <Icon name="refresh-outline" size={18} color="#D7265E" />
              </View>
              <Text style={styles.sectionTitle}>Changes</Text>
            </View>
            <Text style={styles.text}>
              We reserve the right to update these terms anytime without prior
              notice.
            </Text>
          </View>

        </View>

        {/* FOOTER */}
        <LinearGradient
          colors={["#FF7BA5", "#D7265E"]}
          style={styles.footerCard}
        >
          <Text style={styles.footerTitle}>Important Notice</Text>
          <Text style={styles.footerText}>
            Continued use of the app means you accept any updated terms.
          </Text>
        </LinearGradient>

      </ScrollView>
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
    padding: 18,
    borderWidth: 1,
    borderColor: "#EEEAF4",
    shadowColor: "#1F2937",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4
  },

  section: {
    marginBottom: 18
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6
  },

  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#FFF1F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827"
  },

  text: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
    marginLeft: 42
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