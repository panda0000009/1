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
									@select="regionSelectedHandle">
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
							name="全市总体情况"
							direction="left"
							:isChange="false" />
						<div
							class="yearChart bg-[#112e46] h-[9.3125rem] pt-4 px-[1rem] pb-[1.3125rem]">
							<div class="yearChartItem">
								<div
									class="yearChartItemTitle flex items-center justify-center">
									<span>{{ baseYear }}年</span>
								</div>
								<div
									class="yearChartItemTitle flex items-center justify-center mt-[6px]">
									<span>{{ unitInfo }}</span>
								</div>
							</div>
							<div style="width: calc(100% - 1rem)">
								<div
									ref="chartRef"
									style="
										width: 90%;
										height: 150px;
										margin-top: -34px;
										margin-left: 20px;
									"></div>
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
						<div class="yearChart w-full bg-[#112e46]">
							<div class="w-full h-[12.3125rem]">
								<!-- <pieThird
									:optionsData="pieThirdOptions"
									:legend="pieLegendConfig" /> -->
									<ECharts :option="chartBarFn2()" :resize="false"></ECharts>
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
							<div class="resultContentTitle">
								<div style="width: 100%; height: 260px">
									<ECharts :option="chartBarFn()" :resize="false"></ECharts>
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
	import { computed } from 'vue';
	import cityApi from '@/api/index.js';
	import { useAppStore } from '@/stores/modules/app.js';
	const useStore = useAppStore();
	import AddProject from '@/components/addProject/index.vue';
	import MaxMap from '@/components/mapView/maxMap.vue';
	import * as echarts from 'echarts';
	import ECharts from '@/components/eCharts/index.vue';
	import { getMatchedIndicators, getAssetsFile } from '@/utils/index.js';
	import up from '@/assets/img/decisionTheater/up.png';
	import down from '@/assets/img/decisionTheater/down.png';
	import diamond from '@/assets/img/diamond.png';
	import pieThird from '@/views/citySpaceRadar/components/pieThird.vue';
	import buildLayer, {
		LayerType
	} from '@/components/map/primitive/layer/Layer';
	import { useMapStore } from '@/stores/modules/map.js';
	const mapStore = useMapStore();

	// 图表引用
	const chartRef = ref(null);
	const chartRef1 = ref(null);
	const chartRefRight = ref(null); // 年份对比第二个图表
	let chartRight = null; // 年份对比第二个图表
	let chart = null;
	let chartBar = null;
	const maxMapRef = ref(null);
	const modelValue = ref(false);
	const btnType = ref('');
	const pieThirdOptions = ref([]); // 统一初始化为空数组

	// 根据数据项数量动态调整图例配置，避免图例挡住饼图
	const pieLegendConfig = computed(() => {
		const dataCount = pieThirdOptions.value.length;
		// 当数据项较多时（如三核四极有7项），需要调整图例位置
		const isManyItems = dataCount > 3;
		const isVeryManyItems = dataCount > 5;

		if (isVeryManyItems) {
			// 数据项很多时：图例移到更下方，缩小字体和间距，避免挡住饼图
			return {
				bottom: 5, // 移到更下方，避免挡住饼图
				left: 'center',
				orient: 'horizontal',
				itemGap: 6, // 缩小间距，让图例更紧凑
				itemWidth: 10,
				itemHeight: 6,
				textStyle: {
					color: '#ACDAF1',
					fontSize: 9 // 缩小字体
				}
			};
		} else if (isManyItems) {
			// 数据项较多时：图例移到更下方，缩小间距
			return {
				bottom: 8,
				left: 'center',
				orient: 'horizontal',
				itemGap: 10,
				textStyle: {
					color: '#ACDAF1',
					fontSize: 10
				}
			};
		} else {
			// 数据项少时：使用默认配置
			return {
				bottom: 10,
				left: 'center',
				orient: 'horizontal',
				itemGap: 20
			};
		}
	});

	// 数据状态
	const baseYear = ref(2024);
	const predictYear = ref(2030);
	const projectName = ref('');
	const list = ref([]);
	const projectList = ref([{ value: '0', label: '新建推演项目' }]);
	const dyCurrent = ref('区县');
	const dyList = ref([
		{ value: '区县', label: '区县' },
		{ value: '街道', label: '街道' },
		{ value: '网格', label: '网格' }
	]);
	const yearCurrent = ref('2024');
	const yearList = ref([
		{ value: '2024', label: '2024年' },
		{ value: '2030', label: '2030年' },
		{ value: '2035', label: '2035年' }
	]);
	const activeLx = ref('');
	const lxList = ref([]);
	const activeZb = ref('');
	const zbList = ref([]);
	const indicatorChangeSummary = ref('人口密度总体情况 (人/平方公里)');
	const activeZt = ref('');
	const planningWarningTopicList = ref([]);
	const planningWarningTopicInfos = ref([]);
	const mirrorData = ref(null);
	const selectedDistrict = ref('中心外围');
	const selectedIndicatorInfo = ref(null);

	const districtOptions = ref([
		{
			value: '中心外围',
			label: '中心外围'
		},
		{
			value: '三核四极',
			label: '三核四极'
		}
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
		districts: [],
		afterProject: [],
		beforeProject: []
	});
	const sortDirection = ref(false);
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

	const unitInfo = ref('%');
	// 选择项目的场景按钮
	const activeProjectScenario = ref('spatial');
	const scenarioOptions = ref([
		{ value: '1', label: '中心城区发展能级提升场景' },
		{ value: '2', label: '增强外围地区的功能培育场景' },
		{ value: '3', label: '提升外围地区与中心城区的直连能力场景' },
		{ value: '4', label: '增强重点地区功能场景' },
		{ value: '5', label: '区域协同场景' }
	]);

	// 新增：选择目标
	const activeTarget = ref('');
	const targetList = ref([
		{
			value: 'population',
			label: '人口承载能力增强'
		},
		{
			value: 'function',
			label: '综合服务功能提升'
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

	// 统计弹窗相关
	const statisticsForm = ref({
		range: '',
		indicator: '',
		method: ''
	});
	const statisticsRangeOptions = ref([
		{ value: 'center', label: '中心城区范围' },
		{ value: 'outer', label: '外围地区范围' }
	]);
	const statisticsIndicatorOptions = ref([
		{ value: 'population', label: '中心城区人口密度' }
	]);
	const statisticsMethodOptions = ref([
		{ value: 'sum,avg,count', label: '总和、平均值、计数' },
		{ value: 'sum', label: '总和' },
		{ value: 'avg', label: '平均值' },
		{ value: 'count', label: '计数' }
	]);
	const statisticsResultList = ref([]);

	// 统一管理所有Title组件的状态
	const titleStates = ref({
		project: true,
		scenario: true,
		target: true,
		indicator: true,
		unitYear: true,
		vector: false,
		summary: true,
		statisticsSelect: true,
		statisticsResult: true
	});

	// 处理Title组件的切换事件
	const handleTitleToggle = key => {
		titleStates.value[key] = !titleStates.value[key];
	};

	// 场景体系选择
	const handleScenarioChange = async value => {
		// 根据场景更新相关数据
		if (value == 'spatial') {
			activeScenario.value = value;
			await initProjects();
		}
		if (value == 'economy') {
			activeScenario.value = value;
			await initProjects('DTJC_CYZX')
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

	// 选择项目的场景按钮选择
	const handleProjectScenarioChange = value => {
		activeProjectScenario.value = value;
		// 根据场景更新项目列表或相关数据
	};

	// 目标选择
	const handleTargetChange = value => {
		activeTarget.value = value.nodeId;
		// 根据目标更新相关数据
		lxList.value = value.children.map(m => {
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

	// 年份对比第一个图表（码表）
	const chartFn = (value = 5100000, unit = '人') => {
		if (!chartRef.value) return;
		if (chart) {
			chart.dispose();
			chart = null;
		}
		chart = echarts.init(chartRef.value);
		const option = {
			backgroundColor: 'transparent',
			series: [
				{
					type: 'gauge',
					startAngle: 180,
					endAngle: 0,
					center: ['50%', '100%'], // 半圆位置
					radius: '120%',
					min: 0,
					max: unit == '%' ? value : value * (Math.random() * 0.7 + 1), // value * (Math.random() * 0.7 + 1),
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
						fontSize: 18,
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
		if (!chartRefRight.value) return;
		if (chartRight) {
			chartRight.dispose();
			chartRight = null;
		}
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
	// 柱状图
	const chartBarFn = (unit = '%') => {
		let defaultOpt = {
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
				right: '3%',
				bottom: '5%',
				top: '15%',
				containLabel: true
			},
			xAxis: [
				{
					type: 'category',
					data: [],
					axisLabel: { rotate: 0, color: '#B3C0CC', fontSize: 12 },
					axisLine: { lineStyle: { color: '#04A7FF' } },
					axisTick: { alignWithLabel: true },
					z: 2
				},
				{
					type: 'category',
					data: [],
					axisLine: { show: false },
					axisTick: { show: false },
					axisLabel: { show: false },
					splitLine: { show: false },
					position: 'bottom',
					offset: 0,
					z: 1
				}
			],
			yAxis: {
				type: 'value',
				name:
					(selectedIndicatorInfo.value?.nodeName || '') +
						'(' +
						(selectedIndicatorInfo.value?.unit || '') +
						')' || '人口数量(万人)',
				nameTextStyle: {
					color: '#B3C0CC',
					fontSize: 14,
					align: 'left',
					padding: [0, 0, 10, 0]
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
					name: '背景',
					type: 'bar',
					xAxisIndex: 1,
					barWidth: 38,
					data: [],
					showBackground: false,
					itemStyle: {
						color: 'rgba(108,130,151, 0.1)',
						borderRadius: 4
					},
					tooltip: { show: false },
					label: { show: false },
					z: 1
				},
				{
					type: 'bar',
					xAxisIndex: 0,
					barWidth: 14,
					data: [27, 18, 13, 17, 15],
					showBackground: false,
					itemStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: '#15b1ff' },
							{ offset: 0.02, color: '#15b1ff' },
							{ offset: 0.02, color: 'rgba(0, 85, 255, 0.0001)' },
							{ offset: 0.03, color: 'rgba(0, 85, 255, 0.0001)' },
							{ offset: 1, color: '#0783fa' }
						]),
						borderWidth: 0
					},
					backgroundStyle: {
						color: 'rgba(108, 130, 151, 0.1)'
					},
					z: 2
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

		if (barChartData.value.afterProject === 0) {
			return defaultOpt;
		}
		const zoomEnd = (3 / barChartData.value.districts.length) * 100;
		defaultOpt.xAxis[0].data = barChartData.value.districts;
		defaultOpt.xAxis[1].data = barChartData.value.districts;
		const bgArr = barChartData.value.afterProject;
		defaultOpt.series[0].data = new Array(bgArr.length).fill(
			Math.ceil(Math.max(...bgArr) / 5) * 5
		);
		defaultOpt.series[1].data = bgArr;
		defaultOpt.dataZoom[0].end = zoomEnd;

		return defaultOpt;
	};

	// 监听单元变化
	watch(
		() => dyCurrent.value,
		v => {
			if (v) {
				nextTick(() => {
					if (maxMapRef.value) {
						// maxMapRef.value.addLyrToMap(dyCurrent.value);
					}
				});
			}
		},
		{ immediate: true }
	);

	// 获取项目列表
	const initProjects = async (bizType = 'DTJC') => {
		try {
			const res = await cityApi.projectQueryWithPage({
				adminFlag: useStore.userInfo?.adminFlag || '1',
				current: 1,
				size: 3,
				endTime: '',
				startTime: '',
				eq_status: '3',
				like_name: '',
				eq_bizType: bizType,
				loginUser: useStore.userInfo?.username || ''
			});
			if (res.resultCode === 'S') {
				const data = res.data || [];
				list.value = data.filter(item => item.status === '3');
				let firstItem = JSON.parse(JSON.stringify(projectList.value[0]));
				projectList.value = list.value.map(m => {
					return { value: m.id, label: m.name, indicatorIds: m.indicatorIds };
				});
				projectList.value.unshift(firstItem);
				projectName.value = projectList.value[1]?.value || '';
				if (projectName.value) {
					handleProjectChange(projectName.value);
				}
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
				eq_indicatorId: '',
				eq_projectId: projectName.value,
				eq_predictYear: yearCurrent.value,
				eq_regionLevel: '',
				eq_xzqdm: '',
				like_indicatorName: ''
			});
			if (res.resultCode === 'S') {
				if (res.data?.length > 0) {
					targetList.value = res.data[0].children.map(m => {
					return Object.assign(m, {
						value: m.nodeId,
						label: m.nodeName,
						data: m
					});
				});
				handleTargetChange(targetList.value[0].data);
					// planningWarningTopicInfos.value = [];
					// res.data.forEach(item => {
					// 	planningWarningTopicInfos.value.push({
					// 		...item,
					// 		label: item.nodeName,
					// 		disabled: item?.citySPSFlag
					// 	});
					// });
					// const indicatorIds =
					// 	projectList.value.find(n => n.value == projectName.value)
					// 		?.indicatorIds || '';
					// const tree = getMatchedIndicators(
					// 	planningWarningTopicInfos.value,
					// 	indicatorIds,
					// 	'nodeId'
					// );
					// planningWarningTopicList.value = tree.map(m => {
					// 	return { ...m, nodeName: m.nodeName.replace('专题', '') };
					// });
					// activeZt.value = planningWarningTopicList.value[0]?.nodeId || '';
					// if (activeZt.value) {
					// 	handleWarningTopicChange();
					// }
				}
			}
		} catch (error) {
			console.error('专门获取指标树接口:', error);
		}
	};

	// 最后获取结果接口
	const getRes = async () => {
		// 在请求后端数据时开始显示 loading
		if (maxMapRef.value) {
			maxMapRef.value.setMapLoading(true);
		}
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
				// let projInfo = list.value.find(n => n.id == projectName.value);
				// baseYear.value = projInfo?.baseYear || 2024;
				// predictYear.value = yearCurrent.value;

				let indicatorInfo = zbList.value.find(m => m.value == activeZb.value);
				selectedIndicatorInfo.value = indicatorInfo;
				// indicatorChangeSummary.value = `${
				// 	indicatorInfo?.label || '指标总体变化'
				// }总体变化(${indicatorInfo?.unit || ''})`;

				// // 根据数据进行排序
				// sortDirection.value = false;
				// sortHande();

				// // 指标详情查询 - 只显示当前年份的数据
				// barChartData.value = {
				// 	districts: res.data.indicatorData.map(n => n.xzqmc),
				// 	afterProject: res.data.indicatorData.map(n => {
				// 		// 根据当前选择的年份显示对应数据
				// 		const value =
				// 			yearCurrent.value == baseYear.value
				// 				? n.monitorValue
				// 				: n.predictValue;
				// 		return (indicatorInfo?.unit == '%' ? value * 100 : value).toFixed(
				// 			2
				// 		);
				// 	}),
				// 	beforeProject: [] // 不再使用，保留以兼容
				// };
				// districtOptions.value = res.data.indicatorData.map(n => {
				// 	return { value: n.xzqdm, label: n.xzqmc };
				// });
				// districtOptions.value.unshift({ value: 'all', label: '全部区县' });

				// 渲染指标总体变化
				// chartRightFn(res.data.totalPredictValue, indicatorInfo?.unit);

				let city = res.data.indicatorData.find(m => m.regionLevel == '全市');
				if (city) {
					unitInfo.value = indicatorInfo?.unit;
					chartFn(city.predictValue, indicatorInfo?.unit);
				}
				districtSelectedChange();
				districtSelectedChange2();
				// 渲染地图
				if (maxMapRef.value) {
					let datas = res.data.indicatorData
						.filter(m => m.regionLevel == dyCurrent.value)
						.map(m => {
							return {
								predictValue: m.predictValue,
								xzqdm: m.xzqdm,
								xzqmc: m.xzqmc,
								region: dyCurrent.value,
								indicatorInfo,
								predictYear: yearCurrent.value,
								calculateResult: Object.assign(m, {
									module: 'DynamicMonitor',
									unit: indicatorInfo?.unit || ' '
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
									module: 'DynamicMonitor',
									unit: indicatorInfo?.unit || ' '
								}
							}
						];
					}
					maxMapRef.value.renderDatasToMap(dyCurrent.value, datas);
				}
			}
		} catch (error) {
			if (maxMapRef.value) {
				maxMapRef.value.setMapLoading(false);
			}
		}
		if (maxMapRef.value) {
			maxMapRef.value.setMapLoading(false);
		}
	};

	// 按变化率升序或降序
	const sortHande = () => {
		districtSelectedChange2();
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
				dyList.value = projInfo.rangeType.split(',').map(m => {
					return { value: m, label: m };
				});
				// dyCurrent.value = dyList.value[0].value;
				dyCurrent.value = '区县';
				yearList.value = projInfo.predictYear.split(',').map(m => {
					return { value: m, label: m + '年' };
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
		lxList.value = lxList.value.filter(m => m.children?.length > 0);
		activeLx.value = lxList.value[0]?.value;
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

	const regionSelectedHandle = () => {
		dyCurrent.value;
		getRes();
	};

	// 指标选择事件
	const zbChange = item => {
		activeZb.value = item.value;
		getRes();
	};


	// 饼图数据
	const pieChartData = ref([]);

	// 饼状图配置函数
	const chartBarFn2 = () => {
		// 如果没有数据，返回空配置
		if (!pieChartData.value || pieChartData.value.length === 0) {
			return {
				backgroundColor: 'transparent',
				tooltip: {
					trigger: 'item',
					backgroundColor: 'rgba(0, 0, 0, 0.8)',
					borderColor: '#00f6ff',
					borderWidth: 1,
					textStyle: {
						color: '#fff',
						fontSize: 12
					},
					formatter: '{b}: {c} ({d}%)'
				},
				legend: {
					show: false
				},
				series: []
			};
		}

		// 自定义颜色数组 - 使用渐变色
		const customColors = [
			new echarts.graphic.LinearGradient(0, 0, 0, 1, [
				{ offset: 0, color: '#3FA4FF' },
				{ offset: 1, color: '#1E5FA8' }
			]),
			new echarts.graphic.LinearGradient(0, 0, 0, 1, [
				{ offset: 0, color: '#60F5FF' },
				{ offset: 1, color: '#2E9FC4' }
			]),
			new echarts.graphic.LinearGradient(0, 0, 0, 1, [
				{ offset: 0, color: 'RGBA(69, 252, 219, 0.4)' },
				{ offset: 1, color: 'RGBA(69, 252, 219, 0.8)' }
			]),
			new echarts.graphic.LinearGradient(0, 0, 0, 1, [
				{ offset: 0, color: 'RGBA(168, 255, 135, 0.4)' },
				{ offset: 1, color: 'RGBA(168, 255, 135, 0.8)' }
			]),
			new echarts.graphic.LinearGradient(0, 0, 0, 1, [
				{ offset: 0, color: 'RGBA(255, 203, 33, 0.4)' },
				{ offset: 1, color: 'RGBA(255, 203, 33, 0.8)' }
			]),
			new echarts.graphic.LinearGradient(0, 0, 0, 1, [
				{ offset: 0, color: 'RGBA(255, 161, 53, 0.4)' },
				{ offset: 1, color: 'RGBA(255, 161, 53, 0.8)' }
			]),
			new echarts.graphic.LinearGradient(0, 0, 0, 1, [
				{ offset: 0, color: 'RGBA(254, 35, 10, 0.4)' },
				{ offset: 1, color: 'RGBA(254, 35, 10, 0.8)' }
			]),
			new echarts.graphic.LinearGradient(0, 0, 0, 1, [
				{ offset: 0, color: 'RGBA(0, 144, 254, 0.4)' },
				{ offset: 1, color: 'RGBA(0, 144, 254, 0.8)' }
			])
		];

		// 准备饼图数据
		const seriesData = pieChartData.value.map((item, index) => ({
			value: item.value,
			name: item.name,
			itemStyle: {
				color: customColors[index % customColors.length]
			}
		}));

		// 获取单位信息
		const unit = selectedIndicatorInfo.value?.unit || '';

		return {
			backgroundColor: 'transparent',
			tooltip: {
				trigger: 'item',
				backgroundColor: 'rgba(0, 0, 0, 0.85)',
				borderColor: '#00f6ff',
				borderWidth: 1,
				padding: [8, 12],
				textStyle: {
					color: '#fff',
					fontSize: 12,
					fontFamily: 'AlibabaPuHuiTi-55'
				},
				formatter: (params) => {
					const { name, value, percent } = params;
					// 格式化数值显示
					const formattedValue = typeof value === 'number'
						? value.toFixed(2)
						: value;
					return `${name}<br/>数值: ${formattedValue}${unit}<br/>占比: ${percent}%`;
				}
			},
			legend: {
				show: true,
				orient: 'vertical',
				right: '3%',
				top: '12%',
				itemGap: 4,
				itemWidth: 12,
				itemHeight: 8,
				width: 'auto',
				height: 'auto',
				textStyle: {
					color: '#ACDAF1',
					fontSize: 11,
					fontFamily: 'AlibabaPuHuiTi-55',
					lineHeight: 18
				},
				formatter: (name) => {
					const item = pieChartData.value.find(d => d.name === name);
					if (item) {
						const formattedValue = typeof item.value === 'number'
							? item.value.toFixed(2)
							: item.value;
						// 如果名称太长，可以截断
						const displayName = name.length > 6 ? name.substring(0, 6) + '...' : name;
						return `${displayName}`;
					}
					return name;
				}
			},
			series: [
				{
					type: 'pie',
					radius: ['30%', '60%'], // 环形饼图，根据数据项数量调整
					center: ['35%', '50%'],
					avoidLabelOverlap: true,
					itemStyle: {
						borderRadius: 6,
						borderColor: '#112e46',
						borderWidth: 2
					},
					label: {
						show: true,
						position: 'outside',
						color: '#fff',
						fontSize: 11,
						fontFamily: 'AlibabaPuHuiTi-55',
						formatter: '{b}\n{d}%',
						lineHeight: 16,
						rich: {
							name: {
								fontSize: 11,
								color: '#fff'
							},
							percent: {
								fontSize: 11,
								color: '#ACDAF1'
							}
						}
					},
					labelLine: {
						show: true,
						length: 10,
						length2: 6,
						lineStyle: {
							color: '#ACDAF1',
							width: 1,
							type: 'solid'
						}
					},
					emphasis: {
						itemStyle: {
							shadowBlur: 15,
							shadowOffsetX: 0,
							shadowOffsetY: 0,
							shadowColor: 'rgba(0, 246, 255, 0.6)'
						},
						label: {
							fontSize: 13,
							fontWeight: 'bold',
							color: '#00f6ff'
						},
						labelLine: {
							lineStyle: {
								color: '#00f6ff',
								width: 2
							}
						}
					},
					data: seriesData
				}
			]
		};
	}

	// 指标详情查询，切换行政区划
	const districtSelectedChange = () => {
		// 统一处理：如果没有数据或条件不满足，设置为空数组
		if (!selectedDistrict.value || !mirrorData.value?.indicatorData) {
			pieThirdOptions.value = [];
			pieChartData.value = [];
			return;
		}

		let datas = mirrorData.value.indicatorData;
		let filterDatas = datas.filter(
			m => m.regionLevel == selectedDistrict.value
		);

		// 转换为饼图数据格式：[{ name, value }]
		const pieDataArray = filterDatas
			.filter(
				m => m.xzqmc && m.predictValue !== undefined && m.predictValue !== null
			)
			.map(m => ({
				name: m.xzqmc,
				value: m.predictValue || 0
			}));

		// 更新饼图数据
		pieChartData.value = pieDataArray.length > 0 ? pieDataArray : [];
	};

	const districtSelectedChange2 = () => {
		sortDirection.value = !sortDirection.value;
		if (selectedDistrict2.value) {
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
			barChartData.value = {
				districts: vals.map(m => m.xzqmc),
				afterProject: vals.map(m => m.predictValue)
			};
			let indicatorInfo = zbList.value.find(m => m.value == activeZb.value);
			chartBarFn(indicatorInfo?.unit);
		}
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

	// 查询统计数据
	const handleQueryStatistics = async () => {
		if (
			!statisticsForm.value.range ||
			!statisticsForm.value.indicator ||
			!statisticsForm.value.method
		) {
			// 可以添加提示信息
			return;
		}
		try {
			// 这里可以调用 API 获取统计数据
			// const res = await cityApi.getStatisticsData({
			// 	range: statisticsForm.value.range,
			// 	indicator: statisticsForm.value.indicator,
			// 	method: statisticsForm.value.method
			// });

			// 模拟数据
			statisticsResultList.value = [
				{
					indicatorName: '中心城区人口密度',
					sum: '156812人/平方公里',
					average: '9612人/平方公里',
					count: '96个'
				}
			];
		} catch (error) {
			console.error('查询统计数据失败:', error);
		}
	};

	onMounted(async () => {
		getCatalogGetById('ZBC053');
		handleScenarioChange('spatial')
		setTimeout(() => {
			handleVectorToggle(vectorDataList.value[0]);
		}, 1 * 1000);
	});

	onBeforeUnmount(() => {
		chart && chart.dispose();
		chartBar && chartBar.dispose();
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

		.target-section {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 12px;
			margin-bottom: 12px;
			background: rgba(17, 46, 70, 0.8);
			padding: 11px;
			border-radius: 4px;
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

					.el-select__placeholder,
					.el-select__selected-item {
						color: #fff !important;
					}

					.el-select__caret {
						color: #7edcfb !important;
					}
				}
			}
		}
		.indicator-label {
			color: #fff;
			font-size: 20px;
			font-family: 'YouSheBiaoTiHei';
			&.active {
				color: #f5e74f;
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
				}

				:deep(.customSelect) {
					flex: 1;

					.el-select {
						width: 100%;
					}

					.el-select__placeholder,
					.el-select__selected-item {
						color: #fff !important;
					}

					.el-select__caret {
						color: #7edcfb !important;
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

				.statistics-btn {
					padding: 4px 16px;
					background: rgba(79, 79, 79, 0.8);
					border: 1px solid rgba(200, 200, 200, 0.5);
					border-radius: 4px;
					color: #fff;
					font-size: 12px;
					cursor: pointer;
					transition: all 0.3s;
					font-family: 'SourceHanSansCN-Regular';

					&:hover {
						background: rgba(0, 246, 255, 0.2);
						border-color: #00f6ff;
						color: #00f6ff;
					}
				}
			}
		}

		.smart-summary-section {
			margin-bottom: 12px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 16px;

			.generate-report-btn {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 8px;
				padding: 12px 20px;
				background: linear-gradient(90deg, #3fa4ff 0%, #60f5ff 100%);
				border: none;
				border-radius: 4px;
				color: #fff;
				font-size: 14px;
				cursor: pointer;
				transition: all 0.3s;
				font-family: 'SourceHanSansCN-Regular';

				.plus-icon {
					font-size: 18px;
					font-weight: bold;
					line-height: 1;
				}

				&:hover {
					background: linear-gradient(90deg, #60f5ff 0%, #3fa4ff 100%);
					transform: translateY(-1px);
					box-shadow: 0 4px 8px rgba(0, 246, 255, 0.3);
				}

				&:active {
					transform: translateY(0);
				}
			}

			.download-report-link {
				color: #00f6ff;
				font-size: 13px;
				text-decoration: none;
				cursor: pointer;
				transition: all 0.3s;
				font-family: 'SourceHanSansCN-Regular';
				white-space: nowrap;

				&:hover {
					color: #66ffff;
					text-decoration: underline;
				}
			}
		}
	}

	.right {
		box-sizing: border-box;
		.yearChart {
			display: flex;
			.yearChartItem {
				width: 4.125rem;
				.yearChartItemTitle {
					span {
						width: 66px;
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
		.trafficCommuting {
			.bhl {
				top: 10px;
				left: 10px;
				color: #c4c4c4;
				font-size: 12px;
				font-family: 'SourceHanSansCN-Regular';
			}
			.trafficCommutingItem {
				padding: 8px 10px;
				margin-bottom: 8px;
				.trafficCommutingItemTitle {
					width: 50px;
					height: 20px;
					line-height: 20px;
					text-align: center;
					font-size: 12px;
					font-family: 'YouSheBiaoTiHei';
					margin-right: 10px;
					&.top1 {
						background: linear-gradient(180deg, #ff5e00 0%, #ffcf00 100%);
						color: #fff;
					}
					&.top2 {
						background: linear-gradient(180deg, #ffcf00 0%, #00f6ff 100%);
						color: #fff;
					}
					&.top3 {
						background: linear-gradient(180deg, #00f6ff 0%, #3fa4ff 100%);
						color: #fff;
					}
					&.top4 {
						background: linear-gradient(180deg, #3fa4ff 0%, #60f5ff 100%);
						color: #fff;
					}
					&.top5 {
						background: linear-gradient(180deg, #60f5ff 0%, #99f5ff 100%);
						color: #fff;
					}
				}
				.trafficCommutingItemContent {
					flex: 1;
					.trafficCommutingItemContentItem {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 4px;
						.name {
							color: #fff;
							font-size: 12px;
							font-family: 'SourceHanSansCN-Regular';
						}
						.time {
							color: #5cdaf5;
							font-size: 12px;
							font-family: 'SourceHanSansCN-Regular';
						}
					}
					.line {
						height: 4px;
						background: rgba(0, 246, 255, 0.2);
						border-radius: 2px;
						overflow: hidden;
						p {
							height: 100%;
							background: linear-gradient(90deg, #00f6ff 0%, #3fa4ff 100%);
							transition: width 0.3s;
							&.top1 {
								background: linear-gradient(90deg, #ff5e00 0%, #ffcf00 100%);
							}
							&.top2 {
								background: linear-gradient(90deg, #ffcf00 0%, #00f6ff 100%);
							}
							&.top3 {
								background: linear-gradient(90deg, #00f6ff 0%, #3fa4ff 100%);
							}
							&.top4 {
								background: linear-gradient(90deg, #3fa4ff 0%, #60f5ff 100%);
							}
							&.top5 {
								background: linear-gradient(90deg, #60f5ff 0%, #99f5ff 100%);
							}
						}
					}
				}
				.trafficCommutingItemImg {
					width: 16px;
					height: 16px;
					margin: 0 8px;
				}
			}
		}
		.resultContentTitle {
			font-size: 24px;
			color: #66ffff;
			font-family: 'YouSheBiaoTiHei';
			text-align: right;
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

<style lang="scss">
	// 统计弹窗样式（需要全局样式，因为 el-dialog 会渲染到 body）
	.statistics-dialog {
		.el-dialog {
			background: linear-gradient(135deg, #0a1f3b 0%, #1a2f4b 100%);
			border: 1px solid rgba(0, 246, 255, 0.3);
			border-radius: 8px;
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);

			.el-dialog__header {
				padding: 0;
				margin: 0;
			}

			.el-dialog__body {
				padding: 20px;
			}
		}

		.dialog-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 16px 20px;
			border-bottom: 1px solid rgba(0, 246, 255, 0.2);

			.dialog-title {
				color: #fff;
				font-size: 18px;
				font-weight: 600;
				font-family: 'YouSheBiaoTiHei';
			}

			.dialog-close {
				width: 20px;
				height: 20px;
				cursor: pointer;
				transition: opacity 0.3s;

				&:hover {
					opacity: 0.7;
				}
			}
		}

		.statistics-dialog-content {
			.statistics-section {
				margin-bottom: 24px;

				&:last-child {
					margin-bottom: 0;
				}
			}

			.statistics-form {
				.form-item {
					margin-bottom: 16px;

					&:last-child {
						margin-bottom: 0;
					}

					.form-label {
						display: block;
						color: #fff;
						font-size: 13px;
						margin-bottom: 8px;
						font-family: 'SourceHanSansCN-Regular';
					}
				}

				.form-actions {
					margin-top: 20px;
					display: flex;
					justify-content: center;

					.query-btn {
						padding: 10px 32px;
						background: linear-gradient(90deg, #3fa4ff 0%, #60f5ff 100%);
						border: none;
						border-radius: 4px;
						color: #fff;
						font-size: 14px;
						cursor: pointer;
						transition: all 0.3s;
						font-family: 'SourceHanSansCN-Regular';

						&:hover {
							background: linear-gradient(90deg, #60f5ff 0%, #3fa4ff 100%);
							transform: translateY(-1px);
							box-shadow: 0 4px 8px rgba(0, 246, 255, 0.3);
						}

						&:active {
							transform: translateY(0);
						}
					}
				}
			}

			.statistics-result {
				.result-table-container {
					border-radius: 4px;
					padding: 0;
					border: none;
					background: transparent;

					.result-table {
						width: 100%;
						border-collapse: collapse;
						background: transparent;

						thead {
							tr {
								th {
									color: #fff;
									font-size: 13px;
									font-weight: 400;
									text-align: left;
									padding: 12px 16px;
									border-bottom: 1px solid rgba(0, 246, 255, 0.3);
									background: transparent;
									font-family: 'SourceHanSansCN-Regular';

									&:first-child {
										width: 40%;
									}

									&:nth-child(2),
									&:nth-child(3),
									&:nth-child(4) {
										width: 20%;
									}
								}
							}
						}

						tbody {
							tr {
								border-bottom: 1px solid rgba(0, 246, 255, 0.2);

								&:last-child {
									border-bottom: none;
								}

								&:hover {
									background: rgba(0, 246, 255, 0.03);
								}

								td {
									color: #fff;
									font-size: 13px;
									padding: 12px 16px;
									font-family: 'SourceHanSansCN-Regular';
									background: transparent;

									&.empty-data {
										text-align: center;
										color: #999;
										padding: 20px;
									}
								}
							}
						}
					}
				}
			}

			.dialog-footer {
				display: flex;
				justify-content: center;
				padding: 16px 0 0 0;
				border-top: 1px solid rgba(0, 246, 255, 0.2);

				.close-btn {
					padding: 10px 32px;
					background: rgba(79, 79, 79, 0.8);
					border: 1px solid rgba(255, 255, 255, 0.3);
					border-radius: 4px;
					color: #fff;
					font-size: 14px;
					cursor: pointer;
					transition: all 0.3s;
					font-family: 'SourceHanSansCN-Regular';

					&:hover {
						background: rgba(0, 246, 255, 0.2);
						border-color: #00f6ff;
						color: #00f6ff;
					}

					&:active {
						transform: translateY(1px);
					}
				}
			}
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
