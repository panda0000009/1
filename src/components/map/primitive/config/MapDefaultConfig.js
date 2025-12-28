export const MapDefaultOptions = {
  view: {
    projection: "EPSG:4326",
    center: [118.353476543, 35.1040704216],
    zoom: 10,
    minZoom: 8,
    maxZoom: 18,
    // enableRotation: false,
    // constrainRotation: false,
    // extent: []
  },
  // layers: [],
  // controls: [],
  // interactions: [],
  // overlays: []
};

export const TempLyrDefaultStyle = (feature) => {
  return {
    // fill: {
    //   color: "rgba(255, 255, 255, 0.5)",
    // },
    stroke: {
      color: "RGBA(240,220,70, 0.8)",
      width: 1,
    },
    // image: {
    //   rotateWithView: true,
    //   src:
    //     "data:image/svg+xml;utf8," +
    //     encodeURIComponent(
    //       '<svg t="1735046125373" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="115815" width="13" height="13"><path d="M512 512m-480 0a480 480 0 1 0 960 0 480 480 0 1 0-960 0Z" fill="#1296db" p-id="115816" data-spm-anchor-id="a313x.search_index.0.i64.2e1b3a81r5gRve" class="selected"></path><path d="M512 1024a512 512 0 1 1 512-512 512.576 512.576 0 0 1-512 512z m0-960a448 448 0 1 0 448 448A448.512 448.512 0 0 0 512 64z" fill="#2c2c2c" p-id="115817" data-spm-anchor-id="a313x.search_index.0.i65.2e1b3a81r5gRve" class=""></path></svg>'
    //     ),
    //   imgSize: [48, 48], // 及图标大小
    //   offset: [0, 0],
    // },
    // text: {
    //   font: "normal 14px black",
    //   fill: {
    //     color: "blue",
    //   },
    //   text: feature.properties?.name || feature.properties?.code,
    //   offsetY: 35,
    //   stroke: {
    //     color: "rgba(255,255,255,1)",
    //     width: 3,
    //   },
    // },
  };
};

export const TempFeatureFlashStyle = (feature) => {
  return {
    fill: {
      color: "rgba(240,230,140, 0.5)",
    },
    stroke: {
      color: "rgba(240,230,140)",
      width: 3,
    },
    image: {
      rotateWithView: true,
      src:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          '<svg t="1610597702879" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3028" width="48" height="48"><path d="M510.3 71.1c-167 0-302.4 134.7-302.4 300.9s302.4 526.5 302.4 526.5S812.7 538 812.7 371.9 677.3 71.1 510.3 71.1z m0 432.4c-73.1 0-132.3-58.9-132.3-131.6 0-72.7 59.2-131.6 132.3-131.6 73.1 0 132.2 58.9 132.2 131.6 0 72.7-59.1 131.6-132.2 131.6z m0 0" p-id="3029" fill="#f4ea2a"></path><path d="M644 777.9c-8.2 11.3-16.3 22.2-24.1 32.5C700.6 819.7 756 838.8 756 861c0 31.1-110 56.4-245.6 56.4-135.7 0-245.7-25.3-245.7-56.4 0-22.2 55.4-41.3 136.1-50.6-8.1-10.8-16.2-21.6-24.2-32.5-89.2 15.8-149.8 47-149.8 83 0 51.8 126.9 94 283.5 94s283.4-42.2 283.4-94c0-36-60.6-67.1-149.7-83z m0 0" p-id="3030" fill="#f4ea2a"></path></svg>'
        ),
      imgSize: [48, 48], // 及图标大小
      offset: [0, 0],
    },
    text: {
      font: "normal 14px black",
      fill: {
        color: "blue",
      },
      text: feature.properties?.name || "",
      offsetY: 35,
      stroke: {
        color: "rgba(255,255,255,1)",
        width: 3,
      },
    },
  };
};

export const GeoCoordSystemCodes = ['EPSG:4326', 'EPSG:4490']

export const MapInchesPerUnit = {
  'inches': 1.0,
  'ft': 12.0,
  'mi': 63360.0,
  'm': 39.370008,
  'km': 39370,
  'degrees': 4374754,
  'meter': 39.370008,
  'yd': 36
};

export const MapDotsPerInch = 96;