import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";

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
      setSchools(res.data?.schools || []);

    } catch (err) {
      console.log(err);
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
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const userProfile = profile[0];

  return (

    <SafeAreaView style={styles.safeArea}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* TITLE */}

        <Text style={styles.title}>My Profile</Text>

        {/* PROFILE CARD */}

        {userProfile && (

          <View style={styles.profileCard}>

            <View style={styles.profileTop}>

              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userProfile.student_name?.charAt(0)}
                </Text>
              </View>

              <View style={{ flex: 1 }}>

                <Text style={styles.name}>
                  {userProfile.student_name}
                </Text>

                <Text style={styles.id}>
                  ID : {userProfile.student_number}
                </Text>

              </View>

            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Icon name="call-outline" size={18} color="#6B7280" />
              <Text style={styles.infoText}>
                {userProfile.student_family_mobile_number}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="mail-outline" size={18} color="#6B7280" />
              <Text style={styles.infoText}>
                {userProfile.student_email}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="school-outline" size={18} color="#6B7280" />
              <Text style={styles.infoText}>
                {userProfile.sch_short_nm}
              </Text>
            </View>

          </View>

        )}

        {/* SCHOOL CARD */}

        {schools.map((school, index) => (

          <View key={index} style={styles.schoolCard}>

            <Text style={styles.sectionTitle}>
              School Information
            </Text>

            <Text style={styles.schoolName}>
              {school.sch_nm}
            </Text>

            <View style={styles.infoRow}>
              <Icon name="location-outline" size={18} color="#6B7280" />
              <Text style={styles.infoText}>
                {school.address}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="globe-outline" size={18} color="#6B7280" />
              <Text style={styles.infoText}>
                {school.website}
              </Text>
            </View>

          </View>

        ))}

        {/* SETTINGS */}

        <View style={styles.menuCard}>

          <TouchableOpacity style={styles.menuItem}>
            <Icon name="help-circle-outline" size={22} color="#374151" />
            <Text style={styles.menuText}>Support</Text>
            <Icon name="chevron-forward" size={20} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem}>
            <Icon name="document-text-outline" size={22} color="#374151" />
            <Text style={styles.menuText}>Terms & Conditions</Text>
            <Icon name="chevron-forward" size={20} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem} onPress={logout}>
            <Icon name="log-out-outline" size={22} color="#EF4444" />
            <Text style={[styles.menuText, { color: "#EF4444" }]}>
              Logout
            </Text>
            <Icon name="chevron-forward" size={20} />
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
    elevation: 5
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

  schoolCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 4
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10
  },

  schoolName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10
  },

  menuCard: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 20,
    elevation: 4
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18
  },

  menuText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "500"
  },

  menuDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginLeft: 50
  }

});