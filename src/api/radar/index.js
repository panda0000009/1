import request from '@/utils/request';

const prefix1 =
	'/web-citysps-monitor/web/citysps/monitor/indicator/cityspsdata/radar';

// 用户相关 API
export function radarApi() {
	return {
		// 城市推演时空雷达数据查询统计接口
		radarStatistic: data => {
			return request({
				url: prefix1 + '/statistic',
				method: 'post',
				data
			});
		}
	};
}
