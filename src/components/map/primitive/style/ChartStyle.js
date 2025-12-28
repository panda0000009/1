import OLChart from "ol-ext/style/Chart";

import { buildOLFillStyle } from "./FillStyle";
import { buildOLStrokeStyle } from "./StrokeStyle";

export function buildChartStyle(chartStyle) {
  if (chartStyle == undefined) {
    return chartStyle;
  } else {
    return new OLChart({
      fill: buildOLFillStyle(chartStyle.fillColor),
      rotation: chartStyle.rotation,
      displacement: chartStyle.displacement,
      snapToPixel: chartStyle.snapToPixel,
      declutterMode: chartStyle.declutterMode,
      scale: chartStyle.scale || 1,
      stroke: buildOLStrokeStyle(chartStyle.stroke),
      radius: chartStyle.radius || 20,
      donutRatio: chartStyle.donutRatio || 0.5,
      type: chartStyle.type || 'pie',
      offsetX: chartStyle.offsetX || 0, 
      offsetY: chartStyle.offsetY || 0,
      animation: chartStyle.animation || 1,
      max: chartStyle.max,
      data: chartStyle.data,
      colors: /;/.test(chartStyle.colors) ? chartStyle.colors.split(";") : chartStyle.colors
    });
  }
}
