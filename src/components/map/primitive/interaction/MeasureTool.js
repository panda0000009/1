import OLOverlay from "ol/Overlay";
import { LineString, Polygon } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import OlFeature from "ol/Feature";
import { unByKey } from "ol/Observable";
import OLDraw from "ol/interaction/Draw";
import { buildStyle } from "../style/Style";
import { getLength, getArea, getMu } from "../util/CalculationUtil";
import GeoJSONUtil from '../util/GeojsonUtil';
import {
  MEASURE_TOOL_NAME,
  DrawLyrStyle,
  DrawToolStyle,
} from "../config/MeasureDefaultConfig";
import { MEASURE_LAYER_NAME } from "../config/LayerConstantConfig";

export class MeasureTool {
  // option: object	具体配置如下
  // {
  //   map,	地图对象
  //   drawingStyle, 绘制时图形样式
  //   drawedStyle, 绘制后图形样式
  // }
  constructor(option) {
    this.innerOption = option;
    this.initMeasureTool();
  }

  innerOption = null;

  sketch = null;
  drawTool = null;
  drawLyr = null;
  drawSour = null;
  helpTooltipElement = null;
  helpTooltip = null;
  measureTooltipElement = null;
  measureTooltip = null;
  continuePolygonMsg = null;
  continueLineMsg = null;
  drawOverlays = [];
  tooltipOverlays = [];
  pointermoveEvent = null;
  mouseoutEvent = null;
  state = State.UnMeasuring;

  //这里做约束必须具有这个属性
  get name() {
    return MEASURE_TOOL_NAME;
  }

  //这里做约束必须具有这个属性
  get option() {
    return this.innerOption;
  }

  // //这里做约束必须具有这个属性
  get ol() {
    return this.drawTool;
  }

  get state() {
    return this.state;
  }

  initMeasureTool() {
    this.continuePolygonMsg = "继续绘制面积";
    this.continueLineMsg = "继续绘制长度";

    if (this.innerOption && this.innerOption.layer) {
      this.drawSour = this.innerOption.layer.ol.getSource();
      this.drawLyr = this.innerOption.layer.ol;
    } else {
      this.drawSour = new VectorSource();
      this.drawSour.on("addfeature", (evt) => {
        if (this.innerOption.drawedStyle) {
          evt.feature.setStyle(buildStyle(this.innerOption.drawedStyle));
        }
      });
      this.drawLyr = new VectorLayer({
        source: this.drawSour,
        style: buildStyle(DrawLyrStyle),
        zIndex: 99,
      });
    }
  }

  start(meaType) {
    this.state = State.Measuring;
    this.measureType = meaType;
    this.finish();
    this.createMeasureTool();
    this.addInteraction();
    this.bindDrawEvent();
    if (!this.innerOption.layer) {
      if (this.innerOption.map.layerManager.getLayer(MEASURE_LAYER_NAME)) {
        this.innerOption.map.layerManager.removeLayer(MEASURE_LAYER_NAME);
      }
      this.innerOption.map.layerManager.addLayer(MEASURE_LAYER_NAME, { ol: this.drawLyr });
    }

    if (this.innerOption.map && this.pointermoveEvent) {
      this.innerOption.map.olMap.on("pointermove", this.pointermoveEvent);
    }
    if (this.innerOption.map && this.mouseoutEvent) {
      this.innerOption.map.olMap
        .getViewport()
        .addEventListener("mouseout", this.mouseoutEvent);
    }
  }

  finish() {
    if (this.tooltipOverlays && this.tooltipOverlays.length) {
      this.tooltipOverlays.forEach((n) => {
        this.innerOption.map.overlayManager.removeOverlay(n.name);
      });
      this.tooltipOverlays = [];
    }
    if (this.innerOption.map.toolManager.getTool(MEASURE_TOOL_NAME)) {
      this.innerOption.map.toolManager.removeTool(MEASURE_TOOL_NAME);
    }
    if (this.innerOption.map && this.pointermoveEvent) {
      this.innerOption.map.olMap.un("pointermove", this.pointermoveEvent);
    }
    if (this.innerOption.map && this.mouseoutEvent) {
      this.innerOption.map.olMap
        .getViewport()
        .removeEventListener("mouseout", this.mouseoutEvent);
    }
    this.state = State.UnMeasuring;
  }

  onlyClear() {
    if (this.drawOverlays && this.drawOverlays.length) {
      this.drawOverlays.forEach((n) => {
        this.innerOption.map.overlayManager.removeOverlay(n.name);
      });
      this.drawOverlays = [];
    }
    if (this.tooltipOverlays && this.tooltipOverlays.length) {
      this.tooltipOverlays.forEach((n) => {
        this.innerOption.map.overlayManager.removeOverlay(n.name);
      });
      this.tooltipOverlays = [];
    }
    this.drawSour.clear();
  }

  clear() {
    this.onlyClear();
    this.addInteraction();
    this.bindDrawEvent();
  }

  toggle(meaType) {
    this.measureType = meaType;
    if (this.innerOption.map.toolManager.getTool(MEASURE_TOOL_NAME)) {
      this.innerOption.map.toolManager.removeTool(MEASURE_TOOL_NAME);
    }
    this.createMeasureTool();
    this.addInteraction();
    this.bindDrawEvent();
  }

  close() {
    this.finish();
    if (this.drawOverlays && this.drawOverlays.length) {
      this.drawOverlays.forEach((n) => {
        this.innerOption.map.overlayManager.removeOverlay(n.name);
      });
      this.drawOverlays = [];
    }
    this.drawSour.clear();
    if (!this.innerOption.layer) {
      if (this.innerOption.map.layerManager.getLayer(MEASURE_LAYER_NAME)) {
        this.innerOption.map.layerManager.removeLayer(MEASURE_LAYER_NAME);
      }
    }
  }

  createMeasureTool() {
    this.drawTool = new OLDraw({
      source: this.drawSour,
      type: this.measureType == MeasureType.Length ? "LineString" : "Polygon",
      style: buildStyle(DrawToolStyle),
    });
    this.innerOption.map.toolManager.addTool(MEASURE_TOOL_NAME, { ol: this.drawTool });
  }

  bindDrawEvent() {
    this.pointermoveEvent = (evt) => {
      if (evt.dragging) {
        return;
      }
      let helpMsg = "点击开始绘制";
      if (this.sketch) {
        let geom = this.sketch.getGeometry();
        if (geom instanceof Polygon) {
          helpMsg = this.continuePolygonMsg;
        } else if (geom instanceof LineString) {
          helpMsg = this.continueLineMsg;
        }
      }
      this.helpTooltipElement.innerHTML = helpMsg;
      this.helpTooltip.setPosition(evt.coordinate);
    };

    this.mouseoutEvent = () => {
    };
  }

  addInteraction() {
    this.createMeasureTooltip();
    this.createHelpTooltip();

    let listener;
    if (this.drawTool) {
      this.drawTool.on("drawstart", (evt) => {
        this.sketch = evt.feature;
        let tooltipCoord = evt.coordinate;

        if (this.innerOption.drawingStyle) {
          this.sketch.setStyle(buildStyle(this.innerOption.drawingStyle));
        }

        listener = this.sketch.getGeometry().on("change", (evt) => {
          let geom = evt.target;
          let output;
          if (geom instanceof Polygon) {
            if (this.measureType == MeasureType.Area) {
              output = getArea(GeoJSONUtil.writeFeature(new OlFeature({ geometry: geom })), this.innerOption.map.projection)
            } else {
              output = getMu(GeoJSONUtil.writeFeature(new OlFeature({ geometry: geom })), this.innerOption.map.projection)
            }
            tooltipCoord = geom.getInteriorPoint().getCoordinates();
          } else if (geom instanceof LineString) {
            output = getLength(GeoJSONUtil.writeFeature(new OlFeature({ geometry: geom })), this.innerOption.map.projection);
            tooltipCoord = geom.getLastCoordinate();
          }
          this.measureTooltipElement.innerHTML = output;
          this.measureTooltip.setPosition(tooltipCoord);
        });
      });

      this.drawTool.on("drawend", () => {
        this.measureTooltip.setOffset([0, -7]);
        this.sketch = null;
        this.measureTooltipElement = null;
        this.createMeasureTooltip();
        unByKey(listener);
      });
    }
  }

  createHelpTooltip() {
    if (this.helpTooltipElement && this.helpTooltipElement.parentNode) {
      this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
    }
    this.helpTooltipElement = document.createElement("div");
    this.helpTooltip = new OLOverlay({
      element: this.helpTooltipElement,
      offset: [15, 0],
      positioning: "center-left",
    });
    let tooltipObj = {
      name: "Tooltip" + Math.floor(Math.random() * 10000),
      tooltip: this.helpTooltip,
    };
    this.tooltipOverlays.push(tooltipObj);
    this.innerOption.map.overlayManager.addOverlay(tooltipObj.name, {
      ol: tooltipObj.tooltip,
    });
  }

  createMeasureTooltip() {
    if (this.measureTooltipElement && this.measureTooltipElement.parentNode) {
      this.measureTooltipElement.parentNode.removeChild(
        this.measureTooltipElement
      );
    }
    this.measureTooltipElement = document.createElement("div");
    this.measureTooltip = new OLOverlay({
      element: this.measureTooltipElement,
      offset: [0, -15],
      positioning: "bottom-center",
    });
    let drawObj = {
      name: "Measure" + Math.floor(Math.random() * 10000),
      tooltip: this.measureTooltip,
    };
    this.drawOverlays.push(drawObj);
    this.innerOption.map.overlayManager.addOverlay(drawObj.name, { ol: drawObj.tooltip });
  }
}

export const MeasureType = {
  Length: "Length",
  Area: "Area",
  Mu: "Mu",
};

export const State = {
  Measuring: "Measuring",
  UnMeasuring: "UnMeasuring",
};
