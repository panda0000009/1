import OLTileLayer from 'ol/layer/Tile'
import OLWMTS from 'ol/source/WMTS'
import tileGridWMTS from 'ol/tilegrid/WMTS'
import { LayerType } from "./Layer";
import { useProjection } from "../map/effect"

export class GeoServerWmtsLayer {
  constructor(option, olLyr) {
    this.innerOption = option
    this.innerLyr = olLyr
  }

  innerOption = null
  innerLyr = null

  //这里做约束必须具有这个属性
  get type() {
    return LayerType.GeoServerWmts;
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
    return buildGeoServerWmtsLayer(this.innerOption)
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

// lyrOption 参数
// name: string 图层名称
// layer: string 加载图层名称
// url: string 服务地址
// projection?: string 投影
// resolutions?: number[] 分辨率
// extent?：number[] 四至
// origin?：number[] 原点
// style?: string 样式
// zIndex?: number	图层层级
export function buildGeoServerWmtsLayer(lyrOption) {
  if (lyrOption?.projection) {
    lyrOption.projection = useProjection(lyrOption.projection);
  }

  let tileGridInfo = getTileGridInfo(lyrOption.projection.getCode());
  let lyr = new OLTileLayer({
    preload: Infinity,
    source: new OLWMTS({
      url: lyrOption.url,
      layer: lyrOption.layer,
      matrixSet: lyrOption.projection.getCode(),
      format: 'image/png',
      projection: lyrOption.projection,
      tileGrid: new tileGridWMTS({
        tileSize: [256,256],
        extent: tileGridInfo.extent,
        origin: tileGridInfo.origin,
        resolutions: tileGridInfo.resolutions,
        matrixIds: tileGridInfo.gridNames
      }),
      style: lyrOption?.style || '',
      wrapX: true,
    }),
    zIndex: lyrOption.hasOwnProperty('zIndex') ? lyrOption.zIndex : -100,
  });
  return new GeoServerWmtsLayer(lyrOption, lyr)
}

function getTileGridInfo(projectionCode) {
  let gridNames = [];
  for (let index = 0, cnt = 22; index < cnt; index++) {
    gridNames.push(projectionCode + ":" + index);
  }
  let resolutions = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4, 1.71661376953125E-4, 8.58306884765625E-5, 4.291534423828125E-5, 2.1457672119140625E-5, 1.0728836059570312E-5, 5.364418029785156E-6, 2.682209014892578E-6, 1.341104507446289E-6, 6.705522537231445E-7, 3.3527612686157227E-7];
  let extent = [-180.0,-90.0,180.0,90.0];
  let origin = [-180.0, 90.0];
  if (["EPSG:3857", "EPSG:900913"].includes(projectionCode)) {
    resolutions = [156543.03390625, 78271.516953125, 39135.7584765625, 19567.87923828125, 9783.939619140625, 4891.9698095703125, 2445.9849047851562, 1222.9924523925781, 611.4962261962891, 305.74811309814453, 152.87405654907226, 76.43702827453613, 38.218514137268066, 19.109257068634033, 9.554628534317017, 4.777314267158508, 2.388657133579254, 1.194328566789627, 0.5971642833948135, 0.29858214169740677, 0.14929107084870338, 0.07464553542435169, 0.037322767712175846, 0.018661383856087923, 0.009330691928043961, 0.004665345964021981, 0.0023326729820109904, 0.0011663364910054952, 5.831682455027476E-4, 2.915841227513738E-4, 1.457920613756869E-4];
    extent = [-2.003750834E7,-2.003750834E7,2.003750834E7,2.003750834E7];
    origin = [-2.003750834E7, 2.003750834E7];
  }

  return {
    gridNames,
    resolutions,
    extent,
    origin
  }
}

