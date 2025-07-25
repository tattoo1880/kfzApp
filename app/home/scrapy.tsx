import { useTokenStore } from "@/store/useTokenStore";
import { API_URL } from "@/utils/apiUrl";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";


export default function Scrapy() {

    const router = useRouter();

    const [kw, setKw] = useState("");
    const [loading, setLoading] = useState(false);



    const handleSearch = async (kw: string) => {
        console.log("Searching for:", kw);
        const uid = useTokenStore.getState().getInfo().uid;
        console.log("User ID:", uid);

        try {
            setLoading(true);
            console.log("Sending request to API...");

            const response = await axios.post(`${API_URL}/api/newgetallinfo`,
                {
                    shopid: kw,
                    uid: uid,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${useTokenStore.getState().getToken()}`,
                    },
                    timeout: 0, // 设置超时时间为10秒
                }
            );

            console.log("Response status:", response);
            if (response.status === 200) {
                console.log("Response data:", response.data);
                // 这里可以处理成功的响应，比如更新状态或显示数据
                router.replace("/home/task");

            } else {
                console.error("Unexpected response status:", response.status);
            }
        } catch (error) {
            console.error("Error during search:", error);
            // 这里可以处理错误，比如显示错误消息
        } finally {
            setLoading(false);
        }

    }

    console.log("获取用户信息和token");
    console.log("Stored Token:", useTokenStore.getState().getToken());
    console.log("Stored User Info:", useTokenStore.getState().getInfo());

    if (loading) {
        return (
            <View style={ styles.container }>
                <ActivityIndicator size="large" />
                <Text>正在抓取店铺信息，请稍候...</Text>
            </View>
        );
    }
    return (
        <View style={ styles.container }>
            <TextInput
                label="请输入上传的店铺ID"
                mode="outlined"
                value={ kw }
                onChangeText={ setKw }
                style={ styles.input }
            />

            <Button mode="contained" onPress={ () => handleSearch(kw) } style={ styles.button }>
                Search
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    input: { width: "80%", marginBottom: 20 },
    button: { width: "80%", padding: 10, backgroundColor: "#6200EE" },
    title: {
        textAlign: "center", color: "skyblue", marginBottom: 20,
    },
});




