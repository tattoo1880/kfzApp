import { useTokenStore } from "@/store/useTokenStore";
import { API_URL } from "@/utils/apiUrl";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import {
    Button,
    Card,
    List,
    Modal,
    Portal,
    Text,
    TextInput
} from "react-native-paper";

export default function Scrapy() {

    const router = useRouter();

    const [kw, setKw] = useState("");
    const [loading, setLoading] = useState(false);
    const [cartsdata, setCartsData] = useState<any[]>([]);
    const [showdialog1, setShowdialog1] = useState(false);


    useFocusEffect(
        useCallback(() => {

            const loaddata = async () => {
                try {
                    console.log("Scrapy component mounted, fetching cart data...");
                    await fetchCartData();
                } catch (error) {
                    console.error("Error fetching cart data:", error);
                }
            }


            // 在组件聚焦时执行的逻辑
            console.log("Scrapy component focused");
            loaddata();
            return () => {
                // 在组件失焦时执行的清理逻辑
                console.log("Scrapy component unfocused");
            };
        }, [])
    );


    const fetchCartData = async () => {
        try {
            const token = useTokenStore.getState().getToken();
            const uid = useTokenStore.getState().getInfo().uid;

            const response = await axios.post(`${API_URL}/carts/getcarts`, {
                uid: uid,
            }, {
                headers: { "Authorization": `Bearer ${token}` },
            });

            console.log("分组信息:", response.data);
            // 根据返回的数据更新状态
            if (Array.isArray(response.data)) {
                setCartsData([...response.data]);
            } else {
                setCartsData([]);
            }

            // if (Array.isArray(response.data)) {
            //     setCardData([...response.data]);
            // } else {
            //     setCardData([]);
            // }
        } catch (error) {
            console.error("请求购物车数据出错:", error);
            // setCardData([]);
        }
    };





    const handleSearch = async (kw: string,shop_cid:string) => {
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
                    shopcid: shop_cid, 
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
                closeModal();
                // 这里可以处理成功的响应，比如更新状态或显示数据
                router.replace("/home/task");

            } else {
                console.error("Unexpected response status:", response.status);
                closeModal();
            }
        } catch (error) {
            console.error("Error during search:", error);
            closeModal();
            // 这里可以处理错误，比如显示错误消息
        } finally {
            setLoading(false);
            closeModal();
        }

    }

    const startScrapy = async (item: any, index: number) => {

        console.log("开始爬取分组:", item, "索引:", index);
        await handleSearch(kw, item.cid);

    }


    const openModal = async () => {
        await fetchCartData();
        setShowdialog1(true);
    };

    const closeModal = () => {
        setShowdialog1(false);
    };




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

            <Button mode="contained" onPress={ openModal } style={ styles.button }>
                Search
            </Button>


            <Portal>
                <Modal
                    visible={ showdialog1 }
                    onDismiss={ closeModal }
                    contentContainerStyle={ styles.modal }
                >
                    <Card style={ styles.modalCard }>
                        <Card.Title
                            title="确定爬取分组"
                            subtitle="选择分组进行爬取"
                        />
                        <Card.Content>
                            <ScrollView style={ styles.list }>
                                { cartsdata.length === 0 ? (
                                    <Text style={ styles.empty }>暂无数据</Text>
                                ) : (
                                    cartsdata.map((item, index) => (
                                        <List.Item
                                            key={ index }
                                            title={ item.name || `分组 ${index + 1}` }
                                            description={ `ID: ${item.cid} | 点击开始爬取` }
                                            left={ () => <Text style={ styles.deleteIcon }>🗑️</Text> }
                                            right={ () => <Text style={ styles.arrow }>›</Text> }
                                            onPress={ () => startScrapy(item, index) }
                                            style={ styles.listItem }
                                        />
                                    ))
                                ) }
                            </ScrollView>
                        </Card.Content>

                        <Card.Actions>
                            <Button onPress={ closeModal }>关闭</Button>
                        </Card.Actions>
                    </Card>
                </Modal>
            </Portal>
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
    card: {
        flex: 1,
        backgroundColor: "#c8dbdfff",
        width: "90%",
        padding: 20,
        marginTop: 20,
        maxHeight: "30%",
        marginVertical: 10,
        borderRadius: 12,
        elevation: 4,
        shadowColor: "#000",
        justifyContent: "center",
        alignItems: "center",
    },

    taskText: {
        fontSize: 16,
        marginVertical: 4,
        color: "#404145a9",
    },
    cardTitle: {
        marginLeft: -30,
        fontSize: 20,
        fontWeight: "bold",
        color: "#404145a9",
    },

    // 超简化的 Modal 样式
    modal: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        width: '100%',
        maxWidth: 400,
        maxHeight: '60%',
    },
    list: {
        maxHeight: 250,
    },
    listItem: {
        backgroundColor: '#f8f9fa',
        marginVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    deleteIcon: {
        fontSize: 20,
        alignSelf: 'center',
        marginLeft: 10,
    },
    arrow: {
        fontSize: 20,
        color: '#666',
        alignSelf: 'center',
        marginRight: 10,
    },
    empty: {
        textAlign: 'center',
        color: '#666',
        paddingVertical: 20,
    },
});




