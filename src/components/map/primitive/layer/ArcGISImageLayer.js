import { Image as ImageLayer } from "ol/layer.js";
import { ImageArcGISRest } from "ol/source.js";
import { LayerType } from "./Layer";
import { useProjection } from "../map/effect"

export class ArcGISImageLayer {
  constructor(option, olLyr) {
    this.innerOption = option;
    this.innerLyr = olLyr;
  }

  innerOption = null;
  innerLyr = null;

  //这里做约束必须具有这个属性
  get type() {
    return LayerType.ArcGISImage;
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
    return buildArcGISImageLayer(this.innerOption);
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

}

export function buildArcGISImageLayer(lyrOption) {
  if (lyrOption?.projection) {
    lyrOption.projection = useProjection(lyrOption.projection);
  }
  let lyr = new ImageLayer({
    source: new ImageArcGISRest({
      ratio: 1.5,
      params: lyrOption?.params || {},
      url: lyrOption.url,
      imageLoadFunction: lyrOption?.imageLoadFunction || undefined,
      projection: lyrOption?.projection || undefined,
      resolutions: lyrOption?.resolutions || undefined,
      crossOrigin: 'anonymous',
    }),
    zIndex: lyrOption.hasOwnProperty("zIndex") ? lyrOption.zIndex : -100,
  });
  return new ArcGISImageLayer(lyrOption, lyr);
}
