export class ExportPicture {
  constructor(option) {
    this.innerOption = option;
  }

  innerOption = null;

  //这里做约束必须具有这个属性
  get name() {
    return "ExportPicture";
  }

  //这里做约束必须具有这个属性
  get option() {
    return this.innerOption;
  }

  exportPic(map) {
    map.olMap.once("rendercomplete", () => {
      let mapCanvas = document.createElement("canvas");
      let size = map.olMap.getSize();
      mapCanvas.width = size[0];
      mapCanvas.height = size[1];
      let mapContext = mapCanvas.getContext("2d");

      Array.prototype.forEach.call(
        document.querySelectorAll(".ol-layer canvas"),
        (canvas) => {
          if (canvas.width > 0) {
            let opacity = canvas.parentNode.style.opacity;
            mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
            let transform = canvas.style.transform;
            let matrix = transform
              .match(/^matrix\(([^(]*)\)$/)[1]
              .split(",")
              .map(Number);
            CanvasRenderingContext2D.prototype.setTransform.apply(
              mapContext,
              matrix
            );
            mapContext.drawImage(canvas, 0, 0);
          }
        }
      );
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(
          mapCanvas.msToBlob(),
          this.innerOption
            ? this.innerOption.name + "." + this.innerOption.type
            : "map.png"
        );
      } else {
        let link = document.createElement("a");
        link.href = mapCanvas.toDataURL();
        link.download = this.innerOption
          ? this.innerOption.name + "." + this.innerOption.type
          : "map.png";
        link.click();
      }
    });
    map.olMap.renderSync();
  }
}

export let PictureType = {
  PNG: "png",
  JPG: "jpg",
  JPEG: "jpeg",
};
