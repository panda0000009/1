import OLVectorLayer from "ol/layer/Vector";
import OLVectorSource from "ol/source/Vector";
import { buildStyle } from "../../style/Style.js";
import GeoJSONUtil from "../../util/GeojsonUtil.js";
import {
  TempLyrDefaultStyle,
  TempFeatureFlashStyle,
} from "../../config/MapDefaultConfig.js";
import { TEMP_LAYER_NAME } from "../../config/LayerConstantConfig.js";

export default function (map) {
  let innerFeatures = [];
  let tmpVecLyr = null;

  const getFeature = (featName) => {
    let featItem = innerFeatures.find((n) => n.featName == featName);
    return featItem ? featItem.feature : null;
  };

  const addFeature = (featName, feature, flash = true) => {
    if (!featName || typeof featName != "string") {
      throw new Error("featName is required");
    }

    // 创建临时图层
    createTempLyr();

    assertNewFeature(featName);
    innerFeatures.push({ featName, feature });

    let olFeature = null;
    if (feature?.features?.length) {
      let olFeatures = GeoJSONUtil.readFeatures(feature);
      olFeature = olFeatures[0];
      olFeatures.forEach((m, index) => {
        m.set(TEMP_LAYER_NAME, 'Temp_' + index);
      })
      tmpVecLyr.getSource().addFeatures(olFeatures);
    } else {
      olFeature = GeoJSONUtil.readFeature(feature);
      olFeature.set(TEMP_LAYER_NAME, featName);
      tmpVecLyr.getSource().addFeature(olFeature);
    }

    // 闪烁要素
    if (flash) {
      flashFeatture(olFeature);
    }
  };

  const flashFeatture = (olFeature) => {
    let flashTimes = 0;
    let flashFeat = window.setInterval(() => {
      if (flashTimes == 6) {
        olFeature.setStyle(null);
        window.clearInterval(flashFeat);
        flashTimes = 0;
        return;
      }
      if (flashTimes % 2 == 0) {
        olFeature.setStyle(buildStyle(TempFeatureFlashStyle));
      } else {
        olFeature.setStyle(null);
      }
      flashTimes++;
    }, 500);
  };

  const createTempLyr = () => {
    if (!tmpVecLyr) {
      tmpVecLyr = new OLVectorLayer({
        source: new OLVectorSource(),
        style: buildStyle(TempLyrDefaultStyle),
        zIndex: 100,
      });
      map.layerManager.addLayer(TEMP_LAYER_NAME, { ol: tmpVecLyr });
    }
  };

  const assertNewFeature = (featName) => {
    if (innerFeatures.find((n) => n.featName == featName)) {
      throw new Error("Duplicate feature");
    }
  };

  const removeFeature = (featName) => {
    if (innerFeatures.find((n) => n.featName == featName)) {
      let selFeat = tmpVecLyr
        .getSource()
        .getFeatures()
        .find((n) => n.get(TEMP_LAYER_NAME) == featName);
      if (selFeat) {
        tmpVecLyr.getSource().removeFeature(selFeat);
      }
      innerFeatures = innerFeatures.filter((n) => n.featName != featName);
    }
  };

  const removeFeatures = () => {
    if (innerFeatures && innerFeatures.length) {
      tmpVecLyr.getSource().clear();
      innerFeatures.length = 0;
    }
  };

  return {
    getFeature,
    addFeature,
    removeFeature,
    removeFeatures,
  };
}
