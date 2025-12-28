import emitter from "../../../utils/eventbus";
import { MapInchesPerUnit, MapDotsPerInch, GeoCoordSystemCodes } from "../../config/MapDefaultConfig"

export default function (map) {
  map.on("moveend", (evt) => {
    if (!evt.dragging) {
      let units = evt.frameState.viewState.projection.getUnits();
      if (!units) {
        units = GeoCoordSystemCodes.includes(evt.frameState.viewState.projection.getCode()) ? 'degrees': 'm';
      }
      let scale = evt.frameState.viewState.resolution * MapInchesPerUnit[units] * MapDotsPerInch;
      if (!scale) {
        emitter.emit("scale", "");
      } else {
        emitter.emit("scale", Math.floor(scale));
      }
    }
  });
}
