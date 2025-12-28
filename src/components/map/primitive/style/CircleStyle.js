import OLCircle from "ol/style/Circle";
import { buildOLFillStyle } from "./FillStyle";
import { buildOLStrokeStyle } from "./StrokeStyle";

export function buildCircleStyle(circleStyle) {
  if (circleStyle == undefined) {
    return circleStyle;
  } else {
    return new OLCircle({
      fill: buildOLFillStyle(circleStyle.fill),
      radius: circleStyle.radius,
      stroke: buildOLStrokeStyle(circleStyle.stroke),
    });
  }
}
