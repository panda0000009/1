<template>
	<div class="w-full h-full mapMin relative">
		<div ref="firstDiv" class="mapBox outer-octagon mb-[1.125rem]">
			<div ref="secondDiv" class="mapBoxDiv">
				<div ref="thirdDiv" class="mapBoxInner">
					<div
						class="relative"
						style="width: calc(100% - 1px); height: calc(100% - 1px)">
						<MapViewer ref="mapViewerRef" />
						<ul class="mapTools">
							<li
								class="mapToolItem w-[2rem] h-[2rem] cursor-pointer"
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
									class="legendWrapper absolute bottom-0 left-[-142px] w-[136px] overflow-hidden overflow-y-auto bg-[rgba(4,110,163,0.8)] select-none"
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
						<slot></slot>
					</div>
				</div>
			</div>
			<img class="mapVectorTop2" src="@/assets/img/mapVectorTop2.png" alt="" />
			<img
				class="mapVectorLeft2"
				src="@/assets/img/mapVectorLeft2.png"
				alt="" />
			<img
				class="mapVectorRight2"
				src="@/assets/img/mapVectorRight2.png"
				alt="" />
		</div>
		<img class="mapVectorLeft" src="@/assets/img/mapVectorLeft.png" alt="" />
		<img class="mapVectorRight" src="@/assets/img/mapVectorRight.png" alt="" />
		<el-carousel class="h-40" indicator-position="none" :interval="2000">
			<el-carousel-item v-for="item in 10" :key="item">
				<div class="chartsBo flex flex-wrap justify-between">
					<div class="chartBoList" v-for="value in 6" :key="value">
						<div class="chartBoListTitle">
							<div class="chartBoListTitleName">指标名称</div>
							<div class="chartBoListTitleValue">指标值</div>
						</div>
					</div>
				</div>
			</el-carousel-item>
		</el-carousel>
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
			const a = 1070 * (screenWidth / 1920);
			secondDiv.value.style.width = `${a}px`;
			secondDiv.value.style.height = `${a}px`;
			thirdDiv.value.style.width = `${firstWidth}px`;
		}
	};

	onMounted(() => {
		syncWidth();
		window.addEventListener('resize', syncWidth);

		setTimeout(() => {
			mapStore.activeMap.ctrlManager.addControl('fullScreen', {
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
		switch (index) {
			case 0:
				mapToolItemIdx.value = mapToolItemIdx.value === 0 ? -1 : 0;
				return resetMap();
			case 1:
				// 全屏按钮仅控制全屏，不改变图例状态和选中高亮
				return fullMap();
			case 2:
				mapToolItemIdx.value = mapToolItemIdx.value === 2 ? -1 : 2;
				return zoomIn();
			case 3:
				mapToolItemIdx.value = mapToolItemIdx.value === 3 ? -1 : 3;
				return zoomOut();
			case 4:
				mapToolItemIdx.value = mapToolItemIdx.value === 4 ? -1 : 4;
				openLegend.value = !openLegend.value;
				return;
		}

		console.log('地图工具点击:', index);
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

	// 暴露方法给父组件
	defineExpose({
		addLyrToMap,
		renderDatasToMap
	});
</script>

<style lang="scss" scoped>
	.mapMin {
		padding: 0 8%;
		box-sizing: border-box;

		.chartBoList {
			display: flex;
			align-items: center;
			background-image: url('@/assets/img/zbBg0.png');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-position: center center;
			box-sizing: border-box;
			width: 30%;
			height: 4.375rem;
			padding: 0 1.875rem 0 3.75rem;
			box-sizing: border-box;
			margin-bottom: 0.625rem;
			&.yellow {
				background-image: url('@/assets/img/zbBg1.png');
			}
			&.green {
				background-image: url('@/assets/img/zbBg2.png');
			}
			&.red {
				background-image: url('@/assets/img/zbBg3.png');
			}
			.chartBoListTitle {
				padding-left: 1.125rem;
				width: 12.375rem;
				.chartBoListTitleName {
					font-family: 'YouSheBiaoTiHei';
					font-size: 1rem;
					font-weight: 400;
					color: #fff;
					padding-top: 0.125rem;
					width: 11.125rem;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.chartBoListTitleValue {
					font-family: 'SourceHanSansCN-Regular';
					font-size: 1rem;
					font-weight: 400;
					font-size: 0.75rem;
					line-height: 1.25rem;
					vertical-align: middle;
					color: #c4c4c4;
				}
			}
		}
		.mapVectorLeft {
			position: absolute;
			top: 25.6556%;
			left: 1.3rem;
			transform: translateY(-25.6556%);
			width: 2.5rem;
		}
		.mapVectorRight {
			position: absolute;
			top: 25.6556%;
			right: 1.3rem;
			transform: translateY(-25.6556%);
			width: 2.5rem;
		}
	}
	.mapBox {
		position: relative;
		width: 100%;
		height: 43.25rem;
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
			height: 43.25rem;
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
		position: absolute;
		bottom: 3rem;
		right: 1rem;
		z-index: 2;
	}
</style>
