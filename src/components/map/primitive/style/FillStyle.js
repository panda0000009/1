import OLFill from 'ol/style/Fill';

export function buildOLFillStyle(fill) {
  if (fill == undefined) {
    return fill;
  } else {
    return new OLFill(fill);
  }
}
