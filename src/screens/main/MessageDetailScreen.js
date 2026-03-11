import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    ActivityIndicator,
    Alert,
    Linking
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

import { launchCamera } from "react-native-image-picker";
import { pick } from "@react-native-documents/picker";

const BASE_URL = "https://apps.actindore.com/api/";

export default function MessageDetailScreen({ route }) {
    const [uploading, setUploading] = useState(false);
    const { msgId, sendedMsgId, student } = route.params;

    const [loading, setLoading] = useState(true);
    const [detail, setDetail] = useState(null);
    const [replyBodies, setReplyBodies] = useState([]);
    const [token, setToken] = useState(null);
    const [mobile, setMobile] = useState(null);

    /* LOAD USER */

    useEffect(() => {

        (async () => {

            const user = JSON.parse(await AsyncStorage.getItem("user"));
            const tokenData = await AsyncStorage.getItem("token");

            setMobile(user?.mobile_no);
            setToken(tokenData);

        })();

    }, []);

    /* FETCH MESSAGE */

    useEffect(() => {

        if (token) {

            fetchMessage();

        }

    }, [token]);

    const fetchMessage = async () => {

        try {

            const res = await fetch(
                `${BASE_URL}msg/get_single_mst_msg_by_msg_id?msg_id=${msgId}&sended_msg_id=${sendedMsgId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const data = await res.json();

            setDetail(data);

        } catch (e) {

            console.log(e);

        }

        setLoading(false);

    };

    /* HANDLE INPUT */

    const handleInputChange = (msg_body_id, msg_type, value) => {

        setReplyBodies(prev => {

            const updated = [...prev];

            const index = updated.findIndex(x => x.msg_body_id === msg_body_id);

            if (index !== -1) {

                updated[index].data_reply_text = value;

            } else {

                updated.push({
                    msg_body_id,
                    msg_type,
                    data_reply_text: value
                });

            }

            return updated;

        });

    };

    /* CAMERA */

    const openCamera = (msgBody) => {

        launchCamera(
            { mediaType: "photo" },
            (response) => {

                if (!response.didCancel && response.assets) {

                    handleInputChange(
                        msgBody.msg_body_id,
                        msgBody.msg_type,
                        JSON.stringify({
                            imageURIsave: response.assets[0].uri
                        })
                    );

                }

            }
        );

    };

    /* FILE PICKER */

    const pickFile = async (msgBody) => {

        try {

            const res = await pick({
                type: ["*/*"]   // all file types
            });

            if (res && res[0]) {

                handleInputChange(
                    msgBody.msg_body_id,
                    msgBody.msg_type,
                    JSON.stringify({ imageURIsave: res[0].uri })
                );

            }

        } catch (err) {

            console.log(err);

        }

    };

    /* VALIDATION */

    const validateReply = () => {

        const missing = [];

        detail?.data?.msg_body?.forEach(body => {

            if (body.is_reply_required === 1) {

                const response = replyBodies.find(
                    x => x.msg_body_id === body.msg_body_id
                );

                if (!response) {
                    missing.push(body.data_text?.title || "Required Field");
                    return;
                }

                let parsed = {};

                try {
                    parsed = JSON.parse(response.data_reply_text);
                } catch (e) { }

                if (body.msg_type.startsWith("TEXTBOX") || body.msg_type.startsWith("TEXTAREA")) {
                    if (!parsed.text || parsed.text.trim() === "") {
                        missing.push(body.data_text?.title);
                    }
                }

                if (body.msg_type.startsWith("OPTION")) {
                    if (!parsed.selected) {
                        missing.push(body.data_text?.title);
                    }
                }

                if (body.msg_type.startsWith("CHECKBOX")) {
                    if (!parsed.selected) {
                        missing.push(body.data_text?.title);
                    }
                }

                if (body.msg_type.startsWith("CAMERA") || body.msg_type.startsWith("FILE")) {
                    if (!parsed.imageURIsave) {
                        missing.push(body.data_text?.title);
                    }
                }

            }

        });

        if (missing.length) {

            Alert.alert(
                "Required Fields",
                `Please fill: \n${missing.join("\n")}`
            );

            return false;

        }

        return true;

    };

    /* SEND REPLY */

    const handleReply = async () => {

        if (!validateReply()) return;

        const payload = {

            msg_id: parseInt(msgId),
            mobile_no: parseInt(mobile),
            student_main_id: parseInt(student?.student_number),
            sended_msg_id: parseInt(sendedMsgId),
            student_number: student?.student_number,
            replyBodies

        };

        try {

            await fetch(
                `${BASE_URL}msg/insertRepliedMessageAndBodies`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                }
            );

            Alert.alert("Success", "Reply Sent");

        } catch (e) {

            Alert.alert("Error", "Failed to send reply");

        }

    };

    /* RENDER BODY */

    const renderBody = (msgBody) => {

        const { msg_type, data_text, msg_body_id } = msgBody;

        return (

            <View>

                {/* TITLE */}
                {data_text?.title && (
                    <Text style={styles.titleText}>
                        {data_text.title}

                        {msgBody.is_reply_required === 1 && (
                            <Text style={styles.required}> *</Text>
                        )}

                    </Text>
                )}

                {/* TEXT */}
                {data_text?.text && (
                    <Text style={styles.text}>
                        {data_text.text}
                    </Text>
                )}

                {/* LINK */}
                {msg_type.startsWith("LINK") && data_text?.link && (
                    <TouchableOpacity onPress={() => Linking.openURL(data_text.link)}>
                        <Text style={styles.link}>
                            {data_text.link}
                        </Text>
                    </TouchableOpacity>
                )}

                {/* YOUTUBE */}
                {msg_type.startsWith("YOUTUBE") && data_text?.link && (
                    <TouchableOpacity onPress={() => Linking.openURL(data_text.link)}>
                        <Image
                            source={{ uri: `https://img.youtube.com/vi/${data_text.link.split("v=")[1]}/0.jpg` }}
                            style={styles.youtube}
                        />
                    </TouchableOpacity>
                )}

                {/* IMAGE */}
                {msg_type.startsWith("IMAGE") && data_text?.link && (
                    <Image
                        source={{ uri: data_text.link }}
                        style={styles.image}
                    />
                )}

                {/* OPTION */}
                {msg_type.startsWith("OPTION") &&
                    data_text?.options?.map((opt, i) => {

                        const selected = replyBodies.find(
                            x => x.msg_body_id === msg_body_id
                        )?.data_reply_text;

                        let isSelected = false;

                        try {
                            const parsed = JSON.parse(selected || "{}");
                            isSelected = parsed?.selected?.[0] === opt.option;
                        } catch { }

                        return (

                            <TouchableOpacity
                                key={i}
                                style={[
                                    styles.option,
                                    isSelected && styles.optionActive
                                ]}
                                onPress={() => handleInputChange(
                                    msg_body_id,
                                    msg_type,
                                    JSON.stringify({ selected: { 0: opt.option } })
                                )}
                            >

                                <Text style={[
                                    styles.optionText,
                                    isSelected && styles.optionTextActive
                                ]}>
                                    {opt.option}
                                </Text>

                            </TouchableOpacity>

                        )

                    })
                }

                {/* CHECKBOX */}
                {msg_type.startsWith("CHECKBOX") &&
                    data_text?.options?.map((opt, i) => {

                        const selected = replyBodies.find(
                            x => x.msg_body_id === msg_body_id
                        )?.data_reply_text;

                        let isSelected = false;

                        try {
                            const parsed = JSON.parse(selected || "{}");
                            isSelected = parsed?.selected?.[i];
                        } catch { }

                        return (

                            <TouchableOpacity
                                key={i}
                                style={[
                                    styles.option,
                                    isSelected && styles.optionActive
                                ]}
                                onPress={() => handleInputChange(
                                    msg_body_id,
                                    msg_type,
                                    JSON.stringify({ selected: { [i]: opt.option } })
                                )}
                            >

                                <Text style={[
                                    styles.optionText,
                                    isSelected && styles.optionTextActive
                                ]}>
                                    {opt.option}
                                </Text>

                            </TouchableOpacity>

                        )

                    })
                }

                {/* TEXTBOX */}
                {msg_type.startsWith("TEXTBOX") && (
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#999"
                        onChangeText={(t) => handleInputChange(
                            msg_body_id,
                            msg_type,
                            JSON.stringify({ text: t })
                        )}
                    />
                )}

                {/* TEXTAREA */}
                {msg_type.startsWith("TEXTAREA") && (
                    <TextInput
                        multiline
                        style={styles.textarea}
                        placeholderTextColor="#999"
                        onChangeText={(t) => handleInputChange(
                            msg_body_id,
                            msg_type,
                            JSON.stringify({ text: t })
                        )}
                    />
                )}

                {/* CAMERA */}
                {msg_type.startsWith("CAMERA") && (

                    <View>

                        <TouchableOpacity
                            style={styles.uploadBtn}
                            onPress={() => openCamera(msgBody)}
                        >

                            <Text style={styles.uploadText}>
                                📷 Upload Image
                            </Text>

                        </TouchableOpacity>

                        {uploading && <ActivityIndicator style={{ marginTop: 10 }} />}

                        {replyBodies.find(x => x.msg_body_id === msg_body_id)?.data_reply_text && (

                            <Image
                                source={{
                                    uri: JSON.parse(
                                        replyBodies.find(x => x.msg_body_id === msg_body_id)
                                            ?.data_reply_text
                                    ).imageURIsave
                                }}
                                style={styles.previewImage}
                            />

                        )}

                    </View>

                )}

                {/* FILE */}
                {msg_type.startsWith("FILE") && (

                    <View>

                        <TouchableOpacity
                            style={styles.uploadBtn}
                            onPress={() => pickFile(msgBody)}
                        >

                            <Text style={styles.uploadText}>
                                📎 Upload Document
                            </Text>

                        </TouchableOpacity>

                        {uploading && <ActivityIndicator style={{ marginTop: 10 }} />}

                        {replyBodies.find(x => x.msg_body_id === msg_body_id)?.data_reply_text && (

                            <View style={styles.filePreview}>
                                <Text style={{ fontSize: 14 }}>
                                    Document Selected
                                </Text>
                            </View>

                        )}

                    </View>

                )}

            </View>

        );
    };

    /* LOADING */

    if (loading) {

        return (

            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" />
            </SafeAreaView>

        );

    }

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ScrollView style={styles.container}>

                <Text style={styles.title}>
                    {detail?.data?.msg_detail?.subject_text}
                </Text>

                <Text style={styles.date}>
                    Show Up to: {detail?.data?.msg_detail?.show_upto}
                </Text>

                {detail?.data?.msg_body?.map((msgBody, index) => (
                    <View key={index} style={styles.card}>

                        <Text style={styles.label}>
                            {msgBody.label}
                        </Text>

                        {renderBody(msgBody)}

                    </View>
                ))}

                <TouchableOpacity
                    style={styles.replyBtn}
                    onPress={handleReply}
                >
                    <Text style={styles.replyText}>
                        Send Reply
                    </Text>
                </TouchableOpacity>

            </ScrollView>

        </SafeAreaView>

    );

}

const styles = StyleSheet.create({
    required: {
        color: "red",
        fontWeight: "bold"
    },

    container: { padding: 16, backgroundColor: "#F3F4F6" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },

    title: { fontSize: 18, fontWeight: "700", marginBottom: 5 },

    date: { fontSize: 13, color: "#6B7280", marginBottom: 20 },

    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 14
    },

    label: { fontWeight: "700", marginBottom: 10 },

    text: { fontSize: 14, lineHeight: 20 },

    link: {
        color: "#2563EB",
        textDecorationLine: "underline",
        marginTop: 5
    },

    image: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginTop: 10
    },

    option: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginBottom: 8
    },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10
    },

    textarea: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10,
        height: 90
    },

    uploadBtn: {
        backgroundColor: "#FF0000",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10
    },

    replyBtn: {
        backgroundColor: "#B31217",
        padding: 16,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 50,
        alignItems: "center"
    },
    titleText: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 8
    },

    youtube: {
        width: "100%",
        height: 200,
        borderRadius: 10
    },
    replyText: { color: "#fff", fontWeight: "700" },
    optionActive: {
        backgroundColor: "#FFE4E6",
        borderColor: "#B31217"
    },

    optionText: {
        fontSize: 14
    },

    optionTextActive: {
        color: "#B31217",
        fontWeight: "600"
    },

    uploadBtn: {
        backgroundColor: "#B31217",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10
    },

    uploadText: {
        color: "#fff",
        fontWeight: "600"
    },

    previewImage: {
        width: "100%",
        height: 180,
        borderRadius: 10,
        marginTop: 10
    },

    filePreview: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#F3F4F6",
        borderRadius: 8
    }

});