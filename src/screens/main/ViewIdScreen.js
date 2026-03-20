import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

export default function ViewIdScreen() {
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIds();
  }, []);

  const loadIds = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem("user"));
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(
        `https://apps.actindore.com/api/combine/getRelatedProfile?mobilenumber=${user?.mobile_no}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProfile(res.data?.data || []);
    } catch (error) {
      console.log("ID ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStudentStatus = async (id, mobile, status) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await axios.post(
        `https://apps.actindore.com/api/combine/updateStudentTabStatus`,
        {
          student_main_id: id,
          mobile: mobile,
          status: status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      loadIds();
    } catch (error) {
      console.log("STATUS ERROR", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#D7265E" />
          <Text style={styles.loaderText}>Loading student IDs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Student IDs</Text>
        <Text style={styles.subHeading}>
          Tap on a card to change active student status
        </Text>

        {profile.map((item, index) => {
          const active = item.tab_active_status === 1;

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              style={[styles.card, active && styles.activeCard]}
              onPress={() =>
                updateStudentStatus(
                  item.student_main_id,
                  item.student_family_mobile_number,
                  active ? 0 : 1
                )
              }
            >
              <View style={styles.cardAccent} />

              <View style={styles.topRow}>
                <LinearGradient
                  colors={
                    active
                      ? ["#FF7BA5", "#D7265E"]
                      : ["#C7CEDB", "#98A2B3"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>
                    {item.student_name?.charAt(0)}
                  </Text>
                </LinearGradient>

                <View style={styles.nameWrap}>
                  <Text style={styles.name}>{item.student_name}</Text>
                  <Text style={styles.id}>Student ID : {item.student_number}</Text>

                  <View
                    style={[
                      styles.statusChip,
                      active ? styles.activeChip : styles.inactiveChip
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        active ? styles.activeStatus : styles.inactiveStatus
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusChipText,
                        active ? styles.activeChipText : styles.inactiveChipText
                      ]}
                    >
                      {active ? "Active" : "Inactive"}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoBox}>
                <View style={styles.infoRow}>
                  <View style={styles.iconBox}>
                    <Icon name="call-outline" size={18} color="#D7265E" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Mobile Number</Text>
                    <Text style={styles.infoText}>
                      {item.student_family_mobile_number || "N/A"}
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
                      {item.student_email || "N/A"}
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
                      {item.sch_short_nm || "N/A"}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {profile.length === 0 && (
          <View style={styles.emptyBox}>
            <Icon name="id-card-outline" size={38} color="#C0C7D4" />
            <Text style={styles.emptyTitle}>No Student IDs Found</Text>
            <Text style={styles.emptySubTitle}>
              No student profile data is available right now
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
    marginTop:-10,
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

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 14,
    borderRadius: 24,
    padding: 18,
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

  activeCard: {
    borderColor: "#F2C9D8",
    shadowColor: "#D7265E",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5
  },

  cardAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: "#E97AAE"
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center"
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14
  },

  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800"
  },

  nameWrap: {
    flex: 1
  },

  name: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    textTransform: "capitalize"
  },

  id: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
    fontWeight: "600"
  },

  statusChip: {
    marginTop: 10,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1
  },

  activeChip: {
    backgroundColor: "#ECFDF5",
    borderColor: "#BBF7D0"
  },

  inactiveChip: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA"
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },

  activeStatus: {
    backgroundColor: "#10B981"
  },

  inactiveStatus: {
    backgroundColor: "#EF4444"
  },

  statusChipText: {
    fontSize: 12,
    fontWeight: "700"
  },

  activeChipText: {
    color: "#059669"
  },

  inactiveChipText: {
    color: "#DC2626"
  },

  divider: {
    height: 1,
    backgroundColor: "#F1E7EC",
    marginVertical: 16
  },

  infoBox: {
    backgroundColor: "#FCFCFE",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F1F3F7"
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