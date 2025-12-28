<template>
	<div class="warningInfo select-none h-[20.5625rem] bg-[#112e46]">
		<p
			style="
				font-family: 'YouSheBiaoTiHei';
				font-weight: 400;
				font-size: 20px;
				color: #fff;
				text-align: center;
			">
			{{ zbList.find(n => n.value == props.activeZb)?.label || '' }}
		</p>
		<div
			class="h-[18.6875rem] overflow-hidden overflow-y-auto pl-[0.8125rem] pr-[0.5rem]">
			<template v-if="props.warningList.length > 0">
				<div
					class="warningInfoItem relative flex items-center overflow-hidden"
					v-for="item in props.warningList"
					:key="item">
					<img
						:src="
							item.type === 'danger'
								? danger
								: item.type === 'warning'
								? warning
								: safe
						"
						alt="" />
					<div class="h-[1.125rem] w-[calc(100%-3.75rem)]">
						<el-slider v-model="item.slide" :min="sliderMinVal" :max="sliderMaxVal" :class="item.type" disabled />
					</div>
					<span
						class="warningInfoItemTitle absolute w-[calc(100%-130px)] overflow-hidden text-ellipsis whitespace-nowrap"
						>{{ item.name }}</span
					>
				</div>
			</template>
			<div v-else class="w-full h-full flex items-center justify-center">
				<p
					v-if="warningValue2 === 'safe'"
					class="emptyTxt bg-[#3065CE] text-[#fff] px-10 w-[17.625rem] h-[1.875rem] border border-solid border-white">
					未查询到相关信息，请重新查询
				</p>
				<p
					v-if="warningValue2 === 'warning'"
					class="emptyTxt bg-[#F7B500] text-[#fff] px-10 w-[17.625rem] h-[1.875rem] border border-solid border-white">
					未查询到相关信息，请重新查询
				</p>
				<p
					v-if="warningValue2 === 'danger'"
					class="emptyTxt bg-[#9E3429] text-[#fff] px-10 w-[17.625rem] h-[1.875rem] border border-solid border-white">
					未查询到相关信息，请重新查询
				</p>
			</div>
		</div>
	</div>
</template>

<script setup>
	import danger from '@/assets/img/TimeSpaceRadar/danger.png';
	import warning from '@/assets/img/TimeSpaceRadar/warning.png';
	import safe from '@/assets/img/TimeSpaceRadar/safe.png';
	const props = defineProps({
		warningList: {
			type: Array,
			default: () => []
		},
		zbList: {
			type: Array,
			default: () => []
		},
		activeZb: {
			type: String,
			default: ''
		},
		warningValue2: {
			type: String,
			default: ''
		}
	});

	const sliderMinVal = ref(0)
	const sliderMaxVal = ref(100)
	
	watch(
		() => props.warningList,
		newVal => {
			let vals = props.warningList.map(n => n.value);
			vals = vals.length ? vals : [0, 100];
			sliderMinVal.value = Math.min(...vals)
			sliderMaxVal.value = Math.max(...vals)
		},
		{ immediate: true }
	);

</script>

<style lang="scss" scoped>
	.warningInfo {
		.warningInfoItem {
			height: 1.125rem;
			margin-bottom: 0.4375rem;
			img {
				width: 3.75rem;
				height: 0.875rem;
				margin-right: 0.375rem;
			}
			.warningInfoItemTitle {
				font-family: 'AlibabaPuHuiTi-65';
				font-size: 0.875rem;
				color: #e3e9f3;
				left: 4.125rem;
				font-weight: 500;
				line-height: 1.125rem;
				letter-spacing: 0px;
			}
			:deep(.el-slider__runway),
			:deep(.el-slider__bar) {
				height: 3px;
				background: #4f4f4fb3;
			}
			.danger :deep(.el-slider__bar) {
				background: linear-gradient(
					270deg,
					#e24a3b 0%,
					rgba(226, 74, 59, 0.0001) 100%
				);
			}
			.warning :deep(.el-slider__bar) {
				background: linear-gradient(
					270deg,
					#c9b217 0%,
					rgba(201, 178, 23, 0.0001) 100%
				);
			}
			.safe :deep(.el-slider__bar) {
				background: linear-gradient(
					270deg,
					#3877f2 0%,
					rgba(56, 119, 242, 0.0001) 97.79%
				);
			}
			:deep(.el-slider__button) {
				border-radius: 0;
				border: 0;
				width: 2px;
				height: 5px;
			}
		}
	}
</style>
