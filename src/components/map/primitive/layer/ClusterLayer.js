import OLAnimatedCluster from "ol-ext/layer/AnimatedCluster";
import OLVectorSource from "ol/source/Vector";
import OLClusterSource from "ol/source/Cluster";
import OLEsriJSON from "ol/format/EsriJSON";
import OLGeoJSON from "ol/format/GeoJSON";
import GeoJSONUtil from "../util/GeojsonUtil";
import { buildOLStyle } from "../style/Style";
import { LayerType } from "./Layer";

export class ClusterLayer {
  constructor(option, olLyr) {
    this.innerOption = option;
    this.innerLyr = olLyr;
  }

  innerOption = null;
  innerLyr = null;

  //这里做约束必须具有这个属性
  get type() {
    return LayerType.Cluster;
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
    return buildClusterLayer(this.innerOption);
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

  clear() {
    this.innerLyr.getSource().getSource().clear();
  }

  add(geojson) {
    this.innerLyr.getSource().getSource().addFeatures(GeoJSONUtil.readFeatures(geojson));
  }
  
  setDistance(distance) {
    this.innerLyr.getSource().setDistance(distance);
  }
}

// lyrOption 参数
// name: string 图层名称
// distance?: number 点聚合距离
// animation?: boolean 是否动态聚合
// geojson?: geojson 初始化数据
// clusterStyle: StyleLike 点聚合样式
// pointStyle: StyleLike 单点样式
// zIndex?: number	图层层级
export function buildClusterLayer(lyrOption) {
  let styleFn = (olFeature, style) => {
    if (style instanceof Function) {
      let feature = GeoJSONUtil.writeFeatureObject(olFeature);
      return buildOLStyle(style(feature))
    } else {
      return buildOLStyle(style)
    }
  }
  let sourOptions = null;
  if (lyrOption.url) {
    sourOptions = {
      format: new OLGeoJSON(),
      url: lyrOption.url,
    };
  }
  let source = new OLVectorSource(sourOptions);
  let layer = new OLAnimatedCluster({
    source: new OLClusterSource({
      distance: lyrOption?.distance || 40,
      source: source,
    }),
    animationDuration: lyrOption?.animation ? 700 : 0,
    style: (feature) => {
      if (feature.get("features").length > 1) {
        return styleFn(feature, lyrOption.clusterStyle);
      } else {
        return styleFn(feature, lyrOption.pointStyle);
      }
    },
    zIndex: lyrOption.hasOwnProperty("zIndex") ? lyrOption.zIndex : -100,
  });
  if (lyrOption?.geojson) {
    if (lyrOption.geojson.type == "FeatureCollection") {
      source.addFeatures(GeoJSONUtil.readFeatures(lyrOption.geojson));
    } else {
      source.addFeature(GeoJSONUtil.readFeature(lyrOption.geojson));
    }
  }

  return new ClusterLayer(lyrOption, layer);
}
