<template>
	<el-dialog
		v-model="dialogVisible"
		class="citySpaceRadar-dialog"
		title="Tips"
		width="80%"
		:before-close="handleClose">
		<div class="citySpaceRadar-title">城市空间雷达</div>
		<img
			src="@/assets/img/close.png"
			alt=""
			class="citySpaceRadar-close"
			@click="handleClose" />

		<div class="citySpaceRadar-content">
			<div class="radar-header">
				<div class="radar-header-title">指标名称</div>
				<div class="radar-header-year">2024年</div>
				<div class="radar-header-comparison">对比情况</div>
				<div class="radar-header-year">2035年</div>
			</div>

			<div class="radar-body">
				<div class="radar-row" v-for="(item, index) in indicators" :key="index">
					<div class="radar-indicator-name">{{ item.name }}</div>
					<div class="radar-year-value">{{ item.value2025 }}分</div>
					<div class="radar-comparison">
						<div class="comparison-bar">
							<div class="comparison-center"></div>
							<div
								class="comparison-left"
								:style="{ width: (item.value2025 / 200) * 50 + '%' }"></div>
							<div
								class="comparison-right"
								:style="{ width: (item.value2035 / 200) * 50 + '%' }"></div>
						</div>
					</div>
					<div class="radar-year-value">{{ item.value2035 }}分</div>
				</div>
			</div>
		</div>
	</el-dialog>
</template>
<script setup lang="ts">
	import { ref, computed } from 'vue';
	const props = defineProps<{
		modelValue: boolean;
		show: boolean;
	}>();

	const emit = defineEmits<{
		'update:modelValue': [value: boolean];
	}>();

	const dialogVisible = computed({
		get: () => props.modelValue,
		set: value => emit('update:modelValue', value)
	});

	const handleClose = () => {
		dialogVisible.value = false;
	};

	// 指标数据
	const indicators = ref([
		{
			name: '居住人口密度',
			value2025: 25,
			value2035: 56,
			trend: 'positive',
			comparisonWidth: 50
		},
		{
			name: '居住密集度',
			value2025: 45,
			value2035: 45,
			trend: 'negative',
			comparisonWidth: 50
		},
		{
			name: '城市新增住房与人口匹配度',
			value2025: 55,
			value2035: 55,
			trend: 'negative',
			comparisonWidth: 50
		},
		{
			name: '居民人均住房面积',
			value2025: 100,
			value2035: 200,
			trend: 'positive',
			comparisonWidth: 100
		},
		{
			name: '住房价格水平',
			value2025: 10,
			value2035: 100,
			trend: 'positive',
			comparisonWidth: 100
		},
		{
			name: '人均机动车保有量',
			value2025: 59,
			value2035: 55,
			trend: 'negative',
			comparisonWidth: 50
		},
		{
			name: '平均出行时长',
			value2025: 17,
			value2035: 48,
			trend: 'negative',
			comparisonWidth: 50
		},
		{
			name: '平均出行费用',
			value2025: 45,
			value2035: 46,
			trend: 'negative',
			comparisonWidth: 50
		},
		{
			name: '平均通勤时长',
			value2025: 45,
			value2035: 46,
			trend: 'negative',
			comparisonWidth: 50
		},
		{
			name: '平均通勤费用',
			value2025: 49,
			value2035: 45,
			trend: 'negative',
			comparisonWidth: 50
		}
	]);
</script>
<style lang="scss">
	.citySpaceRadar-dialog {
		background-image: url('@/assets/img/deductionEngine/dialog.png') !important;
		background-size: 100% 100% !important;
		background-repeat: no-repeat !important;
		background-position: center center !important;
		border: none !important;
		border-radius: 0 !important;
		box-shadow: none !important;
		background-color: rgba(0, 0, 0, 0) !important;
		height: 848px !important;
	}

	.citySpaceRadar-dialog .el-dialog__header {
		display: none !important;
	}

	.citySpaceRadar-dialog .el-dialog__body {
		padding: 0 !important;
	}

	.citySpaceRadar-dialog .el-dialog__footer {
		padding: 0 !important;
	}
	.citySpaceRadar-title {
		font-size: 32px;
		font-weight: 400;
		color: #fff;
		text-align: center;
		margin-top: -40px;
	}
	.citySpaceRadar-close {
		width: 42px;
		height: 42px;
		position: absolute;
		right: 20px;
		top: 20px;
		cursor: pointer;
	}

	.citySpaceRadar-content {
		padding: 60px 40px 40px 40px;
		box-sizing: border-box;
	}

	.radar-header {
		display: flex;
		align-items: center;
		background: linear-gradient(
			90deg,
			rgba(31, 198, 255, 0.1) 0%,
			rgba(31, 198, 255, 0.05) 100%
		);
		border: 1px solid rgba(31, 198, 255, 0.3);
		border-radius: 8px;
		padding: 15px 20px;
		margin-bottom: 20px;

		.radar-header-title {
			flex: 2;
			font-size: 16px;
			font-weight: 500;
			color: #1fc6ff;
			text-align: left;
		}

		.radar-header-year {
			flex: 1;
			font-size: 16px;
			font-weight: 500;
			color: #1fc6ff;
			text-align: center;
		}

		.radar-header-comparison {
			flex: 1.5;
			font-size: 16px;
			font-weight: 500;
			color: #1fc6ff;
			text-align: center;
		}
	}

	.radar-body {
		.radar-row {
			display: flex;
			align-items: center;
			padding: 12px 20px;
			border-bottom: 1px solid rgba(31, 198, 255, 0.1);
			transition: background-color 0.2s;

			&:hover {
				background-color: rgba(31, 198, 255, 0.05);
			}

			&:last-child {
				border-bottom: none;
			}

			.radar-indicator-name {
				flex: 2;
				font-size: 14px;
				color: #b4c0cc;
				text-align: left;
				line-height: 1.4;
			}

			.radar-year-value {
				flex: 1;
				font-size: 16px;
				font-weight: 600;
				color: #ffd700;
				text-align: center;
			}

			.radar-comparison {
				flex: 1.5;
				display: flex;
				justify-content: center;
				align-items: center;

				.comparison-bar {
					width: 100%;
					height: 8px;
					background-color: rgba(180, 192, 204, 0.3);
					border-radius: 4px;
					position: relative;
					display: flex;
					align-items: center;
					justify-content: center;

					.comparison-center {
						width: 2px;
						height: 100%;
						background-color: #fff;
						position: absolute;
						left: 50%;
						transform: translateX(-50%);
						z-index: 3;
					}

					.comparison-left {
						height: 100%;
						background: linear-gradient(90deg, #ff4757 0%, #ff6b7a 100%);
						border-radius: 4px 0 0 4px;
						position: absolute;
						right: 50%;
						transition: width 0.3s ease;
					}

					.comparison-right {
						height: 100%;
						background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
						border-radius: 0 4px 4px 0;
						position: absolute;
						left: 50%;
						transition: width 0.3s ease;
					}
				}
			}
		}
	}
</style>
