<template>
	<el-header class="flex justify-between header">
		<div class="logo h-full pt-[1.0625rem]">
			<div class="flex">
				<img
					src="@/assets/img/logo.png"
					alt=""
					style="width: 3.625rem; height: 3.625rem" />
				<span class="title select-none">广州市国土空间规划监测评估与推演预警平台</span>
			</div>
		</div>
		<ul class="menuList flex pt-[1.9375rem]">
			<li
				:class="['relative', 'n' + index, { active: menuIdx === index }]"
				v-for="(item, index) in menuList"
				:key="item.path"
				@click="menuClickHandle(item, index)"
				@mouseenter="menuHoverHandle(item)"
				@mouseleave="menuLeaveHandle(item)">
				<div class="flex items-center">
					<div class="imgBox relative flex items-center justify-center">
						<img
							v-if="menuIdx === index"
							:class="['img', 'img' + index]"
							:src="getAssetsFile(`navTip${index}-active`)"
							alt="" />
						<img
							v-else
							:class="['img', 'img' + index]"
							:src="getAssetsFile(`navTip${index}`)"
							alt="" />
					</div>
					<span>{{ item.name }}</span>
				</div>
				<div
					class="menuHover"
					v-show="item.hasSubMenu && item.showSubMenu"
					:style="{
						height: `${calculateSubMenuHeight(item.subMenuItems?.length || 0)}px`
					}">
					<div
						v-for="(subItem, subIndex) in item.subMenuItems"
						:key="subIndex"
						:class="[
							'menuHoverItem',
							{ active: getActiveSubMenuStyle(index, subIndex) }
						]"
						:style="{
							backgroundImage: `url(${
								getActiveSubMenuStyle(index, subIndex) ? activeHover : menuHover
							})`
						}"
						@click="subMenuItemClickHandle(item, subItem, index, subIndex)">
						{{ subItem.name }}
					</div>
				</div>
			</li>
		</ul>
		<div class="headerInfo">
			<div class="headerInfoTime">
				<div class="headerInfoTimeTitle">日期</div>
				<div class="headerInfoTimeValue">
					<span>{{ currentTime }}</span>
					<span class="ml-5">{{ currentTime2 }}</span>
				</div>
			</div>
			<div class="w-[2.3125rem] h-[2.3125rem] rounded-[50%] overflow-hidden">
				<img src="@/assets/img/avatar.png" alt="" class="w-full h-full" />
			</div>
		</div>
	</el-header>
	<div class="appContainer">
		<el-config-provider :locale="zhCn">
			<router-view></router-view>
		</el-config-provider>
	</div>
	<div
		class="absolute top-0 left-100 w-60 h-20 z-1000 bg-white color-black"
		v-if="false">
		<div class="flex items-center">
			<span>4：</span>
			<el-input v-model="searchText" clearable style="width: 100px" />
			<span>=</span>
			<span class="ml-4">{{ searchText / 4 }}</span>
		</div>
		<div class="flex items-center mt-2">
			<span>16：</span>
			<el-input v-model="searchText2" clearable style="width: 100px" />
			<span>=</span>
			<span class="ml-4">{{ searchText2 / 16 }}</span>
		</div>
		<div class="flex items-center mt-2">
			<el-input
				v-model="searchText3"
				type="textarea"
				clearable
				style="width: 100%"
				@keyup.enter="searchText3Enter" />
		</div>
	</div>
</template>

<script setup>
	import { getAssetsFile } from '@/utils/index.js';
	import menuHover from '@/assets/img/tabBg.png';
	import activeHover from '@/assets/img/tabBgActive.png';
	import zhCn from 'element-plus/es/locale/lang/zh-cn';

	const searchText = ref('');
	const searchText2 = ref('');
	const searchText3 = ref('');
	const searchText3Enter = () => {
		// const inputStr = searchText3.value.trim();
		// if (!inputStr) {
		// 	searchText3.value = 0;
		// 	return;
		// }
		// const numStrs = inputStr.split(/\s+/);
		// const numbers = numStrs.map(str => Number(str)).filter(num => !isNaN(num));
		// searchText3.value = numbers.reduce((total, num) => total + num, 0);

		// 1. 去除所有空格，处理如 "3 + 4 - 2" 这类带空格的输入
		const expr = searchText3.value.replace(/\s+/g, '');
		if (!expr) {
			searchText3.value = 0;
			return;
		}

		// 2. 用正则提取数字（支持整数和小数）和运算符（仅 + -）
		// 匹配规则：(\d+\.?\d*) 匹配数字（如 3、4.5）；([+-]) 匹配运算符
		const parts = expr.match(/(\d+\.?\d*)|([+-])/g);
		if (!parts) {
			searchText3.value = '表达式格式错误（仅支持数字和 + -）';
			return;
		}

		// 3. 验证表达式合法性
		// 合法格式：数字+运算符+数字+...+数字（长度为奇数，首尾必须是数字，运算符不能连续）
		if (parts.length % 2 === 0) {
			searchText3.value = '表达式格式错误（首尾必须是数字）';
			return;
		}
		// 检查运算符位置（偶数索引必须是数字，奇数索引必须是 + 或 -）
		for (let i = 0; i < parts.length; i++) {
			if (i % 2 === 0) {
				// 偶数索引：必须是数字
				if (isNaN(Number(parts[i]))) {
					searchText3.value = `无效数字：${parts[i]}`;
					return;
				}
			} else {
				// 奇数索引：必须是 + 或 -
				if (!['+', '-'].includes(parts[i])) {
					searchText3.value = `无效运算符：${parts[i]}（仅支持 + -）`;
					return;
				}
			}
		}

		let result = Number(parts[0]);
		for (let i = 1; i < parts.length; i += 2) {
			const operator = parts[i];
			const num = Number(parts[i + 1]);
			if (operator === '+') {
				result += num;
			} else {
				result -= num;
			}
		}
		searchText3.value = result;
	};

	const router = useRouter();
	const route = useRoute();

	const menuList = [
		{
			name: '动态监测',
			path: '/dynamicMonitor',
			hasSubMenu: false
		},
		{
			name: '综合评估',
			path: '/integratedAssessment',
			hasSubMenu: false
		},
		{
			name: '推演引擎',
			path: '/timeSpaceRadar',
			hasSubMenu: true,
			showSubMenu: false,
			subMenuItems: [
				{ name: '指标概览', path: '/deductionEngine' },
				{ name: '总规推演', path: '/futureMirror' },
				{ name: '预演工坊', path: '/planningSandbox' },
			]
		},
		{
			name: '预警雷达',
			path: '/decisionTheater',
			hasSubMenu: true,
			showSubMenu: false,
			subMenuItems: [
				{ name: '城市雷达', path: '/citySpaceRadar' },
				{ name: '场景预判', path: '/projectComparison' }
			]
		}
	];
	const menuIdx = ref(0);
	const activeSubMenuIndex = ref({}); // 存储每个菜单的激活子菜单索引

	//监听路由
	watch(
		() => route.path,
		newPath => {
			// 先检查主菜单路径
			let found = false;
			menuList.forEach((item, index) => {
				// 检查主菜单路径
				if (item.path === newPath) {
					activeSubMenuIndex.value = {};
					menuIdx.value = index;
					found = true;
					return;
				}
				// 检查子菜单路径
				if (item.hasSubMenu && item.subMenuItems) {
					item.subMenuItems.forEach((subItem, subIndex) => {
						if (subItem.path === newPath) {
							activeSubMenuIndex.value = {};
							menuIdx.value = index;
							// 更新子菜单激活状态
							activeSubMenuIndex.value[index] = subIndex;
							found = true;
							return;
						}
					});
				}
			});
		},
		{ immediate: true }
	);
	onMounted(() => {
		const localToken = localStorage.getItem('token');
		if (!localToken) {
			router.push('/login');
			return;
		}
		// 如果当前路径是根路径，跳转到动态监测模块
		if (route.path === '/') {
			router.push('/dynamicMonitor');
		}
	});

const menuClickHandle = (item, index) => {
		console.log('item',item)
		console.log('index',index)
		if (item.hasSubMenu) return;
		menuIdx.value = index;
		router.push(item.path);
		window.scrollTo(0, 0);
	};

	const menuHoverHandle = item => {
		item.showSubMenu = true;
	};

	const menuLeaveHandle = item => {
		item.showSubMenu = false;
	};

	// 获取子菜单激活样式
	const getActiveSubMenuStyle = (menuIndex, subIndex) => {
		return activeSubMenuIndex.value[menuIndex] === subIndex;
	};

	// 计算子菜单背景高度
	// 每个子菜单项高度32px，每个项之间的间距12px（第一个项也有12px的margin-top）
	// 总高度 = 32px * n + 12px * n = 44px * n
	const calculateSubMenuHeight = (subMenuCount) => {
		if (!subMenuCount || subMenuCount === 0) return 100; // 默认高度
		// 每个项目：32px高度 + 12px上边距 = 44px
		return subMenuCount * 44 + 12;
	};

	// 通用子菜单点击处理函数
	const subMenuItemClickHandle = (menuItem, subItem, menuIndex, subIndex) => {
		// 设置激活的子菜单索引
		activeSubMenuIndex.value[menuIndex] = subIndex;
		// 设置当前菜单索引
		menuIdx.value = menuIndex;
		// 隐藏当前展开的子菜单
		menuItem.showSubMenu = false;
		// 跳转到子菜单路径
		router.push(subItem.path);
		window.scrollTo(0, 0);
	};

	const currentTime = ref('');
	const currentTime2 = ref('');
	// 格式化函数
	function formatDate(date) {
		const y = date.getFullYear();
		const M = String(date.getMonth() + 1).padStart(2, '0');
		const d = String(date.getDate()).padStart(2, '0');
		const h = String(date.getHours()).padStart(2, '0');
		const m = String(date.getMinutes()).padStart(2, '0');
		const s = String(date.getSeconds()).padStart(2, '0');
		// return `${y}-${M}-${d} ${h}:${m}:${s}`;
		return {
			date: `${y}-${M}-${d}`,
			time: `${h}:${m}:${s}`
		};
	}
	let timer = null;

	onMounted(() => {
		const { date, time } = formatDate(new Date());
		currentTime.value = date;
		currentTime2.value = time;
		timer = setInterval(() => {
			const { date, time } = formatDate(new Date());
			currentTime.value = date;
			currentTime2.value = time;
		}, 200);
	});
	onBeforeUnmount(() => {
		if (timer) clearInterval(timer);
	});
</script>

<style scoped lang="scss">
	.header {
		background-image: url('@/assets/img/headerBg.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center center;
		box-sizing: border-box;
	}
	.title {
		font-family: 'YouSheBiaoTiHei';
		font-weight: 400;
		font-size: 2.75rem;
		height: 4.125rem;
		padding-top: 0.5rem;
		letter-spacing: 1px;
		text-align: justify;
		background: linear-gradient(
			180deg,
			#edf6ff 0%,
			#e5f2fe 27.5%,
			#63d8ff 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		text-shadow: 0px 8px 8px rgba(0, 0, 0, 0.3);
	}

	.appContainer {
		height: calc(100vh - 6.75rem);
	}

	.menuList {
		z-index: 99;
		li {
			font-family: 'YouSheBiaoTiHei';
			font-weight: 400;
			font-size: 24px;
			line-height: 31.2px;
			letter-spacing: 0px;
			padding-top: 6px;
			width: 153px;
			height: 64px;
			color: #fff;
			cursor: pointer;
			&:not(:last-child) {
				margin-right: 8px;
			}
			& .imgBox {
				width: 44px;
				height: 38px;
				& .img {
					position: absolute;
					top: 0px;
				}
				& .img0 {
					left: 12px;
				}
				& .img1 {
					top: -2px;
					left: 6px;
				}
				& .img2 {
					top: -4px;
					left: 10px;
				}
				& .img3 {
					top: -8px;
					left: 10px;
				}
				& .img4 {
					top: -6px;
					left: 12px;
					width: 31px;
					height: 36px;
				}
			}
			&:before {
				content: '';
				position: absolute;
				bottom: 0;
				left: 0;
				width: 153px;
				height: 64px;
				background-image: url('@/assets/img/nav.png');
				background-size: 153px 64px, 28px 32px;
				background-position: center center, 12px top;
				background-repeat: no-repeat;
			}
			&.active {
				color: rgba(245, 231, 79, 1);
				&:before {
					background-image: url('@/assets/img/nav-active.png');
				}
			}
			.menuHover {
				position: absolute;
				width: 120px;
				top: 60px;
				left: 20px;
				background: url('@/assets/img/tabBg.png') no-repeat center center;
				background-size: 100% 100%;
				background-repeat: no-repeat;
				background-position: center center;
				z-index: 100;
				cursor: pointer;
				.menuHoverItem {
					font-size: 14px;
					font-family: 'YouSheBiaoTiHei';
					color: rgba(171, 223, 255, 1);
					text-align: center;
					width: 96px;
					height: 32px;
					margin: 0 auto;
					background-size: 100% 100%;
					background-repeat: no-repeat;
					background-position: center center;
					margin-top: 12px;
					cursor: pointer;
					display: flex;
					align-items: center;
					justify-content: center;
					transition: all 0.2s ease;
					&:hover,
					&.active {
						color: rgba(245, 231, 79, 1);
					}
				}
			}
		}
	}
	.headerInfo {
		display: flex;
		align-items: center;
		.headerInfoTime {
			margin-right: 30px;
			.headerInfoTimeTitle {
				font-size: 10px;
				font-weight: 400;
				color: rgba(171, 223, 255, 1);
			}
			.headerInfoTimeValue {
				font-size: 14px;
				font-weight: 400;
				color: rgba(171, 223, 255, 1);
			}
		}
	}
</style>
