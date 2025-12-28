<template>
	<div
		class="diamond flex items-start justify-between h-[2.125rem] pr-12 select-none">
		<div
			class="flex cursor-pointer h-[1.625rem] w-full"
			:style="
				props.selWidth === 'auto' ? '' : `width: calc(100% - ${props.selWidth})`
			"
			@click="directionChange">
			<img
				class="arrowBtn"
				v-if="type === 'left'"
				src="@/assets/img/arrowUp.png"
				alt="" />
			<img class="arrowBtn" v-else src="@/assets/img/arrowDown.png" alt="" />
			<span
				:class="['name ml-2 overflow-hidden whitespace-nowrap text-ellipsis']"
				:title="name"
				>{{ name }}</span
			>
		</div>
		<div class="h-[1.625rem]" :style="{ width: props.selWidth }">
			<slot></slot>
		</div>
	</div>
</template>
<script setup>
	import { watch } from 'vue';
	const props = defineProps({
		name: {
			type: String,
			default: '标题'
		},
		direction: {
			type: String,
			default: 'left'
		},
		isChange: {
			type: Boolean,
			default: true
		},
		selWidth: {
			type: String,
			default: 'auto'
		}
	});
	const emit = defineEmits(['directionChange']);
	const type = ref(props.direction);

	// 监听 props.direction 的变化，同步到内部状态
	watch(() => props.direction, (newVal) => {
		type.value = newVal;
	}, { immediate: true });

	const directionChange = () => {
		if (!props.isChange) return;
		type.value = type.value === 'left' ? 'bottom' : 'left';
		emit('directionChange', type.value);
	};
</script>

<style lang="scss" scoped>
	.diamond {
		background-image: url('@/assets/img/arrowhead.png');
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center bottom;
		.arrowBtn {
			width: 1.625rem;
			height: 1.625rem;
		}
		.name {
			font-family: 'YouSheBiaoTiHei';
			font-weight: 400;
			font-size: 20px;
			color: #fff;
		}
	}
</style>
