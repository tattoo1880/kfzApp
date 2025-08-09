import { useTokenStore } from '@/store/useTokenStore';
import { API_URL } from '@/utils/apiUrl';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, HelperText, SegmentedButtons, Text } from 'react-native-paper';
import { Linking } from 'react-native';

export default function Shop() {
	const token = useTokenStore.getState().getToken();
	const userInfo = useTokenStore.getState().getInfo();
	const uid = userInfo?.uid || 0;

	const [loading, setLoading] = useState(true);
	const [shopInfo, setShopInfo] = useState<any>(null);
	const [yflist, setyflist] = useState<any[]>([]);
	const [selectedYf, setSelectedYf] = useState<string | null>(null);

	const getmyallinfo = async () => {
		const uid = useTokenStore.getState().getInfo().uid;
		const jwt = useTokenStore.getState().getToken();

		try {
			const res = await axios.get(`${API_URL}/api/getuserbyuid/${uid}`, {
				headers: { Authorization: `Bearer ${jwt}` },
			});
			setShopInfo(res.data.shop); // 假设 shop 信息在 res.data.shop
		} catch (error) {
			Alert.alert('错误', '获取用户信息失败，请重试');
		} finally {
			setLoading(false);
		}
	};

	const fetchYfList = async (shopName: any) => {
		const uid = useTokenStore.getState().getInfo().uid;
		const jwt = useTokenStore.getState().getToken();
		try {
			const res = await axios.post(
				`${API_URL}/sdk/getallyftemplate`,
				{
					session: uid,
					usernick: shopName,
				},
				{
					headers: {
						Authorization: `Bearer ${jwt}`,
					},
				}
			);
			setyflist([...res.data]);
			console.log('运费模版列表获取成功:', res.data);
			// 默认选中第一个
			if (res.data && res.data.length > 0) {
				setSelectedYf(res.data[0].template_id);
			}
			return res.data;
		} catch (error) {
			return null;
		}
	};

	const updateYfTemplate = async () => {
		const uid = useTokenStore.getState().getInfo().uid;
		const jwt = useTokenStore.getState().getToken();
		if (!selectedYf) {
			Alert.alert('提示', '请先选择一个运费模版');
		}

		try {
			try {
				const res = await axios.post(
					`${API_URL}/sdk/updateyftemplate`,
					{
						session: uid,
						templateid: selectedYf,
					},
					{
						headers: {
							Authorization: `Bearer ${jwt}`,
						},
					}
				);
				console.log(res.data);
				if (res.data.yfRule) {
					Alert.alert('成功', '运费模版更新成功！');
					// 更新本地显示的店铺信息
					await getmyallinfo();
				}
				return res;
			} catch (error) {
				console.log(error);
				return null;
			}
		} catch (error) {}
	};

	const getUpdateShopAuthUrl = async () => {
		const uid = useTokenStore.getState().getInfo().uid;
		const jwt = useTokenStore.getState().getToken();

		try {
			const res = await axios.post(
				`${API_URL}/sdk/getuseranurl`,
				{
					session: uid,
				},

				{
					headers: {
						Authorization: `Bearer ${jwt}`,
					},
				}
			);
			console.log(res.data);
            // 如果 res.data 包含 https 字符则使用 Link 打开链接
			if (res.data && res.data.includes('https')) {
				Linking.openURL(res.data);
				return res.data;
			}

		} catch (error) {
			console.log(error);
			return null;
		}
	};

	useFocusEffect(
		useCallback(() => {
			setLoading(true);
			getmyallinfo();
		}, [])
	);

	useEffect(() => {
		if (shopInfo) {
			fetchYfList(shopInfo.shopName);
		}
	}, [shopInfo]);

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" />
				<Text style={{ marginTop: 10 }}>正在加载店铺信息...</Text>
			</View>
		);
	}

	return (
		<View style={styles.mainBg}>
			<Card style={styles.card} elevation={4}>
				<Card.Title title="店铺信息" titleStyle={styles.cardTitle} />
				<Card.Content>
					{shopInfo ? (
						<>
							<Text style={styles.infoText}>
								店铺名称：<Text style={styles.highlight}>{shopInfo.shopName || '未知'}</Text>
							</Text>
							<Text style={styles.infoText}>
								店铺ID：<Text style={styles.highlight}>{shopInfo.uid || '未知'}</Text>
							</Text>
							<Text style={styles.infoText}>
								当前运费模版：<Text style={styles.highlight}>{shopInfo.yfRule || '未知'}</Text>
							</Text>
						</>
					) : (
						<Text>未获取到店铺信息</Text>
					)}

					<View style={{ height: 20 }} />

					<Text style={styles.selectLabel}>选择运费模版：</Text>
					{/* 使用 SegmentedButtons 美化选择，或者你可用 Dropdown、RadioGroup 等 */}
					{yflist.length > 0 ? (
						<SegmentedButtons
							value={selectedYf}
							onValueChange={setSelectedYf}
							buttons={yflist.map((item, idx) => ({
								value: item.template_id,
								label: item.name || `模版${idx + 1}`,
							}))}
							style={{ marginVertical: 8 }}
						/>
					) : (
						<HelperText type="info" visible>
							暂无可用运费模版
						</HelperText>
					)}

					<View style={{ height: 12 }} />

					<Button mode="contained" icon="update" style={styles.button} onPress={updateYfTemplate}>
						更新运费模版
					</Button>

					{/* 新按钮获取更新店铺授权的 url */}
					<Button mode="contained" icon="link" style={styles.button} onPress={getUpdateShopAuthUrl}>
						获取更新店铺授权的 URL
					</Button>
				</Card.Content>
			</Card>
		</View>
	);
}

const styles = StyleSheet.create({
	mainBg: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f7fafc',
		padding: 24,
	},
	card: {
		width: '100%',
		maxWidth: 380,
		borderRadius: 16,
		backgroundColor: '#fff',
		paddingVertical: 16,
	},
	cardTitle: {
		fontSize: 22,
		fontWeight: 'bold',
		color: '#0984e3',
		alignSelf: 'center',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f7fafc',
	},
	infoText: {
		fontSize: 16,
		marginVertical: 2,
		color: '#636e72',
	},
	highlight: {
		color: '#00b894',
		fontWeight: 'bold',
	},
	selectLabel: {
		fontSize: 16,
		marginTop: 16,
		color: '#222',
		fontWeight: 'bold',
	},
	button: {
		marginTop: 18,
		borderRadius: 10,
		backgroundColor: '#00b894',
	},
});
