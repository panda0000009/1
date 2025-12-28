import { MeasureTool, MeasureType } from "../../interaction/MeasureTool";
import { MEASURE_TOOL_NAME, DrawLyrStyle, DrawToolStyle } from "../../config/MeasureDefaultConfig"

export default function (map) {
  let meaTool = new MeasureTool({
    map: map,
    drawingStyle: (feature) => {
      return drawingStyleObj ? drawingStyleObj(feature) : DrawToolStyle(feature);
    },
    drawedStyle: (feature) => {
      return drawedStyleObj ? drawedStyleObj(feature) : DrawLyrStyle(feature);
    },
  });

  let isMeasured = false;
  let drawingStyleObj = null;
  let drawedStyleObj = null;

  const start = (measureType) => {
    meaTool.start(measureType);
    isMeasured = true;
  };

  const finish = () => {
    if (isMeasured) {
      meaTool.finish();
      isMeasured = false;
    }
  };

  const clear = () => {
    meaTool.clear();
  };

  const close = () => {
    meaTool.close();
    isMeasured = false;
  };

  const toggle = (meaType) => {
    if (isMeasured) {
      meaTool.toggle(meaType);
    }
  }

  const setDrawingStyle = (drawingStyle) => {
    drawingStyleObj = drawingStyle
  }

  const setDrawedStyle = (drawedStyle) => {
    drawedStyleObj = drawedStyle
  }

  const state = () => {
    return meaTool.state;
  }

  return {
    state,
    start,
    toggle,
    finish,
    clear,
    close,
    setDrawingStyle,
    setDrawedStyle
  };
}
