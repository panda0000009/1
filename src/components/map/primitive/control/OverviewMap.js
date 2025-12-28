
import * as turf from '@turf/turf';
import OLOverviewMap from 'ol-ext/control/Overview.js'
import { buildStyle } from '../style/Style';
import { BASE_LAYER_NAME, SYSTEM_LAYERS } from '../config/LayerConstantConfig';

export default class OverviewMap {

  // option: object 具体配置如下
  // {
  //   projection: object, // 读取系统当前坐标投影(必传)
  //   layers: [],
  //   minZoom: number,
  //   maxZoom: number,
  //   rotation: boolean,
  //   align: string,
  //   panAnimation: boolean,
  //   target: element,
  //   style: object,
  // }  
  constructor(option) {
    this.innerOption = Object.assign({
      minZoom: 1,
      maxZoom: 19,
      rotation: true,
      align: PositionAlign.BottomRight,
      panAnimation: "elastic",
      // target: element,
      style: buildStyle({
        stroke: {
          width: 3,
          color: "rgba(255,0,102,1)",
          lineDash: [5, 5]
        }
      }),
    }, option);
    this.ctrlTool = new OLOverviewMap(this.innerOption);
  }

  innerOption = null;
  ctrlTool = null;

  //这里做约束必须具有这个属性
  get name() {
    return "OverviewMap";
  }

  //这里做约束必须具有这个属性
  get option() {
    return this.innerOption;
  }

  setMap(map) {
    map.ctrlManager.removeControl(this.name);
    this.removeLayers();
    map.ctrlManager.addControl(this.name, { ol: this.ctrlTool });
    let innerLyr = this.ctrlTool.getOverviewMap().getLayers().getArray().find(lyr => {
      return lyr?.get("name") == 'Cache extent';
    })
    if (innerLyr) {
      innerLyr.setZIndex(999);
    }
    map.layers.forEach(lyr => {
      if (SYSTEM_LAYERS.includes(lyr.lyrName) && lyr.lyrName != BASE_LAYER_NAME) {
        return;
      }
      let cloneLyr = lyr.layer.clone();
      if (lyr.lyrName == BASE_LAYER_NAME) {
        cloneLyr.ol.set("name", BASE_LAYER_NAME);
      }
      this.ctrlTool.getOverviewMap().addLayer(cloneLyr.ol);
    })
  }

  addLayer(name, layer) {
    if (layer) {
      layer.ol.set("name", name);
      this.ctrlTool.getOverviewMap().addLayer(layer.ol);
    }
  }

  removeLayers() {
    if (this.ctrlTool.getOverviewMap()) {
      // 'Cache extent' 为内置图层不要删除
      let lyrs = this.ctrlTool.getOverviewMap().getLayers().getArray().filter(lyr => {
        return [BASE_LAYER_NAME, 'Cache extent'].includes(lyr?.get("name"));
      })
      this.ctrlTool.getOverviewMap().setLayers(lyrs)
    }
  }
}

export const PositionAlign = {
  BottomLeft: "bottom-left",
  BottomRight: "bottom-right",
  TopLeft: "top-left",
  TopRight: "top-right"
}
