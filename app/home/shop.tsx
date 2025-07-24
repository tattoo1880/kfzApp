import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function Shop() {
    return (
        <View style={ styles.container }>
            <Text variant="headlineMedium">这是店铺内容</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
