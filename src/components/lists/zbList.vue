<template>
	<div
		class="w-full zb flex flex-wrap items-center justify-between bg-[#112E46] pt-[0.875rem]">
		<div
			:class="[
				'zbList relative cursor-pointer pl-[1.125rem] mb-[0.875rem] w-1/2',
				{ disabled: item?.disabled === '0' }
			]"
			v-for="(item, index) in themeInfos"
			:key="'zb_' + index"
			@click="zbChange(item)">
			<img
				v-if="activeZb === item.nodeId"
				:src="getAssetsFile('zb-' + index + '-cur')"
				alt="" />
			<img v-else :src="getAssetsFile('zb-' + index)" alt="" />
		</div>
	</div>
</template>

<script setup>
	import { getAssetsFile } from '@/utils/index.js';

	// 专题顺序
	const themeNames = ['人口专题', '产业专题', '交通专题', '公服专题', '结构专题', '土地专题', '低碳专题', '韧性专题']
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
				activeZb.value = val;
			}
		},
		{ immediate: true }
	);

	const themeInfos = computed(() => {
		let datas = [];
		themeNames.forEach(m => {
			let node = props.data.find(n => m.includes(n.nodeName));
			if (node) {
				datas.push(node)
			}
		})
		return datas
	})

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
