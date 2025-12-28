<template>
	<div ref="mapDiv" class="olmap max-wh" style="width: 100%; height: 100%">
		<slot />
	</div>
</template>

<script setup>
	import OLProtoMap from '../primitive/map/OLProtoMap.js'
	import emitter from '../utils/eventbus.js'

	// 定义变量
	let map = ref(null)
	const mapDiv = ref(null)
	let isMapInitialized = false // 标记地图是否已初始化

	// 自定义属性
	const props = defineProps({
		mapOptions: {
			type: Object,
			default: () => {
				return null
			}
		},
		getMap: {
			type: Function,
			// default: () => {
			// 	return (map) => {

			// 	};
			// },
			default: null
		}
	})

	// 初始化地图的函数
	const initMap = () => {
		// 如果地图已初始化，直接返回
		if (isMapInitialized || map.value) {
			return
		}

		// 检查必要的条件
		if (!props.mapOptions || !mapDiv.value) {
			return
		}

		try {
			const mapOptions = unref(props.mapOptions)
			if (mapOptions && mapDiv.value) {
				map.value = new OLProtoMap(mapOptions, mapDiv.value)
				isMapInitialized = true

				if (props.getMap && props.getMap instanceof Function) {
					props.getMap(map.value)
				} else {
					emitter.emit('mapMounted', map.value)
				}
			}
		} catch (error) {
			console.error('地图初始化失败:', error)
			isMapInitialized = false
		}
	}

	// 监听 mapOptions 变化（但不立即执行，等待 onMounted）
	watch(
		() => props.mapOptions,
		(newVal, oldVal) => {
			// 如果地图已初始化，不再响应变化
			if (isMapInitialized || map.value) {
				return
			}
			// 只在 mapOptions 从 null/undefined 变为有效值时才初始化
			if (newVal && !oldVal) {
				nextTick(() => {
					initMap()
				})
			}
		},
		{
			deep: false // 不深度监听，避免对象内部属性变化触发
		}
	)

	// 生命钩子函数
	onMounted(() => {
		// 确保在组件挂载后再初始化地图
		nextTick(() => {
			initMap()
		})
	})

	onBeforeUnmount(() => {
		// 清理地图实例
		if (map.value && map.value.olMap) {
			try {
				map.value.olMap.setTarget(null)
				map.value = null
				isMapInitialized = false
			} catch (error) {
				console.error('清理地图实例时出错:', error)
			}
		}
	})

	const setMapRange = range => {
		map.value.rangePostrender(toRaw(range))
	}

	// val in (0 - 30)
	const setPerspective = val => {
		map.value.setPerspective(val)
	}

	// 向外提供地图对象
	provide('map', map)

	// 向外提供地图方法
	defineExpose({
		setMapRange,
		setPerspective
	})
</script>

<style></style>
