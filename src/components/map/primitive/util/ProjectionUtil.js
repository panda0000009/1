import proj4 from 'proj4'
import { register } from 'ol/proj/proj4'
import OLProjection from 'ol/proj/Projection'
import { addProjection, transform as OLTransform, get as getProjection } from 'ol/proj';
import GeoJSONUtil from './GeojsonUtil'

export function buildProjection({ code, projection, unit = undefined, extent = undefined }) {
  // 地图框架默认配置
  if (["EPSG:4326", "EPSG:3857"].includes(code)) {
    return getProjection(code);
  } else {
    proj4.defs(code, projection)
    register(proj4)
    let proj = new OLProjection({
      code: code,
      units: unit,
      extent: extent,
      // axisOrientation: 'neu',
      global: false,
    })
    addProjection(proj);
    return proj;
  }
}

export function transfrom(coords, sourceProj, targetProj) {
  return OLTransform(coords, sourceProj, targetProj);
}

export function transfromGeojson(geojson, sourceProj, targetProj) {
  if (geojson.type == 'FeatureCollection') {
    return GeoJSONUtil.writeFeaturesObject(GeoJSONUtil.readFeatures(geojson, {
      dataProjection: sourceProj,
      featureProjection: targetProj
    }))
  } else {
    return GeoJSONUtil.writeFeatureObject(GeoJSONUtil.readFeature(geojson, {
      dataProjection: sourceProj,
      featureProjection: targetProj
    }))
  }
}
