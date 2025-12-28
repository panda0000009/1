<template>
	<div :class="['leftTitle select-none', direction]">
		<span
			class="zbTitle block w-full lh-[2rem]"
			:style="{
				paddingLeft: leftPadding,
				paddingRight: rightPadding,
				textAlign: direction
			}"
			>{{ label }}</span
		>
	</div>
</template>
<script setup>
	const props = defineProps({
		label: {
			type: String,
			default: '标题'
		},
		leftPadding: {
			type: String,
			default: '0'
		},
		rightPadding: {
			type: String,
			default: '0'
		},
		direction: {
			type: String,
			default: 'left'
		}
	});
</script>

<style lang="scss" scoped>
	.leftTitle {
		width: 25.9375rem;
		height: 3rem;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: left top;
		&.right {
			background-image: url('@/assets/img/rightTitle.png');
		}
		&.left {
			background-image: url('@/assets/img/leftTitle.png');
		}
	}
</style>
