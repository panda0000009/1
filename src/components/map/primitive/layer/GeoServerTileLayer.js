import OLTileLayer from 'ol/layer/Tile'
import OLTileWMS from 'ol/source/TileWMS'
import { LayerType } from "./Layer";
import { useProjection } from "../map/effect"

export class GeoServerTileLayer {
  constructor(option, olLyr) {
    this.innerOption = option
    this.innerLyr = olLyr
  }

  innerOption = null
  innerLyr = null

  //这里做约束必须具有这个属性
  get type() {
    return LayerType.GeoServerTile;
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
    return buildGeoServerTileLayer(this.innerOption)
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

export function buildGeoServerTileLayer(lyrOption) {
  if (lyrOption?.projection) {
    lyrOption.projection = useProjection(lyrOption.projection);
  }
  let lyr = new OLTileLayer({
    preload: Infinity,
    source: new OLTileWMS({
      url: lyrOption.url,
      crossOrigin: 'anonymous',
      // projection: lyrOption?.projection || undefined,
      tileLoadFunction: lyrOption?.tileLoadFunction,
      params: Object.assign({
        CQL_FILTER: lyrOption?.filter || undefined,
        FORMAT: 'image/png', 
        VERSION: '1.1.1',
        tiled: true,
        STYLES: lyrOption?.styles?.join(",") || '',
        LAYERS: Array.isArray(lyrOption.layers) ? lyrOption.layers.join(",") : lyrOption.layers,
        exceptions: 'application/vnd.ogc.se_inimage',
        tilesOrigin: lyrOption.origin[0] + "," + lyrOption.origin[1]   // minX,minY
      }, lyrOption.params)
    }),
    zIndex: lyrOption.hasOwnProperty('zIndex')
      ? lyrOption.zIndex
      : -100,
  })
  return new GeoServerTileLayer(lyrOption, lyr)
}

