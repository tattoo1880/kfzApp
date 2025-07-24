import { MaterialIcons } from '@expo/vector-icons';
import { Tabs, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";


export default function HomeLayout() {
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            // headerShown: false,
            title: "上书宝",
        });
    }, [navigation]);
    return (
        <Tabs
            screenOptions={ {
                tabBarActiveTintColor: 'skyblue',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            } }
        >
            <Tabs.Screen
                name="scrapy"
                options={ {
                    title: "爬虫",
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={ size } color={ color } />,
                } }
            />
            <Tabs.Screen
                name="task"
                options={ {
                    title: "任务",
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="search" size={ size } color={ color } />,
                } }
            />
            <Tabs.Screen
                name="shop"
                options={ {
                    title: "店铺",
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="message" size={ size } color={ color } />,
                } }
            />
            <Tabs.Screen
                name="profile"
                options={ {
                    title: "我的",
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={ size } color={ color } />,
                } }
            />
        </Tabs>
    );
}
