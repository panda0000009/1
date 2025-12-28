
import OLVectorLayer from "ol/layer/Vector";
import OLVectorSource from "ol/source/Vector";
import OLDrawTool, {
  createBox,
  createRegularPolygon,
} from "ol/interaction/Draw";
import {
  DRAW_TOOL_NAME,
  DrawingType,
  DrawedStyle,
} from "../config/DrawDefaultConfig";
import { buildStyle } from "../style/Style";
import OLOverlay from "ol/Overlay";
import { DRAW_LAYER_NAME } from "../config/LayerConstantConfig.js";
import GeoJSONUtil from "../util/GeojsonUtil.js";
import emitter from "../../utils/eventbus";
import * as turf from '@turf/turf';

export class DrawTool {
  constructor(option) {
    this.innerOption = option;
    this.initDrawTool();
  }

  innerOption = null;
  drawVecLyr = null;
  drawVecSour = null;
  drawOverlays = [];
  drawOption = null;
  helpTooltipElement = null;
  helpTooltip = null;
  tooltipOverlays = [];
  state = State.UnDrawding;

  //这里做约束必须具有这个属性
  get name() {
    return DRAW_TOOL_NAME;
  }

  //这里做约束必须具有这个属性
  get option() {
    return this.innerOption;
  }

  get state() {
    return this.state;
  }

  initDrawTool() {
    this.drawVecSour = new OLVectorSource();
    this.drawVecLyr = new OLVectorLayer({
      source: this.drawVecSour,
      style: buildStyle(
        this.drawOption && this.drawOption.drawedStyle
          ? this.drawOption.drawedStyle
          : DrawedStyle
      ),
      zIndex: 99,
    });
  }

  // //这里做约束必须具有这个属性
  // get ol() {
  //     return this.innerTool;
  // }

  start(drawOption) {
    this.state = State.Drawding;
    this.drawOption = drawOption;
    this.createHelpTooltip();
    this.addDrawTool();
    this.bindDrawEvent();
    if (this.innerOption.map && this.pointermoveEvent) {
      this.innerOption.map.olMap.on("pointermove", this.pointermoveEvent);
    }
    if (!this.innerOption.map.layerManager.getLayer(DRAW_LAYER_NAME)) {
      this.innerOption.map.layerManager.addLayer(DRAW_LAYER_NAME, { ol: this.drawVecLyr });
    }
  }

  finish() {
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
    if (this.innerOption.map.toolManager.getTool(DRAW_TOOL_NAME)) {
      this.innerOption.map.toolManager.removeTool(DRAW_TOOL_NAME);
    }
    if (this.drawTool) {
      this.drawTool.un("drawend", this.drawendEventHandler);
    }
    if (!this.innerOption.map.layerManager.getLayer(DRAW_LAYER_NAME)) {
      this.innerOption.map.layerManager.removeLayer(DRAW_LAYER_NAME);
    }
    if (this.innerOption.map && this.pointermoveEvent) {
      this.innerOption.map.olMap.un("pointermove", this.pointermoveEvent);
    }
    this.drawTool = null;
    this.state = State.UnDrawding;
  }

  toggle(drawOption) {
    this.finish();
    this.start(drawOption);
  }

  clear() {
    if (this.drawVecSour != null) {
      this.drawVecSour.clear();
    }
    if (this.drawOverlays?.length) {
      this.drawOverlays.forEach((n) => this.innerOption.map.overlayManager.removeOverlay(n));
      this.drawOverlays.length = 0;
    }
  }

  getFeatures() {
    if (this.drawVecSour != null) {
      return GeoJSONUtil.writeFeaturesObject(this.drawVecSour.getFeatures())
    }
    return []
  }

  addDrawTool() {
    if (!this.drawTool) {
      let { type, geoFunc } = this.getDrawTypeInfo();
      this.drawTool = new OLDrawTool({
        type: type,
        style: buildStyle(this.drawOption.drawingStyle
          ? this.drawOption.drawingStyle
          : DrawingType),
        source: this.drawVecSour,
        geometryFunction: geoFunc,
        wrapX: false,
      });
      this.drawTool.on("drawend", this.drawendEventHandler.bind(this));
      this.innerOption.map.toolManager.addTool(DRAW_TOOL_NAME, { ol: this.drawTool });
    }
  }

  bindDrawEvent() {
    this.pointermoveEvent = (evt) => {
      if (evt.dragging) {
        return;
      }

      this.helpTooltipElement.innerHTML = '' // this.getTooltip();
      this.helpTooltip.setPosition(evt.coordinate);
    };

    this.mouseoutEvent = () => {
    };
  }

  getTooltip() {
    switch (this.drawOption.drawType) {
      case DrawType.Point:
        return "绘制点";
      case DrawType.Line:
        return "绘制线";
      case DrawType.Polygon:
        return "绘制面";
      case DrawType.Circle:
        return "绘制圆";
      case DrawType.Box:
        return "绘制框";
      case DrawType.Square:
        return "绘制矩形";
      case DrawType.Text:
        return "绘制文本";
      default:
        return "绘制面";
    }
    return "绘制面";
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

  getDrawTypeInfo() {
    let type = DrawType.Polygon;
    let geoFunc = null;
    if (this.drawOption?.drawType) {
      type =
        this.drawOption.drawType == DrawType.Text
          ? DrawType.Point
          : this.drawOption.drawType;
    }
    // 绘制 DrawType.Square
    if (this.drawOption.drawType == DrawType.Square) {
      type = DrawType.Circle;
      geoFunc = createRegularPolygon(4);
    }
    // 绘制 DrawType.Box
    if (this.drawOption.drawType == DrawType.Box) {
      type = DrawType.Circle;
      geoFunc = createBox();
    }
    if (this.drawOption.drawType == DrawType.DashedPolygon) {
      type = DrawType.Polygon;
    }
    if (this.drawOption.drawType == DrawType.DashedLineString) {
      type = DrawType.Line;
    }
    return { type, geoFunc };
  }

  drawendEventHandler(evt) {
    evt.feature.setStyle(
      buildStyle(
        this.drawOption?.drawedStyle ? this.drawOption.drawedStyle : DrawedStyle
      )
    );
    let overlayId = "Overlay_" + Math.floor(Math.random() * 10000);
    let divEle = document.createElement("div");
    // divEle.className = 'divStyle';
    if (this.drawOption.drawType == DrawType.Text) {
      let inputElement = document.createElement("input");
      inputElement.style.background = "rgba(255, 255, 255, 0.1)";
      inputElement.style.border = "rgba(255, 255, 255, 0.1)";
      inputElement.value = "";
      evt.feature.set("text", inputElement.value);
      inputElement.addEventListener("change", () => {
        evt.feature.set("text", inputElement.value);
      });
      // divEle.appendChild(inputElement);
      divEle.addEventListener("mouseover", () => {
        inputElement.style.visibility = "visible";
        // divEle.style.border = 'rgba(255,255,255, 0.1)';
        // inputElement.style.color = 'rgba(0, 0, 0, 1)';
      });
      divEle.addEventListener("mouseout", () => {
        inputElement.style.visibility = "hidden";
        // divEle.style.border = 'rgba(255,255,255, 0.0001)';
        // inputElement.style.color = 'rgba(255, 255, 255, 0.1)';
      });
    }
    let aElement = document.createElement("div");
    aElement.innerHTML = "X";
    aElement.style.textAlign = "center";
    aElement.style.backgroundColor = "white";
    aElement.style.border = "1px solid red";
    aElement.style.width = "20px";
    aElement.style.height = "20px";
    aElement.style.borderRadius = "5px";
    aElement.style.color = "red";
    aElement.style.visibility = "visible";
    aElement.addEventListener(
      "click",
      () => {
        this.innerOption.map.overlayManager.removeOverlay(overlayId);
        this.drawVecSour.removeFeature(evt.feature);
        emitter.emit('removeDrawendFeature', GeoJSONUtil.writeFeatureObject(evt.feature))
      },
      true
    );
    aElement.className = 'ol-tooltip-input';

    // divEle.appendChild(aElement);
    divEle.addEventListener(
      "mouseover",
      () => {
        aElement.style.visibility = "visible";
      },
      true
    );
    divEle.addEventListener(
      "mouseout",
      () => {
        aElement.style.visibility = "hidden";
      },
      true
    );

    this.drawOverlays.push(overlayId);
    this.innerOption.map.overlayManager.addOverlay(overlayId, {
      ol: new OLOverlay({
        id: overlayId,
        element: divEle,
        offset: [15, -30],
        positioning: "right-button",
        position: evt.feature.getGeometry().getLastCoordinate(),
      }),
    });
    this.innerOption.map.olMap.render();
    let idVal = Math.floor(Math.random() * 10000)
    evt.feature.set("Id", idVal)
    if (evt.target.type_ == 'Circle') {
      let from = turf.point(evt.target.sketchCoords_[0]);
      let to = turf.point(evt.target.sketchCoords_[1]);
      let options = { units: "degrees" };
      let distance = turf.distance(from, to, options);

      let center = evt.target.sketchCoords_[0];
      let radius = distance;
      let options2 = { steps: 96, units: "degrees"};
      let circle = turf.circle(center, radius, options2);
      circle.properties.Id = idVal
      emitter.emit('drawend', circle)
    } else {
      emitter.emit('drawend', GeoJSONUtil.writeFeatureObject(evt.feature))
    }
  }
}

export const DrawType = {
  Point: "Point",
  Line: "LineString",
  Polygon: "Polygon",
  DashedPolygon: "DashedPolygon",
  DashedLineString: "DashedLineString",
  Circle: "Circle",
  Box: "Box",
  Square: "Square",
  Text: "Text",
};

export const State = {
  Drawding: 'Drawding',
  UnDrawding: 'UnDrawding'
}
