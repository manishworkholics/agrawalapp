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
      case "Inbox":
        return message;
      case "Last Day":
        return lastdaymessage;
      case "Seen":
        return seenmessage;
      case "Starred":
        return starredmessage;
      default:
        return [];
    }
  };

  /* RENDER MESSAGES */
  const renderMessages = () => {
    const data = getCurrentData();

    if (!data.length) {
      return (
        <View style={styles.emptyBox}>
          <Icon name="inbox" size={34} color="#C0C7D4" />
          <Text style={styles.emptyTitle}>No Messages</Text>
          <Text style={styles.emptySubTitle}>
            There are no messages available in this section
          </Text>
        </View>
      );
    }

    return data.map(group => (
      <View key={group.msg_group_id} style={styles.groupBlock}>
        <Text style={styles.groupTitle}>{group.msg_group_name}</Text>

        {(group.subgroups || []).map(sub => (
          <View key={sub.msg_sgroup_id} style={styles.subGroupBlock}>
            <Text style={styles.subTitle}>{sub.msg_sgroup_name}</Text>

            {(sub.messages || []).map(msg => (
              <TouchableOpacity
                key={msg.sended_msg_id}
                activeOpacity={0.9}
                style={styles.card}
                onPress={() =>
                  navigation.navigate("MessageDetail", {
                    msgId: msg.msg_id,
                    sendedMsgId: msg.sended_msg_id,
                    title: msg.msg_mst?.subject_text,
                    student: msg.student
                  })
                }
              >
                <View style={styles.cardAccentLine} />

                <View style={styles.headerRow}>
                  <View style={styles.studentInfoWrap}>
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
                      numberOfLines={1}
                      style={[
                        styles.studentName,
                        { color: msg.student?.color || "#1F2937" }
                      ]}
                    >
                      {msg.student?.student_name}
                    </Text>
                  </View>

                  <View style={styles.dateChip}>
                    <Icon name="calendar-today" size={13} color="#D7265E" />
                    <Text style={styles.date}>
                      {new Date(msg.sended_date).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.subject}>{msg.msg_mst?.subject_text}</Text>

                <View style={styles.footerRow}>
                  <Text style={styles.showUpto}>
                    Show Upto:{" "}
                    {msg.msg_mst?.show_upto
                      ? new Date(msg.msg_mst.show_upto).toLocaleString()
                      : "N/A"}
                  </Text>

                  <View style={styles.iconRow}>
                    {msg.msg_mst?.msg_chat_type === "GROUPCHAT" && (
                      <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() =>
                          navigation.navigate("GroupChat", {
                            msgId: msg.msg_id,
                            senderId: msg.student?.student_number,
                            title: msg.msg_mst?.subject_text,
                            student: msg.student
                          })
                        }
                      >
                        <Icon name="chat" size={20} color="#7C8594" />
                      </TouchableOpacity>
                    )}

                    {msg.msg_mst?.msg_chat_type === "INDIVIDUALCHAT" && (
                      <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() =>
                          navigation.navigate("IndividualChat", {
                            msgId: msg.msg_id,
                            senderId: msg.student?.student_number,
                            title: msg.msg_mst?.subject_text,
                            student: msg.student
                          })
                        }
                      >
                        <Icon name="chat" size={20} color="#7C8594" />
                      </TouchableOpacity>
                    )}

                    {[4, 5].includes(msg.msg_mst?.msg_priority) ? (
                      <Icon name="star" size={23} color="#F4B740" />
                    ) : ![1, 2, 3].includes(msg.msg_mst?.msg_priority) ? (
                      <TouchableOpacity
                        onPress={() =>
                          toggleStarStatus(msg.sended_msg_id, msg.is_starred)
                        }
                      >
                        <Icon
                          name={msg.is_starred === 1 ? "star" : "star-border"}
                          size={23}
                          color="#F4B740"
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
    ));
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
          style={styles.tabsWrapper}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              activeOpacity={0.85}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#D7265E"]}
            tintColor="#D7265E"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "Search" ? (
          <>
            <View style={styles.searchWrapper}>
              <Icon name="search" size={20} color="#A0A8B5" />
              <TextInput
                placeholder="Search messages..."
                placeholderTextColor="#98A2B3"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
            </View>

            {results.length === 0 ? (
              <View style={styles.emptyBox}>
                <Icon name="manage-search" size={34} color="#C0C7D4" />
                <Text style={styles.emptyTitle}>No search results</Text>
                <Text style={styles.emptySubTitle}>
                  Try searching with another keyword
                </Text>
              </View>
            ) : (
              results.map(msg => (
                <View key={msg.sended_msg_id} style={styles.searchCard}>
                  <Text style={styles.searchStudentName}>
                    {msg.student?.student_name}
                  </Text>
                  <Text style={styles.searchSubject}>
                    {msg.msg_mst?.subject_text}
                  </Text>
                </View>
              ))
            )}
          </>
        ) : loading ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#D7265E" />
            <Text style={styles.loaderText}>Loading messages...</Text>
          </View>
        ) : (
          renderMessages()
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F7FB"
  },

  topSection: {
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 6,
    backgroundColor: "#F8F7FB"
  },

  tabsWrapper: {
    maxHeight: 64
  },

  tabsContent: {
    alignItems: "center",
    paddingRight: 6
  },

  tab: {
    minHeight: 40,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8BFD8",
    shadowColor: "#1F2937",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2
  },

  activeTab: {
    backgroundColor: "#D7265E",
    borderColor: "#D7265E",
    shadowColor: "#D7265E",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4
  },

  tabText: {
    fontWeight: "700",
    color: "#4B5563",
    fontSize: 13
  },

  activeTabText: {
    color: "#FFFFFF"
  },

  content: {
    flex: 1
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 22
  },

  groupBlock: {
    marginBottom: 8
  },

  subGroupBlock: {
    marginBottom: 6
  },

  groupTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#D7265E",
    marginTop: 8,
    marginBottom: 8,
    letterSpacing: 0.2
  },

  subTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 16,
    paddingTop: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEEAF4",
    shadowColor: "#1F2937",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    position: "relative",
    overflow: "hidden"
  },

  cardAccentLine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: "#E97AAE"
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10
  },

  studentInfoWrap: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10
  },

  studentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8
  },

  badgeText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 11
  },

  studentName: {
    fontSize: 15,
    fontWeight: "800",
    flexShrink: 1,
    textTransform: "capitalize"
  },

  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF1F5",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#FFE1EA"
  },

  date: {
    marginLeft: 5,
    fontSize: 12,
    color: "#8A94A6",
    fontWeight: "600"
  },

  subject: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 2,
    lineHeight: 24
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F2F4F7"
  },

  showUpto: {
    fontSize: 12,
    color: "#8A94A6",
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
    lineHeight: 18
  },

  iconRow: {
    flexDirection: "row",
    alignItems: "center"
  },

  iconBtn: {
    marginRight: 10
  },

  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEEAF4",
    shadowColor: "#1F2937",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2
  },

  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 15,
    color: "#1F2937"
  },

  searchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEEAF4",
    shadowColor: "#1F2937",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2
  },

  searchStudentName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#D7265E",
    marginBottom: 6,
    textTransform: "capitalize"
  },

  searchSubject: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "600",
    lineHeight: 22
  },

  loaderBox: {
    paddingTop: 60,
    alignItems: "center",
    justifyContent: "center"
  },

  loaderText: {
    marginTop: 10,
    fontSize: 14,
    color: "#8A94A6",
    fontWeight: "600"
  },

  emptyBox: {
    marginTop: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 28,
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
    marginTop: 10,
    fontSize: 17,
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