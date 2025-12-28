export default function (map) {
  let innerOverlays = [];

  const getOverlay = (overlayName) => {
    let overlayItem = innerOverlays.find((n) => n.overlayName == overlayName);
    return overlayItem ? overlayItem.overlay : null;
  };

  const addOverlay = (overlayName, overlay) => {
    if (!overlayName || typeof overlayName != "string") {
      throw new Error("overlayName is required");
    }
    assertNewOverlay(overlayName);
    innerOverlays.push({ overlayName, overlay });
    map.addOverlay(overlay.ol);
  };

  const assertNewOverlay = (overlayName) => {
    if (innerOverlays.find((n) => n.overlayName == overlayName)) {
      throw new Error("Duplicate overlay");
    }
  };

  const removeOverlay = (overlayName) => {
    if (innerOverlays.find((n) => n.overlayName == overlayName)) {
      map.removeOverlay(
        innerOverlays.find((n) => n.overlayName == overlayName).overlay.ol
      );
      innerOverlays = innerOverlays.filter((n) => n.overlayName != overlayName);
    }
  };

  const removeOverlays = () => {
    if (innerOverlays && innerOverlays.length) {
      innerOverlays.forEach(item => {
        removeOverlay(item.overlayName);
      })
      innerOverlays.length = 0;
    }
  };

  return {
    innerOverlays,
    getOverlay,
    addOverlay,
    removeOverlay,
    removeOverlays,
  };
}
