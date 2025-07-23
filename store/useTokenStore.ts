// store/useTokenStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserInfo {
    username: string;
    uid: string;
    isActived: boolean;
}

interface TokenStore {
    mytoken: string;
    userinfo: UserInfo;
    setToken: (token: string) => void;
    getToken: () => string;
    removeToken: () => void;
    setInfo: (username: string, uid: string, isActived: boolean) => void;
    getInfo: () => UserInfo;
    removeInfo: () => void;
}

export const useTokenStore = create<TokenStore>()(
    persist(
        (set, get) => ({
            mytoken: "",
            userinfo: {
                username: "",
                uid: "",
                isActived: false,
            },
            setToken: (token: string) => set({ mytoken: token }),
            getToken: () => get().mytoken,
            removeToken: () => set({ mytoken: "" }),
            setInfo: (username, uid, isActived) =>
                set({ userinfo: { username, uid, isActived } }),
            getInfo: () => get().userinfo,
            removeInfo: () =>
                set({
                    userinfo: { username: "", uid: "", isActived: false },
                }),
        }),
        {
            name: "token-store",
            storage: {
                getItem: async (key) => {
                    const value = await AsyncStorage.getItem(key);
                    return value ? JSON.parse(value) : null;
                },
                setItem: (key, value) => AsyncStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => AsyncStorage.removeItem(key),
            },
        }
    )
);
