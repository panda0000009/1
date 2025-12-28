import { Tile as OLTile } from 'ol/layer'
import { TileArcGISRest as OLTileArcGISRest } from 'ol/source'
import { LayerType } from "./Layer";

export class ArcGISRestLayer {
  constructor(option, olLyr) {
    this.innerOption = option
    this.innerLyr = olLyr
  }

  innerOption = null
  innerLyr = null

  //这里做约束必须具有这个属性
  get type() {
    return LayerType.ArcGISRest;
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
    return buildArcGISRestLayer(this.innerOption)
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

export function buildArcGISRestLayer(arcLyrOption) {
  let lyr = new OLTile({
        preload: Infinity,
        source: new OLTileArcGISRest({
          ratio: 1,
          preload: Infinity,
          params: {
              LAYERS: arcLyrOption.layers? 'show:' + arcLyrOption.layers.join(',') : null,
          },
          url: arcLyrOption.url,
          crossOrigin: 'anonymous',
        }),
        zIndex: arcLyrOption.hasOwnProperty('zIndex') ? arcLyrOption.zIndex : -100,
    })
    return new ArcGISRestLayer(arcLyrOption, lyr)
}

