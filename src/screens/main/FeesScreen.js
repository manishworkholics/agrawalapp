import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  useColorScheme,
  StyleSheet
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

import { getFeesDetails } from "../../services/feesService";
import { LightTheme, DarkTheme } from "../../theme/theme";

export default function FeesScreen() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFees();
  }, []);

  const loadFees = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem("user"));

      const data = await getFeesDetails(user?.mobile_no);

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
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#D7265E" />
          <Text style={styles.loaderText}>Loading fees details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const firstStudent = fees[0]?.student;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Outstanding Fees</Text>
        <Text style={styles.subHeading}>Review pending dues and continue payment</Text>

        {firstStudent && (
          <LinearGradient
            colors={["#FFF4F7", "#FFFFFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileCard}
          >
            <View style={styles.topGlow} />
            <View style={styles.bottomGlow} />

            <View style={styles.profileTop}>
              <LinearGradient
                colors={["#FF7BA5", "#D7265E"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {firstStudent.student_name?.charAt(0)}
                </Text>
              </LinearGradient>

              <View style={styles.profileNameWrap}>
                <Text style={styles.name}>{firstStudent.student_name}</Text>
                <Text style={styles.id}>
                  Student ID : {firstStudent.student_number}
                </Text>

                <View style={styles.statusChip}>
                  <Icon name="wallet-outline" size={14} color="#D7265E" />
                  <Text style={styles.statusText}>Fee Summary</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Icon name="call-outline" size={18} color="#D7265E" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Mobile Number</Text>
                  <Text style={styles.infoText}>
                    {firstStudent.student_family_mobile_number || "N/A"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Icon name="mail-outline" size={18} color="#D7265E" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email Address</Text>
                  <Text style={styles.infoText}>
                    {firstStudent.student_email || "N/A"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Icon name="school-outline" size={18} color="#D7265E" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>School</Text>
                  <Text style={styles.infoText}>
                    {firstStudent.sch_short_nm || "N/A"}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        )}

        {fees.map((item, index) => (
          <View key={index} style={styles.feesCard}>
            <View style={styles.feesAccent} />

            <View style={styles.cardTopRow}>
              <View>
                <Text style={styles.amountLabel}>Outstanding Amount</Text>
                <Text style={styles.amount}>₹ {item.balance_amount}</Text>
              </View>

              <View style={styles.pendingBadge}>
                <View style={styles.pendingDot} />
                <Text style={styles.pendingText}>Pending</Text>
              </View>
            </View>

            <View style={styles.infoMiniRow}>
              <View style={styles.miniInfoChip}>
                <Icon name="person-outline" size={14} color="#D7265E" />
                <Text style={styles.miniInfoText}>
                  {item.student?.student_number || "N/A"}
                </Text>
              </View>

              <View style={styles.miniInfoChip}>
                <Icon name="calendar-outline" size={14} color="#D7265E" />
                <Text style={styles.miniInfoText}>Pay securely online</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.payBtnWrap}
              onPress={() =>
                payNow(
                  item.student?.student_number,
                  item.student?.student_dob,
                  item.student?.student_email
                )
              }
            >
              <LinearGradient
                colors={["#FF7BA5", "#D7265E"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.payBtn}
              >
                <Text style={styles.payText}>Pay Now</Text>
                <Icon name="arrow-forward" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ))}

        {fees.length === 0 && (
          <View style={styles.emptyBox}>
            <Icon name="checkmark-circle-outline" size={38} color="#22C55E" />
            <Text style={styles.emptyTitle}>No Outstanding Fees</Text>
            <Text style={styles.emptySubTitle}>
              Your account does not have any pending fee at the moment
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F7FB"
  },

  scrollContent: {
    paddingTop: 10,
    paddingBottom: 10
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F7FB"
  },

  loaderWrap: {
    alignItems: "center"
  },

  loaderText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#8A94A6"
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginHorizontal: 20,
    marginBottom: 4,
    color: "#D7265E",
    letterSpacing: 0.2,
    marginTop:-18,
     marginLeft:28
  },

  subHeading: {
    fontSize: 13,
    fontWeight: "500",
    color: "#8A94A6",
    marginHorizontal: 20,
    marginBottom: 10,
     marginLeft:28
  },

  profileCard: {
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F5DCE6",
    shadowColor: "#1F2937",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    overflow: "hidden",
    position: "relative"
  },

  

  profileTop: {
    flexDirection: "row",
    alignItems: "center"
  },

  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    shadowColor: "#D7265E",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5
  },

  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800"
  },

  profileNameWrap: {
    flex: 1
  },

  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    textTransform: "capitalize"
  },

  id: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 5,
    fontWeight: "600"
  },

  statusChip: {
    marginTop: 10,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF1F5",
    borderWidth: 1,
    borderColor: "#FFE2EA",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999
  },

  statusText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#D7265E"
  },

  divider: {
    height: 1,
    backgroundColor: "#F1E7EC",
    marginVertical: 16
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F3EDF2"
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 8
  },

  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFF1F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },

  infoContent: {
    flex: 1
  },

  infoLabel: {
    fontSize: 12,
    color: "#8A94A6",
    fontWeight: "700",
    marginBottom: 4
  },

  infoText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 21,
    fontWeight: "600"
  },

  feesCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#EEEAF4",
    shadowColor: "#1F2937",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
    position: "relative",
    overflow: "hidden"
  },

  feesAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: "#E97AAE"
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14
  },

  amountLabel: {
    fontSize: 12,
    color: "#8A94A6",
    fontWeight: "700",
    marginBottom: 6
  },

  amount: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827"
  },

  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#FECACA"
  },

  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    marginRight: 6
  },

  pendingText: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: 12
  },

  infoMiniRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16
  },

  miniInfoChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7FA",
    borderWidth: 1,
    borderColor: "#FFE3EC",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 10,
    marginBottom: 8
  },

  miniInfoText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280"
  },

  payBtnWrap: {
    borderRadius: 16,
    overflow: "hidden"
  },

  payBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 16,
    shadowColor: "#D7265E",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4
  },

  payText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8
  },

  emptyBox: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EEEAF4",
    shadowColor: "#1F2937",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937"
  },

  emptySubTitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#8A94A6",
    textAlign: "center",
    lineHeight: 20
  }
});