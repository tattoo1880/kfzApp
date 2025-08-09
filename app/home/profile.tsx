import { useTokenStore } from '@/store/useTokenStore';
import { API_URL } from '@/utils/apiUrl';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Avatar, Button, Card, Text } from 'react-native-paper';
import { router } from 'expo-router';

export default function Profile() {
	const token = useTokenStore.getState().getToken();
	const userInfo = useTokenStore.getState().getInfo();
	const uid = userInfo?.uid || 0;
	// const navigation = useNavigation();

	const [loading, setLoading] = useState(true);
	const [profile, setProfile] = useState<any>(null);

	const getmyallinfo = async () => {
		const uid = useTokenStore.getState().getInfo().uid;
		const jwt = useTokenStore.getState().getToken();

		try {
			const res = await axios.get(`${API_URL}/api/getuserbyuid/${uid}`, {
				headers: { Authorization: `Bearer ${jwt}` },
			});
            console.log('用户信息获取成功:', res.data);
			setProfile(res.data);
		} catch (error) {
			console.error('获取用户信息失败:', error);
			Alert.alert('错误', '获取用户信息失败，请重试');
		} finally {
			setLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			setLoading(true);
			getmyallinfo();
		}, [])
	);

	const handleRecharge = () => {
		console.log('点击了充值');
		// 未来可跳转到充值页
        Alert.alert('提示', '为支付宝,微信预留！');
	};

	const handleLogout = () => {
		// 可清理 token，跳转到登录页
        useTokenStore.getState().removeInfo();
        useTokenStore.getState().removeToken();
        router.replace('/');
	
	};

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" />
				<Text style={{ marginTop: 10 }}>正在加载个人信息...</Text>
			</View>
		);
	}

	if (!profile) {
		return (
			<View style={styles.loadingContainer}>
				<Text>用户信息加载失败</Text>
			</View>
		);
	}

	const username = profile.username || '未知用户';
	const userId = profile.uid || '无ID';
	const amountLeft = profile.userQuota?.quotaLeft ?? '未知';

	return (
		<View style={styles.container}>
			<Card style={styles.card} elevation={4}>
				<Card.Content style={styles.content}>
					{/* 头像（可用本地图片或者网络图片） */}
					<Avatar.Image
						size={96}
						source={require('@/assets/avatar.png')} // 你可以换成实际图片路径
						style={styles.avatar}
					/>
					<Text variant="titleLarge" style={styles.username}>
						{username}
					</Text>
					<Text variant="bodyMedium" style={styles.userId}>
						用户ID: {userId}
					</Text>
					<Text variant="bodyMedium" style={styles.amount}>
						剩余次数: {amountLeft}
					</Text>
				</Card.Content>
				<Card.Actions style={styles.actions}>
					<Button mode="contained" icon="wallet" onPress={handleRecharge} style={styles.rechargeBtn} buttonColor="#00b894">
						充值
					</Button>
					<Button mode="outlined" icon="logout" onPress={handleLogout} style={styles.logoutBtn} textColor="#d63031" buttonColor="#fff">
						退出登录
					</Button>
				</Card.Actions>
			</Card>
		</View>
	);
}

// 样式
const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f5f6fa',
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f5f6fa',
		padding: 20,
	},
	card: {
		width: '100%',
		maxWidth: 380,
		alignItems: 'center',
		paddingVertical: 24,
		borderRadius: 18,
		backgroundColor: '#fff',
	},
	content: {
		alignItems: 'center',
		marginBottom: 20,
	},
	avatar: {
		marginBottom: 18,
		backgroundColor: '#dfe6e9',
	},
	username: {
		marginBottom: 6,
		color: '#222',
		fontWeight: 'bold',
	},
	userId: {
		marginBottom: 3,
		color: '#636e72',
	},
	amount: {
		marginBottom: 10,
		color: '#0984e3',
		fontWeight: 'bold',
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		paddingHorizontal: 16,
		marginTop: 14,
	},
	rechargeBtn: {
		flex: 1,
		marginRight: 10,
		borderRadius: 10,
	},
	logoutBtn: {
		flex: 1,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#dfe6e9',
	},
});
