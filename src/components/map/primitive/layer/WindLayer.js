import OLVectorLayer from "ol/layer/Vector";
import OLVectorSource from "ol/source/Vector";
import { LayerType } from "./Layer";
import { WindLayer as OLWindLayer } from "ol-wind";


export class WindLayer {
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
    return buildWindLayer(this.innerOption);
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

// lyrOption 参数
// data: json 数据
// forceRender: boolean	在鼠标交互时始终显示粒子
// windOptions: object	风场参数，具体配置如下
// fieldOptions: object	数据配置项
// zIndex: number	图层层级
export function buildWindLayer(lyrOption) {
  let layer = new OLWindLayer(lyrOption.data, {
    forceRender: lyrOption?.forceRender || true,
    windOptions: lyrOption?.windOptions || null,
    fieldOptions: lyrOption?.fieldOptions || null
  });
  return new WindLayer(lyrOption, layer);
}
