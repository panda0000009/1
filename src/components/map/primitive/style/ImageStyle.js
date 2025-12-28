import OLIcon from "ol/style/Icon";

export function buildOLImageStyle(image) {
  if (image == undefined) {
    return image;
  } else {
    return new OLIcon(image);
  }
}
