<template>
	<div class="relative h-full w-full">
		<div
			ref="chartRefPieThird"
			style="width: 100%; height: 100%; position: relative; z-index: 2"></div>
		<img :src="image" alt="pie" class="chartPieImage" />
	</div>
</template>
<script setup>
	import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
	import * as echarts from 'echarts';
	import 'echarts-gl';
	import image from '@/assets/img/citySpaceRadar/image.png';

	const chartRefPieThird = ref(null);
	let chartPieThird = null;
	// 自定义属性
	const props = defineProps({
		optionsData: {
			type: [Object, Array],
			default: () => {
				return null;
			}
		},
		legend: {
			type: Object,
			default: () => {
				return {
					orient: 'horizontal',
					bottom: '5%',
					left: 'center'
				};
			}
		}
	});

	// 默认颜色配置（当数据中没有指定颜色时使用）
	const defaultColors = ['#FF0C10', '#F7B500', '#3065CE', '#00F6FF', '#3FA4FF', '#60F5FF'];

	watch(
		() => props.optionsData,
		v => {
			nextTick(() => {
				// 统一处理：判断是数组格式还是对象格式
				if (Array.isArray(v)) {
					// 数组格式：直接使用数组数据（包括空数组）
					chartPieThirdFn(v);
				} else if (v && typeof v === 'object') {
					// 兼容旧的对象格式
					let { highRiskTotal, normalTotal, highWarningNum } = v;
					let data = normalizeTo100(highRiskTotal, highWarningNum, normalTotal);
					chartPieThirdFn([
						{
							name: '中心城区',
							value: data.highRiskPercent,
							itemStyle: {
								color: '#FF0C10'
							}
						},
						{
							name: '外围地区',
							value: data.lowRiskPercent,
							itemStyle: {
								color: '#F7B500'
							}
						}
					]);
				} else {
					// 如果数据为空或无效，使用空数组
					chartPieThirdFn([]);
				}
			});
		},
		{ immediate: true }
	);

	function normalizeTo100(highRiskTotal, highWarningNum, normalTotal) {
		// 计算总和
		const total = highRiskTotal + highWarningNum + normalTotal;
		// 如果总和为0，返回相等的比例
		if (total === 0) {
			return {
				highRiskPercent: 33.33,
				lowRiskPercent: 33.33,
				normalPercent: 33.34
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

	// 第三张的饼图
	// 支持数组数据格式：[{ name, value, itemStyle?: { color } }]
	const chartPieThirdFn = (dataArray = []) => {
		if (!chartRefPieThird.value) return;

		// 如果 chartPieThird 已存在，先销毁
		if (chartPieThird) {
			chartPieThird.dispose();
			chartPieThird = null;
		}

		chartPieThird = echarts.init(chartRefPieThird.value);

		// 处理数据：使用原始 value 值，饼图会自动计算百分比
		let processedData = [];
		if (Array.isArray(dataArray) && dataArray.length > 0) {
			// 处理每个数据项，保留原始 value 值
			processedData = dataArray.map((item, index) => {
				return {
					name: item.name || `项目${index + 1}`,
					value: item.value || 0, // 使用原始值，饼图会根据总和自动计算比例
					itemStyle: {
						color: item.itemStyle?.color || item.color || defaultColors[index % defaultColors.length],
						opacity: item.itemStyle?.opacity !== undefined ? item.itemStyle.opacity : 1
					}
				};
			});
		} else {
			// 如果没有数据，使用默认数据
			processedData = [
				{
					name: '中心城区',
					value: 50,
					itemStyle: {
						color: '#FF0C10'
					}
				},
				{
					name: '外围地区',
					value: 50,
					itemStyle: {
						color: '#F7B500'
					}
				}
			];
		}

		let data = processedData;
		const series = getPie3D(data, 0.8, 240, 28, 26, 1);
		// 添加2D饼图用于显示百分比标签
		// 使用闭包确保 formatter 能访问到 series 数组
		series.push({
			name: 'pie2d',
			type: 'pie',
			label: {
				show: true,
				position: 'inside',
				opacity: 1,
				formatter: params => {
					// 使用与 tooltip 完全相同的计算方式：从 series 中找到对应的 3D 系列
					// 通过闭包访问外部的 series 数组
					// 过滤掉 pie2d 系列，只查找 3D 系列
					const targetSeries = series.find(s =>
						s.name === params.name &&
						s.name !== 'pie2d' &&
						s.pieData
					);
					if (targetSeries && targetSeries.pieData &&
						targetSeries.pieData.endRatio !== undefined &&
						targetSeries.pieData.startRatio !== undefined) {
						const percent = (
							(targetSeries.pieData.endRatio -
								targetSeries.pieData.startRatio) *
							100
						).toFixed(2);
						// return `${percent}%`;
						return ``;
					}
					// 如果找不到对应的系列，使用默认计算（基于2D饼图的数据）
					return `${params.percent.toFixed(2)}%`;
				},
				fontSize: 16,
				fontWeight: '',
				textStyle: {
					fontSize: 16,
					fontWeight: '',
					color: '#fff',
					textShadowColor: 'rgba(0, 0, 0, 0.8)',
					textShadowBlur: 4
				}
			},
			labelLine: { show: false },
			radius: ['45%', '55%'],
			center: ['50%', '32%'],
			// 确保2D饼图的data和3D饼图的series数据完全一致，包括value值
			data: data.map(item => {
				// 创建新对象，避免修改原始数据
				return {
					name: item.name,
					value: item.value, // 确保使用原始value值
					itemStyle: {
						...item.itemStyle,
						opacity: 0 // 2D饼图不可见，只用于显示标签
					}
				};
			}),
			z: 3
		});
		const option = {
			legend: {
				data: series
					.filter(item => item.name !== 'pie2d')
					.map(item => item.name), // 过滤掉 pie2d
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
							(option.series[params.seriesIndex].pieData.endRatio -
								option.series[params.seriesIndex].pieData.startRatio) *
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
				top: '-25%', // 保持饼图中心点一致，不随数据项数量变化
				viewControl: {
					alpha: 25,
					beta: 290,
					distance: 206, //调整视角到主体的距离，类似调整zoom
					rotateSensitivity: 1, // 设置为0无法旋转
					zoomSensitivity: 1, // 设置为0无法缩放
					panSensitivity: 1, // 设置为0无法平移
					autoRotate: false // 自动旋转
				}
			},
			series: series
		};
		// 合并 legend 配置
		if (props.legend) {
			option.legend = {
				...option.legend,
				...props.legend
			};
		}
		chartPieThird.setOption(option);
		window.addEventListener('resize', () => chartPieThird.resize());
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
		// 计算
		const midRatio = (startRatio + endRatio) / 2;
		const startRadian = startRatio * Math.PI * 2;
		const endRadian = endRatio * Math.PI * 2;
		const midRadian = midRatio * Math.PI * 2;
		// 如果只有一个扇形，则不实现选中效果。
		if (startRatio === 0 && endRatio === 1) {
			isSelected = false;
		}
		// 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
		k = 1;
		// 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
		const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
		const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
		// 计算高亮效果的放大比例（未高亮，则比例为 1）
		const hoverRate = isHovered ? 1.05 : 1;
		// 返回曲面参数方程
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
				if (u < startRadian) {
					return (
						offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
					);
				}
				if (u > endRadian) {
					return (
						offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
					);
				}
				return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
			},
			y: function (u, v) {
				if (u < startRadian) {
					return (
						offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
					);
				}
				if (u > endRadian) {
					return (
						offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
					);
				}
				return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
			},
			z: function (u, v) {
				if (u < -Math.PI * 0.5) {
					return Math.sin(u);
				}
				if (u > Math.PI * 2.5) {
					return Math.sin(u) * h * 0.1;
				}
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
		const legendData = [];
		const k =
			typeof internalDiameterRatio !== 'undefined'
				? (1 - internalDiameterRatio) / (1 + internalDiameterRatio)
				: 1 / 3;
		// 为每一个饼图数据，生成一个 series-surface 配置
		for (let i = 0; i < pieData.length; i += 1) {
			sumValue += pieData[i].value;
			const seriesItem = {
				name: pieData[i].name, // 直接使用数据中的名称
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
				if (typeof pieData[i].itemStyle.color !== 'undefined') {
					itemStyle.color = pieData[i].itemStyle.color;
				}
				if (typeof pieData[i].itemStyle.opacity !== 'undefined') {
					itemStyle.opacity = pieData[i].itemStyle.opacity;
				}
				seriesItem.itemStyle = itemStyle;
			}
			series.push(seriesItem);
		}
		// 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
		// 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
		// 统一高度：所有扇形使用相同的 pieHeight，而不是根据 value 值设置不同高度
		for (let i = 0; i < series.length; i += 1) {
			endValue = startValue + series[i].pieData.value;
			series[i].pieData.startRatio = startValue / sumValue;
			series[i].pieData.endRatio = endValue / sumValue;

			series[i].parametricEquation = getParametricEquation(
				series[i].pieData.startRatio,
				series[i].pieData.endRatio,
				false,
				false,
				k,
				pieHeight // 使用统一的 pieHeight，而不是 series[i].pieData.value
			);
			startValue = endValue;
			legendData.push(series[i].name);
		}
		return series;
	}

	onMounted(() => {
		chartPieThirdFn(); // 第三张的饼图
	});

	onBeforeUnmount(() => {
		chartPieThird && chartPieThird.dispose();
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
