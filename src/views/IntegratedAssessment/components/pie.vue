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
	const chartRefPieOne = ref(null);
	let chartPieOne = null;
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
					// chartPieOneFn(
					// 	data.highRiskPercent,
					// 	data.lowRiskPercent,
					// 	data.normalPercent
					// );
					chartPieOneFn(50, 25, 25);
				});
			}
		},
		{
			immediate: true
		}
	);
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
	const chartPieOneFn = (
		highRiskPercent = 40,
		lowRiskPercent = 30,
		normalPercent = 30
	) => {
		chartPieOne = echarts.init(chartRefPieOne.value);
		const optionsData = [
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
					color: '#F7B500'
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
		const series = getPie3D(optionsData, 1, 240, 28, 26, 1);

		// 计算每个扇形的标签位置
		const graphicElements = [];
		let sumValue = normalPercent + lowRiskPercent + highRiskPercent;
		let startRatio = 0;
		console.log(
			'series:',
			series,
			'sumValue:',
			sumValue,
			'optionsData:',
			optionsData
		);
		optionsData.forEach(item => {
			// 1. 计算扇形的角度范围
			const endRatio = startRatio + item.value / sumValue;
			const midRatio = (startRatio + endRatio) / 2;
			console.log(
				'startRatio:',
				startRatio,
				'endRatio:',
				endRatio,
				'midRatio:',
				midRatio
			);

			// 2. 转换为实际角度 (关键修复点)
			// 起始角度需要匹配 beta = 290 的视角,转换为弧度
			const startAngle = -Math.PI; // -90度,从顶部开始
			const angle = startAngle + midRatio * Math.PI * 2;

			// 3. 计算2D平面上的坐标
			const radius = 0; // 调整半径,根据实际饼图大小微调
			const x = Math.cos(angle) * radius;
			// 椭圆投影系数,与 grid3D.viewControl.alpha = 25 相关
			const ellipseRatio = Math.cos(Math.PI / 180); // 约0.906
			const y = Math.sin(angle) * radius * ellipseRatio;

			graphicElements.push({
				type: 'text',
				left: `${x}%`,
				top: `${y}%`,
				style: {
					text: `${item.value.toFixed(2)}%`,
					textAlign: 'center',
					fill: '#fff',
					fontSize: 14,
					fontWeight: 'bold',
					textShadowColor: 'rgba(0, 0, 0, 0.5)',
					textShadowBlur: 4
				},
				z: 100
			});

			startRatio = endRatio;
		});

		const option = {
			legend: {
				data: series.map(item => item.name),
				bottom: '5%',
				left: 'center',
				textStyle: {
					color: '#ACDAF1',
					fontSize: 12
				},
				itemGap: 20,
				itemWidth: 14,
				itemHeight: 8,
				orient: 'horizontal'
			},
			grid: {
				left: 0
			},
			tooltip: {
				formatter: params => {
					if (
						params.seriesName !== 'mouseoutSeries' &&
						params.seriesName !== 'pie2d'
					) {
						let bfb = (
							(series[params.seriesIndex].pieData.endRatio -
								series[params.seriesIndex].pieData.startRatio) *
							100
						).toFixed(2);
						return (
							`${params.seriesName}<br/>` +
							`<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>` +
							`${bfb}%`
						);
					}
				}
			},
			backgroundColor: 'rgba(0, 0, 0, 0)',
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
				boxHeight: 2, // 三维笛卡尔坐标系在三维场景中的高度
				left: 'center',
				top: '-25%',
				viewControl: {
					alpha: 25,
					beta: 180,
					distance: 206, // 调整视角到主体的距离，类似调整zoom
					rotateSensitivity: 1, // 设置为0无法旋转
					zoomSensitivity: 1, // 设置为0无法缩放
					panSensitivity: 1, // 设置为0无法平移
					autoRotate: false // 自动旋转
				}
			},
			// graphic: graphicElements,
			graphic: [
				{
					type: 'text',
					left: '74.27050983124843%',
					top: '55.98143053773911%',
					style: {
						text: '70.00%',
						textAlign: 'center',
						fill: '#f00',
						fontSize: 14,
						fontWeight: 'bold',
						textShadowColor: 'rgba(0, 0, 0, 0.5)',
						textShadowBlur: 4
					},
					z: 100
				},
				{
					type: 'text',
					left: '21.46830451114539%',
					top: '31.59806475013974%',
					style: {
						text: '20.00%',
						textAlign: 'center',
						fill: '#fff',
						fontSize: 14,
						fontWeight: 'bold',
						textShadowColor: 'rgba(0, 0, 0, 0.5)',
						textShadowBlur: 4
					},
					z: 100
				},
				{
					type: 'text',
					left: '40.729490168751575%',
					top: '14.141502201092614%',
					style: {
						text: '10.00%',
						textAlign: 'center',
						fill: '#fff',
						fontSize: 14,
						fontWeight: 'bold',
						textShadowColor: 'rgba(0, 0, 0, 0.5)',
						textShadowBlur: 4
					},
					z: 100
				}
			],
			series: series
		};
		chartPieOne.setOption(option);
		window.addEventListener('resize', () => chartPieOne.resize());
	};
	// 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
	function getParametricEquation(
		startRatio,
		endRatio,
		isSelected,
		isHovered,
		k,
		h
	) {
		const midRatio = (startRatio + endRatio) / 2;
		const startRadian = startRatio * Math.PI * 2;
		const endRadian = endRatio * Math.PI * 2;
		const midRadian = midRatio * Math.PI * 2;
		if (startRatio === 0 && endRatio === 1) {
			isSelected = false;
		}
		k = 1;
		const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
		const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
		const hoverRate = isHovered ? 1.05 : 1;
		return {
			u: {
				min: -Math.PI,
				max: Math.PI * 3,
				step: Math.PI / 32
			},
			v: {
				min: 0,
				max: Math.PI * 2,
				step: Math.PI / 20
			},
			x: function (u, v) {
				if (u < startRadian)
					return (
						offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
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
						offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
					);
				if (u > endRadian)
					return (
						offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
					);
				return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
			},
			z: function (u, v) {
				if (u < -Math.PI * 0.5) return Math.sin(u);
				if (u > Math.PI * 2.5) return Math.sin(u) * h * 0.1;
				return Math.sin(v) > 0 ? 1 * h * 0.1 : -1;
			}
		};
	}
	/**
	 * 绘制3d图
	 * @param pieData 总数据
	 * @param internalDiameterRatio:透明的空心占比
	 * @param distance 视角到主体的距离
	 * @param alpha 旋转角度
	 * @param pieHeight 立体的高度
	 * @param opacity 饼或者环的透明度
	 */
	// 生成 3D 饼图 series（仅保留立体效果，不处理标签）
	function getPie3D(
		pieData,
		internalDiameterRatio,
		distance,
		alpha,
		pieHeight,
		opacity = 1
	) {
		const series = [];
		let sumValue = 0;
		let startValue = 0;
		let endValue = 0;
		const k =
			typeof internalDiameterRatio !== 'undefined'
				? (1 - internalDiameterRatio) / (1 + internalDiameterRatio)
				: 1 / 3;

		// 计算总和
		pieData.forEach(item => (sumValue += item.value));

		// 生成每个扇形的 surface 配置（仅立体效果）
		pieData.forEach(item => {
			endValue = startValue + item.value;
			const startRatio = startValue / sumValue;
			const endRatio = endValue / sumValue;
			const seriesItem = {
				name: item.name,
				type: 'surface',
				parametric: true,
				wireframe: { show: false },
				pieData: { ...item, startRatio, endRatio },
				pieStatus: { selected: false, hovered: false, k },
				itemStyle: {
					color: item.color,
					opacity: opacity
				},
				z: 2 // 层级低于 2D 辅助饼图（确保标签在上面）
			};
			series.push(seriesItem);
			startValue = endValue;
		});

		// 为每个扇形设置参数方程
		series.forEach(item => {
			const { startRatio, endRatio } = item.pieData;
			item.parametricEquation = getParametricEquation(
				startRatio,
				endRatio,
				false,
				false,
				k,
				item.pieData.value
			);
		});

		return series;
	}
	onMounted(() => {});
	onBeforeUnmount(() => {
		window.removeEventListener('resize', () => chartPieOne?.resize());
		chartPieOne && chartPieOne.dispose();
	});
</script>
<style scoped>
	.chartPieImage {
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 300px;
		height: 164px;
		object-fit: contain;
		z-index: 1;
		pointer-events: none;
	}
</style>
