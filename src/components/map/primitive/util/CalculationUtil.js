import { getArea as OLgetArea, getLength as OLgetLength } from 'ol/sphere';
import { getCenter as OLGetCenter, extend as OLExtend } from 'ol/extent';
import GeoJSONUtil from './GeojsonUtil';
import * as turf from "@turf/turf"

/**
 * 计算距离
 */
export function getLength(line, projectCode = 'EPSG:3857') {
  let length = OLgetLength(GeoJSONUtil.readFeature(line).getGeometry(), {
    projection: projectCode,
  })
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km'
  } else {
    output = Math.round(length * 100) / 100 + ' ' + 'm'
  }
  return output
}

/**
 * 计算面积
 */
export function getArea(polygon, projectCode = 'EPSG:3857') {
  let area = OLgetArea(GeoJSONUtil.readFeature(polygon).getGeometry(), {
    projection: projectCode,
  });
  let output;
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'k㎡'
  } else {
    output = Math.round(area * 100) / 100 + ' ' + '㎡'
  }
  return output
}

/**
 * 计算亩
 */
export function getMu(polygon, projectCode = 'EPSG:3857') {
  let area = OLgetArea(GeoJSONUtil.readFeature(polygon).getGeometry(), {
    projection: projectCode,
  });
  // 换算成亩
  area = Math.round(area * 0.0015 * 100) / 100;
  let output;
  if (area > 1000) {
    output = Math.round((area / 1000) * 100) / 100 + " " + "千亩";
  } else {
    output = Math.round(area * 100) / 100 + " " + "亩";
  }
  return output;
}

/**
 * 计算中心点
 */
export function getCenter(feature) {
  if (feature.type != "Feature") {
    return turf.center(JSON.parse(feature)).geometry.coordinates;
  }
  let olFeature = GeoJSONUtil.readFeature(feature);
  return OLGetCenter(olFeature.getGeometry().getExtent());
}

/**
 * 获取四至的 Geojson
 */
export function getExtentPolygon(geojson) {
  return turf.bboxPolygon(turf.bbox(geojson));
}

/**
 * 计算四至
 */
export function getExtent(geojson) {
  return (turf.bbox(geojson));
}
