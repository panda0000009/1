import { DrawTool, DrawType } from "../../interaction/DrawTool";
import { DrawingType, DrawedStyle } from "../../config/DrawDefaultConfig";

export default function (map) {
  let drawTool = new DrawTool({
    map: map,
  });

  let isDrawed = false;

  // 结束绘制
  function finish() {
    drawTool.finish();
    isDrawed = false;
  }

  // option: object	具体配置如下
  // {
  //   drawType,	绘制类型
  //   drawingStyle, 绘制时图形样式
  //   drawedStyle, 绘制后图形样式
  // }
  function start(option) {
    drawTool.start(option);
    isDrawed = true;
  }

  // 清除已经绘制
  function clear() {
    drawTool.clear();
  }

  // option: object	具体配置如下
  // {
  //   drawType,	绘制类型
  //   drawingStyle, 绘制时图形样式
  //   drawedStyle, 绘制后图形样式
  // }
  const toggle = (option) => {
    if (isDrawed) {
      drawTool.toggle(option);
    }
  };

  const state = () => {
    return drawTool.state;
  }

  const getFeatures = () => {
    return drawTool.getFeatures();
  }

  return {
    state,
    start,
    toggle,
    finish,
    clear,
    getFeatures
  };
}
