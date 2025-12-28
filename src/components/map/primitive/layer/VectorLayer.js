import OLVectorLayer from "ol/layer/Vector";
import OLVectorSource from "ol/source/Vector";
import OLGeoJSON from "ol/format/GeoJSON";
import OLEsriJSON from "ol/format/EsriJSON";
import GeoJSONUtil from "../util/GeojsonUtil.js";
import { buildStyle } from "../style/Style";
import { LayerType } from "./Layer";

export class VectorLayer {
  constructor(option, olLyr) {
    this.innerOption = option;
    this.innerLyr = olLyr;
  }

  innerOption = null;
  innerLyr = null;

  //这里做约束必须具有这个属性
  get type() {
    return LayerType.Vector;
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
    let lyr = buildVectorLayer(this.innerOption);
    let geojson = GeoJSONUtil.writeFeaturesObject(this.ol.getSource().getFeatures());
    lyr.add(geojson);
    return lyr;
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
    this.innerLyr.getSource().clear();
  }

  add(geojson) {
    this.innerLyr.getSource().addFeatures(new OLGeoJSON().readFeatures(geojson));
  }
}

export function buildVectorLayer(lyrOptions) {
  let sourOptions = null;
  if (lyrOptions.url) {
    sourOptions = {
      format: new OLGeoJSON(),
      url: lyrOptions.url,
    };
  }
  let source = new OLVectorSource(sourOptions);
  if (lyrOptions.geojson) {
    source.addFeatures(new OLGeoJSON().readFeatures(lyrOptions.geojson));
  }
  let layerOptions = {
    source: source,
    zIndex: "zIndex" in lyrOptions ? lyrOptions.zIndex : undefined,
  };

  // 支持 updateWhileAnimating 和 updateWhileInteracting 选项（用于性能优化）
  if (lyrOptions.updateWhileAnimating !== undefined) {
    layerOptions.updateWhileAnimating = lyrOptions.updateWhileAnimating;
  }
  if (lyrOptions.updateWhileInteracting !== undefined) {
    layerOptions.updateWhileInteracting = lyrOptions.updateWhileInteracting;
  }

  let layer = new OLVectorLayer(layerOptions);
  if (lyrOptions.lyrStyle) {
    layer.setStyle(buildStyle(lyrOptions.lyrStyle));
  }
  return new VectorLayer(lyrOptions, layer);
}
