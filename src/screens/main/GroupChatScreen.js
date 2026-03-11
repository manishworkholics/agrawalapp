import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Modal,
    Linking
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { launchImageLibrary } from "react-native-image-picker";
import { pick } from "@react-native-documents/picker";

import io from "socket.io-client";

const socket = io("https://apps.actindore.com", {
    transports: ["websocket"]
});

const BASE_URL = "https://apps.actindore.com/api/";

export default function GroupChatScreen({ route }) {

    const { msgId, senderId, student, title } = route.params;

    const [messages, setMessages] = useState([]);
    const [teachers, setTeachers] = useState([]);

    const [message, setMessage] = useState("");
    const [image, setImage] = useState(null);
    const [pdf, setPdf] = useState(null);

    const [preview, setPreview] = useState(null);

    const [showTeachers, setShowTeachers] = useState(false);

    const [user, setUser] = useState(null);

    const flatRef = useRef();

    /* LOAD USER */

    useEffect(() => {

        (async () => {

            const u = JSON.parse(await AsyncStorage.getItem("user"));
            setUser(u);

        })();

    }, []);

    /* FETCH CHAT */

    const fetchChat = async () => {

        try {

            const res = await fetch(
                `${BASE_URL}chat/get_group_chat_message?groupId=${msgId}&chat_type=GROUPCHAT`
            );

            const data = await res.json();

            setMessages(data?.data || []);
            setTeachers(data?.five_numbers_Details || []);

        } catch (e) {
            console.log(e);
        }

    };

    /* SOCKET */

    useEffect(() => {

        fetchChat();

        socket.emit("join_group", msgId);

        socket.on("receive_message", (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => socket.off("receive_message");

    }, []);

    /* SEND MESSAGE */

    const sendMessage = async () => {

        let msgType = "TEXT";
        let link = null;

        if (image) {
            msgType = "IMAGE";
            link = image;
        }

        if (pdf) {
            msgType = "PDF";
            link = pdf;
        }

        if (!message && !link) return;

        const payload = {

            msg_id: parseInt(msgId),
            sender_id: parseInt(senderId),

            sender_detail: {
                student_name: student?.student_name,
                student_number: student?.student_number,
                color: student?.color
            },

            chat_type: "GROUPCHAT",
            sent_at: new Date().toISOString(),
            msg_type: msgType,
            group_id: parseInt(msgId),

            mobile_no: user?.mobile_no,

            message: msgType === "TEXT" ? message : "",
            link

        };

        await fetch(`${BASE_URL}chat/send_chat_msg`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...payload,
                sender_detail: JSON.stringify(payload.sender_detail)
            })
        });

        socket.emit("send_message", payload);

        setMessage("");
        setImage(null);
        setPdf(null);

    };

    /* IMAGE PICKER */
    /* IMAGE PICKER */

    const pickImage = () => {

        launchImageLibrary(
            { mediaType: "photo", quality: 0.7 },
            (res) => {

                if (res.didCancel) return;

                if (res.assets && res.assets.length > 0) {
                    setImage(res.assets[0].uri);
                }

            }
        );

    };


    /* PDF PICKER */

    const pickPdf = async () => {

        try {

            const res = await pick({
                type: ["application/pdf"]
            });

            if (res && res[0]) {
                setPdf(res[0].uri);
            }

        } catch (err) {

            console.log("PDF Cancelled");

        }

    };

    /* RENDER CHAT */

    const renderItem = ({ item }) => {

        let sender = {};

        try {
            sender = typeof item.sender_detail === "string"
                ? JSON.parse(item.sender_detail)
                : item.sender_detail;
        } catch { }

        const isUser =
            sender?.student_number === student?.student_number;

        return (

            <View style={[
                styles.row,
                isUser ? styles.right : styles.left
            ]}>

                <View style={[
                    styles.bubble,
                    isUser ? styles.userBubble : null
                ]}>

                    {!isUser && (

                        <Text style={{
                            color: sender?.color,
                            fontWeight: "600"
                        }}>
                            {sender?.student_name}-{sender?.student_number}
                        </Text>

                    )}

                    {item.message && (
                        <Text style={styles.msg}>{item.message}</Text>
                    )}

                    {item.link && item.link.includes(".pdf") && (
                        <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
                            <Text style={styles.pdf}>View PDF</Text>
                        </TouchableOpacity>
                    )}

                    {item.link && !item.link.includes(".pdf") && (
                        <TouchableOpacity onPress={() => setPreview(item.link)}>
                            <Image source={{ uri: item.link }} style={styles.image} />
                        </TouchableOpacity>
                    )}

                    <Text style={styles.time}>
                        {new Date(item.sent_at).toLocaleTimeString()}
                    </Text>

                </View>

            </View>

        );

    };

    return (

        <SafeAreaView style={{ flex: 1 }}>

            {/* HEADER */}

            <View style={styles.header}>

                <View style={{ flex: 1 }}>

                    <Text style={styles.title}>
                        {student?.student_number} - {student?.student_name}
                    </Text>

                    {title && (
                        <Text style={styles.subtitle}>{title}</Text>
                    )}

                </View>

                <TouchableOpacity
                    style={styles.menuBtn}
                    onPress={() => setShowTeachers(!showTeachers)}
                >

                    <Icon name="ellipsis-vertical" size={22} color="#333" />

                </TouchableOpacity>

            </View>

            {/* TEACHERS */}

            {showTeachers && (

                <View style={styles.teacherBox}>

                    <Text style={{ fontWeight: "700", marginBottom: 8 }}>
                        Available Teachers
                    </Text>

                    {teachers.map(t => (
                        <View key={t.student_main_id} style={styles.teacherItem}>

                            <View style={styles.teacherAvatar}>
                                <Text style={{ color: "#fff" }}>
                                    {t.student_name?.charAt(0)}
                                </Text>
                            </View>

                            <Text>
                                {t.student_number} - {t.student_name}
                            </Text>

                        </View>
                    ))}

                </View>

            )}

            {/* CHAT */}

            <FlatList
                ref={flatRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item, i) => i.toString()}
                onContentSizeChange={() => flatRef.current.scrollToEnd()}
            />

            {/* PREVIEW */}

            {image && (
                <Image source={{ uri: image }} style={styles.preview} />
            )}

            {/* INPUT */}

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >

                <View style={styles.inputBar}>

                    <TouchableOpacity style={styles.iconBtn} onPress={pickImage}>
                        <Icon name="image-outline" size={22} color="#333" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconBtn} onPress={pickPdf}>
                        <Icon name="attach-outline" size={22} color="#333" />
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Reply..."
                    />

                    <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                        <Icon name="send" size={18} color="#fff" />
                    </TouchableOpacity>

                </View>

            </KeyboardAvoidingView>

            {/* IMAGE PREVIEW */}

            <Modal visible={!!preview} transparent>

                <View style={styles.previewModal}>
                    <Image source={{ uri: preview }} style={styles.previewImage} />
                </View>

            </Modal>

        </SafeAreaView>

    );

}

const styles = StyleSheet.create({

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderColor: "#eee"
    },

    menuBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },

    title: { fontWeight: "700", fontSize: 16 },

    subtitle: { color: "#666" },

    teacherBox: {
        backgroundColor: "#fff",
        margin: 10,
        borderRadius: 12,
        padding: 12,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3
    },

    teacherItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8
    },

    teacherAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#E79C1D",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10
    },
    row: { padding: 10 },

    left: { alignItems: "flex-start" },

    right: { alignItems: "flex-end" },

    bubble: {
        backgroundColor: "#F3F0FF",
        padding: 12,
        borderRadius: 14,
        maxWidth: "80%",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2
    },

    userBubble: {
        backgroundColor: "#E79C1D"
    },

    msg: { fontSize: 14 },

    image: {
        width: 150,
        height: 150,
        marginTop: 5,
        borderRadius: 8
    },

    pdf: { color: "blue" },

    time: { fontSize: 10, color: "#777" },

    inputBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#eee"
    },

    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 6
    },

    sendBtn: {
        backgroundColor: "#E79C1D",
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 6
    },

    input: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        borderRadius: 20,
        paddingHorizontal: 14,
        height: 40
    },



    preview: {
        width: 120,
        height: 120,
        alignSelf: "center"
    },

    previewModal: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.9)",
        justifyContent: "center",
        alignItems: "center"
    },

    previewImage: {
        width: "90%",
        height: "70%",
        resizeMode: "contain"
    }

});