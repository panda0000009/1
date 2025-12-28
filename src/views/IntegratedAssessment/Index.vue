<!-- 城市预警雷达 -->
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
									v-model="selectedProjectInfo"
									v-show="titleStates.project"
									:options="projectOpts"
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
									@select="initRadarStatisticInfo">
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
									@select="initRadarStatisticInfo">
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
						<!-- 智能总结 -->
						<Arrowhead
							class="my-3"
							name="智能总结"
							direction="bottom"
							@directionChange="handleTitleToggle('report')"></Arrowhead>
						<SmartSummary
							v-show="titleStates.report"
							headerName="生成智能评估报告"
							title="评估结果分析"
							:type ="'integratedAssessment'"
							:Info="reportInfo"
							@handleClick="exportReportHandle"></SmartSummary>
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
				<MaxMap ref="maxMapRef" v-if="showType == 1">
					<template #mapCon>
						<p class="absolute mapConTitle select-none">
							{{
								completedProjectInfos.find(n => n.id == selectedProjectInfo)
									?.name
							}}
						</p>
					</template>
				</MaxMap>
				<div
					v-else
					class="w-[calc(100%-51.375rem)] h-[91.666666%] ml-[25.6875rem] pt-[1.5rem]">
					<RelationMap
						:zbBg="true"
						:relationTree="relationTree"
						:carouselList="carouselList"
						ref="relationMap">
						<template #mapCon>
							<p class="absolute mapConTitle showType2 select-none">
								{{
									completedProjectInfos.find(n => n.id == selectedProjectInfo)
										?.name
								}}
							</p>
						</template>
					</RelationMap>
				</div>
			</template>
			<template #right>
				<!-- 第一张 -->
				<div class="w-full h-full right" v-if="rightShowType === 1">
					<SecondTile
						label="数据仪表盘"
						direction="right"
						rightPadding="3.9375rem"></SecondTile>
					<div class="pl-[0.375rem] pr-[2.1875rem]">
						<Arrowhead
							class="my-3"
							:name="indicatorGenealTile"
							direction="left"
							:isChange="false">
						</Arrowhead>
						<div class="relative h-[12.0625rem] bg-[#112e46]">
							<pieChart3D :optionsData="optionsData"></pieChart3D>
						</div>
						<Arrowhead
							class="my-3"
							:name="indicatorDetailTile"
							direction="left"
							selWidth="8.125rem"
							:isChange="false">
							<el-select
								v-model="warningValue"
								placeholder="危险/警告/安全"
								popper-class="my-popper"
								size="small"
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
							class="warningInfo select-none h-[12.25rem] py-2 pl-[0.3125rem] bg-[#112e46]">
							<template v-if="warningList.length > 0">
								<div
									class="w-full h-full overflow-hidden overflow-y-auto pr-[0.5625rem]">
									<div
										class="warningInfoItem relative flex items-center overflow-hidden"
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
												v-model="item.slide"
												:class="item.type"
												disabled />
										</div>
										<span
											class="warningInfoItemTitle absolute w-[calc(100%-130px)] overflow-hidden text-ellipsis whitespace-nowrap"
											>{{ item.name }}</span
										>
										<span class="warningInfoItemValue absolute"
											>{{ item.value > 0 ? '超' : '缺' }}{{ item.value }}%</span
										>
									</div>
								</div>
							</template>
							<div
								v-else
								class="w-full h-full flex items-center justify-center">
								<p
									v-if="warningValue === 'safe'"
									class="emptyTxt bg-[#3065CE] text-[#fff] px-10 w-[17.625rem] h-[1.875rem] border border-solid border-white">
									未查询到相关信息，请重新查询
								</p>
								<p
									v-if="warningValue === 'warning'"
									class="emptyTxt bg-[#F7B500] text-[#fff] px-10 w-[17.625rem] h-[1.875rem] border border-solid border-white">
									未查询到相关信息，请重新查询
								</p>
								<p
									v-if="warningValue === 'danger'"
									class="emptyTxt bg-[#9E3429] text-[#fff] px-10 w-[17.625rem] h-[1.875rem] border border-solid border-white">
									未查询到相关信息，请重新查询
								</p>
							</div>
						</div>
						<Arrowhead
							class="my-3"
							:name="indicatorWarnTile"
							direction="left"
							selWidth="8.125rem"
							:isChange="false">
							<el-select
								v-model="filterIndicatorsValue"
								placeholder="请选择"
								popper-class="my-popper"
								clearable
								placement="bottom-end"
								size="small"
								style="width: 8.125rem"
								@change="handleIndicatorTypeChange">
								<el-option
									v-for="item in filterIndicators"
									:key="item.value"
									:label="item.label"
									:value="item.value" />
							</el-select>
						</Arrowhead>
						<div class="zbszTable bg-[#112e46] h-[17.0625rem]">
							<DbTableHeader
								:list="[
									{ name: '指标名称', class: 'w-30' },
									{ name: '规划值', class: 'w-[4.625rem]' },
									{ name: '推演值', class: 'w-[4.625rem]' },
									{ name: '偏差率', class: 'flex-1' }
								]"></DbTableHeader>
							<div class="zbszTableBody overflow-hidden overflow-y-auto pl-2">
								<div class="zbszTableRow" v-for="item in tableList" :key="item">
									<div class="w-[7rem]" :title="item.indicatorName">
										{{ item.indicatorName }}
									</div>
									<div
										class="w-[4.625rem]"
										:class="
											item.type === 'up' ? 'text-[#FF2836]' : 'text-[#10D562]'
										"
										:title="item.planValue + item.unit">
										{{ convertData(item.planValue + item.unit) }}
									</div>
									<div
										class="w-[4.625rem]"
										:class="
											item.type === 'up' ? 'text-[#FF2836]' : 'text-[#10D562]'
										"
										:title="item.predictValue + item.unit">
										{{ convertData(item.predictValue + item.unit) }}
									</div>
									<div class="flex-1">
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
				</div>
				<!-- 第三张 -->
				<div class="w-full h-full right" v-if="rightShowType === 3">
					<SecondTile
						label="数据仪表盘"
						direction="right"
						rightPadding="3.9375rem"></SecondTile>
					<div class="pl-[0.375rem] pr-[2.1875rem]">
						<Arrowhead
							class="my-3"
							name="全市总体情况"
							direction="left"
							:isChange="false"></Arrowhead>
						<div
							class="overall-status-section pt-[1.375rem] pl-[3.375rem] pr-4 h-[9.3125rem]">
							<div class="flex items-center">
								<!-- 左侧图标 -->
								<div
									class="status-icon-wrapper relative flex items-center justify-center w-[6.75rem] h-[6.75rem] mr-[1.625rem]">
									<img
										src="@/assets/img/3195.png"
										class="w-full h-full"
										alt="" />
								</div>
								<!-- 右侧信息 -->
								<div
									class="status-info-wrapper flex-1 flex items-center justify-between">
									<div>
										<div class="status-info-item mb-3">
											<p
												class="status-label indicator-name-truncate"
												:title="shouldShowTitle ? fullIndicatorName : ''">
												{{ truncatedIndicatorName }}:
											</p>
											<p
												class="status-value_p my-[0.75rem]"
												:class="{ 'scale-down': shouldScaleDown }">
												{{ jobHousingRatio }}
												<span>{{ jobHousingRatioUnit }}</span>
											</p>
										</div>
										<div class="status-info-item mb-3">
											<span class="status-label">等级:</span>
											<span
												class="status-value"
												:class="getAlertLevelClass(alertLevel)"
												>{{ alertLevel }}</span
											>
										</div>
									</div>
									<!-- 图例 -->
									<div class="status-legend mt-2">
										<div class="legend-item flex items-center mb-[0.625rem]">
											<div class="legend-square safe"></div>
											<span class="legend-text">安全</span>
										</div>
										<div class="legend-item flex items-center mb-[0.625rem]">
											<div class="legend-square warning"></div>
											<span class="legend-text">警告</span>
										</div>
										<div class="legend-item flex items-center">
											<div class="legend-square danger"></div>
											<span class="legend-text">危险</span>
										</div>
									</div>
								</div>
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
						<!-- TODO:1 -->
						<div
							v-if="activeScenario == 'spatial'"
							class="job-housing-chart bg-[#112e46] p-4 relative h-[11.625rem]">
							<div class="chart-legend absolute right-4 z-2">
								<div class="legend-item flex items-center">
									<div class="legend-square safe"></div>
									<span class="legend-text">安全</span>
								</div>
								<div class="legend-item flex items-center">
									<div class="legend-square warning"></div>
									<span class="legend-text">警告</span>
								</div>
								<div class="legend-item flex items-center">
									<div class="legend-square danger"></div>
									<span class="legend-text">危险</span>
								</div>
							</div>
							<div style="width: 100%; height: 100%">
								<ECharts
									:option="jobHousingChartOpt()"
									:resize="false"></ECharts>
							</div>
						</div>
						<!-- TODO:1 -->
						<div
							v-if="activeScenario == 'economy'"
							class="job-housing-chart bg-[#112e46] p-4 relative h-[11.625rem]">
							<div class="chart-legend absolute left-1/2 
									-translate-x-1/2
									flex items-center gap-2 z-2">
								<div class="legend-item flex items-center">
									<div class="legend-square safe"></div>
									<span class="legend-text">安全</span>
								</div>
								<div class="legend-item flex items-center">
									<div class="legend-square warning"></div>
									<span class="legend-text">警告</span>
								</div>
								<div class="legend-item flex items-center">
									<div class="legend-square danger"></div>
									<span class="legend-text">危险</span>
								</div>
							</div>
							<div style="width: 100%; height: 100%">
								<ECharts
									:option="jobHousingChartOpt()"
									:resize="false"></ECharts>
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
									v-model="warningValue2"
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
						<div class="duibi bg-[#112e46]" v-if="activeScenario == 'spatial'">
							<WarningInfo
								:warningList="warningList"
								:zbList="zbList"
								:warningValue2="warningValue2"
								:activeZb="activeZb"></WarningInfo>
						</div>
						<div
							v-if="activeScenario == 'economy'"
							class="job-housing-chart bg-[#112e46] p-4 relative h-[11.625rem]">
							<div class="chart-legend absolute left-1/2 
									-translate-x-1/2
									flex items-center gap-2 z-2">
								<div class="legend-item flex items-center">
									<div class="legend-square safe"></div>
									<span class="legend-text">安全</span>
								</div>
								<div class="legend-item flex items-center">
									<div class="legend-square warning"></div>
									<span class="legend-text">警告</span>
								</div>
								<div class="legend-item flex items-center">
									<div class="legend-square danger"></div>
									<span class="legend-text">危险</span>
								</div>
							</div>
							<div style="width: 100%; height: 100%">
								<ECharts
									:option="jobHousingChartOpt()"
									:resize="false"></ECharts>
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
	import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
	import MaxMap from '@/components/mapView/maxMap.vue';
	import RelationMap from '@/components/relationMap/index.vue';
	import ZbListCom from '@/components/lists/zbList.vue';
	import SmartSummary from '@/components/SmartSummary.vue';
	import WarningInfo from '@/components/WarningInfo.vue';
	import * as echarts from 'echarts';
	import ECharts from '@/components/eCharts/index.vue';
	import { convertData } from '@/utils/calculation.js';
	import { getAssetsFile } from '@/utils/index.js';
	import danger from '@/assets/img/TimeSpaceRadar/danger.png';
	import warning from '@/assets/img/TimeSpaceRadar/warning.png';
	import safe from '@/assets/img/TimeSpaceRadar/safe.png';
	import diamond from '@/assets/img/diamond.png';
	import AddProject from '@/components/addProject/index.vue';
	import pieChart3D from './components/PieChart-3d.vue';
	import pieThird from './components/pieThird.vue';
	import cityApi from '@/api/index.js';
	import { radarApi } from '@/api/radar/index.js';
	const rdarApi = radarApi();
	import buildLayer, {
		LayerType
	} from '@/components/map/primitive/layer/Layer';
	import { useMapStore } from '@/stores/modules/map.js';
	const mapStore = useMapStore();

	const maxMapRef = ref(null);
	// 统一管理所有Title组件的状态
	const titleStates = ref({
		project: true,
		scenario: true,
		target: true,
		indicator: true,
		unitYear: true,
		vector: false,
		report: true,
		summary: true,
		showType: true,
		year: true,
		topic: true,
		dy: true,
		ys: true,
		zbType: true,
		jtzb: true
	});
	// 处理Title组件的切换事件
	const handleTitleToggle = key => {
		titleStates.value[key] = !titleStates.value[key];
	};

	// 选择目标
	const activeTarget = ref('');
	const targetList = ref([
		{
			value: 'ZBC067',
			label: '人口承载能力增强'
		},
		{
			value: 'ZBC068',
			label: '综合服务功能提升'
		}
	]);

	const reportInfo = ref({})
	const selectedIndicatorInfo = ref(null);

	// 柱状图
	const barData = ref([
		{
			name: '中心城区',
			value: 1.2,
			grade: 1,
		},
		{
			name: '外围地区',
			value: 1.8,
			grade: 1
		}
	]);
	const jobHousingChartOpt = indicatorInfo => {
		// 根据数据项数量动态调整配置
		const dataCount = barData.value.length;
		// 当数据项较多时（如三核四极有7项），需要调整柱宽和字体大小
		const isManyItems = dataCount > 3;
		// 数据项非常多时（如7项以上）
		const isVeryManyItems = dataCount > 5;

		// 动态计算柱宽：数据项少时用固定宽度，数据项多时按比例缩小，避免重叠
		const barWidth = isVeryManyItems
			? Math.max(20, Math.floor(250 / dataCount))  // 数据项很多时进一步缩小
			: isManyItems
			? Math.max(25, Math.floor(280 / dataCount))
			: 80;

		// 动态调整字体大小
		const labelFontSize = isVeryManyItems ? 10 : isManyItems ? 12 : 24;
		const axisLabelFontSize = isVeryManyItems ? 8 : isManyItems ? 10 : 12;

		// 动态调整底部空间，为标签留出更多空间
		const gridBottom = isVeryManyItems ? '15%' : isManyItems ? '12%' : '0%';

		// 动态调整标签旋转角度
		const labelRotate = isVeryManyItems ? -30 : isManyItems ? -20 : 0;

		let defaultOpt = {
			grid: {
				left: '3%',
				right: '3%',
				bottom: gridBottom,
				top: '28%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data: barData.value.map(m => m.name),
				axisLabel: {
					color: '#fff',
					fontSize: axisLabelFontSize,
					fontFamily: 'SourceHanSansCN-Regular',
					margin: isVeryManyItems ? 6 : isManyItems ? 8 : 12,
					// 当数据项多时，旋转标签以避免重叠
					rotate: labelRotate,
					interval: 0, // 强制显示所有标签
					// 当数据项很多时，使用换行显示
					formatter: isVeryManyItems
						? function(value) {
							// 如果名称较长，尝试换行
							if (value.length > 4) {
								return value.substring(0, 4) + '\n' + value.substring(4);
							}
							return value;
						}
						: undefined
				}
			},
			yAxis: {
				type: 'value',
				name: `${selectedIndicatorInfo.value?.nodeName || ' '}（${
					selectedIndicatorInfo.value?.unit || ' '
				}）`, // '职住比（%）',
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
			series: [
				{
					type: 'bar',
					barWidth: barWidth,
					// 增加柱子之间的间距，避免重叠
					barCategoryGap: isVeryManyItems ? '30%' : isManyItems ? '40%' : '50%',
					data: barData.value.map(m => m.value),
					itemStyle: {
						// color: function (params) {
						// 	const value = params.value;
						// 	if (value > 1.5) {
						// 		return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						// 			{ offset: 0, color: '#38B4DD' },
						// 			{ offset: 1, color: '#264188' }
						// 		]);
						// 	} else if (value < 1.5) {
						// 		return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						// 			{ offset: 0, color: '#BD3329' },
						// 			{ offset: 1, color: '#F58F32' }
						// 		]);
						// 	} else {
						// 		return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						// 			{ offset: 0, color: '#BD3329' },
						// 			{ offset: 1, color: '#F58F32' }
						// 		]);
						// 	}
						// },
						color: function (params) {
							let item = barData.value.find(m => m.name == params.name).grade
							console.log(item)
							const value = params.value;
							if (["0"].includes(item)) {
								return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{ offset: 0, color: '#38B4DD' },
									{ offset: 1, color: '#264188' }
								]);
							}
							if (["1", "3"].includes(item)) {
								return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{ offset: 0, color: '#9D8933' },
									{ offset: 1, color: '#705C1D' }
								]);
							}
							if (["2", "4"].includes(item))   {
								return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{ offset: 0, color: '#BD3329' },
									{ offset: 1, color: '#F58F32' }
								]);
							}
						},
						borderWidth: 0
					},
					label: {
						show: true,
						// 当数据项很多时，如果柱子太窄，改为顶部显示
						position: isVeryManyItems ? 'top' : 'inside',
						formatter: '{c}', // + (selectedIndicatorInfo.value?.unit || ''),
						textStyle: {
							color: '#fff',
							fontSize: labelFontSize,
							fontFamily: 'AlibabaPuHuiTi-75'
						},
						// 当标签在顶部时，调整距离
						distance: isVeryManyItems ? 5 : undefined
					}
				}
			]
		};

		if (barChartData.value.afterProject === 0) {
			return defaultOpt;
		}
		return defaultOpt;
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

	// 场景体系选择
	const handleScenarioChange = async value => {
		// 根据场景更新相关数据
		// getCatalogGetById('ZBC053');
		if (value == 'spatial') {
			activeScenario.value = value;
			await initProjects('ZHPG');
		}
		if (value == 'economy') {
			activeScenario.value = value;
			await initProjects('ZHPG_CYZX');
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
			mapStore?.activeMap?.lyrManager.addLayer(item.id, baseLyr3);
		}
	};

	const exportReportHandle = () => {};

	// 生成智能评估报告
	const handleGenerateReport = () => {
		// 生成报告的逻辑
		console.log('生成智能评估报告');
		// 这里可以添加生成报告的具体逻辑
	};

	// 获取数据（getRes方法，如果不存在则添加占位）
	const getRes = async () => {
		// 根据选择的单元和年份获取数据
		// 这里可以调用API获取数据
	};

	const rightShowType = ref(3); // 展示右面图表

	const idicatorsEvaluationLevel = ref('安全');
	const idicatorsEvaluationScore = ref('65');
	const pieThirdOptions = ref(null);

	// 全市总体情况相关
	const jobHousingRatio = ref('10.5');
	const jobHousingRatioUnit = ref('%');
	const alertLevel = ref('安全');

	// 获取预警等级样式类
	const getAlertLevelClass = level => {
		if (level === '安全') return 'alert-safe';
		if (level === '警告') return 'alert-warning';
		if (level === '危险') return 'alert-danger';
		return '';
	};

	// 获取指标名称全称（用于title提示）
	const fullIndicatorName = computed(() => {
		return selectedIndicatorInfo.value?.nodeName || '职住比';
	});

	// 截断指标名称（超过6个字符时显示省略号）
	const truncatedIndicatorName = computed(() => {
		const name = selectedIndicatorInfo.value?.nodeName || '职住比';
		if (name.length > 6) {
			return name.substring(0, 6) + '...';
		}
		return name;
	});

	// 判断是否需要截断（用于控制title显示）
	const shouldShowTitle = computed(() => {
		return (selectedIndicatorInfo.value?.nodeName || '职住比').length > 7;
	});

	// 获取完整的数值显示内容（用于判断是否需要缩小字体）
	const fullValueText = computed(() => {
		return (jobHousingRatio.value || '') + (jobHousingRatioUnit.value || '');
	});

	// 判断是否需要缩小字体（当内容超过7个字符时）
	const shouldScaleDown = computed(() => {
		return fullValueText.value.length > 7;
	});

	const relationMap = ref(null);
	const relationTree = ref(null);

	// 预警信息
	const warningValue = ref('');
	const warningValue2 = ref('全部区县');
	const warningInfoList = ref([
		{ value: '-1', label: '全部' },
		{ value: 'safe', label: '安全' },
		{ value: 'warning', label: '警告' },
		{ value: 'danger', label: '危险' }
	]);
	// 选择要素
	const dyCurrent = ref('区县');
	const dyList = ref([
		{ value: '区县', label: '区县' },
		{ value: '街道', label: '街道' },
		{ value: '网格', label: '网格' }
	]);
	const tableList = ref([]);
	// const yearCurrent = ref('2024');
	// const yearList = ref([
	// 	{ value: '2024', label: '2024年' },
	// 	{ value: '2030', label: '2030年' },
	// 	{ value: '2035', label: '2035年' }
	// ]);

	// 中心外围情况相关
	const selectedDistrict = ref('中心外围');
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
	// 区县镇街情况相关
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
	// const baseYear = ref(2024);
	// const mirrorData = ref(null);

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

	// 选择指标
	const activeLx = ref('');
	const lxList = ref([]);
	const zbList = ref([]);
	// 城市预警雷达饼状图
	const optionsData = ref(null);
	// 选择项目
	const modelValue = ref(false);
	const btnType = ref(''); // add: 新建项目, history: 历史项目
	const selectedProjectInfo = ref('');
	const projectOpts = ref([{ value: '0', label: '新建推演项目' }]);

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

	// 选择项目的场景按钮
	const activeProjectScenario = ref('spatial');
	const completedProjectInfos = ref([{ value: '0', label: '新建推演项目' }]);

	const indicatorInfoList = ref([]);
	const handleMore = () => {
		btnType.value = 'history';
		modelValue.value = true;
	};

	// 展示方式数组
	const showType = ref(1);
	const showTypeList = ref([
		{ value: 1, label: '预警地图' },
		{ value: 2, label: '预警指标图谱' }
	]);
	const handleShowType = index => {
		if (index === 1) {
			rightShowType.value = 3;
			nextTick(() => {
				chartFn(); // 仪表盘
			});
		} else {
			rightShowType.value = 1;
		}
		titleStates.value = {
			project: true,
			scenario: true,
			target: true,
			indicator: true,
			unitYear: true,
			vector: true,
			report: true,
			summary: true,
			showType: true,
			year: true,
			topic: true,
			dy: true,
			ys: true,
			zbType: true,
			jtzb: true
		};
		showType.value = index;
		initRadarStatisticInfo();
	};

	// 选择功能数组
	const functionCurrent = ref(1);
	const functionList = ref([
		{ value: 0, label: '指标图谱' },
		{ value: 1, label: '指标对比' }
	]);
	// 选择功能
	const handleFunction = index => {
		functionCurrent.value = index;
	};

	// 选择年份数组（已更新为动态评估的值）
	const yearCurrent = ref('2024');
	const yearList = ref([
		{ value: '2024', label: '2024年' },
		{ value: '2030', label: '2030年' },
		{ value: '2035', label: '2035年' }
	]);

	// 轮播图
	const carouselList = ref([]);
	// 推测年份
	const baseYear = ref('2024');
	const predictYear = ref('2030');

	// 选择专题数组
	const activeZt = ref('');
	const activeZb = ref('');
	const planningWarningTopicInfos = ref([]); // 专题原始数据
	const specialList = ref([]);
	const radarStatisticInfo = ref(null);

	// 选择单元数组
	const chooseUnitCurrent = ref('区县');
	const chooseUnitList = ref([
		{ value: '区县', label: '区县' },
		{ value: '街道', label: '街道' }
	]);

	// 显示标题
	const indicatorGenealTile = ref('指标预警概况（白云区）');
	const indicatorDetailTile = ref('指标详情（白云区）');
	const indicatorWarnTile = ref('规划达成情况（白云区）');

	const chartRef = ref(null); // 仪表盘
	let chart = null;
	const warningList = ref([]);
	const filterIndicatorsValue = ref('');
	const filterIndicators = ref([
		{ value: '全部', label: '全部' },
		{ value: '超出', label: '超出' },
		{ value: '缺额', label: '缺额' }
	]);

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

	// 仪表盘
	const chartFn = (dataVal = 0) => {
		if (!chartRef.value) return;

		let max = dataVal;
		if (isNaN(max)) max = 0;
		if (max < 0) max = 0;
		if (max > 100) max = 100;

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
					center: ['45%', '100%'], // 半圆位置
					radius: '145%',
					min: 0,
					max: 100,
					splitNumber: 15, // 刻度数量
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
						fontSize: 36,
						offsetCenter: [0, '-10%'],
						color: '#00f6ff',
						formatter: '{value}'
					},
					data: [{ value: max }]
				}
			]
		};
		chart.setOption(option);

		window.addEventListener('resize', () => chart.resize());
	};
	onMounted(async () => {
		// 确保所有面板在初始化时都是打开状态
		titleStates.value = {
			project: true,
			scenario: true,
			target: true,
			indicator: true,
			unitYear: true,
			vector: false,
			report: true,
			summary: true,
			showType: true,
			year: true,
			topic: true,
			dy: true,
			ys: true,
			zbType: true,
			jtzb: true
		};
		handleScenarioChange('spatial')
		// await getCatalogGetById('ZBC065');
		// handleShowType(1);
		setTimeout(() => {
			handleVectorToggle(vectorDataList.value[0])
		}, 1 * 1000)
	});

	onBeforeUnmount(() => {
		chart && chart.dispose();
		// 第二张和第三张的饼图现在由组件自己管理
	});
	// 获取项目列表
	const initProjects = async (bizType = 'ZHPG') => {
		try {
			const response = await cityApi.projectQueryWithPage({
				adminFlag: '1',
				current: 1,
				size: 20,
				endTime: '',
				eq_status: '3',
				eq_bizType: bizType,
				like_name: '',
				loginUser: '',
				startTime: ''
			});
			if (response.resultCode === 'S') {
				completedProjectInfos.value = response.data || [];
				selectedProjectInfo.value = response.data[0].id;
				let firstItem = JSON.parse(JSON.stringify(projectOpts.value[0]));
				projectOpts.value = response.data.map((m, index) => {
					return { value: m.id, label: m.name };
				});
				projectOpts.value.unshift(firstItem);
				selectedProjectInfo.value = completedProjectInfos.value[0].id;
				handleProjectChange(completedProjectInfos.value[0].id);
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
				handleTargetChange(targetList.value[0].value);
			}
		} catch (error) {
			console.error('查询城市推演项目记录信息失败:', error);
		}
	};

	// 单元选择事件
	const handleDyChange = value => {
		chooseUnitChangeHandle(value);
	};
	// 专题选择事件
	const ztChange = item => {
		if (item) {
			activeZt.value = item.nodeId;
			handleWarningTopicChange(item.nodeId);
		}
	};
	// 指标改变时执行
	const zbChange = item => {
		activeZb.value = item.value;
		// 查询项目
		initRadarStatisticInfo();
	};
	// // 获取专题数据
	// const getCatalogGetById = async () => {
	// 	try {
	// 		const response = await cityApi.catalogQueryWithPage({
	// 			eq_status: '1'
	// 		});
	// 		if (response.resultCode === 'S' && response.data.length) {
	// 			const res = await cityApi.catalogGetById({
	// 				catalogId: response.data[0].id
	// 			});
	// 			if (res.resultCode === 'S' && res.data?.tree.length) {
	// 				planningWarningTopicInfos.value = res.data?.tree || [];
	// 				relationTree.value = planningWarningTopicInfos.value;
	// 			}
	// 		}
	// 	} catch (error) {
	// 		console.error('查询城市推演项目记录信息失败:', error);
	// 	}
	// };
	// 专题
	const handleWarningTopicChange = () => {
		if (activeZt.value) {
			let topic = planningWarningTopicInfos.value.find(
				n => n.nodeId == activeZt.value
			);
			lxList.value = topic.children
				.filter(n => n.children?.length > 0)
				.map(m => {
					return {
						value: m.nodeId,
						label: m.nodeName,
						disabled: m?.citySPSFlag
					};
				});
			indicatorTypeChangeHandle(lxList.value[0]?.value);
		}
	};
	// 指标类型
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
		// activeLx.value = value;
		// zbList.value = [];
		// let indicatorList = [];
		// let itemLx = planningWarningTopicInfos.value.find(
		// 	m => m.nodeId == activeZt.value
		// );
		// itemLx.children
		// 	.filter(n => n.nodeId == activeLx.value)
		// 	.forEach(m => {
		// 		indicatorList = indicatorList.concat(m.children);
		// 	});
		// let projItem = completedProjectInfos.value.find(
		// 	n => n.id == selectedProjectInfo.value
		// );
		// if (itemLx && projItem?.indicators?.length) {
		// 	let filterIds = indicatorList
		// 		.map(m => m.nodeId)
		// 		.filter(n => projItem?.indicatorIds.includes(n));
		// 	zbList.value = indicatorList
		// 		.filter(m => filterIds.includes(m.nodeId))
		// 		.map(m => {
		// 			return {
		// 				value: m.nodeId,
		// 				label: m.nodeName,
		// 				data: m,
		// 				disabled: m?.citySPSFlag
		// 			};
		// 		});
		// } else {
		// 	zbList.value = indicatorList.map((m, index) => {
		// 		return {
		// 			value: m.nodeId,
		// 			label: m.nodeName,
		// 			data: m,
		// 			disabled: m?.citySPSFlag
		// 		};
		// 	});
		// }
		// if (zbList.value?.length) {
		// 	zbChange(zbList.value[0]);
		// }
	};

	// 选择项目的场景按钮选择
	const handleProjectScenarioChange = value => {
		activeProjectScenario.value = value;
		// 根据场景更新项目列表或相关数据
	};

	const handleProjectChange = async value => {
		if (value === '0') {
			btnType.value = 'add';
			modelValue.value = true;
		} else {
			selectedProjectInfo.value = value;
			let projInfo = completedProjectInfos.value.find(n => n.id == value);
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
			}
			getZb();
		}
		// if (value === '0') {
		// 	btnType.value = 'add';
		// 	modelValue.value = true;
		// } else {
		// 	// 当索引值为其他时，加载历史项目
		// 	if (completedProjectInfos.value.length) {
		// 		let projInfo = completedProjectInfos.value.find(n => n.id == value);
		// 		let indicatorIds = projInfo.indicatorIds?.split(',') || [];
		// 		const filteredTrees = getTreeByLeafNodes(
		// 			planningWarningTopicInfos.value,
		// 			indicatorIds
		// 		);
		// 		let filterItems = planningWarningTopicInfos.value.filter(m =>
		// 			filteredTrees.map(n => n.nodeId).includes(m.nodeId)
		// 		);
		// 		// 获取该项目的专题信息
		// 		specialList.value = filterItems.map(m => {
		// 			return {
		// 				...m,
		// 				nodeId: m.nodeId,
		// 				value: m.nodeId,
		// 				label: m.nodeName.replace('专题', '')
		// 			};
		// 		});

		// 		if (specialList.value?.length) {
		// 			activeZt.value = specialList.value[0]?.value;
		// 		}
		// 		// 初始化 选择单元
		// 		chooseUnitList.value =
		// 			projInfo.rangeType?.split(',').map(m => {
		// 				return { value: m, label: m };
		// 			}) || [];
		// 		await chooseUnitChangeHandle(chooseUnitList.value[0].value);
		// 		// 选择年份
		// 		yearList.value =
		// 			projInfo.predictYear?.split(',').map(m => {
		// 				return { value: m, label: m + '年' };
		// 			}) || [];
		// 		yearCurrentChangeHandle(yearList.value[0].value);
		// 		// 指标类型
		// 		handleWarningTopicChange();
		// 	}
		// }
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
				eq_projectId: selectedProjectInfo.value,
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
				}
			}
		} catch (error) {
			console.error('专门获取指标树接口:', error);
		}
	};

	const dyChangeHandle = () => {
		// 查询项目
		initRadarStatisticInfo();
	};

	/**
	 * 根据层级信息加载地理数据并更新下拉列表
	 * @param {Object} layer - 层级配置对象，包含url、id、label等属性
	 */
	const changeLyrRenderByVals = async layer => {
		dyList.value = [];
		dyCurrent.value = '';
		let list = [];
		await fetch(layer.url)
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
				dyCurrent.value = list[0]?.value || '';
			})
			.catch(error => {
				console.error('加载地理数据失败:', error);
			});
	};

	const chooseUnitChangeHandle = async value => {
		if (maxMapRef.value) {
			maxMapRef.value.addLyrToMap(value);
		}
		chooseUnitCurrent.value = value;
		const layer = VecLayerOption.find(
			item => item.name === chooseUnitCurrent.value
		);
		if (layer) {
			await changeLyrRenderByVals(layer);
		}
		// 查询项目
		if (showType.value == 1 && activeZb.value) {
			initRadarStatisticInfo();
		} else if (showType.value != 1) {
			initRadarStatisticInfo();
		}
	};

	const yearCurrentChangeHandle = value => {
		yearCurrent.value = value;
		// 查询项目
		if (showType.value == 1 && activeZb.value) {
			initRadarStatisticInfo();
		} else if (showType.value != 1) {
			initRadarStatisticInfo();
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

	const handleIndicatorTypeChange = value => {
		let datas = radarStatisticInfo.value.indicatorData;
		if (value == '超出') {
			datas = (radarStatisticInfo?.value?.indicatorData || []).filter(n => {
				if (typeof n !== 'object' || n === null || !('value' in n)) {
					return false;
				}
				return isPercentGreaterThanZero(n.value);
			});
		}
		if (value === '缺额') {
			datas = (radarStatisticInfo?.value?.indicatorData || []).filter(n => {
				if (typeof n !== 'object' || n === null || !('value' in n)) {
					return false;
				}
				return !isPercentGreaterThanZero(n.value);
			});
		}

		tableList.value = datas.map(m => {
			const numScore = (
				((m.predictValue - m.planValue) / m.planValue || 0) * 100
			).toFixed(2);
			return Object.assign(m, {
				value: numScore + '%',
				type: numScore >= 0 ? 'up' : 'down'
			});
		});
	};
	/**
	 * 判断带百分号的字符串是否大于 0
	 * @param {string} value - 带百分号的数值字符串（如 "-10.75%"、"33.3%"）
	 * @returns {boolean} - 大于 0 返回 true，否则返回 false（含格式错误）
	 */
	function isPercentGreaterThanZero(value) {
		let num;
		if (typeof value === 'string') {
			num = Number(value.replace('%', ''));
		} else if (typeof value === 'number') {
			num = value;
		} else {
			return false;
		}
		return !isNaN(num) && num > 0;
	}
	const handleWarningInfoChange = value => {
		if (radarStatisticInfo.value?.indicatorData?.length) {
			let filterDatas = radarStatisticInfo.value.indicatorData;
			if (value == 'safe') {
				filterDatas = radarStatisticInfo.value.indicatorData.filter(
					m => m.grade == '0'
				);
			} else if (value == 'warning') {
				filterDatas = radarStatisticInfo.value.indicatorData.filter(m =>
					['1', '3'].includes(m.grade)
				);
			} else if (value == 'danger') {
				filterDatas = radarStatisticInfo.value.indicatorData.filter(m =>
					['2', '4'].includes(m.grade)
				);
			}

			let predictValues = filterDatas.map(m => m.predictValue);
			const getRatios = arr => arr.map(v => v / Math.max(...arr) || 0);
			let ratios = getRatios(predictValues);

			// 预警信息
			warningList.value = filterDatas?.map((m, index) => {
				let evaluateScore = m => {
					if (m.grade == '0') return 'safe';
					if (['1', '3'].includes(m.grade)) return 'warning';
					return 'danger';
				};
				const numScore = (
					((m.predictValue - m.planValue) / m.planValue || 0) * 100
				).toFixed(2);
				return {
					name:
						(showType.value == 1 ? m.xzqmc : m.indicatorName) +
						' ' +
						convertData(m.predictValue + m.unit),
					value: parseFloat((ratios[index] * 100).toFixed(1)) + '%', // numScore,
					slide: parseFloat((ratios[index] * 100).toFixed(1)),
					type: evaluateScore(m)
				};
			});
		}
	};

	// 指标详情查询，切换行政区划
	const districtSelectedChange = () => {
		if (selectedDistrict.value) {
			let datas = radarStatisticInfo.value.indicatorData;
			let filterDatas = datas.filter(
				m => m.regionLevel == selectedDistrict.value
			);
			barData.value = filterDatas.map(m => {
				return {
					name: m.xzqmc,
					value: m.predictValue.toFixed(2),
					grade: m.grade
				};
			});

			reportInfo.value.center = {
				inside: {
					year: yearCurrent.value,
					name: selectedIndicatorInfo.value?.nodeName,
					value: barData.value[1].value,
					unit: selectedIndicatorInfo.value?.unit,
					level: {
						"0": "安全",
						"1": "警告",
						"2": "危险",
						"3": "警告",
						"4": "危险",
					}[barData.value[1].grade]
				},
				outside: {
					year: yearCurrent.value,
					name: selectedIndicatorInfo.value?.nodeName,
					value: barData.value[0].value,
					unit: selectedIndicatorInfo.value?.unit,
					level: {
						"0": "安全",
						"1": "警告",
						"2": "危险",
						"3": "警告",
						"4": "危险",
					}[barData.value[0].grade]
				}
			}

			let indicatorInfo = zbList.value.find(n => n.value == activeZb.value);
			jobHousingChartOpt(indicatorInfo);
		}
	};

	const districtSelectedChange2 = () => {
		sortDirection.value = !sortDirection.value;
		if (warningValue2.value) {
			let datas = radarStatisticInfo.value.indicatorData;
			let level = warningValue2.value.replace('全部', '');
			let filterDatas = datas.filter(m => m.regionLevel == level);

			reportInfo.value.country = filterDatas.map(n => {
				return {
					year: yearCurrent.value,
					countryName: n.xzqmc,
					name: selectedIndicatorInfo.value?.nodeName,
					value: n.predictValue,
					unit: selectedIndicatorInfo.value?.unit,
					level: {
						"0": "安全",
						"1": "警告",
						"2": "危险",
						"3": "警告",
						"4": "危险",
					}[n.grade]
				}
			})

			let vals = filterDatas;
			if (sortDirection.value) {
				// 升序
				vals = [...filterDatas].sort(
					(a, b) => b.monitorValue - a.monitorValue
				);
			} else {
				// 降序
				vals = [...filterDatas].sort(
					(a, b) => a.monitorValue - b.monitorValue
				);
			}

			warningList.value = vals.map((m, index) => {
				let evaluateScore = m => {
					if (m.grade == '0') return 'safe';
					if (['1', '3'].includes(m.grade)) return 'warning';
					return 'danger';
				};
				const numScore = (
					((m.predictValue - m.planValue) / m.planValue || 0) * 100
				).toFixed(2);
				return {
					name:
						(showType.value == 1 ? m.xzqmc : m.indicatorName) +
						' ' +
						convertData(m.predictValue + m.unit),
					value: m.monitorValue, // parseFloat((ratios[index] * 100).toFixed(1)) + '%', // numScore,
					slide:  m.monitorValue, // parseFloat((ratios[index] * 100).toFixed(1)),
					type: evaluateScore(m)
				};
			});
		}
	};

	// 按变化率升序或降序
	const sortHande = () => {
		districtSelectedChange2()
	};

	const initRadarStatisticInfo = async () => {
		try {
			let projItem = completedProjectInfos.value.find(
				n => n.id == selectedProjectInfo.value
			);
			if (!projItem) return;

			// 获取专题下面所有指标 ID 集合
			let topicIndicators = [];
			let topicInfo = planningWarningTopicInfos.value.find(
				n => n.nodeId == activeZt.value
			);
			if (topicInfo) {
				topicInfo.children.forEach(n => {
					let ids = n.children.map(m => m.nodeId);
					topicIndicators = topicIndicators.concat(ids);
				});
			}

			if (showType.value == 1 && activeZb.value == '') {
				return;
			}

			// // 设置标题
			// let distName =
			// 	dyList.value.find(n => n.value == dyCurrent.value)?.label || '';
			// indicatorGenealTile.value = `指标预警概况（${distName}）`;
			// indicatorDetailTile.value = `指标详情（${distName}）`;
			// indicatorWarnTile.value = `规划达成情况（${distName}）`;

			// 查询推演信息
			let res = await rdarApi.radarStatistic({
				array_indicatorId:
					showType.value == 1 ? '' : topicIndicators.toString(),
				catalogId: '', // activeZt.value,
				current: 0,
				eq_grade: '',
				eq_indicatorId: activeZb.value, // showType.value == 1 ? activeZb.value : '',
				eq_predictYear: yearCurrent.value || '2030',
				eq_projectId: projItem.id,
				eq_regionLevel: '', // chooseUnitCurrent.value,
				eq_xzqdm: showType.value == 1 ? '' : dyCurrent.value,
				like_indicatorName: '',
				projectType: 'MAIN',
				size: 0
			});
			if (res?.data) {
				radarStatisticInfo.value = res.data;
				let cloneNode = null;
				// 渲染关联图
				// let treeNode = planningWarningTopicInfos.value.find(
				// 	n => n.nodeId == activeZt.value
				// );
				// cloneNode = JSON.parse(JSON.stringify(treeNode));
				// if (showType.value != 1) {
				// 	let ids = projItem.indicatorIds.split(',');
				// 	cloneNode.children.forEach(m => {
				// 		m.children = m.children.filter(n => ids.includes(n.nodeId));
				// 		// 给结点赋值，目录树图谱使用
				// 		m.children.forEach(n => {
				// 			let indiRes = res.data?.indicatorData.find(
				// 				k => k.indicatorId == n.nodeId
				// 			);
				// 			if (indiRes) {
				// 				n.calculateResult = Object.assign(indiRes, {
				// 					unit: n.unit,
				// 					module: 'CitySpaceRadar'
				// 				});
				// 			}
				// 		});
				// 	});
				// 	if (relationMap.value) {
				// 		relationMap.value.focusData(cloneNode);
				// 	}
				// }
				// 渲染地图
				// if (maxMapRef.value) {
				// 	let indiItem = zbList.value.find(n => n.value == activeZb.value);
				// 	let datas = res.data.indicatorData.map(m => {
				// 		return {
				// 			predictValue: m.predictValue,
				// 			xzqdm: m.xzqdm,
				// 			xzqmc: m.xzqmc,
				// 			indicatorInfo: indiItem.data,
				// 			predictYear: yearCurrent.value,
				// 			calculateResult: Object.assign(m, {
				// 				module: 'CitySpaceRadar',
				// 				unit: indiItem.data.unit
				// 			})
				// 		};
				// 	});
				// 	maxMapRef.value.renderDatasToMap(
				// 		chooseUnitCurrent.value,
				// 		datas,
				// 		'radar'
				// 	);
				// }

				let indicatorInfo = zbList.value.find(n => n.value == activeZb.value);
				selectedIndicatorInfo.value = indicatorInfo;

				let cityItem = res.data.indicatorData.find(
					m => m.regionLevel == '全市'
				);
				if (cityItem) {
					jobHousingRatio.value = cityItem.predictValue.toFixed(2);
					jobHousingRatioUnit.value = indicatorInfo?.unit;
					alertLevel.value = {
						"0": "安全",
						"1": "警告",
						"2": "危险",
						"3": "警告",
						"4": "危险",
					}[cityItem.grade]
					reportInfo.value.city = {
						year: yearCurrent.value,
						name: indicatorInfo.nodeName,
						value: jobHousingRatio.value,
						unit: indicatorInfo?.unit,
						level: alertLevel.value
					}
				}

				districtSelectedChange();
				districtSelectedChange2();

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
									module: 'IntegratedAssessment',
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
									module: 'IntegratedAssessment',
									unit: indicatorInfo?.unit || ' '
								}
							}
						];
					}
					maxMapRef.value.renderDatasToMap(dyCurrent.value, datas, 'radar');
				}

				// // 轮动轮播指标
				// carouselList.value =
				// 	res.data?.indicatorData.map(m => {
				// 		let nodeInfo = null;
				// 		if (cloneNode) {
				// 			cloneNode.children?.forEach(k => {
				// 				k.children.forEach(n => {
				// 					if (n.nodeId == m.indicatorId) {
				// 						nodeInfo = n;
				// 						return;
				// 					}
				// 				});
				// 			});
				// 		}
				// 		return {
				// 			grade: m.grade,
				// 			nodeName: m.indicatorName,
				// 			nodeValue: (m.monitorValue || 0) + (nodeInfo?.unit || ''),
				// 			nodeValue2: (m.predictValue || 0) + (nodeInfo?.unit || '')
				// 		};
				// 	}) || [];

				// // 饼状图
				// let riskTotal = 0;
				// let warningNum = 0;
				// let normalTotal = 0;
				// res.data.regionStatisticData.forEach(item => {
				// 	riskTotal += item.highRiskNum + item.lowRiskNum;
				// 	warningNum += item.highWarningNum + item.lowWarningNum;
				// 	normalTotal += item.normalNum;
				// });
				// optionsData.value = {
				// 	highRiskTotal: riskTotal,
				// 	normalTotal,
				// 	highWarningNum: warningNum
				// };
				// // 预警指标统计
				// pieThirdOptions.value = {
				// 	highRiskTotal: riskTotal,
				// 	normalTotal,
				// 	highWarningNum: warningNum
				// };

				// // 指标总体评价
				// let valdfa =
				// 	(normalTotal + warningNum) / (riskTotal + warningNum + normalTotal);
				// chartFn(parseInt((valdfa * 100).toFixed(0)));
				// let normalNum = 0,
				// 	totalNum = 0;
				// res.data.indicatorStatisticData.forEach(n => {
				// 	normalNum += n.normalNum;
				// 	normalNum += n.highWarningNum;
				// 	normalNum += n.lowWarningNum;
				// 	totalNum += n.totalNum;
				// });
				// let evaluateLevel = m => {
				// 	if (m < 0.6) return '危险';
				// 	else if (m >= 0.6 && m < 0.8) return '警告';
				// 	else return '安全';
				// };
				// idicatorsEvaluationLevel.value = evaluateLevel(normalNum / totalNum);
				// idicatorsEvaluationScore.value = ((normalNum / totalNum) * 100).toFixed(
				// 	0
				// );
				// 预警信息
				// if (res.data.indicatorData?.length) {
				// 	warningList.value = res.data.indicatorData.map(m => {
				// 		let evaluateScore = m => {
				// 			if (m.grade == '0') return 'safe';
				// 			if (['1', '3'].includes(m.grade)) return 'warning';
				// 			return 'danger';
				// 		};
				// 		const numScore = (
				// 			((m.predictValue - m.planValue) / m.planValue || 0) * 100
				// 		).toFixed(2);
				// 		return {
				// 			name:
				// 				(showType.value == 1 ? m.xzqmc : m.indicatorName) +
				// 				' ' +
				// 				convertData(m.predictValue + m.unit),
				// 			value: numScore,
				// 			slide: Math.abs(numScore),
				// 			type: evaluateScore(m)
				// 		};
				// 	});
				// }
				// baseYear.value = res.data?.indicatorData[0]?.baseYear + '年';
				// predictYear.value = res.data?.indicatorData[0]?.predictYear + '年';
				// tableList.value = res.data.indicatorData.map(m => {
				// 	let nodeInfo = null;
				// 	if (cloneNode) {
				// 		cloneNode.children?.forEach(k => {
				// 			k.children.forEach(n => {
				// 				if (n.nodeId == m.indicatorId) {
				// 					nodeInfo = n;
				// 					return;
				// 				}
				// 			});
				// 		});
				// 	}
				// 	const numScore = (
				// 		((m.predictValue - m.planValue) / m.planValue || 0) * 100
				// 	).toFixed(2);
				// 	return Object.assign(m, {
				// 		value: numScore + '%',
				// 		type: numScore > 0 ? 'up' : 'down',
				// 		unit: nodeInfo?.unit || ''
				// 	});
				// });
			}
		} catch (error) {
			console.error('查询城市预警雷达推演项目记录信息失败:', error);
		}
	};
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
				justify-content: center;
				gap: 8px;
				margin-bottom: 12px;

				.project-tab {
					position: relative;
					cursor: pointer;
					transition: all 0.3s;
					display: flex;
					align-items: center;
					justify-content: center;
					height: 30px;

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

		.smart-report-section {
			margin-bottom: 12px;
			background: rgba(17, 46, 70, 0.8);
			padding: 12px 16px;
			display: flex;
			justify-content: center;
			align-items: center;

			.generate-report-btn {
				width: 100%;
				height: 48px;
				border: none;
				border-radius: 24px;
				background: linear-gradient(180deg, #4a9eff 0%, #1e5cff 100%);
				box-shadow: 0 0 20px rgba(74, 158, 255, 0.5),
					0 4px 8px rgba(0, 0, 0, 0.3);
				color: #ffffff;
				font-size: 18px;
				font-weight: 500;
				font-family: 'YouSheBiaoTiHei', 'SourceHanSansCN-Regular', sans-serif;
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 8px;
				transition: all 0.3s ease;
				position: relative;
				overflow: hidden;

				&::before {
					content: '';
					position: absolute;
					top: 0;
					left: -100%;
					width: 100%;
					height: 100%;
					background: linear-gradient(
						90deg,
						transparent,
						rgba(255, 255, 255, 0.2),
						transparent
					);
					transition: left 0.5s;
				}

				&:hover {
					background: linear-gradient(180deg, #5aafff 0%, #2e6cff 100%);
					box-shadow: 0 0 30px rgba(74, 158, 255, 0.7),
						0 6px 12px rgba(0, 0, 0, 0.4);
					transform: translateY(-2px);

					&::before {
						left: 100%;
					}
				}

				&:active {
					transform: translateY(0);
					box-shadow: 0 0 15px rgba(74, 158, 255, 0.4),
						0 2px 4px rgba(0, 0, 0, 0.3);
				}

				.plus-icon {
					font-size: 24px;
					font-weight: bold;
					line-height: 1;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				span:not(.plus-icon) {
					letter-spacing: 1px;
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
				&.disabled {
					cursor: not-allowed;
					opacity: 0.5;
				}
				.zbContent {
					height: 32px;
					line-height: 32px;
					color: #fff;
					font-family: 'YouSheBiaoTiHei';
					font-size: 16px;
					font-weight: 400;
					white-space: nowrap;
					text-align: center;
				}
			}
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
		.yjxxTitle {
			font-family: 'YouSheBiaoTiHei';
			font-weight: 400;
			font-size: 20px;
			line-height: 20px;
			vertical-align: middle;
			color: white;
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
		.overall-status-section {
			min-height: 120px;
			border-radius: 4px;
			background-image: url('@/assets/img/overall-status-section.png');
			background-size: cover;
			background-position: center;

			.status-icon-wrapper {
				.status-icon-outer-circle {
					position: relative;
					width: 90px;
					height: 90px;
					border: 2px dashed rgba(96, 245, 255, 0.6);
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					animation: rotate 20s linear infinite;

					.status-icon-inner-circle {
						width: 70px;
						height: 70px;
						border: 2px solid rgba(96, 245, 255, 0.8);
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						background: rgba(96, 245, 255, 0.1);
						box-shadow: 0 0 20px rgba(96, 245, 255, 0.3);

						.status-icon-content {
							display: flex;
							align-items: center;
							justify-content: center;
							filter: drop-shadow(0 0 8px rgba(96, 245, 255, 0.8));
						}
					}
				}
			}

			.status-info-wrapper {
				.status-info-item {
					.status-label {
						font-family: 'AlibabaPuHuiTi-65';
						font-weight: 500;
						font-size: 14px;
						line-height: 20px;
						color: #c4c4c4;

						&.indicator-name-truncate {
							cursor: default;
						}
					}
					.status-value_p {
						font-family: 'AlibabaPuHuiTi-65';
						font-weight: 600;
						font-size: 32px;
						line-height: 23px;
						letter-spacing: 0px;
						color: #abdfff;
						white-space: nowrap;

						& span {
							font-size: 20px;
						}

						&.scale-down {
							font-size: 20px;
							line-height: 15px;

							& span {
								font-size: 14px;
							}
						}
					}
					.status-value {
						color: #06a5ff;
						font-family: 'YouSheBiaoTiHei';
						font-weight: 400;
						font-size: 24px;
						line-height: 20px;
						letter-spacing: 0px;

						&.alert-safe {
							color: #06a5ff;
						}

						&.alert-warning {
							color: #f7b500;
						}

						&.alert-danger {
							color: #ff0c10;
						}
					}
				}
			}
		}

		@keyframes rotate {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}
		& .legend-square {
			width: 6px;
			height: 6px;
			&.safe {
				background-color: #06a5ff;
			}

			&.warning {
				background-color: #f7b500;
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
		.yearChart {
			.yearChartItem {
				.yearChartItemTitle {
					font-size: 24px;
					color: rgba(102, 255, 255, 1);
					font-weight: 400;
					font-family: 'YouSheBiaoTiHei';
					text-align: center;
				}
			}
			.yearChartItem1 {
				width: 30%;
				span {
					font-weight: 400;
					line-height: 20px;
				}
				& .label {
					font-family: 'SourceHanSansCN-Regular';
					font-size: 14px;
					color: #c6d1db;
				}
				& .value {
					font-family: 'SourceHanSansCN-Regular';
					color: #66ffff;
					font-family: 'YouSheBiaoTiHei';
					font-size: 18px;
				}
			}
		}
		.zbszTable {
			.zbszTableBody {
				height: calc(100% - 2.25rem);
				.zbszTableRow {
					display: flex;
					justify-content: space-between;
					box-sizing: border-box;
					div {
						text-align: center;
						height: 36px;
						line-height: 36px;
						font-size: 12px;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;

						&:last-child {
							border-right: none;
						}
					}
				}
				.zbszTableRow:nth-child(even) {
					background: #112e46;
				}
				.zbszTableRow:nth-child(odd) {
					background: #11456c;
				}
			}
		}
	}
	.mapConTitle.showType2 {
		top: 0.75rem !important;
		left: 2rem !important;
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
	.chartPieImage {
		position: absolute;
		top: 59%;
		left: 48%;
		transform: translate(-50%, -50%);
		width: 50%;
		object-fit: contain;
		z-index: 9999;
		pointer-events: none;
	}
</style>
