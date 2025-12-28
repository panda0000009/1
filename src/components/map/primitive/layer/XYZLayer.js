import OLTileLayer from "ol/layer/Tile";
import OLXYZ from "ol/source/XYZ";
import { LayerType } from "./Layer";

export class XYZLayer {
  constructor(option, olLyr) {
    this.innerOption = option;
    this.innerLyr = olLyr;
  }

  innerOption = null;
  innerLyr = null;

  //这里做约束必须具有这个属性
  get type() {
    return LayerType.XYZ;
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
    return buildXYZLayer(this.innerOption);
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

export function buildXYZLayer(lyrOptions) {
  let lyr = new OLTileLayer({
    source: new OLXYZ({
      url: lyrOptions.url,
      crossOrigin: "anonymous",
    }),
    zIndex: "zIndex" in lyrOptions ? lyrOptions.zIndex : -100,
  });
  if (lyrOptions?.tileLoadFunction) {
    lyr.getSource().setTileLoadFunction(lyrOptions.tileLoadFunction);
  }
  return new XYZLayer(lyrOptions, lyr);
}
