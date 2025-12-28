import { getRenderPixel } from "ol/render";
import { LayerType } from "../layer/Layer";

export class SwipeTool {
  constructor(option) {
    this.innerOption = option;
  }

  innerOption = null;

  //这里做约束必须具有这个属性
  get name() {
    return "SwipeTool";
  }

  //这里做约束必须具有这个属性
  get option() {
    return this.innerOption;
  }

  swipeRate({ swipeLayers, swipeMode, splitRate }) {
    this.innerOption.splitRate = splitRate;
    this.innerOption.swipeMode = swipeMode;
    this.innerOption.layers = swipeLayers.map((m) =>
      this.innerOption.map.layerManager.getLayer(m)
    );

    this.innerOption.layers.forEach((lyr) => {
      if (lyr.type == LayerType.Group) {
        let lyrs = lyr.getLayers().map((m) => m.layer);
        if (lyrs?.length) {
          lyrs.forEach((subLyr) => {
            this.prerender(subLyr);
          });
        }
      } else {
        this.prerender(lyr);
      }
    });
    this.innerOption.layers.forEach((lyr) => {
      if (lyr.type == LayerType.Group) {
        let lyrs = lyr.getLayers().map((m) => m.layer);
        if (lyrs?.length) {
          lyrs.forEach((subLyr) => {
            this.postrender(subLyr);
          });
        }
      } else {
        this.postrender(lyr);
      }
    });
    this.innerOption.map.olMap.render();
  }

  prerender(lyr) {
    lyr.ol.on(
      "prerender",
      ((evt) => {
        let ctx = evt.context;
        let mapSize = this.innerOption.map.olMap.getSize();
        // let [tl, tr, bl, br] = [[0, 0], [0, 0], [0, 0][(0, 0)]];
        let points = [];
        if (this.innerOption.swipeMode == SwipeType.Horizontal) {
          // 左右分屏
          let width = mapSize[0] * (this.innerOption.splitRate / 100);
          points.push(getRenderPixel(evt, [width, 0]));
          points.push(getRenderPixel(evt, [width, mapSize[1]]));
          points.push(getRenderPixel(evt, mapSize));
          points.push(getRenderPixel(evt, [mapSize[0], 0]));
        }
        if (this.innerOption.swipeMode == SwipeType.Vertical) {
          //上下分屏
          let height = mapSize[1] * (this.innerOption.splitRate / 100);
          points.push(getRenderPixel(evt, [0, height]));
          points.push(getRenderPixel(evt, [0, mapSize[1]]));
          points.push(getRenderPixel(evt, mapSize));
          points.push(getRenderPixel(evt, [mapSize[0], height]));
        }
        if (this.innerOption.swipeMode == SwipeType.LeftTop) {
          //左上分屏
          let width = this.innerOption.splitRate * 0.02 * mapSize[0];
          let height = this.innerOption.splitRate * 0.02 * mapSize[1];
          points.push(getRenderPixel(evt, [0, 0]));
          points.push(getRenderPixel(evt, [0, mapSize[1] - height]));
          points.push(getRenderPixel(evt, [width, mapSize[1]]));
          points.push(getRenderPixel(evt, mapSize));
          points.push(getRenderPixel(evt, [mapSize[0], 0]));
        }
        if (this.innerOption.swipeMode == SwipeType.RightTop) {
          //右上分屏
          let width = this.innerOption.splitRate * 0.02 * mapSize[0];
          let height = this.innerOption.splitRate * 0.02 * mapSize[1];
          points.push(getRenderPixel(evt, [width, 0]));
          points.push(getRenderPixel(evt, [0, height]));
          points.push(getRenderPixel(evt, [0, mapSize[1]]));
          points.push(getRenderPixel(evt, mapSize));
          points.push(getRenderPixel(evt, [mapSize[0], 0]));
        }
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        points.forEach((pt) => {
          ctx.lineTo(pt[0], pt[1]);
        });
        ctx.closePath();
        ctx.clip();
      }).bind(this)
    );
  }

  postrender(lyr) {
    lyr.ol.on("postrender", (evt) => {
      let ctx = evt.context;
      ctx.restore();
      this.innerOption.map.olMap.render();
    });
  }
}

export const SwipeType = {
  Horizontal: "Horizontal",
  Vertical: "Vertical",
  LeftTop: "LeftTop",
  RightTop: "RightTop",
};
