import OLImageLayer from 'ol/layer/Image'
import OLImageWMS from 'ol/source/ImageWMS'
import { LayerType } from "./Layer";
import { useProjection } from "../map/effect"

export class GeoServerImageLayer {
  constructor(option, olLyr) {
    this.innerOption = option
    this.innerLyr = olLyr
  }

  innerOption = null
  innerLyr = null

  //这里做约束必须具有这个属性
  get type() {
    return LayerType.GeoServerImage;
  }

  //这里做约束必须具有这个属性
  get ol() {
    return this.innerLyr
  }

  //这里做约束必须具有这个属性
  get lyrName() {
    return this.innerOption.name
  }

  //这里做约束必须具有这个属性
  get option() {
    return this.innerOption
  }

  //这里做约束必须具有这个方法
  clone() {
    return buildGeoServerImageLayer(this.innerOption)
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

export function buildGeoServerImageLayer(lyrOption) {
  if (lyrOption?.projection) {
    lyrOption.projection = useProjection(lyrOption.projection);
  }
  let lyr = new OLImageLayer({
    source: new OLImageWMS({
      url: lyrOption.url,
      crossOrigin: 'anonymous',
      ratio: 1,
      // projection: lyrOption?.projection || undefined,
      imageLoadFunction: lyrOption?.imageLoadFunction,
      params: Object.assign({
        CQL_FILTER: lyrOption?.filter || undefined,
        FORMAT: 'image/png', 
        VERSION: '1.1.1',
        STYLES: lyrOption?.styles?.join(",") || '',
        LAYERS: Array.isArray(lyrOption.layers) ? lyrOption.layers.join(",") : lyrOption.layers,
        exceptions: 'application/vnd.ogc.se_inimage',
      }, lyrOption.params)
    }),
    zIndex: lyrOption.hasOwnProperty('zIndex') ? lyrOption.zIndex : -100,
  })
  return new GeoServerImageLayer(lyrOption, lyr)
}

