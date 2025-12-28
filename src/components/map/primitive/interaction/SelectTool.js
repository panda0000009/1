import OLVectorLayer from "ol/layer/Vector";
import OLVectorSource from "ol/source/Vector";
import { buildStyle } from "../style/Style";
import OLDrawTool, {
  createBox
} from "ol/interaction/Draw";
import { SELECT_LAYER_NAME, SYSTEM_LAYERS } from "../config/LayerConstantConfig.js";
import { SELECT_TOOL_NAME, DrawingType } from "../config/SelectDefaultConfig.js"
import GeoJSONUtil from "../util/GeojsonUtil.js";
import emitter from "../../utils/eventbus";
import * as turf from '@turf/turf';
import _ from "lodash"

export class SelectTool {
  constructor(option) {
    this.innerOption = Object.assign({
      drawType: SelectType.Polygon,
      drawStyle: DrawingType
    }, option);
    this.initSelectTool();
  }

  innerOption = null;
  selectVecLyr = null;
  selectVecSour = null;
  drawTool = null;
  state = State.UnSelecting;

  //这里做约束必须具有这个属性
  get name() {
    return SELECT_TOOL_NAME;
  }

  //这里做约束必须具有这个属性
  get option() {
    return this.innerOption;
  }

  // 这里做约束必须具有这个属性
  // get ol() {
  //     return this.innerTool;
  // }

  get state() {
    return this.state;
  }

  initSelectTool() {
    this.selectVecSour = new OLVectorSource();
    this.selectVecSour.on('addfeature', this.addFeatureToDrawLyrHandler.bind(this));
    this.selectVecLyr = new OLVectorLayer({
      source: this.selectVecSour,
      style: buildStyle(
        this.innerOption && this.innerOption.drawStyle
          ? this.innerOption.drawStyle
          : DrawingType
      ),
      zIndex: 99,
    });
  }

  addDrawTool() {
    if (!this.drawTool) {
      let { type, geoFunc } = this.getDrawTypeInfo();
      this.drawTool = new OLDrawTool({
        type: type,
        style: buildStyle(this.innerOption.drawStyle
          ? this.innerOption.drawStyle
          : DrawingType),
        source: this.selectVecSour,
        geometryFunction: geoFunc,
        wrapX: false,
      });
      this.drawTool.on("drawend", this.drawendEventHandler.bind(this));
      this.innerOption.map.toolManager.addTool(SELECT_TOOL_NAME, { ol: this.drawTool });
    }
  }

  getDrawTypeInfo() {
    let type = SelectType.Polygon;
    let geoFunc = null;
    // 绘制 DrawType.Box
    if (this.innerOption?.drawType == SelectType.Box) {
      type = "Circle";
      geoFunc = createBox();
    }
    return { type, geoFunc };
  }

  selectFeatureByClickHandler(evt) {
    if (this.innerOption?.drawType != SelectType.Point)
      return;

    let lyrClickFeatures = [];
    let lyrs = this.innerOption.map.lyrManager.innerLayers;
    // this.innerOption.map.olMap.forEachFeatureAtPixel(evt.pixel,
    //   (feature, olLayer) => {
    //     let layer = lyrs.find((l) => l.layer.ol == olLayer);
    //     if (layer && this.innerOption?.selectLyrNames.includes(layer.lyrName)) {
    //       lyrClickFeatures.push({
    //         lyrName: layer.lyrName,
    //         feature: GeoJSONUtil.writeFeatureObject(feature),
    //       })
    //     }
    //   },
    //   {
    //     layerFilter: (olLayer) => {
    //       let layer = lyrs.find((l) => l.layer.ol == olLayer);
    //       return layer?.lyrName && !SYSTEM_LAYERS.includes(layer.lyrName);
    //     },
    //     // hitTolerance: 10,
    //   }
    // );
    this.innerOption.map.olMap.forEachFeatureAtPixel(
      evt.pixel,
      (feature, olLayer) => {
        let featureqwe = GeoJSONUtil.writeFeatureObject(feature)
        if (featureqwe?.properties?.features?.length) {
          let data = featureqwe?.properties?.features[0]
          if (data) {
            let geoFeature = GeoJSONUtil.writeFeatureObject(data)
            if (geoFeature?.properties?.tableId) {
              lyrClickFeatures.push({
                lyrName: 'StationLayer',
                feature: geoFeature,
              })
            }
          }
        } else if (featureqwe?.properties?.tableId) {
          lyrClickFeatures.push({
            lyrName: 'StationLayer',
            feature: featureqwe,
          })
        }
      },
      {
        hitTolerance: 10,
      }
    );
    if (lyrClickFeatures?.length) {
      let selFeatures = {};
      let groupByFeatures = _.groupBy(lyrClickFeatures, item => item.lyrName);
      for (let [key, val] of Object.entries(groupByFeatures)) {
        selFeatures[key] = val.map(m => m.feature);
      }
      emitter.emit("selectedFeatures", selFeatures);
    }
  }

  addFeatureToDrawLyrHandler(evt) {
    let drawedGeojson = GeoJSONUtil.writeFeaturesObject(this.selectVecSour.getFeatures());
    if (drawedGeojson.features?.length) {
      emitter.emit("drawedFeatures", drawedGeojson);
    }
  }

  drawendEventHandler(evt) {
    if (this.innerOption?.drawedStyle) {
      evt.feature.setStyle(buildStyle(this.innerOption.drawedStyle));
    }
    if (evt.feature) {
      let drawedGeojson = GeoJSONUtil.writeFeatureObject(evt.feature);
      emitter.emit("drawendFeature", drawedGeojson);
      this.selectFeatures(drawedGeojson);
    }
  }

  selectFeatures(range) {
    if (this.innerOption?.selectLyrNames) {
      let lyrs = this.innerOption?.selectLyrNames.map(m => {
        return {
          lyrName: m,
          lyr: this.innerOption.map.lyrManager.getLayer(m)
        }
      })

      let selFeatures = {};
      lyrs.forEach(lyr => {
        if (lyr?.lyr?.ol?.getSource()) {
          // let lyrGeojson = GeoJSONUtil.writeFeaturesObject(lyr.lyr.ol.getSource().getFeatures());
          let lyrGeojson = null;
          try {
            lyrGeojson = GeoJSONUtil.writeFeaturesObject(lyr.lyr.ol.getSource().getSource().getFeatures())
          } catch {
            lyrGeojson = GeoJSONUtil.writeFeaturesObject(lyr.lyr.ol.getSource().getFeatures())
          }
          if (lyrGeojson.features?.length) {
            let filterFeats = lyrGeojson.features.filter(feat => !turf.booleanDisjoint(feat, range));
            let seletedFeats = []
            if (filterFeats?.length) {
              filterFeats.forEach(n => {
                if (n?.properties?.features?.length) {
                  let geos = GeoJSONUtil.writeFeaturesObject(n.properties.features)
                  if (geos.features?.length) {
                    seletedFeats = seletedFeats.concat(geos.features.filter(feat => !turf.booleanDisjoint(feat, range)))
                  }
                }
                else {
                  seletedFeats = seletedFeats.concat(n);
                }
              })
              selFeatures[lyr.lyrName] = seletedFeats
            }
          }
        }
      })
      emitter.emit("selectedFeatures", selFeatures);
    }
  }

  start(selectOption) {
    this.innerOption = Object.assign(this.innerOption, selectOption);
    this.innerOption.map.lyrManager.removeLayer(SELECT_LAYER_NAME);
    this.innerOption.map.lyrManager.addLayer(SELECT_LAYER_NAME, { ol: this.selectVecLyr });
    this.innerOption.map.olMap.getTargetElement().style.cursor = 'pointer'
    if (this.innerOption.drawType == SelectType.Polygon || this.innerOption.drawType == SelectType.Box) {
      this.addDrawTool();
    }
    if (this.innerOption.drawType == SelectType.Point) {
      this.innerOption.map.olMap.addEventListener("click", this.selectFeatureByClickHandler.bind(this));
    }
    this.state = State.Selecting;
  }

  finish() {
    if (this.innerOption.map.toolManager.getTool(SELECT_TOOL_NAME)) {
      this.innerOption.map.toolManager.removeTool(SELECT_TOOL_NAME);
    }
    if (this.drawTool) {
      this.drawTool.un("drawend", this.drawendEventHandler);
    }
    if (this.innerOption.map.lyrManager.getLayer(SELECT_LAYER_NAME)) {
      this.innerOption.map.lyrManager.removeLayer(SELECT_LAYER_NAME);
    }
    this.innerOption.map.olMap.removeEventListener("click",  this.selectFeatureByClickHandler.bind(this));
		this.innerOption.map.olMap.getTargetElement().style.cursor = 'default'
    this.drawTool = null;
    this.state = State.UnSelecting;
  }

  addGeoJson(geojson) {
    if (this.state == State.Selecting && geojson) {
      let inputFeature = GeoJSONUtil.readFeature(geojson);
      if (this.innerOption?.drawedStyle) {
        inputFeature.setStyle(buildStyle(this.innerOption.drawedStyle));
      }
      this.selectVecSour.addFeature(inputFeature);
      this.selectFeatures(geojson);
    }
  }

  toggle(selectOption) {
    this.finish();
    this.start(selectOption);
  }

  clearDrawedFeatures() {
    this.selectVecSour.clear();
  }
}

export const SelectType = {
  Point: "Point",
  Polygon: "Polygon",
  Box: "Box",
  Geojson: 'Geojson'
};

export const State = {
  Selecting: 'Selecting',
  UnSelecting: 'UnSelecting'
}
