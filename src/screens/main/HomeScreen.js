import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  RefreshControl
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";


const BASE_URL = "https://apps.actindore.com/api/";

export default function HomeScreen() {

  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState("Inbox");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [mobile, setMobile] = useState(null);
  const [token, setToken] = useState(null);

  const [message, setMessage] = useState([]);
  const [lastdaymessage, setLastdaymessage] = useState([]);
  const [seenmessage, setSeenmessage] = useState([]);
  const [starredmessage, setStarredmessage] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);

  const tabs = ["Inbox", "Last Day", "Seen", "Starred", "Search"];


  /* LOAD USER */

  const loadUser = async () => {

    const userData = await AsyncStorage.getItem("user");
    const tokenData = await AsyncStorage.getItem("token");

    const user = userData ? JSON.parse(userData) : null;

    setMobile(user?.mobile_no);
    setToken(tokenData);

  };


  /* API CALL */

  const apiCall = async (endpoint) => {

    const res = await fetch(BASE_URL + endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    return res.json();

  };


  /* FETCH DATA */

  const fetchInbox = async () => {

    const data = await apiCall(`msg/getInboxMsgDetails/${mobile}`);
    setMessage(data?.data || []);

  };

  const fetchLastDay = async () => {

    const data = await apiCall(`msg/getLastdayMsgDetails/${mobile}`);
    setLastdaymessage(data?.data || []);

  };

  const fetchSeen = async () => {

    const data = await apiCall(`msg/getSeenMsgDetails/${mobile}`);
    setSeenmessage(data?.data || []);

  };

  const fetchStarred = async () => {

    const data = await apiCall(`msg/getStaredMsgDetails/${mobile}`);
    setStarredmessage(data?.data || []);

  };


  /* STAR TOGGLE */

  const toggleStarStatus = async (id, status) => {

    const newStatus = status === 1 ? 0 : 1;

    await fetch(BASE_URL + `msg/staredStatusUpdateMsgDetail/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ star_status: newStatus })
    });

    fetchInbox();
    fetchSeen();
    fetchStarred();

  };


  /* SEARCH */

  const fetchSearch = async (query) => {

    if (!query) {
      setResults([]);
      return;
    }

    const res = await fetch(
      `${BASE_URL}msg/getSearchDetail?mobile=${mobile}&searchquery=${query}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await res.json();
    setResults(data?.data || []);

  };


  /* INIT */

  useEffect(() => {
    loadUser();
  }, []);


  useEffect(() => {

    if (!mobile) return;

    (async () => {

      setLoading(true);

      await fetchInbox();
      await fetchLastDay();
      await fetchSeen();
      await fetchStarred();

      setLoading(false);

    })();

  }, [mobile]);


  /* SEARCH */

  useEffect(() => {

    const timer = setTimeout(() => {
      fetchSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);

  }, [searchQuery]);


  /* REFRESH */

  const onRefresh = async () => {

    setRefreshing(true);

    await fetchInbox();
    await fetchLastDay();
    await fetchSeen();
    await fetchStarred();

    setRefreshing(false);

  };


  /* CURRENT DATA */

  const getCurrentData = () => {

    switch (activeTab) {

      case "Inbox": return message;
      case "Last Day": return lastdaymessage;
      case "Seen": return seenmessage;
      case "Starred": return starredmessage;

      default: return [];

    }

  };


  /* RENDER MESSAGES */

  const renderMessages = () => {

    const data = getCurrentData();

    if (!data.length) {
      return <Text style={{ textAlign: "center" }}>No Messages</Text>
    }

    return data.map(group => (

      <View key={group.msg_group_id}>

        <Text style={styles.groupTitle}>
          {group.msg_group_name}
        </Text>

        {(group.subgroups || []).map(sub => (

          <View key={sub.msg_sgroup_id}>

            <Text style={styles.subTitle}>
              {sub.msg_sgroup_name}
            </Text>

            {(sub.messages || []).map(msg => (

              <TouchableOpacity
                key={msg.sended_msg_id}
                style={styles.card}
                onPress={() => navigation.navigate("MessageDetail", {
                  msgId: msg.msg_id,
                  sendedMsgId: msg.sended_msg_id,
                  title: msg.msg_mst?.subject_text,
                  student: msg.student
                })}
              >

                <View style={styles.headerRow}>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>

                    <View
                      style={[
                        styles.studentBadge,
                        { backgroundColor: msg.student?.color || "#999" }
                      ]}
                    >

                      <Text style={styles.badgeText}>
                        {msg.student?.student_number}
                      </Text>

                    </View>

                    <Text
                      style={[
                        styles.studentName,
                        { color: msg.student?.color || "#000" }
                      ]}
                    >
                      {msg.student?.student_name}
                    </Text>

                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>

                    <Icon name="calendar-today" size={14} color="#FF79AE" />

                    <Text style={styles.date}>
                      {new Date(msg.sended_date).toLocaleDateString()}
                    </Text>

                  </View>

                </View>


                <Text style={styles.subject}>
                  {msg.msg_mst?.subject_text}
                </Text>


                <View style={styles.footerRow}>

                  <Text style={styles.showUpto}>
                    Show Upto: {msg.msg_mst?.show_upto
                      ? new Date(msg.msg_mst.show_upto).toLocaleString()
                      : "N/A"}
                  </Text>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>

                    {/* CHAT ICON */}

                    {msg.msg_mst?.msg_chat_type === "GROUPCHAT" && (

                      <TouchableOpacity
                        style={{ marginRight: 10 }}
                        onPress={() => navigation.navigate("GroupChat", {
                          msgId: msg.msg_id,
                          senderId: msg.student?.student_number,
                          title: msg.msg_mst?.subject_text,
                          student: msg.student
                        })}
                      >
                        <Icon name="chat" size={22} color="#555" />
                      </TouchableOpacity>

                    )}

                    {msg.msg_mst?.msg_chat_type === "INDIVIDUALCHAT" && (

                      <TouchableOpacity
                        style={{ marginRight: 10 }}
                        onPress={() => navigation.navigate("IndividualChat", {
                          msgId: msg.msg_id,
                          senderId: msg.student?.student_number,
                          title: msg.msg_mst?.subject_text,
                          student: msg.student
                        })}
                      >
                        <Icon name="chat" size={22} color="#555" />
                      </TouchableOpacity>

                    )}


                    {/* STAR LOGIC */}

                    {[4, 5].includes(msg.msg_mst?.msg_priority) ? (

                      <Icon
                        name="star"
                        size={24}
                        color="#FFC107"
                      />

                    ) : ![1, 2, 3].includes(msg.msg_mst?.msg_priority) ? (

                      <TouchableOpacity
                        onPress={() => toggleStarStatus(msg.sended_msg_id, msg.is_starred)}
                      >
                        <Icon
                          name={msg.is_starred === 1 ? "star" : "star-border"}
                          size={24}
                          color="#FFC107"
                        />
                      </TouchableOpacity>

                    ) : null}

                  </View>

                </View>

              </TouchableOpacity>

            ))}

          </View>

        ))}

      </View>

    ))

  };


  return (

    <View style={{ flex: 1, backgroundColor: "#F3F4F6" }}>

      {/* TABS */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "center"
        }}
        style={styles.tabs}
      >

        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}

      </ScrollView>


      {/* CONTENT */}

      <ScrollView
        style={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#B31217"]}
          />
        }
      >

        {activeTab === "Search" ? (

          <>

            <TextInput
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.search}
            />

            {results.map(msg => (
              <View key={msg.sended_msg_id} style={styles.card}>
                <Text>{msg.student?.student_name}</Text>
                <Text>{msg.msg_mst?.subject_text}</Text>
              </View>
            ))}

          </>

        ) : (

          loading
            ? <ActivityIndicator size="large" color="#B31217" />
            : renderMessages()

        )}

      </ScrollView>

    </View>

  )

}


const styles = StyleSheet.create({

  tabs: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    maxHeight: 60
  },

  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 36
  },

  activeTab: {
    backgroundColor: "#B31217"
  },

  tabText: {
    fontWeight: "600",
    color: "#333",
    fontSize: 14
  },

  activeTabText: {
    color: "#fff"
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#B31217",
    marginBottom: 10
  },

  subTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8
  },

  card: {
    backgroundColor: "#F1F3FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 3
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6
  },

  studentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6
  },

  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 11
  },

  studentName: {
    fontSize: 15,
    fontWeight: "700"
  },

  date: {
    marginLeft: 5,
    fontSize: 12,
    color: "#6B7280"
  },

  subject: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginTop: 5
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10
  },

  showUpto: {
    fontSize: 12,
    color: "#6B7280"
  },

  search: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15
  }

});