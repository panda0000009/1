import OLOverlay from "ol/Overlay";

export default class OverlayTool {
//   option: object 具体配置如下
//   {
//     id?: number | string;
//     element?: HTMLElement;
//     offset?: number[];
//     position?: number[];
//     positioning?: any | string;
//     stopEvent?: boolean;
//     insertFirst?: boolean;
//     autoPan?: boolean;
//     autoPanAnimation?: {
//         duration?: number;
//         easing?: (p0: number) => number;
//     };
//     autoPanMargin?: number;
//     className?: string;
//     toCenter?: boolean;
//   }
  constructor(option) {
    this.innerOption = option;
    this.overlay = new OLOverlay(option);
  }

  innerOption = null;
  overlay = null;

  //这里做约束必须具有这个属性
  get name() {
    return "Overlay";
  }

  //这里做约束必须具有这个属性
  get ol() {
    return this.overlay;
  }

  //这里做约束必须具有这个属性
  get option() {
    return this.innerOption
  }

  // position: number[]
  positionTo(position) {
    this.overlay.setPosition(position);
  }

  // element: HTMLElement
  bindElement(element) {
    this.overlay.setElement(element);
  }
}
