import OLHeatmapLayer from "ol/layer/Heatmap";
import OLVectorSource from "ol/source/Vector";
import OLGeoJSON from "ol/format/GeoJSON";
import { LayerType } from "./Layer";
import GeoJSONUtil from "../util/GeojsonUtil.js";
import { buildStyle } from "../style/Style";

export class HeatmapLayer {
  constructor(option, olLyr) {
    this.innerOption = option;
    this.innerLyr = olLyr;
  }

  innerOption = null;
  innerLyr = null;

  //这里做约束必须具有这个属性
  get type() {
    return LayerType.Heatmap;
  }

  //这里做约束必须具有这个属性
  get ol() {
    return this.innerLyr;
  }

  //这里做约束必须具有这个属性
  get lyrName() {
    return this.innerOption.name;
  }

  //这里做约束必须具有这个属性
  get option() {
    return this.innerOption;
  }

  //这里做约束必须具有这个方法
  clone() {
    return buildHeatmapLayer(this.innerOption);
  }

  //这里做约束必须具有这个方法
  setVisible(isVisible) {
    this.innerLyr.setVisible(isVisible);
  }

  //这里做约束必须具有这个方法
  setOpacity(opacity) {
    this.innerLyr.setOpacity(opacity);
  }

  //这里做约束必须具有这个方法
  setZIndex(zIndex) {
    this.innerLyr.setZIndex(zIndex);
  }
  
  setBlur(blur) {
    this.innerLyr.setBlur(blur);
  }

  setRadius(radius) {
    this.innerLyr.setRadius(radius);
  }

  clear() {
    this.innerLyr.getSource().clear();
  }

  draw(geoJSON) {
    if (geoJSON.type == "FeatureCollection") {
      this.innerLyr.getSource().addFeatures(GeoJSONUtil.readFeatures(geoJSON));
    } else {
      this.innerLyr.getSource().addFeature(GeoJSONUtil.readFeature(geoJSON));
    }
  }

  isAuto(flag, map) {
    this.innerOption.map = map;
    if (flag) {
      map.olMap.on("moveend", this.moveendHandler.bind(this));
    } else {
      map.olMap.un("moveend", this.moveendHandler.bind(this));
    }
  }

  moveendHandler() {
    let zoom = this.innerOption.map.olView.getZoom();
    let radius = this.getRadius(zoom);
    this.innerLyr.setRadius(radius[0]);
    this.innerLyr.setBlur(radius[1]);
  }

  getRadius(zoom) {
    switch (true) {
      case zoom >= 19:
        return [50, 50];
      case zoom >= 18 && zoom < 19:
        return [45, 45];
      case zoom >= 17 && zoom < 18:
        return [40, 40];
      case zoom >= 16 && zoom < 17:
        return [35, 35];
      case zoom >= 15 && zoom < 16:
        return [32, 32];
      case zoom >= 14 && zoom < 15:
        return [30, 30];
      case zoom >= 13 && zoom < 14:
        return [25, 25];
      case zoom >= 11 && zoom < 13:
        return [20, 20];
      case zoom >= 9 && zoom < 11:
        return [15, 15];
      case zoom >= 6 && zoom < 9:
        return [10, 10];
      case zoom >= 3 && zoom < 6:
        return [1, 1];
      case zoom < 4:
        return [0, 0];
      default:
        return [15, 17];
    }
  }
}

// lyrOption 参数
// url?: string,
// geoJSON?: GeoJSON | null,
// style?: StyleLike,
// blur: number,  1-50
// radius: number,  1-50
// weight: string | ((feature: OLFeature) => number)
export function buildHeatmapLayer(lyrOption) {
  let sourOptions = {};
  if (lyrOption?.url) {
    sourOptions = {
      format: GeoJSONUtil,
      url: lyrOption.url,
    };
  }
  let source = new OLVectorSource(sourOptions);
  if (lyrOption.geoJSON) {
    let features = GeoJSONUtil.readFeatures(lyrOption.geoJSON);
    source.addFeatures(features);
  }
  let layer = new OLHeatmapLayer({
    source: source,
    blur: lyrOption.blur,
    radius: lyrOption.radius,
    weight: (feature) => {
      if (lyrOption.weight instanceof Function) {
        let featureGeoJSON = GeoJSONUtil.writeFeatureObject(feature);
        return lyrOption.weight(featureGeoJSON);
      } else {
        return feature.getProperties().weight;
      }
    }
  });

  if (sourOptions.style) {
    let olStyle = buildStyle(sourOptions.style);
    layer.setStyle(olStyle);
  }
  return new HeatmapLayer(lyrOption, layer);
}
