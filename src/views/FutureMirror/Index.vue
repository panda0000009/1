<!-- 未来魔镜 -->
<template>
	<div class="pages">
		<Layout>
			<template #left>
				<div class="w-full h-full left">
					<SecondTile label="动态调控台" leftPadding="3.9375rem"></SecondTile>
					<div class="pl-[1.6875rem] pr-[0.4375rem]">
						<!-- 场景体系 -->
						<Arrowhead
							class="my-3"
							name="场景体系"
							direction="bottom"
							@directionChange="handleTitleToggle('scenario')"></Arrowhead>
						<div v-show="titleStates.scenario" class="scenario-section">
							<div class="scenario-tabs">
								<div
									v-for="(scenario, index) in scenarioList"
									:key="index"
									class="scenario-tab"
									:class="{ active: activeScenario === scenario.value }"
									@click="handleScenarioChange(scenario.value)">
									<img
										v-if="activeScenario === scenario.value"
										:src="getAssetsFile('target-4-cur')"
										alt=""
										class="scenario-tab-bg" />
									<img
										v-else
										:src="getAssetsFile('target-4')"
										alt=""
										class="scenario-tab-bg" />
									<span class="scenario-tab-text">{{ scenario.label }}</span>
								</div>
							</div>
							<div class="px-[20px]">
								<CustomSelect
									v-model="projectName"
									v-show="titleStates.project"
									:options="projectList"
									:footer="true"
									:isBg="false"
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
						</div>

						<!-- 选择目标 -->
						<Arrowhead
							class="my-3"
							name="选择目标"
							direction="bottom"
							@directionChange="handleTitleToggle('target')"></Arrowhead>
						<div v-show="titleStates.target" class="target-section">
							<div
								v-for="(target, index) in targetList"
								:key="index"
								class="target-item relative cursor-pointer"
								@click="handleTargetChange(target)">
								<div class="flex items-center">
									<img
										:src="diamond"
										alt=""
										class="w-[14px] h-[14px] mr-[8px]" />
									<span
										:class="[
											'indicator-label',
											{ active: activeTarget === target.value }
										]"
										>{{ target.label }}</span
									>
								</div>
							</div>
						</div>

						<!-- 选择指标 -->
						<Arrowhead
							class="my-3"
							name="选择指标"
							direction="bottom"
							@directionChange="handleTitleToggle('indicator')"></Arrowhead>
						<div v-show="titleStates.indicator" class="indicator-section">
							<!-- 指标类型 -->
							<div class="indicator-item">
								<div class="indicator-label-wrapper">
									<img :src="diamond" alt="" class="indicator-diamond-icon" />
									<span class="indicator-label">指标类型</span>
								</div>
								<CustomSelect
									v-model="activeLx"
									:options="lxList"
									placeholder="人口密度调控"
									:isBg="false"
									@select="indicatorTypeChangeHandle">
								</CustomSelect>
							</div>
							<!-- 具体指标 -->
							<div class="indicator-item mt-3">
								<div class="indicator-label-wrapper">
									<img :src="diamond" alt="" class="indicator-diamond-icon" />
									<span class="indicator-label">具体指标</span>
								</div>
								<CustomSelect
									v-model="activeZb"
									:options="zbList"
									placeholder="中心城区人口密度"
									:isBg="false"
									returnItem
									@select="zbChange">
								</CustomSelect>
							</div>
						</div>

						<!-- 选择单元、年份 -->
						<Arrowhead
							class="my-3"
							name="选择单元、年份"
							direction="bottom"
							@directionChange="handleTitleToggle('unitYear')"></Arrowhead>
						<div v-show="titleStates.unitYear" class="unit-year-section">
							<!-- 显示单元 -->
							<div class="indicator-item">
								<div class="indicator-label-wrapper">
									<img :src="diamond" alt="" class="indicator-diamond-icon" />
									<span class="indicator-label">选择单元</span>
								</div>
								<CustomSelect
									v-model="dyCurrent"
									:options="dyList"
									placeholder="街道"
									:isBg="false"
									@select="getRes">
								</CustomSelect>
							</div>
							<!-- 选择年份 -->
							<div class="indicator-item mt-3">
								<div class="indicator-label-wrapper">
									<img :src="diamond" alt="" class="indicator-diamond-icon" />
									<span class="indicator-label">选择年份</span>
								</div>
								<CustomSelect
									v-model="yearCurrent"
									:options="yearList"
									placeholder="2024年"
									:isBg="false"
									@select="getRes">
								</CustomSelect>
							</div>
						</div>

						<!-- 其他数据范围 -->
						<Arrowhead
							class="my-3"
							name="其他数据范围"
							direction="left"
							@directionChange="handleTitleToggle('vector')"></Arrowhead>
						<div v-show="titleStates.vector" class="vector-statistics-section">
							<div class="vector-table-container">
								<table :border="1" class="vector-table">
									<thead class="bg-[rgba(1,128,254,0.3686)] text-[#04ABFF]">
										<tr>
											<th style="text-align: center">项目空间数据名称</th>
											<th style="text-align: center" width="64px">显示</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(item, index) in vectorDataList" :key="index">
											<td>{{ item.name }}</td>
											<td style="width: 64px">
												<el-switch
													v-model="item.visible"
													@change="handleVectorToggle(item, index)" />
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<!-- 智能问答 -->
						<Arrowhead
							class="my-3"
							name="智能问答"
							direction="bottom"
							@directionChange="handleTitleToggle('summary')"></Arrowhead>
						<SummaryCom v-if="titleStates.summary"></SummaryCom>
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
						label="数据仪表盘"
						direction="right"
						rightPadding="5rem"></SecondTile>
					<div class="pl-[0.375rem] pr-8">
						<Arrowhead
							class="my-3"
							:name="'全市总体情况'"
							direction="left"
							:isChange="false" />
						<div
							class="yearChart bg-[#112e46] h-[9.3125rem] pt-4 px-[1.3125rem] pb-[1.3125rem]">
							<div class="yearChartItem">
								<div
									class="yearChartItemTitle flex items-center justify-center">
									<span>{{ baseYear + '年' }}</span>
								</div>
								<div
									ref="chartRef"
									style="width: 90%; height: 150px; margin-top: -50px"></div>
							</div>
							<div class="yearChartItem">
								<div
									class="yearChartItemTitle flex items-center justify-center">
									<span>{{ predictYear + '年' }}</span>
								</div>
								<div
									ref="chartRefRight"
									style="width: 90%; height: 150px; margin-top: -50px"></div>
							</div>
						</div>
						<Arrowhead
							class="my-3"
							:name="'中心外围情况'"
							direction="left"
							:isChange="false">
							<el-select
								v-model="selectedDistrict"
								placeholder="请选择查询区域"
								popper-class="my-popper"
								size="small"
								style="width: 5.9375rem; margin-right: 1.375rem"
								@change="districtSelectedChange">
								<el-option
									v-for="item in districtOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value" />
							</el-select>
						</Arrowhead>
						<div
							class="job-housing-chart bg-[#112e46] p-4 pb-2 relative h-[11.625rem]">
							<div
								class="chart-legend flex gap-2 absolute right-4 z-2 left-[60%]">
								<div class="legend-item flex items-center">
									<div class="legend-square warning"></div>
									<span class="legend-text">{{
										jobHousingChartOpt().series[0].name + ''
									}}</span>
								</div>
								<div class="legend-item flex items-center">
									<div class="legend-square safe"></div>
									<span class="legend-text">{{
										jobHousingChartOpt().series[1].name
									}}</span>
								</div>
							</div>
							<div style="width: 100%; height: 100%">
								<!-- TODO:1 -->
								<!-- <ECharts
									:option="jobHousingChartOpt()"
									:resize="false"></ECharts> -->
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
												<span style="color: #c4c4c4">{{ baseYear + '年' }}</span>
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
												<span style="color: #c4c4c4">{{ predictYear + '年' }}</span>
											</div>
										</div>
									</div>
									<!-- 图表容器 -->
									<div class="resultContentTitle">
										<div ref="chartRef1" style="width: 100%; height: 260px"></div>
									</div>
								</div>
							</div>
						</div>
						<Arrowhead
							class="my-3"
							name="区县镇街情况"
							direction="left"
							:isChange="false">
							<div class="flex items-center">
								<img
									class="cursor-pointer"
									src="@/assets/img/sort.png"
									width="20"
									alt=""
									@click="sortHande" />
								<el-select
									v-model="selectedDistrict2"
									placeholder="请选择查询区域"
									popper-class="my-popper"
									size="small"
									style="
										width: 5.9375rem;
										margin-left: 1.875rem;
										margin-right: 1.375rem;
									"
									@change="districtSelectedChange2">
									<el-option
										v-for="item in districtOptions2"
										:key="item.value"
										:label="item.label"
										:value="item.value" />
								</el-select>
							</div>
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
										<span style="color: #c4c4c4">{{ baseYear + '年' }}</span>
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
										<span style="color: #c4c4c4">{{ predictYear + '年' }}</span>
									</div>
								</div>
							</div>
							<!-- 图表容器 -->
							<div class="resultContentTitle">
								<div ref="chartRef1" style="width: 100%; height: 260px"></div>
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
	import cityApi from '@/api/index.js';
	import { useAppStore } from '@/stores/modules/app.js';
	const useStore = useAppStore();
	import ZbListCom from '@/components/lists/zbList.vue';
	import up from '@/assets/img/decisionTheater/up.png';
	import down from '@/assets/img/decisionTheater/down.png';
	import AddProject from '@/components/addProject/index.vue';
	import MaxMap from '@/components/mapView/maxMap.vue';
	import * as echarts from 'echarts';
	import ECharts from '@/components/eCharts/index.vue';
	import { getMatchedIndicators, getAssetsFile } from '@/utils/index.js';
	import diamond from '@/assets/img/diamond.png';
	import buildLayer, {
		LayerType
	} from '@/components/map/primitive/layer/Layer';
	import { useMapStore } from '@/stores/modules/map.js';
	const mapStore = useMapStore();
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
		scenario: true,
		target: true,
		indicator: true,
		unitYear: true,
		vector: false,
		summary: true
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

	// 选择项目的场景按钮
	const activeProjectScenario = ref('spatial');

	// 新增：场景体系
	const activeScenario = ref('spatial');
	const selectedScenario = ref('');
	const scenarioList = ref([
		{ value: 'spatial', label: '空间智优' },
		{ value: 'economy', label: '产业智兴' },
		{ value: 'livable', label: '宜居智享' },
		{ value: 'green', label: '绿美智绘' },
		{ value: 'resilient', label: '韧性智安' },
		{ value: 'heritage', label: '名城智护' },
		{ value: 'digital', label: '数字智治' }
	]);

	// 新增：选择目标
	const activeTarget = ref('');
	const targetList = ref([
		{
			value: 'population',
			label: '综合服务能力提升'
		},
		{
			value: 'function',
			label: '人口承载能力增强'
		},
		{
			value: 'core',
			label: '产业集群培育'
		}
	]);

	// 矢量范围与统计数据
	const vectorDataList = ref([
		{
			id: 'center',
			name: '中心城区范围',
			visible: false,
			url: 'http://192.168.225.8:6080/arcgis/rest/services/%E6%8E%A8%E6%BC%94%E6%95%B0%E6%8D%AE/%E7%A9%BA%E9%97%B4%E6%99%BA%E4%BC%98_%E5%85%B6%E4%BB%96%E7%9F%A2%E9%87%8F%E6%95%B0%E6%8D%AE/MapServer',
			layers: [5]
		},
		{
			id: 'country',
			name: '区县间OD',
			visible: false,
			url: 'http://192.168.225.8:6080/arcgis/rest/services/%E6%8E%A8%E6%BC%94%E6%95%B0%E6%8D%AE/%E7%A9%BA%E9%97%B4%E6%99%BA%E4%BC%98_%E5%85%B6%E4%BB%96%E7%9F%A2%E9%87%8F%E6%95%B0%E6%8D%AE/MapServer',
			layers: [2]
		},
		{
			id: 'street',
			name: '街道间OD',
			visible: false,
			url: 'http://192.168.225.8:6080/arcgis/rest/services/%E6%8E%A8%E6%BC%94%E6%95%B0%E6%8D%AE/%E7%A9%BA%E9%97%B4%E6%99%BA%E4%BC%98_%E5%85%B6%E4%BB%96%E7%9F%A2%E9%87%8F%E6%95%B0%E6%8D%AE/MapServer',
			layers: [3]
		},
		{
			id: 'smallschool',
			name: '小学800m',
			visible: false,
			url: 'http://192.168.225.8:6080/arcgis/rest/services/%E6%8E%A8%E6%BC%94%E6%95%B0%E6%8D%AE/%E7%A9%BA%E9%97%B4%E6%99%BA%E4%BC%98_%E5%85%B6%E4%BB%96%E7%9F%A2%E9%87%8F%E6%95%B0%E6%8D%AE/MapServer',
			layers: [1]
		},
		{
			id: 'hospital',
			name: '医院2000m',
			visible: false,
			url: 'http://192.168.225.8:6080/arcgis/rest/services/%E6%8E%A8%E6%BC%94%E6%95%B0%E6%8D%AE/%E7%A9%BA%E9%97%B4%E6%99%BA%E4%BC%98_%E5%85%B6%E4%BB%96%E7%9F%A2%E9%87%8F%E6%95%B0%E6%8D%AE/MapServer',
			layers: [0]
		},
		{
			id: 'middleschool',
			name: '中学1200m',
			visible: false,
			url: 'http://192.168.225.8:6080/arcgis/rest/services/%E6%8E%A8%E6%BC%94%E6%95%B0%E6%8D%AE/%E7%A9%BA%E9%97%B4%E6%99%BA%E4%BC%98_%E5%85%B6%E4%BB%96%E7%9F%A2%E9%87%8F%E6%95%B0%E6%8D%AE/MapServer',
			layers: [4]
		}
	]);

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
	// 柱状图
	const barData = ref([
		{
			name: '2024年',
			yearData: [
				{ label: '中心城区', value: 780.7 },
				{ label: '外围地区', value: 680.7 }
			]
		},
		{
			name: '2035年',
			yearData: [
				{ label: '中心城区', value: 1185.6 },
				{ label: '外围地区', value: 1385.6 }
			]
		}
	]);
	const jobHousingChartOpt = () => {
		let indicatorInfo = zbList.value.find(m => m.value == activeZb.value);
	  // 动态获取所有区域名称（从第一个年份数据中获取）
		const areas =
			barData.value.length > 0
				? barData.value[0].yearData.map(item => item.label)
				: ['中心城区', '外围地区'];

	  // 动态获取所有年份
		const years = barData.value.map(item => item.name);

	  // 根据数据项数量动态调整配置
		const areaCount = areas.length;
		const isManyItems = areaCount > 3;
	  const series = years.map((year, index) => {
			const data = areas.map(areaLabel => {
				const yearItem = barData.value.find(item => item.name === year);
				if (yearItem) {
					const areaItem = yearItem.yearData.find(
						item => item.label === areaLabel
					);
					return areaItem ? areaItem.value : 0;
				}
				return 0;
			});

			return {
				type: 'bar',
				barWidth: 39,
				name: index === 0 ? '规划调整前' : '规划调整后',
				data,
				itemStyle: {
					color: function (params) {
						// if (params.name === '外围地区' || params.name.includes('外围')) {
						if (year === '2035年' || params.name.includes('2035')) {
							return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#38B4DD' },
								{ offset: 1, color: '#264188' }
							]);
						} else {
							return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#BD3329' },
								{ offset: 1, color: '#F58F32' }
							]);
						}
					}
				},
				label: {
					show: true,
					position: 'top',
					formatter: '{c}', // + (selectedIndicatorInfo.value?.unit || ''),
					color: '#fff',
					fontSize: 12,
					fontFamily: 'AlibabaPuHuiTi-75'
				}
			};
		});

		return {
			tooltip: { trigger: 'axis' },
			// legend: {
			// 	data: ['规划调整前', '规划调整后'],
			// 	// top: 10,
			// 	right: 20,
			// 	textStyle: {
			// 		color: '#c4c4c4',
			// 		fontSize: 12
			// 	},
			// 	itemWidth: 12,
			// 	itemHeight: 8
			// },
			grid: {
				left: '3%',
				right: '3%',
				bottom: '5%',
				top: '18%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data: areas, // 动态使用区域数据
				axisLabel: {
					color: '#fff',
					fontSize: 12,
					fontFamily: 'SourceHanSansCN-Regular',
					margin: 12,
					rotate: 0,
					interval: 0 // 强制显示所有标签
				}
			},
			yAxis: {
				type: 'value',
				name:
					(indicatorInfo?.nodeName || '') +
					'(' +
					(indicatorInfo?.unit || '') +
					')',
				nameTextStyle: {
					color: '#B3C0CC',
					fontSize: 12,
					align: 'left',
					padding: [0, 0, 0, -30]
				},
				splitLine: {
					lineStyle: {
						color: '#35414C',
						type: 'dashed',
						width: 1
					}
				},
				axisLabel: {
					color: '#B3C0CC',
					fontSize: 14
				}
			},
			series,
			dataZoom: [
				{
					show: true,
					type: 'slider',
					start: 0,
					end: isManyItems ? 20 : 100,
					xAxisIndex: [0, 1],
					startValue: 0,
					left: '2%',
					right: '5%',
					bottom: 0,
					fillerColor: '#04A7FF',
					backgroundColor: '#062944',
					borderColor: '#062944',
					height: 8,
					handleSize: '0%',
					handleIcon:
						'path://M512,500m-430,0a448,448,0,1,0,896,0a448,448,0,1,0,-896,0Z',
					handleStyle: {
						borderWidth: 0,
						color: '#6B7388'
					},
					zoomLock: true,
					zoomOnMouseWheel: false,
					brushSelect: false,
					showDetail: false,
					showDataShadow: false
				}
			]
		};
	};
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
	const sortDirection = ref(false);
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
						formatter: '{value}' + unit
					},
					data: [{ value: value.toFixed(2) }]
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
						formatter: '{value}' + unit
					},
					data: [{ value: value.toFixed(2) }]
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
	const selectedDistrict = ref('中心外围');
	const districtOptions = ref([
		{ value: '中心外围', label: '中心外围' },
		{ value: '三核四极', label: '三核四极' }
	]);
	const selectedDistrict2 = ref('全部区县');
	const districtOptions2 = ref([
		{
			value: '全部区县',
			label: '全部区县'
		},
		{
			value: '全部街道',
			label: '全部街道'
		}
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
	const chartBarFn = indicatorInfo => {
		chartBar = echarts.init(chartRef1.value);
		const option = {
			backgroundColor: 'transparent',
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
				// name: unit,
				name: indicatorInfo.nodeName + '(' + indicatorInfo.unit + ')',
				nameTextStyle: {
					color: '#B3C0CC',
					fontSize: 14,
					align: 'left',
					padding: [0, 0, 0, 0]
				},
				splitLine: {
					lineStyle: {
						color: '#35414C',
						type: 'dashed',
						width: 1
					}
				},
				axisLabel: {
					color: '#B3C0CC',
					fontSize: 14
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
					show: true,
					type: 'slider',
					start: 0,
					end: 0,
					xAxisIndex: [0, 1],
					startValue: 0,
					left: '2%',
					right: '5%',
					bottom: 0,
					fillerColor: '#04A7FF',
					backgroundColor: '#062944',
					borderColor: '#062944',
					height: 8,
					handleSize: '0%',
					handleIcon:
						'path://M512,500m-430,0a448,448,0,1,0,896,0a448,448,0,1,0,-896,0Z',
					handleStyle: {
						borderWidth: 0,
						color: '#6B7388'
					},
					zoomLock: true,
					zoomOnMouseWheel: false,
					brushSelect: false,
					showDetail: false,
					showDataShadow: false
				}
			]
		};
		const zoomEnd = (3 / barChartData.value.districts.length) * 100;
		option.dataZoom[0].end = zoomEnd;
		chartBar.setOption(option);
		window.addEventListener('resize', () => chartBar.resize());
	};

	onMounted(async () => {
		handleScenarioChange('spatial')
		// getCatalogGetById('ZBC073');
		setTimeout(() => {
			handleVectorToggle(vectorDataList.value[0]);
		}, 1 * 1000);
	});
	onBeforeUnmount(() => {
		chart && chart.dispose();
		chartBar && chartBar.dispose();
		chartRight && chartRight.dispose();
	});

	// 获取项目列表
	const initProjects = async (bizType = 'TYYQ') => {
		try {
			const res = await cityApi.projectQueryWithPage({
				adminFlag: useStore.userInfo?.adminFlag || '1',
				current: 1,
				size: 3,
				endTime: '',
				startTime: '',
				eq_status: '3',
				eq_bizType: bizType,
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

	// 获取专题数据
	const getCatalogGetById = async id => {
		try {
			const res = await cityApi.catalogGetById({
				catalogId: id
			});
			if (res.resultCode === 'S' && res.data?.tree.length) {
				// 选择目标
				targetList.value = res.data.tree[0].children.map(m => {
					return Object.assign(m, {
						value: m.nodeId,
						label: m.nodeName,
						data: m
					});
				});
				handleTargetChange(targetList.value[0].data);
			}
		} catch (error) {
			console.error('查询城市推演项目记录信息失败:', error);
		}
	};

	// 专门获取指标树接口
	const getZb = async () => {
		try {
			const res = await cityApi.resultTree({
				current: 1,
				size: 1000,
				projectType: 'MAIN',
				array_indicatorId: '',
				eq_indicatorId: '', // 指标ID
				eq_projectId: projectName.value, // 推演项目ID
				eq_predictYear: yearCurrent.value, // 目标年份
				eq_regionLevel: '', // dyCurrent.value, // 行政区级别，全市、区县、街道、网格
				eq_xzqdm: '', // 行政区代码
				like_indicatorName: '' // 指标名称
			});
			if (res.resultCode === 'S') {
				// 选择目标
				targetList.value = res.data[0].children.map(m => {
					return Object.assign(m, {
						value: m.nodeId,
						label: m.nodeName,
						data: m
					});
				});
				handleTargetChange(targetList.value[0].data);
				// if (res.data?.length > 0) {
				// 	planningWarningTopicInfos.value = [];
				// 	res.data.forEach(item => {
				// 		planningWarningTopicInfos.value.push({
				// 			...item,
				// 			label: item.nodeName,
				// 			disabled: item?.citySPSFlag
				// 		});
				// 	});
				// 	// 初始化专题选项
				// 	const indicatorIds =
				// 		projectList.value.find(n => n.value == projectName.value)
				// 			?.indicatorIds || '';
				// 	const tree = getMatchedIndicators(
				// 		planningWarningTopicInfos.value,
				// 		indicatorIds,
				// 		'nodeId'
				// 	);
				// 	planningWarningTopicList.value = tree.map(m => {
				// 		return { ...m, nodeName: m.nodeName.replace('专题', '') };
				// 	});
				// 	activeZt.value = planningWarningTopicList.value[0]?.nodeId || '';
				// 	if (activeZt.value) {
				// 		handleWarningTopicChange();
				// 	}
				// }
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
				eq_regionLevel: '', // dyCurrent.value,
				eq_xzqdm: '',
				like_indicatorName: '',
				projectType: 'MAIN',
				current: 0,
				size: 10
			});
			if (res.resultCode === 'S') {
				mirrorData.value = res.data;
				// indicatorSummary.value = res.data?.summary || '';
				// let projInfo = list.value.find(n => n.id == projectName.value);
				// // 根据数据进行排序
				// sortDirection.value = false;
				// sortHande();

				// // 查询年份
				// baseYear.value = projInfo.baseYear;
				predictYear.value = yearCurrent.value;

				// // 分区情况描述统计标题
				let indicatorInfo = zbList.value.find(m => m.value == activeZb.value);
				// resultContentTitle.value = `各${dyCurrent.value}${
				// 	indicatorInfo?.label || ''
				// }(${indicatorInfo?.unit})`;

				// // 指标总体变化
				// indicatorChangeSummary.value = `${indicatorInfo?.label}总体变化(${indicatorInfo?.unit})`;

				// 指标详情查询
				// barChartData.value = {
				// 	districts: res.data.indicatorData.map(n => n.xzqmc),
				// 	afterProject: res.data.indicatorData.map(n => {
				// 		return (
				// 			indicatorInfo?.unit == '%' ? n.monitorValue * 100 : n.monitorValue
				// 		).toFixed(2);
				// 	}),
				// 	beforeProject: res.data.indicatorData.map(n => {
				// 		return (
				// 			indicatorInfo?.unit == '%' ? n.predictValue * 100 : n.predictValue
				// 		).toFixed(2);
				// 	})
				// };
				// (districtOptions.value = res.data.indicatorData.map(n => {
				// 	return { value: n.xzqdm, label: n.xzqmc };
				// })),
				// 	districtOptions.value.unshift({ value: 'all', label: '全部' });

				districtSelectedChange();
				districtSelectedChange2();

				let cityItem = res.data.indicatorData.find(
					m => m.regionLevel == '全市'
				);
				if (cityItem) {
					// 渲染指标总体变化
					predictYear.value = cityItem.predictYear
					chartFn(cityItem.monitorValue, indicatorInfo?.unit);
					chartRightFn(cityItem.predictValue, indicatorInfo?.unit);
				}
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

	// 选择项目的场景按钮选择
	// 场景体系选择
const handleScenarioChange = async value => {
		console.log('value',value)
		// 根据场景更新相关数据
		// getCatalogGetById('ZBC053');
		if (value == 'spatial') {
			activeScenario.value = value;
			await initProjects('TYYQ');
		}
		if (value == 'economy') {
			activeScenario.value = value;
			await initProjects('TYYQ_CYZX');
		}
	};

	// 选择目标
	const handleTargetChange = value => {
		activeTarget.value = value.value;
		// 根据目标更新相关数据
		lxList.value = targetList.value
			.find(m => m.value == value.value)
			.children.map(m => {
				return {
					...m,
					value: m.nodeId,
					label: m.nodeName
				};
			});
		lxList.value = lxList.value.filter(m => m.children?.length > 0);
		activeLx.value = lxList.value[0]?.value;
		indicatorTypeChangeHandle(lxList.value[0]?.value);
	};

	// 矢量范围显示切换
	const handleVectorToggle = (item, index) => {
		// 这里可以添加地图图层显示/隐藏的逻辑
		if (mapStore?.activeMap?.lyrManager?.getLayer(item.id)) {
			mapStore?.activeMap?.lyrManager.removeLayer(item.id);
		} else {
			item.visible = true;
			let baseLyr3 = buildLayer(LayerType.ArcGISRest, {
				name: item.id,
				url: item.url,
				layers: item.layers,
				zIndex: 100
			});
			if (!baseLyr3) {
				throw new Error('initialize base layer failed');
			}
			baseLyr3.ol.set('lyrName', item.id);
			mapStore?.activeMap?.lyrManager.addLayer(item.id, baseLyr3);
		}
	};

	const handleProjectScenarioChange = value => {
		activeProjectScenario.value = value;
		// 根据场景更新项目列表或相关数据
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
				// dyCurrent.value = dyList.value[0].value;
				dyCurrent.value = '区县';
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
		// sortDirection.value = !sortDirection.value;
		// if (mirrorData.value.indicatorData?.length) {
		// 	let vals = mirrorData.value.indicatorData;
		// 	if (sortDirection.value) {
		// 		// 升序
		// 		vals = [...mirrorData.value.indicatorData].sort(
		// 			(a, b) => b.changeRate - a.changeRate
		// 		);
		// 	} else {
		// 		// 降序
		// 		vals = [...mirrorData.value.indicatorData].sort(
		// 			(a, b) => a.changeRate - b.changeRate
		// 		);
		// 	}
		// 	let indicatorInfo = zbList.value.find(m => m.value == activeZb.value);
		// 	trafficData.value = vals.slice(0, 5).map(n => {
		// 		return {
		// 			name: n.xzqmc,
		// 			time: (n.predictValue * 100).toFixed(2) + `${indicatorInfo.unit}`,
		// 			trend: n.changeRate >= 0 ? 'up' : 'down',
		// 			percentage: (n.changeRate * 100).toFixed(2) + '%'
		// 		};
		// 	});
		// }

		districtSelectedChange2();
	};

	// 指标详情查询，切换行政区划
	const districtSelectedChange = () => {
		if (selectedDistrict.value) {
			let datas = mirrorData.value.indicatorData;
			let filterDatas = datas.filter(
				m => m.regionLevel == selectedDistrict.value
			);

			barData.value = [
				{
					name: baseYear.value + '年',
					yearData: filterDatas.map(m => {
						return { label: m.xzqmc, value: m.monitorValue.toFixed(2) };
					})
				},
				{
					name: predictYear.value + '年',
					yearData: filterDatas.map(m => {
						return { label: m.xzqmc, value: m.predictValue.toFixed(2) };
					})
				}
			];

			let indicatorInfo = zbList.value.find(n => n.value == activeZb.value);
			jobHousingChartOpt(indicatorInfo);
		}
	};

	// 指标详情查询，切换行政区划
	const districtSelectedChange2 = () => {
		sortDirection.value = !sortDirection.value;

		let datas = mirrorData.value.indicatorData;
		let level = selectedDistrict2.value.replace('全部', '');
		let filterDatas = datas.filter(m => m.regionLevel == level);

		let vals = filterDatas;
		if (sortDirection.value) {
			// 升序
			vals = [...filterDatas].sort((a, b) => b.predictValue - a.predictValue);
		} else {
			// 降序
			vals = [...filterDatas].sort((a, b) => a.predictValue - b.predictValue);
		}

		let indicatorInfo = zbList.value.find(m => m.value == activeZb.value);
		barChartData.value = {
			districts: vals.map(n => n.xzqmc),
			afterProject: vals.map(n => {
				return (
					indicatorInfo?.unit == '%' ? n.monitorValue * 1 : n.monitorValue
				).toFixed(2);
			}),
			beforeProject: vals.map(n => {
				return (
					indicatorInfo?.unit == '%' ? n.predictValue * 1 : n.predictValue
				).toFixed(2);
			})
		};
		chartBarFn(indicatorInfo);
	};
</script>

<style lang="scss" scoped>
	.left {
		.target-section {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 12px;
			margin-bottom: 12px;
			background: rgba(17, 46, 70, 0.8);
			padding: 11px;
			border-radius: 4px;
		}

		.indicator-label {
			color: #fff;
			font-size: 20px;
			font-family: 'YouSheBiaoTiHei';
			&.active {
				color: #f5e74f;
			}
		}

		.indicator-section {
			margin-bottom: 12px;
			background: rgba(17, 46, 70, 0.8);
			padding: 12px 16px;

			.indicator-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 12px;

				.indicator-label-wrapper {
					display: flex;
					align-items: center;
					gap: 8px;
					flex-shrink: 0;

					.indicator-diamond-icon {
						width: 14px;
						height: 14px;
						object-fit: contain;
						flex-shrink: 0;
					}

					.indicator-label {
						color: #fff;
						font-size: 20px;
						font-family: 'YouSheBiaoTiHei';
					}
				}

				:deep(.customSelect) {
					flex: 1;

					.el-select {
						width: 100%;
					}
				}
			}
		}

		.unit-year-section {
			margin-bottom: 12px;
			background: rgba(17, 46, 70, 0.8);
			padding: 12px 16px;

			.indicator-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 12px;

				.indicator-label-wrapper {
					display: flex;
					align-items: center;
					gap: 8px;
					flex-shrink: 0;

					.indicator-diamond-icon {
						width: 14px;
						height: 14px;
						object-fit: contain;
						flex-shrink: 0;
					}

					.indicator-label {
						color: #fff;
						font-size: 20px;
						font-family: 'YouSheBiaoTiHei';
					}
				}

				:deep(.customSelect) {
					flex: 1;

					.el-select {
						width: 100%;
					}
				}
			}
		}

		.vector-statistics-section {
			margin-bottom: 12px;

			.vector-table-container {
				.vector-table {
					width: 100%;
					border-collapse: collapse;
					border: 0.5px solid rgba(4, 171, 255, 0.2784);

					thead {
						tr {
							th {
								color: #7edcfb;
								text-align: left;
								padding: 8px 12px;
								border-bottom: 1px solid rgba(0, 246, 255, 0.3);
								font-family: 'AlibabaPuHuiTi-75';
								font-size: 16px;
								text-align: center;
							}
						}
					}

					tbody {
						tr {
							&:not(:last-child) {
								border-bottom: 1px solid rgba(0, 246, 255, 0.1);
							}

							td {
								color: #fff;
								padding: 10px 12px;
								font-family: 'SourceHanSansCN-Regular';
								background: rgba(1, 128, 254, 0.16);
								text-align: center;
								font-family: 'AlibabaPuHuiTi-55';
								font-weight: 400;
								font-size: 16px;
							}
						}
					}
				}
			}
		}

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
		.yearChart {
			display: flex;
			.yearChartItem {
				width: 50%;
				.yearChartItemTitle {
					span {
						width: 116px;
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

		& .legend-square {
			width: 6px;
			height: 6px;
			&.safe {
				background-color: #06a5ff;
			}

			&.warning {
				background-color: #e2702f;
			}

			&.danger {
				background-color: #ff0c10;
			}
		}
		& .legend-text {
			margin-left: 4px;
			font-family: 'AlibabaPuHuiTi-65';
			font-weight: 500;
			font-size: 10px;
			line-height: 20px;
			color: #809aab;
		}
	}

	// 矢量范围与统计表格中的开关样式
	.vector-table-container {
		:deep(.el-switch) {
			width: 40px;
			height: 20px;

			.el-switch__core {
				width: 40px !important;
				height: 20px !important;
				background-color: rgb(220, 223, 230) !important;
				border: 1px solid rgba(0, 246, 255, 0.8) !important;
				border-radius: 10px !important;

				&::after {
					width: 16px !important;
					height: 16px !important;
					background-color: #fff !important;
					border: 2px solid rgba(0, 246, 255, 0.8) !important;
					border-radius: 50% !important;
					left: 2px !important;
				}
			}

			&.is-checked {
				.el-switch__core {
					background-color: rgba(156, 39, 176, 0.8) !important;

					&::after {
						left: calc(100% - 18px) !important;
					}
				}
			}
		}
	}
</style>
