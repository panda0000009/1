import { getArea as OLgetArea, getLength as OLgetLength } from 'ol/sphere';
import GeoJSONUtil from './GeojsonUtil';

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