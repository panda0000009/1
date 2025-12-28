import axios from 'axios';
import qs from 'qs';
import router from '@/router/index.js';
import resMsg from '@/utils/msg.js';
import { getToken } from '@/utils/auth.js';
import { userApi } from '@/api/index.js';
const api = userApi();

import pinia from '@/stores/index.js';
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/modules/app.js';
const useApp = useAppStore(pinia);

const whitelist = ['/web-citysps-common/web/citysps/common/checkcode/generate'];

const service = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL
});
service.defaults.retry = 3;
service.defaults.retryDelay = 1000;

service.interceptors.request.use(
	config => {
		if (Object.prototype.toString.call(config.data) === '[object FormData]') {
			if (config.method === 'get') {
				config.paramsSerializer = function (params) {
					return qs.stringify(params, { arrayFormat: 'repeat' });
				};
			}
			config.headers['Content-Type'] =
				'application/x-www-form-urlencoded; charset=UTF-8';
		} else {
			config.headers['Content-Type'] = 'application/json;charset=UTF-8';
		}
		config.headers['Authentication-Token'] = getToken();
		config.headers['token'] =
			getToken() || 'df871464-5391-4961-a5f6-ac872abad908';
		config.headers['roles'] = 'rl0';
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

// 白名单
const whiteList = ['/web-updc3d-common/web/updc3d/common/log/export'];

service.interceptors.response.use(
	response => {
		const res = response.data;
		const resConfig = response.config;
		const resUrl = response.config.url;
		if (whiteList.includes(resUrl)) {
			return {
				code: 200,
				data: res,
				resultCode: 'S',
				resultMsg: '操作成功'
			};
		} else if (response.status === 200 || response.status === 201) {
			if (
				res.resultCode === 'S' ||
				whitelist.includes(resConfig.url.split('?')[0])
			) {
				return Promise.resolve(res);
			} else {
				resMsg({
					message: res.resultMsg,
					type: 'error',
					offset: 120,
					duration: 3500
				});
				return Promise.reject(response);
			}
		} else {
			return Promise.reject(response);
		}
	},
	async error => {
		console.log('axiosError:', error);
		if (0 === error.request.status) {
			resMsg({
				message: '请检查网络，或联系管理员',
				type: 'error',
				duration: 3000
			});
			setTimeout(() => {
				router.push('/login');
			}, 2000);
		}
		if (401 === error.response.status) {
			if (error.response.data.resultCode === 'R') {
				try {
					const { userInfo } = storeToRefs(useApp);
					useApp.setToken('');
					let refToken;
					if (userInfo.value) {
						refToken = await api.refreshToken({
							username: userInfo.value.username
						});
					}
					if (refToken?.resultCode === 'S') {
						useApp.setToken(refToken.data);
					} else {
						if (router.path !== '/' || router.path !== '/login') {
							resMsg({ message: '登录已过期', type: 'error', duration: 3000 });
							setTimeout(() => {
								router.push('/login');
							}, 2000);
						}
					}
				} catch (e) {
					console.log('刷新token失败', e);
				}
			}
		} else if (500 === error.response.status) {
			resMsg({ message: '服务器错误', type: 'error', duration: 3000 });
		} else if (504 === error.response.status) {
			resMsg({ message: '请求超时', type: 'error', duration: 3000 });
		} else {
			return Promise.reject(error);
		}
	}
);
export default service;
