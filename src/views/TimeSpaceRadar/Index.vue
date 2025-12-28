<!-- 规划预警雷达 -->
<template>
	<div class="pages">
		<Layout>
			<template #left>
				<div class="w-full h-full left">
					<SecondTile
						label="规划预警雷达调控台"
						leftPadding="3.9375rem"></SecondTile>
					<div class="pl-[1.6875rem] pr-[0.4375rem]">
						<div>
						<Arrowhead
							class="my-3"
							name="场景体系"
							direction="bottom"
							@directionChange="handleTitleToggle('project')"></Arrowhead>
						<div v-show="titleStates.project" class="project-section">
							<div class="project-tabs">
								<div
									v-for="(scenario, index) in scenarioList"
									:key="index"
									class="project-tab"
									:class="{ active: activeProjectScenario === scenario.value }"
									@click="handleProjectScenarioChange(scenario.value)">
									<img
										v-if="activeProjectScenario === scenario.value"
										:src="getAssetsFile('target-4-cur')"
										alt=""
										class="project-tab-bg" />
									<img
										v-else
										:src="getAssetsFile('target-4')"
										alt=""
										class="project-tab-bg" />
									<span class="project-tab-text">{{ scenario.label }}</span>
								</div>
							</div>
							<CustomSelect
								class="mb-[22px]"
								popper-class="my-popper"
								v-model="projectName"
								:options="projectNameList"
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
						</div>
							<Arrowhead
								class="my-3"
								name="选择单元"
								direction="bottom"
								@directionChange="handleTitleToggle('dy')"></Arrowhead>
							<CustomSelect
								v-show="titleStates.dy"
								v-model="dyCurrent"
								:options="dyList"
								@select="handleDyChange">
							</CustomSelect>
							<!-- 选择年份 -->
							<Arrowhead
								class="my-3"
								name="选择年份"
								direction="bottom"
								@directionChange="handleTitleToggle('year')"></Arrowhead>
							<CustomSelect
								v-show="titleStates.year"
								v-model="yearCurrent"
								:options="yearList"
								@select="yearCurrentChangeHandle">
							</CustomSelect>
						</div>
						<Arrowhead
							class="my-3"
							name="选择专题"
							direction="bottom"
							@directionChange="handleTitleToggle('zt')"></Arrowhead>
						<CustomSelect
							v-show="titleStates.zt"
							v-model="planningWarningTopic"
							:options="planningWarningTopicList"
							@select="handleWarningTopicChange">
						</CustomSelect>
						<Arrowhead
							class="my-3"
							name="选择指标"
							direction="bottom"
							@directionChange="handleTitleToggle('indicator')"></Arrowhead>
						<CustomSelect
							v-show="titleStates.indicator"
							v-model="indicator"
							:options="indicatorList"
							@select="handleIndicatorChange">
						</CustomSelect>
					</div>
				</div>
			</template>
			<template #map>
				<MaxMap ref="maxMapRef">
					<template #list>
						<ul
							class="mapList absolute w-full h-[5.3125rem] flex items-center justify-center">
							<li v-for="item in mapList" :key="item.name">
								<h1 class="title" :title="item.name">{{ item.name }}</h1>
								<p class="flex items-center">
									<span class="value">{{ item.value }}</span>
									<span class="unit">{{ item.unit }}</span>
								</p>
							</li>
						</ul>
					</template>
					<template #mapCon>
						<p class="absolute mapConTitle select-none">
							{{
								projectNameList.find(n => n.value == projectName)?.label || ''
							}}
						</p>
					</template>
				</MaxMap>
			</template>
			<template #right>
				<div class="w-full h-full right">
					<SecondTile
						label="数据仪表盘"
						direction="right"
						rightPadding="3.9375rem"></SecondTile>
					<div class="pl-[0.375rem] pr-[2.1875rem]">
						<Arrowhead
							class="my-3"
							:name="indicatorChangeSummary"
							direction="left"
							:isChange="false"></Arrowhead>
						<div
							class="yearChart bg-[#112e46] h-[9.3125rem] pt-4 px-[1.3125rem] pb-[1.3125rem]">
							<div class="yearChartItem">
								<div
									class="yearChartItemTitle flex items-center justify-center">
									<span>{{ baseYear }}年</span>
								</div>
								<div
									ref="chartRef"
									style="width: 90%; height: 150px; margin-top: -50px"></div>
							</div>
							<div class="yearChartItem">
								<div
									class="yearChartItemTitle flex items-center justify-center">
									<span>{{ predictYear }}年</span>
								</div>
								<div
									ref="chartRefRight"
									style="width: 90%; height: 150px; margin-top: -50px"></div>
							</div>
						</div>
						<Arrowhead
							class="my-3"
							name="指标预警详情"
							direction="left"
							:isChange="false">
							<el-select
								v-model="warningInfo"
								placeholder="危险/警告/安全"
								popper-class="my-popper"
								style="width: 8.125rem"
								@change="handleWarningInfoChange">
								<el-option
									v-for="item in warningInfoList"
									:key="item.value"
									:label="item.label"
									:value="item.value" />
							</el-select>
						</Arrowhead>
						<div
							class="warningInfo select-none h-[12.3125rem] py-2 pl-[0.3125rem] bg-[#112e46]">
							<template v-if="warningList.length > 0">
								<div
									class="w-full h-full overflow-hidden overflow-y-auto pr-[0.5625rem]">
									<div
										class="warningInfoItem relative flex items-center"
										v-for="item in warningList"
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
										<div
											class="h-[2.3125rem] w-[calc(100%-3.75rem)] pt-[0.75rem]">
											<el-slider
												v-model="item.data"
												:class="item.type"
												disabled />
										</div>
										<span
											class="warningInfoItemTitle absolute w-[calc(100%-130px)] overflow-hidden text-ellipsis whitespace-nowrap"
											>{{ item.name }}</span
										>
										<span class="warningInfoItemValue absolute">
											{{ item.value }}%</span
										>
									</div>
								</div>
							</template>
							<div
								v-else
								class="w-full h-full flex items-center justify-center">
								<p
									v-if="warningInfo === '0'"
									class="emptyTxt bg-[#3065CE] text-[#fff] px-10 w-[17.625rem] h-[1.875rem] border border-solid border-white">
									未查询到相关信息，请重新查询
								</p>
								<p
									v-if="warningInfo === '1'"
									class="emptyTxt bg-[#F7B500] text-[#fff] px-10 w-[17.625rem] h-[1.875rem] border border-solid border-white">
									未查询到相关信息，请重新查询
								</p>
								<p
									v-if="warningInfo === '2'"
									class="emptyTxt bg-[#9E3429] text-[#fff] px-10 w-[17.625rem] h-[1.875rem] border border-solid border-white">
									未查询到相关信息，请重新查询
								</p>
							</div>
						</div>
						<Arrowhead
							class="my-3"
							name="指标规划达成情况"
							direction="left"
							:isChange="false">
							<el-select
								v-model="indicatorValue"
								placeholder="超出/不足"
								popper-class="my-popper"
								style="width: 8.125rem"
								@change="handleTrendDirectionChange">
								<el-option
									v-for="item in indicatorValueList"
									:key="item.value"
									:label="item.label"
									:value="item.value" />
							</el-select>
						</Arrowhead>
						<div class="dbTable bg-[#112e46] h-[19.75rem]">
							<DbTableHeader
								:list="[
									{ name: '指标名称', class: 'w-30' },
									{ name: '规划值', class: 'w-[4.625rem]' },
									{ name: '推演值', class: 'w-[4.625rem]' },
									{ name: '偏差率', class: 'flex-1' }
								]"></DbTableHeader>
							<div class="dbTableBody overflow-hidden overflow-y-auto pl-2">
								<div
									class="dbTableRow"
									v-for="item in tableList"
									:key="item"
									style="font-size: 14px">
									<span>{{ item.name }}</span>
									<span
										class="normal"
										:class="item.planValue < 0 ? 'active' : ''"
										>{{ convertData(item.planValue) }}</span
									>
									<span>{{ convertData(item.predictValue) }}</span>
									<span class="dbTableRowData">
										<img
											src="@/assets/img/TimeSpaceRadar/up.png"
											alt=""
											v-if="item.type === 'up'" />
										<img
											src="@/assets/img/TimeSpaceRadar/down.png"
											alt=""
											v-if="item.type === 'down'" />
										{{ item.value }}
									</span>
								</div>
							</div>
						</div>
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
	import { convertData } from '@/utils/calculation.js';
	import { getAssetsFile } from '@/utils/index.js';
	import AddProject from '@/components/addProject/index.vue';
	import MaxMap from '@/components/mapView/maxMap.vue';
	import * as echarts from 'echarts';
	import danger from '@/assets/img/TimeSpaceRadar/danger.png';
	import warning from '@/assets/img/TimeSpaceRadar/warning.png';
	import safe from '@/assets/img/TimeSpaceRadar/safe.png';

	import cityApi from '@/api/index.js';
	import { radarApi } from '@/api/radar/index.js';
	const rdarApi = radarApi();

	const mapList = ref([
		{ name: '耕地保有量', value: '2751', unit: '万亩' },
		{ name: '耕地保有量', value: '2751', unit: '万亩' },
		{ name: '耕地保有量', value: '2751', unit: '万亩' }
	]);
	const maxMapRef = ref(null);
	// 统一管理所有Title组件的状态
	const titleStates = ref({
		project: true,
		dy: true,
		year: true,
		indicator: true,
		zt: true
	});
	// 处理Title组件的切换事件
	const handleTitleToggle = key => {
		titleStates.value[key] = !titleStates.value[key];
	};
	const modelValue = ref(false);
	const btnType = ref(''); // add: 新建项目, history: 历史项目
	// 选择项目
	const projectName = ref('');
	const projectNameList = ref([{ value: '0', label: '新建推演项目' }]);
	const completedProjectInfos = ref([]);

	// 选择项目的场景按钮
	const activeProjectScenario = ref('spatial');
	const scenarioList = ref([
		{ value: 'spatial', label: '空间智优' },
		{ value: 'economy', label: '产业智兴' },
		{ value: 'livable', label: '宜居智享' },
		{ value: 'green', label: '绿美智绘' },
		{ value: 'resilient', label: '韧性智安' },
		{ value: 'heritage', label: '名城智护' },
		{ value: 'digital', label: '数字智治' }
	]);

	// 历史项目
	const handleMore = () => {
		btnType.value = 'history';
		modelValue.value = true;
	};

	// 选择单元
	const dyCurrent = ref('区县');
	const dyList = ref([
		{ value: '区县', label: '区县' },
		{ value: '街道', label: '街道' },
		{ value: '网格', label: '网格' }
	]);

	// 选择年份
	const yearCurrent = ref('2030');
	const yearList = ref([
		{ value: '2030', label: '2030年' },
		{ value: '2035', label: '2035年' },
		{ value: '2040', label: '2040年' },
		{ value: '2050', label: '2050年' }
	]);

	const baseYear = ref(2024);
	const predictYear = ref('2030');
	const indicatorChangeSummary = ref('年份对比');

	// 选择规划预警专题
	const planningWarningTopic = ref('');
	const planningWarningTopicList = ref([]);
	const planningWarningTopicInfos = ref([]);

	// 选择指标
	const indicator = ref('');
	const indicatorList = ref([]);

	const radarStatisticInfo = ref(null);

	// 预警信息
	const warningInfo = ref('');
	const warningInfoList = ref([
		{ value: '-1', label: '全部' },
		{ value: '0', label: '安全' },
		{ value: '1', label: '警告' },
		{ value: '2', label: '危险' }
	]);
	// 预警信息数组
	const warningList = ref([]);

	// 指标数值
	const indicatorValue = ref('');
	const indicatorValueList = ref([
		{ value: '-1', label: '全部' },
		{ value: 'up', label: '超出' },
		{ value: 'down', label: '不足' }
	]);
	// 指标数值数组
	const tableList = ref([]);

	const chartRef = ref(null); // 年份对比第一个图表
	let chart = null; // 年份对比第一个图表
	const chartRefRight = ref(null); // 年份对比第二个图表
	let chartRight = null; // 年份对比第二个图表

	const tabValList = [
		{
			themeName: '土地利用专题',
			indicators: [
				{
					name: '建设用地面积',
					planVal2030: 2541.13236767212,
					planVal2035: 2964.6544289508,
					2030: 2232.35427821942,
					2035: 2384.51340471268,
					unit: '平方公里'
				},
				{
					name: '农用地面积',
					planVal2030: 9198.59677607286,
					planVal2035: 8925.36820465341,
					2030: 9198.59677607286,
					2035: 8925.36820465341,
					unit: '平方公里'
				},
				{
					name: '未利用地面积',
					planVal2030: 776.9239457077,
					planVal2035: 745.743390633876,
					2030: 776.9239457077,
					2035: 745.743390633876,
					unit: '平方公里'
				}
			]
		},
		{
			themeName: '城市建设用地专题',
			indicators: [
				{
					name: '居住用地面积',
					planVal2030: 689.887980415731,
					planVal2035: 804.86931048502,
					2030: 587.274264076191,
					2035: 603.452102237831,
					unit: '平方公里'
				},
				{
					name: '工业用地面积',
					planVal2030: 430.692778734116,
					planVal2035: 502.474908523135,
					2030: 371.090874588029,
					2035: 387.518563532088,
					unit: '平方公里'
				},
				{
					name: '公共设施用地面积',
					planVal2030: 187.987728692162,
					planVal2035: 219.319016807522,
					2030: 166.837859960381,
					2035: 181.141817253877,
					unit: '平方公里'
				}
			]
		},
		{
			themeName: '碳排放专题',
			indicators: [
				{
					name: '建筑碳排放',
					planVal2030: 4835.75749747082,
					planVal2035: 2532.13669500949,
					2030: 4103.33061794868,
					2035: 4190.30716185499,
					unit: '吨'
				},
				{
					name: '交通碳排放',
					planVal2030: 766.034892032429,
					planVal2035: 893.707374037833,
					2030: 662.251461986045,
					2035: 681.630942095406,
					unit: '吨'
				},
				{
					name: '用地碳排放',
					planVal2030: 6357.87690597661,
					planVal2035: 7417.52305697272,
					2030: 5325.57779198668,
					2035: 5456.29262944034,
					unit: '吨'
				}
			]
		}
	];

	watch(
		() => dyCurrent.value,
		v => {
			if (v) {
				nextTick(() => {
					maxMapRef.value.addLyrToMap(dyCurrent.value);
				});
			}
		},
		{ immediate: true }
	);

	// 年份对比第一个图表
	const chartFn = (value = 50) => {
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
								{ offset: 0, color: '#66FFFF' },
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
						lineStyle: { color: '#66FFFF', width: 2 }
					},
					splitLine: {
						distance: -35,
						length: 8,
						lineStyle: { color: '#66FFFF', width: 2 }
					},
					axisLabel: { show: false },
					pointer: { show: false },
					detail: {
						valueAnimation: true,
						fontSize: 14,
						offsetCenter: [0, '-10%'],
						color: '#66FFFF',
						formatter: '{value}'
					},
					data: [{ value: value }]
				}
			]
		};
		chart.setOption(option);
		window.addEventListener('resize', () => chart.resize());
	};
	// 年份对比第二个图表
	const chartRightFn = (value = 20) => {
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
								{ offset: 0, color: '#66FFFF' },
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
						lineStyle: { color: '#66FFFF', width: 2 }
					},
					splitLine: {
						distance: -35,
						length: 8,
						lineStyle: { color: '#66FFFF', width: 2 }
					},
					axisLabel: { show: false },
					pointer: { show: false },
					detail: {
						valueAnimation: true,
						fontSize: 14,
						offsetCenter: [0, '-10%'],
						color: '#66FFFF',
						formatter: '{value}'
					},
					data: [{ value: value }]
				}
			]
		};

		chartRight.setOption(option);

		window.addEventListener('resize', () => chartRight.resize());
	};

	// 选择项目的场景按钮选择
	const handleProjectScenarioChange = value => {
		activeProjectScenario.value = value;
		// 根据场景更新项目列表或相关数据
	};

	const handleProjectChange = value => {
		// 当索引值为 0 则新建项目
		if (value === '0') {
			btnType.value = 'add';
			modelValue.value = true;
		} else {
			// 当索引值为其他时，加载历史项目
			if (completedProjectInfos.value.length) {
				let projInfo = completedProjectInfos.value?.find(
					n => n.id == projectName.value
				);
				// 年份对比
				baseYear.value = projInfo.baseYear;

				// 初始化 选择单元
				dyList.value =
					projInfo.rangeType?.split(',').map(m => {
						return { value: m, label: m };
					}) || [];
				dyCurrent.value = dyList.value[0].value;

				// 初始化 选择年份
				yearList.value =
					projInfo.predictYear?.split(',').map(m => {
						return { id: m, value: m, label: m + '年' };
					}) || [];
				yearCurrent.value = yearList.value[0].value;
				predictYear.value = projInfo.predictYear.split(',')[0];

				let indicatorIds = projInfo.indicatorIds?.split(',') || [];
				const filteredTrees = getTreeByLeafNodes(
					planningWarningTopicInfos.value,
					indicatorIds
				);
				let filterItems = planningWarningTopicInfos.value.filter(m =>
					filteredTrees.map(m => m.nodeId).includes(m.nodeId)
				);
				// 初始化雷达专题
				planningWarningTopicList.value = filterItems.map(m => {
					return { value: m.nodeId, label: m.nodeName.replace('专题', '') };
				});
				handleWarningTopicChange(planningWarningTopicList.value[0].value);
			}
		}
	};
	// 选择规划预警专题
	const handleWarningTopicChange = value => {
		planningWarningTopic.value = value;
		let asd = planningWarningTopicInfos.value.find(n => n.nodeId == value);
		indicatorList.value = [];
		if (asd) {
			asd.children?.forEach(m => {
				indicatorList.value.push({
					value: m.nodeId,
					label: m.nodeName,
					data: m
				});
			});
		}
		let projInfo = completedProjectInfos.value?.find(
			n => n.id == projectName.value
		);
		let ids = projInfo?.indicatorIds?.split(',');
		if (ids?.length) {
			indicatorList.value = indicatorList.value.filter(n =>
				ids.includes(n.value)
			);
		}
		if (indicatorList.value?.length) {
			handleIndicatorChange(indicatorList.value[0].value);
		}
	};
	// 年份选择事件
	const yearCurrentChangeHandle = value => {
		yearCurrent.value = value;
		queryRadarStatisticInfo();
	};
	// 单元选择事件
	const handleDyChange = value => {
		dyCurrent.value = value;
		queryRadarStatisticInfo();
	};
	// 选择指标
	const handleIndicatorChange = value => {
		indicator.value = value;
		queryRadarStatisticInfo();
	};

	// 指标数值
	const handleTrendDirectionChange = value => {
		let indicatorInfo = indicatorList.value.find(
			m => m.value == indicator.value
		).data;
		tableList.value = radarStatisticInfo.value?.indicatorData.map(m => {
			let calVal = (
				((m.predictValue - m.planValue) / m.planValue || 0) * 100
			).toFixed(2);
			return {
				name: m.xzqmc,
				planValue: m.planValue + indicatorInfo?.unit,
				predictValue: m.predictValue + indicatorInfo?.unit,
				value: calVal + '%',
				type: calVal >= 0 ? 'up' : 'down'
			};
		});
		if (value != '-1') {
			tableList.value =
				tableList.value.filter(n => n.type == value) || tableList.value;
		}
	};

	const handleWarningInfoChange = value => {
		if (radarStatisticInfo.value?.indicatorData?.length) {
			let filterDatas = radarStatisticInfo.value.indicatorData;
			if (value == 0) {
				filterDatas = radarStatisticInfo.value.indicatorData.filter(
					m => m.grade == '0'
				);
			} else if (value == 1) {
				filterDatas = radarStatisticInfo.value.indicatorData.filter(m =>
					['1', '3'].includes(m.grade)
				);
			} else if (value == 2) {
				filterDatas = radarStatisticInfo.value.indicatorData.filter(m =>
					['2', '4'].includes(m.grade)
				);
			}
			// 预警信息
			warningList.value = filterDatas?.map(m => {
				let evaluateScore = n => {
					if (n.grade == '0') return 'safe';
					if (['1', '3'].includes(n.grade)) return 'warning';
					return 'danger';
				};
				let calVal = (
					((m.predictValue - m.planValue) / m.planValue || 0) * 100
				).toFixed(2);
				return {
					name: m.xzqmc + ' ' + convertData(m.predictValue + m.unit),
					value:
						(calVal.includes('-') ? '缺' : '超') + calVal.replaceAll('-', ''),
					data: Math.abs(calVal),
					type: evaluateScore(m)
				};
			});
		}
	};

	/**
	 * 根据叶子节点nodeId集合返回完整的树形结构
	 * 只保留包含目标叶子节点的路径，其他分支将被过滤掉
	 * @param {Array} data - 原始树形结构数据
	 * @param {Array} leafNodeIds - 叶子节点nodeId集合
	 * @returns {Array} 过滤后的完整树形结构
	 */
	function getTreeByLeafNodes(data, leafNodeIds) {
		const targetLeafIds = new Set(leafNodeIds);

		/**
		 * 递归过滤树节点，只保留包含目标叶子节点的路径
		 * @param {Array} nodes - 当前层级的节点数组
		 * @returns {Array} 过滤后的节点数组
		 */
		function filterTree(nodes) {
			if (!nodes || !Array.isArray(nodes)) return [];

			const filteredNodes = [];

			for (const node of nodes) {
				// 复制当前节点（不包含children）
				const newNode = { ...node };

				// 如果是叶子节点
				if (!node.children || node.children.length === 0) {
					// 如果这个叶子节点在目标集合中，则保留
					if (targetLeafIds.has(node.nodeId)) {
						filteredNodes.push(newNode);
					}
				} else {
					// 非叶子节点：递归过滤子节点
					const filteredChildren = filterTree(node.children);

					// 如果过滤后子节点不为空，则保留该节点
					if (filteredChildren.length > 0) {
						newNode.children = filteredChildren;
						filteredNodes.push(newNode);
					}
				}
			}

			return filteredNodes;
		}

		return filterTree(data);
	}

	const initProjects = async () => {
		try {
			const response = await cityApi.projectQueryWithPage({
				adminFlag: '1',
				current: 1,
				size: 20,
				endTime: '',
				eq_status: '3',
				like_name: '',
				loginUser: '',
				startTime: ''
			});
			if (response.resultCode === 'S') {
				completedProjectInfos.value = response.data || [];
				let firstItem = JSON.parse(JSON.stringify(projectNameList.value[0]));
				projectNameList.value = response.data.map((m, index) => {
					return { value: m.id, label: m.name };
				});
				projectName.value = projectNameList.value[0].value;
				handleProjectChange(projectNameList.value[0].value);
				projectNameList.value.unshift(firstItem);
			}
		} catch (error) {
			console.error('查询城市推演项目记录信息失败:', error);
		}
	};

	const initTopicList = async () => {
		try {
			const response = await cityApi.catalogQueryWithPage({
				eq_status: '1',
				eq_bizType: '2'
			});
			if (response.resultCode === 'S' && response.data.length) {
				const res = await cityApi.catalogGetById({
					catalogId: response.data[0].id
				});
				if (res.resultCode === 'S' && res.data?.tree.length) {
					planningWarningTopicList.value = res.data?.tree.map(m => {
						return { value: m.nodeId, label: m.nodeName.replace('专题', '') };
					});
					planningWarningTopicInfos.value = res.data?.tree;
					handleWarningTopicChange(planningWarningTopicList.value[0].value);
				}
			}
		} catch (error) {
			console.error('查询城市推演项目记录信息失败:', error);
		}
	};

	const queryRadarStatisticInfo = async () => {
		let projectInfo = completedProjectInfos.value?.find(
			n => n.id == projectName.value
		);
		if (!projectInfo) return;

		let asd = dyList.value.find(n => n.value == dyCurrent.value);
		let yearInfo = yearList.value.find(n => n.value == yearCurrent.value);
		predictYear.value = yearInfo.id;
		let response = await rdarApi.radarStatistic({
			current: 0,
			eq_indicatorId: indicator.value,
			eq_projectId: projectInfo?.id || '',
			eq_regionLevel: asd.label || '省级',
			eq_xzqdm: '',
			like_indicatorName: '',
			size: 100,
			targetYear: yearInfo.id || '2035',
			eq_predictYear: yearInfo.id || '2035'
		});
		if (response.resultCode === 'S' && response.data) {
			radarStatisticInfo.value = response.data;
			if (response.data.indicatorData?.length) {
				// 渲染地图
				if (maxMapRef.value) {
					let datas = response.data.indicatorData.filter(m => m.regionLevel == dyCurrent.value).map(m => {
						let indicatorItem = indicatorList.value.find(
							m => m.value == indicator.value
						).data;
						return {
							predictValue: m.predictValue,
							xzqdm: m.xzqdm,
							xzqmc: m.xzqmc,
							indicatorInfo: indicatorItem,
							predictYear: yearCurrent.value,
							calculateResult: Object.assign(m, {
								module: 'TimeSpaceRadar',
								unit: indicatorItem?.unit || ' '
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
									module: 'TimeSpaceRadar',
									unit: indicatorInfo?.unit || ' '
								}
							}
						];
					}
					maxMapRef.value.renderDatasToMap(dyCurrent.value, datas, 'radar');
				}
				// 指标总体变化
				let indicatorInfo = indicatorList.value.find(
					m => m.value == indicator.value
				).data;
				indicatorChangeSummary.value = `${indicatorInfo?.nodeName}总体变化(${indicatorInfo?.unit})`;
				// 预警信息
				warningList.value = response.data.indicatorData.map(m => {
					let evaluateScore = n => {
						if (n.grade == '0') return 'safe';
						if (['1', '3'].includes(n.grade)) return 'warning';
						return 'danger';
					};
					let calVal = (
						((m.predictValue - m.planValue) / m.planValue || 0) * 100
					).toFixed(2);
					return {
						name: m.xzqmc + ' ' + convertData(m.predictValue + m.unit),
						value:
							(calVal.includes('-') ? '缺' : '超') + calVal.replaceAll('-', ''),
						data: Math.abs(calVal),
						type: evaluateScore(m)
					};
				});
				// 指标数值
				tableList.value = response.data.indicatorData.map(m => {
					let calVal = (
						((m.predictValue - m.planValue) / m.planValue || 0) * 100
					).toFixed(2);
					return {
						name: m.xzqmc,
						planValue: m.planValue + indicatorInfo?.unit,
						predictValue: m.predictValue + indicatorInfo?.unit,
						value: calVal + '%',
						type: calVal >= 0 ? 'up' : 'down'
					};
				});
				// 渲染三个 tab 值
				mapList.value = [];
				let asd = planningWarningTopicInfos.value.find(
					n => n.nodeId == planningWarningTopic.value
				);
				if (asd) {
					// 之前渲染逻辑，先保存，为相应验收，写死数据
					// const firstThree = asd.children?.slice(0, 3);
					// firstThree.forEach(m => {
					// 	let item = response.data.indicatorData.find(
					// 		n => n.indicatorId == m.nodeId
					// 	);
					// 	mapList.value.push({
					// 		name: m.nodeName,
					// 		unit: m.unit,
					// 		value: item?.predictValue || 0.0
					// 	});
					// });
					let indicators =
						tabValList.find(n => n.themeName == asd.nodeName)?.indicators ||
						tabValList[0].indicators;
					indicators.forEach(m => {
						mapList.value.push({
							name: m.name,
							unit: m.unit,
							value: (m[yearInfo.id] || 0.0).toFixed(0)
						});
					});
				}
			}
			chartFn(response.data?.totalBaseValue || 0);
			chartRightFn(response.data?.totalPredictValue || 0);
		}
	};

	onMounted(async () => {
		chartFn(); // 年份对比第一个图表
		chartRightFn(); // 年份对比第二个图表
		await initTopicList();
		await initProjects();
	});

	onBeforeUnmount(() => {
		chart && chart.dispose();
		chartRight && chartRight.dispose();
	});
</script>

<style lang="scss" scoped>
	.left {
		.project-section {
			margin-bottom: 12px;
			background: rgba(17, 46, 70, 0.8);
			padding: 12px;

			.project-tabs {
				display: flex;
				flex-wrap: wrap;
				gap: 8px;
				margin-bottom: 12px;

				.project-tab {
					position: relative;
					cursor: pointer;
					transition: all 0.3s;
					display: flex;
					align-items: center;
					justify-content: center;
					min-height: 32px;

					.project-tab-bg {
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						object-fit: cover;
						background-size: 100% 100%;
						background-repeat: no-repeat;
						background-position: center center;
					}

					.project-tab-text {
						position: relative;
						z-index: 1;
						color: #fff;
						font-size: 13px;
						font-family: 'YouSheBiaoTiHei';
						white-space: nowrap;
						padding: 6px 14px;
					}

					&.active {
						.project-tab-text {
							font-weight: bold;
							font-size: 14px;
						}
					}

					&:hover {
						opacity: 0.9;
					}
				}
			}
		}
		.futureChoose {
			img {
				width: 80%;
			}
		}
		.futureChooseIcon {
			width: 130px;
			height: 34px;
			margin: 20px 0;
		}
		.futureContent {
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-wrap: wrap;
			.futureContentItem {
				width: 88px;
				height: 35px;
				line-height: 35px;
				background-image: url('@/assets/img/futureMirror/zt.png');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				background-position: center center;
				color: #fff;
				font-size: 20px;
				font-weight: 400;
				font-family: 'YouSheBiaoTiHei';
				text-align: center;
				margin-bottom: 10px;
			}
		}
		.chooseZbList {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			.chooseZbItem {
				width: 44%;
				height: 32px;
				line-height: 32px;
				text-align: center;
				background-image: url('@/assets/img/futureMirror/zbBg.png');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				background-position: center center;
				margin-bottom: 20px;
			}
			.chooseZbItemText {
				font-size: 14px;
				color: #fff;
				font-weight: 400;
				font-family: 'YouSheBiaoTiHei';
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
			}
			.addTextTitle {
				padding: 40px 0 2px 40px;
				font-size: 16px;
				line-height: 20px;
				font-family: 'YouSheBiaoTiHei';
			}
		}
	}
	.mapList {
		left: 0;
		bottom: 7.1875rem;
		z-index: 1;
		& li {
			background-image: url('@/assets/img/mapList.png');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-position: center center;
			padding: 1rem 0.75rem 0.75rem 4.875rem;
			width: 13.0625rem;
			height: 5.3125rem;
			&:not(:last-child) {
				margin-right: 4.5rem;
			}
		}
		& .title {
			font-family: 'YouSheBiaoTiHei';
			font-size: 1.25rem;
			line-height: 1.75rem;
			color: #fffaec;
			margin-bottom: 0;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		& .value {
			font-family: 'YouSheBiaoTiHei';
			font-size: 1.25rem;
			line-height: 1.75rem;
			color: #ff386b;
		}
		& .unit {
			font-family: 'YouSheBiaoTiHei';
			font-size: 0.875rem;
			line-height: 1.75rem;
			color: #fffaec;
		}
	}
	.right {
		box-sizing: border-box;
		.result {
			height: 3rem;
			text-align: right;
			img {
				width: 80%;
			}
		}
		.yearCompare {
			display: flex;
			align-items: center;
			img {
				width: 14px;
				height: 14px;
				margin-right: 10px;
			}
			span {
				font-size: 20px;
				color: #fff;
				font-weight: 400;
				font-family: 'YouSheBiaoTiHei';
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
		.warningInfo {
			.warningInfoItem {
				height: 2.3125rem;
				img {
					width: 3.75rem;
					height: 1.25rem;
					margin-right: 0.375rem;
				}
				.warningInfoItemTitle {
					font-family: 'AlibabaPuHuiTi-65';
					font-weight: 400;
					font-size: 0.875rem;
					color: #e3e9f3;
					left: 4.125rem;
					top: -0;
				}
				.warningInfoItemValue {
					font-family: 'AlibabaPuHuiTi-65';
					font-weight: 500;
					font-size: 0.875rem;
					right: 0;
					top: 0;
					text-align: right;
					color: #5cdaf5db;
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
					height: 13px;
				}
			}
		}
		.dbTable {
			box-sizing: border-box;
			.dbTableBody {
				height: calc(100% - 2.25rem);
				.dbTableRow {
					display: flex;
					align-items: center;
					justify-content: space-between;
					span {
						width: 25%;
						text-align: center;
						height: 30px;
						line-height: 30px;
					}
					.normal {
						color: rgba(89, 255, 255, 1);
					}
					.active {
						color: rgba(254, 188, 34, 1);
					}
				}
				.dbTableRow:nth-child(odd) {
					background-color: rgba(27, 76, 133, 0.5);
				}
			}
		}
	}
	.dbTableRowData {
		display: flex;
		align-items: center;
		justify-content: center;
		img {
			width: 16px;
			margin-right: 5px;
		}
	}
</style>
