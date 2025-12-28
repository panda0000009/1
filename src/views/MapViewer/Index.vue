<!-- 地图组件 -->
<template>
	<!-- <OLMap
		ref="map"
		style="width: 100%; height: 100%; border: 2px solid #000"
		:getMap="getMapHandle"
		:mapOptions="mapStore.mapDefaultOption">
	</OLMap> -->
	<div class="map-container" :class="{ 'map-loading': isMapLoading }"
		style="width: 100%; height: 100%; position: relative;">
		<OLMap ref="map" style="width: 100%; height: 100%; border: 2px solid #000" :getMap="getMapHandle"
			:mapOptions="mapStore.mapDefaultOption">
		</OLMap>
		<!-- Loading 遮罩 -->
		<div v-if="isMapLoading" class="map-loading-overlay">
			<div class="map-loading-content">
				<div class="map-loading-spinner"></div>
				<div class="map-loading-text">数据加载中...</div>
			</div>
		</div>
	</div>
	<div
		ref="popupInfoRef"
		:style="{
			backgroundImage: `url(${getMapTooltip(moduleName).bg})`,
			backgroundSize: '100% 100%',
			backgroundPosition: 'center',
			backgroundRepeat: 'no-repeat',
			zIndex: 99,
			maxWidth: '360px',
			paddingRight: '10px',
			paddingTop: getMapTooltip(moduleName).pt,
			paddingLeft: getMapTooltip(moduleName).pl,
			height: getMapTooltip(moduleName).height
		}"
		class="mapTooltips">
		<div class="title">{{ popupInfoObj.title }}</div>
		<!-- 动态监测 -->
		<ul class="content" v-if="moduleName == 'DynamicMonitor'">
			<li class="item flex items-center mb-[9px]">
				<span class="dic"></span>
				<span class="key">{{ popupInfoObj.baseYear }}：</span>
				<span class="value">
					{{ (popupInfoObj?.monitorVal || 0) || "" }}
				</span>
			</li>
			<!-- <li class="item flex items-center">
				<span class="dic"></span>
				<span class="key">{{ popupInfoObj.predictYear }}：</span>
				<span class="value">
					{{ (popupInfoObj?.predictVal || 0) || "" }}
				</span>
			</li> -->
		</ul>
		<!-- 未来魔镜 -->
		<ul class="content" v-if="moduleName == 'FeatureMirror'">
			<li class="item flex items-center mb-[9px]">
				<span class="dic"></span>
				<span class="key">{{ popupInfoObj.baseYear }}：</span>
				<span class="value">
					{{ (popupInfoObj?.monitorVal || 0) || "" }}
				</span>
			</li>
			<li class="item flex items-center">
				<span class="dic"></span>
				<span class="key">{{ popupInfoObj.predictYear }}：</span>
				<span class="value">
					{{ (popupInfoObj?.predictVal || 0) || "" }}
				</span>
			</li>
		</ul>
		<!-- 规划预警雷达 -->
		<ul class="content" v-if="moduleName == 'TimeSpaceRadar'">
			<li class="item flex items-center mb-[9px]">
				<span class="dic"></span>
				<span class="key">{{ '指标状态' }}：</span>
				<span class="value" :style="{ color: getStateColorClass() }">
					{{ popupInfoObj.state }}
				</span>
			</li>
			<li class="item flex items-center mb-[9px]">
				<span class="dic"></span>
				<span class="key">{{ '规划值' }}：</span>
				<span class="value">
					{{ convertData(popupInfoObj?.planVal || 0) || "" }}
				</span>
			</li>
			<li class="item flex items-center mb-[9px]">
				<span class="dic"></span>
				<span class="key">{{ '推演值' }}：</span>
				<span class="value">
					{{ convertData(popupInfoObj?.predictVal || 0) || "" }}
				</span>
			</li>
			<li class="item flex items-center mb-[9px]">
				<span class="dic"></span>
				<span class="key">{{ '偏差率' }}：</span>
				<span class="value">
					{{ popupInfoObj?.changeRate }}
				</span>
			</li>
			<li class="item flex items-center">
				<span class="dic"></span>
				<span class="key">{{ '偏差值' }}：</span>
				<span class="value">
					{{ popupInfoObj?.changeVal }}
				</span>
			</li>
		</ul>
		<ul class="content" v-if="moduleName == 'IntegratedAssessment'">
			<li class="item flex items-center mb-[9px]">
				<span class="dic"></span>
				<span class="key">{{ '指标评估' }}：</span>
				<span class="value" :style="{ color: getStateColorClass() }">
					{{ popupInfoObj.state }}
				</span>
			</li>
			<li class="item flex items-center mb-[9px]">
				<span class="dic"></span>
				<span class="key">{{ '现状值' }}：</span>
				<span class="value">
					{{ convertData(popupInfoObj?.planVal || 0) || "" }}
				</span>
			</li>
		</ul>
		<!-- 城市预警雷达 -->
		<ul class="content" v-if="moduleName == 'CitySpaceRadar'">
			<li class="item flex items-center mb-[9px]">
				<span class="dic"></span>
				<span class="key">{{ '指标预警' }}：</span>
				<span class="value" :style="{ color: getStateColorClass() }">
					{{ popupInfoObj.state }}
				</span>
			</li>
			<li class="item flex items-center mb-[9px]">
				<span class="dic"></span>
				<span class="key">{{ '推演值' }}：</span>
				<span class="value">
					{{ convertData(popupInfoObj?.predictVal || 0) || "" }}
				</span>
			</li>
			<!-- <li class="item flex items-center mb-[9px]">
				<span class="dic"></span>
				<span class="key">{{ '推演值' }}：</span>
				<span class="value">
					{{ convertData(popupInfoObj?.predictVal || 0) || "" }}
				</span>
			</li>
			<li class="item flex items-center mb-[9px]">
				<span class="dic"></span>
				<span class="key">{{ '偏差率' }}：</span>
				<span class="value">
					{{ popupInfoObj?.changeRate || 0 }}
				</span>
			</li>
			<li class="item flex items-center">
				<span class="dic"></span>
				<span class="key">{{ '偏差值' }}：</span>
				<span class="value">
					{{ popupInfoObj?.changeVal || 0 }}
				</span>
			</li> -->
		</ul>
		<!-- 重大项目剧场 -->
		<ul class="content" v-if="moduleName == 'MajorProject'">
			<li class="item flex items-center mb-[9px]">
				<span class="dic"></span>
				<span class="key">{{ '项目实施前' }}：</span>
				<span class="value">
					{{ convertData(popupInfoObj?.prePlanVal || 0) || "" }}
				</span>
			</li>
			<li class="item flex items-center mb-[9px]">
				<span class="dic"></span>
				<span class="key">{{ '项目实施后' }}：</span>
				<span class="value">
					{{ convertData(popupInfoObj?.afterPlanVal || 0) || "" }}
				</span>
			</li>
			<li class="item flex items-center">
				<span class="dic"></span>
				<span class="key">{{ '变化率' }}：</span>
				<span class="value">
					{{ popupInfoObj?.changeRate || 0 }}
				</span>
			</li>
		</ul>
		<!-- 项目对比剧场 -->
		<ul class="content" v-if="moduleName == 'ProjectComparison'">
			<li class="item flex items-center mb-[9px]">
				<span class="dic"></span>
				<span class="key">{{ popupInfoObj?.indicatorName }}：</span>
				<span class="value">
					{{ popupInfoObj?.changeRate || 0 }}
				</span>
			</li>
		</ul>
		<!-- 政策效果实验室 -->
		<ul class="content" v-if="moduleName == 'PolicyEffectLab'">
			<li class="item flex items-center mb-[9px]">
				<span class="dic"></span>
				<span class="key">{{ '政策调控前' }}：</span>
				<span class="value">
					{{ convertData(popupInfoObj?.prePlanVal || 0) || "" }}
				</span>
			</li>
			<li class="item flex items-center mb-[9px]">
				<span class="dic"></span>
				<span class="key">{{ '政策调控后' }}：</span>
				<span class="value">
					{{ convertData(popupInfoObj?.afterPlanVal || 0) || "" }}
				</span>
			</li>
			<li class="item flex items-center">
				<span class="dic"></span>
				<span class="key">{{ '变化率' }}：</span>
				<span class="value">
					{{ popupInfoObj?.changeRate || 0 }}
				</span>
			</li>
		</ul>
		<!-- 规划方案大沙盘 -->
		<ul class="content" v-if="moduleName == 'PlanningSandbox'">
			<li class="item flex items-center mb-[9px]">
				<span class="dic"></span>
				<span class="key">{{ '规划调整前' }}：</span>
				<span class="value">
					{{ convertData(popupInfoObj?.prePlanVal || 0) || "" }}
				</span>
			</li>
			<li class="item flex items-center mb-[9px]">
				<span class="dic"></span>
				<span class="key">{{ '规划调整后' }}：</span>
				<span class="value">
					{{ convertData(popupInfoObj?.afterPlanVal || 0) || "" }}
				</span>
			</li>
			<li class="item flex items-center">
				<span class="dic"></span>
				<span class="key">{{ '变化率' }}：</span>
				<span class="value">
					{{ popupInfoObj?.changeRate }}
				</span>
			</li>
		</ul>
	</div>
</template>
<script setup>
	import mapTooltips22 from '@/assets/img/mapTooltips22.png';
	import mapTooltips5 from '@/assets/img/mapTooltips5.png';
	import OLMap from '@/components/map/components/Map.vue';
	import { BASE_LAYER_NAME } from '@/components/map/primitive/config/LayerConstantConfig.js';
	import buildLayer, {
		LayerType
	} from '@/components/map/primitive/layer/Layer';
	import GeoJSONUtil from '@/components/map/primitive/util/GeojsonUtil.js';
	import { buildProjection } from '@/components/map/primitive/util/ProjectionUtil.js';

	import Overlay from 'ol/Overlay.js';
	import { useMapStore } from '@/stores/modules/map.js';
	import { convertData } from '@/utils/calculation.js';

	import proj4 from 'proj4'
	import { register } from 'ol/proj/proj4'
	// import OLWebGLTileLayer from "ol/layer/WebGLTile";
	// import OLGeoTIFFSource from "ol/source/GeoTIFF";
	import { gridInfos } from './gridData.js'

	const mapStore = useMapStore();
	const popupInfoRef = ref(null);
	const popupInfoObj = ref({
		title: '数据推演信息',
		baseYear: '2024年',
		monitorVal: 'ㅡㅡ',
		predictYear: '2030年',
		predictVal: 'ㅡㅡ'
	});
	const moduleName = ref('FeatureMirror');
	const isMapLoading = ref(false); // 地图加载状态
	const BaseLayerOption = [
		{
			name: 'Layer3',
			type: 'xyz',
			zIndex: -99,
			url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer'
		},
		{
			name: 'Layer3',
			type: 'xyz',
			zIndex: -99,
			url: 'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=851e3bacf2a59e3179a5cb71e8d6440e',
			tileLoadFunction: (imageTile, src) => {
				if (src.includes('tianditu')) {
					const img = new Image();
					img.setAttribute('crossOrigin', 'anonymous');
					// 使用滤镜 将白色修改为深色
					img.onload = () => {
						const canvas = document.createElement('canvas');
						const w = img.width;
						const h = img.height;
						canvas.width = w;
						canvas.height = h;
						const context = canvas.getContext('2d');
						if (src.includes('vec_w') || src.includes('cva_w')) {
							context.filter =
								// 黑色
								// 'grayscale(98%) invert(100%) sepia(20%) hue-rotate(180deg) saturate(100%) brightness(80%) contrast(90%)'
								// 暗蓝色
								'grayscale(98%) invert(100%) sepia(20%) hue-rotate(180deg) saturate(1800%) brightness(80%) contrast(90%)';
						}
						context.drawImage(img, 0, 0, w, h, 0, 0, w, h);
						imageTile.getImage().src = canvas.toDataURL('image/png');
					};
					img.src = src;
				} else {
					imageTile.getImage().src = src;
				}
			}
		}
	];
	const levelClrs = [
		{
			level: '0级',
			name: '透明色',
			color: 'RGBA(255, 255, 255, 0.001)'
		},
		{
			level: '1级',
			name: '紫色',
			color: 'RGBA(92, 9, 252, 0.4)'
		},
		{
			level: '2级',
			name: '蓝色',
			color: 'RGBA(0, 144, 254, 0.4)'
		},
		{
			level: '3级',
			name: '青色',
			color: 'RGBA(69, 252, 219, 0.4)'
		},
		{
			level: '4级',
			name: '草黄色',
			color: 'RGBA(168, 255, 135, 0.4)'
		},
		{
			level: '5级',
			name: '黄色',
			color: 'RGBA(255, 203, 33, 0.4)'
		},
		{
			level: '6级',
			name: '橙色',
			color: 'RGBA(255, 161, 53, 0.4)'
		},
		{
			level: '7级',
			name: '红色',
			color: 'RGBA(254, 35, 10, 0.4)'
		}
	];
	const dangerLevelClrs = [
		{
			level: '0级',
			name: '无',
			color: 'RGBA(255, 255, 255, 0.001)'
		},
		{
			level: '3级',
			name: '危险区域',
			color: 'RGBA(254, 35, 53, 0.4)'
		},
		{
			level: '1级',
			name: '安全区域',
			color: 'RGBA(0, 144, 254, 0.4)'
		},
		{
			level: '2级',
			name: '警告区域',
			color: 'RGBA(255, 203, 33, 0.4)'
		}
	];
	const originalDatas = ref([]);
	const legendList = ref([]);
	let districtLevels = {};
	const VecLayerOption = [
		{
			name: 'Layer5',
			type: 'vector',
			zIndex: -97,
			url: './datas/cover.geojson',
			lyrStyle: feature => {
				return {
					fill: {
						color: 'rgba(0, 0, 0, 0.3)'
					},
					stroke: {
						color: 'rgba(125, 125, 125, 0.8)',
						width: 2
					}
				};
			}
		},
		{
			name: 'Layer6',
			type: 'vector',
			zIndex: -98,
			url: './datas/country.geojson',
			lyrStyle: feature => {
				// let color = districtClrs.find(n => n.name == feature.properties.name)?.color || districtClrs[0].color
				let color = levelClrs[0].color;
				if (districtLevels[feature.properties.CONAME]) {
					color = districtLevels[feature.properties.CONAME];
				} else {
					color =
						levelClrs[Math.floor(Math.random() * levelClrs.length)]?.color ||
						levelClrs[0].color;
					districtLevels[feature.properties.CONAME] = color;
				}
				return {
					fill: {
						color: color || 'rgba(0, 0, 0, 0.4)'
					},
					stroke: {
						color: 'rgba(125, 125, 125, 0.8)',
						width: 0.1
					},
					text: {
						color: 'white'
						// text: feature.properties.CONAME
					}
				};
			}
		},
		{
			name: 'Layer4',
			type: 'vector',
			zIndex: -98,
			url: './datas/street.json',
			lyrStyle: feature => {
				// let color = districtClrs.find(n => n.name == feature.properties.name)?.color || districtClrs[0].color
				let color = levelClrs[0].color;
				if (districtLevels[feature.properties.SNAME]) {
					color = districtLevels[feature.properties.SNAME];
				} else {
					color =
						levelClrs[Math.floor(Math.random() * levelClrs.length)]?.color ||
						levelClrs[0].color;
					districtLevels[feature.properties.SNAME] = color;
				}
				return {
					fill: {
						color: color || 'rgba(0, 0, 0, 0.4)'
					},
					stroke: {
						color: 'rgba(125, 125, 125, 0.8)',
						width: 0.1
					},
					text: {
						color: 'white'
						// text: feature.properties.SNAME
					}
				};
			}
		},
		{
			name: 'Layer7',
			type: 'vector',
			zIndex: -98,
			url: './datas/grid.geojson',
			lyrStyle: feature => {
				// let color = districtClrs.find(n => n.name == feature.properties.name)?.color || districtClrs[0].color
				let color = 'red'; // levelClrs[0].color;
				// if (districtLevels[feature.properties.TID]) {
				// 	color = districtLevels[feature.properties.TID];
				// } else {
				color = levelClrs[Math.floor(Math.random() * levelClrs.length)]?.color;
				// districtLevels[feature.properties.TID] = color;
				// }
				return {
					fill: {
						color: color || 'rgba(0, 0, 0, 0.4)'
					},
					stroke: {
						color: 'rgba(125, 125, 125, 0.8)',
						width: 0.1
					},
					text: {
						color: 'white',
						text: ''
					}
				};
			}
		},
		{
			name: 'Layer8',
			type: 'vector',
			zIndex: -98,
			url: './datas/city.geojson',
			lyrStyle: feature => {
				// let color = districtClrs.find(n => n.name == feature.properties.name)?.color || districtClrs[0].color
				let color = 'red'; // levelClrs[0].color;
				// if (districtLevels[feature.properties.TID]) {
				// 	color = districtLevels[feature.properties.TID];
				// } else {
				color = levelClrs[Math.floor(Math.random() * levelClrs.length)]?.color;
				// districtLevels[feature.properties.TID] = color;
				// }
				return {
					fill: {
						color: color || 'rgba(0, 0, 0, 0.4)'
					},
					stroke: {
						color: 'rgba(125, 125, 125, 0.8)',
						width: 0.1
					},
					text: {
						color: 'white',
						text: ''
					}
				};
			}
		},
		// 按照业务逻辑修改
		{
			name: '三核四极',
			type: 'vector',
			zIndex: -98,
			url: './datas/三核四极.geojson'
		},
		{
			name: '全市',
			type: 'vector',
			zIndex: -98,
			url: './datas/全市.geojson'
		},
		{
			name: '创新发展轴',
			type: 'vector',
			zIndex: -98,
			url: './datas/创新发展轴.geojson'
		},
		{
			name: '区县',
			type: 'vector',
			zIndex: -98,
			url: './datas/区县.geojson'
		},
		{
			name: '中心外围',
			type: 'vector',
			zIndex: -98,
			url: './datas/中心外围.geojson'
		},
		{
			name: '街道',
			type: 'vector',
			zIndex: -98,
			url: './datas/街道.geojson'
		},
		{
			name: '高质量发展带',
			type: 'vector',
			zIndex: -98,
			url: './datas/高质量发展带.geojson'
		},
		{
			name: '工业产业区块',
			type: 'vector',
			zIndex: -98,
			url: './datas/工业产业区块.geojson'
		},
		{
			name: '工业集聚区',
			type: 'vector',
			zIndex: -98,
			url: './datas/工业集聚区.geojson'
		},
		{
			name: '工业用地',
			type: 'vector',
			zIndex: -98,
			url: './datas/工业用地.geojson'
		},
	];

	const props = defineProps({
		moduleName: {
			type: String,
			default: () => ''
		},
		mapName: {
			type: String,
			default: () => ''
		}
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

	const getMapTooltip = name => {
		// 默认值，防止返回 undefined
		const defaultTooltip = {
			bg: mapTooltips22,
			width: '232px',
			height: '87px',
			pt: '6px',
			pl: '10px'
		};

		if (['MajorProject', 'PolicyEffectLab', 'PlanningSandbox'].includes(name)) {
			return {
				bg: mapTooltips22,
				width: '262px',
				height: '104px',
				pt: '6px',
				pl: '10px'
			};
		}
		if (['DynamicMonitor', 'FeatureMirror'].includes(name)) {
			return {
				bg: mapTooltips22,
				width: '232px',
				height: '87px',
				pt: '6px',
				pl: '10px'
			};
		}
		if (['IntegratedAssessment'].includes(name)) {
			return {
				bg: mapTooltips5,
				width: '272px',
				height: '80px',
				pt: '4px',
				pl: '10px'
			};
		}
		if (['TimeSpaceRadar', 'CitySpaceRadar'].includes(name)) {
			return {
				bg: mapTooltips5,
				width: '272px',
				height: '75px',
				pt: '4px',
				pl: '10px'
			};
		}
		if (['ProjectComparison'].includes(name)) {
			return {
				bg: mapTooltips5,
				width: '272px',
				height: '149px',
				pt: '4px',
				pl: '10px'
			};
		}
	};

	const renderGridInfo = (level, datas, mapName = '') => {
		try {
			let map =
				mapStore.splitScrnList.find(n => n.name == mapName)?.map ||
				mapStore.splitScrnList[0]?.map;

			if (!map || !map.lyrManager) {
				console.error('renderGridInfo: 地图对象不存在', { mapName, map });
				return;
			}

			// 只有在图层存在时才移除，避免不必要的操作
			if (map.lyrManager?.getLayer('GUANGZHOU1')) {
				map.lyrManager.removeLayer('GUANGZHOU1');
			}

			// 数据验证
			if (!datas || !Array.isArray(datas) || datas.length === 0) {
				console.warn('renderGridInfo: 数据为空或格式不正确', datas);
				return;
			}

			let item = datas[0];
      // item.indicatorInfo.nodeName = '工业用地增长规模'
			// item.predictYear = 2024
			if (!item?.calculateResult?.module) {
				console.warn('renderGridInfo: 数据缺少模块信息', datas);
				return;
			}

			let gridInfo = gridInfos.find(n => n.moduleName == item.calculateResult.module);
			if (!gridInfo) {
				console.warn('renderGridInfo: 未找到对应的网格配置', item.calculateResult.module);
				return;
			}

			if (!gridInfo.datas || !Array.isArray(gridInfo.datas)) {
				console.warn('renderGridInfo: 网格配置数据格式不正确', gridInfo);
				return;
			}

			let dataInfos = gridInfo.datas.find(n => n.size == item.size && n.year == item.predictYear);
			if (!dataInfos) {
				console.warn('renderGridInfo: 未找到对应尺寸和年份的配置', {
					size: "50",
					year: item.predictYear
				});
				return;
			}

			if (!dataInfos.datas || !Array.isArray(dataInfos.datas)) {
				console.warn('renderGridInfo: 数据配置格式不正确', dataInfos);
				return;
			}

			let data = dataInfos.datas.find(n => n.alias == item.indicatorInfo.nodeName);
			if (!data || !data.url) {
				console.warn('renderGridInfo: 未找到对应的数据或URL', data);
				return;
			}

			// 输出图例
			legendList.value = data.legends;

			// 创建图层
			let baseLyr3 = buildLayer(LayerType.ArcGISRest, {
				name: 'GUANGZHOU1',
				url: data.url,
				layers: data.layers,
				zIndex: 99
			});

			if (!baseLyr3 || !baseLyr3.ol) {
				console.error('renderGridInfo: 创建图层失败', { url: data.url, layers: data.layers });
				return;
			}

			baseLyr3.ol.set('lyrName', 'GUANGZHOU1');
			map.lyrManager.addLayer('GUANGZHOU1', baseLyr3);
			console.log('renderGridInfo: 图层添加成功', { url: data.url, layers: data.layers });
			// 注意：网格数据加载时不显示loading，所以不需要监听加载状态
		} catch (error) {
			console.error('renderGridInfo: 执行过程中出错', error);
		}
	}

	const changeLyr = (level, mapName = '') => {
		let lyrOpt = VecLayerOption[1];
		if (level == '全市') {
			lyrOpt = VecLayerOption[4];
		}
		if (level == '区县') {
			lyrOpt = VecLayerOption[1];
		}
		if (level == '街道') {
			lyrOpt = VecLayerOption[2];
		}
		if (level == '网格') {
			lyrOpt = VecLayerOption[3];
		}
		if (["全市", "区县", "街道"].includes(level)) {
			let map =
				mapStore.splitScrnList.find(n => n.name == mapName)?.map ||
				mapStore.splitScrnList[0].map;
			map?.lyrManager?.removeLayer('GUANGZHOU1');
			let baseLyr3 = buildLayer(LayerType.Vector, lyrOpt);
			if (!baseLyr3) {
				throw new Error('initialize base layer failed');
			}
			baseLyr3.ol.set('lyrName', 'GUANGZHOU1');
			map?.lyrManager?.addLayer('GUANGZHOU1', baseLyr3);
			return baseLyr3;
		} else {
			// renderGridInfo(level, datas, mapName)
		}
	};

	const changeRadarRenderByVals = (level, datas, mapName = '') => {
		// let districtCodeFieldNameMap = {
		// 	全市: 'COID',
		// 	区县: 'COID',
		// 	街道: 'STID',
		// 	网格: 'TID'
		// };
		// let lyrOpt = VecLayerOption[1];
		// if (level == '全市') {
		// 	lyrOpt = VecLayerOption[4];
		// }
		// if (level == '区县') {
		// 	lyrOpt = VecLayerOption[1];
		// }
		// if (level == '街道') {
		// 	lyrOpt = VecLayerOption[2];
		// }
		// if (level == '网格') {
		// 	lyrOpt = VecLayerOption[3];
		// }
		// originalDatas.value = datas;
		let districtCodeFieldNameMap = {
			全市: 'CID',
			区县: 'CID',
			街道: 'CID',
			三核四极: 'CID',
			创新发展轴: 'CID',
			中心外围: 'CID',
			高质量发展带: 'CID',
			工业产业区块: 'CID',
			工业集聚区: 'CID',
			工业用地: 'CID',

		};
		originalDatas.value = datas;
		let lyrOpt  = VecLayerOption.find(n => n.name == level);
		if (lyrOpt) {
			let districtCodeFieldName = districtCodeFieldNameMap[level];
			// let groupVals = groupByThreeIntervals(datas);

			fetch(lyrOpt.url)
				.then(response => response.json())
				.then(data => {
					// let groups = groupVals.groups.map(group =>
					// 	group.map(item => item.xzqdm)
					// );

					// 对矢量数据增加 level 字段并赋值方便后面渲染
					// let res = addLevelToGeoJson(data, groups, districtCodeFieldName);

					// 输出图例
					legendList.value = dangerLevelClrs;

					// 重新绑定数据
					let cloneLyrOpt = JSON.parse(JSON.stringify(lyrOpt));
					delete cloneLyrOpt.url;
					let evaluateScore = m => {
						if (m == '0') return '1级';
						if (['1', '3'].includes(m)) return '2级';
						return '3级';
					};

					data.features.forEach(n => {
						let xzqdm = n.properties[districtCodeFieldName];
						let findData = datas.find(n => n.xzqdm == xzqdm);
						let level = findData?.calculateResult?.grade || '0';
						n.properties.level = evaluateScore(level);
						n.properties = Object.assign(n.properties, findData);
					});
					cloneLyrOpt.geojson = data;
					// 重新定义渲染方法
					cloneLyrOpt.lyrStyle = feature => {
						let color = dangerLevelClrs[0].color;
						if (districtLevels[feature.properties.level]) {
							color = districtLevels[feature.properties.level];
						} else {
							color =
								dangerLevelClrs.find(n => n.level == feature.properties.level)
									?.color || dangerLevelClrs[0].color;
							districtLevels[feature.properties.level] = color;
						}
						return {
							fill: {
								color: color || 'rgba(0, 0, 0, 0.4)'
							},
							stroke: {
								color: 'rgba(255, 255, 255, 0.8)',
								width: 0.2
							},
							text: {
								color: 'white'
								// text: feature.properties[
								// 	{
								// 		全市: 'CONAME',
								// 		区县: 'CONAME',
								// 		街道: 'SNAME',
								// 		网格: 'TID'
								// 	}[level]
								// ]
							}
						};
					};
					// 加载数据
					let map =
						mapStore.splitScrnList.find(n => n.name == mapName)?.map ||
						mapStore.splitScrnList[0].map;
					map?.lyrManager?.removeLayer('GUANGZHOU1');
					let baseLyr3 = buildLayer(LayerType.Vector, cloneLyrOpt);
					if (!baseLyr3) {
						throw new Error('initialize base layer failed');
					}
					baseLyr3.ol.set('lyrName', 'GUANGZHOU1');
					map?.lyrManager?.addLayer('GUANGZHOU1', baseLyr3);
				})
				.catch(error => console.error('Error:', error));
		} else {
			renderGridInfo(level, datas, mapName)
		}
	};

	const changeLyrRenderByVals = (level, datas, mapName = '') => {
		let districtCodeFieldNameMap = {
			全市: 'CID',
			区县: 'CID',
			街道: 'CID',
			三核四极: 'CID',
			创新发展轴: 'CID',
			中心外围: 'CID',
			高质量发展带: 'CID'
		};
		originalDatas.value = datas;
		let lyrOpt  = VecLayerOption.find(n => n.name == level);
		if (lyrOpt) {
			let districtCodeFieldName = districtCodeFieldNameMap[level];
			let groupVals = groupBySevenIntervals(datas);

			fetch(lyrOpt.url)
				.then(response => response.json())
				.then(data => {
					let groups = groupVals.groups.map(group =>
						group.map(item => item.xzqdm)
					);

					// 对矢量数据增加 level 字段并赋值方便后面渲染
					let res = addLevelToGeoJson(data, groups, districtCodeFieldName);

					// 重新绑定数据
					// delete lyrOpt.url;
					let cloneLyrOpt = JSON.parse(JSON.stringify(lyrOpt));
					delete cloneLyrOpt.url;
					cloneLyrOpt.geojson = res;
					// 重新定义渲染方法
					cloneLyrOpt.lyrStyle = feature => {
						let color = levelClrs[0].color;
						if (districtLevels[feature.properties.level]) {
							color = districtLevels[feature.properties.level];
						} else {
							color =
								levelClrs.find(n => n.level == feature.properties.level)?.color ||
								levelClrs[0].color;
							districtLevels[feature.properties.level] = color;
						}
						return {
							fill: {
								color: color || 'rgba(0, 0, 0, 0.4)'
							},
							stroke: {
								color: 'rgba(255, 255, 255, 0.8)',
								width: 0.2
							},
							text: {
								color: 'white'
								// text: feature.properties[
								// 	{
								// 		全市: 'CONAME',
								// 		区县: 'CONAME',
								// 		街道: 'SNAME',
								// 		网格: 'TID'
								// 	}[level]
								// ]
							}
						};
					};
					// 加载数据
					let map =
						mapStore.splitScrnList.find(n => n.name == mapName)?.map ||
						mapStore.splitScrnList[0].map;

					map?.lyrManager?.removeLayer('GUANGZHOU1');
					let baseLyr3 = buildLayer(LayerType.Vector, cloneLyrOpt);
					if (!baseLyr3) {
						throw new Error('initialize base layer failed');
					}
					baseLyr3.ol.set('lyrName', 'GUANGZHOU1');
					map?.lyrManager?.addLayer('GUANGZHOU1', baseLyr3);
				})
				.catch(error => console.error('Error:', error));
		} else {
			renderGridInfo(level, datas, mapName);
		}
	}

	const changeLyrRenderByVals1 = (level, datas, mapName = '') => {
		let districtCodeFieldNameMap = {
			全市: 'COID',
			区县: 'COID',
			街道: 'STID',
			网格: 'TID'
		};
		let lyrOpt = VecLayerOption[1];
		if (level == '全市') {
			lyrOpt = VecLayerOption[4];
		}
		if (level == '区县') {
			lyrOpt = VecLayerOption[1];
		}
		if (level == '街道') {
			lyrOpt = VecLayerOption[2];
		}
		if (level == '网格') {
			lyrOpt = VecLayerOption[3];
		}
		originalDatas.value = datas;
		if (["全市", "区县", "街道"].includes(level)) {
			let districtCodeFieldName = districtCodeFieldNameMap[level];
			let groupVals = groupBySevenIntervals(datas);

			fetch(lyrOpt.url)
				.then(response => response.json())
				.then(data => {
					let groups = groupVals.groups.map(group =>
						group.map(item => item.xzqdm)
					);

					// 对矢量数据增加 level 字段并赋值方便后面渲染
					let res = addLevelToGeoJson(data, groups, districtCodeFieldName);

					// 重新绑定数据
					// delete lyrOpt.url;
					let cloneLyrOpt = JSON.parse(JSON.stringify(lyrOpt));
					delete cloneLyrOpt.url;
					cloneLyrOpt.geojson = res;
					// 重新定义渲染方法
					cloneLyrOpt.lyrStyle = feature => {
						let color = levelClrs[0].color;
						if (districtLevels[feature.properties.level]) {
							color = districtLevels[feature.properties.level];
						} else {
							color =
								levelClrs.find(n => n.level == feature.properties.level)?.color ||
								levelClrs[0].color;
							districtLevels[feature.properties.level] = color;
						}
						return {
							fill: {
								color: color || 'rgba(0, 0, 0, 0.4)'
							},
							stroke: {
								color: 'rgba(125, 125, 125, 0.8)',
								width: 0.1
							},
							text: {
								color: 'white'
								// text: feature.properties[
								// 	{
								// 		全市: 'CONAME',
								// 		区县: 'CONAME',
								// 		街道: 'SNAME',
								// 		网格: 'TID'
								// 	}[level]
								// ]
							}
						};
					};
					// 加载数据
					let map =
						mapStore.splitScrnList.find(n => n.name == mapName)?.map ||
						mapStore.splitScrnList[0].map;

					map?.lyrManager?.removeLayer('GUANGZHOU1');
					let baseLyr3 = buildLayer(LayerType.Vector, cloneLyrOpt);
					if (!baseLyr3) {
						throw new Error('initialize base layer failed');
					}
					baseLyr3.ol.set('lyrName', 'GUANGZHOU1');
					map?.lyrManager?.addLayer('GUANGZHOU1', baseLyr3);
				})
				.catch(error => console.error('Error:', error));
		} else {
			renderGridInfo(level, datas, mapName)
		}
	};

	const addGeojsonToMap = (geojson = '', mapName = '') => {
		let tempLyrName = 'tempLoadLyr';
		let map =
			mapStore.splitScrnList.find(n => n.name == mapName)?.map ||
			mapStore.splitScrnList[0].map;
		if (!map.lyrManager.getLayer(tempLyrName) && geojson) {
			let lyrOpt = {
				name: tempLyrName,
				type: 'vector',
				zIndex: -96,
				geojson: geojson,
				lyrStyle: feature => {
					return {
						fill: {
							color: 'rgba(255, 0, 0, 0.001)'
						},
						stroke: {
							color: 'rgba(102,255,153, 0.8)',
							width: 2
						}
					};
				}
			};
			let baseLyr3 = buildLayer(LayerType.Vector, lyrOpt);
			baseLyr3.ol.set('lyrName', tempLyrName);
			map?.lyrManager?.addLayer(tempLyrName, baseLyr3);
		} else {
			map?.lyrManager?.removeLayer(tempLyrName);
		}
	};

	function addLevelToGeoJson(
		geoJsonData,
		groups,
		codeField = 'COID',
		levelField = 'level'
	) {
		// 创建编码到等级的映射
		const codeToLevelMap = new Map();

		groups.forEach((group, level) => {
			group.forEach(code => {
				codeToLevelMap.set(code, level + 1 + '级'); // level 从 1 开始
			});
		});

		// 处理每个 feature
		const features = geoJsonData.features.map(feature => {
			const properties = { ...feature.properties };
			const code = properties[codeField].toString();

			if (code && codeToLevelMap.has(code)) {
				properties[levelField] = codeToLevelMap.get(code);
				// 存储导入的数据，弹窗使用
				properties.calculateResult =
					originalDatas.value.find(n => n.xzqdm == code)?.calculateResult ||
					null;
			} else {
				// 如果没有找到对应的等级，可以设置默认值或保持原样
				properties[levelField] = '0级';
				console.log(`未找到编码 ${code} 对应的等级`);
			}

			return {
				...feature,
				properties
			};
		});

		return {
			...geoJsonData,
			features
		};
	}

	/**
	 * 将对象数组按照 predictValue 等分为7组
	 * @param {Array} data 对象数组
	 * @returns {Object} 包含分组结果和区间信息
	 */
	function groupBySevenIntervals(data) {
		if (!data || data.length === 0) {
			return { groups: [], intervals: [] };
		}

		// 提取 predictValue 值
		const values = data
			.map(item => item.predictValue)
			.filter(val => val != null);

		if (values.length === 0) {
			return { groups: [], intervals: [] };
		}

		// 计算最小最大值
		const min = Math.min(...values);
		const max = Math.max(...values);
		const range = max - min;
		const step = range / 7;

		// 生成区间边界
		const intervals = [];
		for (let i = 0; i <= 7; i++) {
			intervals.push(min + step * i);
		}

		// 不再需要乘以 100
		let multipleVal = 1; // data[0]?.calculateResult?.unit == '%' ? 100 : 1;
		// 输出图例
		legendList.value = [Object.assign(levelClrs[0], { name: '无' })];
		for (let i = 1, len = intervals.length; i < len; i++) {
			let item = levelClrs[i];
			legendList.value.push(
				Object.assign(item, {
					name: (intervals[i - 1] * multipleVal).toFixed(2) + '-' + (intervals[i] * multipleVal).toFixed(2)
				})
			);
		}

		// 初始化7个空分组
		const groups = Array(7)
			.fill()
			.map(() => []);

		// 将数据分配到对应分组
		data.forEach(item => {
			const value = item.predictValue;

			if (value == null) return; // 跳过没有 predictValue 的项

			for (let i = 0; i < 7; i++) {
				const start = intervals[i];
				const end = intervals[i + 1];

				// 前6个区间 [start, end)，最后一个区间 [start, end]
				if (i < 6) {
					if (value >= start && value < end) {
						groups[i].push(item);
						break;
					}
				} else {
					if (value >= start && value <= end) {
						groups[i].push(item);
						break;
					}
				}
			}
		});

		// 生成区间信息
		const intervalInfo = intervals.slice(0, 7).map((start, i) => {
			const end = intervals[i + 1];
			return {
				index: i,
				label: `区间${i + 1}`,
				start: parseFloat(start.toFixed(4)),
				end: parseFloat(end.toFixed(4)),
				range:
					i === 6
						? `[${start.toFixed(4)}, ${end.toFixed(4)}]`
						: `[${start.toFixed(4)}, ${end.toFixed(4)})`,
				count: groups[i].length
			};
		});

		return {
			groups,
			intervals: intervalInfo,
			stats: {
				min,
				max,
				total: data.length,
				grouped: groups.reduce((sum, group) => sum + group.length, 0)
			}
		};
	}

	function groupByThreeIntervals(data) {
		if (!data || data.length === 0) {
			return { groups: [], intervals: [] };
		}

		// 提取 predictValue 值
		const values = data
			.map(item => item.predictValue)
			.filter(val => val != null);

		if (values.length === 0) {
			return { groups: [], intervals: [] };
		}

		// 计算最小最大值
		const min = Math.min(...values);
		const max = Math.max(...values);
		const range = max - min;
		const step = range / 3;

		// 生成区间边界
		const intervals = [];
		for (let i = 0; i <= 3; i++) {
			intervals.push(min + step * i);
		}

		let multipleVal = data[0]?.calculateResult?.unit == '%' ? 100 : 1;
		// 输出图例
		legendList.value = [Object.assign(dangerLevelClrs[0], { name: '无' })];
		for (let i = 1, len = intervals.length; i < len; i++) {
			let item = dangerLevelClrs[i];
			legendList.value.push(
				Object.assign(item, {
					name: (intervals[i - 1] * multipleVal).toFixed(2) + '-' + (intervals[i] * multipleVal).toFixed(2)
				})
			);
		}

		// 初始化3个空分组
		const groups = Array(3)
			.fill()
			.map(() => []);

		// 将数据分配到对应分组
		data.forEach(item => {
			const value = item.predictValue;

			if (value == null) return; // 跳过没有 predictValue 的项

			for (let i = 0; i < 3; i++) {
				const start = intervals[i];
				const end = intervals[i + 1];

				// 前6个区间 [start, end)，最后一个区间 [start, end]
				if (i < 2) {
					if (value >= start && value < end) {
						groups[i].push(item);
						break;
					}
				} else {
					if (value >= start && value <= end) {
						groups[i].push(item);
						break;
					}
				}
			}
		});

		// 生成区间信息
		const intervalInfo = intervals.slice(0, 3).map((start, i) => {
			const end = intervals[i + 1];
			return {
				index: i,
				label: `区间${i + 1}`,
				start: parseFloat(start.toFixed(4)),
				end: parseFloat(end.toFixed(4)),
				range:
					i === 2
						? `[${start.toFixed(4)}, ${end.toFixed(4)}]`
						: `[${start.toFixed(4)}, ${end.toFixed(4)})`,
				count: groups[i].length
			};
		});

		return {
			groups,
			intervals: intervalInfo,
			stats: {
				min,
				max,
				total: data.length,
				grouped: groups.reduce((sum, group) => sum + group.length, 0)
			}
		};
	}

	const getMapHandle = map => {
		if (map) {
			// 加载底图
			let baseLyr = buildLayer(LayerType.XYZ, BaseLayerOption[1]);
			if (!baseLyr) {
				throw new Error('initialize base layer failed');
			}
			map.lyrManager.addLayer(BASE_LAYER_NAME, baseLyr);

			let baseLyr2 = buildLayer(LayerType.Vector, VecLayerOption[0]);
			if (!baseLyr2) {
				throw new Error('initialize base layer failed');
			}
			map.lyrManager.addLayer('COVER', baseLyr2);

			const overlay = new Overlay({
				element: popupInfoRef.value,
				autoPan: {
					animation: {
						duration: 250
					}
				}
			});
			map.overlayManager.removeOverlay('infoPopup');
			map.overlayManager.addOverlay('infoPopup', { ol: overlay });

			// 注册直角坐标系
			let proj = buildProjection({
				code: 'EPSG:4547',
				projection:
					'+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs'
			});

			mapStore.setActiveMap(map);
			map.olMap.set('mapName', props.mapName);
			mapStore.setSplitScrn(props.mapName, map);

			// 节流函数优化性能
			let pointerMoveTimer = null;
			let lastPixel = null;
			let lastFeature = null;
			const THROTTLE_DELAY = 16; // 约60fps
			const PIXEL_THRESHOLD = 3; // 像素移动阈值，减少不必要的计算

			map.olMap.on('pointermove', evt => {
				// 如果正在拖拽，跳过处理
				if (evt.dragging) {
					return;
				}

				// 节流处理
				if (pointerMoveTimer) {
					return;
				}

				pointerMoveTimer = requestAnimationFrame(() => {
					pointerMoveTimer = null;

					// 检查像素移动距离，减少不必要的计算
					if (lastPixel) {
						const dx = Math.abs(evt.pixel[0] - lastPixel[0]);
						const dy = Math.abs(evt.pixel[1] - lastPixel[1]);
						if (dx < PIXEL_THRESHOLD && dy < PIXEL_THRESHOLD) {
							return;
						}
					}
					lastPixel = evt.pixel;

					let mapName = evt.target.get('mapName');
					let map =
						mapStore.splitScrnList.find(n => n.name == mapName)?.map ||
						mapStore.splitScrnList[0].map;

					// 缓存当前特征，避免重复处理
					let foundFeature = null;
					let foundLayer = null;
					map.olMap.forEachFeatureAtPixel(
						evt.pixel,
						(feature, olLayer) => {
							if (olLayer.get('lyrName') == 'GUANGZHOU1') {
								foundFeature = feature;
								foundLayer = olLayer;
								return true; // 找到特征后立即返回
							}
						},
						{
							hitTolerance: 10
						}
					);

					// 如果没有找到特征，清除显示
					if (!foundFeature) {
						if (lastFeature !== null) {
							overlay.setPosition(null);
							map.featureManager.removeFeatures();
							lastFeature = null;
						}
						return;
					}

					// 如果特征没有变化，跳过处理
					if (lastFeature === foundFeature) {
						return;
					}
					lastFeature = foundFeature;

					// 处理找到的特征
					map.featureManager.removeFeatures();
					let featureqwe = GeoJSONUtil.writeFeatureObject(foundFeature);

					if (featureqwe?.properties?.calculateResult) {
						let obj = featureqwe?.properties?.calculateResult;
						moduleName.value = obj?.module || '';
						// 未来魔镜
						if (obj.module == 'FeatureMirror') {
							displayFeatureMirrorInfo(obj);
						}
						// 规划预警雷达
						else if (obj.module == 'TimeSpaceRadar') {
							displayTimeSpaceRadarInfo(obj);
						}
						// 动态监测
						else if (obj.module == 'DynamicMonitor') {
							displayFeatureMirrorInfo(obj);
						}
						// 综合评估
						else if (obj.module == 'IntegratedAssessment') {
							displayIntegratedAssessmentInfo(obj);
						}
						// 城市预警雷达
						else if (obj.module == 'CitySpaceRadar') {
							displayCitySpaceRadarInfo(obj);
						}
						// 重大项目剧场
						else if (obj.module == 'MajorProject') {
							displayMajorProjectInfo(obj);
						}
						// 项目对比剧场
						else if (obj.module == 'ProjectComparison') {
							displayProjectComparisonInfo(obj);
						}
						// 政策效果实验室
						else if (obj.module == 'PolicyEffectLab') {
							displayPolicyEffectLabInfo(obj);
						}
						// 规划方案大沙盘
						else if (obj.module == 'PlanningSandbox') {
							displayPlanningSandboxInfo(obj);
						}
					} else {
						// 使用 Object.assign 减少响应式更新
						const resetKeys = ['prePlanVal', 'afterPlanVal', 'changeRate', 'changeVal'];
						resetKeys.forEach(key => {
							if (popupInfoObj.value.hasOwnProperty(key)) {
								popupInfoObj.value[key] = 'ㅡㅡ';
							}
						});
						if (popupInfoObj.value.hasOwnProperty('title')) {
							popupInfoObj.value.title = '数据推演信息';
						}
					}

					overlay.setPosition(evt.coordinate);
					map.featureManager.addFeature(
						'Temp_' + Date.now(), // 使用时间戳代替随机数，性能更好
						featureqwe,
						false
					);
				});
			});
		}
	};

	// 规划方案大沙盘
	const displayPlanningSandboxInfo = val => {
		popupInfoObj.value = {
			title: val?.xzqmc + '-' + val?.indicatorName,
			prePlanVal: val?.monitorValue + val?.unit, // 规划调整前
			afterPlanVal: val?.predictValue + val?.unit, // 规划调整后
			changeRate: (val?.changeRate * 100).toFixed(2) + '%' // 变化率
		};
	};

	// 政策效果实验室
	const displayPolicyEffectLabInfo = val => {
		popupInfoObj.value = {
			title: val?.xzqmc + '-' + val?.indicatorName,
			prePlanVal: val?.monitorValue + val?.unit, // 政策调控前
			afterPlanVal: val?.predictValue + val?.unit, // 政策调控后
			changeRate: (val?.changeRate * 100).toFixed(2) + '%' // 变化率
		};
	};

	// 项目对比剧场
	const displayProjectComparisonInfo = val => {
		popupInfoObj.value = {
			title: val?.xzqmc + '-' + val?.predictYear + '年',
			indicatorName: val?.indicatorName,
			changeRate: val?.predictValue + val?.unit
		};
	};

	// 重大项目剧场
	const displayMajorProjectInfo = val => {
		popupInfoObj.value = {
			title: val?.xzqmc + '-' + val?.indicatorName,
			prePlanVal: val?.monitorValue + val?.unit, // 项目实施前
			afterPlanVal: val?.predictValue + val?.unit, // 项目实施后
			changeRate: (val?.changeRate * 100).toFixed(2) + '%' // 变化率
		};
	};

	// 综合评估
	const displayIntegratedAssessmentInfo = val => {
		popupInfoObj.value = {
			title: val?.xzqmc + '-' + val?.indicatorName,
			state: {
				0: '安全',
				1: '警告',
				2: '危险',
				3: '警告',
				4: '危险'
			}[val?.grade], // 指标状态
			planVal: (val?.monitorValue || 0) + val?.unit, // 规划值
		};
	}

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
			}[val?.grade], // 指标状态
			planVal: (val?.planValue || 0) + val?.unit, // 规划值
			predictVal: (val?.predictValue || 0) + val?.unit, // 推演值
			changeRate:
				'较规划值' +
				`${val.predictValue - (val.planValue || 0) >= 0 ? '多' : '少'}` +
				(
					((val.predictValue - (val.planValue || 0)) / val.planValue || 0) * 100
				).toFixed(2) +
				'%', // 偏差率
			changeVal:
				'较规划值' +
				`${val.predictValue - (val.planValue || 0) >= 0 ? '多' : '少'}` +
				`${Math.abs(val.predictValue - (val.planValue || 0)).toFixed(2)}` +
				val?.unit // 偏差值
		};
	};

	// 规划预警雷达
	const displayTimeSpaceRadarInfo = val => {
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

	// 未来魔镜
	const displayFeatureMirrorInfo = val => {
		popupInfoObj.value = {
			title: val?.xzqmc + '-' + val?.indicatorName,
			baseYear: val?.baseYear + '年', // 基准年
			monitorVal: val?.monitorValue + val?.unit, // 基准值
			predictYear: val?.predictYear + '年', // 预测年
			predictVal: val?.predictValue + val?.unit // 预测值
		};
	};

	// 控制 loading 状态的方法
	const setMapLoading = (loading) => {
		isMapLoading.value = loading;
	};


	// 暴露方法给父组件
	defineExpose({
		legendList,
		changeLyr,
		changeLyrRenderByVals,
		changeRadarRenderByVals,
		addGeojsonToMap,
		setMapLoading
	});

	onMounted(() => {
		proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs");
		register(proj4);
	});
</script>

<style lang="scss">
.map-container {
	position: relative;
	width: 100%;
	height: 100%;
}

.map-container {
	/* 确保地图容器有独立的层叠上下文 */
	isolation: isolate;
	position: relative;
}

.map-container.map-loading> :first-child {
	/* 只对地图本身应用模糊，不影响 loading 遮罩层 */
	filter: blur(4px);
	transition: filter 0.3s ease;
}

.map-loading-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
	/* loading 遮罩层不模糊 */
	filter: none;
	pointer-events: none;
}

.map-loading-content {
	pointer-events: auto;
	/* 确保 loading 内容清晰 */
	filter: none;
}

.map-loading-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 16px;
}

.map-loading-spinner {
	width: 48px;
	height: 48px;
	border: 4px solid rgba(255, 255, 255, 0.3);
	border-top-color: #00f6ff;
	border-radius: 50%;
	animation: map-loading-spin 1s linear infinite;
}

.map-loading-text {
	color: #fff;
	font-size: 14px;
	font-weight: 500;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

@keyframes map-loading-spin {
	to {
		transform: rotate(360deg);
	}
}


	.mapTooltips {
		& .title {
			font-family: 'AlibabaPuHuiTi-85';
			font-weight: 700;
			font-size: 14px;
			line-height: 15px;
			color: #e7efff;
		}
		& .content {
			padding-top: 13px;
		}
		& .dic {
			display: inline-block;
			width: 5px;
			height: 5px;
			border-radius: 50%;
			background-color: #1563eb;
		}
		& .key {
			font-family: 'AlibabaPuHuiTi-65';
			font-weight: 500;
			font-size: 14px;
			line-height: 15px;
			color: #e7efff;
			padding-left: 12px;
			white-space: nowrap;
		}
		& .value {
			font-family: 'AlibabaPuHuiTi-85';
			font-weight: 700;
			font-size: 16px;
			line-height: 15px;
			color: #2cccff;
			white-space: nowrap;
		}
	}
</style>
