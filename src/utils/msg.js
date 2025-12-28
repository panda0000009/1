// 关闭重复的提示
// 每次只显示一个
import { ElMessage } from 'element-plus';
let messageInstance = null;
const resetMsg = options => {
	if (messageInstance) {
		messageInstance.close();
	}
	messageInstance = ElMessage(options);
};
['error', 'success', 'info', 'warning'].forEach(type => {
	resetMsg[type] = options => {
		if (typeof options === 'string') {
			options = {
				message: options
			};
		}
		options.type = type;
		return resetMsg(options);
	};
});

export default resetMsg;
