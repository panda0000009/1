<!-- 智能问答 -->
<template>
	<div class="unit-year-section h-[56px] flex items-center justify-center">
		<div class="px-[16px] w-[326px]">
			<el-input
				v-model="searchText"
				placeholder="请输入问题..."
				class="w-full" />
		</div>
		<img
			src="@/assets/img/d9e8.png"
			class="cursor-pointer"
			alt=""
			@click="answerQuestionHandle" />
	</div>

	<!-- 开发中提示弹窗 -->
	<div class="el-overlay" v-body v-if="showDevelopmentDialog">
		<div class="summary-dialog">
			<div
				class="closeBtn absolute top-[14px] right-[20px] w-[40px] h-[40px] cursor-pointer"
				@click="showDevelopmentDialog = false"></div>
		</div>
	</div>
</template>

<script setup>
	import { vBody } from '@/utils/mountToBody.js';

	const searchText = ref('');
	const showDevelopmentDialog = ref(false);

	// 智能问答
	const answerQuestionHandle = () => {
		showDevelopmentDialog.value = true;
	};
</script>

<style lang="scss" scoped>
	.unit-year-section {
		margin-bottom: 12px;
		background: rgba(17, 46, 70, 0.8);
		padding: 12px 16px;
	}

	.summary-dialog {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 483px;
		height: 234px;
		z-index: 99;
		background-image: url('@/assets/img/bb0b062a-a881-461e-aef7-aff957b8c329.png');
		background-size: cover;
		background-position: center;
	}
	.summaryCon {
		font-family: 'SourceHanSerifCN-Regular';
		font-weight: 400;
		font-size: 20px;
		line-height: 50px;
		text-align: center;
	}
</style>
