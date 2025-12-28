<template>
	<div class="w-full h-full mapMax relative">
		<!-- <div ref="firstDiv" class="mapBox outer-octagon w-full h-full">
			<div ref="secondDiv" class="mapBoxDiv">
				<div ref="thirdDiv" class="mapBoxInner">
				</div>
			</div>
		</div> -->
		<div
			class="relative"
			style="width: calc(100% - 1px); height: calc(100% - 1px)">
			<slot name="mapCon"></slot>
			<MapViewer v-if="props.showMap" ref="mapViewerRef" />
			<ul class="mapTools absolute" v-if="mapTools">
				<li
					class="mapToolItem relative w-[2rem] h-[2rem] cursor-pointer"
					:class="{ 'mb-[1rem]': index !== 4 }"
					v-for="(item, index) in 5"
					:key="'mapToolItem_' + index"
					:id="'mapToolItem_' + index"
					@click="mapToolClick(index)">
					<img
						class="w-full h-full"
						:src="
							getAssetsFile(
								mapToolItemIdx === index
									? `mapTool${index + 1}-active`
									: `mapTool${index + 1}`
							)
						"
						alt="" />

					<div
						v-if="openLegend && mapToolItemIdx === index"
						class="legendWrapper absolute bottom-0 left-[-175px] w-[170px] overflow-hidden overflow-y-auto bg-[rgba(4,110,163,0.8)] select-none"
						@click.stop>
						<p class="legendTitle">图例</p>
						<p class="legendTitle">{{ indicatorInfo }}</p>
						<ul>
							<li
								class="mb-[6px] h-[13px] flex items-center"
								v-for="item in legendList"
								:key="item.name">
								<span
									class="flex w-[23px] h-[12px] mr-[5px]"
									:style="{ backgroundColor: item.color }"></span>
								<span class="text-[#fff] font-size-[12px]">{{
									item.name
								}}</span>
							</li>
						</ul>
					</div>
				</li>
			</ul>
			<slot name="list"></slot>
		</div>
		<img
			v-if="props.showVector"
			class="mapVectorLeft"
			src="@/assets/img/mapVectorLeft.png"
			alt="" />
		<img
			v-if="props.showVector"
			class="mapVectorRight"
			src="@/assets/img/mapVectorRight.png"
			alt="" />
	</div>
</template>

<script setup>
	import MapViewer from '@/views/MapViewer/Index.vue';
	import { getAssetsFile } from '@/utils/index.js';
	import { zoomIn, zoomOut, fullMap, resetMap } from './mapInteraction.js';

	import { useMapStore } from '@/stores/modules/map.js';
	const mapStore = useMapStore();
	import FullScreen from 'ol/control/FullScreen.js';

	const mapViewerRef = ref(null);
	const firstDiv = ref(null);
	const secondDiv = ref(null);
	const thirdDiv = ref(null);
	const openLegend = ref(false);
	const indicatorInfo = ref('');
	const mapToolItemIdx = ref(-1);
	const legendList = ref([]);
	// 同步宽度的函数
	const syncWidth = () => {
		const screenWidth =
			window.innerWidth || document.documentElement.clientWidth;
		if (firstDiv.value && thirdDiv.value) {
			const firstWidth = firstDiv.value.offsetWidth;
			const a = 1220 * (screenWidth / 1920);
			secondDiv.value.style.width = `${a}px`;
			secondDiv.value.style.height = `${a}px`;
			thirdDiv.value.style.width = `${firstWidth}px`;
		}
	};

	const props = defineProps({
		showMap: {
			type: Boolean,
			default: true
		},
		mapTools: {
			type: Boolean,
			default: true
		},
		showVector: {
			type: Boolean,
			default: true
		}
	});

	onMounted(() => {
		syncWidth();
		window.addEventListener('resize', syncWidth);

		setTimeout(() => {
			mapStore?.activeMap?.ctrlManager.addControl('fullScreen', {
				ol: new FullScreen({
					className: 'ol-full-screen',
					target: 'mapToolItem_1'
				})
			});
		}, 2 * 1000);
	});

	onBeforeUnmount(() => {
		window.removeEventListener('resize', syncWidth);
	});
	// 地图工具点击
	const mapToolClick = index => {
		mapToolItemIdx.value = index;
		switch (index) {
			case 0:
				openLegend.value = false;
				return resetMap();
			case 1:
				openLegend.value = false;
				return fullMap();
			case 2:
				openLegend.value = false;
				return zoomIn();
			case 3:
				openLegend.value = false;
				return zoomOut();
			case 4:
				openLegend.value = !openLegend.value;
				if (!openLegend.value) {
					mapToolItemIdx.value = -1
				}
				return;
		}
	};

	const addGeojsonToMap = (geojson = '') => {
		if (mapViewerRef.value) {
			mapViewerRef.value.addGeojsonToMap(geojson);
		}
	};

	const addLyrToMap = level => {
		if (mapViewerRef.value) {
			mapViewerRef.value.changeLyr(level);
		}
	};

	const renderDatasToMap = (level, datas, module = '') => {
		if (mapViewerRef.value) {
			if (module != 'radar') {
				mapViewerRef.value.changeLyrRenderByVals(level, datas);
			} else {
				mapViewerRef.value.changeRadarRenderByVals(level, datas);
			}
			// 显示图例信息
			if (datas?.length && datas[0].calculateResult) {
				indicatorInfo.value = `${datas[0].calculateResult?.indicatorName}(${datas[0].calculateResult?.unit})`;
			}
			let t = setTimeout(() => {
				legendList.value = mapViewerRef.value?.legendList.map(item => ({
					name: item.name,
					color: item.color.replace('0.2', '0.5'),
					level: item.level
				}));
				openLegend.value = true;
				mapToolItemIdx.value = 4;
			}, 0.5 * 1000);
		}
	};

	// 控制地图 loading 状态
	const setMapLoading = (loading) => {
		if (mapViewerRef.value) {
			mapViewerRef.value.setMapLoading(loading);
		}
	};

	// 暴露方法给父组件
	defineExpose({
		addLyrToMap,
		renderDatasToMap,
		addGeojsonToMap,
		setMapLoading
	});
</script>

<style lang="scss" scoped>
	.mapMax {
		box-sizing: border-box;
	}
	.mapTools {
		bottom: 7.5rem;
		right: 30.3125rem;
		z-index: 2;
	}
	.mapVectorLeft {
		position: absolute;
		top: calc(50% - 3.2rem);
		left: 26.375rem;
		transform: translateY(-50%);
		width: 2.5rem;
	}
	.mapVectorRight {
		position: absolute;
		top: calc(50% - 3.2rem);
		right: 26.375rem;
		transform: translateY(-50%);
		width: 2.5rem;
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
</style>
