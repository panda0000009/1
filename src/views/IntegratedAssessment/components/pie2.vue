<template>
	<div class="relative w-full h-full">
		<div
			ref="chartRefPieOne"
			style="width: 100%; height: 100%; position: relative; z-index: 2"></div>
		<img :src="image" alt="pie" class="chartPieImage" />
	</div>
</template>

<script setup>
	import image from '@/assets/img/citySpaceRadar/image.png';
	import * as echarts from 'echarts';
	import 'echarts-gl';

	let rightChart2 = null;
	const chartRefPieOne = ref(null);
	const props = defineProps({
		optionsData: {
			type: Object,
			default: () => {
				return null;
			}
		}
	});
	watch(
		() => props.optionsData,
		v => {
			if (v) {
				nextTick(() => {
					let { highRiskTotal, normalTotal, highWarningNum } =
						props.optionsData;
					let data = normalizeTo100(highRiskTotal, highWarningNum, normalTotal);
					init(data.highRiskPercent, data.lowRiskPercent, data.normalPercent);
				});
			}
		},
		{
			immediate: true
		}
	);
	onMounted(() => {});
	function normalizeTo100(highRiskTotal, highWarningNum, normalTotal) {
		// 计算总和
		const total = highRiskTotal + highWarningNum + normalTotal;
		// 如果总和为0，返回相等的比例
		if (total === 0) {
			return {
				highRiskPercent: 0,
				lowRiskPercent: 0,
				normalPercent: 0
			};
		}
		// 计算每个类别的百分比
		const highRiskPercent = ((highRiskTotal / total) * 100).toFixed(2);
		const lowRiskPercent = ((highWarningNum / total) * 100).toFixed(2);
		const normalPercent = ((normalTotal / total) * 100).toFixed(2);
		return {
			highRiskPercent: parseFloat(highRiskPercent),
			lowRiskPercent: parseFloat(lowRiskPercent),
			normalPercent: parseFloat(normalPercent)
		};
	}
	const init = (highRiskPercent, lowRiskPercent, normalPercent) => {
		const optionData = [
			{
				name: '安全指标',
				value: normalPercent,
				itemStyle: {
					color: '#3065CE'
				}
			},
			{
				name: '警告指标',
				value: lowRiskPercent,
				itemStyle: {
					color: '#F7B500',
					isHighlight: true
				}
			},
			{
				name: '危险指标',
				value: highRiskPercent,
				itemStyle: {
					color: '#FF0C10'
				}
			}
		];
		rightChart2 = echarts.init(chartRefPieOne.value);

		function getParametricEquation(
			startRatio,
			endRatio,
			isSelected,
			isHovered,
			k,
			height,
			isHighlight = false // 新增：突出扇区标记
		) {
			const midRatio = (startRatio + endRatio) / 2;
			const startRadian = startRatio * Math.PI * 2;
			const endRadian = endRatio * Math.PI * 2;
			const midRadian = midRatio * Math.PI * 2;

			// 突出扇区增加Z轴厚度
			const highlightHeight = isHighlight ? 30 : 0;
			const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
			const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
			const hoverRate = isHovered ? 1.05 : 1;

			return {
				u: { min: -Math.PI, max: Math.PI * 3, step: Math.PI / 32 },
				v: { min: 0, max: Math.PI * 2, step: Math.PI / 20 },
				x: function (u, v) {
					if (u < startRadian)
						return (
							offsetX +
							Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
						);
					if (u > endRadian)
						return (
							offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
						);
					return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
				},
				y: function (u, v) {
					if (u < startRadian)
						return (
							offsetY +
							Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
						);
					if (u > endRadian)
						return (
							offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
						);
					return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
				},
				z: function (u, v) {
					if (u < -Math.PI * 0.5) return Math.sin(u);
					if (u > Math.PI * 2.5)
						return Math.sin(u) * (height + highlightHeight) * 0.1; // 突出扇区增加Z轴高度
					return Math.sin(v) > 0 ? 1 * (height + highlightHeight) * 0.1 : -1;
				}
			};
		}

		// 生成模拟 3D 饼图的配置项
		function getPie3D(pieData, internalDiameterRatio) {
			const series = [];
			let sumValue = 0;
			let startValue = 0;
			let endValue = 0;
			const legendData = [];
			const k =
				typeof internalDiameterRatio !== 'undefined'
					? (1 - internalDiameterRatio) / (1 + internalDiameterRatio)
					: 1 / 3;

			// 为每一个饼图数据，生成一个 series-surface 配置
			for (let i = 0; i < pieData.length; i++) {
				sumValue += pieData[i].value;

				const seriesItem = {
					name:
						typeof pieData[i].name === 'undefined'
							? `series${i}`
							: pieData[i].name,
					type: 'surface',
					parametric: true,
					wireframe: {
						show: false
					},
					pieData: pieData[i],
					pieStatus: {
						selected: false,
						hovered: false,
						k: k
					}
				};
				if (typeof pieData[i].itemStyle !== 'undefined') {
					const itemStyle = {};
					typeof pieData[i].itemStyle.color !== 'undefined'
						? (itemStyle.color = pieData[i].itemStyle.color)
						: null;
					typeof pieData[i].itemStyle.opacity !== 'undefined'
						? (itemStyle.opacity = pieData[i].itemStyle.opacity)
						: null;
					seriesItem.itemStyle = itemStyle;
				}
				series.push(seriesItem);
			}
			// 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
			for (let i = 0; i < series.length; i++) {
				endValue = startValue + series[i].pieData.value;
				series[i].pieData.startRatio = startValue / sumValue;
				series[i].pieData.endRatio = endValue / sumValue;
				series[i].parametricEquation = getParametricEquation(
					series[i].pieData.startRatio,
					series[i].pieData.endRatio,
					false,
					false,
					k,
					2000,
					series[i].pieData.itemStyle.isHighlight || false // 传递突出标记
				);
				startValue = endValue;
				legendData.push(series[i].name);
			}
			return series;
		}

		const series = getPie3D(
			optionData.map(item => {
				return item;
			}),
			0,
			240,
			28,
			26,
			0.5
		);
		series.push({
			name: 'pie2d',
			type: 'pie',
			label: {
				show: true,
				position: 'inside',
				opacity: 1,
				formatter: '{d}%',
				fontSize: 12,
				lineHeight: 20,
				textStyle: {
					fontSize: 12,
					color: '#fff'
				}
			},
			labelLine: { show: false },
			radius: ['45%', '55%'],
			center: ['50%', '32%'],
			data: optionData.map(item => {
				item.itemStyle.opacity = 0;
				return item;
			}),
			z: 3
		});
		// 准备待返回的配置项，把准备好的 legendData、series 传入。
		const option = {
			legend: {
				show: true,
				orient: 'horizontal',
				left: 'center',
				bottom: 10,
				data: [
					{
						name: '安全指标',
						textStyle: { width: '10', color: '#ffffff' },
						itemStyle: { color: '#3065CE' }
					},
					{
						name: '警告指标',
						textStyle: { width: '20', color: '#ffffff' },
						itemStyle: { color: '#F7B500' }
					},
					{
						name: '危险指标',
						textStyle: { width: '20', color: '#ffffff' },
						itemStyle: { color: '#FF0C10' }
					}
				],
				formatter: function (param) {
					let item = optionData.filter(item => item.name == param)[0];
					return item.name;
				}
			},
			tooltip: {
				show: true,
				formatter: params => {
					if (
						params.seriesName !== 'mouseoutSeries' &&
						params.seriesName !== 'pie2d'
					) {
						return `${
							params.seriesName
						}<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
							params.color
						};"></span>${
							option.series[params.seriesIndex].pieData.value + '%'
						}`;
					}
				},
				textStyle: {
					fontSize: 14
				}
			},
			xAxis3D: {
				min: -1,
				max: 1
			},
			yAxis3D: {
				min: -1,
				max: 1
			},
			zAxis3D: {
				min: -1,
				max: 1
			},
			grid3D: {
				show: false,
				boxWidth: 104,
				boxHeight: 0.1,
				top: '-22%',
				viewControl: {
					alpha: 25,
					beta: 0,
					distance: 210, // 调整视角到主体的距离，类似调整zoom
					rotateSensitivity: 1, // 设置为0无法旋转
					zoomSensitivity: 1, // 设置为0无法缩放
					panSensitivity: 1, // 设置为0无法平移
					autoRotate: false // 自动旋转
				}
			},
			series: series
		};
		rightChart2.setOption(option);
	};
</script>
<style lang="scss">
	.chartPieImage {
		position: absolute;
		top: 42%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 300px;
		height: 164px;
		object-fit: contain;
		z-index: 1;
		pointer-events: none;
	}
</style>
