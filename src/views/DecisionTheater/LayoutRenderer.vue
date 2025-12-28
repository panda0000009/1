<template>
	<Splitpanes
		:horizontal="config?.horizontal || false"
		:dbl-click-splitter="false">
		<template v-for="(panel, index) in config?.panels || []" :key="index">
			<Pane
				:size="panel.size"
				:min-size="panel.size"
				:max-size="panel.size"
				class="pane-container">
				<template v-if="panel.subLayout">
					<LayoutRenderer
						:config="panel.subLayout"
						:starting-screen="calculateStartingScreen(index)" />
				</template>
				<template v-else>
					<div
						class="screen-panel w-full h-full child"
						:class="`screen-${getScreenNumber(index)}`">
						<slot :name="`screen-${getScreenNumber(index)}`">
							<div class="default-content">
								屏幕 {{ getScreenNumber(index) }} - 默认内容
							</div>
						</slot>
					</div>
				</template>
			</Pane>
		</template>
	</Splitpanes>
</template>

<script setup>
	import { Splitpanes, Pane } from 'splitpanes';
	import 'splitpanes/dist/splitpanes.css';

	// 定义组件属性
	const props = defineProps({
		// 布局配置对象
		config: {
			type: Object,
			required: true,
			description: '布局配置对象，包含面板信息和子布局结构'
		},
		// 起始屏幕编号（默认从1开始）
		startingScreen: {
			type: Number,
			default: 1,
			description: '当前布局中第一个屏幕的起始编号'
		}
	});

	/**
	 * 计算从当前面板之前所有面板占用的屏幕总数
	 * @param {number} currentIndex - 当前面板索引
	 * @returns {number} 占用的屏幕总数
	 */
	function countPreviousScreens(currentIndex) {
		let totalScreens = 0;
		// 遍历当前索引之前的所有面板
		for (let i = 0; i < currentIndex; i++) {
			const panel = props.config.panels[i];
			// 如果是嵌套布局，递归计算其子布局的屏幕数量
			if (panel.subLayout) {
				totalScreens += countTotalScreens(panel.subLayout);
			} else {
				// 普通面板占用一个屏幕
				totalScreens += 1;
			}
		}
		return totalScreens;
	}

	/**
	 * 获取指定索引面板对应的屏幕编号
	 * @param {number} index - 面板索引
	 * @returns {number} 屏幕编号
	 */
	function getScreenNumber(index) {
		// 屏幕编号 = 起始屏幕编号 + 之前面板占用的屏幕总数
		return props.startingScreen + countPreviousScreens(index);
	}

	/**
	 * 计算传递给子布局的起始屏幕编号
	 * @param {number} index - 当前面板索引
	 * @returns {number} 子布局的起始屏幕编号
	 */
	function calculateStartingScreen(index) {
		// 子布局的起始编号 = 当前屏幕编号
		return getScreenNumber(index);
	}

	/**
	 * 递归计算布局中的总屏幕数量
	 * @param {Object} layout - 布局配置
	 * @returns {number} 总屏幕数量
	 */
	function countTotalScreens(layout) {
		return layout.panels.reduce((sum, panel) => {
			if (panel.subLayout) {
				return sum + countTotalScreens(panel.subLayout);
			}
			return sum + 1;
		}, 0);
	}
</script>

<style scoped>
	.pane-container {
		border: none;
		background-color: #f0f2f5;
	}

	.screen-panel {
		position: relative;
		overflow: hidden;
	}

	.default-content {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #909399;
		font-size: 14px;
		background-color: #f5f7fa;
	}

	/* 修复Splitpanes组件的默认样式问题 */
	:deep(.splitpanes) {
		width: 100%;
		height: 100%;
	}

	:deep(.splitpanes__pane) {
		overflow: hidden;
		background-color: transparent;
	}

	:deep(.splitpanes__splitter) {
		background-color: #e4e7ed;
		position: relative;
	}

	:deep(.splitpanes__splitter:before) {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		transition: opacity 0.4s;
		background-color: #409eff;
		opacity: 0;
	}

	:deep(.splitpanes__splitter:hover:before) {
		opacity: 1;
	}
</style>
