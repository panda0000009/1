import emitter from "../../../utils/eventbus";

export default function (map) {
  let throttleTimer = null;
  let lastCoordinate = null;
  const THROTTLE_DELAY = 50; // 节流延迟，减少事件发射频率
  const COORDINATE_THRESHOLD = 0.0001; // 坐标变化阈值

  map.on("pointermove", (evt) => {
    if (evt.dragging) {
      return;
    }

    // 节流处理
    if (throttleTimer) {
      return;
    }

    throttleTimer = setTimeout(() => {
      throttleTimer = null;

      // 检查坐标是否显著变化
      if (lastCoordinate) {
        const dx = Math.abs(evt.coordinate[0] - lastCoordinate[0]);
        const dy = Math.abs(evt.coordinate[1] - lastCoordinate[1]);
        if (dx < COORDINATE_THRESHOLD && dy < COORDINATE_THRESHOLD) {
          return;
        }
      }
      lastCoordinate = evt.coordinate;

      emitter.emit("coordinates", evt.coordinate);
    }, THROTTLE_DELAY);
  });
}
