import OLTileLayer from 'ol/layer/Tile'
import OLXYZ from 'ol/source/XYZ'
import OLTileGrid from 'ol/tilegrid/TileGrid'
import { LayerType } from "./Layer";
import { useProjection } from "../map/effect"

export class ArcGISTileLayer {
  constructor(option, olLyr) {
    this.innerOption = option
    this.innerLyr = olLyr
  }

  innerOption = null
  innerLyr = null

  //这里做约束必须具有这个属性
  get type() {
    return LayerType.ArcGISTile;
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
    return buildArcGISTileLayer(this.innerOption)
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

// lyrOption is { tileSize, origin, resolutions, projection, url, zIndex, extent }
export function buildArcGISTileLayer(lyrOption) {
  if (lyrOption?.projection) {
    lyrOption.projection = useProjection(lyrOption.projection);
  }
  let lyr = new OLTileLayer({
    preload: Infinity,
    source: new OLXYZ({
      tileGrid: new OLTileGrid({
        tileSize: lyrOption?.tileSize || 256,
        origin: lyrOption.origin,
        extent: lyrOption?.extent,
        resolutions: lyrOption.resolutions,
      }),
      projection: lyrOption.projection,
      url: lyrOption.url + '/tile/{z}/{y}/{x}',
      crossOrigin: 'anonymous',
    }),
    zIndex: lyrOption.hasOwnProperty('zIndex')
      ? lyrOption.zIndex
      : -100,
  })
  return new ArcGISTileLayer(lyrOption, lyr)
}

