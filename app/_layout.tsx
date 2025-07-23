// app/_layout.tsx
import { Stack } from "expo-router";
import { PaperProvider, DefaultTheme } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

// 自定义主题
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#6a9fdbff", // 设置主色
    background: "#f2ececff",
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: "#fff",
        }}
      />
    </PaperProvider>
  );
}
