import {
  defaults as OLInteractionDefaults,
  MouseWheelZoom as OLMouseWheelZoom,
} from "ol/interaction";
import { Map as OLMap, View as OLView } from "ol";
import { defaults as OLControlDefaults } from "ol/control";
import OLProjection from 'ol/proj/Projection'
import PerspectiveMap from "ol-ext/map/PerspectiveMap";
import "../config/MapDefaultStyle.css"
import { useFlyTo, useRegional, useProjection, useMeasureTool, useDrawTool } from "./effect";
import { useLayer, useTool, useControl, useOverlay, useFeature, } from "./hooks";
import { singleclickEvent, pointermoveEvent, moveendEvent, mapLoadEvent } from "./events";

export default class OLProtoMap {

  //地图原型对象
  olMap = null;
  projection = null;
  mapInitOptions = null;
  lyrManager = null;
  toolManager = null;
  ctrlManager = null;
  ovrlyManager = null;
  tmpFeatrManager = null;
  regionalManager = null;
  flyToManager = null;
  meaToolManager = null;
  drawToolManager = null;

  constructor(mapOptions, el) {
    this.mapInitOptions = mapOptions;
    this.projection = useProjection(mapOptions.viewOptions.projection);
    mapOptions.viewOptions.projection = this.projection;

    // 初始化地图对象
    this.olMap = new OLMap({
      controls: OLControlDefaults({
        attribution: false,
        zoom: false,
        rotate: false,
      }),
      interactions: OLInteractionDefaults().extend(
        new OLMouseWheelZoom({
          useAnchor: false,
        })
      ),
      target: el,
      view: new OLView(mapOptions.viewOptions),
    });

    // 初始化组件管理工具
    this.initComponentManagers();
    // 初始化地图事件
    this.initEvents();
    // 初始化地图功能
    this.initEffects();
  }

  initComponentManagers() {
    this.lyrManager = useLayer(this.olMap);
    this.toolManager = useTool(this.olMap);
    this.ctrlManager = useControl(this.olMap);
    this.ovrlyManager = useOverlay(this.olMap);
    this.tmpFeatrManager = useFeature(this);
  }

  initEvents() {
    singleclickEvent(this.olMap, this.layers)
    pointermoveEvent(this.olMap)
    moveendEvent(this.olMap)
    mapLoadEvent(this.olMap)
  }

  initEffects() {
    this.regionalManager = useRegional(this.olMap);
    this.flyToManager = useFlyTo(this);
    this.meaToolManager = useMeasureTool(this);
    this.drawToolManager = useDrawTool(this);
  }

  get olMap() {
    return this.olMap;
  }

  get olView() {
    return this.olMap.getView();
  }

  get layers() {
    return this.lyrManager.innerLayers;
  }

  get tools() {
    return this.toolManager.innerTools;
  }

  get controls() {
    return this.ctrlManager.innerControls;
  }

  get overlays() {
    return this.ovrlyManager.innerOverlays;
  }

  get mapOptions() {
    return this.mapInitOptions;
  }

  get projection() {
    return this.projection;
  }

  get resolutions() {
    return this.mapInitOptions.viewOptions?.resolutions || [];
  }

  get center() {
    return this.mapInitOptions.viewOptions?.center || [];
  }

  get measureTool() {
    return this.meaToolManager;
  }

  get drawTool() {
    return this.drawToolManager;
  }

  get layerManager() {
    return this.lyrManager;
  }

  get toolManager() {
    return this.toolManager;
  }

  get ctrlManager() {
    return this.ctrlManager;
  }

  get overlayManager() {
    return this.ovrlyManager;
  }

  get featureManager() {
    return this.tmpFeatrManager;
  }

  get flyToManager() {
    return this.flyToManager;
  }

  get extent() {
    if (this.mapInitOptions.viewOptions?.extent) {
      return this.mapInitOptions.viewOptions?.extent;
    }
    else if (this.projection instanceof OLProjection) {
      return this.projection.getExtent();
    } else {
      return [];
    }
  }

  //#region 功能方法
  rangePostrender(range) {
    this.regionalManager.rangePostrender(range, this.layers);
  }

  setPerspective(val) {
    this.olMap.setPerspective(val);
  }
  //#endregion

}
