import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/utils/auth.js'

const deductionEngine = () => import('@/views/DeductionEngine/Index.vue')
const futureMirror = () => import('@/views/FutureMirror/Index.vue')
// const dynamicMonitor = () => import('@/views/DynamicMonitor/Index.vue')
// 在 src/router/index.js 中临时修改
const dynamicMonitor = () => import('@/views/DynamicMonitor/IndexNew.vue')
const timeSpaceRadar = () => import('@/views/TimeSpaceRadar/Index.vue')
const citySpaceRadar = () => import('@/views/citySpaceRadar/Index.vue')
const integratedAssessment = () => import('@/views/IntegratedAssessment/Index.vue')
const majorProject = () => import('@/views/DecisionTheater/majorProject.vue')
const projectComparison = () => import('@/views/DecisionTheater/projectComparison.vue')
const simulationWorkshop = () => import('@/views/SimulationWorkshop/Index.vue')
const policyEffectLab = () => import('@/views/SimulationWorkshop/PolicyEffectLab.vue')
const planningSandbox = () => import('@/views/SimulationWorkshop/PlanningSandbox.vue')
const login = () => import('@/views/login/index.vue')

const routes = [
	{
		path: '/',
		name: 'Home',
		component: () => import('@/views/home/index.vue'),
		redirect: '/dynamicMonitor',
		children: [
			{
				path: '/dynamicMonitor',
				name: 'DynamicMonitor',
				component: dynamicMonitor,
				meta: { title: '动态监测' }
			},
			{
				path: '/integratedAssessment',
				name: 'IntegratedAssessment',
				component: integratedAssessment,
				meta: { title: '综合评估' }
			},
			{
				path: '/deductionEngine',
				name: 'DeductionEngine',
				component: deductionEngine,
				meta: { title: '推演引擎' }
			},
			{
				path: '/futureMirror',
				name: 'FutureMirror',
				component: futureMirror,
				meta: { title: '未来魔镜' }
			},
			{
				path: '/timeSpaceRadar',
				name: 'TimeSpaceRadar',
				component: timeSpaceRadar,
				meta: { title: '规划预警雷达' }
			},
			{
				path: '/citySpaceRadar',
				name: 'CitySpaceRadar',
				component: citySpaceRadar,
				meta: { title: '城市预警雷达' }
			},
			{
				path: '/majorProject',
				name: 'majorProject',
				component: majorProject,
				meta: { title: '重大项目剧场' }
			},
			{
				path: '/projectComparison',
				name: 'ProjectComparison',
				component: projectComparison,
				meta: { title: '项目对比剧场' }
			},
			{
				path: '/simulationWorkshop',
				name: 'SimulationWorkshop',
				component: simulationWorkshop,
				meta: { title: '模拟工坊' }
			},
			{
				path: '/policyEffectLab',
				name: 'PolicyEffectLab',
				component: policyEffectLab,
				meta: { title: '政策效果实验室' }
			},
			{
				path: '/planningSandbox',
				name: 'PlanningSandbox',
				component: planningSandbox,
				meta: { title: '规划方案大沙盘' }
			}
		]
	},
	{
		path: '/login',
		name: 'Login',
		component: login,
		meta: { title: '登录' }
	}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const baseTitle = '广州市国土空间规划评估监测推演平台'
  if (to.meta.title) {
    document.title = `${baseTitle} - ${to.meta.title}`
  } else {
    document.title = baseTitle
  }
  next()
  // const token = getToken() ? true : false
  // if (['/', '/login'].includes(to.path)) {
  //   next()
  // } else {
  //   token ? next() : next('/login')
  // }
})
export default router
