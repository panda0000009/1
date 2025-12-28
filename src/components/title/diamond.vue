<template>
	<div class="diamond flex items-center select-none">
		<img src="@/assets/img/diamond.png" alt="" />
		<span class="name ml-1">{{ name }}</span>
	</div>
</template>
<script setup>
	const props = defineProps({
		name: {
			type: String,
			default: '标题'
		}
	});
</script>

<style lang="scss" scoped>
	.diamond {
		img {
			width: 0.875rem;
			height: 0.875rem;
		}
		.name {
			font-family: 'YouSheBiaoTiHei';
			font-weight: 400;
			font-size: 20px;
			color: #fff;
		}
	}
</style>
