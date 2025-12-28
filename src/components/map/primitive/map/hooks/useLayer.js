export default function (map) {
  let innerLayers = [];

  const getLayer = (lyrName) => {
    let lyrItem = innerLayers.find((n) => n.lyrName == lyrName);
    return lyrItem ? lyrItem.layer : null;
  };

  const addLayer = (lyrName, layer) => {
    if (!lyrName || typeof lyrName != "string") {
      throw new Error("lyrName is required");
    }
    assertNewLayer(lyrName);
    innerLayers.push({ lyrName, layer });
    map.addLayer(layer.ol);
  };

  const assertNewLayer = (lyrName) => {
    if (innerLayers.find((n) => n.lyrName == lyrName)) {
      // throw new Error("Duplicate Layer");
      removeLayer(lyrName)
    }
  };

  const removeLayer = (lyrName) => {
    if (innerLayers.find((n) => n.lyrName == lyrName)) {
      map.removeLayer(innerLayers.find((n) => n.lyrName == lyrName).layer.ol);
      innerLayers = innerLayers.filter((n) => n.lyrName != lyrName);
    }
  };

  return {
    innerLayers,
    getLayer,
    addLayer,
    removeLayer,
  };
}
