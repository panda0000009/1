import Swipe from "ol-ext/control/Swipe"
import { LayerType } from "../layer/Layer";
import _ from "lodash"

export class SwipeTool2 {
  constructor(option) {
    this.innerOption = option;
    
  }

  innerOption = null;
  swipeTool = null;
  isStarted = false;

  //这里做约束必须具有这个属性
  get name() {
    return "SwipeTool2";
  }

  //这里做约束必须具有这个属性
  get option() {
    return this.innerOption;
  }

  start({ map, leftLyrs, rightLyrs }) {
    if (!this.isStarted) {
      this.create(map);
      this.addLayer(map, leftLyrs);
      this.addLayer(map, rightLyrs, true);
      this.isStarted = true;
    }
  }

  addLayer(map, lyrNames, isRight = false) {
    let selLyrs = lyrNames.map(lyrName => {
      return map.layerManager.getLayer(lyrName);
    }).filter(Boolean);
    let lyrs = selLyrs.map(lyr => {
      if (lyr.type == LayerType.Group) {
        return lyr.subLyrs.map(subLyr => subLyr.layer);
      } else {
        return lyr;
      }
    })
    lyrs = _.flattenDeep(lyrs).map(lyr => lyr.ol);
    if (lyrs?.length) {
      this.swipeTool.addLayer(lyrs, isRight);
    }
  }

  create(map) {
    this.swipeTool = new Swipe({
      position: 0.5,
      orientation: SwipeType.Vertical
    });
    map.ctrlManager.addControl(this.name, { ol: this.swipeTool });
  }

  finish(map) {
    if (this.isStarted && this.swipeTool) {
      this.swipeTool.removeLayers();
      map.ctrlManager.removeControl(this.name);
      this.swipeTool = null;
      this.isStarted = false;
    }
  }

  setSwipeType(type) {
    if (this.isStarted && this.swipeTool) {
      this.swipeTool.set('orientation', type);
    }
  }

}

export const SwipeType = {
  Horizontal: "horizontal",
  Vertical: "vertical",
};
