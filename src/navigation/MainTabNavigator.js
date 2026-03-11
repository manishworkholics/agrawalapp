import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

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
        tabBarActiveTintColor: "#B31217",
      }}
    >
      <Tab.Screen
        name="Home "
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="person" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Fees"
        component={FeesScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="logo-alipay" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="View Id"
        component={ViewIdScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="id-card-outline" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}