import GeoJSONUtil from "../util/GeojsonUtil.js";
import { buildVectorLayer } from "../layer/VectorLayer.js";
import {
  CHART_LAYER_NAME,
  SYSTEM_LAYERS,
} from "../config/LayerConstantConfig.js";
import OLSelect from "ol/interaction/Select";
import { buildStyle } from "../style/Style.js";
import emitter from "../../utils/eventbus";
import _ from "lodash";

export class ChartAlbum {
  constructor(option) {
    this.innerOption = option;
  }

  innerOption = null;

  //这里做约束必须具有这个属性
  get name() {
    return "ChartAlbum";
  }

  //这里做约束必须具有这个属性
  get option() {
    return this.innerOption;
  }

  chartLyr = null;
  selectedToolName = "chartSelectedTool";
  state = State.UnShowing;

  /**
   * 展示图表
   * params: { map, datas, chartType, colors }
   * datas: [{ point: [number, number], data: [number], size: number }]
   */
  show(params) {
    if (this.state == State.UnShowing) {
      this.innerOption = Object.assign(this.innerOption, params);
      this.innerOption.map.layerManager.removeLayer(CHART_LAYER_NAME);
      this.chartLyr = buildVectorLayer({
        name: CHART_LAYER_NAME,
        geojson: this.converetGeojson(this.innerOption.datas),
        lyrStyle: this.getChartStyle.bind(this),
      });
      this.innerOption.map.layerManager.addLayer(
        CHART_LAYER_NAME,
        this.chartLyr
      );
      this.innerOption.map.toolManager.addTool(this.selectedToolName, {
        ol: new OLSelect({
          style: (olFeature) => {
            let styles = [];
            let feature = GeoJSONUtil.writeFeatureObject(olFeature);
            styles.push(buildStyle(this.selectedChartStyle(feature)));
            if (
              this.innerOption.selectedStyle &&
              this.innerOption.selectedStyle instanceof Function
            ) {
              let insertStyle = this.innerOption.selectedStyle(feature);
              if (insertStyle instanceof Array) {
                styles = styles.concat(insertStyle);
              } else {
                styles.push(insertStyle);
              }
              // styles.push(buildStyle(this.innerOption.selectedStyle(feature)));
            }
            emitter.emit("selectedChart", feature);
            return styles;
          },
        }),
      });
      this.state = State.Showing;
    }
  }

  /**
   * 关闭图表
   */
  close() {
    if (this.state == State.Showing) {
      this.innerOption.map.toolManager.removeTool(this.selectedToolName);
      this.innerOption.map.layerManager.removeLayer(CHART_LAYER_NAME);
      this.state = State.UnShowing;
    }
  }

  /**
   * 选中样式
   */
  selectedChartStyle(feature) {
    return {
      image: {
        type: this.innerOption.chartType,
        radius: feature.properties["size"] * 1.3 || 20,
        displacement: [0, 0],
        data: feature.properties["data"] || [0, 0, 0],
        colors: this.innerOption.colors,
        rotateWithView: true,
        animation: true,
        stroke: {
          color: "#fff",
          width: 2,
        },
      },
      zIndex: 1
    };
  }

  /**
   * 展示样式
   */
  getChartStyle(feature) {
    return {
      image: {
        type: this.innerOption.chartType,
        radius: feature.properties["size"] || 18,
        displacement: [0, 0],
        data: feature.properties["data"] || [0, 0, 0],
        colors: this.innerOption.colors,
        rotateWithView: true,
        animation: true,
        stroke: {
          color: "#fff",
          width: 2,
        },
      },
      text: {
        font: "normal 16px black",
        fill: {
          color: "blue",
        },
        text: feature.properties?.name || "",
        offsetY: 45,
        stroke: {
          color: "rgba(255,255,255,1)",
          width: 3,
        },
      },
    };
  }

  /**
   * 转换数据成 geojson
   */
  converetGeojson(datas) {
    let geojson = {
      type: "FeatureCollection",
      features: [],
    };
    if (datas?.length) {
      geojson.features = datas.map((n) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: n.point,
          },
          properties: {
            data: n.data,
            size: n.size,
            name: n.name
          },
        };
      });
    }
    return geojson;
  }
}

export const ChartType = {
  Pie: "pie",
  Pie3D: "pie3D",
  Donut: "donut",
  Bar: "bar",
};

export const ColorType = {
  Classic: "classic",
  Dark: "dark",
  Pale: "pale",
  Pastel: "pastel",
  Neon: "neon",
  Custom: "white,black,blue,magenta",
};

export const State = {
  Showing: "Showing",
  UnShowing: "UnShowing",
};
