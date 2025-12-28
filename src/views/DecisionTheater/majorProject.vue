<!-- 模拟工坊 -->
<template>
	<div class="pages">
		<Layout>
			<template #left>
				<div class="w-full h-full left">
					<SecondTile
						label="重大项目决策调控台"
						leftPadding="3.8125rem"></SecondTile>
					<div class="pl-[1.6875rem] pr-[0.4375rem]">
					<Arrowhead
						class="my-3"
						name="场景体系"
						direction="bottom"
						@directionChange="handleTitleToggle('project1')" />
					<div v-show="titleStates.project1" class="project-section">
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
							popper-class="my-popper"
							v-model="projectName1"
							:options="projectNameList1"
							:footer="true"
							@select="handleProjectChange1">
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
							name="导入方案"
							direction="bottom"
							@directionChange="handleTitleToggle('project')" />
						<CustomSelect
							v-show="titleStates.project"
							popper-class="my-popper"
							v-model="projectName"
							:options="projectNameList"
							forbidden-value="0"
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
							name="查看项目区域"
							direction="bottom"
							@directionChange="handleTitleToggle('spaceData')" />
						<div class="spaceData" v-show="titleStates.spaceData">
							<DbTableHeader
								:list="[
									{ name: '项目空间数据名称', class: 'w-[9.25rem]' },
									{ name: '空间数据类型', class: 'w-[7rem]' },
									{ name: '查看', class: 'flex-1' }
								]"></DbTableHeader>
							<div class="body flex items-center">
								<div class="div w-[9.25rem]">{{ spatialData?.fileName }}</div>
								<div class="div w-[7rem]">
									{{ spatialData?.dataRange || '' }}
								</div>
								<div class="div flex-1">
									<el-switch
										v-model="spatialDataShow"
										@change="spatialDataChangeHandle()" />
								</div>
							</div>
						</div>
						<Arrowhead
							class="my-3"
							name="选择单元"
							direction="bottom"
							@directionChange="handleTitleToggle('chooseUnit')"></Arrowhead>
						<CustomSelect
							v-show="titleStates.chooseUnit"
							v-model="dyCurrent"
							:options="dyList"
							@select="dyHandleChange"></CustomSelect>
						<Arrowhead
							class="my-3"
							name="选择专题"
							direction="bottom"
							@directionChange="handleTitleToggle('special')" />
						<ZbListCom
							v-show="titleStates.special"
							:data="planningWarningTopicList"
							:currentId="activeZt"
							@zbChange="handleSpecialChange"></ZbListCom>
						<div class="mt-4"></div>
						<Arrowhead
							class="my-3"
							name="选择年份"
							direction="bottom"
							@directionChange="handleTitleToggle('year')"></Arrowhead>
						<CustomSelect
							v-show="titleStates.year"
							v-model="yearCurrent"
							:options="yearList"
							@select="handleYearChange">
						</CustomSelect>
						<template v-if="rightShowType === 2">
							<Arrowhead
								class="my-3"
								name="指标类型"
								direction="bottom"
								@directionChange="handleTitleToggle('zbType')"></Arrowhead>
							<CustomSelect
								v-model="activeLx"
								v-show="titleStates.zbType"
								:options="lxList"
								@select="handleZbTypeChange">
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
								@select="handleZbChange">
							</CustomSelect>
						</template>
					</div>
				</div>
			</template>
			<template #map>
				<MaxMap ref="maxMapRef">
					<template #mapCon>
						<h1 class="absolute mapConTitle select-none">
							{{
								projectNameList1.find(n => n.value == projectName1)?.label || ''
							}}
						</h1>
						<ul class="mapBtnList flex items-center">
							<li
								:class="[
									'ml-[10px] flex items-center justify-center cursor-pointer',
									{ active: mapBtnItemId === item.id }
								]"
								v-for="item in mapBtnList"
								:key="'mapBtnList_' + item.id"
								@click="mapBtnListClick(item)">
								{{ item.name }}
							</li>
						</ul>
					</template>
				</MaxMap>
			</template>
			<template #right>
				<div class="w-full h-full right" v-if="rightShowType === 1">
					<!-- 项目效果模拟 -->
					<SecondTile
						label="项目成效模拟仪表盘"
						direction="right"
						rightPadding="4rem"></SecondTile>
					<div class="pl-[0.375rem] pr-8">
						<div class="yearCompare mt-4">
							<img src="@/assets/img/TimeSpaceRadar/icon.png" alt="" />
							<span>就业岗位</span>
						</div>

						<!-- 就业岗位 -->
						<div class="yearChartItem mt-2">
							<div class="yearChartItemTitle">
								{{ zbList.find(n => n.value == activeZb)?.label || '' }}指标
							</div>
							<div class="yearChartItemContent">
								{{ summary }}
							</div>
						</div>
						<div class="w-full my-[0.75rem]">
							<div class="resultContent w-full h-full">
								<Diamond
									:name="`${
										zbList.find(n => n.value == activeZb)?.label || ''
									}指标`"></Diamond>
								<div class="resultContentText">
									<div class="resultContentTextItem">{{ summary }}</div>
								</div>
							</div>
						</div>
						<div class="employmentChart">
							<div
								ref="employmentChartRef"
								class="employmentChartCanvas w-full h-[166px]"></div>
						</div>
						<!-- 交通通勤 -->
						<div class="yearCompare mt-4">
							<img src="@/assets/img/TimeSpaceRadar/icon.png" alt="" />
							<span>交通通勤</span>
						</div>
						<div class="trafficCommuting">
							<div
								class="trafficCommutingItem"
								v-for="(item, index) in trafficData"
								:key="index">
								<div
									class="trafficCommutingItemTitle"
									:class="`top${index + 1}`">
									Top{{ index + 1 }}
								</div>
								<div class="trafficCommutingItemContent">
									<div
										class="trafficCommutingItemContentItem"
										:class="`top${index + 1}`">
										<span class="name">{{ item.name }}</span>
										<span class="time">{{ item.time }}</span>
									</div>
									<div class="line" :class="`top${index + 1}`"></div>
								</div>
								<img
									:src="item.trend === 'up' ? up : down"
									alt=""
									class="trafficCommutingItemImg" />
							</div>
						</div>

						<!-- 人口数量 -->
						<div class="yearCompare mt-4">
							<img src="@/assets/img/TimeSpaceRadar/icon.png" alt="" />
							<span>人口数量</span>
						</div>
						<div class="populationNumber">
							<div style="display: flex">
								<div class="populationNumberItem two">
									<p class="populationNumberItemTitle">海珠区</p>
									<p class="populationNumberItemValue">8544</p>
									<p class="populationNumberItemRank">2</p>
								</div>
								<div class="populationNumberItem one">
									<p class="populationNumberItemTitle">天河区</p>
									<p class="populationNumberItemValue">10000</p>
									<p class="populationNumberItemRank">1</p>
								</div>
								<div class="populationNumberItem three">
									<p class="populationNumberItemTitle">越秀区</p>
									<p class="populationNumberItemValue">6548</p>
									<p class="populationNumberItemRank">3</p>
								</div>
							</div>
							<div class="list">
								<span>4</span>
								<span>黄浦区</span>
								<span>5647</span>
							</div>
							<div class="list">
								<span>5</span>
								<span>白云区</span>
								<span>4587</span>
							</div>
						</div>
					</div>
				</div>
				<div class="w-full h-full right" v-if="rightShowType === 2">
					<SecondTile
						label="项目成效模拟仪表盘"
						direction="right"
						rightPadding="4rem"></SecondTile>
					<div class="pl-[0.375rem] pr-8">
						<Arrowhead
							class="my-3"
							:name="indicatorNameTitle"
							direction="left"
							:isChange="false"></Arrowhead>
						<div class="yearChart1 bg-[#112e46]">
							<div class="yearChartItem1">
								<div class="yearChartItemTitle1">
									<span>规划实施前（{{ baseYear || '' }}年）</span>
								</div>
								<div
									ref="chartRef"
									style="width: 90%; height: 150px; margin-top: -50px"></div>
							</div>
							<div class="yearChartItem1">
								<div class="yearChartItemTitle1">
									<span>规划实施后（{{ predictYear || '' }}年）</span>
								</div>
								<div
									ref="chartRefRight"
									style="width: 90%; height: 150px; margin-top: -50px"></div>
							</div>
						</div>
						<div class="w-full my-[0.75rem]">
							<div class="resultContent w-full h-full">
								<Diamond :name="`${'项目实施总体分析'}`"></Diamond>
								<div class="resultContentText">
									<div class="resultContentTextItem" style="color: #c4c4c4">
										{{ summary }}
									</div>
								</div>
							</div>
						</div>
						<Arrowhead
							class="my-3"
							name="项目实施前后变化率排名"
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
								@change="selectedDistrictChange">
								<el-option
									v-for="item in districtOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value" />
							</el-select>
						</Arrowhead>
						<div class="duibi relative bg-[#112e46]">
							<div
								class="customLegend absolute top-0 right-0 flex items-center">
								<div class="legendItem">
									<div
										@click="mapImpactChangeHandle('before')"
										class="legendColor"
										style="
											background: linear-gradient(to bottom, #77f2fc, #57a4fb);
										"></div>
									<span>项目实施前（{{ baseYear }}年）</span>
								</div>
								<div class="legendItem">
									<div
										@click="mapImpactChangeHandle('after')"
										class="legendColor"
										style="
											background: linear-gradient(to bottom, #f877a6, #f6415c);
										"></div>
									<span>项目实施后（{{ predictYear }}年）</span>
								</div>
							</div>
							<div class="chartContainer">
								<div ref="barChartRef" class="barChart"></div>
							</div>
						</div>
					</div>
				</div>
			</template>
		</Layout>
		<AddProject
			v-if="modelValue"
			:type="createType"
			:projectId="projectName1"
			bizType="JCJC"
			:show="btnType === 'history'"
			:projectList="completedProjectInfos"
			@close="(modelValue = false), (btnType = '')"></AddProject>
	</div>
</template>
<script setup>
	import cityApi from '@/api/index.js';
	import { useAppStore } from '@/stores/modules/app.js';
	const useStore = useAppStore();
	import ZbListCom from '@/components/lists/zbList.vue';
	import AddProject from '@/components/addProject/index.vue';
	import MaxMap from '@/components/mapView/maxMap.vue';
	import up from '@/assets/img/decisionTheater/up.png';
	import down from '@/assets/img/decisionTheater/down.png';
	import * as echarts from 'echarts';
	import { transfromGeojson } from '@/components/map/primitive/util/ProjectionUtil.js';
	import { useMapStore } from '@/stores/modules/map.js';
	import { getAssetsFile } from '@/utils/index.js';
	const mapStore = useMapStore();

	const maxMapRef = ref(null);
	const chartRef = ref(null); // 年份对比第一个图表
	let chart = null; // 年份对比第一个图表
	const chartRefRight = ref(null); // 年份对比第二个图表
	let chartRight = null; // 年份对比第二个图表
	const barChartRef = ref(null); // 柱状图
	let barChart = null; // 柱状图实例
	const employmentChartRef = ref(null); // 就业岗位图表
	let employmentChart = null; // 就业岗位图表实例
	// 统一管理所有Title组件的状态
	const titleStates = ref({
		project1: true,
		project: true,
		spaceData: true,
		showType: true,
		chooseUnit: true,
		special: true,
		zbType: true,
		zb: true,
		year: true
	});
	// 处理Title组件的切换事件
	const handleTitleToggle = key => {
		titleStates.value[key] = !titleStates.value[key];
	};
	const mapBtnList = [
		{ id: 0, name: '项目落地后' },
		{ id: 1, name: '项目落地前' },
		{ id: 2, name: '项目实施影响' }
	];
	const mapBtnItemId = ref(0);
	const spatialDataShow = ref(false);
	const createType = ref('F');
	const modelValue = ref(false);
	const btnType = ref(''); // add: 新建项目, history: 历史项目
	const projectName = ref('');
	const projectName1 = ref('');
	const projectNameList1 = ref([{ value: '0', label: '新建推演项目' }]);

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
	const projectNameList = ref([{ value: '0', label: '新建推演项目' }]);
	const indicatorNameTitle = ref('农用地面积总值对比（平方公里）');

	// 选择项目
	// 选择项目的场景按钮选择
	const handleProjectScenarioChange = value => {
		activeProjectScenario.value = value;
		// 根据场景更新项目列表或相关数据
	};

	const handleProjectChange1 = value => {
		if (value === '0') {
			createType.value = 'F';
			btnType.value = 'add';
			modelValue.value = true;
		} else {
			projectName1.value = value;
			getDetailQuery();
		}
	};
	const handleProjectChange = value => {
		if (value === '0') {
			createType.value = 'C';
			btnType.value = 'add';
			modelValue.value = true;
		} else {
			projectName.value = value;
			// 获取该项目空间信息,completedProjectInfos,completedSubProjectInfos
			let subProjInfo = completedSubProjectInfos.value.find(m => m.id == value);
			if (subProjInfo?.extDataPath) {
				spatialData.value = {
					filePath: subProjInfo?.extDataPath || '',
					dataRange: spatialData.value?.dataRange || '',
					fileName:
						(subProjInfo?.extDataPath || '').match(/\/([^\/]+)\./)[1] || '',
					isLoad: false
				};
			}

			// 选择单元
			dyList.value =
				completedSubProjectInfos.value
					.find(m => m.id == value)
					?.rangeType.split(',')
					.map(d => {
						return { value: d, id: d, label: d };
					}) || [];
			dyCurrent.value =
				completedSubProjectInfos.value
					.find(m => m.id == value)
					?.rangeType.split(',')[0] || '';
			// 选择专题
			let indicatorIds =
				completedSubProjectInfos.value
					.find(m => m.id == value)
					.indicatorIds?.split(',') || [];
			const filteredTrees = getTreeByLeafNodes(
				planningWarningTopicInfos.value,
				indicatorIds
			);
			let filterItems = planningWarningTopicInfos.value.filter(m =>
				filteredTrees.map(n => n.nodeId).includes(m.nodeId)
			);
			// 获取该项目的专题信息
			planningWarningTopicList.value = filterItems.map(m => {
				return { value: m.nodeId, label: m.nodeName, ...m };
			});
			if (planningWarningTopicList.value?.length) {
				// activeZt.value = planningWarningTopicList.value[0]?.value;
				handleSpecialChange(planningWarningTopicList.value[0]);
			}
			// 选择年份
			yearList.value = completedSubProjectInfos.value
				.find(m => m.id == value)
				?.predictYear.split(',')
				.map(m => {
					return { value: m, label: m };
				});
			yearCurrent.value =
				completedSubProjectInfos.value
					.find(m => m.id == value)
					?.predictYear?.split(',')?.[0] || '';

			getDeductionResultStatistics();
		}
	};
	const handleMore = () => {
		createType.value = 'F';
		btnType.value = 'history';
		modelValue.value = true;
	};

	const summary = ref('');
	const rightShowType = ref(2);
	const completedProjectInfos = ref([]);
	const completedSubProjectInfos = ref([]);
	const queryResSubProjectInfos = ref([]);
	const policyStatisticInfo = ref([]);
	// 上传空间数据
	const spatialData = ref(null);
	const baseYear = ref('2024');
	const predictYear = ref('2030');

	// 选择专题
	const activeZt = ref('');
	const indicatorNodeIds = ref('');
	const planningWarningTopicList = ref([]);
	const planningWarningTopicInfos = ref([]);
	// 选择专题事件
	const handleSpecialChange = obj => {
		activeZt.value = obj.value;
		function collectIndicatorNodeIds(data) {
			const result = { ids: [], items: [] };
			// 递归处理函数
			const traverse = items => {
				// 非数组直接返回
				if (!Array.isArray(items)) return;
				items.forEach(item => {
					// 若当前项是指标类型，收集nodeId
					if (item?.nodeType === 'indicator') {
						result.ids.push(item.nodeId);
						result.items.push(item);
					}
					// 递归处理子节点
					traverse(item?.children);
				});
			};
			// 启动遍历
			traverse(data);
			return result;
		}
		const ids = collectIndicatorNodeIds(obj.children).ids;
		indicatorNodeIds.value = ids.join(',');
		handleWarningTopicChange();
		getDeductionResultStatistics();
	};
	// 选择年份
	const yearCurrent = ref('2030');
	const yearList = ref([
		{ value: '2030', label: '2030年' },
		{ value: '2035', label: '2035年' },
		{ value: '2040', label: '2040年' }
	]);
	// 处理年份选择事件
	const handleYearChange = obj => {
		yearCurrent.value = obj || obj?.id || obj?.value;
		getDeductionResultStatistics();
	};
	const handleZbTypeChange = obj => {
		activeLx.value = obj?.id || obj?.value || obj;
		indicatorTypehandle();
		getDeductionResultStatistics();
	};
	const handleZbChange = obj => {
		activeZb.value = obj.value;
		indicatorSelectedHandle();
		getDeductionResultStatistics();
	};
	// 选择单元
	const dyCurrent = ref('');
	const dyList = ref([]);
	const dyHandleChange = value => {
		dyCurrent.value = value;
		getDeductionResultStatistics();
	};

	// 选择指标
	const activeLx = ref('');
	const lxList = ref([]);

	// 交通通勤数据
	const sortIndex = ref(true);
	const trafficData = ref([
		{
			name: '增城区',
			time: '55min',
			trend: 'up'
		},
		{
			name: '从化区',
			time: '45min',
			trend: 'up'
		},
		{
			name: '南沙区',
			time: '35min',
			trend: 'down'
		},
		{
			name: '天河区',
			time: '30min',
			trend: 'down'
		}
	]);

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
	// 选择指标
	const activeZb = ref('0');
	const zbList = ref([]);
	// 获取项目列表
	const initProjects = async () => {
		try {
			const res = await cityApi.projectQueryWithPage({
				adminFlag: useStore.userInfo?.adminFlag || '1',
				loginUser: useStore.userInfo?.username || '',
				current: 1,
				size: 2,
				endTime: '',
				startTime: '',
				eq_status: '3',
				like_name: ''
			});
			if (res.resultCode === 'S') {
				const data = res.data || [];
				completedProjectInfos.value = JSON.parse(JSON.stringify(data));
				// projectNameList1.value = data.map(m => {
				// 	return { value: m.id, label: m.name };
				// });
				// projectName1.value = projectNameList1.value[0].value;

				let firstItem = JSON.parse(JSON.stringify(projectNameList1.value[0]));
				projectNameList1.value =
					data?.map(m => {
						return { value: m.id, label: m.name };
					}) || [];
				projectNameList1.value.unshift(firstItem);
				projectName1.value = projectNameList1.value[1].value;
				getDetailQuery();
			}
		} catch (error) {}
	};
	// 获取专题数据
	const getCatalogGetById = async () => {
		try {
			const response = await cityApi.catalogQueryWithPage({
				eq_status: '1'
			});
			if (response.resultCode === 'S' && response.data.length) {
				const res = await cityApi.catalogGetById({
					catalogId: response.data[0].id
				});
				if (res.resultCode === 'S' && res.data?.tree.length) {
					planningWarningTopicInfos.value = res.data?.tree || [];
					initProjects();
				}
			}
		} catch (error) {
			console.error('查询城市推演项目记录信息失败:', error);
		}
	};
	// 获取子项目
	const getDetailQuery = async () => {
		try {
			const res = await cityApi.projectDetailQuery({
				projectId: projectName1.value,
				bizType: 'JCJC',
				actionType: 'JCJC1'
			});
			if (res.resultCode === 'S') {
				let data = [];
				if (res.data && !Array.isArray(res.data)) {
					data = [res.data];
				} else {
					data = res.data || [];
				}
				const indicatorIds = data[0].indicatorIds || '';
				const childProjects = data[0]?.childProjects || [];
				completedSubProjectInfos.value = childProjects;
				let firstItem = JSON.parse(JSON.stringify(projectNameList.value[0]));
				projectNameList.value =
					childProjects?.map(m => {
						return { value: m.id, label: m.name, indicatorIds };
					}) || [];
				projectNameList.value.unshift(firstItem);
				handleProjectChange(projectNameList.value[1]?.value);
			}
		} catch (error) {
			console.error('获取子项目失败:', error);
		}
	};
	// 变化率排名
	const sortHande = () => {
		sortIndex.value = !sortIndex.value;
		let datas = [];
		if (sortIndex.value) {
			datas = JSON.parse(JSON.stringify(queryResSubProjectInfos.value)).sort(
				(a, b) => b.changeRate - a.changeRate
			);
		} else {
			datas = JSON.parse(JSON.stringify(queryResSubProjectInfos.value)).sort(
				(a, b) => a.changeRate - b.changeRate
			);
		}
		let indicatorInfo = zbList.value.find(m => m.value == activeZb.value);
		trafficData.value = datas.slice(0, 5).map(n => {
			return {
				name: n.xzqmc,
				time: (n.monitorValue * 100).toFixed(2) + `${indicatorInfo.data.unit}`,
				trend: n.changeRate >= 0 ? 'up' : 'down',
				percentage: (n.changeRate * 100).toFixed(2) + '%',
				data: n.changeRate
			};
		});
	};
	// 最后获取结果接口
	const getDeductionResultStatistics = async () => {
		try {
			const res = await cityApi.commonStatistic({
				array_indicatorId: '',
				catalogId: '',
				current: 1,
				size: 1000,
				eq_grade: '',
				projectType: 'CHILD',
				eq_indicatorId: activeZb.value, // 指标ID
				eq_projectId: projectName.value, // 项目ID
				eq_predictYear: yearCurrent.value?.split(',')?.[0] || '', // 目标年份
				eq_regionLevel: dyCurrent.value || '', // 行政区级别，全市、区县、街道、网格
				eq_xzqdm: '', // 行政区代码
				like_indicatorName: '', // 指标名称
				projectType: 'CHILD'
			});
			if (res.resultCode === 'S') {
				summary.value = res.data?.summary || '';
				const data = res.data?.indicatorData || [];
				queryResSubProjectInfos.value = data || [];
				policyStatisticInfo.value = res.data[0] || [];
				let indicatorInfo = zbList.value.find(
					n => n.value == activeZb.value
				)?.data;
				// 渲染地图
				if (maxMapRef.value) {
					let datas = data.filter(m => m.regionLevel == dyCurrent.value).map(m => {
						return {
							predictValue: m.predictValue,
							xzqdm: m.xzqdm,
							xzqmc: m.xzqmc,
							indicatorInfo,
							predictYear: yearCurrent.value?.split(',')?.[0],
							calculateResult: Object.assign(m, {
								module: 'MajorProject',
								unit: indicatorInfo?.unit || ''
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
									module: 'MajorProject',
									unit: indicatorInfo?.unit || ' '
								}
							}
						];
					}
					maxMapRef.value.renderDatasToMap(dyCurrent.value, datas);
				}
				// 指标影响模拟
				indicatorNameTitle.value =
					indicatorInfo?.nodeName + '总值对比（' + indicatorInfo?.unit + '）';
				chartFn(res.data?.totalBaseValue || 0);
				chartRightFn(res.data?.totalPredictValue || 0);

				// 项目实施后变化TOP5
				let vals = JSON.parse(JSON.stringify(res.data.indicatorData)).sort(
					(a, b) => b.changeRate - a.changeRate
				);
				sortIndex.value = true;
				trafficData.value = vals.slice(0, 5).map(n => {
					return {
						name: n.xzqmc,
						time: (n.monitorValue * 100).toFixed(2) + `${indicatorInfo.unit}`,
						trend: n.changeRate >= 0 ? 'up' : 'down',
						percentage: (n.changeRate * 100).toFixed(2) + '%',
						data: n.changeRate
					};
				});

				// 项目实施指标对比
				baseYear.value = res.data.indicatorData[0].baseYear;
				predictYear.value = res.data.indicatorData[0].predictYear;
				let firstItem = JSON.parse(JSON.stringify(districtOptions.value[0]));
				districtOptions.value = Array.from(
					data
						.reduce((map, m) => {
							const xzqdm = m.xzqdm; // 用 xzqdm 作为判断重复的依据
							// 如果 Map 中没有当前 xzqdm，则添加；已存在则跳过（保留第一个）
							if (!map.has(xzqdm)) {
								map.set(xzqdm, {
									value: xzqdm,
									label: m.xzqmc
								});
							}
							return map;
						}, new Map())
						.values() // 提取 Map 中的值，转换为数组
				);
				districtOptions.value.unshift(firstItem);
				barChartData.value = {
					districts: data.map(m => m.xzqmc),
					afterProject: data.map(n => {
						return (
							indicatorInfo?.unit == '%' ? n.monitorValue * 100 : n.monitorValue
						).toFixed(2);
					}),
					beforeProject: data.map(n => {
						return (
							indicatorInfo?.unit == '%' ? n.predictValue * 100 : n.predictValue
						).toFixed(2);
					})
				};
				initBarChart(indicatorInfo?.unit);
			}
		} catch (error) {
			console.error('最后获取结果接口:', error);
		}
	};
	// 专题
	const handleWarningTopicChange = () => {
		activeLx.value = '';
		let item = planningWarningTopicInfos.value.find(
			m => m.nodeId == activeZt.value
		);
		lxList.value =
			item.children
				?.filter(n => n.children.length > 0)
				.map(n => {
					return { label: n.nodeName, value: n.nodeId };
				}) || [];
		if (lxList.value?.length) {
			activeLx.value = lxList.value[0].value;
		}
		indicatorTypehandle();
	};
	const indicatorSelectedHandle = () => {
		let item = planningWarningTopicInfos.value.find(
			m => m.nodeId == activeZt.value
		);
		let indicatorType =
			item?.children?.find(n => n.nodeId == activeLx.value) || null;
		let indicator = indicatorType?.children.find(
			n => n.nodeId == activeZb.value
		);
	};
	// 指标类型
	const indicatorTypehandle = () => {
		let indicatorList = [];
		let item = planningWarningTopicInfos.value.find(
			m => m.nodeId == activeZt.value
		);
		item.children
			?.filter(n => n.nodeId == activeLx.value)
			.forEach(m => {
				indicatorList = indicatorList.concat(m.children);
			});
		let projItem = completedSubProjectInfos.value.find(
			n => n.id == projectName.value
		);
		if (item && projItem?.indicators?.length) {
			let filterIds = indicatorList
				.map(m => m.nodeId)
				.filter(n => projItem?.indicatorIds.includes(n));
			zbList.value = indicatorList
				.filter(m => filterIds.includes(m.nodeId))
				.map((m, index) => {
					return {
						value: m.nodeId,
						label: m.nodeName,
						data: m
					};
				});
		} else {
			zbList.value = indicatorList.map((m, index) => {
				return {
					value: m.nodeId,
					label: m.nodeName,
					data: m
				};
			});
		}
		if (zbList.value?.length) {
			activeZb.value = zbList.value[0].value;
			indicatorSelectedHandle();
		}
	};
	const selectedDistrictChange = () => {
		let filterItems = queryResSubProjectInfos.value;
		if (selectedDistrict.value != 'all') {
			filterItems = queryResSubProjectInfos.value.filter(
				n => n.xzqdm == selectedDistrict.value
			);
		}
		barChartData.value = {
			districts: filterItems?.map(m => m.xzqmc),
			afterProject: filterItems?.map(m => m.predictValue),
			beforeProject: filterItems?.map(m => m.monitorValue)
		};
		initBarChart();
	};
	const spatialDataChangeHandle = async () => {
		if (!spatialData.value?.isLoad) {
			// 加载空间数据
			const res = await cityApi.getTotalProperties({
				encode: 'utf-8',
				// fid: spatialData.value?.fileName || '',
				fileName: spatialData.value?.fileName || '',
				filePath: spatialData.value?.filePath || ''
			});
			if (res.resultCode === 'S') {
				if (maxMapRef.value) {
					let datas = transfromGeojson(
						{
							type: 'FeatureCollection',
							features: res.data.features
						},
						'EPSG:' + res.data.wkid,
						'EPSG:4326' || mapStore.mapDefaultOption.viewOptions.projection
					);
					maxMapRef.value.addGeojsonToMap(datas);
				}
			}
		} else {
			// 移除空间数据
			if (maxMapRef.value) {
				maxMapRef.value.addGeojsonToMap();
			}
		}
		spatialData.value.isLoad = !spatialData.value.isLoad;
	};
	// 年份对比第一个图表
	const chartFn = (value = 50) => {
		if (!chartRef.value) {
			return;
		}
		chart = echarts.init(chartRef.value);

		const option = {
			backgroundColor: 'transparent',
			series: [
				{
					type: 'gauge',
					startAngle: 180,
					endAngle: 0,
					center: ['50%', '90%'], // 半圆位置，向上调整10%
					radius: '85%', // 减小半径，留出边距
					min: 0,
					max: value * (Math.random() * 0.8 + 1),
					splitNumber: 20, // 刻度数量
					progress: {
						show: true,
						width: 20,
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
						fontSize: 16,
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
	const chartRightFn = (value = 20) => {
		if (!chartRefRight.value) {
			return;
		}
		chartRight = echarts.init(chartRefRight.value);

		const option = {
			backgroundColor: 'transparent',
			series: [
				{
					type: 'gauge',
					startAngle: 180,
					endAngle: 0,
					center: ['50%', '90%'], // 半圆位置，向上调整10%
					radius: '85%', // 减小半径，留出边距
					min: 0,
					max: value * (Math.random() * 0.8 + 1),
					splitNumber: 20, // 刻度数量
					progress: {
						show: true,
						width: 20,
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
						fontSize: 16,
						offsetCenter: [0, '-10%'],
						color: '#00f6ff',
						formatter: '{value}%'
					},
					data: [{ value: (value * 100).toFixed(2) }]
				}
			]
		};

		chartRight.setOption(option);

		window.addEventListener('resize', () => chartRight?.resize());
	};
	// 柱状图初始化
	const initBarChart = (unit = '%') => {
		if (!barChartRef.value) {
			console.warn('Bar chart container not found');
			return;
		}
		// 如果已存在实例，先销毁
		if (barChart) {
			barChart.dispose();
			barChart = null;
		}
		barChart = echarts.init(barChartRef.value);
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
				bottom: '15%',
				top: '18%',
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
					}
				}
			},
			yAxis: {
				type: 'value',
				name: unit,
				nameTextStyle: {
					color: '#fff',
					fontSize: 12,
					align: 'right',
					padding: [0, -1, 0, 0]
				},
				axisLine: {
					lineStyle: {
						color: '#00f6ff'
					}
				},
				axisLabel: {
					color: '#fff',
					fontSize: 12
				},
				splitLine: {
					lineStyle: {
						color: 'rgba(0, 246, 255, 0.2)',
						type: 'dashed'
					}
				}
			},
			series: [
				{
					name: '项目实施前',
					type: 'bar',
					data: barChartData.value.afterProject,
					itemStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: '#60F5FF' },
							{ offset: 1, color: '#3FA4FF' }
						]),
						borderRadius: [4, 4, 0, 0]
					},
					emphasis: {
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#33f9ff' },
								{ offset: 1, color: '#0088dd' }
							])
						}
					},
					barWidth: '20%'
				},
				{
					name: '项目实施后',
					type: 'bar',
					data: barChartData.value.beforeProject,
					itemStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: '#FF72A6' },
							{ offset: 1, color: '#FF3657' }
						]),
						borderRadius: [4, 4, 0, 0]
					},
					emphasis: {
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#FF3657' },
								{ offset: 1, color: '#FF72A6' }
							])
						}
					},
					barWidth: '20%'
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
					height: 20, // 设置滑动条高度
					handleStyle: {
						color: '#00f6ff' // 设置滑块颜色与主题一致
					},
					textStyle: {
						color: '#fff' // 设置文字颜色
					}
				}
			]
		};
		barChart.setOption(option);
		// 添加窗口大小变化监听
		window.addEventListener('resize', () => barChart.resize());
	};
	// 就业岗位图表初始化
	const initEmploymentChart = () => {
		if (!employmentChartRef.value) {
			console.warn('Employment chart container not found');
			return;
		}

		// 如果已存在实例，先销毁
		if (employmentChart) {
			employmentChart.dispose();
			employmentChart = null;
		}
		employmentChart = echarts.init(employmentChartRef.value);

		const data = [
			{
				value: 17.91,
				name: '制造业',
				itemStyle: { color: '#00a5ff' }
			},
			{
				value: 30.35,
				name: '生产性服务业',
				itemStyle: { color: '#6f11b7' }
			},
			{
				value: 51.74,
				name: '其他',
				itemStyle: { color: '#b6c7ea' }
			}
		];
		const option = {
			backgroundColor: '#f5f7fa',
			title: {
				text: '综合预报天气\n经济类型分析\n(万人)',
				left: '42%',
				top: '60%',
				textStyle: {
					fontSize: 12,
					color: '#666',
					lineHeight: 20,
					textAlign: 'center'
				}
			},
			tooltip: {
				trigger: 'item',
				formatter: '{b}: {c}万人 ({d}%)'
			},
			series: [
				// 内层：显示文字在环形上
				{
					type: 'pie',
					radius: ['80%', '160%'],
					center: ['56%', '96%'],
					startAngle: 180,
					endAngle: 360,
					label: {
						show: true,
						position: 'inside',
						formatter: '{b}\n{d}%',
						fontSize: 12,
						color: '#fff',
						fontWeight: 'bold'
					},
					labelLine: {
						show: false
					},
					data: data
				},
				// 外层：显示图标在外面
				{
					type: 'pie',
					radius: ['80%', '160%'],
					center: ['56%', '96%'],
					startAngle: 180,
					endAngle: 360,
					label: {
						show: true,
						position: 'outside',
						formatter: function (params) {
							const icons = {
								其他: '',
								生产性服务业: '👤',
								制造业: '👥'
							};
							return icons[params.name] || '';
						},
						fontSize: 20,
						color: '#333'
					},
					labelLine: {
						show: true,
						length: 20,
						length2: 0,
						lineStyle: {
							width: 0
						}
					},
					silent: true,
					itemStyle: {
						color: 'transparent'
					},
					data: data
				}
			]
		};

		employmentChart.setOption(option);

		// 添加窗口大小变化监听
		window.addEventListener('resize', () => employmentChart.resize());
	};
	const mapBtnListClick = item => {
		mapBtnItemId.value = item.id;
		// { id: 0, name: '项目落地后' },
		// { id: 1, name: '项目落地前' },
		// { id: 2, name: '项目实施影响' }
		if (maxMapRef.value) {
			let indicatorInfo = zbList.value.find(
				n => n.value == activeZb.value
			)?.data;
			let datas = queryResSubProjectInfos.value.filter(m => m.regionLevel == dyCurrent.value).map(m => {
				let val = m.predictValue;
				if (mapBtnItemId.value == 0) {
					val = m.predictValue;
				} else if (mapBtnItemId.value == 1) {
					val = m.monitorValue;
				} else {
					val = (m.changeRate * 100).toFixed(2);
				}
				return {
					predictValue: val,
					xzqdm: m.xzqdm,
					xzqmc: m.xzqmc,
					indicatorInfo,
					predictYear: yearCurrent.value?.split(',')?.[0],
					calculateResult: Object.assign(m, {
						module: 'MajorProject',
						unit: indicatorInfo?.unit || ''
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
							module: 'MajorProject',
							unit: indicatorInfo?.unit || ' '
						}
					}
				];
			}
			maxMapRef.value.renderDatasToMap(dyCurrent.value, datas);
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

	const getMdDictDetailQuery = async () => {
		try {
			// 外部空间数据类型
			const res5 = cityApi.getMdDictDetailQuery({
				zdlxdm: 'citysps_child_extdatatype'
			});
			const results = await Promise.allSettled([res5]);
			if (results[0].value.resultCode === 'S') {
				if (spatialData.value?.dataRange) {
					spatialData.value.dataRange = results[0].value.data[0].zdz;
				} else {
					spatialData.value = { dataRange: results[0].value.data[0].zdz };
				}
			}
		} catch (error) {
			console.error('中止计算:', error);
		}
	};

	onMounted(() => {
		getCatalogGetById();
		getMdDictDetailQuery();
	});

	onBeforeUnmount(() => {
		if (chart) {
			chart.dispose();
			chart = null;
		}
		if (chartRight) {
			chartRight.dispose();
			chartRight = null;
		}
		if (barChart) {
			barChart.dispose();
			barChart = null;
		}
		if (employmentChart) {
			employmentChart.dispose();
			employmentChart = null;
		}
		// 清理事件监听器
		window.removeEventListener('resize', () => chart && chart.resize());
		window.removeEventListener(
			'resize',
			() => chartRight && chartRight.resize()
		);
		window.removeEventListener('resize', () => barChart && barChart.resize());
		window.removeEventListener(
			'resize',
			() => employmentChart && employmentChart.resize()
		);
	});
</script>

<style lang="scss" scoped>
	.right {
		box-sizing: border-box;
		.result {
			text-align: right;
			margin-bottom: 0;
			img {
				width: 84%;
			}
		}
		.yearChartItem {
			background: url('@/assets/img/decisionTheater/jygw.png') no-repeat center
				center;
			background-size: 100% 100%;
			width: 100%;
			height: 114px;
			padding: 10px 20px;
			box-sizing: border-box;
			padding-right: 0;
			.yearChartItemTitle {
				font-size: 14px;
				color: #fff;
				font-family: 'YouSheBiaoTiHei';
			}
			.yearChartItemContent {
				font-size: 14px;
				color: #fff;
				height: 66px;
				overflow-y: auto;
				font-family: 'SourceHanSerifCN-Regular';
				letter-spacing: 1px;
				padding-right: 22px;
				box-sizing: border-box;
				padding-top: 4px;
			}
		}
		.yearCompare {
			display: flex;
			align-items: center;
			margin-bottom: 0px;
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
		.populationNumber {
			background: url('@/assets/img/decisionTheater/rksl.png') no-repeat center
				center;
			background-size: 100% 100%;
			width: 100%;
			height: 260px;
		}
		.populationNumber {
			.list {
				display: flex;
				padding: 18px 10px 0 10px;
				gap: 10px;
				span {
					color: #dbfaff;
					font-size: 16px;
					font-family: 'AlibabaPuHuiTi-95';
					&:last-child {
						margin-left: auto;
						color: #62dbed;
					}
				}
				&:last-child {
					padding-top: 4px;
				}
			}
			.populationNumberItem {
				width: 33.33%;
				text-align: center;
				p {
					font-size: 14px;
					color: #fff;
				}
				.populationNumberItemTitle {
					font-size: 16px;
					font-family: 'AlibabaPuHuiTi-85';
				}
				.populationNumberItemValue {
					font-size: 16px;
					color: #62dbed;
					font-family: 'AlibabaPuHuiTi-95';
				}
				.populationNumberItemRank {
					color: #6f8f94;
					font-family: 'AlibabaPuHuiTi-95';
					font-weight: 800;
					font-size: 64px;
					line-height: 123.48px;
					letter-spacing: 0px;
					vertical-align: middle;
				}
			}
			.two {
				.populationNumberItemTitle {
					padding-top: 40px;
				}
				.populationNumberItemValue {
					padding-top: 6px;
				}
				.populationNumberItemRank {
					line-height: 1;
				}
			}
			.one {
				.populationNumberItemTitle {
					padding-top: 0px;
				}
				.populationNumberItemValue {
					padding-top: 6px;
				}
				.populationNumberItemRank {
					line-height: 1;
				}
			}
			.three {
				.populationNumberItemTitle {
					padding-top: 72px;
				}
				.populationNumberItemValue {
					padding-top: 6px;
				}
				.populationNumberItemRank {
					line-height: 1;
				}
			}
		}
		.employmentChart {
			padding: 10px 36px 0;

			.employmentHeader {
				display: flex;
				align-items: center;
				margin-bottom: 20px;

				.employmentIcon {
					margin-right: 10px;

					img {
						width: 20px;
						height: 20px;
					}
				}

				.employmentTitle {
					color: #fff;
					font-size: 16px;
					font-family: 'YouSheBiaoTiHei';
				}
			}

			.employmentContent {
				position: relative;

				.chartContainer {
					height: 200px;
				}

				.chartLegend {
					position: absolute;
					top: 20px;
					right: 20px;
					z-index: 10;

					.legendItem {
						display: flex;
						align-items: center;
						margin-bottom: 8px;

						.legendColor {
							width: 12px;
							height: 8px;
							border-radius: 2px;
							margin-right: 6px;
						}

						span {
							color: #fff;
							font-size: 12px;
							font-family: 'AlibabaPuHuiTi-55';
							margin-right: 6px;
						}

						.legendValue {
							color: #00f6ff;
							font-weight: bold;
							font-size: 12px;
						}
					}
				}
			}
		}
	}
	.mi {
		padding: 0 8%;
		box-sizing: border-box;
	}
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
		.importantChoose {
			margin-bottom: 10px;
		}
		.important {
			display: flex;
			align-items: center;
			margin: 4px 0;
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
		.spaceData {
			font-family: 'YouSheBiaoTiHei';
			.body {
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: #093558;
				.div {
					height: 1.875rem;
					line-height: 1.875rem;
					font-family: 'SourceHanSerifCN-Light';
					font-weight: 300;
					font-size: 12px;
					text-align: center;

					&:nth-child(2) {
						color: #5cdaf5;
					}
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
				padding: 0 12px 0 16px;
				font-weight: 400;
				font-family: 'YouSheBiaoTiHei';
			}
		}
	}
	.mapBtnList {
		position: absolute;
		top: 14px;
		right: 30.3125rem;
		z-index: 1;
		& li {
			height: 2.6875rem;
			padding: 0 1.25rem;
			background-image: url('@/assets/img/mapBtnList.png');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-position: center center;
			&.active {
				background-image: url('@/assets/img/mapBtnList-active.png');
			}
		}
	}
</style>
