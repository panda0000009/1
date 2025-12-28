
export const convertData = val => {
	let data = val;
	if (data && data.includes('%')) {
		// 移除百分号并将字符串转换为数字
		const num = parseFloat(data.replace('%', ''));
		// 乘以100并四舍五入到整数
		// const converted = num * 100;  // 不需要 * 100
		const converted = num;
		// 返回带百分号的结果
		data = `${converted || 0.0}%`;
	}
	function formatNumberString(str, decimalPlaces = 2) {
		return str.replace(/(\d+\.?\d*)/, match => {
			if (match.includes('.')) {
				return parseFloat(match).toFixed(decimalPlaces);
			}
			return match;
		});
	}
	let val2 = data ? formatNumberString(data) : '';
	return val2;
};