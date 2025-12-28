import OLText from "ol/style/Text";
import { buildOLFillStyle } from "./FillStyle";
import { buildOLStrokeStyle } from "./StrokeStyle";

export function buildOLTextStyle(text) {
  if (text == undefined) {
    return text;
  } else {
    return new OLText({
      font: text.font,
      offsetX: text.offsetX,
      offsetY: text.offsetY,
      scale: text.scale,
      rotateWithView: text.rotateWithView,
      rotation: text.rotation,
      text: text.text,
      placement: text.placement || "point",
      fill: buildOLFillStyle(text.fill),
      stroke: buildOLStrokeStyle(text.stroke),
      backgroundFill: buildOLFillStyle(text.backgroundFill),
      backgroundStroke: buildOLStrokeStyle(text.backgroundStroke),
      padding: text.padding,
    });
  }
}
