<template>
	<div id="echarts" ref="chartRef" style="width: 100%; height: 100%"></div>
</template>

<script setup>
	import echarts from './index.js';
	import { _debounce } from '@/utils/index.js';

	const props = defineProps({
		renderer: { type: String, default: 'canvas' },
		resize: { type: Boolean, default: true },
		option: { type: Object, default: () => ({}), required: true },
		onClick: { type: Function, default: null }
	});

	const chartRef = ref(null);
	const chartInstance = ref();

	const draw = () => {
		if (chartInstance.value) {
			chartInstance.value.setOption(props.option, { notMerge: true });
		}
	};

	watch(props, () => {
		draw();
	});

	const handleClick = event => props.onClick && props.onClick(event);

	const init = () => {
		if (!chartRef.value) return;
		chartInstance.value = echarts.getInstanceByDom(chartRef.value);

		if (!chartInstance.value) {
			chartInstance.value = markRaw(
				echarts.init(chartRef.value, props.theme, {
					renderer: props.renderer
				})
			);
			chartInstance.value.on('click', handleClick);
			draw();
		}
	};

	const resize = () => {
		if (chartInstance.value && props.resize) {
			chartInstance.value.resize({ animation: { duration: 300 } });
		}
	};

	const debouncedResize = _debounce(resize, 300);

	onMounted(() => {
		nextTick(() => init());
		window.addEventListener('resize', debouncedResize);
	});

	onBeforeUnmount(() => {
		chartInstance.value?.dispose();
		window.removeEventListener('resize', debouncedResize);
	});

	defineExpose({
		getInstance: () => chartInstance.value,
		resize,
		draw
	});
</script>
