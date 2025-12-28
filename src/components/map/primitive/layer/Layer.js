import { buildVectorLayer } from "./VectorLayer.js";
import { buildXYZLayer } from "./XYZLayer.js";
import { buildGroupLayer } from "./GroupLayer.js";
import { buildArcGISRestLayer } from "./ArcGISRestLayer.js";
import { buildArcGISTileLayer } from "./ArcGISTileLayer.js";
import { buildArcGISImageLayer } from "./ArcGISImageLayer.js";
import { buildHeatmapLayer } from "./HeatmapLayer.js";
import { buildWindLayer } from "./WindLayer.js";
import { buildGeoServerTileLayer } from "./GeoServerTileLayer.js";
import { buildGeoServerImageLayer } from "./GeoServerImageLayer.js";
import { buildGeoServerWmtsLayer } from "./GeoServerWmtsLayer.js";
import { buildClusterLayer } from "./ClusterLayer.js"
import { buildGeoTIFFLayer } from './GeoTIFFLayer.js'

/**
 * 创建图层
 */
export default function (type, lyrOptions) {
  switch (type) {
    case LayerType.ArcGISRest:
      return buildArcGISRestLayer(lyrOptions);
    case LayerType.ArcGISTile:
      return buildArcGISTileLayer(lyrOptions);
    case LayerType.ArcGISImage:
      return buildArcGISImageLayer(lyrOptions);
    case LayerType.GeoServerTile:
      return buildGeoServerTileLayer(lyrOptions);
    case LayerType.GeoServerImage:
      return buildGeoServerImageLayer(lyrOptions);
    case LayerType.GeoServerWmts:
      return buildGeoServerWmtsLayer(lyrOptions);
    case LayerType.Vector:
      return buildVectorLayer(lyrOptions);
    case LayerType.Cluster:
      return buildClusterLayer(lyrOptions);
    case LayerType.XYZ:
      return buildXYZLayer(lyrOptions);
    case LayerType.Heatmap:
      return buildHeatmapLayer(lyrOptions);
    case LayerType.Wind:
      return buildWindLayer(lyrOptions);
    case LayerType.Group:
      return buildGroupLayer(lyrOptions);
    case LayerType.GeoTIFF:
      return buildGeoTIFFLayer(lyrOptions);
    default:
  }
}

/**
 * 图层类型枚举
 */
export const LayerType = {
  ArcGISRest: "arcgisrest",
  ArcGISTile: "arcgistile",
  ArcGISImage: "arcgisimage",
  Cluster: "cluster",
  GeoServerTile: "geoservertile",
  GeoServerImage: "geoserverimage",
  GeoServerWmts: "geoserverwmts",
  Heatmap: "heatmap",
  Wind: "wind",
  Vector: "vector",
  XYZ: "xyz",
  Group: "group",
  GeoTIFF: 'geotiff'
};
