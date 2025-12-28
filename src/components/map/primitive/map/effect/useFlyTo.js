import GeoJSONUtil from "../../util/GeojsonUtil.js";
import { MapInchesPerUnit, MapDotsPerInch, GeoCoordSystemCodes } from "../../config/MapDefaultConfig"

export default function (map) {
  const flyTo = (coords, zoomTo) => {
    let duration = 2000;
    let zoom = map.olView.getZoom();
    if (zoomTo) {
      zoom = (zoom + zoomTo) / 2;
    }
    let parts = 3;
    let called = false;
    function callback() {
      --parts;
      if (called) {
        return;
      }
      if (parts === 0) {
        called = true;
      }
    }
    map.olView.animate(
      {
        center: coords,
        duration: duration,
      },
      callback
    );
    map.olView.animate(
      {
        zoom: zoom,
        duration: duration,
      },
      callback
    );
  };

  const flyToRegion = (region, flash = false) => {
    if (!region) {
      throw new Error("invalid region");
    }
    let ext = GeoJSONUtil.readFeature(region).getGeometry().getExtent();
    map.olView.fit(ext, { 
      padding: [100, 100, 100, 100],
      duration: 1500
    });
    if (flash) {
      map.featureManager.addFeature("FlyTo" + Math.floor(Math.random()*10000), region, flash);
    }
  };

  const flyToScale = (scale) => {
    if (scale) {
      let units = map.projection.getUnits();
      if (!units) {
        units = GeoCoordSystemCodes.includes(map.projection.getCode()) ? 'degrees': 'm';
      }
      let currRes = Number(scale) / MapInchesPerUnit[units] / MapDotsPerInch;
      // 根据分辨率算 zoom 层级，动态缩放
      let zoom = map.olView.getZoomForResolution(currRes);
      let center = map.olView.getCenter();
      flyTo(center,zoom);
      setTimeout(() => {
        map.olView.setResolution(currRes);
      }, 2000);
    }
  }

  return {
    flyTo,
    flyToRegion,
    flyToScale,
  };
}
