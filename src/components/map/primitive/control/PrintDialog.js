import ExtPrintDialog from "ol-ext/control/PrintDialog";
import jsPDF from "jspdf";
import { saveAs } from 'file-saver';
import emitter from "../../utils/eventbus";

export class PrintDialog {
  constructor(option) {
    this.innerOption = option;
    // 设置中文
    ExtPrintDialog.addLang('zh', {
      title: '打印',
      orientation: '方向',
      portrait: '纵向',
      landscape: '横向',
      size: '页面大小',
      custom: '屏幕大小',
      margin: '外边距',
      scale: '尺度',
      legend: '图例',
      north: '指北针',
      mapTitle: '地图名字',
      saveas: '保存为...',
      saveLegend: '保存图例为...',
      copied: '✔ 已复制到剪贴板',
      errorMsg: '无法保存地图...',
      printBt: '打印...',
      clipboardFormat: '复制到剪贴板...',
      jpegFormat: '另存为 jpeg',
      pngFormat: '另存为 png',
      pdfFormat: '另存为 pdf',
      none: '无',
      small: '小',
      large: '大',  
      cancel: '取消'
    });
    this.printControl = new ExtPrintDialog({
      target: this.innerOption.target,
      className: "",
       lang: this.innerOption.lang
    });
    this.printControl.setSize("A4");
   
  }

  innerOption = null;
  printControl = null;

  //这里做约束必须具有这个属性
  get name() {
    return "PrintDialog";
  }

  //这里做约束必须具有这个属性
  get option() {
    return this.innerOption;
  }

  print() {
    this.innerOption.map.ctrlManager.addControl(this.name, { ol: this.printControl });
    this.printControl.on(["print", "error"], function (e) {
      if (e.image) {
        if (e.pdf) {
          var pdf = new jsPDF({
            orientation: e.print.orientation,
            unit: e.print.unit,
            format: e.print.size,
          });
          pdf.addImage(
            e.image,
            "JPEG",
            e.print.position[0],
            e.print.position[0],
            e.print.imageWidth,
            e.print.imageHeight
          );
          pdf.save(e.print.legend || "map.pdf");
        } else {
          e.canvas.toBlob(
            function (blob) {
              var name =
                (e.print.legend || "map") +
                e.imageType.replace("image/", "");
                saveAs(blob, name);
            },
            e.imageType,
            e.quality
          );
        }
      } else {
        emitter.emit("printfail", "打印失败");
      }
    });
    this.printControl.print();
    this.printControl.on("hide", () => {
      this.innerOption.map.ctrlManager.removeControl(this.name);
    });
  }
}
