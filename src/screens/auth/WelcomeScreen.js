import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Linking,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");
export default function WelcomeScreen({ navigation }) {

  const [noticeData, setNoticeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotice();
  }, []);

  const fetchNotice = async () => {
    try {

      const userData = await AsyncStorage.getItem("user");

      if (!userData) {
        console.log("User not found");
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);

      const res = await axios.get(
        "https://apps.actindore.com/api/notice/getNoticeBoardDetails",
        {
          params: { mobilenumber: user.mobile_no }
        }
      );

      if (res?.data?.data) {
        setNoticeData(res.data.data);
      }

    } catch (error) {
      console.log("Notice API error:", error);
    } finally {
      setLoading(false);
    }
  };

  const openLink = (url) => {
    if (!url) return;
    Linking.openURL(url);
  };

  const isYoutube = (url) => {
    return url?.includes("youtube.com") || url?.includes("youtu.be");
  };

  const isPdf = (url) => {
    return url?.toLowerCase().includes(".pdf");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </SafeAreaView>
    );
  }

  return (

    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>

        {/* NEXT BUTTON */}

        <TouchableOpacity
          style={styles.nextBtn}
          onPress={() => navigation.replace("MainTabs")}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>

        {/* TITLE */}

        <Text style={styles.title}>
          Welcome to eMessenger
        </Text>

        {/* SLIDER */}

        <View style={styles.sliderWrapper}>

          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : noticeData.length === 0 ? (
            <Text style={styles.noDataText}>
              No notices available
            </Text>
          ) : (

            <SwiperFlatList
              autoplay
              autoplayDelay={4}
              autoplayLoop
              showPagination
              paginationActiveColor="#fff"
              paginationDefaultColor="#aaa"
              index={0}
              style={{ width: width }}
            >

              {noticeData.map((item, index) => (

                <TouchableOpacity
                  key={index}
                  style={[styles.slide, { width: width }]}
                  onPress={() => openLink(item.document_link)}
                >

                  {item?.thumbnails ? (
                    <Image
                      source={{ uri: item.thumbnails }}
                      style={styles.noticeImage}
                    />
                  ) : (
                    <View style={styles.noImage}>
                      <Text>No Image</Text>
                    </View>
                  )}

                </TouchableOpacity>

              ))}

            </SwiperFlatList>

          )}

        </View>

        {/* BOTTOM IMAGE */}

        <View style={styles.bottomSection}>
          <Image
            source={require("../../assets/welcome-boy.png")}
            style={styles.bottomImage}
          />
        </View>
      </View>

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: "#ff484e"
  },

  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20
  },

  nextBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#B31217",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 25,
    zIndex: 10
  },

  nextText: {
    color: "#fff",
    fontWeight: "600"
  },
  noImage: {
    width: "85%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 16
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 80,
    marginBottom: 30
  },

  sliderWrapper: {
    width: "100%",
    alignItems: "center"
  },

  slide: {
    width: width,
    justifyContent: "center",
    alignItems: "center"
  },
  noticeImage: {
    width: "85%",
    height: 200,
    borderRadius: 16
  },

  mediaTag: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },

  mediaText: {
    color: "#fff",
    fontSize: 12
  },

  bottomSection: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "50%",
    justifyContent: "flex-end",
    alignItems: "center"
  },

  bottomImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  },

});