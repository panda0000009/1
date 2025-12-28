// 获取Token
export const getToken = () => {
	const token = localStorage.getItem('token');
	return token ? token : '';
};
