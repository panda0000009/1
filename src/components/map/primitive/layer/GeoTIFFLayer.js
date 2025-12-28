
import OLWebGLTileLayer from "ol/layer/WebGLTile";
import OLGeoTIFFSource from "ol/source/GeoTIFF";
import { LayerType } from "./Layer";


export class GeoTIFFLayer {
  constructor(option, olLyr) {
    this.innerOption = option;
    this.innerLyr = olLyr;
  }

  innerOption = null;
  innerLyr = null;

  //这里做约束必须具有这个属性
  get type() {
    return LayerType.GeoTIFF;
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
    return buildGeoTIFFLayer(this.innerOption);
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
}

export function buildGeoTIFFLayer(lyrOption) {
  let lyr = new OLWebGLTileLayer({
    source: new OLGeoTIFFSource({
      sources: [
        {
          url: lyrOption.url,
        },
      ],
      wrapX: false,
    }),
    opacity: 1,
  });

  return new GeoTIFFLayer(lyrOption, lyr)

}
