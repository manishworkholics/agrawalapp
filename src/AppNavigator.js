
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./screens/auth/SplashScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import OtpScreen from "./screens/auth/OtpScreen";
import WelcomeScreen from "./screens/auth/WelcomeScreen";

import MainTabNavigator from "./navigation/MainTabNavigator";

/* CHAT SCREENS */
import IndividualChatScreen from "./screens/main/IndividualChatScreen";
import GroupChatScreen from "./screens/main/GroupChatScreen";
import MessageDetailScreen from "./screens/main/MessageDetailScreen";

/* OTHER SCREENS */
import SupportScreen from "./screens/main/SupportScreen";
import TermsConditionScreen from "./screens/main/TermsConditionScreen";

import Header from "./components/Header";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />

      <Stack.Screen name="MainTabs" component={MainTabNavigator} />

      <Stack.Screen name="IndividualChat" component={IndividualChatScreen} />
      <Stack.Screen name="GroupChat" component={GroupChatScreen} />
      <Stack.Screen name="MessageDetail" component={MessageDetailScreen} />

      <Stack.Screen
        name="Support"
        component={SupportScreen}
        options={{ headerShown: true }}
      />

      <Stack.Screen
        name="TermsCondition"
        component={TermsConditionScreen}
        options={{ headerShown: true }}
      />

    </Stack.Navigator>
  );
}