import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

export default function NotificationScreen() {

    const notifications = [
        { id: 1, text: "Your profile has been updated successfully." },
        { id: 2, text: "New school announcement available." },
        { id: 3, text: "Welcome to the Student Connect App." }
    ];

    return (


        <SafeAreaView style={styles.safeArea}>

            <ScrollView>

                <Text style={styles.title}>Notifications</Text>

                {notifications.map((item) => (

                    <View key={item.id} style={styles.card}>

                        <Icon name="notifications-outline" size={22} color="#374151" />

                        <Text style={styles.text}>
                            {item.text}
                        </Text>

                    </View>

                ))}

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
        marginBottom: 15,
        padding: 18,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        elevation: 3
    },

    text: {
        marginLeft: 12,
        fontSize: 14,
        flex: 1
    }

});
