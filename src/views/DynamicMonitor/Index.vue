<!-- 未来魔镜 -->
<template>
	<div class="pages">
		<Layout>
			<template #left>
				<div class="w-full h-full left">
					<SecondTile
						label="未来情景调控台"
						leftPadding="3.9375rem"></SecondTile>
					<div class="pl-[1.6875rem] pr-[0.4375rem]">
						<div>
							<Arrowhead
								class="my-3"
								name="场景体系"
								direction="bottom"
								@directionChange="handleTitleToggle('project')"></Arrowhead>
							<CustomSelect
								v-model="projectName"
								v-show="titleStates.project"
								:options="projectList"
								:footer="true"
								@select="handleProjectChange">
								<template #footer>
									<div
										class="more-box cursor-pointer"
										style="text-align: right"
										@click="handleMore">
										查看更多 >>
									</div>
								</template>
							</CustomSelect>
							<Arrowhead
								class="my-3"
								name="选择专题"
								direction="bottom"
								@directionChange="handleTitleToggle('topic')"></Arrowhead>
							<ZbListCom
								v-show="titleStates.topic"
								:data="planningWarningTopicList"
								:currentId="activeZt"
								@zbChange="ztChange"></ZbListCom>
							<Arrowhead
								class="my-3"
								name="选择单元"
								direction="bottom"
								@directionChange="handleTitleToggle('dy')"></Arrowhead>
							<CustomSelect
								v-model="dyCurrent"
								v-show="titleStates.dy"
								:options="dyList"
								@select="getRes">
							</CustomSelect>
							<Arrowhead
								class="my-3"
								name="选择年份"
								direction="bottom"
								@directionChange="handleTitleToggle('year')"></Arrowhead>
							<CustomSelect
								v-model="yearCurrent"
								v-show="titleStates.year"
								:options="yearList"
								@select="getRes">
							</CustomSelect>
						</div>
						<Arrowhead
							class="my-3"
							name="指标类型"
							direction="bottom"
							@directionChange="handleTitleToggle('zbType')"></Arrowhead>
						<CustomSelect
							v-model="activeLx"
							v-show="titleStates.zbType"
							:options="lxList"
							@select="indicatorTypeChangeHandle">
						</CustomSelect>
						<Arrowhead
							class="my-3"
							name="具体指标"
							direction="bottom"
							@directionChange="handleTitleToggle('zb')"></Arrowhead>
						<CustomSelect
							v-show="titleStates.zb"
							v-model="activeZb"
							:options="zbList"
							returnItem
							@select="zbChange">
						</CustomSelect>
						<!-- <div class="w-full addText">
							<div class="addTextTitle">指标含义</div>
							<div class="addTextContent">
								{{ indicatorSummary }}
							</div>
						</div> -->
					</div>
				</div>
			</template>
			<template #map>
				<MaxMap ref="maxMapRef">
					<template #mapCon>
						<p class="absolute mapConTitle select-none">
							{{ projectList.find(n => n.value == projectName)?.label || '' }}
						</p>
					</template>
				</MaxMap>
			</template>
			<template #right>
				<div class="w-full h-full right">
					<SecondTile
						label="未来数据仪表盘"
						direction="right"
						rightPadding="5rem"></SecondTile>
					<div class="pl-[0.375rem] pr-8">
						<Arrowhead
							class="my-3"
							:name="indicatorChangeSummary"
							direction="left"
							:isChange="false" />
						<div
							class="yearChart bg-[#112e46] h-[9.3125rem] pt-4 px-[1.3125rem] pb-[1.3125rem]">
							<div class="yearChartItem">
								<div
									class="yearChartItemTitle flex items-center justify-center">
									<span>{{ baseYear }}年</span>
								</div>
								<div
									ref="chartRef"
									style="width: 90%; height: 150px; margin-top: -54px"></div>
							</div>
							<div class="yearChartItem">
								<div
									class="yearChartItemTitle flex items-center justify-center">
									<span>{{ predictYear }}年</span>
								</div>
								<div
									ref="chartRefRight"
									style="width: 90%; height: 150px; margin-top: -54px"></div>
							</div>
						</div>
						<Arrowhead
							class="my-3"
							:name="'指标变化率排名'"
							direction="left"
							:isChange="false">
							<img
								class="cursor-pointer"
								src="@/assets/img/sort.png"
								width="20"
								alt=""
								@click="sortHande" />
						</Arrowhead>
						<div class="trafficCommuting relative bg-[#112e46]">
							<span class="bhl absolute">变化率</span>
							<div
								class="trafficCommutingItem flex items-center"
								v-for="(item, index) in trafficData"
								:key="index">
								<template v-if="index < 5">
									<div
										class="trafficCommutingItemTitle flex items-center"
										:class="`top${index + 1}`">
										TOP{{ index + 1 }}
									</div>
									<div class="trafficCommutingItemContent">
										<div
											class="trafficCommutingItemContentItem"
											:class="`top${index + 1}`">
											<span class="name">{{ item.name }}</span>
											<span class="time" style="color: #5cdaf5">{{
												item.time
											}}</span>
										</div>
										<div class="line" :class="`top${index + 1}`">
											<p
												:class="`top${index + 1}`"
												:style="{ width: item.time }"></p>
										</div>
									</div>
									<img
										:src="item.trend === 'up' ? up : down"
										alt=""
										class="trafficCommutingItemImg" />
									<span class="text-[#5CDAF5] font-size-[10px]">{{
										item.percentage
									}}</span>
								</template>
							</div>
						</div>
						<Arrowhead
							class="my-3"
							name="指标分区详情"
							direction="left"
							:isChange="false">
							<el-select
								v-model="selectedDistrict"
								placeholder="请选择查询区域"
								popper-class="my-popper"
								size="small"
								style="width: 8.125rem"
								@change="districtSelectedChange">
								<el-option
									v-for="item in districtOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value" />
							</el-select>
						</Arrowhead>
						<div class="duibi bg-[#112e46] pt-4 pr-[0.625rem] pb-[0.875rem]">
							<!-- 图表标题和选择器 -->
							<div class="chartHeader">
								<div class="chartSelector"></div>
								<div class="customLegend">
									<div class="legendItem">
										<div
											class="legendColor"
											style="
												background: linear-gradient(
													0deg,
													#3fa4ff 0%,
													#60f5ff 100%
												);
											"></div>
										<span style="color: #c4c4c4">{{ baseYear }}年</span>
									</div>
									<div class="legendItem">
										<div
											class="legendColor"
											style="
												background: linear-gradient(
													0deg,
													#ff3657 0%,
													#ff72a6 86.09%
												);
											"></div>
										<span style="color: #c4c4c4">{{ predictYear }}年</span>
									</div>
								</div>
							</div>
							<!-- 图表容器 -->
							<div class="resultContentTitle">
								<div ref="chartRef1" style="width: 100%; height: 260px"></div>
							</div>
						</div>
						<!-- <div
							class="resultContentText flex flex-wrap mb-[10px]"
							v-if="mirrorData">
							<div>
								最大值：<span>{{ mirrorData.maxData?.toFixed(2) || 0 }}</span>
							</div>
							<div>
								最小值：<span>{{ mirrorData.minData?.toFixed(2) || 0 }}</span>
							</div>
							<div>
								平均值：<span>{{ mirrorData.avgValue?.toFixed(2) || 0 }}</span>
							</div>
						</div> -->
						<!-- <div class="resultContentText flex flex-wrap" v-if="mirrorData">
							<div>
								标准差：<span>{{ mirrorData.sdValue?.toFixed(2) || 0 }}</span>
							</div>
							<div>
								中位数：<span>{{ mirrorData.midData?.toFixed(2) || 0 }}</span>
							</div>
							<div>
								第一四分位数：<span>{{
									mirrorData.fourValue?.toFixed(2) || 0
								}}</span>
							</div>
						</div> -->
					</div>
				</div>
			</template>
		</Layout>
		<AddProject
			v-if="modelValue"
			:show="btnType === 'history'"
			@close="(modelValue = false), (btnType = '')"></AddProject>
	</div>
</template>
<script setup>
	import cityApi from '@/api/index.js';
	import { useAppStore } from '@/stores/modules/app.js';
	const useStore = useAppStore();
	import ZbListCom from '@/components/lists/zbList.vue';
	import up from '@/assets/img/decisionTheater/up.png';
	import down from '@/assets/img/decisionTheater/down.png';
	import AddProject from '@/components/addProject/index.vue';
	import MaxMap from '@/components/mapView/maxMap.vue';
	import * as echarts from 'echarts';
	import { getMatchedIndicators } from '@/utils/index.js';
	const chartRef = ref(null);
	const chartRef1 = ref(null);
	const chartRefRight = ref(null); // 年份对比第二个图表

	let chartRight = null; // 年份对比第二个图表
	let chart = null;
	let chartBar = null;
	const baseYear = ref(2024);
	const predictYear = ref(2030);
	const maxMapRef = ref(null);
	const modelValue = ref(false);
	const btnType = ref(''); // add: 新建项目, history: 历史项目
	const resultContentTitle = ref('各区县人口密度（万人/km²）');

	// 统一管理所有Title组件的状态
	const titleStates = ref({
		project: true,
		topic: true,
		dy: true,
		year: true,
		zbType: true,
		zb: true
	});
	// 处理Title组件的切换事件
	const handleTitleToggle = key => {
		titleStates.value[key] = !titleStates.value[key];
	};
	// 指标变化TOP5
	const trafficData = ref([
		{
			name: '增城区',
			time: '18,532人/平方米',
			trend: 'up',
			percentage: '18.51%'
		},
		{
			name: '从化区',
			time: '18,532人/平方米',
			trend: 'up',
			percentage: '10%'
		},
		{
			name: '南沙区',
			time: '18,532人/平方米',
			trend: 'down',
			percentage: '10%'
		},
		{
			name: '天河区',
			time: '18,532人/平方米',
			trend: 'down',
			percentage: '10%'
		},
		{
			name: '天河区',
			time: '18,532人/平方米',
			trend: 'down',
			percentage: '10%'
		}
	]);
	// 项目名称
	const projectName = ref('');
	const list = ref([]);
	const projectList = ref([{ value: '0', label: '新建推演项目' }]);
	const dyCurrent = ref('区县'); // 当前单元
	// 单元数据
	const dyList = ref([
		{ value: '区县', label: '区县' },
		{ value: '街道', label: '街道' },
		{ value: '网格', label: '网格' }
	]);
	const yearCurrent = ref('2030'); // 当前年份
	const yearList = ref([
		{ value: '2030', label: '2030年' },
		{ value: '2035', label: '2035年' },
		{ value: '2040', label: '2040年' }
	]);
	// 选择指标
	const activeLx = ref(''); // 当前指标类型
	const lxList = ref([]); // 指标类型数据
	const activeZb = ref(''); // 当前指标
	const zbList = ref([]); // 指标数据
	const indicatorSummary = ref(''); // 指标含义
	const indicatorChangeSummary = ref('指标总体变化'); // 指标总体变化
	const activeZt = ref('');
	const planningWarningTopicList = ref([]); // 专题列表
	const planningWarningTopicInfos = ref([]); // 专题原始数据
	const sortDirection = ref(true);
	const mirrorData = ref(null);

	// 年份对比第一个图表
	const chartFn = (value = 5100000, unit = '人') => {
		chart = echarts.init(chartRef.value);

		const option = {
			backgroundColor: 'transparent',
			series: [
				{
					type: 'gauge',
					startAngle: 180,
					endAngle: 0,
					center: ['50%', '100%'], // 半圆位置
					radius: '80%',
					min: 0,
					max: value * (Math.random() * 0.8 + 1),
					splitNumber: 20, // 刻度数量
					progress: {
						show: true,
						width: 15,
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
								{ offset: 0, color: '#00f6ff' },
								{ offset: 0.5, color: '#ffcf00' },
								{ offset: 1, color: '#ff5e00' }
							])
						}
					},
					axisLine: {
						lineStyle: {
							width: 20,
							color: [[1, '#1b1d2a']] // 背景色
						}
					},
					axisTick: {
						distance: -30,
						splitNumber: 5,
						lineStyle: { color: '#00f6ff', width: 2 }
					},
					splitLine: {
						distance: -35,
						length: 8,
						lineStyle: { color: '#00f6ff', width: 2 }
					},
					axisLabel: { show: false },
					pointer: { show: false },
					detail: {
						valueAnimation: true,
						fontSize: 14,
						offsetCenter: [0, '-10%'],
						color: '#00f6ff',
						formatter: '{value}%'
					},
					data: [{ value: (value * 100).toFixed(2) }]
				}
			]
		};
		chart.setOption(option);
		window.addEventListener('resize', () => chart.resize());
	};
	// 年份对比第二个图表
	const chartRightFn = (value = 5732000, unit = '人') => {
		chartRight = echarts.init(chartRefRight.value);

		const option = {
			backgroundColor: 'transparent',
			series: [
				{
					type: 'gauge',
					startAngle: 180,
					endAngle: 0,
					center: ['50%', '100%'], // 半圆位置
					radius: '80%',
					min: 0,
					max: value * (Math.random() * 0.8 + 1),
					splitNumber: 20, // 刻度数量
					progress: {
						show: true,
						width: 15,
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
								{ offset: 0, color: '#00f6ff' },
								{ offset: 0.5, color: '#ffcf00' },
								{ offset: 1, color: '#ff5e00' }
							])
						}
					},
					axisLine: {
						lineStyle: {
							width: 20,
							color: [[1, '#1b1d2a']] // 背景色
						}
					},
					axisTick: {
						distance: -30,
						splitNumber: 5,
						lineStyle: { color: '#00f6ff', width: 2 }
					},
					splitLine: {
						distance: -35,
						length: 8,
						lineStyle: { color: '#00f6ff', width: 2 }
					},
					axisLabel: { show: false },
					pointer: { show: false },
					detail: {
						valueAnimation: true,
						fontSize: 14,
						offsetCenter: [0, '-10%'],
						color: '#00f6ff',
						formatter: '{value}%'
					},
					data: [{ value: (value * 100).toFixed(2) }]
				}
			]
		};

		chartRight.setOption(option);

		window.addEventListener('resize', () => chartRight.resize());
	};

	watch(
		() => dyCurrent.value,
		v => {
			if (v) {
				nextTick(() => {
					if (maxMapRef.value) {
						maxMapRef.value.addLyrToMap(dyCurrent.value);
					}
				});
			}
		},
		{
			immediate: true
		}
	);
	// 柱状图数据
	const selectedDistrict = ref('');
	const districtOptions = ref([
		{ value: 'all', label: '全部' },
		{ value: 'tianhe', label: '天河区' },
		{ value: 'yuexiu', label: '越秀区' },
		{ value: 'nansha', label: '南沙区' },
		{ value: 'liwan', label: '荔湾区' },
		{ value: 'baiyun', label: '白云区' },
		{ value: 'zengcheng', label: '增城区' },
		{ value: 'panyu', label: '番禺区' }
	]);
	const barChartData = ref({
		districts: [
			'天河区',
			'越秀区',
			'南沙区',
			'荔湾区',
			'白云区',
			'增城区',
			'番禺区'
		],
		afterProject: [730, 790, 1180, 890, 860, 960, 950],
		beforeProject: [930, 990, 700, 1100, 590, 670, 660]
	});
	const chartBarFn = (unit = '%') => {
		let indicatorInfo = zbList.value.find(m => m.value == activeZb.value);
		chartBar = echarts.init(chartRef1.value);
		const option = {
			backgroundColor: 'transparent',
			// 添加图形元素显示单位
			graphic: {
				elements: [
					{
						type: 'text',
						left: '0%',
						top: '8%' // 在图例下方显示单位
						// style: {
						// 	text: '单位：' + indicatorInfo?.unit, // 请根据实际情况修改单位
						// 	fontSize: 12,
						// 	color: '#ffffff',
						// 	fill: 'gray'
						// }
					}
				]
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				},
				backgroundColor: 'rgba(0, 0, 0, 0.8)',
				borderColor: '#00f6ff',
				borderWidth: 1,
				textStyle: {
					color: '#fff'
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '12%', // 增加底部空间以容纳 dataZoom
				top: '20%', // 调整为图例和单位留出足够空间
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data: barChartData.value.districts,
				axisLine: {
					lineStyle: {
						color: '#00f6ff'
					}
				},
				axisLabel: {
					color: '#fff',
					fontSize: 12,
					rotate: 0
				},
				axisTick: {
					alignWithLabel: true,
					lineStyle: {
						color: '#00f6ff'
					},
					axisLabel: {
						color: '#fff',
						fontSize: 12,
						rotate: 0
					}
				}
			},
			yAxis: {
				type: 'value',
				name: unit,
				axisLabel: {
					color: '#fff',
					fontSize: 12,
					rotate: 0
				},
				nameTextStyle: {
					color: '#fff',
					fontSize: 12
				}
			},
			series: [
				{
					name: baseYear.value + '年',
					type: 'bar',
					data: barChartData.value.afterProject,
					itemStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: '#60F5FF' },
							{ offset: 1, color: '#3FA4FF' }
						])
					},
					emphasis: {
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#33f9ff' },
								{ offset: 1, color: '#0088dd' }
							])
						}
					},
					barWidth: '12px'
				},
				{
					name: predictYear.value + '年',
					type: 'bar',
					data: barChartData.value.beforeProject,
					itemStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: '#FF72A6' },
							{ offset: 1, color: '#FF3657' }
						])
					},
					emphasis: {
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#FF3657' },
								{ offset: 1, color: '#FF72A6' }
							])
						}
					},
					barWidth: '12px'
				}
			],
			dataZoom: [
				{
					type: 'inside',
					xAxisIndex: 0,
					start: 0,
					end: 50,
					zoomOnMouseWheel: true,
					moveOnMouseMove: true,
					moveOnMouseWheel: true,
					bottom: '2%' // 将内置缩放控件也放在底部
				},
				{
					type: 'slider',
					xAxisIndex: 0,
					start: 0,
					end: 50,
					bottom: '2%', // 将滑动条放在底部
					height: 20 // 设置滑动条高度
				}
			]
		};
		chartBar.setOption(option);
		window.addEventListener('resize', () => chartBar.resize());
	};

	onMounted(async () => {
		await initProjects();
	});
	onBeforeUnmount(() => {
		chart && chart.dispose();
		chartBar && chartBar.dispose();
		chartRight && chartRight.dispose();
	});

	// 获取项目列表
	const initProjects = async () => {
		try {
			const res = await cityApi.projectQueryWithPage({
				adminFlag: useStore.userInfo?.adminFlag || '1',
				current: 1,
				size: 3,
				endTime: '',
				startTime: '',
				eq_status: '3',
				like_name: '',
				loginUser: useStore.userInfo?.username || ''
			});
			if (res.resultCode === 'S') {
				const data = res.data || [];
				list.value = data.filter(item => item.status === '3');
				let firstItem = JSON.parse(JSON.stringify(projectList.value[0]));
				projectList.value = data.map(m => {
					return { value: m.id, label: m.name, indicatorIds: m.indicatorIds };
				});
				projectList.value.unshift(firstItem);
				projectName.value = projectList.value[1].value;
				handleProjectChange(projectName.value);
			}
		} catch (error) {
			console.error('查询城市推演项目记录信息失败:', error);
		}
	};
	// 专门获取指标树接口
	const getZb = async () => {
		try {
			const indicatorIds =
				projectList.value.find(n => n.value == projectName.value)
					?.indicatorIds || '';

			const res = await cityApi.resultTree({
				current: 1,
				size: 1000,
				projectType: 'MAIN',
				array_indicatorId: indicatorIds || '',
				eq_indicatorId: '', // 指标ID
				eq_projectId: projectName.value, // 推演项目ID
				eq_predictYear: yearCurrent.value, // 目标年份
				eq_regionLevel: dyCurrent.value, // 行政区级别，全市、区县、街道、网格
				eq_xzqdm: '', // 行政区代码
				like_indicatorName: '' // 指标名称
			});
			if (res.resultCode === 'S') {
				if (res.data?.length > 0) {
					planningWarningTopicInfos.value = [];
					res.data.forEach(item => {
						planningWarningTopicInfos.value.push({
							...item,
							label: item.nodeName,
							disabled: item?.citySPSFlag
						});
					});
					// 初始化专题选项
					const indicatorIds =
						projectList.value.find(n => n.value == projectName.value)
							?.indicatorIds || '';
					const tree = getMatchedIndicators(
						planningWarningTopicInfos.value,
						indicatorIds,
						'nodeId'
					);
					planningWarningTopicList.value = tree.map(m => {
						return { ...m, nodeName: m.nodeName.replace('专题', '') };
					});
					activeZt.value = planningWarningTopicList.value[0]?.nodeId || '';
					if (activeZt.value) {
						handleWarningTopicChange();
					}
				}
			}
		} catch (error) {
			console.error('专门获取指标树接口:', error);
		}
	};
	// 最后获取结果接口
	const getRes = async () => {
		try {
			const res = await cityApi.mirrorStatistic({
				array_indicatorId: activeZb.value,
				catalogId: '',
				dynamicParam: [
					{
						childProjectId: '',
						detailParams: [
							{
								adjustValue: '',
								indicatorId: ''
							}
						]
					}
				],
				eq_grade: '',
				eq_indicatorId: activeZb.value,
				eq_predictYear: yearCurrent.value,
				eq_projectId: projectName.value,
				eq_regionLevel: dyCurrent.value,
				eq_xzqdm: '',
				like_indicatorName: '',
				projectType: 'MAIN',
				current: 0,
				size: 10
			});
			if (res.resultCode === 'S') {
				indicatorSummary.value = res.data?.summary || '';
				mirrorData.value = res.data;
				let projInfo = list.value.find(n => n.id == projectName.value);
				// 根据数据进行排序
				sortDirection.value = false;
				sortHande();

				// 查询年份
				baseYear.value = projInfo.baseYear;
				predictYear.value = yearCurrent.value;

				// 分区情况描述统计标题
				let indicatorInfo = zbList.value.find(m => m.value == activeZb.value);
				resultContentTitle.value = `各${dyCurrent.value}${
					indicatorInfo?.label || ''
				}(${indicatorInfo?.unit})`;

				// 指标总体变化
				indicatorChangeSummary.value = `${indicatorInfo?.label}总体变化(${indicatorInfo?.unit})`;

				// 指标详情查询
				barChartData.value = {
					districts: res.data.indicatorData.map(n => n.xzqmc),
					afterProject: res.data.indicatorData.map(n => {
						return (
							indicatorInfo?.unit == '%' ? n.monitorValue * 100 : n.monitorValue
						).toFixed(2);
					}),
					beforeProject: res.data.indicatorData.map(n => {
						return (
							indicatorInfo?.unit == '%' ? n.predictValue * 100 : n.predictValue
						).toFixed(2);
					})
				};
				(districtOptions.value = res.data.indicatorData.map(n => {
					return { value: n.xzqdm, label: n.xzqmc };
				})),
					districtOptions.value.unshift({ value: 'all', label: '全部' });
				chartBarFn(indicatorInfo?.unit);

				// 渲染指标总体变化
				chartFn(res.data.totalBaseValue, indicatorInfo?.unit);
				chartRightFn(res.data.totalPredictValue, indicatorInfo?.unit);

				// 渲染地图
				if (maxMapRef.value) {
					let datas = res.data.indicatorData.filter(m => m.regionLevel == dyCurrent.value).map(m => {
						return {
							predictValue: m.predictValue,
							xzqdm: m.xzqdm,
							xzqmc: m.xzqmc,
							indicatorInfo,
							predictYear: yearCurrent.value,
							calculateResult: Object.assign(m, {
								module: 'FeatureMirror',
								unit: indicatorInfo.unit || ' '
							})
						};
					});
					if (dyCurrent.value.includes('网格') || dyCurrent.value.includes('工业用地')) {
						datas = [
							{
								size: dyCurrent.value.replace('网格', ''),
								region: dyCurrent.value,
								indicatorInfo,
								predictYear: yearCurrent.value,
								calculateResult: {
									module: 'FeatureMirror',
									unit: indicatorInfo?.unit || ' '
								}
							}
						];
					}
					maxMapRef.value.renderDatasToMap(dyCurrent.value, datas);
				}
			}
		} catch (error) {
			console.error('查询城市推演项目记录信息失败:', error);
		}
	};

	// 项目选择事件
	const handleProjectChange = value => {
		if (value === '0') {
			btnType.value = 'add';
			modelValue.value = true;
		} else {
			projectName.value = value;
			let projInfo = list.value.find(n => n.id == value);

			if (projInfo) {
				// 初始化选择单元
				dyList.value = projInfo.rangeType.split(',').map(m => {
					return { value: m, label: m };
				});
				dyCurrent.value = dyList.value[0].value;
				// 初始化年份
				yearList.value = projInfo.predictYear.split(',').map(m => {
					return { value: m, label: m };
				});
				yearCurrent.value = yearList.value[0].value;
				getZb();
			}
		}
	};
	// 历史项目
	const handleMore = () => {
		btnType.value = 'history';
		modelValue.value = true;
	};
	// 专题选择事件
	const handleWarningTopicChange = () => {
		let topic = planningWarningTopicInfos.value.find(
			n => n.nodeId == activeZt.value
		);
		lxList.value = topic.children.map(m => {
			return {
				...m,
				value: m.nodeId,
				label: m.nodeName
			};
		});
		// 如果指标类型下没有具体指标，就不显示
		lxList.value = lxList.value.filter(m => m.children?.length > 0);
		activeLx.value = lxList.value[0].value;
		indicatorTypeChangeHandle(lxList.value[0]?.value);
	};
	// 指标类型选择事件
	const indicatorTypeChangeHandle = value => {
		activeLx.value = value;
		zbList.value = [];
		const zbChildren = lxList.value.filter(n => n.value == value);
		if (zbChildren) {
			zbList.value = zbChildren[0].children.map(m => {
				return {
					...m,
					value: m.nodeId,
					label: m.nodeName
				};
			});
			zbChange(zbList.value[0]);
		}
	};
	// 专题选择事件
	const ztChange = item => {
		if (item) {
			activeZt.value = item.nodeId;
			handleWarningTopicChange(item.nodeId);
		}
	};
	// 指标选择事件
	const zbChange = item => {
		activeZb.value = item.value;
		getRes();
	};
	// 按变化率升序或降序
	const sortHande = () => {
		sortDirection.value = !sortDirection.value;
		if (mirrorData.value.indicatorData?.length) {
			let vals = mirrorData.value.indicatorData;
			if (sortDirection.value) {
				// 升序
				vals = [...mirrorData.value.indicatorData].sort(
					(a, b) => b.changeRate - a.changeRate
				);
			} else {
				// 降序
				vals = [...mirrorData.value.indicatorData].sort(
					(a, b) => a.changeRate - b.changeRate
				);
			}
			let indicatorInfo = zbList.value.find(m => m.value == activeZb.value);
			trafficData.value = vals.slice(0, 5).map(n => {
				return {
					name: n.xzqmc,
					time: (n.predictValue * 100).toFixed(2) + `${indicatorInfo.unit}`,
					trend: n.changeRate >= 0 ? 'up' : 'down',
					percentage: (n.changeRate * 100).toFixed(2) + '%'
				};
			});
		}
	};
	// 指标详情查询，切换行政区划
	const districtSelectedChange = () => {
		let datas = mirrorData.value.indicatorData;
		if (selectedDistrict.value != 'all') {
			datas = mirrorData.value.indicatorData.filter(
				n => n.xzqdm == selectedDistrict.value
			);
		}
		let indicatorInfo = zbList.value.find(m => m.value == activeZb.value);
		barChartData.value = {
			districts: res.data.indicatorData.map(n => n.xzqmc),
			afterProject: res.data.indicatorData.map(n => {
				return (
					indicatorInfo?.unit == '%' ? n.monitorValue * 100 : n.monitorValue
				).toFixed(2);
			}),
			beforeProject: res.data.indicatorData.map(n => {
				return (
					indicatorInfo?.unit == '%' ? n.predictValue * 100 : n.predictValue
				).toFixed(2);
			})
		};
		chartBarFn(indicatorInfo?.unit);
	};
</script>

<style lang="scss" scoped>
	.left {
		.futureChoose {
			img {
				width: 80%;
			}
		}
		.futureChooseIcon {
			width: 130px;
			height: 34px;
			margin: 10px 0;
		}
		.zb {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: space-between;

			.zbList {
				width: 48%;
				height: 32px;
				line-height: 32px;
				position: relative;
				background-size: 100% 100%;
				background-repeat: no-repeat;
				background-position: center center;
				margin-bottom: 14px;

				.zbContent {
					padding: 0 10px 0 24px;
					height: 32px;
					line-height: 32px;
					color: #fff;
					font-family: 'YouSheBiaoTiHei';
					font-size: 16px;
					font-weight: 400;
					white-space: nowrap;
					text-align: center;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
		.chooseZbList {
			display: flex;
			flex-wrap: wrap;
			.chooseZbItem {
				min-width: 86px;
				height: 32px;
				line-height: 32px;
				margin-right: 10px;
				text-align: center;
				background-image: url('@/assets/img/futureMirror/zbBg.png');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				background-position: center center;
				margin-bottom: 10px;
			}
			.chooseZbItemText {
				font-size: 14px;
				color: #fff;
				font-weight: 400;
				padding: 0 12px 0 16px;
				font-family: 'YouSheBiaoTiHei';
				white-space: nowrap;
			}
		}
		.addText {
			background-image: url('@/assets/img/deductionEngine/addBg.png');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-position: center center;
			height: 181px;
			position: relative;
			margin-top: 10px;
			.addTextContent {
				color: #fff;
				padding: 0 40px 0 40px;
				box-sizing: border-box;
				letter-spacing: 2px;
				font-size: 14px;
				overflow: auto;
				height: 86px;
				line-height: 21px;
				font-family: 'SourceHanSansCN-Regular';
			}
			.addTextTitle {
				padding: 39px 0 2px 40px;
				font-size: 16px;
				line-height: 21px;
				font-family: 'YouSheBiaoTiHei';
			}
		}
	}
	.right {
		box-sizing: border-box;
		.result {
			text-align: right;
			margin-bottom: 20px;
			img {
				width: 80%;
			}
		}
		.yearChart {
			display: flex;
			.yearChartItem {
				width: 50%;
				.yearChartItemTitle {
					span {
						width: 66px;
						height: 22px;
						color: #66ffff;
						font-family: 'AlibabaPuHuiTi-95';
						font-weight: 800;
						font-size: 14px;
						line-height: 20px;
						letter-spacing: 0px;
						text-align: center;
						vertical-align: middle;
						background-color: #254162;
						border-bottom: 1px solid rgba(155, 172, 255, 1);
					}
				}
			}
		}
		.resultContent {
			.resultContentItem {
				display: flex;
				justify-content: center;
				height: 32px;
				line-height: 32px;
				text-align: center;
			}
		}
		.resultContentTitle {
			font-size: 24px;
			color: #66ffff;
			font-family: 'YouSheBiaoTiHei';
			text-align: right;
		}
		.resultContentText {
			div {
				font-size: 12px;
				margin-right: 6px;
				span {
					font-size: 20px;
					color: #66ffff;
					font-family: 'YouSheBiaoTiHei';
				}
			}
		}
		// 对比图表样式
		.duibi {
			background-size: 100% 100%;
			width: 100%;
			box-sizing: border-box;
			.chartHeader {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.customLegend {
					display: flex;
					gap: 15px;

					.legendItem {
						display: flex;
						align-items: center;
						gap: 6px;

						.legendColor {
							width: 12px;
							height: 8px;
							border-radius: 2px;
						}

						span {
							color: #fff;
							font-size: 12px;
							font-family: 'AlibabaPuHuiTi-55';
						}
					}
				}
				.chartSelector {
					width: 154px;
				}
			}

			.chartContainer {
				height: calc(100% - 50px);

				.barChart {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>
