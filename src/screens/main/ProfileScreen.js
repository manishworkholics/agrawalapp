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

import { getRelatedProfile } from "../../services/profileService";
import { LightTheme, DarkTheme } from "../../theme/theme";

export default function ProfileScreen({ navigation }) {

  const scheme = useColorScheme();

  const theme = scheme === "dark"
    ? DarkTheme
    : LightTheme;

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

      setProfile(data?.data || []);
      setSchools(data?.schools || []);

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
      <SafeAreaView style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </SafeAreaView>
    );
  }

  const userProfile = profile[0];

  return (

    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        <Text style={[styles.title, { color: theme.text }]}>
          My Profile
        </Text>

        {userProfile && (

          <View style={[styles.profileCard, { backgroundColor: theme.card }]}>

            <View style={styles.profileTop}>

              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userProfile.student_name?.charAt(0)}
                </Text>
              </View>

              <View style={{ flex: 1 }}>

                <Text style={[styles.name, { color: theme.text }]}>
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

        {schools.map((school, index) => (

          <View key={index} style={[styles.schoolCard, { backgroundColor: theme.card }]}>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>
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

        <View style={[styles.menuCard, { backgroundColor: theme.card }]}>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("Support")}
          >
            <Icon name="help-circle-outline" size={22} color="#374151" />
            <Text style={[styles.menuText, { color: theme.text }]}>
              Support
            </Text>
            <Icon name="chevron-forward" size={20} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("TermsCondition")}
          >
            <Icon name="document-text-outline" size={22} color="#374151" />
            <Text style={[styles.menuText, { color: theme.text }]}>
              Terms & Conditions
            </Text>
            <Icon name="chevron-forward" size={20} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={logout}
          >
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
    flex: 1
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
    marginBottom: 10
  },

  profileCard: {
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
    fontWeight: "700"
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