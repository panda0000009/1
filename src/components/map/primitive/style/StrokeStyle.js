import OLStroke from "ol/style/Stroke";

export function buildOLStrokeStyle(stroke) {
  if (stroke == undefined) {
    return stroke;
  } else {
    return new OLStroke(stroke);
  }
}
