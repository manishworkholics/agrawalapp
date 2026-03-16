import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/AppNavigator";
import { checkAppUpdate } from "./src/utils/checkAppUpdate";


import { navigationRef } from "./src/navigation/navigationService";

export default function App() {

  // useEffect(() => {
  //   setTimeout(() => {
  //     checkAppUpdate();
  //   }, 3000);
  // }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigator />
    </NavigationContainer>
  );
}