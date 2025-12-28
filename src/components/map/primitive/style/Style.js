import OLStyle from "ol/style/Style";
import GeoJSONUtil from "../util/GeojsonUtil.js";
import { buildOLFillStyle } from "./FillStyle.js";
import { buildOLStrokeStyle } from "./StrokeStyle.js";
import { buildOLTextStyle } from "./TextStyle.js";
import { buildOLImageStyle } from "./ImageStyle.js";
import { buildCircleStyle } from "./CircleStyle.js";
import { buildChartStyle } from "./ChartStyle.js"
import { buildOLPhotoStyle } from "./PhotoStyle.js"

export function buildStyle(style) {
  if (style instanceof Function) {
    return (feature) => {
      let featureGeoJSON = GeoJSONUtil.writeFeatureObject(feature);
      let resolvedStyle = style(featureGeoJSON);
      return buildOLStyle(resolvedStyle);
    };
  } else {
    return buildOLStyle(style);
  }
}

export function buildOLStyle(style) {
  if (style) {
    return new OLStyle({
      fill: buildOLFillStyle(style.fill),
      image: getImageStyle(style.image),
      stroke: buildOLStrokeStyle(style.stroke),
      text: buildOLTextStyle(style.text),
      chart: buildChartStyle(style.chart),
      zIndex: style.zIndex,
    });
  } else {
    return null;
  }
}

export function getImageStyle(image) {
  // 主要用于展示图片
  if (image && image.photo && image.src) {
    return buildOLPhotoStyle(image);
  }
  // 主要用于 svg 图片展示
  if (image && image.src) {
    return buildOLImageStyle(image);
  }
  // 主要用于饼状图展示
  if (image && image.type) {
    return buildChartStyle(image);
  }

  // 圆形展示
  else {
    return buildCircleStyle(image)
  }
}
