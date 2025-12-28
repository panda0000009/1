<!-- 推演引擎 -->
<template>
	<div class="pages">
		<Layout>
			<template #left>
				<div class="w-full h-full left">
					<SecondTile label="动态调控台" leftPadding="4.6875rem"></SecondTile>
					<div class="pl-[1.6875rem] pr-[0.4375rem]">
						<div class="w-full addText mt-3">
							<div class="addTextContent">
								<div class="addTextContentText">
									推演引擎是城市要素推演的计算入口，将八个模块之间的变量和参数充分融合，实现互相调用，从而构建完整的城市全系统计算流程。
								</div>
							</div>
							<img
								v-if="btnType !== 'add'"
								src="@/assets/img/deductionEngine/addBtn.png"
								class="addTextBtn cursor-pointer"
								@click="addProjectDialog" />
							<img
								v-if="btnType === 'add'"
								src="@/assets/img/deductionEngine/addBtnActive.png"
								class="addTextBtn cursor-pointer"
								@click="addProjectDialog" />
						</div>
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
									@select="projectChangedHandle">
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
								@click="handleTargetChange(target.value)">
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

						<!-- 场景体系 -->
						<Arrowhead
							class="my-3"
							name="选择单元、年份"
							direction="bottom"
							@directionChange="handleTitleToggle('unitYear')"></Arrowhead>
						<div
							v-show="titleStates.unitYear"
							class="w-full choose bg-[#112E46] py-4 pl-4 pr-[1.3125rem]">
							<div class="chooseContent mb-[0.8125rem] flex items-center">
								<Diamond name="推演层级"></Diamond>
								<el-select
									v-model="calculateMode"
									placeholder="请选择"
									popper-class="my-popper"
									style="width: 13.375rem; margin-left: 0.9375rem"
									@change="calculateModeChange">
									<el-option
										v-for="item in calculateModeList"
										:key="item.value"
										:label="item.label"
										:value="item.value" />
								</el-select>
							</div>
							<div class="chooseContent mb-[0.8125rem] flex items-center">
								<Diamond name="选择单元"></Diamond>
								<el-select
									v-model="dyCurrent"
									placeholder="请选择"
									popper-class="my-popper"
									style="width: 13.375rem; margin-left: 0.9375rem"
									@change="getRes()">
									<el-option
										v-for="item in dyList"
										:key="item.value"
										:label="item.label"
										:value="item.value" />
								</el-select>
							</div>
							<div class="chooseContent mb-[0.8125rem] flex items-center">
								<Diamond name="基准年份"></Diamond>
								<el-select
									v-model="basisYear"
									placeholder="请选择"
									popper-class="my-popper"
									style="width: 13.375rem; margin-left: 0.9375rem"
									@change="getRes()">
									<el-option
										v-for="item in basisYearList"
										:key="item.value"
										:label="item.label"
										:value="item.value" />
								</el-select>
							</div>
							<div class="chooseContent flex items-center">
								<Diamond name="预测年份"></Diamond>
								<el-select
									v-model="predictYear"
									placeholder="请选择"
									popper-class="my-popper"
									style="width: 13.375rem; margin-left: 0.9375rem"
									@change="getRes()">
									<el-option
										v-for="item in predictYearList"
										:key="item.value"
										:label="item.label"
										:value="item.value" />
								</el-select>
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
				<div
					class="w-[calc(100%-51.375rem)] h-[91.666666%] ml-[25.6875rem] pt-[1.5rem]">
					<RelationMap
						:relationTree="relationTrees"
						:carouselList="carouselList"
						ref="relationMap">
						<template #mapCon>
							<p class="absolute mapConTitle select-none" style="left: 2.5rem">
								{{ projectList.find(n => n.value == projectName)?.label || '' }}
							</p>
						</template>
					</RelationMap>
				</div>
			</template>
			<template #right>
				<div class="w-full h-[54.9375rem] right">
					<SecondTile
						:label="`数据仪表盘`"
						direction="right"
						rightPadding="4.5rem"></SecondTile>
					<div class="w-[23.125rem] ml-[0.875rem] my-[0.75rem]">
						<div class="resultContent w-full h-full">
							<Diamond name="指标概览分析"></Diamond>
							<div class="resultContentText h-[7.5625rem]">
								<div class="resultContentTextItem">
									{{ summary }}
								</div>
							</div>
						</div>
					</div>
					<Arrowhead
						class="my-3"
						name="人口规模指标变化"
						direction="left"
						:isChange="false" />
					<div class="pl-[0.875rem] mt-[0.75rem] h-[calc(100%-17rem)]">
						<div class="dbTable w-[23.125rem] h-full">
							<DbTableHeader
								:list="[
									{ name: '指标名称', class: 'w-30' },
									{ name: basisYear + '年', class: 'flex-1' },
									{ name: predictYear + '年', class: 'flex-1' },
									{ name: '变化率', class: 'w-[5.625rem]' }
								]"></DbTableHeader>
							<div class="dbTableBody">
								<div
									class="dbTableRow"
									v-for="item in resultQuery"
									:key="item"
									style="font-size: 14px">
									<span class="w-30 truncate" :title="item.indicatorName">{{
										item.indicatorName
									}}</span>
									<span
										class="flex-1 truncate"
										:class="
											Number(item.changeRate) < 0
												? 'green'
												: Number(item.changeRate) > 0
												? 'red'
												: ''
										"
										:title="convertData(item.monitorValue + item?.unit)"
										>{{ convertData(item.monitorValue + item?.unit) }}</span
									>
									<span
										class="flex-1 truncate"
										:class="
											Number(item.changeRate) < 0
												? 'green'
												: Number(item.changeRate) > 0
												? 'red'
												: ''
										"
										:title="convertData(item.predictValue + item?.unit)"
										>{{ convertData(item.predictValue + item?.unit) }}</span
									>
									<span
										class="w-[5.625rem] !color-white flex items-center justify-center">
										<img
											class="mr-2"
											src="@/assets/img/TimeSpaceRadar/up.png"
											alt=""
											width="13"
											height="10"
											v-if="Number(item.changeRate) > 0" />
										<img
											class="mr-2"
											src="@/assets/img/TimeSpaceRadar/down.png"
											alt=""
											width="13"
											height="10"
											v-if="Number(item.changeRate) < 0" />
										{{ Number(item.changeRate) < 0 ? '' : '+'
										}}{{ (item.changeRate * 100).toFixed(2) }}%
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
			type="F"
			projectId=""
			bizType=""
			:projectList="[]"
			@close="(modelValue = false), (btnType = '')"></AddProject>
	</div>
</template>
<script setup>
	import cityApi from '@/api/index.js';
	import { useAppStore } from '@/stores/modules/app.js';
	import { convertData } from '@/utils/calculation.js';
	import { getAssetsFile } from '@/utils/index.js';
	const useStore = useAppStore();
	import AddProject from '@/components/addProject/index.vue';
	import RelationMap from '@/components/relationMap/index.vue';
	import diamond from '@/assets/img/diamond.png';
	import buildLayer, {
		LayerType
	} from '@/components/map/primitive/layer/Layer';
	import { useMapStore } from '@/stores/modules/map.js';
	const mapStore = useMapStore();

	const titleStates = ref({
		project: true,
		scenario: true,
		target: true,
		unitYear: true,
		vector: false,
		summary: true
	});
	// 处理Title组件的切换事件
	const handleTitleToggle = key => {
		titleStates.value[key] = !titleStates.value[key];
	};
	const fast = ref(true);
	// 项目名称
	const projectName = ref('');
	const projectList = ref([]);

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

	// 选择项目的场景按钮（保留用于兼容）
	const activeProjectScenario = ref('spatial');

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

	// 计算模式
	const calculateMode = ref('区县');
	const calculateModeList = ref([
		{ value: '全市', label: '全市' },
		{ value: '区县', label: '区县' },
		{ value: '街道', label: '街道' },
		{ value: '网格', label: '网格' }
	]);
	// 基准年份
	const basisYear = ref('2024');
	const basisYearList = ref([
		{ value: '2024', label: '2024' },
		{ value: '2030', label: '2030' }
	]);
	// 预测年份
	const predictYear = ref('2030');
	const predictYearList = ref([
		{ value: '2030', label: '2030' },
		{ value: '2035', label: '2035' }
	]);
	// 选择单元
	const dyCurrent = ref('');
	const dyList = ref([]);
	const carouselList = ref([]);
	const summary = ref('');

	const relationMap = ref(null);
	const relationTree = ref(null);
	const relationTrees = ref(null);

	const planningWarningTopicInfos = ref([]);
	const activeZb = ref('');
	const indicatorNodeIds = ref('');
	const activeZbName = ref('');
	const historyForm = ref({
		adminFlag: '',
		current: 1,
		size: 0,
		endTime: '',
		eq_status: '',
		like_name: '',
		loginUser: '',
		eq_bizType: 'TYYQ',
		startTime: ''
	});
	const list = ref([]);

	const modelValue = ref(false);
	const btnType = ref(''); // add: 新建项目, history: 历史项目
	const resultQuery = ref([]); // 城市推演结果数据统计接口返回数据

	// 组件挂载后执行
	onMounted(() => {
		calculateModeChange(calculateMode.value);
		getCatalogGetById('ZBC073');
		handleScenarioChange('spatial')
		setTimeout(() => {
			handleVectorToggle(vectorDataList.value[0])
		}, 1 * 1000)
	});
	onUnmounted(() => {});

	const VecLayerOption = [
		{
			name: '全市',
			id: 'COID',
			label: 'CONAME',
			url: './datas/city.geojson'
		},
		{
			name: '区县',
			id: 'COID',
			label: 'CONAME',
			url: './datas/country.geojson'
		},
		{
			name: '街道',
			id: 'STID',
			label: 'SNAME',
			url: './datas/street.json'
		},
		{
			name: '网格',
			id: 'TID',
			label: 'TID',
			url: './datas/grid.geojson'
		}
	];

	// 推演层级改变时执行
	const calculateModeChange = value => {
		const layer = VecLayerOption.find(item => item.name === value);
		if (layer) {
			changeLyrRenderByVals(layer);
		}
	};
	/**
	 * 根据层级信息加载地理数据并更新下拉列表
	 * @param {Object} layer - 层级配置对象，包含url、id、label等属性
	 */
	const changeLyrRenderByVals = layer => {
		dyList.value = [];
		dyCurrent.value = '';
		let list = [];
		fetch(layer.url)
			.then(response => response.json())
			.then(data => {
				const features = data.features || [];
				features.forEach(item => {
					const properties = item.properties || {};
					// 安全地获取属性值并转换为字符串，避免null/undefined错误
					const idValue = properties[layer.id];
					const labelValue = properties[layer.label];
					// 只有当id和label值都存在时才添加到列表中
					if (
						idValue !== undefined &&
						idValue !== null &&
						labelValue !== undefined &&
						labelValue !== null
					) {
						list.push({
							value: idValue.toString(),
							label: labelValue.toString()
						});
					}
				});
				dyList.value = list;
				if (fast.value) {
					dyCurrent.value = list[0]?.value || '';
					fast.value = false;
				}
			})
			.catch(error => {
				console.error('加载地理数据失败:', error);
			});
	};
	// 新建项目
	const addProjectDialog = () => {
		btnType.value = 'add';
		modelValue.value = true;
	};
	// 历史项目
	const historyDialog = () => {
		btnType.value = 'history';
		modelValue.value = true;
	};
	// 查看更多
	const handleMore = () => {
		btnType.value = 'history';
		modelValue.value = true;
	};
	// 指标改变时执行
	const zbChange = item => {
		activeZb.value = item.nodeId;
		activeZbName.value = item.nodeName;
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
		const ids = collectIndicatorNodeIds(item.children).ids;
		indicatorNodeIds.value = ids.join(',');
		getRes();
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
				handleTargetChange(targetList.value[0].value);
			}
		} catch (error) {
			console.error('查询城市推演项目记录信息失败:', error);
		}
	};

	// 获取项目接口
	const initProjects = async () => {
		historyForm.value.adminFlag = useStore.userInfo?.adminFlag || '1';
		try {
			const res = await cityApi.projectQueryWithPage(historyForm.value);
			if (res.resultCode === 'S') {
				list.value = res.data?.filter(item => item.status === '3');
				projectList.value = list.value.map(item => ({
					value: item.id,
					label: item.name,
					data: item
				}));
				nextTick();
				projectName.value = projectList.value[0]?.value;
				projectChangedHandle(projectName.value);
			}
		} catch (error) {
			console.error('查询城市推演项目记录信息失败:', error);
		}
	};
	// 项目切换事件
	// 场景体系选择
	const handleScenarioChange = async value => {
		if (value == 'spatial') {
			activeScenario.value = value;
			historyForm.value.eq_bizType = 'TYYQ';
			await initProjects();
		}
		if (value == 'economy') {
			activeScenario.value = value;
			historyForm.value.eq_bizType = 'TYYQ_CYZX';
			await initProjects();
		}
	};

	// 选择目标
	const handleTargetChange = value => {
		activeTarget.value = value;
		// 根据目标更新相关数据
		let item = targetList.value.find(m => m.value == value);
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

	// 选择项目的场景按钮选择
	const handleProjectScenarioChange = value => {
		activeProjectScenario.value = value;
		// 根据场景更新项目列表或相关数据
	};

	const projectChangedHandle = async value => {
		projectName.value = value;
		let projectInfo = list.value.find(n => n.id == value);
		if (projectInfo) {
			calculateModeList.value = projectInfo.rangeType.split(',').map(m => {
				return { value: m, label: m };
			});
			basisYearList.value = projectInfo.baseYear.split(',').map(m => {
				return { value: m, label: m };
			});
			basisYear.value = basisYearList.value[0].value;
			predictYearList.value = projectInfo.predictYear.split(',').map(m => {
				return { value: m, label: m };
			});
			predictYear.value = predictYearList.value[0].value;
			await getZb();
			const targetItem = relationTree.value.find(
				item => item.citySPSFlag === '1'
			);
			zbChange(targetItem);
		}
	};
	// 专门获取指标树接口
	const getZb = async () => {
		try {
			const res = await cityApi.resultTree({
				current: 1,
				size: 1000,
				array_indicatorId: indicatorNodeIds.value || '',
				eq_indicatorId: '', // 指标ID
				projectType: 'MAIN',
				eq_projectId: projectName.value, // 推演项目ID
				eq_predictYear: predictYear.value, // 目标年份
				eq_regionLevel: '', // 行政区级别，全市、区县、街道、网格
				eq_xzqdm: dyCurrent.value || '', // 行政区代码
				like_indicatorName: '' // 指标名称
			});
			if (res.resultCode === 'S') {
				if (res.data?.length > 0) {
					if (!relationTree.value) {
						relationTree.value = res.data || [];
					}
					planningWarningTopicInfos.value = [];
					res.data.forEach(item => {
						planningWarningTopicInfos.value.push({
							...item,
							label: item.nodeName,
							disabled: item?.citySPSFlag
						});
					});
					// summary.value =
					// 	res.data.find(n => n.nodeName == activeZbName.value)?.summary || '';
				}
			}
		} catch (error) {
			console.error('专门获取指标树接口:', error);
		}
	};
	// 最后获取结果接口
	const getRes = async () => {
		try {
			indicatorNodeIds.value = '';
			let item = targetList.value.find(m => m.value == activeTarget.value);
			item.children.forEach(m => {
				let ids = m.children.map(n => n.nodeId).toString();
				indicatorNodeIds.value = indicatorNodeIds.value.concat(
					indicatorNodeIds.value?.length ? ',' + ids : ids
				);
			});

			const res = await cityApi.commonStatistic({
				current: 1,
				size: 1000,
				dynamicParam: [
					{
						childProjectId: '',
						detailParams: [
							{
								adjustValue: 0,
								indicatorId: ''
							}
						]
					}
				],
				array_indicatorId: indicatorNodeIds.value || '',
				eq_indicatorId: '', // 指标ID
				eq_projectId: projectName.value, // 推演项目ID
				eq_predictYear: predictYear.value, // 目标年份
				eq_regionLevel: '', // 行政区级别，全市、区县、街道、网格
				eq_xzqdm: dyCurrent.value || '', // 行政区代码
				like_indicatorName: '', // 指标名称
				projectType: 'MAIN'
			});
			if (res.resultCode === 'S') {
				const data = res.data || [];
				const res2 = await cityApi.catalogGetById({
					catalogId: 'ZBC001'
				});
				relationTrees.value = res2.data.tree || [];

				const targetItem = relationTree.value.find(
					m => m.nodeId == activeZb.value
				);
				summary.value = targetItem?.summary || '';

				let treeNode = planningWarningTopicInfos.value.find(
					m => m.nodeId == activeZb.value
				);
				// 获取所有指标
				let cloneNode = JSON.parse(JSON.stringify(treeNode));
				let allThemeIndicators = [];
				cloneNode.children.forEach(m => {
					let indicators = [];
					m.children.forEach(n => {
						indicators = indicators.concat(n.children);
					});
					allThemeIndicators = allThemeIndicators.concat(indicators);
				});
				resultQuery.value = data.indicatorData.map(n => {
					let indi = allThemeIndicators.find(m => n.indicatorId == m.nodeId);
					return Object.assign(n, { unit: indi.unit });
				});

				// 关系图谱展示
				if (activeZb.value) {
					let projInfo = list.value.find(n => n.id == projectName.value);

					let ids = projInfo.indicatorIds.split(',');
					cloneNode.children.forEach(m => {
						// m.children = m.children.filter(n => ids.includes(n.nodeId));
						// // 给结点赋值，目录树图谱使用
						// m.children.forEach(m => {
						// 	let indiRes = res.data?.indicatorData?.find(
						// 		n => n.indicatorId == m.nodeId
						// 	);
						// 	if (indiRes) {
						// 		m.calculateResult = Object.assign(indiRes, {
						// 			unit: m.unit,
						// 			module: 'DeductionEngine'
						// 		});
						// 	}
						// });
						m.children.forEach(n => {
							n.children.forEach(k => {
								if (ids.includes(k.nodeId)) {
									let indiRes = res.data?.indicatorData?.find(
										h => h.indicatorId == k.nodeId
									);
									if (indiRes) {
										k.calculateResult = Object.assign(indiRes, {
											unit: k.unit,
											module: 'DeductionEngine'
										});
									}
								}
							});
						});
					});
					if (relationMap.value) {
						// relationMap.value.focusData(cloneNode);
						setTimeout(() => {
							relationMap.value.focusData(relationTrees.value[0]);
						}, 2 * 100);
					}

					// 轮动轮播指标
					carouselList.value =
						data?.indicatorData.map(m => {
							let nodeInfo = null;
							cloneNode.children.forEach(k => {
								k.children.forEach(n => {
									n.children.forEach(h => {
										if (h.nodeId == m.indicatorId) {
											nodeInfo = h;
											return;
										}
									});
								});
							});
							return {
								nodeName: m.indicatorName,
								nodeValue: (m.monitorValue || 0) + (nodeInfo?.unit || ''),
								nodeValue2: (m.predictValue || 0) + (nodeInfo?.unit || '')
							};
						}) || [];
				}
			}
		} catch (error) {
			console.error('最后获取结果接口:', error);
		}
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
		position: relative;
		box-sizing: border-box;
		.add {
			img {
				width: 80%;
			}
		}
		.addText {
			background-image: url('@/assets/img/deductionEngine/addBg.png');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-position: center center;
			height: 9.625rem;
			position: relative;

			.addTextContent {
				color: #c4c4c4;
				padding: 1.4375rem 1.3125rem 0.5rem 1.4375rem;
				box-sizing: border-box;
				letter-spacing: 2px;

				.addTextContentText {
					overflow: auto;
					font-family: 'SourceHanSerifCN-Regular';
					font-weight: 400;
					font-size: 14px;
					line-height: 20px;
					letter-spacing: 0px;
					vertical-align: middle;
				}
			}

			.addTextBtn {
				height: 30px;
				width: 140px;
				position: absolute;
				left: 120px;
				bottom: 30px;
			}

			.historyBtn {
				height: 30px;
				width: 140px;
				position: absolute;
				right: 40px;
				bottom: 30px;
			}
		}
		.chooseAdd {
			padding: 30px 0 20px 0;
		}
		.choose {
			.chooseContent {
				.chooseIcon {
					width: 20px;
					height: 20px;
				}

				.chooseContentTitle {
					color: #fff;
					margin-left: 10px;
					font-family: 'YouSheBiaoTiHei';
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

	.right {
		box-sizing: border-box;
		.result {
			text-align: right;
			margin-bottom: 20px;

			img {
				width: 80%;
			}
		}
		.db {
			padding: 30px 0 20px 0;
		}
		.dbTable {
			background-color: #112e46;
			box-sizing: border-box;

			.dbTableBody {
				height: calc(100% - 2.25rem);
				overflow: auto;
				padding-left: 0.375rem;
				.dbTableRow {
					display: flex;
					align-items: center;
					justify-content: space-between;
					span {
						font-family: 'AlibabaPuHuiTi-55';
						font-size: 12px;
						font-weight: 400;
						padding: 0 8px;
						text-align: center;
						height: 30px;
						line-height: 30px;
					}
					.red {
						color: #ff2836;
					}
					.green {
						color: #10d562;
					}
				}
				.dbTableRow:nth-child(even) {
					background: rgba(16, 91, 146, 0.5);
				}
			}
		}
	}
</style>
