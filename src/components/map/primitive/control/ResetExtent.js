
import * as turf from '@turf/turf';

export class ResetExtent {
  constructor(option) {
    this.innerOption = option;
  }

  innerOption = null;

  //这里做约束必须具有这个属性
  get name() {
    return "ResetExtent";
  }

  //这里做约束必须具有这个属性
  get option() {
    return this.innerOption;
  }

  reset() {
    if (this.innerOption?.map) {
      let { center, resolution, zoom } = this.innerOption.map.mapOptions.viewOptions
      if (center && resolution) {
        zoom = this.innerOption.map.olView.getZoomForResolution(resolution)
        this.innerOption.map.olView.setResolution(resolution);
        this.innerOption.map.flyToManager.flyTo(center, zoom);
        return;
      }
      if (center && zoom) {
        this.innerOption.map.flyToManager.flyTo(center, zoom);
        return;
      }
      let extent = this.innerOption?.map.extent;
      if (extent?.length) {
        this.innerOption?.map.flyToManager.flyToRegion(turf.bboxPolygon(extent))
      }
    }
  }

}
