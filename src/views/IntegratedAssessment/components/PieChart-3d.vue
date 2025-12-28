<template>
	<div class="relative w-full h-full">
		<div
			class="chartsGl"
			id="charts"
			style="width: 100%; height: 100%; position: relative; z-index: 2"></div>
		<img :src="image" alt="pie" class="chartPieImage" />
	</div>
</template>

<script setup>
	import image from '@/assets/img/citySpaceRadar/image.png';
	import * as echarts from 'echarts';
	import 'echarts-gl';

	const pieHeight = ref(20);
	const hollow = ref(0);
	const option = ref(null);

	const optionData = ref([
		{ id: 0, name: '安全指标', num: 50, itemStyle: { color: '#3065CE' } },
		{ id: 1, name: '警告指标', num: 10, itemStyle: { color: '#F7B500' } },
		{ id: 2, name: '危险指标', num: 20, itemStyle: { color: '#FF0C10' } }
	]);


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
					let { highRiskTotal, normalTotal, highWarningNum } = props.optionsData;
					optionData.value = normalizeTo100(highRiskTotal, highWarningNum, normalTotal);
					init();
				});
			}
		},
		{
			immediate: true
		}
	);

	onMounted(() => {
		init();
	});

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
		return [
			{ id: 0, name: '安全指标', num: parseFloat(normalPercent), itemStyle: { color: '#3065CE' } },
			{ id: 1, name: '警告指标', num: parseFloat(lowRiskPercent), itemStyle: { color: '#F7B500' } },
			{ id: 2, name: '危险指标', num: parseFloat(highRiskPercent), itemStyle: { color: '#FF0C10' } }
		]
	}

	const init = () => {
		const total = optionData.value.reduce((sum, item) => sum + item.num, 0);
		// 计算每个项的百分比并添加到对象中
		optionData.value.forEach(
			item => (
				(item.value = item.num),
				(item.bfb = ((item.value / total) * 100).toFixed(2) + '%')
			)
		);
		//构建3d饼状图
		let myChart = echarts.init(document.getElementById('charts'));
		option.value = getPie3D(optionData.value, hollow.value);
		myChart.setOption(option.value);
		bindListen(myChart);
	};
	const getPie3D = (pieData, internalDiameterRatio) => {
		let series = [];
		let sumValue = 0;
		let startValue = 0;
		let endValue = 0;
		let legendData = [];
		let legendBfb = [];
		let k = 1 - internalDiameterRatio;
		// 为每一个饼图数据，生成一个 series-surface(参数曲面) 配置
		for (let i = 0; i < pieData.length; i++) {
			sumValue += pieData[i].value;
			let seriesItem = {
				name:
					typeof pieData[i].name === 'undefined'
						? `series${i}`
						: pieData[i].name,
				type: 'surface',
				// 是否为参数曲面（是）
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

			//曲面的颜色、不透明度等样式。
			if (typeof pieData[i].itemStyle != 'undefined') {
				let itemStyle = {};
				typeof pieData[i].itemStyle.color != 'undefined'
					? (itemStyle.color = pieData[i].itemStyle.color)
					: null;
				typeof pieData[i].itemStyle.opacity != 'undefined'
					? (itemStyle.opacity = pieData[i].itemStyle.opacity)
					: null;
				seriesItem.itemStyle = itemStyle;
			}
			series.push(seriesItem);
		}

		// 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
		// 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
		legendData = [];
		legendBfb = [];
		console.log('series', series);

		for (let i = 0; i < series.length; i++) {
			endValue = startValue + series[i].pieData.value;
			series[i].pieData.startRatio = startValue / sumValue;
			series[i].pieData.endRatio = endValue / sumValue;
			series[i].pieData.value =
				pieHeight.value > 0 ? pieHeight.value : series[i].pieData.value;

			series[i].parametricEquation = getParametricEquation(
				series[i].pieData.startRatio,
				series[i].pieData.endRatio,
				false,
				false,
				k,
				series[i].pieData.value
			);
			startValue = endValue;
			let bfb = fomatFloat(series[i].pieData.value / sumValue, 4);
			legendData.push({
				name: series[i].name,
				value: bfb
			});
			legendBfb.push({
				name: series[i].name,
				value: bfb
			});
		}
		series = series.sort((a, b) => {
			return a.pieData.id - b.pieData.id;
		});

		// 添加2D饼图用于显示标签
		const pieData2D = pieData.map(item => {
			const percentage = ((item.num / sumValue) * 100).toFixed(1);
			return {
				name: item.name,
				value: item.value,
				itemStyle: {
					color: 'transparent',
					borderWidth: 0
				},
				label: {
					show: true,
					position: 'inside',
					formatter: percentage + '%',
					fontSize: 16,
					color: '#fff'
				},
				labelLine: {
					show: false
				}
			};
		});

		series.push({
			name: 'pie2d',
			type: 'pie',
			radius: ['0%', '60%'],
			center: ['50%', '30%'],
			data: pieData2D,
			itemStyle: {
				color: 'transparent',
				borderWidth: 0
			},
			silent: true,
			zlevel: 10 // 确保在最上层
		});

		//(第二个参数可以设置你这个环形的高低程度)
		let option = {
			color: ['#1C9FFD', '#0FF0FF', '#EBC542'],
			//图例组件 //右侧展示的文案
			legend: {
				selectedMode: true,
				data: legendData.filter(item => item.name !== 'pie2d'), // 过滤掉 pie2d
				bottom: 10,
				left: 'center',
				itemGap: 10,
				textStyle: {
					color: '#fff'
				},
				show: true,
				icon: 'rect',
				formatter: function (param) {
					let item = optionData.value.filter(item => item.name == param)[0];
					return item.name;
				}
			},
			//移动上去提示的文本内容(我没来得及改 你们可以根据需求改)
			tooltip: {
				formatter: params => {
					if (
						params.seriesName !== 'mouseoutSeries' &&
						params.seriesName !== 'pie2d'
					) {
						return (
							`${params.seriesName}<br/>` +
							`<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>` +
							`${optionData.value[params.seriesIndex].bfb}`
						);
					}
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
				boxHeight: 8, // 圆环的高度
				left: 'center',
				top: '-25%',
				viewControl: {
					alpha: 25, // 角度(这个很重要 调节角度的)
					distance: 206, // 调整视角到主体的距离，类似调整zoom(这是整体大小)
					rotateSensitivity: 1, // 设置为0无法旋转
					zoomSensitivity: 1, // 设置为0无法缩放
					panSensitivity: 1, // 设置为0无法平移
					autoRotate: false // 自动旋转
				}
			},
			series: series
		};
		return option;
	};

	// 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
	const getParametricEquation = (
		startRatio,
		endRatio,
		isSelected,
		isHovered,
		k,
		h
	) => {
		// 计算
		let midRatio = (startRatio + endRatio) / 2;
		let startRadian = startRatio * Math.PI * 2;
		let endRadian = endRatio * Math.PI * 2;
		let midRadian = midRatio * Math.PI * 2;
		// 如果只有一个扇形，则不实现选中效果。
		if (startRatio === 0 && endRatio === 1) {
			isSelected = false;
		}
		// 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
		k = typeof k !== 'undefined' ? k : 1 / 3;

		// 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
		let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
		let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
		// 计算高亮效果的放大比例（未高亮，则比例为 1）
		let hoverRate = isHovered ? 1.05 : 1;
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
	};

	//这是一个自定义计算的方法
	const fomatFloat = (num, n) => {
		var f = parseFloat(num);
		if (isNaN(f)) {
			return false;
		}
		f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); // n 幂
		var s = f.toString();
		var rs = s.indexOf('.');
		//判定如果是整数，增加小数点再补0
		if (rs < 0) {
			rs = s.length;
			s += '.';
		}
		while (s.length <= rs + n) {
			s += '0';
		}
		return s;
	};
	const bindListen = myChart => {
		let selectedIndex = '';
		let hoveredIndex = '';
		// 监听点击事件，实现选中效果（单选）
		myChart.on('click', function (params) {
			// 忽略2D饼图的点击
			if (params.seriesName === 'pie2d') return;

			// 从 option.series 中读取重新渲染扇形所需的参数，将是否选中取反。
			let isSelected =
				!option.value.series[params.seriesIndex].pieStatus.selected;
			let isHovered = option.value.series[params.seriesIndex].pieStatus.hovered;
			let k = option.value.series[params.seriesIndex].pieStatus.k;
			let startRatio =
				option.value.series[params.seriesIndex].pieData.startRatio;
			let endRatio = option.value.series[params.seriesIndex].pieData.endRatio;
			// 如果之前选中过其他扇形，将其取消选中（对 option 更新）
			if (selectedIndex !== '' && selectedIndex !== params.seriesIndex) {
				option.value.series[selectedIndex].parametricEquation =
					getParametricEquation(
						option.value.series[selectedIndex].pieData.startRatio,
						option.value.series[selectedIndex].pieData.endRatio,
						false,
						false,
						k,
						option.value.series[selectedIndex].pieData.value
					);
				option.value.series[selectedIndex].pieStatus.selected = false;
			}
			// 对当前点击的扇形，执行选中/取消选中操作（对 option 更新）
			option.value.series[params.seriesIndex].parametricEquation =
				getParametricEquation(
					startRatio,
					endRatio,
					isSelected,
					isHovered,
					k,
					option.value.series[params.seriesIndex].pieData.value
				);
			option.value.series[params.seriesIndex].pieStatus.selected = isSelected;
			// 如果本次是选中操作，记录上次选中的扇形对应的系列号 seriesIndex
			isSelected ? (selectedIndex = params.seriesIndex) : null;
			// 使用更新后的 option，渲染图表
			myChart.setOption(option.value);
		});
		// 监听 mouseover，近似实现高亮（放大）效果
		myChart.on('mouseover', function (params) {
			// 准备重新渲染扇形所需的参数
			let isSelected;
			let isHovered;
			let startRatio;
			let endRatio;
			let k;
			// 如果触发 mouseover 的扇形当前已高亮，则不做操作
			if (hoveredIndex === params.seriesIndex) {
				return;
				// 否则进行高亮及必要的取消高亮操作
			} else {
				// 如果当前有高亮的扇形，取消其高亮状态（对 option 更新）
				if (hoveredIndex !== '') {
					// 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 false。
					isSelected = option.value.series[hoveredIndex].pieStatus.selected;
					isHovered = false;
					startRatio = option.value.series[hoveredIndex].pieData.startRatio;
					endRatio = option.value.series[hoveredIndex].pieData.endRatio;
					k = option.value.series[hoveredIndex].pieStatus.k;
					// 对当前点击的扇形，执行取消高亮操作（对 option 更新）
					option.value.series[hoveredIndex].parametricEquation =
						getParametricEquation(
							startRatio,
							endRatio,
							isSelected,
							isHovered,
							k,
							option.value.series[hoveredIndex].pieData.value
						);
					option.value.series[hoveredIndex].pieStatus.hovered = isHovered;
					// 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
					hoveredIndex = '';
				}
				// 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 option 更新）
				if (
					params.seriesName !== 'mouseoutSeries' &&
					params.seriesName !== 'pie2d'
				) {
					// 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
					isSelected =
						option.value.series[params.seriesIndex].pieStatus.selected;
					isHovered = true;
					startRatio =
						option.value.series[params.seriesIndex].pieData.startRatio;
					endRatio = option.value.series[params.seriesIndex].pieData.endRatio;
					k = option.value.series[params.seriesIndex].pieStatus.k;
					// 对当前点击的扇形，执行高亮操作（对 option 更新）
					option.value.series[params.seriesIndex].parametricEquation =
						getParametricEquation(
							startRatio,
							endRatio,
							isSelected,
							isHovered,
							k,
							option.value.series[params.seriesIndex].pieData.value + 5
						);
					option.value.series[params.seriesIndex].pieStatus.hovered = isHovered;
					// 记录上次高亮的扇形对应的系列号 seriesIndex
					hoveredIndex = params.seriesIndex;
				}
				// 使用更新后的 option，渲染图表
				myChart.setOption(option.value);
			}
		});
		// 修正取消高亮失败的 bug
		myChart.on('globalout', function () {
			// 准备重新渲染扇形所需的参数
			let isSelected;
			let isHovered;
			let startRatio;
			let endRatio;
			let k;
			if (hoveredIndex !== '') {
				// 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
				isSelected = option.value.series[hoveredIndex].pieStatus.selected;
				isHovered = false;
				k = option.value.series[hoveredIndex].pieStatus.k;
				startRatio = option.value.series[hoveredIndex].pieData.startRatio;
				endRatio = option.value.series[hoveredIndex].pieData.endRatio;
				// 对当前点击的扇形，执行取消高亮操作（对 option 更新）
				option.value.series[hoveredIndex].parametricEquation =
					getParametricEquation(
						startRatio,
						endRatio,
						isSelected,
						isHovered,
						k,
						option.value.series[hoveredIndex].pieData.value
					);
				option.value.series[hoveredIndex].pieStatus.hovered = isHovered;
				// 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
				hoveredIndex = '';
			}
			// 使用更新后的 option，渲染图表
			myChart.setOption(option.value);
		});

		myChart.on('legendselectchanged', function (event) {
			const { selected } = event; // 获取当前所有图例的选中状态（key:图例name，value:是否选中）
			const k = 1 - hollow.value; // 复用空心比例配置
			optionData.value.forEach(item => (item.value = item.num));
			// 1. 筛选选中的原始数据（未选中则排除，选中为空时默认显示全部）
			const selectedData = Object.keys(selected).length
				? optionData.value.filter(item => selected[item.name])
				: [...optionData.value]; // 无选中时显示全部
			// 2. 重新计算筛选后数据的总数值（用于计算扇形比例）
			const newSumValue = selectedData.reduce(
				(sum, item) => sum + item.value,
				0
			);
			if (newSumValue === 0) return; // 避免无数据时出错

			// 3. 重置起始比例，遍历选中数据计算新的startRatio/endRatio
			let startValue = 0;
			const dataRatioMap = new Map(); // 存储{图例name: {startRatio, endRatio}}
			selectedData.forEach(item => {
				const startRatio = startValue / newSumValue;
				const endRatio = (startValue + item.value) / newSumValue;
				dataRatioMap.set(item.name, { startRatio, endRatio });
				startValue += item.value;
			});

			// 4. 遍历所有3D扇形系列，更新配置（显示/隐藏、比例、3D形态）
			option.value.series.forEach(seriesItem => {
				if (seriesItem.name === 'pie2d') return; // 跳过2D标签系列

				const seriesName = seriesItem.name;
				const isShow = selected[seriesName] ?? true; // 未选中项默认隐藏
				const pieData = optionData.value.find(item => item.name === seriesName); // 关联原始数据
				const ratioInfo = dataRatioMap.get(seriesName) || {
					startRatio: 0,
					endRatio: 0
				}; // 未选中项比例置0

				// 4.1 更新扇形基础信息（比例、高度）
				seriesItem.pieData = {
					...pieData,
					startRatio: ratioInfo.startRatio,
					endRatio: ratioInfo.endRatio,
					value: pieHeight.value > 0 ? pieHeight.value : pieData.value // 复用高度配置
				};

				// 4.2 更新3D参数方程（核心：控制扇形的3D形态和位置）
				seriesItem.parametricEquation = getParametricEquation(
					ratioInfo.startRatio, // 新起始比例
					ratioInfo.endRatio, // 新结束比例
					seriesItem.pieStatus.selected, // 保留原点击选中状态
					seriesItem.pieStatus.hovered, // 保留原hover状态
					k, // 空心比例
					seriesItem.pieData.value // 扇形高度
				);

				// 4.3 隐藏未选中的扇形（通过设置z轴范围使其不可见）
				if (!isShow) {
					seriesItem.parametricEquation.z = () => -2; // 低于可视范围（原配置z轴max=1）
				}
			});

			// 更新2D标签饼图
			const pie2dSeries = option.value.series.find(s => s.name === 'pie2d');
			if (pie2dSeries) {
				const newSumValue = selectedData.reduce(
					(sum, item) => sum + item.value,
					0
				);
				pie2dSeries.data = selectedData.map(item => {
					const percentage = ((item.value / newSumValue) * 100).toFixed(1);
					return {
						name: item.name,
						value: item.value,
						itemStyle: {
							color: 'transparent',
							borderWidth: 0
						},
						label: {
							show: true,
							position: 'inside',
							formatter: percentage + '%',
							fontSize: 12,
							color: '#fff',
							textShadowColor: 'rgba(0, 0, 0, 0.8)',
							textShadowBlur: 4
						},
						labelLine: {
							show: false
						}
					};
				});
			}

			// 5. 重渲染图表，显示完整3D饼图
			myChart.setOption(option.value);
		});
	};
</script>
<style scoped lang="scss">
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
