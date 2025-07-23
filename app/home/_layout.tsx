import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from "expo-router";

export default function HomeLayout() {
    return (
        <Tabs
            screenOptions={ {
                tabBarActiveTintColor: 'green',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            } }
        >
            <Tabs.Screen
                name="page1"
                options={ {
                    title: "首页",
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={ size } color={ color } />,
                } }
            />
            <Tabs.Screen
                name="page2"
                options={ {
                    title: "发现",
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="search" size={ size } color={ color } />,
                } }
            />
            <Tabs.Screen
                name="page3"
                options={ {
                    title: "消息",
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="message" size={ size } color={ color } />,
                } }
            />
            <Tabs.Screen
                name="page4"
                options={ {
                    title: "我的",
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={ size } color={ color } />,
                } }
            />
        </Tabs>
    );
}
