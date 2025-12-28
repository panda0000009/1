
/**
 * 测量工具名称
 */
export const MEASURE_TOOL_NAME = "MeasureTool";

export const DrawLyrStyle = (feature) => {
  return {
    fill: {
      color: "rgba(255, 255, 255, 0.2)",
    },
    stroke: {
      color: "#ffcc33",
      width: 2,
    },
    image: {
      radius: 7,
      fill: {
        color: "#ffcc33",
      },
    },
  };
};

export const DrawToolStyle = (feature) => {
  return {
    fill: {
      color: "rgba(255, 255, 255, 0.2)",
    },
    stroke: {
      color: "rgba(0, 0, 0, 0.5)",
      lineDash: [10, 10],
      width: 2,
    },
    image: {
      radius: 5,
      stroke: {
        color: "rgba(0, 0, 0, 0.7)",
      },
      fill: {
        color: "rgba(255, 255, 255, 0.2)",
      },
    },
  };
};




