import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
    return (<SafeAreaView style={styles.safeArea}> <ScrollView showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>About App</Text>

        <View style={styles.card}>

            <Text style={styles.appName}>Student Connect</Text>

            <Text style={styles.text}>
                This application helps students connect with their schools,
                manage profiles, and access important information easily.
            </Text>

            <Text style={styles.sectionTitle}>Version</Text>
            <Text style={styles.text}>1.0.0</Text>

            <Text style={styles.sectionTitle}>Developed By</Text>
            <Text style={styles.text}>Act Indore Technology Team</Text>

            <Text style={styles.sectionTitle}>Contact</Text>
            <Text style={styles.text}>support@app.com</Text>

        </View>

    </ScrollView>
    </SafeAreaView>


    );
}

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: "#F2F4F7"
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        margin: 20,
        color: "#111827"
    },

    card: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 20,
        elevation: 4
    },

    appName: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 10
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginTop: 15
    },

    text: {
        fontSize: 14,
        color: "#374151",
        marginTop: 5
    }

});
