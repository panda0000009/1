<!-- 智能总结 -->
<template>
	<div
		class="SmartSummary bg-[#112E46] h-[56px] flex items-center justify-center"
		@click="handleClick">
		<img
			:src="props.headerName == '生成智能评估报告' ? SmartSummary : SmartSummary2"
			class="w-[223px] h-[30px] cursor-pointer"
			alt="" />
	</div>
	<!-- 开发中提示弹窗 -->
	<div class="el-overlay" v-body v-if="showDevelopmentDialog">
		<div class="summary-dialog">
			<div
				class="closeBtn absolute top-[20px] right-[24px] w-[27px] h-[27px] cursor-pointer"
				@click="showDevelopmentDialog = false"></div>
			<div
				class="title flex items-end absolute top-[42px] left-[81px] select-none">
				<p>{{ props.title }}</p>
				<span class="ml-[18px] cursor-pointer" @click="handleDownload"
					>点击下载↓</span
				>
			</div>
			<div
				v-if="props.type == 'integratedAssessment'"
				class="summaryCon absolute top-[70px] left-[73px] w-[495px] h-[216px] color-[#C4C4C4] overflow-y-auto">
				<slot name="summaryCon"></slot>
				<div>
					<span class="label">1.全市总体情况：</span>
					<span class="value">
						经综合评估2024年全市{{ props.Info.city?.name || '' }}为{{ props.Info.city?.value || '' }}{{ props.Info.city?.unit || '' }}，全市综合评估等级为{{ props.Info.city?.level || '' }}。
					</span>
				</div>
				<div>
					<span class="label">2.中心外围情况：</span>
					<span class="value">
						经综合评估2024年，中心城区的{{ props.Info.center?.inside?.name || '' }}为{{ props.Info.center?.inside?.value || '' }}{{ props.Info.center?.inside?.unit || '' }}，综合评估等级为{{ props.Info.center?.inside?.level || '' }}。
						外围地区的{{ props.Info.center?.outside?.name || '' }}为{{ props.Info.center?.outside?.value || '' }}{{ props.Info.center?.outside?.unit || '' }}，综合评估等级为{{ props.Info.center?.outside?.level || '' }}。
					</span>
				</div>
				<div>
					<span class="label">3.区县街道情况：</span>
					<span class="value">
						{{ integratedAssessmentCountryInfo }}
					</span>
				</div>
			</div>
			<div
				v-if="props.type == 'citySpaceRadar'"
				class="summaryCon absolute top-[70px] left-[73px] w-[495px] h-[216px] color-[#C4C4C4] overflow-y-auto">
				<slot name="summaryCon"></slot>
				<div>
					<span class="label">1.全市总体情况：</span>
					<span class="value">
						经推演预测到{{ props.Info.city?.year || '' }}年，全市{{ props.Info.city?.name || '' }}为{{ props.Info.city?.value || '' }}{{ props.Info.city?.unit || '' }}，全市预警等级为{{ props.Info.city?.level || '' }}。
					</span>
				</div>
				<div>
					<span class="label">2.中心外围情况：</span>
					<span class="value">
						经推演预测到{{ props.Info.center?.inside?.year || '' }}年，中心城区的{{ props.Info.center?.inside?.name || '' }}为{{ props.Info.center?.inside?.value || '' }}{{ props.Info.center?.inside?.unit || '' }}，预警等级为{{ props.Info.center?.inside?.level || '' }}。
						外围地区的{{ props.Info.center?.outside?.name || '' }}为{{ props.Info.center?.outside?.value || '' }}{{ props.Info.center?.outside?.unit || '' }}，预警等级为{{ props.Info.center?.outside?.level || '' }}。
					</span>
				</div>
				<div>
					<span class="label">3.区县街道情况：</span>
					<span class="value">
						{{ citySpaceRadarCountryInfo }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { vBody } from '@/utils/mountToBody.js';
	import SmartSummary from '@/assets/img/SmartSummary.png';
	import SmartSummary2 from '@/assets/img/SmartSummary2.png';
import { computed } from 'vue';

	const showDevelopmentDialog = ref(false);
	const props = defineProps({
		headerName: {
			type: String,
			default: '生成智能评估报告'
		},
		type: {
			type: String,
			default: 'integratedAssessment'
		},
		// Info: {
		// 	city: {
		// 		year: '',
		// 		name: '',
		// 		value: '',
		// 		unit: '',
		// 		level: ''
		// 	},
		// 	center: {
		// 		inside: {
		// 			year: '',
		// 			name: '',
		// 			value: '',
		// 			unit: '',
		// 			level: ''
		// 		},
		// 		outside: {
		// 			year: '',
		// 			name: '',
		// 			value: '',
		// 			unit: '',
		// 			level: ''
		// 		},
		// 	},
		// 	country: [{
		// 		year: '',
		// 		countryName: '',
		// 		name: '',
		// 		value: '',
		// 		unit: '',
		// 		level: ''
		// 	}]
		// },
		Info: {
			type: Object,
			default: {}
		}
	});

	const integratedAssessmentCountryInfo = computed(() => {
		let info = "经综合评估2024年，";
		props.Info.country?.forEach(item => {
			info += `${item?.countryName || ''}的${item?.name || ''}为${item.value}${item?.unit || ''}，评估等级为${item?.level || ''}。`
		})
		return info
	});

	const citySpaceRadarCountryInfo = computed(() => {
		let info = `经推演预测到${props.Info.city.year}年`;
		props.Info.country?.forEach(item => {
			info += `${item?.countryName || ''}的${item?.name || ''}为${item?.value || ''}${item?.unit || ''}，评估等级为${item?.level || ''}。`
		})
		return info
	});


	const handleClick = () => {
		showDevelopmentDialog.value = true;
	};
	const handleDownload = () => {
		// 下载逻辑
		console.log('下载逻辑');
	};
</script>

<style lang="scss" scoped>
	.summary-dialog {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 632px;
		height: 330px;
		z-index: 99;
		background-image: url('@/assets/img/6f955951-4c98-4621-a842-7b95be9e40b3.png');
		background-size: cover;
		background-position: center;
		& .title {
			& p {
				font-family: 'YouSheBiaoTiHei';
				font-weight: 400;
				font-size: 20px;
				line-height: 100%;
				color: white;
			}
			& span {
				font-family: 'SourceHanSerifCN-Regular';
				font-weight: 400;
				font-size: 12px;
				line-height: 14px;
				letter-spacing: 0px;
				text-align: right;
				vertical-align: bottom;
				text-decoration: underline;
				text-decoration-style: solid;
				text-decoration-skip-ink: auto;
				color: #1fc6ff;
			}
		}
		& .summaryCon {
			& .label {
				font-family: 'AlibabaPuHuiTi-95';
				font-weight: 800;
				font-size: 14px;
				line-height: 20px;
			}
			& .value {
				font-family: 'AlibabaPuHuiTi-55';
				font-weight: 400;
				font-size: 14px;
				line-height: 20px;
				letter-spacing: 0px;
			}
		}
	}
</style>
