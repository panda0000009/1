<template>
	<div
		class="title select-none"
		:style="{
			width: props.width,
			backgroundImage: `url(${props.size === 'min' ? titleBg : titleBg2})`
		}">
		<div
			class="titleText"
			:style="{ width: props.widthDiv, fontSize: props.fontSize }">
			{{ label }}
		</div>
		<img
			:src="selectShow ? select : more"
			alt=""
			class="titleIcon"
			:style="{ width: selectShow ? '20px' : '14px' }"
			@click="handleToggle" />
	</div>
</template>

<script setup>
	import { ref } from 'vue';
	import titleBg from '@/assets/img/titleBg.png';
	import titleBg2 from '@/assets/img/titleBg2.png';
	import select from '@/assets/img/select.png';
	import more from '@/assets/img/more.png';

	const props = defineProps({
		label: {
			type: String,
			default: ''
		},
		width: {
			type: String,
			default: '130px'
		},
		widthDiv: {
			type: String,
			default: '90px'
		},
		size: {
			type: String,
			default: 'min'
		},
		fontSize: {
			type: String,
			default: '14px'
		}
	});

	const selectShow = ref(true);

	// 定义事件
	const emit = defineEmits(['toggle']);

	// 处理切换
	const handleToggle = () => {
		selectShow.value = !selectShow.value;
		emit('toggle', selectShow.value);
	};
</script>

<style scoped>
	.title {
		width: 130px;
		height: 34px;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center center;
		font-weight: 500;
		color: #fff;
		line-height: 34px;
		font-family: 'YouSheBiaoTiHei';
		margin: 10px 0;
		position: relative;
	}
	.titleText {
		width: 90px;
		text-align: center;
	}
	.titleIcon {
		width: 20px;
		position: absolute;
		right: 4px;
		top: 50%;
		transform: translateY(-50%);
		cursor: pointer;
	}
</style>
