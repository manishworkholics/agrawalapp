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
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchCamera } from "react-native-image-picker";
import { pick } from "@react-native-documents/picker";


const BASE_URL = "https://apps.actindore.com/api/";

export default function MessageDetailScreen({ route }) {

    const { msgId, sendedMsgId, student } = route.params;

    const [loading, setLoading] = useState(true);
    const [detail, setDetail] = useState(null);
    const [myResponse, setMyResponse] = useState(null);
    const [replyBodies, setReplyBodies] = useState([]);
    const [token, setToken] = useState(null);
    const [mobile, setMobile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {

        (async () => {

            const user = JSON.parse(await AsyncStorage.getItem("user"));
            const tokenData = await AsyncStorage.getItem("token");

            setMobile(user?.mobile_no);
            setToken(tokenData);

        })();

    }, []);

    useEffect(() => {

        if (token) {

            fetchMessage();
            fetchMyResponse();

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

    const fetchMyResponse = async () => {

        try {

            const res = await fetch(
                `${BASE_URL}msg/reply-messages?msg_id=${msgId}&sended_msg_id=${sendedMsgId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const data = await res.json();

            setMyResponse(data);

        } catch (e) {

            console.log(e);

        }

    };

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

    const uploadImage = async (uri) => {

        const formData = new FormData();

        formData.append("file", {
            uri,
            name: "image.jpg",
            type: "image/jpeg"
        });

        const res = await fetch(
            "https://apps.actindore.com/api/v1/admin/imageUpload_Use/imageUpload",
            {
                method: "POST",
                body: formData,
                headers: { "Content-Type": "multipart/form-data" }
            }
        );

        const data = await res.json();

        return data.url;

    };

    const uploadFile = async (uri) => {

        const formData = new FormData();

        formData.append("file", {
            uri,
            name: "file.pdf",
            type: "application/pdf"
        });

        const res = await fetch(
            "https://apps.actindore.com/api/v1/admin/pdfUpload_Use/pdfUpload",
            {
                method: "POST",
                body: formData,
                headers: { "Content-Type": "multipart/form-data" }
            }
        );

        const data = await res.json();

        return data.url;

    };

    const openCamera = (msgBody) => {

        launchCamera(
            { mediaType: "photo" },
            async (res) => {

                if (!res.didCancel && res.assets) {

                    setUploading(true);

                    const url = await uploadImage(res.assets[0].uri);

                    handleInputChange(
                        msgBody.msg_body_id,
                        msgBody.msg_type,
                        JSON.stringify({ imageURIsave: url })
                    );

                    setUploading(false);

                }

            }
        );

    };

    const pickFile = async (msgBody) => {

        try {

            const res = await pick({ type: ["*/*"] });

            if (res && res[0]) {

                setUploading(true);

                const url = await uploadFile(res[0].uri);

                handleInputChange(
                    msgBody.msg_body_id,
                    msgBody.msg_type,
                    JSON.stringify({ imageURIsave: url })
                );

                setUploading(false);

            }

        } catch (e) {

            console.log(e);

        }

    };

    const parse = (txt) => {

        try {

            return txt ? JSON.parse(txt) : {};

        } catch {

            return {};

        }

    };

    const validateReply = () => {

        const missing = [];

        detail?.data?.msg_body?.forEach(body => {

            if (body.is_reply_required === 1) {

                const response = replyBodies.find(
                    x => x.msg_body_id === body.msg_body_id
                );

                if (!response) {

                    missing.push(body.label);

                    return;

                }

                const data = parse(response.data_reply_text);

                if (body.msg_type.includes("TEXT") && !data.text) {

                    missing.push(body.label);

                }

                if (body.msg_type.includes("OPTION") && !data.selected) {

                    missing.push(body.label);

                }

                if (body.msg_type.includes("CHECKBOX") && !data.selected) {

                    missing.push(body.label);

                }

                if ((body.msg_type.includes("CAMERA") || body.msg_type.includes("FILE")) && !data.imageURIsave) {

                    missing.push(body.label);

                }

            }

        });

        if (missing.length) {

            Alert.alert("Required Fields", missing.join("\n"));

            return false;

        }

        return true;

    };

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

            fetchMyResponse();

        } catch (e) {

            Alert.alert("Error", "Reply failed");

        }

    };

    const renderBody = (msgBody) => {

        const { msg_type, data_text, msg_body_id } = msgBody;

        const parsed = parse(
            replyBodies.find(x => x.msg_body_id === msg_body_id)?.data_reply_text
        );

        return (
            <View>

                {/* TITLE */}
                {data_text?.title ? (
                    <Text style={styles.titleText}>
                        {String(data_text.title)}
                        {msgBody.is_reply_required === 1 && (
                            <Text style={{ color: "red" }}> *</Text>
                        )}
                    </Text>
                ) : null}

                {/* TEXT */}
                {data_text?.text ? (
                    <Text style={styles.text}>
                        {String(data_text.text)}
                    </Text>
                ) : null}

                {/* LINK */}
                {msg_type.startsWith("LINK") && data_text?.link ? (
                    <TouchableOpacity onPress={() => Linking.openURL(data_text.link)}>
                        <Text style={styles.link}>{String(data_text.link)}</Text>
                    </TouchableOpacity>
                ) : null}

                {/* IMAGE */}
                {msg_type.startsWith("IMAGE") && data_text?.link ? (
                    <Image source={{ uri: data_text.link }} style={styles.image} />
                ) : null}

                {/* YOUTUBE */}
                {msg_type.startsWith("YOUTUBE") && data_text?.link ? (
                    <TouchableOpacity onPress={() => Linking.openURL(data_text.link)}>
                        <Image
                            source={{
                                uri: `https://img.youtube.com/vi/${data_text.link.split("v=")[1]}/0.jpg`
                            }}
                            style={styles.image}
                        />
                    </TouchableOpacity>
                ) : null}

                {/* OPTION (Radio) */}
                {msg_type.startsWith("OPTION") &&
                    data_text?.options?.map((opt, i) => {

                        const isSelected = parsed?.selected?.[0] === opt.option;

                        return (
                            <TouchableOpacity
                                key={i}
                                style={[
                                    styles.option,
                                    isSelected && styles.selectedOption
                                ]}
                                onPress={() =>
                                    handleInputChange(
                                        msg_body_id,
                                        msg_type,
                                        JSON.stringify({ selected: { 0: opt.option } })
                                    )
                                }
                            >
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={{ marginRight: 8 }}>
                                        {isSelected ? "🔘" : "⚪"}
                                    </Text>
                                    <Text style={isSelected && styles.selectedText}>
                                        {String(opt.option)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                }

                {/* CHECKBOX */}
                {msg_type.startsWith("CHECKBOX") &&
                    data_text?.options?.map((opt, i) => {

                        const currentSelected = parsed?.selected || {};
                        const isSelected = currentSelected[i] === opt.option;

                        return (
                            <TouchableOpacity
                                key={i}
                                style={[
                                    styles.option,
                                    isSelected && styles.selectedOption
                                ]}
                                onPress={() => {

                                    let updated = { ...currentSelected };

                                    if (updated[i]) {
                                        delete updated[i];
                                    } else {
                                        updated[i] = opt.option;
                                    }

                                    handleInputChange(
                                        msg_body_id,
                                        msg_type,
                                        JSON.stringify({ selected: updated })
                                    );
                                }}
                            >
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={{ marginRight: 8 }}>
                                        {isSelected ? "☑️" : "⬜"}
                                    </Text>
                                    <Text style={isSelected && styles.selectedText}>
                                        {String(opt.option)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                }

                {/* TEXTBOX */}
                {msg_type.startsWith("TEXTBOX") && (
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your answer..."
                        onChangeText={t =>
                            handleInputChange(
                                msg_body_id,
                                msg_type,
                                JSON.stringify({ text: t })
                            )
                        }
                    />
                )}

                {/* TEXTAREA */}
                {msg_type.startsWith("TEXTAREA") && (
                    <TextInput
                        multiline
                        style={styles.textarea}
                        placeholder="Write your response..."
                        onChangeText={t =>
                            handleInputChange(
                                msg_body_id,
                                msg_type,
                                JSON.stringify({ text: t })
                            )
                        }
                    />
                )}

                {/* CAMERA */}
                {msg_type.startsWith("CAMERA") && (
                    <View>

                        <TouchableOpacity
                            style={styles.uploadBtn}
                            onPress={() => openCamera(msgBody)}
                        >
                            <Text style={styles.uploadText}>Upload Image</Text>
                        </TouchableOpacity>

                        {uploading && <ActivityIndicator style={{ marginTop: 10 }} />}

                        {parsed?.imageURIsave ? (
                            <Image
                                source={{ uri: parsed.imageURIsave }}
                                style={styles.preview}
                            />
                        ) : null}

                    </View>
                )}

                {/* FILE */}
                {msg_type.startsWith("FILE") && (
                    <View>

                        <TouchableOpacity
                            style={styles.uploadBtn}
                            onPress={() => pickFile(msgBody)}
                        >
                            <Text style={styles.uploadText}>Upload File</Text>
                        </TouchableOpacity>

                        {parsed?.imageURIsave ? (
                            <TouchableOpacity
                                onPress={() => Linking.openURL(parsed.imageURIsave)}
                            >
                                <Text style={styles.link}>View Uploaded File</Text>
                            </TouchableOpacity>
                        ) : null}

                    </View>
                )}

            </View>
        );
    };

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

                        <Text style={styles.label}>{msgBody.label}</Text>

                        {renderBody(msgBody)}

                    </View>

                ))}

                {myResponse?.data?.replyBodies?.length > 0 && (

                    <View style={styles.responseBox}>

                        <Text style={styles.responseTitle}>My Response</Text>

                        {myResponse.data.replyBodies.map((resp, i) => {

                            const data = parse(resp.data_reply_text);

                            return (

                                <View key={i} style={{ marginBottom: 10 }}>

                                    {data.text && <Text>{data.text}</Text>}

                                    {data.imageURIsave && (

                                        <Image
                                            source={{ uri: data.imageURIsave }}
                                            style={{ width: 120, height: 120 }}
                                        />

                                    )}

                                </View>

                            );

                        })}

                    </View>

                )}



                <TouchableOpacity style={styles.replyBtn} onPress={handleReply}>
                    <LinearGradient
                        colors={["#FF7BA5", "#D7265E"]}
                        style={styles.replyGradient}
                    >
                        <Text style={styles.replyText}>Send Reply</Text>
                    </LinearGradient>
                </TouchableOpacity>

            </ScrollView>

        </SafeAreaView>

    );

}

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: "#F8F7FB"
    },

    container: {
        paddingTop: 10,
        paddingBottom: 40
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8F7FB"
    },

    /* HEADER */

    title: {
        fontSize: 22,
        fontWeight: "800",
        color: "#D7265E",
        marginHorizontal: 20,
        marginTop: 10
    },

    date: {
        fontSize: 13,
        color: "#8A94A6",
        marginHorizontal: 20,
        marginBottom: 12
    },

    /* CARD */

    card: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 20,
        marginTop: 12,
        borderRadius: 22,
        padding: 16,
        borderWidth: 1,
        borderColor: "#EEEAF4",
        shadowColor: "#1F2937",
        shadowOpacity: 0.07,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3
    },

    label: {
        fontSize: 14,
        fontWeight: "800",
        color: "#111827",
        marginBottom: 10
    },

    titleText: {
        fontSize: 15,
        fontWeight: "800",
        color: "#111827",
        marginBottom: 6
    },

    text: {
        fontSize: 13,
        color: "#6B7280",
        lineHeight: 20
    },

    /* LINK */

    link: {
        color: "#D7265E",
        marginTop: 6,
        fontWeight: "600"
    },

    /* IMAGE */

    image: {
        width: "100%",
        height: 200,
        borderRadius: 14,
        marginTop: 10
    },

    /* OPTIONS */

    option: {
        borderWidth: 1,
        borderColor: "#EEEAF4",
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: "#FCFCFE"
    },

    /* INPUT */

    input: {
        borderWidth: 1,
        borderColor: "#EEEAF4",
        padding: 12,
        borderRadius: 12,
        backgroundColor: "#FCFCFE"
    },

    textarea: {
        borderWidth: 1,
        borderColor: "#EEEAF4",
        padding: 12,
        borderRadius: 12,
        height: 110,
        backgroundColor: "#FCFCFE"
    },

    /* UPLOAD BUTTON */

    uploadBtn: {
        backgroundColor: "#FFF1F5",
        padding: 12,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#FAD1E0"
    },

    uploadText: {
        color: "#D7265E",
        fontWeight: "700"
    },

    preview: {
        width: "100%",
        height: 180,
        marginTop: 10,
        borderRadius: 12
    },

    /* RESPONSE BOX */

    responseBox: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 22,
        padding: 16,
        borderWidth: 1,
        borderColor: "#EEEAF4",
        shadowColor: "#1F2937",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2
    },

    responseTitle: {
        fontSize: 15,
        fontWeight: "800",
        marginBottom: 10,
        color: "#111827"
    },

    /* BUTTON */

    replyBtn: {
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom:30,
        borderRadius: 18,
        overflow: "hidden"
    },

    replyGradient: {
        padding: 16,
        alignItems: "center"
    },

    replyText: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 15
    },
    selectedOption: {
        backgroundColor: "#FFF1F5",
        borderColor: "#D7265E"
    },

    selectedText: {
        color: "#D7265E",
        fontWeight: "700"
    },


});
