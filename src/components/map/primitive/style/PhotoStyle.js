import OLIcon from "ol/style/Icon";
import OLPhoto from "ol-ext/style/Photo";

export function buildOLPhotoStyle(image) {
  if (image == undefined) {
    return image;
  } else {
    return new OLPhoto(image);
  }
}
