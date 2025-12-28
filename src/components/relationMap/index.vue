<template>
	<div class="w-full h-full mapMin relative">
		<div ref="firstDiv" class="mapBox outer-octagon mb-[0.8125rem]">
			<div ref="secondDiv" class="mapBoxDiv">
				<div ref="thirdDiv" class="mapBoxInner">
					<div class="relative" style="width: calc(100% - 1px); height: calc(100% - 1px)">
						<div id="view_content" class="w-full h-full bg-[#071C32]" ref="network"></div>
						<slot name="mapCon"></slot>
						<ul class="mapTools absolute">
							<li class="mapToolItem relative w-[2rem] h-[2rem] cursor-pointer" :class="{ 'mb-[1rem]': index !== 4 }"
								v-for="(item, index) in 5" :key="'mapToolItem_' + index" :id="'mapToolItem_' + index"
								@click="mapToolClick(index)">
								<img class="w-full h-full" :src="getAssetsFile(
									mapToolItemIdx === index
										? `mapTool${index + 1}-active`
										: `mapTool${index + 1}`
								)
									" alt="" />
								<div v-if="openLegend && mapToolItemIdx === index"
									class="legendWrapper absolute bottom-0 left-[-142px] w-[128px] overflow-hidden overflow-y-auto bg-[rgba(4,110,163,0.8)] select-none"
									@click.stop>
									<p class="legendTitle">指标图例</p>
									<ul>
										<li class="mb-[6px] h-[13px] flex items-center" v-for="item in legendList" :key="item.name">
											<span class="flex w-[23px] h-[12px] mr-[5px]" :style="{ backgroundColor: item.color }"></span>
											<span class="text-[#fff] font-size-[12px]">{{
												item.name
											}}</span>
										</li>
									</ul>
								</div>
							</li>
						</ul>
						<slot>
							<pre id="popupInfoRef" ref="popupInfoRef"></pre>
							<div ref="popupInfoRef" v-if="isVisiblePopupInfo" :style="{
								backgroundImage: `url(${moduleName === 'DeductionEngine'
									? mapTooltips22
									: citySpaceRadar
									})`,
								backgroundSize: '100% 100%',
								backgroundPosition: 'center',
								backgroundRepeat: 'no-repeat',
								top: `${mapTooltipsY}px`,
								left: `${mapTooltipsX}px`,
								zIndex: 99,
								paddingTop: moduleName === 'DeductionEngine' ? '4px' : '58px',
								paddingLeft: moduleName === 'DeductionEngine' ? '9px' : '9px',
								width: moduleName === 'DeductionEngine' ? '229px' : '320px',
								height: moduleName === 'DeductionEngine' ? '102px' : '202px'
							}" class="mapTooltips absolute">
								<div class="title">{{ popupInfoObj.title }}</div>
								<ul class="content" v-if="moduleName == 'DeductionEngine'">
									<li class="item flex items-center mb-[6px]">
										<span class="dic"></span>
										<span class="key">{{ popupInfoObj.baseYear }}：</span>
										<span class="value">
											{{ convertData(popupInfoObj.monitorVal) }}
										</span>
									</li>
									<li class="item flex items-center mb-[6px]">
										<span class="dic"></span>
										<span class="key">{{ popupInfoObj.predictYear }}：</span>
										<span class="value">
											{{ convertData(popupInfoObj.predictVal) }}
										</span>
									</li>
									<li class="item flex items-center">
										<span class="dic"></span>
										<span class="key">{{ popupInfoObj.changeRate }}：</span>
										<span class="value">
											{{ popupInfoObj.rateVal }}
										</span>
									</li>
								</ul>
								<ul class="content" v-if="moduleName == 'CitySpaceRadar'">
									<li class="item flex items-center mb-[6px]">
										<span class="dic"></span>
										<span class="key">{{ '指标状态' }}：</span>
										<span class="value" :style="{ color: getStateColorClass() }">
											{{ popupInfoObj.state }}
										</span>
									</li>
									<li class="item flex items-center mb-[6px]">
										<span class="dic"></span>
										<span class="key">{{ '规划值' }}：</span>
										<span class="value">
											{{ convertData(popupInfoObj.planVal) }}
										</span>
									</li>
									<li class="item flex items-center mb-[6px]">
										<span class="dic"></span>
										<span class="key">{{ '推演值' }}：</span>
										<span class="value">
											{{ convertData(popupInfoObj.predictVal) }}
										</span>
									</li>
									<li class="item flex items-center mb-[6px]">
										<span class="dic"></span>
										<span class="key">{{ '偏差率' }}：</span>
										<span class="value">
											{{ popupInfoObj.changeRate }}
										</span>
									</li>
									<li class="item flex items-center">
										<span class="dic"></span>
										<span class="key">{{ '偏差值' }}：</span>
										<span class="value">
											{{ convertData(popupInfoObj.changeVal) }}
										</span>
									</li>
								</ul>
							</div>
						</slot>
					</div>
				</div>
			</div>

			<img class="mapVectorTop2" src="@/assets/img/mapVectorTop2.png" alt="" />
			<img class="mapVectorLeft2" src="@/assets/img/mapVectorLeft2.png" alt="" />
			<img class="mapVectorRight2" src="@/assets/img/mapVectorRight2.png" alt="" />
		</div>
		<img class="mapVectorLeft" src="@/assets/img/mapVectorLeft.png" alt="" />
		<img class="mapVectorRight" src="@/assets/img/mapVectorRight.png" alt="" />
		<el-carousel class="h-[7.75rem] px-[3.375rem]" indicator-position="none" ref="carouselRef">
			<el-carousel-item v-for="(group, groupIndex) in groupedCarouselList" :key="groupIndex">
				<div class="chartsBo flex flex-wrap select-none">
					<div :class="[
						'chartBoList',
						{
							zbBg: zbBg,
							green: item.grade == '0',
							red: ['2', '4'].includes(item.grade),
							yellow: ['1', '3'].includes(item.grade)
						}
					]" v-for="(item, itemIndex) in group" :key="`${groupIndex}_${itemIndex}`">
						<div class="flex items-center justify-center w-[3.6875rem]">
							<img v-if="!zbBg" class="img-0" src="@/assets/img/zbBg0-0.png" alt="" />
							<img v-if="item.grade == '0'" class="img-0" src="@/assets/img/zbBg-2-x.png" alt="" />
							<img v-if="['2', '4'].includes(item.grade)" class="img-0" src="@/assets/img/zbBg-3-x.png" alt="" />
							<img v-if="['1', '3'].includes(item.grade)" class="img-0" src="@/assets/img/zbBg-1-x.png" alt="" />
						</div>
						<div class="chartBoListTitle">
							<el-tooltip v-if="item.nodeName.length > 10" class="box-item" effect="dark" :content="item.nodeName"
								placement="top">
								<div class="chartBoListTitleName">{{ item.nodeName }}</div>
							</el-tooltip>
							<div class="chartBoListTitleName" v-else>{{ item.nodeName }}</div>
							<div class="chartBoListTitleValue">
								基准年份：{{ convertData(item.nodeValue) }}
							</div>
							<div class="chartBoListTitleValue">
								预测年份：{{ convertData(item.nodeValue2) }}
							</div>
						</div>
					</div>
				</div>
			</el-carousel-item>
		</el-carousel>
	</div>
</template>

<script setup>
// 文档地址：https://visjs.github.io/vis-network/docs/network/index.html?keywords=hoverNode
import { Network } from 'vis';
import { getAssetsFile } from '@/utils/index.js';
import { convertData } from '@/utils/calculation.js';
import mapTooltips22 from '@/assets/img/mapTooltips22.png';
import citySpaceRadar from '@/assets/img/citySpaceRadar.png';
// import { zoomIn, zoomOut, fullMap, resetMap } from './mapInteraction.js';

const carouselRef = ref(null)
const moduleName = ref('DeductionEngine');
const mapTooltipsX = ref(0);
const mapTooltipsY = ref(0);
const popupInfoRef = ref(null);
const isVisiblePopupInfo = ref(false);
const transformData = ref(null);
const popupInfoObj = ref({
	title: '同和里街道-人口密度',
	baseYear: '2024年',
	monitorVal: '18536 人/平方米',
	predictYear: '2030年',
	predictVal: '18536 人/平方米',
	changeRate: '变化率',
	rateVal: '+12.54%'
});

const nodeDatas = ref([]);
const focusNodeDatas = ref([]);
let networkObj = null;
const firstDiv = ref(null);
const secondDiv = ref(null);
const thirdDiv = ref(null);
const openLegend = ref(false);
const mapToolItemIdx = ref(-1);
const legendList = ref([]);

const props = defineProps({
	relationTree: {
		type: Array,
		default: () => {
			return null;
		}
	},
	carouselList: {
		type: Array,
		default: () => {
			return [];
		}
	},
	zbBg: {
		type: Boolean,
		default: false
	}
});

/**
 * 将轮播数据按6个一组进行分组
 */
const groupedCarouselList = computed(() => {
	const groupSize = 6;
	const groups = [];

	if (!props.carouselList || props.carouselList.length === 0) {
		return groups;
	}

	for (let i = 0; i < props.carouselList.length; i += groupSize) {
		const group = props.carouselList.slice(i, i + groupSize);
		groups.push(group);
	}

	return groups;
});

watch(
	() => props.relationTree,
	v => {
		if (v) {
			nextTick(() => {
				drawRelationNetwork(props.relationTree);
			});
		}
	},
	{ immediate: true }
);

// 同步宽度的函数
const syncWidth = () => {
	const screenWidth =
		window.innerWidth || document.documentElement.clientWidth;
	if (firstDiv.value && thirdDiv.value) {
		const firstWidth = firstDiv.value.offsetWidth;
		const a = 1160 * (screenWidth / 1920);
		secondDiv.value.style.width = `${a}px`;
		secondDiv.value.style.height = `${a}px`;
		thirdDiv.value.style.width = `${firstWidth}px`;
	}
};

onMounted(() => {
	syncWidth();
	window.addEventListener('resize', syncWidth);
	// drawRelationNetwork();
	setInterval(() => {
		carouselRef.value?.next()
	}, 2 * 1000);
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', syncWidth);
});

const getStateColorClass = () => {
	const state = popupInfoObj.value.state;
	switch (state) {
		case '安全':
			return '#2cccff';
		case '警告':
			return '#A29012';
		case '危险':
			return '#AB342B';
		default:
			return '#2cccff';
	}
};

// 地图工具点击
const mapToolClick = index => {
	mapToolItemIdx.value = mapToolItemIdx.value === index ? -1 : index;
	switch (index) {
		// 	case 0:
		// 		return resetMap();
		// 	case 1:
		// 		return fullMap();
		// 	case 2:
		// 		return zoomIn();
		// 	case 3:
		// 		return zoomOut();
		case 4:
			openLegend.value = !openLegend.value;
			return;
	}
	console.log('地图工具点击:', index);
};

const drawRelationNetwork = data => {
	if (!data) return;
	transformData.value = transformDataToNetwork(data);
	nodeDatas.value = transformData.value;

	// create a network
	var container = document.getElementById('view_content');
	var data = {
		nodes: transformData.value.nodes,
		edges: transformData.value.edges
	};
	var options = {
		interaction: {
			hover: true,
			dragNodes: true,
			dragView: true
		},
		nodes: {
			shape: 'dot',
			font: {
				size: 20,
				color: '#ffffff',
				strokeWidth: 3,
				strokeColor: 'rgba(0,0,0,0.7)'
			},
			borderWidth: 3,
			color: {
				border: '#333333',
				highlight: {}
			},
			size: 20,
			scaling: {
				min: 10,
				max: 30
			}
		},
		edges: {
			width: 2,
			color: {
				color: '#888888',
				highlight: 'blue',
				hover: '#222222'
			},
			smooth: false,
			length: 200,
			chosen: false
		},
		physics: {
			enabled: true,
			stabilization: {
				enabled: true,
				iterations: 200,
				fit: true,
				updateInterval: 20
			},
			solver: 'barnesHut',
			barnesHut: {
				gravitationalConstant: -20000,
				centralGravity: 0.1,
				springLength: 250,
				springConstant: 0.01,
				damping: 0.5,
				avoidOverlap: 1.5
			},
			timestep: 0.5,
			adaptiveTimestep: false,
			// 启用层级模式，使子节点跟随父节点移动
			hierarchical: {
				enabled: false, // 我们不使用层级布局，但保留此选项
				levelSeparation: 150,
				nodeSpacing: 100,
				treeSpacing: 200,
				blockShifting: true,
				edgeMinimization: true,
				parentCentralization: true,
				direction: 'UD', // 上下方向
				sortMethod: 'hubsize'
			}
		},
		groups: {
			人口专题: { color: '#E39BA7' },
			产业专题: { color: '#1FC6FF' },
			土地专题: { color: '#E8C46D' },
			公服专题: { color: '#E64E50' },
			低碳专题: { color: '#7EF48B' },
			交通专题: { color: '#8B72FC' },
			结构专题: { color: '#067373' },
			韧性专题: { color: '#F959D6' }
		}
	};
	legendList.value = Object.keys(options.groups).map(key => ({
		name: key,
		color: options.groups[key].color
	}));

	networkObj = new Network(container, data, options);

	// 稳定化完成后禁用物理引擎，但保持层级行为
	networkObj.on("stabilizationIterationsDone", function () {
		// 启用层级物理行为
		networkObj.setOptions({
			physics: {
				enabled: true,
				stabilization: { enabled: false },
				solver: 'hierarchicalRepulsion', // 使用层级排斥求解器
				hierarchicalRepulsion: {
					centralGravity: 0.0,
					springLength: 200,
					springConstant: 0.01,
					nodeDistance: 120,
					damping: 0.09
				}
			}
		});
	});

	// 添加拖拽事件处理，使子节点跟随移动
	networkObj.on("dragStart", function (params) {
		// 当开始拖拽时，临时调整物理参数使子节点更容易跟随
		networkObj.setOptions({
			physics: {
				hierarchicalRepulsion: {
					nodeDistance: 200, // 增加节点距离使子节点更容易跟随
					springConstant: 0.05, // 增加弹簧强度使连接更紧密
					damping: 0.05 // 减少阻尼使响应更灵敏
				}
			}
		});
	});

	networkObj.on("dragEnd", function (params) {
		// 拖拽结束后恢复物理参数
		setTimeout(function () {
			networkObj.setOptions({
				physics: {
					hierarchicalRepulsion: {
						nodeDistance: 120,
						springConstant: 0.01,
						damping: 0.09
					}
				}
			});
		}, 500);
	});

	// 关联图鼠标悬浮事件
	networkObj?.on('hoverNode', hoverNodeHandle);
	networkObj?.on('blurNode', blurNodeHandle);
	// 显示图例信息
	let t = setTimeout(() => {
		openLegend.value = true;
		mapToolItemIdx.value = 4;
	}, 0.5 * 1000);
};

function transformDataToNetwork(treeData) {
	const nodes = [];
	const edges = [];
	let idCounter = 0;

	// 大小映射表
	const sizeMap = {
		0: 50, // 专题级别 - 最大
		1: 30, // 分类级别 - 中等
		2: 14 // 指标级别 - 最小
	};

	// 字体大小映射表
	const fontSizeMap = {
		0: 32, // 专题级别
		1: 20, // 分类级别
		2: 12 // 指标级别
	};

	// 递归处理节点
	function processNode(node, parentId = null, rootTopic = null, depth = 0) {
		const currentNodeId = idCounter++;
		// 确定根专题
		let currentRootTopic = rootTopic;
		if (depth === 0) {
			currentRootTopic = node.nodeName;
		}
		// 根据深度确定节点级别
		let nodeLevel;
		if (depth === 0) {
			nodeLevel = 0; // 专题级别
		} else if (depth === 1) {
			nodeLevel = 1; // 分类级别
		} else {
			nodeLevel = 2; // 指标级别
		}
		// 添加节点，使用根节点的nodeName作为group
		nodes.push({
			id: currentNodeId,
			label: node.nodeName,
			group: currentRootTopic, // 直接使用根节点的nodeName作为group
			level: nodeLevel, // 保存级别信息用于样式
			size: sizeMap[nodeLevel] || 20,
			font: {
				size: fontSizeMap[nodeLevel] || 14,
				color: '#ffffff',
				strokeWidth: 3,
				strokeColor: 'rgba(0,0,0,0.7)'
			},
			calculateResult: node?.calculateResult || null
		});

		// 如果有父节点，添加边
		if (parentId !== null) {
			edges.push({
				from: parentId,
				to: currentNodeId
			});
		}

		// 处理子节点
		if (node.children && node.children.length > 0) {
			node.children.forEach(child => {
				processNode(child, currentNodeId, currentRootTopic, depth + 1);
			});
		}

		return currentNodeId;
	}

	// 处理所有根节点
	treeData.forEach(root => {
		processNode(root);
	});

	// 所有根节点相连
	let rootNodes = nodes.filter(n => n.level == 0);
	for (let i = 0, len = rootNodes.length - 1; i < len; i++) {
		edges.push({
			from: rootNodes[i].id,
			to: rootNodes[i + 1].id
		});
	}
	return {
		nodes: nodes,
		edges: edges
	};
}

const hoverNodeHandle = params => {
	popupInfoObj.value = null;
	let treeNode = transformData.value.nodes.find(n => n.id == params.node);

	let node = null;
	focusNodeDatas.value.children.find(n => {
		let item = n.children.find(m => m.nodeName == treeNode.label);
		if (item) {
			node = item;
		}
	});
	if (!node) return;
	moduleName.value = node?.calculateResult?.module || '';
	if (node?.calculateResult && moduleName.value == 'DeductionEngine') {
		displayDeductionEngineInfo(node?.calculateResult);
	}
	if (node?.calculateResult && moduleName.value == 'CitySpaceRadar') {
		displayCitySpaceRadarInfo(node?.calculateResult);
	}
	isVisiblePopupInfo.value = popupInfoObj.value;
	const x = params.event.offsetX;
	const y = params.event.offsetY;
	mapTooltipsX.value = x - 60;
	mapTooltipsY.value = y;
};

const blurNodeHandle = () => {
	isVisiblePopupInfo.value = false;
};

// 推演引擎
const displayDeductionEngineInfo = val => {
	popupInfoObj.value = {
		title: val?.xzqmc + '-' + val?.indicatorName,
		baseYear: val?.baseYear + '年',
		monitorVal: val?.monitorValue + val?.unit,
		predictYear: val?.predictYear + '年',
		predictVal: val?.predictValue + val?.unit,
		changeRate: '变化率',
		rateVal: ((val?.changeRate || 0) * 100).toFixed(2) + '%'
	};
};

// 城市预警雷达
const displayCitySpaceRadarInfo = val => {
	popupInfoObj.value = {
		title: val?.xzqmc + '-' + val?.indicatorName,
		state: {
			0: '安全',
			1: '警告',
			2: '危险',
			3: '警告',
			4: '危险'
		}[val?.grade],
		planVal: val?.planValue + val?.unit,
		predictVal: val?.predictValue + val?.unit,
		changeRate:
			'较规划值' +
			`${val.predictValue - val.planValue >= 0 ? '多' : '少'}` +
			(
				((val.predictValue - val.planValue) / val.planValue || 0) * 100
			).toFixed(2) +
			'%',
		changeVal:
			'较规划值' +
			`${val.predictValue - val.planValue >= 0 ? '多' : '少'}` +
			`${Math.abs(val.predictValue - val.planValue).toFixed(2)}` +
			val?.unit
	};
};

// 聚焦选中专题
const focusData = val => {
	if (networkObj && val) {
		focusNodeDatas.value = val;
		let node = nodeDatas.value.nodes.find(n => n.label == val.nodeName);
		if (node) {
			let t = window.setTimeout(() => {
				networkObj.focus(node.id, {
					scale: 1.2, // 缩放级别，默认1.0
					offset: { x: 0, y: 0 }, // 偏移量
					animation: {
						// 动画配置
						duration: 1400,
						easingFunction: 'easeInOutQuad'
					},
					locked: true
				});
			}, 1 * 1000);
		}
	}
};

// 暴露方法给父组件
defineExpose({
	focusData
});
</script>

<style lang="scss" scoped>
.mapMin {
	padding: 0 3.375rem;
	box-sizing: border-box;

	.chartBoList {
		display: flex;
		align-items: center;
		background-image: url('@/assets/img/zbBg0.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center center;
		box-sizing: border-box;
		width: calc((100% - 6rem) / 3);
		height: 3.5rem;
		padding: 0.375rem 1.25rem 0 0;
		box-sizing: border-box;

		&:not(:nth-child(4n)) {
			margin-bottom: 0.75rem;
		}

		&:nth-child(3n - 1) {
			margin: 0 3rem;
		}

		&.yellow {
			background-image: url('@/assets/img/zbBg-1.png');
		}

		&.green {
			background-image: url('@/assets/img/zbBg-2.png');
		}

		&.red {
			background-image: url('@/assets/img/zbBg-3.png');
		}

		.chartBoListTitle {
			width: 11.4375rem;

			.chartBoListTitleName {
				font-family: 'YouSheBiaoTiHei';
				font-size: 1rem;
				line-height: 1rem;
				font-weight: 400;
				color: #ffffff;
				width: 11.4375rem;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			.chartBoListTitleValue {
				font-family: 'SourceHanSansCN-Regular';
				font-size: 0.75rem;
				font-weight: 400;
				line-height: 0.875rem;
				vertical-align: middle;
				color: #ffffff;
			}
		}
	}

	.mapVectorLeft {
		position: absolute;
		top: 15.625%;
		left: 0.625rem;
		width: 2.625rem;
	}

	.mapVectorRight {
		position: absolute;
		top: 15.625%;
		right: 0.625rem;
		width: 2.625rem;
	}
}

.mapBox {
	position: relative;
	width: 100%;
	height: 45.625rem;
	// height: 73.73737373737373%;
	overflow: hidden;

	.mapVectorTop2 {
		position: absolute;
		top: 0;
		left: 50%;
		z-index: 2;
		transform: translateX(-50%);
		width: 5.125rem;
	}

	.mapVectorLeft2 {
		position: absolute;
		top: 50%;
		left: 0;
		z-index: 2;
		transform: translateY(-50%);
		width: 0.6875rem;
	}

	.mapVectorRight2 {
		position: absolute;
		top: 50%;
		right: 0;
		z-index: 2;
		transform: translateY(-50%);
		width: 0.6875rem;
	}

	& .mapBoxDiv {
		box-sizing: border-box;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(45deg);
		overflow: hidden;
		border: 1px solid rgba(94, 188, 245, 0.38);
	}

	& .mapBoxInner {
		height: 45.625rem;
		box-sizing: border-box;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(-45deg);
		content: ' ';
		border: 1px solid rgba(94, 188, 245, 0.38);
		overflow: hidden;
	}
}

.mapTools {
	bottom: 3rem;
	right: 1rem;
	z-index: 2;
}

.mapTooltips {
	& .title {
		font-family: 'AlibabaPuHuiTi-85';
		font-weight: 700;
		font-size: 14px;
		line-height: 16px;
		letter-spacing: 0%;
		color: #e7efff;
	}

	& .content {
		padding-top: 12px;
	}

	& .dic {
		display: inline-block;
		margin-right: 8px;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background-color: #1563eb;
	}

	& .key {
		font-family: 'AlibabaPuHuiTi-65';
		font-weight: 500;
		font-size: 14px;
		line-height: 16px;
		white-space: nowrap;
		color: #e7efff;
	}

	& .value {
		font-family: 'AlibabaPuHuiTi-85';
		font-weight: 700;
		font-size: 16px;
		line-height: 16px;
		white-space: nowrap;
		color: #2cccff;
	}
}

.legendWrapper {
	padding: 9px 0 10px 7px;

	& .legendTitle {
		color: white;
		font-family: 'AlibabaPuHuiTi-85';
		font-weight: 700;
		font-size: 10px;
		line-height: 100%;
		letter-spacing: 5%;
		padding-bottom: 8px;
	}
}

/* 自定义箭头容器 */
:deep(.el-carousel__arrow) {
	width: 40px;
	height: 40px;
	background-color: transparent;
	border: none;
	display: block !important;
}

/* 隐藏默认箭头图标 */
:deep(.el-carousel__arrow i) {
	display: none;
}

:deep(.el-carousel__arrow--left) {
	left: 0;
}

:deep(.el-carousel__arrow--right) {
	right: 0;
}

/* 使用伪元素添加图片 */
:deep(.el-carousel__arrow--left)::before,
:deep(.el-carousel__arrow--right)::before {
	content: '';
	display: block;
	width: 100%;
	height: 100%;
	background-size: contain;
	background-repeat: no-repeat;
	opacity: 0.57;
}

:deep(.el-carousel__arrow--left):hover::before {
	background-image: url('@/assets/img/icon-left-arrow-active.png');
}

:deep(.el-carousel__arrow--right):hover::before {
	background-image: url('@/assets/img/icon-right-arrow-active.png');
}

:deep(.el-carousel__arrow--left)::before {
	background-image: url('@/assets/img/icon-left-arrow.png');
}

:deep(.el-carousel__arrow--right)::before {
	background-image: url('@/assets/img/icon-right-arrow.png');
}
</style>
