import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsConditionScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Terms & Conditions</Text>

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.text}>
            By using this application, you agree to follow all rules and
            regulations defined by the platform.
          </Text>

          <Text style={styles.sectionTitle}>2. User Responsibilities</Text>
          <Text style={styles.text}>
            Users must provide accurate information while registering and
            using the application.
          </Text>

          <Text style={styles.sectionTitle}>3. Privacy</Text>
          <Text style={styles.text}>
            Your data is securely stored and used only for service related
            operations.
          </Text>

          <Text style={styles.sectionTitle}>4. Changes</Text>
          <Text style={styles.text}>
            We reserve the right to update these terms anytime without prior
            notice.
          </Text>

        </View>

      </ScrollView>
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
    padding: 20,
    elevation: 4
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 5
  },

  text: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20
  }

});