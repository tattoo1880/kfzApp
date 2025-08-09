import { useTokenStore } from '@/store/useTokenStore';
import { API_URL } from '@/utils/apiUrl';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, List, MD3Colors, Modal, Portal, Text } from 'react-native-paper';

export default function Task() {
	const token = useTokenStore.getState().getToken();
	const userInfo = useTokenStore.getState().getInfo();
	const uid = userInfo?.uid || 0;

	type UserData = { shop?: { shopName?: string } } | null;
	const [data, setData] = useState<UserData>(null);
	const [taskdata, setTaskdata] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showdialog1, setShowdialog1] = useState(false);
	const [carsdata, setCardData] = useState<any[]>([]);
	const [shopName, setShopName] = useState<string>('未知用户');

	// 获取数据
	const fetchData = async () => {
		try {
			const [userResponse, taskResponse] = await Promise.all([
				axios.get(`${API_URL}/api/getuserbyuid/${uid}`, {
					headers: { Authorization: `Bearer ${token}` },
				}),
				axios.post(
					`${API_URL}/good/gettodaytaskinfo`,
					{ uid },
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				),
			]);

			setData(userResponse.data);
			setTaskdata(taskResponse.data);
			return userResponse.data;
		} catch (error) {
			console.error('请求基本数据出错:', error);
			return null;
		}
	};

	const fetchCartData = async (userData?: UserData) => {
		try {
			const shopName = userData?.shop?.shopName || (data && 'shop' in data && (data as any).shop?.shopName) || '未知用户';

			const response = await axios.post(
				`${API_URL}/carts/getcarts`,
				{
					uid: uid,
					shopname: shopName,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (Array.isArray(response.data)) {
				setCardData([...response.data]);
			} else {
				setCardData([]);
			}
		} catch (error) {
			console.error('请求购物车数据出错:', error);
			setCardData([]);
		}
	};

	useFocusEffect(
		useCallback(() => {
			const loadAllData = async () => {
				setLoading(true);
				try {
					const userData = await fetchData();
					await new Promise(resolve => setTimeout(resolve, 100));
					if (userData) {
						await fetchCartData(userData);
					} else {
						await fetchCartData();
					}
					await getmyallinfo();
				} catch (error) {
					console.error('加载数据失败:', error);
				} finally {
					setLoading(false);
				}
			};
			loadAllData();
		}, [uid, token])
	);

	// const fetchAll = async()=>{
	//     await fetchData()
	//     await fetchCartData()
	//     await getmyallinfo()
	// }

	useEffect(() => {
		// 这里的代码会在 shopName 变化后执行
		console.log('shopName 变化了:', shopName);
	}, [shopName]);

	// 🚀 智能选择一项 - 点击即删除
	const handleSelectAndDelete = (item: any, index: number) => {
		Alert.alert('确认删除', `确定要删除分组 "${item.name || `分组 ${index + 1}`}" 吗？`, [
			{
				text: '取消',
				style: 'cancel',
			},
			{
				text: '删除',
				style: 'destructive',
				onPress: () => deleteItem(item, index),
			},
		]);
	};

	// 删除单个项目
	const deleteItem = async (item: any, index: number) => {
		console.log(item);
		try {
			const response = await axios.post(
				`${API_URL}/sdk/deleteoldgoodsbycid`,
				{
					cid: item.cid,
					session: uid,
					usernick: (data && 'shop' in data && (data as any).shop?.shopName) || '未知用户',
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			console.log('删除响应:', response.data);
			if (response.data == '删除成功') {
				Alert.alert('成功', '删除成功！');
				setShowdialog1(false);

				// 重新加载数据
				const userData = await fetchData();
				if (userData) {
					await fetchCartData(userData);
				}
			} else {
				Alert.alert('失败', '删除失败，请稍后重试');
			}
		} catch (error) {
			console.error('删除失败:', error);
			Alert.alert('错误', '删除失败，请重试');
		}
	};

	const handleClearTasks = async () => {
		try {
			await axios.post(
				`${API_URL}/good/deltealltask`,
				{
					uid: uid,
					usernick: (data && 'shop' in data && (data as any).shop?.shopName) || '未知用户',
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			const userData = await fetchData();
			if (userData) {
				await fetchCartData(userData);
			}
		} catch (error) {
			console.error('清空任务失败:', error);
		}
	};

	const openModal = async () => {
		await fetchCartData();
		setShowdialog1(true);
	};

	const closeModal = () => {
		setShowdialog1(false);
	};

	//! todo getmyallinfo
	const getmyallinfo = async () => {
		const uid = useTokenStore.getState().getInfo().uid;
		const jwt = useTokenStore.getState().getToken();
		console.log('获取用户信息和token', uid, jwt);

		try {
			const res = await axios.get(`${API_URL}/api/getuserbyuid/${uid}`, {
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			});
			console.log('获取用户信息成功:', res.data.shop);
			setShopName(res.data.shop?.shopName);
		} catch (error) {
			console.error('获取用户信息失败:', error);
			Alert.alert('错误', '获取用户信息失败，请重试');
		}
	};

	const doTask = async () => {
		const uid = useTokenStore.getState().getInfo().uid;
		const jwt = useTokenStore.getState().getToken();
		try {
			const res = await axios.post(
				`${API_URL}/task/send`,
				{
					uid: uid,
					usernick: shopName,
				},
				{
					headers: {
						Authorization: `Bearer ${jwt}`,
					},
				}
			);

			console.log('任务执行结果:', res.data);
			if (res.data == 'ok') {
				Alert.alert('成功', '今日任务执行完成！');
			}
		} catch (error) {
			console.error('执行任务失败:', error);
			Alert.alert('错误', '执行任务失败，请重试');
		}
	};

	if (loading) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size="large" />
				<Text>正在加载数据...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Card style={styles.card}>
				<Card.Title title="任务统计" titleStyle={styles.cardTitle} />
				<Card.Content>
					<Text style={styles.taskText}>📤 今日已上传任务: {taskdata ? taskdata[0] : '无数据'}</Text>
					<Text style={styles.taskText}>📥 今日未完成任务: {taskdata ? taskdata[1] : '无数据'}</Text>
					<Text style={styles.taskText}>🛒 自定义分组: {carsdata.length} 项</Text>
				</Card.Content>
			</Card>

			<Button mode="contained" icon="delete" onPress={handleClearTasks} style={styles.button} buttonColor={MD3Colors.error50}>
				清空任务
			</Button>

			<Button mode="contained" icon="check" onPress={doTask} style={styles.button} buttonColor={MD3Colors.primary50}>
				执行今日任务
			</Button>

			<Button mode="contained" icon="view-list" onPress={openModal} style={styles.button} buttonColor={MD3Colors.tertiary40}>
				删除分组商品 ({carsdata.length})
			</Button>

			{/* 🚀 超简化版 Portal Modal - 点击即删除 */}
			<Portal>
				<Modal visible={showdialog1} onDismiss={closeModal} contentContainerStyle={styles.modal}>
					<Card style={styles.modalCard}>
						<Card.Title title="点击删除分组" subtitle="点击任意项目即可删除" />
						<Card.Content>
							<ScrollView style={styles.list}>{carsdata.length === 0 ? <Text style={styles.empty}>暂无数据</Text> : carsdata.map((item, index) => <List.Item key={index} title={item.name || `分组 ${index + 1}`} description={`ID: ${item.cid} | 点击删除`} left={() => <Text style={styles.deleteIcon}>🗑️</Text>} right={() => <Text style={styles.arrow}>›</Text>} onPress={() => handleSelectAndDelete(item, index)} style={styles.listItem} />)}</ScrollView>
						</Card.Content>

						<Card.Actions>
							<Button onPress={closeModal}>关闭</Button>
						</Card.Actions>
					</Card>
				</Modal>
			</Portal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		backgroundColor: '#c0cbd5ff',
	},
	card: {
		flex: 1,
		backgroundColor: '#c8dbdfff',
		width: '90%',
		padding: 20,
		marginTop: 20,
		maxHeight: '30%',
		marginVertical: 10,
		borderRadius: 12,
		elevation: 4,
		shadowColor: '#000',
		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {
		marginTop: 20,
		width: '80%',
		borderRadius: 10,
	},
	taskText: {
		fontSize: 16,
		marginVertical: 4,
		color: '#404145a9',
	},
	cardTitle: {
		marginLeft: -30,
		fontSize: 20,
		fontWeight: 'bold',
		color: '#404145a9',
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
