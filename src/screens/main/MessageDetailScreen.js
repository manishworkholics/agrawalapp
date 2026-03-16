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

const { msgId, sendedMsgId, student } = route.params;

const [loading,setLoading] = useState(true);
const [detail,setDetail] = useState(null);
const [myResponse,setMyResponse] = useState(null);
const [replyBodies,setReplyBodies] = useState([]);
const [token,setToken] = useState(null);
const [mobile,setMobile] = useState(null);
const [uploading,setUploading] = useState(false);

useEffect(()=>{

(async()=>{

const user = JSON.parse(await AsyncStorage.getItem("user"));
const tokenData = await AsyncStorage.getItem("token");

setMobile(user?.mobile_no);
setToken(tokenData);

})();

},[]);

useEffect(()=>{

if(token){

fetchMessage();
fetchMyResponse();

}

},[token]);

const fetchMessage = async()=>{

try{

const res = await fetch(
`${BASE_URL}msg/get_single_mst_msg_by_msg_id?msg_id=${msgId}&sended_msg_id=${sendedMsgId}`,
{
headers:{ Authorization:`Bearer ${token}` }
}
);

const data = await res.json();

setDetail(data);

}catch(e){

console.log(e);

}

setLoading(false);

};

const fetchMyResponse = async()=>{

try{

const res = await fetch(
`${BASE_URL}msg/reply-messages?msg_id=${msgId}&sended_msg_id=${sendedMsgId}`,
{
headers:{ Authorization:`Bearer ${token}` }
}
);

const data = await res.json();

setMyResponse(data);

}catch(e){

console.log(e);

}

};

const handleInputChange=(msg_body_id,msg_type,value)=>{

setReplyBodies(prev=>{

const updated=[...prev];

const index = updated.findIndex(x=>x.msg_body_id===msg_body_id);

if(index!==-1){

updated[index].data_reply_text=value;

}else{

updated.push({
msg_body_id,
msg_type,
data_reply_text:value
});

}

return updated;

});

};

const uploadImage = async(uri)=>{

const formData = new FormData();

formData.append("file",{
uri,
name:"image.jpg",
type:"image/jpeg"
});

const res = await fetch(
"https://apps.actindore.com/api/v1/admin/imageUpload_Use/imageUpload",
{
method:"POST",
body:formData,
headers:{ "Content-Type":"multipart/form-data" }
}
);

const data = await res.json();

return data.url;

};

const uploadFile = async(uri)=>{

const formData = new FormData();

formData.append("file",{
uri,
name:"file.pdf",
type:"application/pdf"
});

const res = await fetch(
"https://apps.actindore.com/api/v1/admin/pdfUpload_Use/pdfUpload",
{
method:"POST",
body:formData,
headers:{ "Content-Type":"multipart/form-data" }
}
);

const data = await res.json();

return data.url;

};

const openCamera=(msgBody)=>{

launchCamera(
{ mediaType:"photo" },
async(res)=>{

if(!res.didCancel && res.assets){

setUploading(true);

const url = await uploadImage(res.assets[0].uri);

handleInputChange(
msgBody.msg_body_id,
msgBody.msg_type,
JSON.stringify({ imageURIsave:url })
);

setUploading(false);

}

}
);

};

const pickFile=async(msgBody)=>{

try{

const res = await pick({ type:["*/*"] });

if(res && res[0]){

setUploading(true);

const url = await uploadFile(res[0].uri);

handleInputChange(
msgBody.msg_body_id,
msgBody.msg_type,
JSON.stringify({ imageURIsave:url })
);

setUploading(false);

}

}catch(e){

console.log(e);

}

};

const parse=(txt)=>{

try{

return txt ? JSON.parse(txt) : {};

}catch{

return {};

}

};

const validateReply=()=>{

const missing=[];

detail?.data?.msg_body?.forEach(body=>{

if(body.is_reply_required===1){

const response = replyBodies.find(
x=>x.msg_body_id===body.msg_body_id
);

if(!response){

missing.push(body.label);

return;

}

const data=parse(response.data_reply_text);

if(body.msg_type.includes("TEXT") && !data.text){

missing.push(body.label);

}

if(body.msg_type.includes("OPTION") && !data.selected){

missing.push(body.label);

}

if(body.msg_type.includes("CHECKBOX") && !data.selected){

missing.push(body.label);

}

if((body.msg_type.includes("CAMERA") || body.msg_type.includes("FILE")) && !data.imageURIsave){

missing.push(body.label);

}

}

});

if(missing.length){

Alert.alert("Required Fields",missing.join("\n"));

return false;

}

return true;

};

const handleReply=async()=>{

if(!validateReply()) return;

const payload={

msg_id:parseInt(msgId),
mobile_no:parseInt(mobile),
student_main_id:parseInt(student?.student_number),
sended_msg_id:parseInt(sendedMsgId),
student_number:student?.student_number,
replyBodies

};

try{

await fetch(
`${BASE_URL}msg/insertRepliedMessageAndBodies`,
{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify(payload)
}
);

Alert.alert("Success","Reply Sent");

fetchMyResponse();

}catch(e){

Alert.alert("Error","Reply failed");

}

};

const renderBody=(msgBody)=>{

const { msg_type,data_text,msg_body_id } = msgBody;

const parsed = parse(
replyBodies.find(x=>x.msg_body_id===msg_body_id)?.data_reply_text
);

return(

<View>

{data_text?.title && ( <Text style={styles.titleText}>
{data_text.title}
{msgBody.is_reply_required===1 && <Text style={{color:"red"}}> *</Text>} </Text>
)}

{data_text?.text && ( <Text style={styles.text}>{data_text.text}</Text>
)}

{msg_type.startsWith("LINK") && data_text?.link && (
<TouchableOpacity onPress={()=>Linking.openURL(data_text.link)}> <Text style={styles.link}>{data_text.link}</Text> </TouchableOpacity>
)}

{msg_type.startsWith("IMAGE") && data_text?.link && ( <Image source={{uri:data_text.link}} style={styles.image}/>
)}

{msg_type.startsWith("YOUTUBE") && data_text?.link && (
<TouchableOpacity onPress={()=>Linking.openURL(data_text.link)}>
<Image
source={{
uri:`https://img.youtube.com/vi/${data_text.link.split("v=")[1]}/0.jpg`
}}
style={styles.image}
/> </TouchableOpacity>
)}

{msg_type.startsWith("OPTION") &&
data_text?.options?.map((opt,i)=>(

<TouchableOpacity
key={i}
style={styles.option}
onPress={()=>handleInputChange(
msg_body_id,
msg_type,
JSON.stringify({ selected:{0:opt.option} })
)}

>

<Text>{opt.option}</Text>

</TouchableOpacity>

))
}

{msg_type.startsWith("CHECKBOX") &&
data_text?.options?.map((opt,i)=>(

<TouchableOpacity
key={i}
style={styles.option}
onPress={()=>handleInputChange(
msg_body_id,
msg_type,
JSON.stringify({ selected:{[i]:opt.option} })
)}

>

<Text>{opt.option}</Text>

</TouchableOpacity>

))
}

{msg_type.startsWith("TEXTBOX") && (

<TextInput
style={styles.input}
onChangeText={t=>handleInputChange(
msg_body_id,
msg_type,
JSON.stringify({ text:t })
)}
/>

)}

{msg_type.startsWith("TEXTAREA") && (

<TextInput
multiline
style={styles.textarea}
onChangeText={t=>handleInputChange(
msg_body_id,
msg_type,
JSON.stringify({ text:t })
)}
/>

)}

{msg_type.startsWith("CAMERA") && (

<View>

<TouchableOpacity
style={styles.uploadBtn}
onPress={()=>openCamera(msgBody)}

>

<Text style={styles.uploadText}>Upload Image</Text>

</TouchableOpacity>

{uploading && <ActivityIndicator/>}

{parsed.imageURIsave && (

<Image
source={{uri:parsed.imageURIsave}}
style={styles.preview}
/>

)}

</View>

)}

{msg_type.startsWith("FILE") && (

<View>

<TouchableOpacity
style={styles.uploadBtn}
onPress={()=>pickFile(msgBody)}

>

<Text style={styles.uploadText}>Upload File</Text>

</TouchableOpacity>

{parsed.imageURIsave && (

<TouchableOpacity
onPress={()=>Linking.openURL(parsed.imageURIsave)}

>

<Text style={styles.link}>View Uploaded File</Text>

</TouchableOpacity>

)}

</View>

)}

</View>

);

};

if(loading){

return(

<SafeAreaView style={styles.center}>
<ActivityIndicator size="large"/>
</SafeAreaView>

);

}

return(

<SafeAreaView style={{flex:1}}>

<ScrollView style={styles.container}>

<Text style={styles.title}>
{detail?.data?.msg_detail?.subject_text}
</Text>

<Text style={styles.date}>
Show Up to: {detail?.data?.msg_detail?.show_upto}
</Text>

{detail?.data?.msg_body?.map((msgBody,index)=>(

<View key={index} style={styles.card}>

<Text style={styles.label}>{msgBody.label}</Text>

{renderBody(msgBody)}

</View>

))}

{myResponse?.data?.replyBodies?.length>0 && (

<View style={styles.responseBox}>

<Text style={styles.responseTitle}>My Response</Text>

{myResponse.data.replyBodies.map((resp,i)=>{

const data=parse(resp.data_reply_text);

return(

<View key={i} style={{marginBottom:10}}>

{data.text && <Text>{data.text}</Text>}

{data.imageURIsave && (

<Image
source={{uri:data.imageURIsave}}
style={{width:120,height:120}}
/>

)}

</View>

);

})}

</View>

)}

<TouchableOpacity
style={styles.replyBtn}
onPress={handleReply}

>

<Text style={styles.replyText}>Send Reply</Text>

</TouchableOpacity>

</ScrollView>

</SafeAreaView>

);

}

const styles=StyleSheet.create({

container:{ padding:16, backgroundColor:"#F3F4F6" },

center:{ flex:1,justifyContent:"center",alignItems:"center" },

title:{ fontSize:18,fontWeight:"700" },

date:{ color:"#666", marginBottom:20 },

card:{
backgroundColor:"#fff",
padding:16,
borderRadius:10,
marginBottom:14
},

label:{ fontWeight:"700",marginBottom:10 },

text:{ fontSize:14 },

link:{ color:"#2563EB" },

image:{
width:"100%",
height:200,
borderRadius:10,
marginTop:10
},

option:{
borderWidth:1,
borderColor:"#ddd",
padding:10,
borderRadius:8,
marginBottom:8
},

input:{
borderWidth:1,
borderColor:"#ddd",
padding:10,
borderRadius:8
},

textarea:{
borderWidth:1,
borderColor:"#ddd",
padding:10,
borderRadius:8,
height:100
},

uploadBtn:{
backgroundColor:"#B31217",
padding:12,
borderRadius:8,
alignItems:"center",
marginTop:10
},

uploadText:{
color:"#fff",
fontWeight:"600"
},

preview:{
width:"100%",
height:180,
marginTop:10
},

replyBtn:{
backgroundColor:"#B31217",
padding:16,
borderRadius:10,
alignItems:"center",
marginTop:20,
marginBottom:50
},

replyText:{ color:"#fff",fontWeight:"700" },

titleText:{
fontSize:16,
fontWeight:"700",
marginBottom:6
},

responseBox:{
backgroundColor:"#fff",
padding:16,
borderRadius:10,
marginTop:20
},

responseTitle:{
fontWeight:"700",
marginBottom:10
}

});
