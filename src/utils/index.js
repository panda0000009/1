const getAssetsFile = name => {
	return new URL(`../assets/img/${name}.png`, import.meta.url).href;
};
// 对象合并
const mergeObjects = (obj1, obj2) => {
	for (let key in obj2) {
		if (obj2.hasOwnProperty(key)) {
			obj1[key] = obj2[key];
		}
	}
	return obj1;
};

/**
 * 过滤树形结构，保留顶级节点及与目标ID相关的嵌套节点
 * @param {Array} tree - 原始树形结构（顶级节点数组）
 * @param {String} indicatorIds - 目标ID字符串（逗号分隔）
 * @param {String} [key="nodeId"] - 匹配的属性键名（默认"nodeId"）
 * @returns {Array} 过滤后的树形结构
 */
function getMatchedIndicators(tree, indicatorIds, key = 'nodeId') {
	try {
		// 参数校验
		if (
			!tree ||
			!Array.isArray(tree) ||
			!indicatorIds ||
			typeof indicatorIds !== 'string'
		) {
			return [];
		}
		const matchKey = key.trim();
		if (!matchKey) return [];

		// 解析目标ID集合（去重+过滤空值）
		const targetIds = new Set(
			indicatorIds
				.split(',')
				.map(id => id.trim())
				.filter(Boolean)
		);

		/**
		 * 递归过滤单个节点及其子节点
		 * @param {Object} node - 待处理的节点
		 * @returns {Object|null} 过滤后的节点（不符合条件则返回null）
		 */
		function filterNode(node) {
			if (!node || typeof node !== 'object') return null;

			// 递归处理子节点，得到符合条件的子节点数组
			const filteredChildren =
				node.children && Array.isArray(node.children)
					? node.children.map(child => filterNode(child)).filter(Boolean) // 过滤掉null
					: [];

			// 判断当前节点是否需要保留：
			// 1. 自身nodeId在目标集合中，或者
			// 2. 有符合条件的子节点（确保层级完整）
			const shouldKeep =
				targetIds.has(node[matchKey]) || filteredChildren.length > 0;

			if (shouldKeep) {
				// 深拷贝节点（避免修改原数据），并更新children为过滤后的结果
				return { ...node, children: filteredChildren };
			}
			return null; // 不符合条件则丢弃
		}

		return tree.map(topNode => filterNode(topNode)).filter(Boolean);
	} catch (error) {
		console.log('getMatchedIndicators:', error);
	}
}

/**
 * 获取包含当前年份在内的最近5年数据，格式为[{value: '年份', label: '年份'}, ...]
 * @returns {Array} 5年数据数组
 */
function getRecent5Years() {
	// 获取当前年份
	const currentYear = new Date().getFullYear();
	// 计算起始年份（当前年份 - 4，确保包含当前年共5年）
	const startYear = currentYear - 4;
	// 存储结果的数组
	const yearList = [];

	// 循环生成5年数据
	for (let i = startYear; i <= currentYear; i++) {
		// 年份转字符串（保持与示例格式一致）
		const yearStr = i.toString();
		yearList.push({
			value: yearStr,
			label: yearStr
		});
	}

	return yearList;
}

// 查找目标节点的最顶层父节点（根节点）
function findTopParent(
	treeData,
	targetId,
	key = 'id',
	childrenKey = 'children'
) {
	for (const item of treeData) {
		// 若当前节点就是目标节点，其顶层父节点是自身（如果它是根节点）
		if (item[key] === targetId) {
			// 检查是否有父级（这里简化判断：根节点的父级不存在，即它在顶层数组中）
			return item;
		}
		// 若当前节点有子节点，递归查找子树
		if (item[childrenKey] && item[childrenKey].length > 0) {
			const result = findTopParent(
				item[childrenKey],
				targetId,
				key,
				childrenKey
			);
			// 若在子树中找到目标节点，当前节点的顶层父节点就是目标节点的顶层父节点
			if (result !== undefined) {
				// 若当前节点是顶层节点（在treeData根数组中），则它就是最顶层父节点
				// 否则继续向上追溯
				return treeData.includes(item) ? item : result;
			}
		}
	}
}

// 对外暴露的方法：根据子级ID获取最外层父级item
const getTopParentItem = (orgList = [], childId, key = 'nodeId') => {
	return findTopParent(orgList, childId, key) || null;
};

// 防抖函数
function _debounce(func, wait = 200) {
	let timeout;
	return function () {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func.apply(this, arguments);
		}, wait);
	};
}
export {
	getAssetsFile,
	mergeObjects,
	getMatchedIndicators,
	getRecent5Years,
	getTopParentItem,
	_debounce
};
