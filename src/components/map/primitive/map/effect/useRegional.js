import GeoJSONUtil from "../../util/GeojsonUtil.js";
import { LayerType } from "../../layer/Layer.js";
import { getVectorContext } from "ol/render";
import { buildStyle } from "../../style/Style.js";
import Crop from "ol-ext/filter/Crop";
import Mask from "ol-ext/filter/Crop";

export default function (map) {
  let regionalGeometry = null;
  let crop = null;
  let mask = null;

  const rangePostrender = (range, lyrs) => {
    regionalGeometry = range;
    let olFeature = GeoJSONUtil.readFeature(range);

    crop = new Crop({
      feature: olFeature,
      wrapX: true,
      inner: false,
    });
    mask = new Mask({
      feature: olFeature,
      wrapX: true,
      inner: false,
      fill: buildStyle({
        fill: {
          color: [255, 255, 255, 0.8],
        },
      }).getFill(),
    });

    crop.set("shadowWidth", 10);
    mask.set("shadowWidth", 10);
    mask.setFillColor("rgba(0,0,255,0.2)");
    crop.set("active", false);
    mask.set("active", true);

    lyrs.forEach((lyr) => {
      if (lyr.layer.type == LayerType.Group) {
        let subLyrs = lyr.layer.getLayers();
        if (subLyrs?.length) {
          subLyrs.forEach((subLyr) => {
            clipLayer(subLyr.layer);
          });
        }
      } else {
        clipLayer(lyr.layer);
      }
    });
  };

  const clipLayer = (lyr) => {
    lyr.ol.addFilter(crop);
    lyr.ol.addFilter(mask);
  };

  return {
    regionalGeometry,
    rangePostrender,
  };
}
