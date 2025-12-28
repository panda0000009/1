<template>
	<projectModule
		v-if="props.type === 'F'"
		:show="props.show"
		@close="close"></projectModule>
	<projectChildModule
		v-if="props.type === 'C'"
		:type="props.type"
		:projectId="props.projectId"
		:bizType="props.bizType"
		:projectList="props.projectList"
		@close="close"></projectChildModule>
</template>

<script setup>
	import projectModule from '@/components/addProject/projectModuleNew.vue';
	// import projectModule from '@/components/addProject/projectModule.vue';
	import projectChildModule from '@/components/addProject/projectChildModule.vue';
	const props = defineProps({
		show: {
			type: Boolean,
			default: false
		},
		type: {
			type: String,
			default: 'F'
		},
		projectId: {
			type: String,
			default: ''
		},
		bizType: {
			type: String,
			default: ''
		},
		projectList: {
			type: Array,
			default: () => []
		}
	});
	const emit = defineEmits(['close']);
	const close = () => {
		emit('close');
	};
</script>
