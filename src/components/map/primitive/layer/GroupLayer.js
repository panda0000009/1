import Group from "ol/layer/Group";
import Collection from "ol/Collection" ;
import buildLayer, { LayerType } from "./Layer";

export class GroupLayer {
  constructor(option, olLyr, subLyrs) {
    this.innerOption = option;
    this.innerLyr = olLyr;
    this.subLyrs = subLyrs;
  }

  innerOption = null;
  innerLyr = null;
  subLyrs = [];

  //这里做约束必须具有这个属性
  get type() {
    return LayerType.Group;
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
    return buildGroupLayer(this.innerOption);
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
    this.ol.setZIndex(zIndex);
    this.subLyrs.forEach(lyr => lyr.layer.setZIndex(zIndex));
  }

  addLayer(lyr) {
    if (this.subLyrs.find((n) => n.lyrName == lyr.lyrName)) {
      // throw new Error("Duplicate Layer");
    }
    this.subLyrs.push(lyr);
    this.innerLyr.getLayers().push(lyr.layer.ol);
  }

  getLayers() {
    return this.subLyrs;
  }
}

export function buildGroupLayer(lyrOptions) {
  let lyr = new Group({
    zIndex: "zIndex" in lyrOptions ? lyrOptions.zIndex : -100,
  });
  let subLyrs = [];
  if (lyrOptions?.layers?.length) {
    subLyrs = lyrOptions.layers.map((lyr) => {
      return {
        lyrName: lyr.lyrOption.name,
        layer: buildLayer(lyr.type, lyr.lyrOption)
      };
    });
    lyr.setLayers(new Collection(subLyrs.map(lyr => lyr.layer.ol)));
  }
  return new GroupLayer(lyrOptions, lyr, subLyrs);
}
