import emitter from "../../../utils/eventbus";
import { SYSTEM_LAYERS } from "../../config/LayerConstantConfig.js";
import GeojsonUtil from "../../util/GeojsonUtil.js"

export default function (map, lyrs) {
  map.on("click", (evt) => {
    let lyrClickFeatures = [];
    map.forEachFeatureAtPixel(
      evt.pixel,
      (feature, olLayer) => {
        let layer = lyrs.find((l) => l.layer.ol == olLayer);
        if (layer) {
          lyrClickFeatures.push({
            lyrName: layer.lyrName,
            feature: GeojsonUtil.writeFeatureObject(feature),
            coordinate: evt.coordinate
          })
        }
      },
      {
        layerFilter: (olLayer) => {
          let layer = lyrs.find((l) => l.layer.ol == olLayer);
          return layer?.lyrName && !SYSTEM_LAYERS.includes(layer.lyrName);
        },
        hitTolerance: 10,
      }
    );

    emitter.emit("mapClick", lyrClickFeatures);
  });

  map.on("singleclick", (evt) => {
    emitter.emit("mapSingleClick", {
      coords: evt.coordinate,
      size: evt.frameState.size,
      extent: evt.frameState.extent,
    });
  })
}
