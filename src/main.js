import { createApp } from 'vue';
import { createPinia } from 'pinia';
import '@/assets/css/reset.css';
import '@/assets/css/fonts/fonts.css';
import '@/assets/css/style.css';
import '@/assets/css/index.scss';
import App from './App.vue';
import store from './stores';
import router from './router';
import '@/utils/rem.js';
import 'uno.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// 全局错误处理
window.addEventListener('error', event => {
	console.error('全局错误捕获:', event.error);
	// 防止地图相关错误导致页面崩溃
	if (
		event.error &&
		event.error.message &&
		event.error.message.includes('map')
	) {
		event.preventDefault();
		console.error('地图相关错误已捕获并阻止:', event.error);
	}
});

window.addEventListener('unhandledrejection', event => {
	console.error('未处理的 Promise 拒绝:', event.reason);
	// 防止地图相关的 Promise 错误导致页面崩溃
	if (
		event.reason &&
		event.reason.message &&
		event.reason.message.includes('map')
	) {
		event.preventDefault();
		console.error('地图相关 Promise 错误已捕获并阻止:', event.reason);
	}
});

import Layout from '@/components/Layout.vue';
import Title from '@/components/title/index.vue';
import SecondTile from '@/components/title/secondTile.vue';
import ListsCom from '@/components/lists/index.vue';
import IconTitle from '@/components/iconTitle.vue';
import CustomSelect from '@/components/CustomSelect.vue';
import DbTableHeader from '@/components/dbTableHeader.vue';
import Diamond from '@/components/title/diamond.vue';
import Arrowhead from '@/components/title/arrowhead.vue';
import SummaryCom from '@/components/summary.vue';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(store);
app.use(ElementPlus);

app.component('Layout', Layout);
app.component('SecondTile', SecondTile);
app.component('Title', Title);
app.component('ListsCom', ListsCom);
app.component('IconTitle', IconTitle);
app.component('Diamond', Diamond);
app.component('Arrowhead', Arrowhead);
app.component('CustomSelect', CustomSelect);
app.component('DbTableHeader', DbTableHeader);
app.component('SummaryCom', SummaryCom);

app.mount('#app');
