<!-- projectChildModule -->
<template>
	<el-dialog
		v-model="props.modelValue"
		class="project-dialog"
		title="Tips"
		width="80%"
		:close-on-click-modal="false"
		:close-on-press-escape="false">
		<div class="project-title select-none">新建推演项目</div>
		<img
			src="@/assets/img/close.png"
			alt=""
			class="project-close"
			@click="handleClose" />
		<!-- 新建项目 -->
		<div class="projectNew">
			<div class="projectNewContent">
				<div class="projectNewTitle">创建项目向导</div>
				<div class="projectNewStep">步骤{{ step > 4 ? 4 : step }}/4</div>
				<div
					class="projectStep"
					:style="{
						backgroundImage: `url(${
							step === 1
								? stepBg1
								: step === 2
								? stepBg4
								: step === 3
								? stepBg2
								: stepBg3
						})`,
						backgroundSize:
							step === 1
								? '25% 100%'
								: step === 2
								? '50% 100%'
								: step === 3
								? '75% 100%'
								: '100% 100%',
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'left center'
					}"></div>
				<div class="projectStepImg">
					<img src="@/assets/img/deductionEngine/step1.png" alt="" />
					<img
						:src="[2, 3, 4, 5, 6].includes(step) ? step4Active : step4"
						alt="" />
					<img
						:src="[2, 3, 4, 5, 6].includes(step) ? step2Active : step2"
						alt="" />
					<img :src="step > 3 ? step3Active : step3" alt="" />
				</div>
			</div>
			<div class="projectNewXmjbx">
				<Title label="方案基本信息" key="step1" v-if="step === 1"></Title>
				<Title
					label="决策剧场—重大项目剧场"
					key="step2"
					width="246px"
					widthDiv="176px"
					v-if="step === 2"></Title>
				<Title label="选择计算指标" key="step3" v-if="step === 3"></Title>
				<div class="flex items-center" v-if="step === 4">
					<Title label="参数设置" key="step4"></Title>
					<div class="flex items-center">
						<span class="rangeLabel ml-12" v-if="calculateMode.includes('区县')"
							>区县单元选择</span
						>
						<el-select
							v-if="calculateMode.includes('区县')"
							style="width: 12rem; margin-left: 1rem"
							v-model="curCountry"
							placeholder="请选择"
							popper-class="my-popper"
							@change="handleCountryChange">
							<el-option
								v-for="item in countryList"
								:key="item.value"
								:label="item.label"
								:value="item.value" />
						</el-select>
						<span class="rangeLabel ml-9" v-if="calculateMode.includes('街道')"
							>街道单元选择</span
						>
						<el-select-v2
							v-if="calculateMode.includes('街道')"
							style="width: 12rem; margin-left: 1rem"
							v-model="curStreet"
							:options="streetList"
							placeholder="请选择"
							popper-class="my-popper"
							@change="handleStreetChange" />
						<span class="rangeLabel ml-9" v-if="calculateMode.includes('网格')"
							>网格单元选择</span
						>
						<el-select-v2
							v-if="calculateMode.includes('网格')"
							style="width: 12rem; margin-left: 1rem"
							v-model="curGrid"
							:options="gridList"
							placeholder="请选择"
							popper-class="my-popper"
							@change="handleGridChange" />
					</div>
				</div>
				<div class="projectNewXmjbxText" v-if="[3, 4, 5].includes(step)">
					{{
						step === 3
							? '请选择需要计算的城市要素指标，可多选'
							: step === 4
							? '请选择需要计算的城市要素指标，可多选'
							: '请为所选指标设置参数值'
					}}
				</div>
			</div>

			<!-- 第一步 -->
			<div class="projectStepOne" v-if="step === 1">
				<el-form
					ref="formRef"
					label-width="auto"
					:model="addForm"
					:rules="rules"
					label-position="top">
					<el-form-item label="项目名称" prop="name">
						<el-input
							v-model="addForm.name"
							clearable
							placeholder="请输入项目名称" />
					</el-form-item>
					<el-form-item label="选择基准项目" prop="projectId">
						<el-select
							v-model="addForm.projectId"
							clearable
							popper-class="my-popper"
							placeholder="请选择基准项目名称">
							<el-option
								v-for="item in props.projectList"
								:key="item.id"
								:label="item.name"
								:value="item.id" />
						</el-select>
					</el-form-item>
					<el-form-item label="选择推演板块" prop="bizType">
						<el-select
							v-model="addForm.bizType"
							clearable
							disabled
							popper-class="my-popper"
							placeholder="请选择进行推演的板块">
							<el-option
								v-for="item in bizTypeOpt"
								:key="item.value"
								:label="item.label"
								:value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="选择推演功能" prop="actionType">
						<el-select
							v-model="addForm.actionType"
							clearable
							popper-class="my-popper"
							placeholder="请选择具体的推演功能">
							<el-option
								v-for="item in actionTypeOpt"
								:key="item.value"
								:label="item.label"
								:value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="方案描述" prop="remark">
						<el-input
							v-model="addForm.remark"
							clearable
							placeholder="请输入方案描述（可选）" />
					</el-form-item>
				</el-form>
			</div>
			<!-- 第二步 -->
			<div class="projectStepOne projectStepTwo" v-if="step === 2">
				<div class="step2Title mb-4">
					<h3>上传空间数据说明：</h3>
					<p>
						<span>文件格式：</span>请上传gdb格式文件或打包压缩的shp格式文件 。
					</p>
					<p>
						<span>坐标系：</span
						>上传空间数据的坐标系请设置为CGCS_2000坐标系、或WGS_1984坐标系。
					</p>
				</div>
				<el-form
					ref="formRef2"
					label-width="auto"
					:model="addForm"
					:rules="rules"
					label-position="top">
					<el-form-item label="选择上传空间数据类型" prop="extDataType">
						<el-select
							v-model="addForm.extDataType"
							clearable
							popper-class="my-popper"
							placeholder="请选择上传空间数据类型">
							<el-option
								v-for="item in extDataTypeOpt"
								:key="item.value"
								:label="item.label"
								:value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="选择上传空间数据" prop="extDataPath">
						<div
							class="w-full flex items-center justify-center relative"
							v-if="!uploadSuccess">
							<el-upload
								class="upload-demo w-[712px] h-[200px]"
								drag
								:show-file-list="false"
								:http-request="uploadImage"
								:before-upload="beforeUpload"
								accept=".zip">
								<img src="@/assets/img/archive.png" width="58" alt="" />
								<div class="el-upload__text mt-[18px]">
									<p class="uploadText mb-[10px]">点击或将文件拖拽到这里上传</p>
									<p class="shp">仅支持扩展名：shp</p>
								</div>
							</el-upload>
							<img
								src="@/assets/img/deductionEngine/downloadModule.png"
								alt=""
								height="48"
								class="absolute top-0 right-0 cursor-pointer" />
						</div>
						<div
							class="flex items-center justify-center flex-col w-[712px] h-[200px] mx-auto bg-[#0a2e51] border-[1px] border-[#2b6692] border border-solid rounded-[6px]"
							v-if="uploadSuccess">
							<p class="uploadSuccess mb-[10px]">上传成功</p>
							<p class="uploadSuccessPath">{{ uploadFileName }}</p>
						</div>
					</el-form-item>
				</el-form>
			</div>
			<!-- 第三步 -->
			<div class="projectStepOne projectStepTwo" v-if="step === 3">
				<el-checkbox-group v-model="checkList">
					<el-checkbox
						:value="item.value"
						v-for="(item, index) in header"
						:key="index">
						<div class="projectStepTwoCheckboxContent">
							<p class="label">{{ item.label }}</p>
							<el-tooltip
								class="box-item"
								effect="dark"
								:content="item.remark"
								:show-after="1000"
								placement="top">
								<p class="summary overflow-hidden text-ellipsis">
									{{ item.remark }}
								</p>
							</el-tooltip>
						</div>
					</el-checkbox>
				</el-checkbox-group>
			</div>
			<!-- 第四步 -->
			<div
				class="projectStepOne projectStepTwo"
				v-if="[4, 5, 6].includes(step)">
				<div class="projectStepThree" v-if="!resultShow">
					<div class="projectStepThreeHeader">
						<div
							class="projectStepThreeHeaderItem cursor-pointer select-none"
							v-for="(item, index) in selectHeader"
							:key="'headerTab_' + index"
							:class="{
								projectStepThreeHeaderItemActive:
									HeaderItemActive === item.value
							}"
							@click="headerTabChange(item)">
							{{ item.label }}
						</div>
					</div>
					<div class="projectStepThreeHeaderContent">
						<div
							class="projectStepThreeHeaderContentItem"
							v-for="(item, index) in setList"
							:key="index">
							<div class="projectStepThreeHeaderContentItemTitle">
								<img src="@/assets/img/DecisionTheater/icon.png" alt="" />
								<span class="name">{{ item.label }}</span>
							</div>
							<div class="flex items-center justify-between">
								<div>
									<span class="label pl[56px]">基准年值：</span>
									<span class="value">{{ item.value }}</span>
								</div>
								<div>
									<span class="label">修改后值：</span>
									<el-input
										v-model="item.value2"
										size="small"
										class="projectStepThreeHeaderContentItemInput"
										style="width: 56px; height: 25px !important"
										placeholder="请输入" />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="projectStepThreeContent" v-if="resultShow">
					<div v-if="step === 5">
						<img
							src="@/assets/img/deductionEngine/hc.png"
							class="projectStepThreeContentImg"
							alt="" />
						<p class="projectStepThreeContentText">正在进行指标推演计算</p>
						<p class="projectStepThreeContentText1">
							预计剩余时间：{{ remainingTime }}
						</p>
						<div class="projectStepThreeContentProgress">
							<div
								class="projectStepThreeContentProgressBar"
								:style="{ width: `${progress}%` }"></div>
						</div>
						<p class="projectStepThreeContentProgressText">
							{{ Math.round(progress) }}% 已完成
						</p>
					</div>
					<div v-if="step === 6">
						<img
							src="@/assets/img/deductionEngine/success.png"
							class="projectStepThreeContentImg"
							alt="" />
						<p class="projectStepThreeContentText">指标推演计算已完成</p>
						<p class="projectStepThreeContentText1">
							计算结果已自动保存到历史项目中
						</p>
						<div class="projectStepThreeContentSuccess">
							<div class="projectStepThreeContentSuccessItem">
								<p>项目名称</p>
								<p>{{ addForm.name }}</p>
							</div>
							<div class="projectStepThreeContentSuccessItem">
								<p>计算范围</p>
								<p>{{ rangeType }}</p>
							</div>
							<div class="projectStepThreeContentSuccessItem">
								<p>计算指标数</p>
								<p>{{ arrayIndicatorId.length }}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 按钮 -->
			<div class="projectStepOneBtn select-none" v-if="!resultShow">
				<div
					class="projectStepOneBtnItem cursor-pointer"
					@click="step--"
					v-if="step > 1">
					← 上一步
				</div>

				<div
					:class="['projectStepOneBtnItem active cursor-pointer']"
					@click="nextHandle"
					style="margin-left: auto"
					v-if="step < 4">
					下一步 →
				</div>

				<div
					class="projectStepOneBtnItem cursor-pointer"
					v-if="step === 4"
					@click="handleStart">
					开始计算
				</div>
			</div>
			<div class="projectStepThreeContentSuccessBtn" v-if="resultShow">
				<div
					class="projectStepOneBtnItem active cursor-pointer"
					@click="handleClose">
					查看结果
				</div>
				<div
					class="projectStepOneBtnItem cursor-pointer"
					@click="(step = 1), (resultShow = false), resetAddForm()">
					新建项目
				</div>
			</div>
		</div>
	</el-dialog>
</template>
<script setup>
	import { ElMessage } from 'element-plus';
	import { useAppStore } from '@/stores/modules/app.js';
	const useStore = useAppStore();
	import cityApi from '@/api/index.js';
	import stepBg1 from '@/assets/img/deductionEngine/stepBg1.png';
	import stepBg2 from '@/assets/img/deductionEngine/stepBg2.png';
	import stepBg3 from '@/assets/img/deductionEngine/stepBg3.png';
	import stepBg4 from '@/assets/img/deductionEngine/stepBg4.png';
	import step2 from '@/assets/img/deductionEngine/step2.png';
	import step2Active from '@/assets/img/deductionEngine/step2Active.png';
	import step3 from '@/assets/img/deductionEngine/step3.png';
	import step3Active from '@/assets/img/deductionEngine/step3Active.png';
	import step4 from '@/assets/img/deductionEngine/step4.png';
	import step4Active from '@/assets/img/deductionEngine/step4Active.png';

	const props = defineProps({
		modelValue: {
			type: Boolean,
			default: true
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

	const buildId = ref('');
	const curCountry = ref('');
	const curStreet = ref('');
	const curGrid = ref('');
	const countryList = ref([]);
	const streetList = ref([]);
	const gridList = ref([]);
	const calculateMode = ref(['区县']);
	const formRef = ref(null);
	const formRef2 = ref(null);
	const addForm = ref({
		cjr: '',
		bizType: '',
		projectId: '',
		actionType: '',
		adjustData: '',
		catalogId: '',
		extDataPath: '',
		extDataType: '',
		indicatorIds: '',
		name: '',
		remark: '',
		schemeId: ''
	});
	const uploadFileName = ref('');
	const uploadSuccess = ref(false);
	const adjustData = ref({});
	// 表单验证规则
	const rules = ref({
		name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
		projectId: [
			{ required: true, message: '请选择基准项目名称', trigger: 'change' }
		],
		bizType: [
			{
				required: true,
				message: '请选择进行推演的板块',
				trigger: 'change',
				ignoreDisabled: true
			}
		],
		actionType: [
			{ required: true, message: '请选择具体的推演功能', trigger: 'change' }
		],
		extDataType: [
			{ required: true, message: '请选择上传空间数据类型', trigger: 'change' }
		],
		extDataPath: [
			{ required: true, message: '请上传空间数据', trigger: 'change' }
		]
	});
	const actionTypeOpt = ref([
		{ value: '1', label: '重大项目' },
		{ value: '2', label: '重点平台' },
		{ value: '3', label: '重大事件' }
	]);
	const bizTypeOpt = [
		{ value: 'JCJC', label: '决策剧场' },
		{ value: 'MNGF', label: '模拟工坊' }
	];
	const extDataTypeOpt = [{ value: '1', label: '项目范围' }];
	// 参数设置头部
	const HeaderItemActive = ref(0);
	const selectHeader = ref([]);
	const setList = ref([
		{ label: '总人口数', value: '18000人', value2: '25000' },
		{
			label: '劳动力男性人口数',
			value: '15320人',
			value2: '0'
		},
		{
			label: '未成年男性人口数',
			value: '5320人',
			value2: '0'
		},
		{
			label: '劳动力女性人口数',
			value: '10557人',
			value2: '0'
		},
		{
			label: '未成年女性人口数',
			value: '4958人',
			value2: '0'
		},
		{
			label: '老年女性人口数',
			value: '8557人',
			value2: '0'
		}
	]);
	const baseYear = ref('');
	const predictYear = ref('');
	const xcqdm = ref('');
	const step = ref(1); // 步骤
	const resultShow = ref(false); // 计算结果
	const checkList = ref([]);
	const header = ref([
		{ value: '0', label: '人口发展专题' },
		{ value: '1', label: '土地利用专题' },
		{ value: '2', label: '产业发展专题' },
		{ value: '3', label: '交通通勤专题' },
		{ value: '4', label: '公服设施专题' },
		{ value: '5', label: '空间结构专题' },
		{ value: '6', label: '绿色低碳专题' },
		{ value: '7', label: '安全韧性专题' }
	]);
	const overallProgress = ref(0);
	const arrayIndicatorId = ref([]);
	let timer = null;
	let timer2 = null;
	const TOTAL_DURATION = 600;
	const progress = ref(0);
	const remainingTime = ref('10:00');
	const rangeType = computed(() => {
		return props.projectList.filter(
			item => item.id === addForm.value.projectId
		)[0].rangeType;
	});
	onMounted(() => {
		addForm.value.cjr = useStore.userInfo?.username || '';
		// addForm.value.projectId = props.projectId;
		// addForm.value.bizType = props.bizType;
		calculateModeChange('区县');
		calculateModeChange('街道');
		calculateModeChange('网格');
		getMdDictDetailQuery();
	});
	onBeforeUnmount(() => {
		clearInterval(timer);
		clearInterval(timer2);
	});

	const getMdDictDetailQuery = async () => {
		try {
			// 子推演的业务类型（板块）
			const res2 = cityApi.getMdDictDetailQuery({
				zdlxdm: 'citysps_child_biztype'
			});
			// 子推演的决策剧场板块场景
			const res3 = cityApi.getMdDictDetailQuery({
				zdlxdm: 'citysps_child_jcjc_actiontype'
			});
			// 子推演的模拟工坊板块场景
			const res4 = cityApi.getMdDictDetailQuery({
				zdlxdm: 'citysps_child_mngf_actiontype'
			});
			// 外部空间数据类型
			const res5 = cityApi.getMdDictDetailQuery({
				zdlxdm: 'citysps_child_extdatatype'
			});
			const results = await Promise.allSettled([res2, res3, res4, res5]);
			if (results?.length) {
				const initMdDictItem = datas => {
					return datas.map(m => {
						return {
							value: m.zdbm,
							label: m.zdz,
							data: m
						};
					});
				};
				// 推演板块
				bizTypeOpt.value = initMdDictItem(results[0].value.data);
				// 推演功能
				if (props.bizType == 'MNGF') {
					actionTypeOpt.value = initMdDictItem(results[2].value.data);
				} else {
					actionTypeOpt.value = initMdDictItem(results[1].value.data);
				}
				// 空间数据类型
				extDataTypeOpt.value = initMdDictItem(results[3].value.data);
			}
		} catch (error) {
			console.error(error);
		}
	};

	// 下一步处理
	const nextHandle = async () => {
		if (step.value === 1) {
			let isValid = true;
			await formRef.value.validate(valid => {
				if (valid) {
					getZb();
					isValid = true;
				} else {
					isValid = false;
				}
			});
			if (!isValid) {
				return;
			}
		}
		if (step.value === 2 && addForm.value.extDataPath === '') {
			ElMessage({ message: '请上传空间数据', type: 'error' });
			return;
		}
		if (step.value === 3 && checkList.value.length === 0) {
			ElMessage({ message: '请先选择指标', type: 'error' });
			return;
		}
		// 选择专题后
		if (step.value === 3 && checkList.value.length > 0) {
			selectHeader.value = [];
			arrayIndicatorId.value = [];
			header.value.forEach(item => {
				if (checkList.value.includes(item.value)) {
					selectHeader.value.push(item);
				}
			});
			HeaderItemActive.value = selectHeader.value[0].value;
			setList.value = setSetList(selectHeader.value[0].children);
			let allList = [];
			if (selectHeader.value.length > 0) {
				selectHeader.value.forEach(item => {
					allList = allList.concat(setSetList(item.children));
				});
				if (allList.length > 0) {
					allList.forEach(item => {
						arrayIndicatorId.value.push(item.nodeId);
					});
				}
			}
		}
		step.value++;
	};
	// 头部切换
	const headerTabChange = item => {
		HeaderItemActive.value = item.value;
		setList.value = adjustData.value[xcqdm.value][item.value];
	};
	// 开始计算、保存
	const handleStart = async () => {
		resultShow.value = true;
		step.value = 5;
		const ad = setAdData(adjustData.value);
		addForm.value.cjr = useStore.userInfo?.username || '';
		addForm.value.catalogId = selectHeader.value[0]['pid'] || '';
		addForm.value.indicatorIds = ad.map(item => item.indicatorId).join(',');
		try {
			const res = await cityApi.projectChildBuild({
				...addForm.value
			});
			if (res.resultCode === 'S') {
				adjustData.value = {};
				buildId.value = res.data || '';
				resetAddForm();
				startLoading();
				timer = setInterval(() => {
					projectProgressQuery(res.data || '');
				}, 2000);
			}
		} catch (error) {
			console.error('保存项目:', error);
		}
	};
	// 中止计算
	const handleAbort = async () => {
		try {
			const res = await cityApi.childOnOff({
				failReason: '',
				id: buildId.value,
				remark: '',
				status: '5',
				summary: '',
				zhgxr: useStore.userInfo?.username || ''
			});
			if (res.resultCode === 'S') {
				ElMessage({ message: '中止计算成功', type: 'success' });
			}
		} catch (error) {
			console.error('中止计算:', error);
		}
	};
	const formatTime = seconds => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs
			.toString()
			.padStart(2, '0')}`;
	};
	const startLoading = () => {
		let remainingSeconds = TOTAL_DURATION;
		timer2 = setInterval(() => {
			console.log('倒计时开始');
			const passedSeconds = TOTAL_DURATION - remainingSeconds;
			progress.value = (passedSeconds / TOTAL_DURATION) * 100;
			remainingSeconds--;
			remainingTime.value = formatTime(remainingSeconds);
			if (progress.value >= 100) {
				progress.value = 100;
				remainingTime.value = '00:00';
				clearInterval(timer2);
			}
		}, 1000);
	};
	// 项目进度查询
	const projectProgressQuery = async projectId => {
		try {
			const res = await cityApi.projectChildProgressQuery({
				projectId
			});
			if (res.resultCode === 'S') {
				// console.log('查询项目进度:', res);
				overallProgress.value = res.data?.overallProgress || 0;
				if (res.data?.overallProgress === 100) {
					step.value = 6;
					clearInterval(timer);
				}
			}
		} catch (error) {
			console.error('查询项目进度:', error);
		}
	};
	// 整理想要的 AD 数据
	const setAdData = adjustData => {
		const indicatorIdsSet = new Set();
		Object.keys(adjustData).forEach(xzqdm => {
			const categories = adjustData[xzqdm];
			Object.keys(categories).forEach(catKey => {
				const indicators = categories[catKey];
				indicators.forEach(indicator => {
					indicatorIdsSet.add(indicator.nodeId);
				});
			});
		});
		const indicatorIds = Array.from(indicatorIdsSet);
		const result = [];
		const xzqdms = Object.keys(adjustData);

		xzqdms.forEach(xzqdm => {
			indicatorIds.forEach(indicatorId => {
				let adjustValue = '';
				const categories = adjustData[xzqdm];
				for (const catKey in categories) {
					if (categories.hasOwnProperty(catKey)) {
						const indicators = categories[catKey];
						const targetIndicator = indicators.find(
							item => item.nodeId === indicatorId
						);
						if (targetIndicator) {
							adjustValue = targetIndicator.value2;
							break;
						}
					}
				}
				if (adjustValue !== '' && adjustValue !== null) {
					result.push({
						xzqdm,
						indicatorId,
						adjustValue
					});
				}
			});
		});

		return result;
	};
	const VecLayerOption = [
		{
			name: '区县',
			id: 'COID',
			label: 'CONAME',
			url: './datas/country.geojson'
		},
		{
			name: '街道',
			id: 'STID',
			label: 'SNAME',
			url: './datas/street.json'
		},
		{
			name: '网格',
			id: 'TID',
			label: 'TID',
			url: './datas/grid.geojson'
		}
	];
	// 区县选择
	const handleCountryChange = () => {
		predictYear.value = props.projectList.filter(
			item => item.id === addForm.value.projectId
		)[0].predictYear;
		baseYear.value = props.projectList.filter(
			item => item.id === addForm.value.projectId
		)[0].baseYear;
		calculateModeChange('区县');
		xcqdm.value = curCountry.value;
		if (!adjustData.value[curCountry.value]) {
			getZb(curCountry.value);
			adjustData.value[curCountry.value] = [];
		}
	};
	// 街道选择
	const handleStreetChange = () => {
		calculateModeChange('街道');
		xcqdm.value = curStreet.value;
		if (!adjustData.value[curStreet.value]) {
			getZb(curStreet.value);
			adjustData.value[curStreet.value] = [];
		}
	};
	// 网格选择
	const handleGridChange = () => {
		calculateModeChange('网格');
		xcqdm.value = curGrid.value;
		if (!adjustData.value[curGrid.value]) {
			getZb(curGrid.value);
			adjustData.value[curGrid.value] = [];
		}
	};
	// 推演层级改变时执行
	const calculateModeChange = value => {
		const layer = VecLayerOption.find(item => item.name === value);
		if (layer) {
			changeLyrRenderByVals(layer, value);
		}
	};
	/**
	 * 根据层级信息加载地理数据并更新下拉列表
	 * @param {Object} layer - 层级配置对象，包含url、id、label等属性
	 */
	const changeLyrRenderByVals = (layer, type) => {
		let list = [];
		fetch(layer.url)
			.then(response => response.json())
			.then(data => {
				const features = data.features || [];
				features.forEach(item => {
					const properties = item.properties || {};
					// 安全地获取属性值并转换为字符串，避免null/undefined错误
					const idValue = properties[layer.id];
					const labelValue = properties[layer.label];
					// 只有当id和label值都存在时才添加到列表中
					if (
						idValue !== undefined &&
						idValue !== null &&
						labelValue !== undefined &&
						labelValue !== null
					) {
						list.push({
							value: idValue.toString(),
							label: labelValue.toString()
						});
					}
				});
				if (type === '区县') {
					countryList.value = list;
				} else if (type === '街道') {
					streetList.value = list;
				} else if (type === '网格') {
					gridList.value = list;
				}
			})
			.catch(error => {
				console.error('加载地理数据失败:', error);
			});
	};
	// 专门获取指标树接口
	const getZb = async xzqdm => {
		try {
			const res = await cityApi.resultTree({
				current: 1,
				size: 1000,
				array_indicatorId: arrayIndicatorId.value.join(',') || '',
				eq_indicatorId: '', // 指标ID
				projectType: '',
				eq_projectId: '', // 推演项目ID
				eq_baseYear: baseYear.value,
				eq_predictYear: predictYear.value, // 目标年份
				eq_regionLevel: '', // 行政区级别，全市、区县、街道、网格
				eq_xzqdm: xzqdm || '', // 行政区代码
				like_indicatorName: '' // 指标名称
			});
			if (res.resultCode === 'S') {
				if (res.data?.length > 0) {
					selectHeader.value = [];
					header.value = res.data.map(item => ({
						...item,
						value: item.nodeId,
						label: item.nodeName,
						summary: item.summary
					}));
					if (!adjustData.value[xzqdm]) {
						adjustData.value[xzqdm] = {};
					}
					selectHeader.value = checkList.value.map(checkItem => {
						return (
							header.value.find(headerItem => headerItem.value === checkItem) ||
							{}
						);
					});
					checkList.value.forEach((item, index) => {
						const children = selectHeader.value[index]?.children || [];
						adjustData.value[xzqdm][item] = setSetList(children);
					});
					if (HeaderItemActive.value === '' && selectHeader.value.length > 0) {
						const firstValue = selectHeader.value[0]?.value;
						if (firstValue) {
							HeaderItemActive.value = firstValue;
						}
					}
					setList.value =
						adjustData.value[xzqdm]?.[HeaderItemActive.value] || [];
				}
			}
		} catch (error) {
			console.error('专门获取指标树接口:', error);
		}
	};
	const setSetList = (data = []) => {
		let list = [];
		function collectLastLayerNodes(nodes) {
			// 遍历当前层级的所有节点
			nodes.forEach(node => {
				if (
					node.children &&
					Array.isArray(node.children) &&
					node.children.length > 0
				) {
					collectLastLayerNodes(node.children);
				} else {
					list.push({
						...node,
						label: node.nodeName,
						value: node.monitorValue || '',
						value2: ''
					});
				}
			});
		}
		collectLastLayerNodes(data);
		return list;
	};
	// 上传
	const uploadImage = param => {
		const file = param.file;
		const formData = new FormData();
		formData.append('file', file);
		cityApi
			.singleUpload(formData)
			.then(res => {
				if (res.resultCode === 'S') {
					ElMessage.success('文件上传成功!');
					uploadSuccess.value = true;
					uploadFileName.value = file.name;
					if (res.data?.filePath) {
						addForm.value.extDataPath = res.data.filePath;
					}
				} else {
					ElMessage.error('文件上传失败!');
				}
			})
			.catch(error => {
				ElMessage.error('文件上传失败!');
			});
	};
	// 上传前检查 (仅允许上传zip文件)
	const beforeUpload = file => {
		const zipMimeTypes = ['application/zip'];
		const zipExtensions = ['.zip'];
		const isZipMimeType = zipMimeTypes.includes(file.type);
		const isZipExtension = zipExtensions.some(ext =>
			file.name.toLowerCase().endsWith(ext)
		);

		if (!isZipMimeType && !isZipExtension) {
			ElMessage.error('只能上传shp文件 (.zip)!');
			return false;
		}
		// 检查文件大小 (100MB)
		const isLt100M = file.size / 1024 / 1024 < 100;
		if (!isLt100M) {
			ElMessage.error('zip文件大小不能超过 100MB!');
			return false;
		}
		return true;
	};
	const handleClose = () => {
		step.value = 1;
		resultShow.value = false;
		clearInterval(timer);
		emit('close');
	};
	const resetAddForm = () => {
		setAddForm();
		checkList.value = [];
		curCountry.value = '';
		curStreet.value = '';
		curGrid.value = '';
	};
	const setAddForm = () => {
		addForm.value = {
			adjustData: '',
			catalogId: '',
			indicatorIds: '',
			name: '',
			remark: '',
			schemeId: '',
			actionType: '1',
			bizType: '',
			extDataPath: '',
			extDataType: '1'
		};
		addForm.value.projectId = props.projectId;
		addForm.value.bizType = props.bizType;
		addForm.value.cjr = useStore.userInfo?.username || '';
	};
</script>
<style lang="scss"></style>
