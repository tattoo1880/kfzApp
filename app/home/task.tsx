import { useTokenStore } from "@/store/useTokenStore";
import { API_URL } from "@/utils/apiUrl";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";



export default function Task() {
    const token = useTokenStore.getState().getToken();
    const userInfo = useTokenStore.getState().getInfo();
    const uid = userInfo?.uid || 0;  // 获取用户ID，默认为0

    type UserData = { shopName?: string } | null;
    const [data, setData] = useState<UserData>(null);
    const [taskdata, setTaskdata] = useState(null);  // 保存请求回来的数据
    const [loading, setLoading] = useState(true);   // 控制加载状态

    const fetchData = useCallback(() => {
        const fetchData = async () => {
            try {
                console.log("正在请求后端数据...");
                const response = await axios.get(`${API_URL}/api/getuserbyuid/${uid}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const res = await axios.post(`${API_URL}/good/gettodaytaskinfo`,
                    { uid },
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    }
                );

                console.log("请求返回:", res.data);
                setTaskdata(res.data);
                // 移除对 taskdata 的直接引用以避免依赖警告
                // console.log("请求数据:", taskdata);
                console.log("请求成功:", response.data);
                setData(response.data);
            } catch (error) {
                console.error("请求出错:", error);
            } finally {
                setLoading(false);
            }
        };

        setLoading(true); // 每次聚焦前先设为 loading
        fetchData();
    }, [uid, token])

    useFocusEffect(fetchData);

    // 清空任务数据的处理函数
    const handleClearTasks = async () => {

        try {
            const res = await axios.post(`${API_URL}/good/deltealltask`,
                {
                    uid: uid,
                    usernick: (data && "shop" in data && (data as any).shop?.shopName) || "未知用户",
                },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

            console.log("清空任务响应:", res.data);
            // !todo 重新加载页面
            fetchData(); // 重新获取任务数据

        } catch (error) {
            console.log(error)
            return null

        }
    }


    // ⏳ 加载中
    if (loading) {
        return (
            <View style={ styles.container }>
                <ActivityIndicator size="large" />
                <Text>正在加载任务数据...</Text>
            </View>
        );
    }

    // ✅ 加载完成
    return (
        <View style={ styles.container }>
            <Card style={ styles.card }>
                <Card.Title title="任务统计" titleStyle={ styles.cardTitle } />
                <Card.Content>
                    <Text style={ styles.taskText }>📤 今日已上传任务: { taskdata ? taskdata[0] : "无数据" }</Text>
                    <Text style={ styles.taskText }>📥 今日未完成任务: { taskdata ? taskdata[1] : "无数据" }</Text>
                </Card.Content>
            </Card>
            {/* 添加一个按钮用于清空任务 */ }
            <Button
                mode="contained"
                icon="delete"
                onPress={ handleClearTasks }
                style={ styles.button }
                contentStyle={ { paddingVertical: 6 } }
            >
                清空任务
            </Button>
        </View>





    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#c0cbd5ff", // 淡灰背景
    },
    card: {
        flex: 1,
        backgroundColor: "#c8dbdfff", // 白色背景
        width: "90%",
        padding: 20,
        marginTop: 20,
        maxHeight: "30%",
        marginVertical: 10,
        borderRadius: 12,
        elevation: 4, // 阴影
        shadowColor: "#000",
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        marginTop: 20,
        width: "80%",
        borderRadius: 10,
    },
    taskText: {
        fontSize: 16,
        marginVertical: 4,
        color: "#404145a9", // 深色文字
    },
    cardTitle: {
        marginLeft: -30,
        fontSize: 20,
        fontWeight: "bold",
        color: "#404145a9", // 深色标题
    },
});
