import messaging from "@react-native-firebase/messaging";

export const getFCMToken = async () => {

  const token = await messaging().getToken();

  console.log("FCM TOKEN:", token);

  return token;

};