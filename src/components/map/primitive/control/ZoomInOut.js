import * as turf from "@turf/turf";
import GeoJSONUtil from "../util/GeojsonUtil.js";

export class ZoomInOut {
  constructor(option) {
    this.innerOption = option;
  }

  innerOption = null;

  //这里做约束必须具有这个属性
  get name() {
    return "ZoomInOut";
  }

  //这里做约束必须具有这个属性
  get option() {
    return this.innerOption;
  }

  zoomIn() {
    if (this.innerOption?.map) {
      let view = this.innerOption.map.olView;
      if (!view) {
        throw new Error("get openlayers view failed");
      }
      if (view.getZoom() < 22) {
        this.ZoomByFactor(0.5);
      }
    }
  }

  zoomOut() {
    if (this.innerOption?.map) {
      let view = this.innerOption.map.olView;
      if (!view) {
        throw new Error("get openlayers view failed");
      }
      if (view.getZoom() > 0) {
        this.ZoomByFactor(2);
      }
    }
  }

  ZoomByFactor(factor) {
    let extent = this.innerOption?.map.olView.calculateExtent();
    if (extent?.length) {
      let olFeature = GeoJSONUtil.readFeature(turf.bboxPolygon(extent), {
        dataProjection: this.innerOption.map.projection,
        featureProjection: "EPSG:4326",
      });
      let geojson = GeoJSONUtil.writeFeatureObject(olFeature);
      let scaleGeojson = turf.transformScale(geojson, factor);

      let scaleOlFeature = GeoJSONUtil.readFeature(scaleGeojson, {
        dataProjection: "EPSG:4326",
        featureProjection: this.innerOption.map.projection,
      });
      this.innerOption.map.olView.fit(
        scaleOlFeature.getGeometry().getExtent(),
        {
          duration: 1500,
        }
      );
    }
  }
}
