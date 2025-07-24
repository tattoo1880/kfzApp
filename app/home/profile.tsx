import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function Profile() {
    return (
        <View style={ styles.container }>
            <Text variant="headlineMedium">这是我的信息内容</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
