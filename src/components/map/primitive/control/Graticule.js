import * as turf from '@turf/turf'
import OLGraticule from 'ol-ext/control/Graticule'
import { buildStyle } from '../style/Style'

export class Graticule {
	// option: 可选参数
	//  projection 投影
	//  step 步长
	//  formatCoord 文字格式
	//  border 是否显示边框
	//  grid 显示网格
	//  coord 显示文字
	constructor(option) {
		this.innerOption = this.initOpt(option)
		this.ctrlTool = new OLGraticule(this.innerOption)
	}

	initOpt(option) {
		// 默认以 4326 作为配置项
		let opt = Object.assign(
			{
				step: 0.1,
				stepCoord: 3,
				projection: 'EPSG:4326',
				margin: 2,
				formatCoord: c => {
					return c.toFixed(1) + '°'
				},
				borderWidth: 5,
				style: null
			},
			option
		)

		let gridStyleObj = {}
		// 是否显示边框
		if (option.border) {
			gridStyleObj['fill'] = {
				color: option.grid ? 'white' : 'black'
			}
		}
		// 是否显示网格
		if (option.grid) {
			gridStyleObj['stroke'] = {
				color: 'black',
				width: 1
			}
		}
		// 是否显示文字
		if (option.coord) {
			gridStyleObj['text'] = {
				font: '16px Arial, Helvetica, Helvetica, sans-serif',
				fill: {
					color: 'black'
				},
				stroke: {
					color: 'white',
					width: 2
				}
			}
		}

		if (Object.keys(gridStyleObj).length) {
			opt.style = buildStyle(gridStyleObj)
		}
		return opt
	}

	innerOption = null
	ctrlTool = null

	//这里做约束必须具有这个属性
	get name() {
		return 'Graticule'
	}

	//这里做约束必须具有这个属性
	get option() {
		return this.innerOption
	}

	//这里做约束必须具有这个属性
	get ol() {
		return this.ctrlTool
	}

	setStyle(style) {
		this.ctrlTool.setStyle(buildStyle(style))
	}

	setVisible(isVisible) {
		if (isVisible) {
			this.ctrlTool.setStyle(this.innerOption.style || buildStyle({}))
		} else {
			this.ctrlTool.setStyle(buildStyle({}))
		}
	}
}
