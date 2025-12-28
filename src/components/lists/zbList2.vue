<template>
	<div
		class="w-full zb flex flex-wrap items-center justify-between bg-[#112E46] py-[0.875rem]">
		<div
			:class="[
				'zbList relative cursor-pointer pl-[1.125rem] w-1/2',
				{ disabled: item?.disabled === '0' }
			]"
			v-for="(item, index) in data"
			:key="'zb_' + index"
			:style="{
				backgroundImage: `url(${activeZb === item.nodeId ? zbBgActive : zbBg})`
			}"
			@click="zbChange(item)">
			<el-tooltip
				v-if="item.label.length > 10"
				class="box-item"
				effect="dark"
				:content="item.label"
				placement="top">
				<div class="zbContent">{{ item.label }}</div>
			</el-tooltip>
			<div class="zbContent" v-else>{{ item.label }}</div>
		</div>
	</div>
</template>

<script setup>
	import zbBg from '@/assets/img/deductionEngine/zbBg.png';
	import zbBgActive from '@/assets/img/deductionEngine/zbBgActive.png';

	const activeZb = ref('');
	const props = defineProps({
		data: {
			type: Array,
			default: () => []
		},
		currentId: {
			type: String,
			default: () => ''
		}
	});
	watch(
		() => props.currentId,
		val => {
			if (val !== '') {
				// activeZb.value = val.split(',');
				activeZb.value = val;
			}
		},
		{ immediate: true }
	);

	const emit = defineEmits(['zbChange']);

	const zbChange = item => {
		if (item?.disabled === '0') return;
		activeZb.value = item.nodeId;
		emit('zbChange', item);
	};
</script>

<style lang="scss" scoped>
	.zb {
		.zbList {
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-position: center center;
			margin-bottom: 14px;
			&.disabled {
				cursor: not-allowed;
				opacity: 0.5;
			}
			& .zbContent {
				height: 2rem;
				line-height: 2rem;
				padding: 0 1rem 0 1.5rem;
				color: #fff;
				font-family: 'YouSheBiaoTiHei';
				font-size: 1rem;
				font-weight: 400;
				white-space: nowrap;
				text-align: center;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}
</style>
