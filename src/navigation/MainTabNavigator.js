import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

import HomeScreen from "../screens/main/HomeScreen";
import ProfileScreen from "../screens/main/ProfileScreen";
import FeesScreen from "../screens/main/FeesScreen";
import ViewIdScreen from "../screens/main/ViewIdScreen";

import Header from "../components/Header";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        header: () => <Header />,

        tabBarActiveTintColor: "#D7265E",
        tabBarInactiveTintColor: "#2F4F4F",

        /* 🔥 MAIN STYLE */
        tabBarStyle: {
          height: 75,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -3 },
          paddingBottom: 8
        },

        /* 👇 ICON + LABEL NICHE SHIFT */
        tabBarItemStyle: {
          justifyContent: "flex-end",
          marginTop: 7
        },

        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
          fontWeight: "800"
        },

        /* 🔥 GRADIENT BACKGROUND */
        tabBarBackground: () => (
          <LinearGradient
            colors={["#FAEBD7", "#FFE4E1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          />
        )
      }}
    >
      {/* HOME */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={24} color={color} />
          )
        }}
      />

      {/* PROFILE */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="person" size={24} color={color} />
          )
        }}
      />

      {/* FEES */}
      <Tab.Screen
        name="Fees"
        component={FeesScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="logo-alipay" size={24} color={color} />
          )
        }}
      />

      {/* VIEW ID */}
      <Tab.Screen
        name="View Id"
        component={ViewIdScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="id-card-outline" size={24} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
}