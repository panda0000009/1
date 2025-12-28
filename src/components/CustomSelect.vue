<template>
	<div
		:class="[
			'customSelect w-full',
			{ 'bg-[#16415C] mb-5 px-5 py-[0.875rem] h-[3.8125rem]': props.isBg }
		]">
		<el-select
			v-model="internalValue"
			placeholder="请选择"
			popper-class="my-popper"
			@keydown.enter.native="handleKeyEnter">
			<el-option
				v-for="item in options"
				:key="item.value"
				:label="item.label"
				:value="item.value"
				@click="handleOptionClick(item)" />
			<template #footer v-if="footer">
				<slot name="footer"></slot>
			</template>
		</el-select>
	</div>
</template>

<script setup>
	const props = defineProps({
		// 选项列表（格式：[{ label, value }]）
		options: {
			type: Array,
			required: true
		},
		modelValue: {
			type: [String, Number],
			default: ''
		},
		// 禁止变更的特定值（如项目选择中的 '0'）
		forbiddenValue: {
			type: [String, Number],
			default: '0'
		},
		// 是否显示底部插槽
		footer: {
			type: Boolean,
			default: false
		},
		// 是否返回item
		returnItem: {
			type: Boolean,
			default: false
		},
		isBg: {
			type: Boolean,
			default: true
		}
	});
	// 触发事件
	const emit = defineEmits(['update:modelValue', 'select']);
	// 内部维护的选中值
	const internalValue = ref(props.modelValue);
	// 同步父组件传入的 modelValue
	watch(
		() => props.modelValue,
		newVal => {
			internalValue.value = newVal;
		},
		{ immediate: true }
	);
	// 处理选项点击（鼠标操作）
	const handleOptionClick = item => {
		// 点击禁止值时：只触发事件，不更新值
		if (item.value === props.forbiddenValue) {
			emit('select', item.value);
			internalValue.value = props.modelValue;
			return;
		}
		// 正常选择/重复选择：更新值并触发事件
		internalValue.value = item.value;
		if (props.returnItem) {
			emit('update:modelValue', item.value);
			emit('select', item);
		} else {
			emit('update:modelValue', item.value); // 同步 v-model
			emit('select', item.value); // 触发选择事件（含重复选择）
		}
	};

	// 处理键盘回车（兼容键盘操作）
	const handleKeyEnter = () => {
		const currentValue = internalValue.value;
		emit('select', currentValue); // 无论是否重复，都触发事件
	};
</script>
