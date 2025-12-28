<template>
	<div class="pages">
		<Layout>
			<template #left>
				<div class="w-full h-full left">
					<SecondTile
						label="政策模拟参数调控台"
						leftPadding="3.8125rem"></SecondTile>
					<div class="pl-[1.6875rem] pr-[0.4375rem]">
						<Arrowhead
							class="my-3"
							name="场景体系"
							direction="bottom"
							@directionChange="handleTitleToggle('project')" />
						<div v-show="titleStates.project" class="scenario-section">
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
							<CustomSelect
								popper-class="my-popper"
								v-model="projectName1"
								:options="projectList1"
								forbidden-value="0"
								:footer="true"
								@select="projectChangedHandle1">
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
							name="选择模拟政策方案"
							direction="bottom"
							@directionChange="handleTitleToggle('zcmn')"></Arrowhead>
						<CustomSelect
							v-show="titleStates.zcmn"
							popper-class="my-popper"
							v-model="projectName"
							:options="projectList"
							forbidden-value="0"
							:footer="true"
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
					<SecondTile
						class="mt-[1.5rem] mb-[0.5625rem]"
						label="政策模拟策略选择"
						leftPadding="3.25rem"></SecondTile>
					<div class="pl-[1.6875rem] pr-[0.4375rem]">
						<div class="my-[0.75rem]">
							<div class="resultContent w-full h-[9.625rem]">
								<Diamond name="模拟方案参数"></Diamond>
								<div class="yearChartItemContent">
									<div class="yearChartItemContentItem">
										<span>设定的政策情景：</span>
										<span>低碳城市</span>
									</div>
									<div class="yearChartItemContentItem">
										<span>模拟调整参数名称：</span>
										<span
											>100<span style="font-size: 9px; margin-left: 0"
												>万吨</span
											>
										</span>
									</div>
									<div class="yearChartItemContentItem">
										<span>项目基准指标值：</span>
										<span
											>59.2<span style="font-size: 9px; margin-left: 0"
												>万吨</span
											>
										</span>
									</div>
									<div class="yearChartItemContentItem">
										<span>设定实现目标值：</span>
										<span
											>59.2<span style="font-size: 9px; margin-left: 0"
												>万吨</span
											>
										</span>
									</div>
								</div>
							</div>
						</div>
						<Arrowhead
							class="my-3"
							name="选择政策模拟策略"
							direction="bottom"
							@directionChange="handleTitleToggle('zcmncl')"></Arrowhead>
						<div
							class="flex items-center justify-between"
							v-show="titleStates.zcmncl">
							<div
								class="w-[8.75rem] h-[1.875rem] select-none flex items-center justify-center"
								:style="{
									backgroundImage: `url(${dyActive})`,
									backgroundSize: '100% 100%',
									backgroundPosition: 'center center',
									backgroundRepeat: 'no-repeat'
								}">
								政策策略专题
							</div>
							<CustomSelect
								class="!w-[12.25rem]"
								:isBg="false"
								v-model="strategicValue"
								:options="strategic"
								@select="handleStrategicChange"></CustomSelect>
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
							name="选择年份"
							direction="bottom"
							@directionChange="handleTitleToggle('year')"></Arrowhead>
						<CustomSelect
							v-show="titleStates.year"
							v-model="yearCurrent"
							:options="yearList"
							@select="handleYearChange">
						</CustomSelect>
						<Arrowhead
							class="my-3"
							name="选择指标"
							direction="bottom"
							@directionChange="handleTitleToggle('chooseZb')"></Arrowhead>
						<CustomSelect
							v-show="titleStates.chooseZb"
							v-model="activeZb"
							:options="zbList"
							@select="handleZbChange">
						</CustomSelect>
					</div>
				</div>
			</template>
			<template #map>
				<MaxMap ref="maxMapRef">
					<template #mapCon>
						<h1 class="absolute mapConTitle select-none">
							{{ projectList.find(n => n.value == projectName)?.label || '' }}
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
				<div class="w-full h-full right">
					<SecondTile
						label="政策成效模拟表盘"
						direction="right"
						rightPadding="4rem"></SecondTile>
					<div class="pl-[0.375rem] pr-8">
						<div class="my-[0.75rem]">
							<div class="resultContent w-full h-[9.625rem]">
								<Diamond name="政策实施模拟结果"></Diamond>
								<div class="yearChartItemContent" v-if="resItem">
									<div class="yearChartItemContentItem">
										<span>政策实施目标成效：</span>
										<span>达成策略目标</span>
									</div>
									<div class="yearChartItemContentItem">
										<span>设定的目标参数值：</span>
										<span>
											{{ resItem.totalPlanValue || 0
											}}<span style="font-size: 9px; margin-left: 0">万吨</span>
										</span>
									</div>
									<div class="yearChartItemContentItem">
										<span>政策调控后参数值：</span>
										<span>
											{{ resItem.totalPredictValue || 0
											}}<span style="font-size: 9px; margin-left: 0">万吨</span>
										</span>
									</div>
									<div class="yearChartItemContentItem">
										<span>目标值完成比例：</span>
										<span>
											{{
												(
													(resItem.totalPredictValue / resItem.totalPlanValue ||
														0) * 100
												).toFixed(2)
											}}<span style="font-size: 9px; margin-left: 0">%</span>
										</span>
									</div>
								</div>
							</div>
						</div>
						<Arrowhead
							class="my-3"
							name="指标分区对比"
							direction="left"
							:isChange="false">
							<el-select
								style="width: 7.5rem"
								v-model="indicatorInfoValue"
								placeholder="请选择查询区域"
								popper-class="my-popper"
								size="small"
								@change="handleTrendDirectionChange2">
								<el-option
									v-for="item in districtValuetList"
									:key="item.xzqdm"
									:label="item.xzqmc"
									:value="item.xzqdm" />
							</el-select>
						</Arrowhead>
						<div class="duibi relative bg-[#112E46]">
							<div class="chartContainer relative h-[12.5rem]">
								<div ref="barChartRef" class="barChart"></div>
							</div>
							<div
								class="customLegend absolute top-0 right-0 flex items-center"
								v-if="policyStatisticInfo && policyStatisticInfo.length">
								<div class="legendItem">
									<div
										@click="mapImpactChangeHandle('before')"
										class="legendColor"
										style="
											background: linear-gradient(to bottom, #77f2fc, #57a4fb);
										"></div>
									<span
										>政策调整前（{{
											policyStatisticInfo[0]['baseYear']
										}}年）</span
									>
								</div>
								<div class="legendItem">
									<div
										@click="mapImpactChangeHandle('after')"
										class="legendColor"
										style="
											background: linear-gradient(to bottom, #f877a6, #f6415c);
										"></div>
									<span
										>政策调整后（{{
											policyStatisticInfo[0]['predictYear']
										}}年）</span
									>
								</div>
							</div>
						</div>
						<Arrowhead
							class="my-3"
							name="政策调整前后变化"
							direction="left"
							:isChange="false">
							<el-select
								style="width: 7.5rem"
								v-model="indicatorValue"
								placeholder="请选择查询内容"
								popper-class="my-popper"
								size="small"
								@change="handleTrendDirectionChange">
								<el-option
									v-for="item in indicatorValuetList"
									:key="item.xzqdm"
									:label="item.xzqmc"
									:value="item.xzqdm" />
							</el-select>
						</Arrowhead>
						<ul class="tableTab flex my-[1.375rem]">
							<li
								@click="handleTableTabChange(item)"
								v-for="item in tableTab"
								:key="'tableTab_' + item.value"
								:title="item.label"
								:class="[
									'flex items-center justify-center cursor-pointer px-[0.625rem]',
									{ active: tableTabCurrent === item.value }
								]">
								<span>{{ item.label }}</span>
							</li>
						</ul>
						<div class="zbszTable bg-[#112E46]">
							<DbTableHeader
								:list="[
									{ name: '指标名称', class: 'w-30' },
									{ name: baseYear + '年', class: 'w-[4.625rem]' },
									{ name: predictYear + '年', class: 'w-[4.625rem]' },
									{ name: '调控幅度', class: 'flex-1' }
								]"></DbTableHeader>
							<div class="zbszTableBody overflow-hidden overflow-y-auto">
								<div class="zbszTableRow" v-for="item in tableList" :key="item">
									<div class="w-30 truncate" :title="item.name">
										{{ item.name }}
									</div>
									<div
										class="w-[4.625rem]"
										:class="
											item.type === 'up' ? 'text-[#FF2836]' : 'text-[#10D562]'
										"
										:title="item.baseYear + item.unit">
										{{ item.baseYear + item.unit }}
									</div>
									<div
										class="w-[4.625rem]"
										:class="
											item.type === 'up' ? 'text-[#FF2836]' : 'text-[#10D562]'
										"
										:title="item.predictYear + item.unit">
										{{ item.predictYear + item.unit }}
									</div>
									<div
										class="flex-1 flex items-center justify-center !color:white">
										<span class="dbTableRowData flex items-center">
											<img
												class="mr-2"
												src="@/assets/img/TimeSpaceRadar/up.png"
												alt=""
												width="13"
												height="10"
												v-if="item.type === 'up'" />
											<img
												class="mr-2"
												src="@/assets/img/TimeSpaceRadar/down.png"
												alt=""
												width="13"
												height="10"
												v-if="item.type === 'down'" />
											{{ item.value }}
										</span>
									</div>
								</div>
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
			bizType="MNGF"
			:show="btnType === 'history'"
			:projectList="completedProjectInfos"
			@close="(modelValue = false), (btnType = '')"></AddProject>
	</div>
</template>
<script setup>
	import cityApi from '@/api/index.js';
	import { useAppStore } from '@/stores/modules/app.js';
	const useStore = useAppStore();
	import AddProject from '@/components/addProject/index.vue';
	import MaxMap from '@/components/mapView/maxMap.vue';
	import dyActive from '@/assets/img/futureMirror/bgActive.png';
	import * as echarts from 'echarts';
	import { getAssetsFile } from '@/utils/index.js';

	const maxMapRef = ref(null);
	const barChartRef = ref(null); // 柱状图
	let barChart = null; // 柱状图实例

	// 统一管理所有Title组件的状态
	const titleStates = ref({
		project: true,
		spaceData: true,
		showType: true,
		chooseUnit: true,
		chooseZb: true,
		zbType: true,
		zb: true,
		zcmn: true,
		zcmncl: true,
		year: true
	});
	// 处理Title组件的切换事件
	const handleTitleToggle = key => {
		titleStates.value[key] = !titleStates.value[key];
	};
	const tableTabCurrent = ref('土地供给调整');
	const tableTab = ref([
		{ value: '土地供给调整', label: '土地供给调整' },
		{ value: '提升新能源比例', label: '提升新能源比例' },
		{ value: '绿色建筑比例', label: '绿色建筑比例' }
	]);

	// 选择年份
	const yearCurrent = ref('2030');
	const yearList = ref([
		{ value: '2030', label: '2030年' },
		{ value: '2035', label: '2035年' },
		{ value: '2040', label: '2040年' }
	]);
	const createType = ref('F');
	const modelValue = ref(false);
	const btnType = ref(''); // add: 新建项目, history: 历史项目
	const completedProjectInfos = ref([]);
	const projectName1 = ref('');
	const projectName = ref('');
	const list = ref([]);
	const projectList1 = ref([{ value: '0', label: '新建推演项目' }]);
	const projectList = ref([{ value: '0', label: '新建推演项目' }]);

	// 场景体系
	const activeScenario = ref('spatial');
	const scenarioList = ref([
		{ value: 'spatial', label: '空间智优' },
		{ value: 'economy', label: '产业智兴' },
		{ value: 'livable', label: '宜居智享' },
		{ value: 'green', label: '绿美智绘' },
		{ value: 'resilient', label: '韧性智安' },
		{ value: 'heritage', label: '名城智护' },
		{ value: 'digital', label: '数字智治' }
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

	const policyStatisticInfo = ref(null);
	const policyEffectTrees = ref([]);
	const mapBtnList = [
		{ id: 'after', name: '调整后' },
		{ id: 'before', name: '调整前' }
	];
	const mapBtnItemId = ref('after');
	const mapBtnListClick = item => {
		mapBtnItemId.value = item.id;
		mapImpactChangeHandle(item.id);
	};
	// 指标数值
	const indicatorValue = ref('');
	const districtValuetList = ref([]);
	const indicatorValuetList = ref([]);

	const indicatorInfoValue = ref('');

	const baseYear = ref('2030');
	const predictYear = ref('2030');

	// 指标数值数组
	const tableList = ref([]);
	// 柱状图初始化
	const initBarChart = unit => {
		if (!barChartRef.value) {
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
			legend: {
				data: ['项目实施后', '未实施项目'],
				top: 10,
				right: 20,
				textStyle: {
					color: 'rgb(125, 125, 125)',
					fontSize: 12
				},
				itemWidth: 12,
				itemHeight: 8,
				show: false
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '20%', // 增加底部空间以容纳 dataZoom
				top: '15%',
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
				nameGap: 10,
				nameTextStyle: {
					color: '#fff',
					fontSize: 12,
					align: 'right',
					padding: [0, 0, 0, 0]
				},
				axisLine: {
					lineStyle: {
						color: '#fff'
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
					name: '政策调整前',
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
								{ offset: 0, color: '#60F5FF' },
								{ offset: 1, color: '#3FA4FF' }
							])
						}
					},
					barWidth: '12px'
				},
				{
					name: '政策调整后',
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
								{ offset: 0, color: '#FF72A6' },
								{ offset: 1, color: '#FF3657' }
							])
						}
					},
					barWidth: '12px'
				}
			],
			dataZoom: [
				{
					type: 'slider',
					xAxisIndex: 0,
					start: 0,
					end: 30,
					zoomOnMouseWheel: true,
					moveOnMouseMove: true,
					moveOnMouseWheel: true,
					bottom: '5%', // 将滑块放在底部
					height: 20, // 滑块高度
					handleSize: '100%', // 手柄大小
					handleStyle: {
						color: '#00f6ff', // 手柄颜色
						borderColor: '#00f6ff'
					},
					textStyle: {
						color: '#fff' // 文字颜色
					},
					borderColor: '#00f6ff', // 边框颜色
					fillerColor: 'rgba(0, 246, 255, 0.2)', // 填充颜色
					dataBackground: {
						lineStyle: {
							color: '#00f6ff',
							width: 1
						},
						areaStyle: {
							color: 'rgba(0, 246, 255, 0.1)'
						}
					},
					selectedDataBackground: {
						lineStyle: {
							color: '#00f6ff'
						},
						areaStyle: {
							color: 'rgba(0, 246, 255, 0.3)'
						}
					},
					moveHandleStyle: {
						color: 'rgba(0, 246, 255, 0.8)'
					}
				}
			]
		};
		barChart.setOption(option);
		// 添加窗口大小变化监听
		window.addEventListener('resize', () => barChart.resize());
	};

	// 选择单元
	const dyCurrent = ref('区县');
	const dyList = ref([
		{ value: '区县', label: '区县' },
		{ value: '街道', label: '街道' },
		{ value: '网格', label: '网格' }
	]);
	// 选择指标
	const activeZb = ref('');
	const indicatorNodeIds = ref('');
	const resItem = ref(null);
	const zbList = ref([]);

	// 获取项目列表
	const initProjects1 = async () => {
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
				let firstItem = JSON.parse(JSON.stringify(projectList1.value[0]));
				projectList1.value = data?.map(item => ({
					value: item.id,
					label: item.name
				}));
				projectList1.value.unshift(firstItem);
				projectName1.value = projectList1.value[1].value;
				projectChangedHandle1(projectName1.value);
			}
		} catch (error) {
			console.error('查询城市推演项目记录信息失败:', error);
		}
	};
	// 场景体系选择
	const handleScenarioChange = value => {
		// activeScenario.value = value;
		// 根据场景更新相关数据
	};

	// 项目切换事件
	const projectChangedHandle1 = value => {
		if (value === '0') {
			createType.value = 'F';
			btnType.value = 'add';
			modelValue.value = true;
		} else {
			projectName1.value = value;
			initProjects();
		}
	};
	// 获取子项目
	const initProjects = async () => {
		try {
			const res = await cityApi.projectDetailQuery({
				projectId: projectName1.value,
				bizType: 'MNGF',
				actionType: 'MNGF2'
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
				list.value = childProjects;
				let firstItem = JSON.parse(JSON.stringify(projectList.value[0]));
				projectList.value = childProjects.map(m => {
					return { value: m.id, label: m.name, indicatorIds };
				});
				projectList.value.unshift(firstItem);
				projectName.value = projectList.value[1].value;
				projectChangedHandle(projectName.value);
			}
		} catch (error) {
			console.error('获取子项目失败:', error);
		}
	};
	// 子项目切换事件
	const projectChangedHandle = value => {
		if (value === '0') {
			createType.value = 'C';
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
				getRes();
			}
		}
	};
	// 历史项目
	const handleMore = () => {
		createType.value = 'F';
		btnType.value = 'history';
		modelValue.value = true;
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
				projectType: 'CHILD',
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
				}
			}
		} catch (error) {
			console.error('专门获取指标树接口:', error);
		}
	};
	// 最后获取结果接口
	const getRes = async () => {
		if (!projectName.value || !activeZb.value) {
			return;
		}
		try {
			const res = await cityApi.policyeffectStatistic({
				current: 1,
				eq_indicatorId: activeZb.value,
				eq_predictYear: yearCurrent.value, // 目标年份
				eq_projectId: projectName.value, // 推演项目ID
				eq_regionLevel: dyCurrent.value, // 行政区级别，全市、区县、街道、网格
				projectType: projectName.value.includes('TYPC') ? 'CHILD' : 'MAIN'
			});
			if (res.resultCode === 'S') {
				resItem.value = res.data;
				const data = res.data?.indicatorData || [];
				policyStatisticInfo.value = res.data?.indicatorData;
				policyEffectTrees.value = res.data?.policyEffectTree;

				// 初始化政策调整
				tableTab.value = res.data?.policyEffectTree.map(m => {
					return { value: m.nodeName, label: m.nodeName };
				});
				tableTabCurrent.value = tableTab.value[0].value;

				// 渲染地图
				mapImpactChangeHandle('after');
				if (data?.length) {
					// 获取行政区集合
					districtValuetList.value = mapToUniqueDistricts(
						res.data.indicatorData
					);
					districtValuetList.value.unshift({
						xzqdm: 'all',
						xzqmc: '全部',
						regionLevel: '区县'
					});
					handleTableTabChange(tableTabCurrent.value);
					handleTrendDirectionChange2();
				}
			}
		} catch (error) {
			console.error('最后获取结果接口:', error);
		}
	};

	function mapToUniqueIndicators(data) {
		const districtMap = new Map();
		data.forEach(item => {
			const key = `${item.indicatorId}_${item.indicatorName}`;
			if (!districtMap.has(key)) {
				districtMap.set(key, {
					indicatorId: item.indicatorId,
					indicatorName: item.indicatorName,
					unit: item.unit,
					data: item
				});
			}
		});
		return Array.from(districtMap.values());
	}

	function mapToUniqueDistricts(data) {
		const districtMap = new Map();
		data.forEach(item => {
			const key = `${item.xzqdm}_${item.xzqmc}`;
			if (!districtMap.has(key)) {
				districtMap.set(key, {
					xzqdm: item.xzqdm,
					xzqmc: item.xzqmc,
					regionLevel: item.regionLevel
				});
			}
		});
		return Array.from(districtMap.values());
	}

	// 选择单元事件
	const dyHandleChange = obj => {
		dyCurrent.value = obj || obj.id;
		if (maxMapRef.value) {
			maxMapRef.value.addLyrToMap(dyCurrent.value);
		}
		getRes();
	};
	// 选择年份事件
	const handleYearChange = value => {
		yearCurrent.value = value;
		getRes();
	};
	// 指标选择事件
	const handleZbChange = obj => {
		activeZb.value = obj.nodeId || obj;
		getRes();
	};

	const strategicValue = ref('');
	const strategic = ref([]);
	// 获取策略方案数据
	const getStrategic = async () => {
		const res = await cityApi.catalogQueryWithPage({
			eq_bizType: '3',
			eq_status: '1'
		});
		if (res.resultCode === 'S') {
			const res2 = await cityApi.catalogGetById({
				catalogId: res.data[0].id
			});
			if (res2.resultCode === 'S' && res2.data?.tree.length) {
				const data = res2.data.tree;
				strategic.value = data.map(m => ({
					data: m,
					id: m.nodeId,
					value: m.nodeId,
					label: m.nodeName
				}));
				handleStrategicChange(strategic.value[0]?.id || '');
			}
		}
	};
	// 政策策略专题选择事件
	const handleStrategicChange = val => {
		strategicValue.value = val;
		if (val) {
			zbList.value = [];
			let vals = strategic.value.find(m => m.id == val);
			zbList.value = vals.data.children.map(m => {
				return {
					...m,
					value: m.nodeId,
					label: m.nodeName
				};
			});
			handleZbChange(zbList.value[0]);
		}
	};
	// 指标分区对比
	const handleTrendDirectionChange2 = value => {
		let data =
			value && value != 'all'
				? policyStatisticInfo.value.filter(m => m.xzqdm == value)
				: policyStatisticInfo.value;
		barChartData.value = {
			districts: data.map(m => m.xzqmc),
			afterProject: data.map(m => m.predictValue),
			beforeProject: data.map(m => m.monitorValue)
		};
		initBarChart(data[0]?.unit || '');
	};
	const handleTableTabChange = obj => {
		tableTabCurrent.value = obj.value || obj;
		let indicatorDatas =
			policyEffectTrees.value.find(m => m.nodeName == tableTabCurrent.value)
				.children || [];
		indicatorValuetList.value = indicatorDatas.map(m => {
			return {
				xzqdm: m.nodeId,
				xzqmc: m.nodeName
			};
		});
		indicatorValuetList.value.unshift({ xzqdm: 'all', xzqmc: '全部' });
		renderIndicatorTableList();
	};
	// 指标数值
	const handleTrendDirectionChange = value => {
		renderIndicatorTableList(value);
	};
	const renderIndicatorTableList = value => {
		if (policyEffectTrees.value && tableTabCurrent.value) {
			let statisInfo = policyStatisticInfo.value[0];
			baseYear.value = statisInfo?.baseYear || '2024';
			predictYear.value = statisInfo?.predictYear || '2030';

			let indicatorDatas =
				policyEffectTrees.value.find(m => m.nodeName == tableTabCurrent.value)
					.children || [];
			tableList.value = (
				value && value != 'all'
					? indicatorDatas.filter(n => n.nodeId == value)
					: indicatorDatas
			).map(m => {
				return {
					name: m.nodeName,
					baseYear: m.monitorValue,
					predictYear: m.nodeValue,
					value: (m.changeRate * 100).toFixed(2) + '%',
					changeRate: m.changeRate,
					unit: m.unit,
					type: m.changeRate >= 0 ? 'up' : 'down'
				};
			});
		}
	};
	const mapImpactChangeHandle = type => {
		let topic = zbList.value.find(n => n.nodeId == activeZb.value);
		if (maxMapRef.value) {
			let datas = policyStatisticInfo.value.filter(m => m.regionLevel == dyCurrent.value).map(m => {
				return {
					predictValue: type == 'after' ? m.predictValue : m.monitorValue,
					xzqdm: m.xzqdm,
					xzqmc: m.xzqmc,
					indicatorInfo: topic,
					predictYear: yearCurrent.value,
					calculateResult: Object.assign(m, {
						module: 'PolicyEffectLab',
						unit: topic?.unit || ''
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
							module: 'PolicyEffectLab',
							unit: indicatorInfo?.unit || ' '
						}
					}
				];
			}
			maxMapRef.value.renderDatasToMap(dyCurrent.value, datas);
		}
	};

	onMounted(async () => {
		await initProjects1();
		await getStrategic();
	});

	onBeforeUnmount(() => {
		if (barChart) {
			barChart.dispose();
			barChart = null;
		}
		// 清理事件监听器
		window.removeEventListener('resize', () => barChart && barChart.resize());
	});
</script>

<style lang="scss" scoped>
	.right {
		box-sizing: border-box;
		.result {
			text-align: right;
			margin-bottom: 10px;
			img {
				width: 84%;
			}
		}
		.tableTab {
			gap: 0.875rem;
			& li {
				width: 7.125rem;
				height: 1.875rem;
				background-image: url('@/assets/img/tableTab-active.png');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				background-position: center center;
				color: white;
				font-family: 'YouSheBiaoTiHei';
				font-weight: 400;
				font-size: 16px;
				line-height: 24px;
				letter-spacing: 0px;

				& span {
					display: inline-block;
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				&.active {
					background-image: url('@/assets/img/tabBgActive.png');
					font-family: 'YouSheBiaoTiHei';
					font-weight: 400;
					font-size: 16px;
					line-height: 24px;
					letter-spacing: 0px;
					text-align: center;
					color: rgba(245, 231, 79, 1);
				}
			}
		}
		.zbszTable {
			height: 296px;
			.zbszTableBody {
				height: calc(100% - 2.25rem);
				.zbszTableRow {
					display: flex;
					justify-content: space-between;
					box-sizing: border-box;
					div {
						text-align: center;
						height: 30px;
						line-height: 30px;
						font-size: 12px;
						font-weight: 400;
						font-family: 'AlibabaPuHuiTi-55';
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						&:last-child {
							border-right: none;
						}
					}
				}
				.zbszTableRow:nth-child(odd) {
					background-color: rgba(27, 76, 133, 0.5);
				}
			}
		}
		.yearCompare {
			display: flex;
			align-items: center;
			margin-top: 10px;
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
				padding: 20px 10px 0 10px;
				gap: 10px;
				span {
					color: #dbfaff;
					font-size: 16px;
					&:last-child {
						margin-left: auto;
						color: #62dbed;
					}
				}
				&:last-child {
					padding-top: 6px;
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
					font-weight: 700;
				}
				.populationNumberItemValue {
					font-size: 16px;
					font-weight: 800;
					color: #62dbed;
				}
				.populationNumberItemRank {
					font-size: 64px;
					font-weight: 700;
					color: #dbfaff;
				}
			}
			.two {
				.populationNumberItemTitle {
					padding-top: 40px;
				}
				.populationNumberItemValue {
					padding-top: 4px;
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
					padding-top: 4px;
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
					padding-top: 0px;
				}
				.populationNumberItemRank {
					line-height: 1;
				}
			}
		}
		.yearChart1 {
			display: flex;
			margin-bottom: 20px;
			.yearChartItem1 {
				width: 50%;
				.yearChartItemTitle1 {
					font-size: 24px;
					color: rgba(102, 255, 255, 1);
					font-weight: 400;
					font-family: 'YouSheBiaoTiHei';
					text-align: center;
				}
			}
		}
	}
	.mi {
		padding: 0 8%;
		box-sizing: border-box;
	}
	.left {
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
			margin-bottom: 20px;
			.hearder {
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: #002f5e;
				.div {
					width: 33%;
					height: 38px;
					line-height: 38px;
					border-left: 1px solid #013e65;
					text-align: center;
					color: #04abff;
				}
			}
			.body {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10px;
				background: #001429;
				.div {
					width: 33%;
					height: 38px;
					line-height: 38px;
					border-left: 1px solid #013e65;
					text-align: center;
				}
			}
		}
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
		.yearChartItem {
			background: url('@/assets/img/decisionTheater/jygw.png') no-repeat center
				center;
			background-size: 100% 100%;
			width: 100%;
			height: 120px;
			padding: 10px 20px;
			box-sizing: border-box;
			padding-right: 0;
			margin: 10px 0;
			.yearChartItemTitle {
				font-size: 14px;
				color: #fff;
				font-family: 'YouSheBiaoTiHei';
			}
			.yearChartItemContent {
				font-size: 14px;
				color: #fff;
				height: 70px;
				overflow-y: auto;
				padding-right: 10px;
				padding-top: 10px;
				.yearChartItemContentItem {
					display: flex;
					align-items: center;
					span {
						font-size: 12px;
						color: #fff;
						font-weight: 400;
						line-height: 1.2;
						font-family: 'AlibabaPuHuiTi-55';
						&:first-child {
							width: 130px;
						}
						&:last-child {
							color: #66ffff;
							font-size: 18px;
							font-family: 'YouSheBiaoTiHei';
						}
					}
				}
				.yearChartItemContentItem:last-child {
					margin-bottom: 0;
				}
			}
		}
		.choosecl {
			.chooseclItem {
				font-size: 14px;
				height: 45px;
				background-color: #051a27;
				border: 1px solid #abdfff33;
				margin-bottom: 1rem;
				border-radius: 5px;
				& .chooseclItemTitle {
					font-family: 'AlibabaPuHuiTi-85';
					font-weight: 700;
					font-size: 14px;
					text-align: center;
					width: 55px;
					height: 45px;
					padding: 0 6px;
					border-radius: 5px;
					background: #66ffff33;
				}
				& .chooseItemSelect {
					padding: 0 10px;
				}
				& .chooseItemPre {
					& span {
						display: flex;
						align-items: center;
						margin-right: 5px;
						height: 29px;
						padding: 0 10px;
						color: #222222;
						font-family: 'AlibabaPuHuiTi-55';
						font-weight: 400;
						font-size: 14px;
						line-height: 20px;
						border-radius: 6px;
						background-color: #0e839d;
						white-space: nowrap;
						&.original {
							background-color: #ba6147;
						}
						&.green {
							background-color: #65a073;
						}
						&.default {
							background-color: #0e839d;
						}
						&.yellow {
							background-color: #908356;
						}
					}
				}
				:deep(.el-select) {
					width: calc(100% - 110px);
				}
			}
		}
	}
	.mapBtnList {
		position: absolute;
		top: 14px;
		right: 30.3125rem;
		z-index: 1;
		& li {
			width: 5.5rem;
			height: 2.6875rem;
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
