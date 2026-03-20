import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  useColorScheme
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

import { getRelatedProfile } from "../../services/profileService";
import { LightTheme, DarkTheme } from "../../theme/theme";

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem("user"));

      const data = await getRelatedProfile(user?.mobile_no);

      setProfile(res.data?.data || []);
      setSchools(res.data?.schools || []);
    } catch (err) {

      console.log("Profile Error:", err);

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const logout = async () => {
    await AsyncStorage.clear();
    navigation.replace("Login");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#D7265E" />
          <Text style={styles.loaderText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const userProfile = profile[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#D7265E"]}
            tintColor="#D7265E"
          />
        }
      >
        <Text style={styles.title}>My Profile</Text>
        <Text style={styles.subHeading}>Manage your account information</Text>

        {userProfile && (
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
                  {userProfile.student_name?.charAt(0)}
                </Text>
              </LinearGradient>

              <View style={styles.profileNameWrap}>
                <Text style={styles.name}>{userProfile.student_name}</Text>
                <Text style={styles.id}>
                  Student ID : {userProfile.student_number}
                </Text>

                <View style={styles.statusChip}>
                  <Icon name="shield-checkmark" size={14} color="#D7265E" />
                  <Text style={styles.statusText}>Verified Profile</Text>
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
                    {userProfile.student_family_mobile_number || "N/A"}
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
                    {userProfile.student_email || "N/A"}
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
                    {userProfile.sch_short_nm || "N/A"}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        )}

        {schools.map((school, index) => (
          <View key={index} style={styles.schoolCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.sectionTitle}>School Information</Text>
              <View style={styles.smallChip}>
                <Text style={styles.smallChipText}>Campus</Text>
              </View>
            </View>

            <Text style={styles.schoolName}>{school.sch_nm}</Text>

            <View style={styles.schoolInfoBox}>
              <View style={styles.infoRow}>
                <View style={styles.iconBoxLight}>
                  <Icon name="location-outline" size={18} color="#D7265E" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoText}>{school.address || "N/A"}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconBoxLight}>
                  <Icon name="globe-outline" size={18} color="#D7265E" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Website</Text>
                  <Text style={styles.infoText}>{school.website || "N/A"}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.menuCard}>
          <Text style={styles.menuTitle}>Account Settings</Text>

          <TouchableOpacity activeOpacity={0.85} style={styles.menuItem}>
            <View style={styles.menuIconWrap}>
              <Icon name="help-circle-outline" size={21} color="#374151" />
            </View>
            <Text style={styles.menuText}>Support</Text>
            <Icon name="chevron-forward" size={20} color="#98A2B3" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity activeOpacity={0.85} style={styles.menuItem}>
            <View style={styles.menuIconWrap}>
              <Icon name="document-text-outline" size={21} color="#374151" />
            </View>
            <Text style={styles.menuText}>Terms & Conditions</Text>
            <Icon name="chevron-forward" size={20} color="#98A2B3" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.menuItem}
            onPress={logout}
          >
            <View style={[styles.menuIconWrap, styles.logoutIconWrap]}>
              <Icon name="log-out-outline" size={21} color="#EF4444" />
            </View>
            <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
            <Icon name="chevron-forward" size={20} color="#F87171" />
          </TouchableOpacity>
        </View>

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
    letterSpacing: 0.,
    marginTop:-16,
     marginLeft:30
  },

  subHeading: {
    fontSize: 13,
    fontWeight: "500",
    color: "#8A94A6",
    marginHorizontal: 20,
    marginBottom: 10,
     marginLeft:30
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

  iconBoxLight: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFF6F8",
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

  schoolCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 18,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#EEEAF4",
    shadowColor: "#1F2937",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4
  },

  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1F2937"
  },

  smallChip: {
    backgroundColor: "#FFF1F5",
    borderWidth: 1,
    borderColor: "#FFE2EA",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999
  },

  smallChipText: {
    fontSize: 11,
    color: "#D7265E",
    fontWeight: "700"
  },

  schoolName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
    color: "#374151"
  },

  schoolInfoBox: {
    backgroundColor: "#FCFCFE",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F1F3F7"
  },

  menuCard: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    marginTop: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#EEEAF4",
    shadowColor: "#1F2937",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
    overflow: "hidden"
  },

  menuTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1F2937",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 6
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16
  },

  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center"
  },

  logoutIconWrap: {
    backgroundColor: "#FEF2F2"
  },

  menuText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "700",
    color: "#374151"
  },

  logoutText: {
    color: "#EF4444"
  },

  menuDivider: {
    height: 1,
    backgroundColor: "#EEF2F6",
    marginLeft: 68
  }
});