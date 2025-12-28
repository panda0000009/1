<template>
	<div class="dbTableHeader flex items-center">
		<div
			:class="['headerItem h-9 leading-9 select-none', item.class]"
			v-for="item in list"
			:key="item.name">
			{{ item.name }}
		</div>
	</div>
</template>
<script setup>
	const props = defineProps({
		list: {
			type: Array,
			default: () => [
				{ name: '标题', class: 'flex-1' },
				{ name: '标题2', class: 'flex-1' }
			]
		}
	});
</script>

<style lang="scss" scoped>
	.dbTableHeader {
		font-size: 14px;
		font-weight: 400;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.headerItem {
			text-align: center;
			background-image: url('@/assets/img/tableHeader.png');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-position: center center;
		}
	}
</style>
