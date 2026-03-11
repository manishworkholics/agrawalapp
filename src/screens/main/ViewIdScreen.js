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
        <ActivityIndicator size="large" />
      </SafeAreaView>
    )
  }

  return (

    <SafeAreaView style={styles.safeArea}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10 }}
      >

        {/* TITLE */}

        <Text style={styles.title}>Student IDs</Text>

        {profile.map((item, index) => {

          const active = item.tab_active_status === 1;

          return (

            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                active && styles.activeCard
              ]}
              onPress={() => updateStudentStatus(
                item.student_main_id,
                item.student_family_mobile_number,
                active ? 0 : 1
              )}
            >

              <View style={styles.topRow}>

                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.student_name?.charAt(0)}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>

                  <Text style={styles.name}>
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

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 20,
    padding: 18,
    elevation: 5
  },

  activeCard: {
    borderWidth: 1.5,
    borderColor: "#B31217"
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
    marginRight: 14
  },

  avatarText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700"
  },

  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827"
  },

  id: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4
  },

  status: {
    width: 14,
    height: 14,
    borderRadius: 7
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
    marginVertical: 4
  },

  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#374151"
  }

});