import VersionCheck from "react-native-version-check";
import { Alert, Linking } from "react-native";

export const checkAppUpdate = async () => {

  const latest = await VersionCheck.getLatestVersion();
  const current = VersionCheck.getCurrentVersion();

  if (latest !== current) {

    Alert.alert(
      "Update Available",
      "A new version of the app is available",
      [
        {
          text: "Update",
          onPress: () =>
            VersionCheck.needUpdate().then(res => {
              if (res?.isNeeded) {
                Linking.openURL(res.storeUrl);
              }
            })
        }
      ]
    );

  }

};