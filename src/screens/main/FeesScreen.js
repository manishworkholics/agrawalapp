import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";

export default function FeesScreen() {

  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFees();
  }, []);

  const loadFees = async () => {

    try {

      const user = JSON.parse(await AsyncStorage.getItem("user"));
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(
        `https://apps.actindore.com/api/fees/getFeesDetail?mobilenumber=${user?.mobile_no}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setFees(res.data?.data || []);

    } catch (error) {

      console.log("FEES ERROR", error);

    } finally {

      setLoading(false);

    }

  };

  const payNow = (id, dob, email) => {

    const url = `https://pay.actindore.com/payfees.php?payment_for=1&scholar_no=${id}&birth_date=${dob}&email_id=${email}`;

    Linking.openURL(url);

  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    )
  }

  const firstStudent = fees[0]?.student;

  return (

    <SafeAreaView style={styles.safeArea}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10 }}
      >

        {/* TITLE */}

        <Text style={styles.title}>Outstanding Fees</Text>

        {/* PROFILE CARD */}

        {firstStudent && (

          <View style={styles.profileCard}>

            <View style={styles.profileTop}>

              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {firstStudent.student_name?.charAt(0)}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>
                  {firstStudent.student_name}
                </Text>

                <Text style={styles.id}>
                  ID : {firstStudent.student_number}
                </Text>
              </View>

            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Icon name="call-outline" size={18} color="#6B7280" />
              <Text style={styles.infoText}>
                {firstStudent.student_family_mobile_number}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="mail-outline" size={18} color="#6B7280" />
              <Text style={styles.infoText}>
                {firstStudent.student_email}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="school-outline" size={18} color="#6B7280" />
              <Text style={styles.infoText}>
                {firstStudent.sch_short_nm}
              </Text>
            </View>

          </View>

        )}

        {/* FEES CARD */}

        {fees.map((item, index) => (

          <View key={index} style={styles.feesCard}>

            <View style={styles.feesRow}>

              <Text style={styles.amount}>
                ₹ {item.balance_amount}
              </Text>

              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>Pending</Text>
              </View>

            </View>

            <TouchableOpacity
              style={styles.payBtn}
              onPress={() => payNow(
                item.student?.student_number,
                item.student?.student_dob,
                item.student?.student_email
              )}
            >

              <Text style={styles.payText}>Pay Now</Text>

              <Icon name="arrow-forward" size={18} color="#fff" />

            </TouchableOpacity>

          </View>

        ))}

        {fees.length === 0 && (
          <Text style={styles.noData}>No Outstanding Fees</Text>
        )}

        <View style={{ height: 40 }} />

      </ScrollView>

    </SafeAreaView>

  )

}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: "#F2F4F7"
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginHorizontal: 20,
    marginBottom: 10,
    color: "#111827"
  },

  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 20,
    padding: 20,
    elevation: 6
  },

  profileTop: {
    flexDirection: "row",
    alignItems: "center"
  },

  avatar: {
    width: 65,
    height: 65,
    borderRadius: 32,
    backgroundColor: "#B31217",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15
  },

  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700"
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827"
  },

  id: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6
  },

  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#374151"
  },

  feesCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 5
  },

  feesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15
  },

  amount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827"
  },

  pendingBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },

  pendingText: {
    color: "#DC2626",
    fontWeight: "600"
  },

  payBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B31217",
    paddingVertical: 14,
    borderRadius: 12
  },

  payText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 6
  },

  noData: {
    textAlign: "center",
    marginTop: 20,
    color: "#6B7280"
  }

});