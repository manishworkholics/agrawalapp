import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import Pdf from "react-native-pdf";

const { width, height } = Dimensions.get("window");

export default function NoticeViewerScreen({ route }) {

  const { url, image } = route.params;

  const isYoutube = url?.includes("youtube") || url?.includes("youtu.be");
  const isPdf = url?.toLowerCase().includes(".pdf");

  return (
    <View style={styles.container}>

      {/* IMAGE */}

      {!url && image && (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      {/* YOUTUBE */}

      {isYoutube && (
        <WebView
          source={{ uri: url }}
          style={{ flex: 1 }}
        />
      )}

      {/* PDF */}

      {isPdf && (
        <Pdf
          source={{ uri: url }}
          style={{ flex: 1 }}
        />
      )}

      {/* DEFAULT WEB */}

      {!isYoutube && !isPdf && url && (
        <WebView
          source={{ uri: url }}
          style={{ flex: 1 }}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#000"
  },

  image: {
    width: width,
    height: height
  }

});