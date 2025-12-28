import emitter from "../../../utils/eventbus";

export default function (map) {
  map.on('loadstart', function () {
    // map.getTargetElement().classList.add('spinner');
  });
  map.on('loadend', function () {
    // map.getTargetElement().classList.remove('spinner');
    // emitter.emit("mapLoadend");
  });
}
