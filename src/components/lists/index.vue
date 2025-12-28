<template>
	<div class="flex flex-wrap">
		<div
			class="cursor-pointer"
			v-for="(item, index) in list"
			:key="'unitList_' + index"
			:style="{
				backgroundImage: `url(${
					dyCurrent.includes(item.value) ? dyActive : dy
				})`
			}"
			@click="dyHandleChange(item.value)">
			{{ item.label }}
		</div>
	</div>
</template>

<script setup>
	import dy from '@/assets/img/futureMirror/bg.png';
	import dyActive from '@/assets/img/futureMirror/bgActive.png';
	const dyCurrent = ref([]);
	const props = defineProps({
		list: {
			type: Array,
			default: () => []
		},
		single: {
			type: Boolean,
			default: true
		},
		currentId: {
			type: String,
			default: () => ''
		}
	});
	watch(
		() => props.currentId,
		val => {
			if (val !== '') dyCurrent.value = val.split(',');
		},
		{ immediate: true }
	);
	const emit = defineEmits(['change']);
	const dyHandleChange = value => {
		if (props.single) {
			dyCurrent.value = [value];
		} else {
			dyCurrent.value = [...new Set(dyCurrent.value.push(value))];
		}
		emit('change', { id: dyCurrent.value.join(',') });
	};
</script>
<style lang="scss" scoped></style>
