<!-- projectModule -->
<template>
	<el-dialog
		v-model="modelValue"
		class="project-dialog"
		title="Tips"
		width="80%"
		:close-on-click-modal="false"
		:close-on-press-escape="false">
		<div class="project-title select-none">
			{{ props.show || showDetail ? '历史预演情景' : '创建项目向导' }}
		</div>
		<img
			src="@/assets/img/close.png"
			alt=""
			class="project-close"
			@click="handleClose" />
		<!-- 历史推演项目 -->
		<div
			class="projectModuleContent"
			v-if="!showDetail && props.show && isHistory">
			<div class="projectOpe h-10"></div>
			<div class="projectHeader">
				<div class="projectHeaderTitle">历史推演项目</div>
				<div class="projectHeaderInput">
					<el-input
						v-model="historyForm.like_name"
						clearable
						class="projectHeaderInputInput"
						:suffix-icon="Search"
						placeholder="搜索历史项目名称"
						@clear="getProjectRecord"
						@keyup.enter="getProjectRecord" />
					<div
						class="projectHeaderInputDelete cursor-pointer select-none"
						@click="deleteSelectedProjects">
						{{ delBtnText }}
					</div>
				</div>
			</div>
			<div class="projectHeaderTable">
				<div class="projectHeaderTableTitle flex items-center">
					<div class="w-30 projectSortable" @click="handleSort('index')">
						排名
						<div class="sort-icon">
							<div
								class="sort-arrow sort-arrow-up"
								:class="{
									active: sortField === 'rank' && sortOrder === 'asc'
								}"></div>
							<div
								class="sort-arrow sort-arrow-down"
								:class="{
									active: sortField === 'rank' && sortOrder === 'desc'
								}"></div>
						</div>
					</div>
					<div class="w-91">项目名称</div>
					<div class="w-35 projectFilterable" @click="handleSort('rangeType')">
						计算范围
						<img
							src="@/assets/img/deductionEngine/sx.png"
							alt=""
							class="filter-icon" />
					</div>
					<div class="w-35 projectFilterable" @click="handleSort('baseYear')">
						基准年份<img
							src="@/assets/img/deductionEngine/sx.png"
							alt=""
							class="filter-icon" />
					</div>
					<div
						class="w-35 projectFilterable"
						@click="handleSort('predictYear')">
						截止年份<img
							src="@/assets/img/deductionEngine/sx.png"
							alt=""
							class="filter-icon" />
					</div>
					<div class="w-35 projectFilterable" @click="handleSort('status')">
						计算状态<img
							src="@/assets/img/deductionEngine/sx.png"
							alt=""
							class="filter-icon" />
					</div>
					<div class="w-50 projectSortable" @click="handleSort('createTime')">
						创建时间
						<div class="sort-icon">
							<div
								class="sort-arrow sort-arrow-up"
								:class="{
									active: sortField === 'createTime' && sortOrder === 'asc'
								}"></div>
							<div
								class="sort-arrow sort-arrow-down"
								:class="{
									active: sortField === 'createTime' && sortOrder === 'desc'
								}"></div>
						</div>
					</div>
					<div class="w-55">操作</div>
				</div>
			</div>
			<div class="projectHeaderTableBody !h-[560px] overflow-y-auto">
				<div
					class="projectHeaderTableBodyItem flex items-center"
					v-for="(item, index) in list"
					:key="item">
					<div class="w-30">
						<el-checkbox
							style="margin-right: 24px"
							v-model="item.checked"
							v-if="tableChecked"></el-checkbox>
						<span>{{ index + 1 }}</span>
					</div>
					<div class="w-91 textEllipsis">{{ item?.name }}</div>
					<el-tooltip
						v-if="item?.rangeType?.length > 4"
						class="box-item"
						effect="dark"
						:content="item?.rangeType"
						placement="top">
						<div class="w-35 textEllipsis">{{ item?.rangeType }}</div>
					</el-tooltip>
					<div class="w-35" v-else>{{ item?.rangeType }}</div>
					<div class="w-35">{{ item?.baseYear }}</div>
					<div class="w-35">{{ item.predictYear }}</div>
					<div
						class="w-35"
						:style="{
							color:
								item.status === '3'
									? 'rgba(2, 234, 147, 1)'
									: item.status === '2'
									? 'rgba(255, 145, 31, 1)'
									: item.status === '4'
									? 'rgba(255, 56, 107, 1)'
									: 'rgba(144,147,153, 1)'
						}">
						{{
							item.status === '1'
								? '任务创建'
								: item.status === '2'
								? '运行中'
								: item.status === '3'
								? '运行完成'
								: '运行失败'
						}}
					</div>
					<div class="w-50">{{ item.cjsj }}</div>
					<div class="w-55 projectOperate">
						<span
							style="color: #1fc6ff; font-weight: bold; cursor: pointer"
							@click="loadProjectHandle(item)"
							>结果加载</span
						>
						<span
							style="color: #1fc6ff; font-weight: 300; cursor: pointer"
							@click="detailProjectHandle(item)"
							>参数查看</span
						>
						<span
							style="color: #1fc6ff; font-weight: 300; cursor: pointer"
							@click="deleteProjectHandle(item)"
							>删除</span
						>
					</div>
				</div>
			</div>
			<div class="projectFooter">
				<div class="projectFooterItem mr-4">共{{ total }}条记录</div>
				<el-pagination
					background
					layout="prev, pager, next"
					:total="total"
					@change="paginationChange"></el-pagination>
				<div class="projectFooterPage ml-4">
					共{{ Math.floor(total / 10) > 0 ? Math.floor(total / 10) : 1 }}页
				</div>
				<div class="projectFooterPageJump">跳至</div>
				<el-input v-model="input" class="projectFooterInput" />
				<div class="projectFooterPageJump">页</div>
			</div>
		</div>
		<!-- 参数查看 -->
		<div v-if="showDetail" class="projectDetail">
			<div class="projectNew">
				<Title label="项目信息"></Title>
				<div class="h-[2px]"></div>
				<div class="projectNewContent h-[112px] !py-[18px]">
					<ul class="flex flex-wrap">
						<li class="w-1/3 flex items-center">
							<span
								class="label"
								style="
									font-family: 'SourceHanSerifCN-Medium';
									font-size: 16px;
									color: rgba(166, 217, 248, 1);
								"
								>项目名称：</span
							>
							<p
								class="summary"
								style="
									font-family: 'SourceHanSerifCN-Regular';
									font-size: 16px;
									color: rgba(255, 255, 255, 0.88);
								">
								{{ historyItem.name }}
							</p>
						</li>
						<li class="w-1/3 flex items-center">
							<span
								class="label"
								style="
									font-family: 'SourceHanSerifCN-Medium';
									font-size: 16px;
									color: rgba(166, 217, 248, 1);
								"
								>推演层级：</span
							>
							<p
								class="summary"
								style="
									font-family: 'SourceHanSerifCN-Regular';
									font-size: 16px;
									color: rgba(255, 255, 255, 0.88);
								">
								{{ historyItem.rangeType }}
							</p>
						</li>
						<li class="w-1/3 flex items-center">
							<span
								class="label"
								style="
									font-family: 'SourceHanSerifCN-Medium';
									font-size: 16px;
									color: rgba(166, 217, 248, 1);
								"
								>项目描述：</span
							>
							<p
								class="summary"
								style="
									font-family: 'SourceHanSerifCN-Regular';
									font-size: 16px;
									color: rgba(255, 255, 255, 0.88);
								">
								{{ historyItem.remark }}
							</p>
						</li>
						<li class="w-1/3 flex items-center mt-[25px]">
							<span
								class="label"
								style="
									font-family: 'SourceHanSerifCN-Medium';
									font-size: 16px;
									color: rgba(166, 217, 248, 1);
								"
								>基准年份：</span
							>
							<p
								class="summary"
								style="
									font-family: 'SourceHanSerifCN-Regular';
									font-size: 16px;
									color: rgba(255, 255, 255, 0.88);
								">
								{{ historyItem.baseYear }}
							</p>
						</li>
						<li class="w-1/3 flex items-center mt-[25px]">
							<span
								class="label"
								style="
									font-family: 'SourceHanSerifCN-Medium';
									font-size: 16px;
									color: rgba(166, 217, 248, 1);
								"
								>预测年份：</span
							>
							<p
								class="summary"
								style="
									font-family: 'SourceHanSerifCN-Regular';
									font-size: 16px;
									color: rgba(255, 255, 255, 0.88);
								">
								{{ historyItem.predictYear }}
							</p>
						</li>
					</ul>
				</div>
				<div class="projectNewXmjbx">
					<div class="flex items-center">
						<Title label="参数详情"></Title>
					</div>
				</div>
				<div class="projectStepOne projectStepTwo">
					<div class="projectStepThree">
						<div class="projectStepThreeHeader">
							<div
								class="projectStepThreeHeaderItem cursor-pointer select-none"
								v-for="(item, index) in selectHeader"
								:key="'headerTab_' + index"
								:class="{
									projectStepThreeHeaderItemActive:
										HeaderItemActive === item.value
								}"
								@click="headerTabChange2(item)">
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
											readonly
											class="projectStepThreeHeaderContentItemInput"
											style="width: 56px; height: 25px !important"
											placeholder="请输入" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="projectStepOneBtn select-none">
					<div></div>
					<div
						class="projectStepOneBtnItem active cursor-pointer"
						@click="handleClose">
						退出
					</div>
				</div>
			</div>
		</div>
		<!-- 新建项目 -->
		<div class="projectNew" v-if="!showDetail && (!props.show || !isHistory)">
			<div class="projectNewContent">
				<div class="projectNewTitle">创建项目向导</div>
				<div class="projectNewStep">
					步骤{{ step === 1 ? 1 : [2, 3, 4].includes(step) ? 2 : 3 }}/3
				</div>
				<div
					class="projectStep"
					:style="{
						backgroundImage: `url(${
							step === 1 ? stepBg1 : step === 2 ? stepBg2 : stepBg3
						})`,
						backgroundSize:
							step === 1
								? '33.33% 100%'
								: step < 5 && step > 1
								? '66.66% 100%'
								: '100% 100%',
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'left center'
					}"></div>
				<div class="projectStepImg">
					<img src="@/assets/img/deductionEngine/step1.png" alt="" />
					<img
						:src="[2, 3, 4, 5, 6].includes(step) ? step2Active : step2"
						alt="" />
					<img :src="step > 4 ? step3Active : step3" alt="" />
				</div>
			</div>
			<div class="projectNewXmjbx">
				<img
					class="h-[33px]"
					src="@/assets/img/deductionEngine/xmjbxx.png"
					alt=""
					v-if="step === 1" />
				<img
					class="h-[33px]"
					src="@/assets/img/deductionEngine/cssz.png"
					alt=""
					v-if="[2, 3, 4].includes(step)" />
				<img
					class="h-[33px]"
					src="@/assets/img/deductionEngine/ksjs.png"
					alt=""
					v-if="[5, 6].includes(step)" />
			</div>

			<!-- 第一步 -->
			<div
				class="projectStepOne"
				style="padding: 32px 105px 25px"
				v-if="step === 1">
				<el-form
					ref="formRef"
					label-width="auto"
					:model="addForm"
					:rules="rules"
					label-position="top">
					<el-row class="w-full">
						<el-col :span="10">
							<el-form-item label="情景名称" prop="name">
								<el-input
									v-model="addForm.name"
									clearable
									placeholder="请输入情景名称" />
							</el-form-item>
						</el-col>
						<el-col :span="4"></el-col>
						<el-col :span="10">
							<el-form-item label="推演层级" prop="rangeType">
								<el-select
									v-model="calculateMode"
									multiple
									clearable
									popper-class="my-popper"
									placeholder="请选择区县/街道/网格"
									@change="addForm.rangeType = calculateMode.join()">
									<el-option
										v-for="item in calculateModeList"
										:key="item.value"
										:label="item.label"
										:value="item.value" />
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="w-full">
						<el-col :span="10">
							<el-form-item label="场景选择" prop="baseYear">
								<el-select
									v-model="addForm.baseYear"
									popper-class="my-popper"
									clearable
									placeholder="请选择场景体系">
									<el-option
										v-for="item in basisYearList"
										:key="item.value"
										:label="item.label"
										:value="item.value" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="4"></el-col>
						<el-col :span="10">
							<el-form-item label="预演间隔" prop="jianJie">
								<el-select
									v-model="addForm.jianJie"
									popper-class="my-popper"
									placeholder="请选择推演的间隔">
									<el-option
										v-for="item in jianJieList"
										:key="item.value"
										:label="item.label"
										:value="item.value" />
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row class="w-full">
						<el-col :span="10">
							<el-form-item label="基准年份" prop="baseYear">
								<el-select
									v-model="addForm.baseYear"
									popper-class="my-popper"
									clearable
									placeholder="请选择基准年份">
									<el-option
										v-for="item in basisYearList"
										:key="item.value"
										:label="item.label"
										:value="item.value" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="4"></el-col>
						<el-col :span="10">
							<el-form-item label="截止年份" prop="predictYear">
								<el-select
									v-model="addForm.predictYear"
									popper-class="my-popper"
									placeholder="请选择推演截止年份">
									<el-option
										v-for="item in predictYearList"
										:key="item.value"
										:label="item.label"
										:value="item.value" />
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="项目描述" prop="remark">
						<el-input
							v-model="addForm.remark"
							type="textarea"
							rows="4"
							clearable
							placeholder="请输入情景描述（可选）" />
					</el-form-item>
				</el-form>
			</div>
			<!-- 第二步 -->
			<div
				class="projectStepOne projectStepTwo flex items-center justify-center"
				v-if="step === 2">
				<img
					src="@/assets/img/abc1.png"
					style="width: 1298px; height: 385px"
					alt="" />
			</div>
			<!-- 第三步 -->
			<div
				class="projectStepOne projectStepTwo flex items-center justify-center"
				v-if="[3].includes(step)">
				<img
					src="@/assets/img/abc2.png"
					style="width: 1298px; height: 385px"
					alt="" />
			</div>
			<!-- 第四步 -->
			<div
				class="projectStepOne projectStepTwo"
				v-if="[4, 5, 6].includes(step)">
				<div class="projectStepThreeContent">
					<div
						class="flex items-center justify-center w-full"
						v-if="step === 4">
						<img
							src="@/assets/img/abc3.png"
							style="width: 1298px; height: 385px"
							alt="" />
					</div>
					<div class="step5" v-if="step === 5">
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
							class="projectStepThreeContentImg2"
							alt="" />
						<p class="projectStepThreeContentText">预演计算已完成</p>
						<p class="projectStepThreeContentText1">
							计算结果已自动保存到历史情景中
						</p>
						<div class="projectStepThreeContentSuccess">
							<div class="projectStepThreeContentSuccessItem">
								<p>项目名称</p>
								<p>{{ addForm.name }}</p>
							</div>
							<div class="projectStepThreeContentSuccessItem">
								<p>预演层级</p>
								<p>{{ addForm.rangeType }}</p>
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
					v-if="step > 1 && step < 5">
					← 上一步
				</div>

				<div
					:class="['projectStepOneBtnItem active cursor-pointer']"
					@click="nextHandle"
					style="margin-left: auto"
					v-if="step < 5">
					下一步 →
				</div>
				<div class="w-full flex items-center justify-between" v-if="step === 5">
					<div></div>
					<div
						class="projectStepOneBtnItem active cursor-pointer"
						@click="handleAbort">
						终止计算
					</div>
					<div></div>
				</div>
			</div>
			<div
				class="projectStepThreeContentSuccessBtn select-none"
				v-if="step === 6">
				<div
					class="projectStepOneBtnItem active cursor-pointer"
					@click="handleClose">
					查看结果
				</div>
			</div>
		</div>
	</el-dialog>
	<!-- 批量删除确认弹窗 -->
	<div class="delPopShow absolute select-none" v-if="delPopShow">
		<el-icon class="closeIcon cursor-pointer" @click="delPopShow = false">
			<CircleClose />
		</el-icon>
		<p class="txt mt-[38px]">共选择 {{ list.length }} 个项目</p>
		<p class="txt">请确认是否删除， 删除后无法恢复</p>
		<div class="flex justify-center mt-[30px]">
			<div
				class="projectStepOneBtnItem cursor-pointer select-none"
				@click="deleteSelectedProjects2('all')">
				确认
			</div>
			<div
				class="projectStepOneBtnItem ml-[42px] cursor-pointer select-none"
				@click="delPopShow = false">
				取消
			</div>
		</div>
	</div>
</template>
<script setup>
	import { CircleClose } from '@element-plus/icons-vue';
	import { ElMessage } from 'element-plus';
	import { useAppStore } from '@/stores/modules/app.js';
	const useStore = useAppStore();
	import cityApi from '@/api/index.js';
	import { Search } from '@element-plus/icons-vue';
	import stepBg1 from '@/assets/img/deductionEngine/stepBg1.png';
	import stepBg2 from '@/assets/img/deductionEngine/stepBg2.png';
	import stepBg3 from '@/assets/img/deductionEngine/stepBg3.png';
	import step2 from '@/assets/img/deductionEngine/step2.png';
	import step2Active from '@/assets/img/deductionEngine/step2Active.png';
	import step3 from '@/assets/img/deductionEngine/step3.png';
	import step3Active from '@/assets/img/deductionEngine/step3Active.png';
	import { getTopParentItem } from '@/utils/index.js';

	const props = defineProps({
		show: {
			type: Boolean,
			default: false
		}
	});
	const historyItem = ref(null);
	const buildId = ref('');
	const showDetail = ref(false);
	const modelValue = ref(true);
	const delPopShow = ref(false);
	const isHistory = ref(true);
	const tableChecked = ref(false);
	const delBtnText = ref('批量删除');
	const emit = defineEmits(['close']);
	const curCountry = ref('');
	const curStreet = ref('');
	const curGrid = ref('');
	const countryList = ref([]);
	const streetList = ref([]);
	const gridList = ref([]);
	const calculateMode = ref(['区县']);
	const calculateModeList = ref([
		{ value: '区县', label: '区县' },
		{ value: '街道', label: '街道' },
		{ value: '网格', label: '网格' }
	]);
	const formRef = ref(null);
	const addForm = ref({
		cjr: '',
		baseYear: '',
		predictYear: '',
		catalogId: '',
		indicatorIds: '',
		name: '',
		rangeType: '',
		remark: '',
		schemeId: '',
		adjustData: '',
		jianJie: ''
	});
	const adjustData = ref({});
	const schemeList = ref([]);
	// 表单验证规则
	const rules = ref({
		name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
		rangeType: [
			{ required: true, message: '请选择推演层级', trigger: 'change' }
		],
		baseYear: [
			{ required: true, message: '请选择基础年份', trigger: 'change' }
		],
		jianJie: [{ required: true, message: '请选择推演间隔', trigger: 'change' }],
		predictYear: [
			{ required: true, message: '请选择预期年份', trigger: 'change' }
		],
		indicatorIds: [
			{ required: true, message: '请选择指标', trigger: 'change' }
		],
		schemeId: [{ required: true, message: '请选择推演算法', trigger: 'change' }]
	});
	const jianJieList = ref([
		{ value: '1', label: '1年一次' },
		{ value: '2', label: '2年一次' },
		{ value: '3', label: '3年一次' },
		{ value: '5', label: '5年一次' }
	]);
	const basisYearList = ref([{ value: '2024', label: '2024' }]);
	let predictYearData = [];
	const predictYearList = computed(() => {
		const i = 5;
		predictYearData = [];
		if (!addForm.value.baseYear || !addForm.value.jianJie) {
			return predictYearData;
		}
		for (let j = 1; j <= i; j++) {
			const value =
				Number(addForm.value.baseYear) + Number(addForm.value.jianJie) * j;
			const label = value + '年';
			predictYearData.push({ value, label });
		}
		return predictYearData;
	});
	const input = ref('');
	const list = ref([]);
	const total = ref(0);
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
	const arrayIndicatorId = ref([]);
	// 排序相关
	const sortField = ref('');
	const sortOrder = ref('asc'); // 'asc' 或 'desc'
	const historyForm = ref({
		adminFlag: '1',
		current: 1,
		size: 10,
		endTime: '',
		eq_status: '',
		like_name: '',
		loginUser: '',
		startTime: ''
	});
	let timer = null;
	let timer2 = null;
	const TOTAL_DURATION = 600;
	const progress = ref(0);
	const remainingTime = ref('10:00');
	onMounted(() => {
		addForm.value.cjr = useStore.userInfo?.username || '';
		getSchemeList();
		calculateModeChange('区县');
		calculateModeChange('街道');
		calculateModeChange('网格');
		getMdDictDetailQuery();
		getProjectRecord();
	});

	onBeforeUnmount(() => {
		clearInterval(timer);
		clearInterval(timer2);
	});

	const getMdDictDetailQuery = async () => {
		try {
			// 推演单元级别
			const res1 = cityApi.getMdDictDetailQuery({
				zdlxdm: 'citysps_region_level'
			});
			const results = await Promise.allSettled([res1]);
			if (results[0].value.resultCode === 'S') {
				calculateModeList.value = results[0].value.data.map(n => {
					return {
						value: n.zdbm,
						label: n.zdz
					};
				});
			}
		} catch (error) {
			console.error(error);
		}
	};

	// 下一步处理
	const nextHandle = async () => {
		// if (step.value === 1) {
		// 	let isValid = true;
		// 	await formRef.value.validate(valid => {
		// 		if (valid) {
		// 			getZb();
		// 			isValid = true;
		// 		} else {
		// 			isValid = false;
		// 		}
		// 	});
		// 	if (!isValid) {
		// 		return;
		// 	}
		// }
		step.value++;
		if (step.value === 5) {
			startLoading();
		}
		console.log(step.value);
	};
	// 头部切换
	const headerTabChange = item => {
		if (xcqdm.value) {
			HeaderItemActive.value = item.value;
			setList.value = adjustData.value[xcqdm.value][item.value];
		} else {
			ElMessage({ message: '请先选择单元', type: 'error' });
		}
	};
	const headerTabChange2 = item => {
		HeaderItemActive.value = item.value;
		setList.value = setSetList(item.children);
	};
	// 中止计算
	const handleAbort = async () => {
		ElMessage({ message: '中止计算成功', type: 'success' });
		clearInterval(timer2);
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
			const passedSeconds = TOTAL_DURATION - remainingSeconds;
			progress.value = (passedSeconds / TOTAL_DURATION) * 100;
			remainingSeconds--;
			remainingTime.value = formatTime(remainingSeconds);
			if (progress.value >= 100) {
				progress.value = 100;
				remainingTime.value = '00:00';
				resultShow.value = true;
				step.value = 5;
				clearInterval(timer2);
			}
		}, 1000);
	};
	// 项目进度查询
	const projectProgressQuery = async projectId => {
		try {
			const res = await cityApi.projectProgressQuery({
				projectId
			});
			if (res.resultCode === 'S') {
				console.log('查询项目进度成功:', res);
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
				eq_baseYear: addForm.value.baseYear,
				eq_predictYear: addForm.value.predictYear, // 目标年份
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
	const setSetList = data => {
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
	// 获取推演算法数据
	const getSchemeList = async () => {
		try {
			const res = await cityApi.schemeQueryWithPage({
				eq_bizType: '1',
				eq_status: '1',
				current: 1,
				size: 100000
			});
			if (res.resultCode === 'S') {
				if (res.data?.length > 0) {
					schemeList.value = res.data.map(item => ({
						...item,
						value: item.id,
						label: item.name
					}));
				}
			}
		} catch (error) {
			console.error('获取推演算法数据:', error);
		}
	};
	const handleSort = field => {
		if (field === 'name') {
			return;
		}
		if (sortField.value === field) {
			// 如果点击的是当前排序字段，切换排序顺序
			sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
		} else {
			// 如果点击的是新字段，设置为升序
			sortField.value = field;
			sortOrder.value = 'asc';
		}
	};
	// 关闭弹窗
	const handleClose = () => {
		step.value = 1;
		resultShow.value = false;
		emit('close');
	};
	// 查询城市推演项目记录信息
	const getProjectRecord = async () => {
		try {
			const response = await cityApi.projectQueryWithPage(historyForm.value);
			if (response.resultCode === 'S') {
				list.value =
					response.data.map(item => ({
						...item,
						checked: false
					})) || [];
				total.value = response.pageInfo.recordCount || 0;
			}
		} catch (error) {
			console.error('查询城市推演项目记录信息失败:', error);
		}
	};
	// 分页改变
	const paginationChange = page => {
		historyForm.value.current = page;
		getProjectRecord();
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
			baseYear: '',
			catalogId: '',
			indicatorIds: '',
			name: '',
			predictYear: '',
			rangeType: '',
			remark: '',
			schemeId: ''
		};
		addForm.value.cjr = useStore.userInfo?.username || '';
	};
	// 结果加载
	const loadProjectHandle = item => {
		handleClose();
	};
	// 参数查看
	const detailProjectHandle = async item => {
		historyItem.value = item;
		curCountry.value = item.rangeType;
		setList.value = [];
		arrayIndicatorId.value = [];
		const indicators = item.indicators;
		showDetail.value = true;

		addForm.value.baseYear = item.baseYear;
		addForm.value.predictYear = item.predictYear;

		// getZb();
		// await nextTick();

		// let allList = [];
		// if (selectHeader.value.length > 0) {
		// 	selectHeader.value.forEach(item => {
		// 		allList = allList.concat(setSetList(item.children));
		// 	});
		// 	if (allList.length > 0) {
		// 		allList.forEach(item => {
		// 			arrayIndicatorId.value.push(item.nodeId);
		// 		});
		// 	}
		// }

		// console.log('header:', header.value);
		// console.log('selectHeader:', selectHeader.value);
		// console.log('arrayIndicatorId:', arrayIndicatorId.value);

		const res = await cityApi.resultTree({
			current: 1,
			size: 1000,
			array_indicatorId: item.indicatorIds,
			eq_indicatorId: '',
			projectType: '',
			eq_projectId: '',
			eq_baseYear: item.baseYear,
			eq_predictYear: item.predictYear,
			eq_regionLevel: item.rangeType,
			eq_xzqdm: '',
			like_indicatorName: ''
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
				if (indicators.length > 0) {
					const indicatorsIds = indicators.map(item => item.id);
					indicatorsIds.forEach(id => {
						selectHeader.value.push(
							getTopParentItem(header.value, id, 'nodeId')
						);
					});
					HeaderItemActive.value = selectHeader.value[0].value;
				}
				setList.value = setSetList(selectHeader.value[0].children);
			}
		}
	};
	// 历史记录删除
	const deleteProjectHandle = item => {
		ElMessageBox.confirm('删除后无法恢复！', '警告', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		})
			.then(() => {
				cityApi.projectDelete({ projectId: item.id }).then(() => {
					ElMessage({
						type: 'success',
						message: '已删除'
					});
				});
			})
			.catch(() => {
				ElMessage({
					type: 'info',
					message: '删除失败'
				});
			});
	};
	// 批量删除选中
	const deleteSelectedProjects = async () => {
		if (delBtnText.value === '批量删除') {
			tableChecked.value = true;
			delBtnText.value = '删除选中';
			return;
		}
		const selectedProjects = list.value.filter(item => item.checked);
		if (selectedProjects.length === 0) {
			ElMessage({
				type: 'error',
				offset: 100,
				duration: 5000,
				message: '请选择要删除的项目'
			});
			return;
		} else {
			delPopShow.value = true;
		}
	};
	const deleteSelectedProjects2 = async () => {
		console.log('确定删除');
	};
</script>
<style lang="scss">
	.projectNew {
		padding: 70px 40px;
		.projectNewContent {
			height: 168px;
			overflow: hidden;
			padding: 20px 40px 50px 40px;
			border: 1px solid rgba(94, 188, 245, 0.4);
			background: #12538173;
			border-radius: 20px;
			.projectNewTitle {
				font-family: 'YouSheBiaoTiHei';
				font-size: 24px;
				font-weight: 400;
				color: #fff;
			}
			.projectNewStep {
				font-size: 16px;
				font-weight: 400;
				color: #1fc6ff;
				text-align: right;
			}
			.projectStep {
				width: 100%;
				height: 15px;
				border-radius: 100px;
				background-color: #fff;
				margin: 20px 0;
			}
			.projectStepImg {
				display: flex;
				align-items: center;
				justify-content: space-evenly;
				img {
					width: 146px;
				}
			}
		}
		.projectNewXmjbx {
			padding: 20px 0 10px 0;
		}
		.projectStepOne {
			padding: 32px 20px 20px;
			border-radius: 20px;
			border: 1px solid rgba(94, 188, 245, 0.4);
			height: 448px;
			.el-form-item__label {
				color: #a6d9f8;
				font-size: 14px;
			}
		}
		.projectStepTwo {
			padding: 32px 20px 20px;
			border-radius: 20px;
			border: 1px solid rgba(94, 188, 245, 0.4);
			height: 448px;
			overflow-y: auto;
			height: 448px;
			.el-checkbox-group {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
			}
			.el-checkbox {
				width: 40%;
				height: 62px;
				background: linear-gradient(
					0deg,
					rgba(31, 135, 204, 0.2) 0%,
					rgba(31, 135, 204, 0.0001) 98.61%
				);
				border: 1px solid rgba(94, 188, 245, 0.2);
				border-radius: 10px;
				padding: 4px 20px;
				box-sizing: border-box;
				margin-right: 0 !important;
				margin-bottom: 20px !important;
				.el-checkbox__input {
					margin-top: -20px !important;
				}
				.el-checkbox__input.is-checked .el-checkbox__inner {
					background-color: #fff !important;
				}
				.el-checkbox__input.is-checked .el-checkbox__inner:after {
					border-color: #000 !important;
				}
			}
			.projectStepTwoCheckboxContent {
				p {
					font-size: 16px;
					color: #63d8ff;
				}
				p.summary {
					font-size: 12px;
					color: #c4c4c4;
					margin-top: 10px;
					width: 400px;
				}
			}
			.step2Title {
				font-family: 'SourceHanSansCN-ExtraLight';
				font-weight: 300;
				font-size: 20px;
				line-height: 30px;
				color: #c4c4c4;
				& h3 {
					color: #c4c4c4;
				}
				& p {
					padding-left: 2rem;
				}
				span {
					font-family: 'SourceHanSansCN-Heavy';
					font-weight: 900;
					font-size: 20px;
					line-height: 30px;
					letter-spacing: 0px;
					color: #c4c4c4;
				}
			}
		}
		.el-upload-dragger {
			background-color: #0a2e51;
			border: 1px solid #2b6692;
		}
		.uploadText {
			font-family: 'AlibabaPuHuiTi-55';
			font-weight: 400;
			font-size: 13px;
			line-height: 13px;
			text-align: center;
			color: #a6d9f8;
		}
		.shp {
			font-family: 'AlibabaPuHuiTi-55';
			font-weight: 400;
			font-size: 13px;
			line-height: 13px;
			text-align: center;
			color: #c4c4c4;
		}
		.uploadSuccess {
			font-family: 'AlibabaPuHuiTi-55';
			font-weight: 400;
			font-size: 40px;
			line-height: 40px;
			letter-spacing: 0px;
			text-align: center;
			color: #a6d9f8;
		}
		.uploadSuccessPath {
			color: #c4c4c4;
			font-family: 'AlibabaPuHuiTi-55';
			font-weight: 400;
			font-size: 13px;
			line-height: 13px;
			letter-spacing: 0px;
			text-align: center;
		}
		@keyframes rotate {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}
		.projectStepThreeContent {
			.projectStepThreeContentImg {
				width: 77px;
				height: 77px;
				margin: 0 auto;
				display: block;
				animation-name: rotate;
				animation-duration: 3s;
				animation-iteration-count: infinite;
				animation-timing-function: linear;
				animation-direction: normal;
			}
			.projectStepThreeContentImg2 {
				width: 77px;
				height: 77px;
				margin: 0 auto;
				display: block;
			}
			.projectStepThreeContentText {
				font-size: 20px;
				color: #1fc6ff;
				text-align: center;
				font-weight: 400;
				letter-spacing: 2px;
				line-height: 48px;
			}
			.projectStepThreeContentText1 {
				color: #c4c4c4;
				font-size: 14px;
				text-align: center;
			}
			.projectStepThreeContentProgress {
				width: 100%;
				height: 10px;
				background-color: #fff;
				margin: 60px 0 20px 0;
				overflow: hidden;
				border-radius: 100px;
			}
			.projectStepThreeContentProgressBar {
				height: 100%;
				background-color: #1aa053;
			}
			.projectStepThreeContentProgressText {
				font-size: 16px;
				color: #c4c4c4;
				text-align: center;
			}
			.projectStepThreeContentSuccess {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 20px;
				.projectStepThreeContentSuccessItem {
					width: 28%;
					background: linear-gradient(
						0deg,
						rgba(31, 135, 204, 0.2) 0%,
						rgba(31, 135, 204, 0.0001) 98.61%
					);
					border: 1px solid rgba(94, 188, 245, 0.2);
					border-radius: 4px;
					box-sizing: border-box;
					height: 110px;
					p:first-child {
						font-size: 14px;
						color: #c4c4c4;
						text-align: center;
						padding: 20px 0 10px 0;
					}
				}
				p:last-child {
					font-size: 20px;
					font-weight: 400;
					color: #63d8ff;
					text-align: center;
				}
			}
		}
		.projectStepOneBtn {
			display: flex;
			justify-content: space-between;
			margin-top: 20px;
			.projectStepOneBtnItem {
				min-width: 130px;
				padding: 0 10px;
				height: 32px;
				line-height: 32px;
				text-align: center;
				background: url('@/assets/img/deductionEngine/stepBg.png');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				background-position: center center;
				font-size: 16px;
				font-weight: 400;
				color: #979797;
				&.disabled {
					cursor: not-allowed;
					opacity: 0.5;
				}
			}

			.projectStepOneBtnItem.active,
			.projectStepOneBtnItem:hover {
				background: url('@/assets/img/deductionEngine/stepBgActive.png');
				background-size: 100% 100%;
				color: #fff;
			}
		}
		.projectStepThreeContentSuccessBtn {
			display: flex;
			align-items: center;
			justify-content: center;
			padding-top: 20px;
			gap: 20px;
			.projectStepOneBtnItem {
				width: 130px;
				height: 32px;
				line-height: 32px;
				text-align: center;
				background: url('@/assets/img/deductionEngine/stepBg.png');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				background-position: center center;
				font-size: 16px;
				font-weight: 400;
				color: #979797;
			}
			.projectStepOneBtnItem.active,
			.projectStepOneBtnItem:hover {
				background: url('@/assets/img/deductionEngine/stepBgActive.png');
				background-size: 100% 100%;
				color: #fff;
			}
		}
		.el-textarea__inner,
		.el-input__wrapper,
		.el-select__wrapper {
			background: none !important;
			border: 1px solid rgba(94, 188, 245, 1) !important;
			border-radius: 8px !important;
			color: #fff;
			font-size: 14px;
			width: 100%;
		}
		.el-input__wrapper,
		.el-select__wrapper {
			line-height: 40px;
			height: 40px;
		}
		.el-textarea__inner,
		.el-select__caret,
		.el-input__clear {
			color: #5cdaf5de !important;
		}
		.el-textarea__inner,
		.el-input__inner,
		.el-select__input,
		.el-select__placeholder {
			color: #fff !important;
			&.is-transparent {
				background: transparent;
				color: #c4c4c4 !important;
				font-size: 14px;
				height: 30px;
				line-height: 30px;
			}
		}
		.el-textarea__inner,
		.el-input__wrapper,
		.el-input__wrapper:hover {
			box-shadow: none;
		}
	}
	.rangeLabel {
		font-family: 'YouSheBiaoTiHei';
		font-weight: 400;
		font-size: 14px;
		line-height: 22px;
		color: #ffffff;
	}
	.delPopShow {
		top: 50%;
		left: 50%;
		z-index: 9999;
		transform: translate(-50%, -50%);
		width: 482px;
		height: 234px;
		border: 3px solid #1bb1e5;
		background: rgba(0, 61, 81, 0.7765);
		& .closeIcon {
			position: absolute;
			right: 18px;
			top: 13px;
			color: white;
			font-size: 40px;
		}
		& .txt {
			font-family: 'SourceHanSerifCN-Regular';
			font-weight: 400;
			font-size: 20px;
			line-height: 50px;
			letter-spacing: 0px;
			text-align: center;
			color: white;
		}
		& .projectStepOneBtnItem {
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90px;
			height: 32px;
			border-width: 1px;
			border-radius: 5px;
			text-align: center;
			border: 1px solid rgba(126, 220, 251, 1);
			background: rgba(57, 205, 255, 0.12);
		}
	}
	.projectModuleContent {
		padding: 30px 40px 40px 40px;
		box-sizing: border-box;
		.projectOpe {
			display: flex;
			align-items: center;
			.projectOpeItemAdd {
				width: 88px;
				height: 44px;
				line-height: 44px;
				background-image: url('@/assets/img/deductionEngine/creat.png');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				background-position: center center;
				text-align: center;
				font-size: 16px;
				font-weight: 400;
				color: rgba(31, 198, 255, 1);
			}
			.projectOpeItemHistory {
				width: 88px;
				height: 44px;
				line-height: 44px;
				background-image: url('@/assets/img/deductionEngine/creatActive.png');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				background-position: center center;
				text-align: center;
				font-size: 16px;
				font-weight: 400;
				color: #fff;
				margin-left: 20px;
			}
		}
		.projectHeader {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 20px;
			.projectHeaderTitle {
				font-family: 'YouSheBiaoTiHei';
				font-size: 24px;
				font-weight: 400;
				color: #fff;
			}
			.projectHeaderInput {
				display: flex;
				align-items: center;
				.projectHeaderInputInput {
					width: 240px;
					height: 30px;
					background-size: 100% 100%;
					background-repeat: no-repeat;
					background-position: center center;
					border: 1px solid rgba(126, 220, 251, 1);
				}
				.projectHeaderInputInput .el-input__wrapper {
					background-color: rgba(11, 80, 136, 0.3) !important;
					border: none !important;
					box-shadow: none !important;
				}
				.projectHeaderInputInput .el-input__inner {
					background-color: transparent !important;
					color: #fff !important;
				}
				.projectHeaderInputInput .el-input__inner::placeholder {
					color: rgba(196, 196, 196, 1) !important;
				}
			}

			.projectHeaderInputDelete {
				width: 130px;
				height: 32px;
				line-height: 32px;
				background-image: url('@/assets/img/deductionEngine/del.png');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				background-position: center center;
				text-align: center;
				font-size: 16px;
				font-weight: 400;
				color: #fff;
				margin-left: 20px;
			}
		}
		.projectHeaderTable {
			background-image: url('@/assets/img/deductionEngine/tableHeader.png');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-position: center center;
			box-sizing: border-box;
			height: 56px;
			margin-top: 20px;
			.projectHeaderTableTitle {
				line-height: 56px;
				div {
					font-size: 16px;
					font-weight: 400;
					color: rgba(180, 192, 204, 1);
					text-align: center;
				}
			}
		}
		.projectHeaderTableBody {
			.projectHeaderTableBodyItem {
				font-family: 'SourceHanSerifCN-Regular';
				font-weight: 400;
				font-size: 18px;
				line-height: 24px;
				height: 56px;
				color: #fff;
				.projectOperate {
					span {
						margin-right: 10px;
					}
				}
				div {
					text-align: center;
				}
				.textEllipsis {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			.projectHeaderTableBodyItem:nth-child(odd) {
				background-color: rgba(54, 94, 114, 0.24);
			}
			.projectHeaderTableBodyItem:nth-child(even) {
				background-color: rgba(54, 94, 114, 0.5);
			}
		}
		.projectFooter {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 10px 0 0 0;
			.projectFooterItem {
				font-size: 14px;
				color: rgba(31, 198, 255, 1);
			}
			.projectFooterPagination {
				margin: 0 10px;
			}
			.projectFooterPage {
				border: 1px solid rgba(31, 198, 255, 1);
				color: #fff;
				height: 32px;
				line-height: 32px;
				padding: 0 10px;
			}
			.projectFooterPageJump {
				margin: 0 10px;
				color: #fff;
				height: 32px;
				line-height: 32px;
			}
			.projectFooterInput {
				width: 32px;
			}
			.el-input__wrapper {
				border: 1px solid rgba(31, 198, 255, 1);
				color: #fff !important;
				background: none;
				height: 32px;
				line-height: 32px;
				text-align: center;
			}
			.el-input__inner {
				color: #fff !important;
			}
			.el-pagination.is-background .btn-next,
			.el-pagination.is-background .btn-prev,
			.el-pagination.is-background .el-pager li {
				border: 1px solid rgba(31, 198, 255, 1);
				color: #fff;
				background: none;
			}
			.el-pagination.is-background .el-pager li.is-active {
				background: rgba(31, 198, 255, 1);
			}
		}
		.projectW-10 {
			width: 10%;
		}
		.projectW-20 {
			width: 20%;
		}
		.projectSortable {
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			&:hover {
				color: #1fc6ff;
			}
			.sort-icon {
				margin-left: 8px;
				display: flex;
				flex-direction: column;
				.sort-arrow {
					width: 0;
					height: 0;
					border-left: 4px solid transparent;
					border-right: 4px solid transparent;
					margin: 1px 0;
					opacity: 0.5;
					&.sort-arrow-up {
						border-bottom: 6px solid #b4c0cc;
					}
					&.sort-arrow-down {
						border-top: 6px solid #b4c0cc;
					}
					&.active {
						opacity: 1;
						&.sort-arrow-up {
							border-bottom-color: #1fc6ff;
						}
						&.sort-arrow-down {
							border-top-color: #1fc6ff;
						}
					}
				}
			}
		}
		.projectFilterable {
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			.filter-icon {
				margin-left: 8px;
				margin-top: 4px;
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
				opacity: 0.7;
				transition: opacity 0.2s;
			}
			&:hover {
				color: #1fc6ff;
				.filter-icon {
					opacity: 1;
				}
			}
		}
	}
	.project-dialog {
		background-image: url('@/assets/img/deductionEngine/dialog.png') !important;
		background-size: 100% 100% !important;
		background-repeat: no-repeat !important;
		background-position: center center !important;
		border: none !important;
		border-radius: 0 !important;
		box-shadow: none !important;
		background-color: rgba(0, 0, 0, 0) !important;
		height: 848px !important;
	}

	.project-dialog .el-dialog__header {
		display: none !important;
	}

	.project-dialog .el-dialog__body {
		padding: 0 !important;
	}

	.project-dialog .el-dialog__footer {
		padding: 0 !important;
	}
	.project-title {
		font-size: 32px;
		font-weight: 400;
		color: #fff;
		text-align: center;
		margin-top: -40px;
	}
	.project-close {
		width: 42px;
		height: 42px;
		position: absolute;
		right: 20px;
		top: 20px;
		cursor: pointer;
	}
	.projectStepThree {
		width: 1240px;
		margin: 0 auto;
		.projectStepThreeHeader {
			display: flex;
			align-items: center;
			padding: 0;
			.projectStepThreeHeaderItem {
				font-size: 16px;
				color: #fff;
				font-weight: 400;
				font-family: 'YouSheBiaoTiHei';
				text-align: center;
				line-height: 44px;
				width: 155px;
				height: 44px;
				background: linear-gradient(180deg, #012439, #014570);
				border-left: 1px solid #008fad;
				border-top: 1px solid #008fad;
				border-bottom: 1px solid #008fad;
				&:last-child {
					border-right: 1px solid #008fad;
				}
			}
			.projectStepThreeHeaderItemActive {
				background: linear-gradient(180deg, #0e2e43, #029af9);
			}
		}
		.projectStepThreeHeaderContent {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			padding: 0;
			background: #093d5c;
			padding: 20px 50px;
			box-sizing: border-box;
			.projectStepThreeHeaderContentItem {
				width: 50%;
				padding-right: 8%;
				margin-bottom: 20px;
				.projectStepThreeHeaderContentItemTitle {
					display: flex;
					align-items: center;
					margin-bottom: 6px;
					img {
						width: 14px;
						height: 14px;
					}
					span {
						font-size: 16px;
						color: #fff;
						font-weight: 400;
						margin-left: 6px;
					}
				}
				& .name {
					font-family: 'SourceHanSerifCN-Medium';
					font-weight: 400;
					font-style: Regular;
					line-height: 140%;
					color: rgba(255, 255, 255, 0.2);
				}
				& .label {
					font-family: 'AlibabaPuHuiTi-55';
					font-weight: 400;
					font-size: 14px;
					line-height: 20px;
					letter-spacing: 0px;
					vertical-align: middle;
					color: #c4c4c4;
					margin-right: 6px;
				}
				& .value {
					font-family: 'SourceHanSerifCN-ExtraLight';
					font-weight: 400;
					font-size: 12px;
					line-height: 17px;
					letter-spacing: 0px;
					color: #fff;
				}
				.projectStepThreeHeaderContentItemInput {
					.el-input {
						border: none;
						box-shadow: none;
					}
					.el-input__wrapper {
						background: linear-gradient(180deg, #083e5e, #0e4c71);
						border: 1px solid #195c86;
						border-radius: 4px;
						height: 25px;
						line-height: 25px;
					}
					.el-input__inner {
						background: transparent;
						color: #fff;
						font-size: 12px;
						height: 25px;
						line-height: 25px;
					}
				}
			}
		}
	}
</style>
