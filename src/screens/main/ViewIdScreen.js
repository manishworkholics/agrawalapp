import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";

import {
  getStudentIds,
  updateStudentTabStatus
} from "../../services/studentService";

import { LightTheme, DarkTheme } from "../../theme/theme";

export default function ViewIdScreen() {

  const scheme = useColorScheme();

  const theme = scheme === "dark"
    ? DarkTheme
    : LightTheme;

  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIds();
  }, []);

  const loadIds = async () => {

    try {

      const user = JSON.parse(await AsyncStorage.getItem("user"));

      const data = await getStudentIds(user?.mobile_no);

      setProfile(data?.data || []);

    } catch (error) {

      console.log("ID ERROR", error);

    } finally {

      setLoading(false);

    }

  };

  const toggleStatus = async (item) => {

    try {

      const active = item.tab_active_status === 1;

      await updateStudentTabStatus(
        item.student_main_id,
        item.student_family_mobile_number,
        active ? 0 : 1
      );

      loadIds();

    } catch (error) {

      console.log("STATUS ERROR", error);

    }

  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </SafeAreaView>
    )
  }

  return (

    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10 }}
      >

        <Text style={[styles.title, { color: theme.text }]}>
          Student IDs
        </Text>

        {profile.map((item, index) => {

          const active = item.tab_active_status === 1;

          return (

            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                { backgroundColor: theme.card },
                active && styles.activeCard
              ]}
              onPress={() => toggleStatus(item)}
            >

              <View style={styles.topRow}>

                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.student_name?.charAt(0)}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>

                  <Text style={[styles.name, { color: theme.text }]}>
                    {item.student_name}
                  </Text>

                  <Text style={styles.id}>
                    ID : {item.student_number}
                  </Text>

                </View>

                <View style={[
                  styles.status,
                  active ? styles.activeStatus : styles.inactiveStatus
                ]} />

              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Icon name="call-outline" size={18} color="#6B7280" />
                <Text style={styles.infoText}>
                  {item.student_family_mobile_number}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Icon name="mail-outline" size={18} color="#6B7280" />
                <Text style={styles.infoText}>
                  {item.student_email}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Icon name="school-outline" size={18} color="#6B7280" />
                <Text style={styles.infoText}>
                  {item.sch_short_nm}
                </Text>
              </View>

            </TouchableOpacity>

          )

        })}

        <View style={{ height: 40 }} />

      </ScrollView>

    </SafeAreaView>

  )

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

  card: {
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 20,
    padding: 20,
    elevation: 4
  },

  activeCard: {
    borderWidth: 2,
    borderColor: "#10B981"
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center"
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#B31217",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15
  },

  avatarText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700"
  },

  name: {
    fontSize: 16,
    fontWeight: "700"
  },

  id: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3
  },

  status: {
    width: 15,
    height: 15,
    borderRadius: 10
  },

  activeStatus: {
    backgroundColor: "#10B981"
  },

  inactiveStatus: {
    backgroundColor: "#EF4444"
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5
  },

  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#374151"
  }

});