export const vBody = {
	mounted(el, binding) {
		// 保存元素原始的父节点和下一个兄弟节点，用于卸载时恢复
		el._originalParent = el.parentNode;
		el._originalNextSibling = el.nextSibling;

		// 将元素移动到 body 中
		document.body.appendChild(el);
	},

	unmounted(el) {
		// 组件卸载时，将元素从 body 移除
		if (el.parentNode === document.body) {
			document.body.removeChild(el);
		}
	}
};
