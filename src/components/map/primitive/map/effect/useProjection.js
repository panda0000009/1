import OLProjection from 'ol/proj/Projection'
import { buildProjection } from "../../util/ProjectionUtil";
import { get as getProjection } from 'ol/proj'

export default function (val) {
  let projection = "EPSG:3857";
  let projObj = getProjection(val);
  if (projObj instanceof Object && projObj instanceof OLProjection) {
    projection = projObj;
  } else if (val instanceof Object && !(val instanceof OLProjection)) {
    projection = buildProjection(val);
  } else {
    projection = val;
  }
  
  return projection;
}
