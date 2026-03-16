import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FAQScreen() {
    return (


        <SafeAreaView style={styles.safeArea}>
            <ScrollView>

                <Text style={styles.title}>FAQ</Text>

                <View style={styles.card}>

                    <Text style={styles.question}>
                        How do I update my profile?
                    </Text>

                    <Text style={styles.answer}>
                        Go to the profile section and update your personal details.
                    </Text>

                    <Text style={styles.question}>
                        How can I contact support?
                    </Text>

                    <Text style={styles.answer}>
                        You can contact support from the Support section of the app.
                    </Text>

                    <Text style={styles.question}>
                        Is my data secure?
                    </Text>

                    <Text style={styles.answer}>
                        Yes, all data is securely stored and protected.
                    </Text>

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
        margin: 20
    },

    card: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 20,
        elevation: 4
    },

    question: {
        fontSize: 15,
        fontWeight: "700",
        marginTop: 10
    },

    answer: {
        fontSize: 14,
        color: "#374151",
        marginTop: 5
    }

});
