<script setup>
	const props = defineProps({
		title: {
			type: String,
			default: '指标总体情况评分'
		}
	});
</script>

<template>
	<div class="iconTitle w-full flex items-center justify-between">
		<div class="flex items-center">
			<img src="@/assets/img/TimeSpaceRadar/icon.png" alt="" />
			<span>{{ title }}</span>
		</div>
		<div>
			<slot></slot>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.iconTitle {
		img {
			width: 14px;
			height: 14px;
			margin-right: 10px;
		}
		span {
			font-size: 20px;
			color: #fff;
			font-weight: 400;
			font-family: 'YouSheBiaoTiHei';
		}
	}
</style>
