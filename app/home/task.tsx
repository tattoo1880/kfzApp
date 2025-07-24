import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useTokenStore } from "@/store/useTokenStore";

export default function Task() {

    //todo: 任务页面内容
    // 1. 先获取userinfo和token
    console.log("获取用户信息和token");
    console.log("Stored Token:", useTokenStore.getState().getToken());
    console.log("Stored User Info:", useTokenStore.getState().getInfo());   
    return (
        <View style={ styles.container }>
            <Text variant="headlineMedium">这是任务内容</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
