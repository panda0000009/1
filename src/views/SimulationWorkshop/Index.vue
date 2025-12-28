<!-- 模拟工坊 -->
<template>
	<div class="pages">
		<Layout>
			<template #left>
				<div class="w-full h-full bg-yellow-500"></div>
			</template>
			<template #map>
				<div class="w-full h-full bg-green-500"><MapViewer /></div>
			</template>
			<template #right>
				<div class="w-full h-full bg-blue-500"></div>
			</template>
		</Layout>
	</div>
</template>
<script setup>
	import MapViewer from '../MapViewer/Index.vue';
</script>

<style lang="scss" scoped></style>
