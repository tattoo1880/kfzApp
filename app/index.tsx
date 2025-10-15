// app/index.tsx
import { useTokenStore } from "@/store/useTokenStore";
import { useNavigation, useRouter } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function Index() {



  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("Username:", username);
    console.log("Password:", password);

    const response = await fetch("https://ss.purecode.dpdns.org/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: username,
        password: password,
      }),
    });

    if (response.ok) {
      try {

        const data = await response.json();
        console.log("Login successful:", data);
        // 这里可以处理登录成功后的逻辑，比如导航到其他页面
        console.log("Login successful:", data.uid, data.username, data.isActived);
        useTokenStore.getState().setToken(data.secToken);
        useTokenStore.getState().setInfo(data.username, data.uid, data.isActived);

        //! 验证usetoken已经存储到了值的
        console.log("Stored Token:", useTokenStore.getState().getToken());
        console.log("Stored User Info:", useTokenStore.getState().getInfo());

        // 导航到主页或其他页面
        router.replace("/home/scrapy");
      } catch (error) {
        console.error("Error parsing response:", error);
        //! todo 刷新页面

      }

    } else {
      console.error("Login failed:", response);
      console.error("Login failed:", response.statusText);
      // 这里可以处理登录失败的逻辑，比如显示错误消息
    }
  };

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      // headerShown: false,
      title: "上书宝",
    });
  }, [navigation]);

  return (
    <ImageBackground
      source={ {
        uri: "https://pbs.twimg.com/media/GwfalhYWAAAKgqv?format=jpg&name=large",
      } }
      style={ styles.background }
      resizeMode="cover"
    >
      <View style={ styles.container }>
        <Text variant="displayMedium" style={ styles.title }>
          LOGIN
        </Text>

        <TextInput
          label="Username"
          mode="outlined"
          value={ username }
          onChangeText={ setUsername }
          style={ styles.input }
        />

        <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry
          value={ password }
          onChangeText={ setPassword }
          style={ styles.input }
        />

        <Button mode="contained" onPress={ handleLogin } style={ styles.button }>
          Login
        </Button>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    margin: 20,
    borderRadius: 10,
    borderWidth: 1,
    padding: 20,
  },
  title: {
    textAlign: "center",
    color: "skyblue",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});
