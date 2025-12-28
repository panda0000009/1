import request from '@/utils/request';

const prefix5 = '/web-citysps-authentication/web/citysps/authentication';
const prefix6 = '/web-citysps-common/web/citysps/common';
const prefix7 = '/web-citysps-shp/web/citysps/shp';
// 用户相关 API
export function userApi() {
	return {
		// 用户登录认证及用户信息和token生成接口
		login: data => {
			const { yzm, requestCode, password, username } = data;
			return request({
				url: prefix5 + '/user/verify/login',
				method: 'post',
				data: { password, username },
				headers: {
					yzm,
					requestCode
				}
			});
		},
		// 根据角色ID获取对应用户信息接口
		roleId: params => {
			return request({
				url: prefix5 + '/user/verify/querybyroleid',
				method: 'get',
				params
			});
		},
		// 获取新token
		refreshToken: params => {
			return request({
				url: prefix5 + '/user/verify/refreshToken',
				method: 'get',
				params
			});
		},
		// 获取校验码接口
		checkCode: ({ requestCode }) => {
			return request({
				url: prefix6 + '/checkcode/generate?requestCode=' + requestCode,
				method: 'post',
				responseType: 'blob'
			});
		}
	};
}

// 其他 API
export const commonApi = {
	// 获取列表数据
	getList(params) {
		return request.get('/list', { params });
	}
};

const prefix = '/web-citysps-monitor/web/citysps/monitor/indicator/cityspsdata';
const prefix2 = '/web-citysps-monitor/web/citysps/monitor/indicator';
const prefix3 = '/web-citysps-monitor/web/citysps/monitor/project';
const prefix4 = '/web-citysps-monitor/web/citysps/monitor/scheme';

const cityDeductionApi = {
	// SHP文件上传接口
	singleUpload: data => {
		return request({
			url: '/zuul' + prefix7 + '/file/singleUpload',
			method: 'post',
			data
		});
	},
	// 方案保存或新增接口
	schemeAdd: data => {
		return request({ url: prefix4 + '/add', method: 'post', data });
	},
	// 方案删除接口
	schemeDelete: params => {
		return request({ url: prefix4 + '/delete', method: 'get', params });
	},
	// 根据ID获取方案信息接口
	schemeGetById: params => {
		return request({ url: prefix4 + '/getById', method: 'get', params });
	},
	// 城市推演算法与方案绑定接口
	schemeBindMethod: data => {
		return request({ url: prefix4 + '/method/bind', method: 'post', data });
	},
	// 根据方案ID查询绑定的城市推演算法接口
	schemeBindMethodQuery: params => {
		return request({ url: prefix4 + '/method/query', method: 'get', params });
	},
	// 根据绑定关系ID对算法与方案进行解绑接口
	schemeBindMethodUnbind: params => {
		return request({ url: prefix4 + '/method/unbind', method: 'get', params });
	},
	// 方案列表分页查询接口
	schemeQueryWithPage: data => {
		return request({ url: prefix4 + '/queryWithPage', method: 'post', data });
	},
	// 方案更新接口
	schemeUpdate: data => {
		return request({ url: prefix4 + '/update', method: 'post', data });
	},

	// 新建城市推演子项目信息保存接口
	projectChildBuild: data => {
		return request({ url: prefix3 + '/child/build', method: 'post', data });
	},
	// 新建城市推演项目信息保存接口
	projectBuild: data => {
		return request({ url: prefix3 + '/build', method: 'post', data });
	},
	// 城市推演项目运行中止及重启接口
	onOff: data => {
		return request({ url: prefix3 + '/onoff', method: 'post', data });
	},
	// 城市推演子项目运行中止及重启接口
	childOnOff: data => {
		return request({ url: prefix3 + '/child/onoff', method: 'post', data });
	},
	// 删除城市推演项目接口
	projectDelete: params => {
		return request({ url: prefix3 + '/delete', method: 'get', params });
	},
	// 根据项目id查询项目的执行进度信息接口
	projectChildProgressQuery: params => {
		return request({
			url: prefix3 + '/child/progress/query',
			method: 'get',
			params
		});
	},
	// 根据项目id查询项目的执行进度信息接口
	projectProgressQuery: params => {
		return request({ url: prefix3 + '/progress/query', method: 'get', params });
	},
	// 根据项目id获取推演项目及子推演项目详情信息接口
	projectDetailQuery: params => {
		return request({ url: prefix3 + '/queryDetail', method: 'get', params });
	},
	// 根据筛选条件进行批量分页查询城市推演项目记录信息接口
	projectQueryWithPage: data => {
		return request({ url: prefix3 + '/queryWithPage', method: 'post', data });
	},

	// 指标分类保存或新增接口
	catalogAdd: data => {
		return request({ url: prefix2 + '/catalog/add', method: 'post', data });
	},
	// 指标与分类目录绑定接口
	catalogBind: data => {
		return request({ url: prefix2 + '/catalog/bind', method: 'post', data });
	},
	// 指标分类删除接口
	catalogDelete: params => {
		return request({ url: prefix2 + '/catalog/delete', method: 'get', params });
	},
	// 启用或禁用指标根分类目录接口
	catalogEnable: data => {
		return request({ url: prefix2 + '/catalog/enable', method: 'post', data });
	},
	// 根据ID获取指标分类及树信息接口
	catalogGetById: params => {
		return request({
			url: prefix2 + '/catalog/getById',
			method: 'get',
			params
		});
	},
	// 指标系数因子指标信息查询接口
	coefficientGetFactors: params => {
		return request({
			url: prefix2 + '/coefficient/getfactors',
			method: 'get',
			params
		});
	},
	// 指标分类根目录列表分页查询接口
	catalogQueryWithPage: data => {
		return request({
			url: prefix2 + '/catalog/queryWithPage',
			method: 'post',
			data
		});
	},
	// 指标与分类目录解绑接口
	catalogUnbind: params => {
		return request({ url: prefix2 + '/catalog/unbind', method: 'get', params });
	},
	// 指标分类更新接口
	catalogUpdate: data => {
		return request({ url: prefix2 + '/catalog/update', method: 'post', data });
	},

	// 城市推演未来魔镜数据查询统计接口
	mirrorStatistic(data) {
		return request.post(`${prefix}/mirror/statistic`, data);
	},
	// 城市推演结果数据统计接口
	resultQuery(data) {
		return request.post(`${prefix}/result/query`, data);
	},
	// --最后二个模块使用
	commonStatistic(data) {
		return request.post(`${prefix}/common/statistic`, data);
	},
	// 城市推演结果数据统计接口
	comparedStatistic(data) {
		// return request.post(`${prefix}/result/query`, data);
		return request.post(`${prefix}/compared/statistic`, data);
	},
	// 模拟工坊政策效果实验室查询统计接口
	policyeffectStatistic(data) {
		return request.post(`${prefix}/policyeffect/statistic`, data);
	},
	// 城市推演结果指标树统计接口(拓扑树)
	resultTree(data) {
		return request.post(`${prefix}/result/tree`, data);
	},

	// 批量查询行政区并以树状机构返回的接口
	regionTree: params => {
		return request({ url: prefix6 + '/region/tree', method: 'get', params });
	},
	// 查询shp文件全量属性记录信息接口（含几何图形）
	getTotalProperties: data => {
		return request.post(`${prefix7}/data/getTotalProperties`, data);
	},
	// 字典项查询接口
	getMdDictDetailQuery: params => {
		return request({ url: prefix6 + '/dict/detail/query', method: 'get', params });
	},
};
export default cityDeductionApi;
