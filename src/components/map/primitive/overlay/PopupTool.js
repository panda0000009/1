import OLOverlay from "ol/Overlay";
import OLPopup from "ol-ext/overlay/Popup";

export default class PopupTool {

//   option: object 具体配置如下
//   {
//     popupClass: PopupClass;
//     onclose: () => {};
//     onshow: () => {};
//     toCenter: boolean;
//     positioning: Positioning;
//     autoPan: {
//       animation: {
//         duration: number
//       }
//     };
//   }
  constructor(option) {
    this.innerOption = Object.assign({
      positioning: Positioning.BottomCenter,
      popupClass: PopupClass.Anim,
      closeBox: true,
      autoPan: {
        animation: {
          duration: 200
        }
      }
    }, option);
    this.popup = new OLPopup(this.innerOption);
  }

  innerOption = null;
  popup = null;

  //这里做约束必须具有这个属性
  get name() {
    return "Popup";
  }

  //这里做约束必须具有这个属性
  get ol() {
    return this.popup;
  }

  //这里做约束必须具有这个属性
  get option() {
    return this.innerOption
  }

  show(map, position, content) {
    map.overlayManager.removeOverlay(this.name);
    map.overlayManager.addOverlay(this.name, { ol: this.popup });
    this.popup.show(position, content); 
    if (this.innerOption?.toCenter) {
      let { resolution, zoom } = map.mapOptions.viewOptions;
      if (resolution) {
        zoom = map.olView.getZoomForResolution(resolution);
      }
      map.flyToManager.flyTo(position, zoom);
    }
  }

  close(map) {
    map.overlayManager.removeOverlay(this.name);
  }
  
}

export const Positioning = {
  Auto: 'auto',
  BottomAuto: 'bottom-auto',
  BottomLeft: 'bottom-left',
  BottomCenter: 'bottom-center',
  BottomRight: 'bottom-right',
  TopAuto: 'top-auto',
  TopLeft: 'top-left',
  TopCenter: 'top-center',
  TopRight: 'top-right',
  CenterAuto: 'center-auto',
  CenterLeft: 'center-left',
  CenterRight: 'center-right'
}

export const PopupClass = {
  Default: "default", 
  Anim: "default anim", 
  Tooltips: "tooltips", 
  Warning: "warning", 
  Black: "black", 
  Tips: "tips", 
  Shadow: "shadow",
}


