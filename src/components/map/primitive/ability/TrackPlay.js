import Path from "ol-ext/featureanimation/Path";
import OLFeature from "ol/Feature";
import OLVectorLayer from "ol/layer/Vector";
import OLVectorSource from "ol/source/Vector";
import { Point } from "ol/geom";
import { buildVectorLayer } from "../layer/VectorLayer";
import { buildStyle } from "../style/Style";
import GeoJSONUtil from "../util/GeojsonUtil.js";
import OLStyle from "ol/style/Style";
import { RegularShape, Fill } from "ol/style"
import { getCenter } from 'ol/extent'

export class TrackPlay {
  constructor(option) {
    this.innerOption = option;
  }

  innerOption = null;
  trackLyr = null;
  LAYER_NAME = "trackPlayLyr";
  playPath = null;

  // option 参数
  // map: 地图对象
  // geojson: 线数据
  // lyrStyle: 图层样式
  // rotation: 沿线改变方向
  // easing: 缓解
  // speed: 播放速度 0~3
  // revers： 反转
  start(option) {
    this.innerOption = option;
    // this.trackLyr = buildVectorLayer({
    //   name: this.LAYER_NAME,
    //   geojson: {
    //     type: "FeatureCollection",
    //     features: [option.geojson],
    //   },
    //   lyrStyle: option.lyrStyle,
    // });
    // this.trackLyr.ol

    let source = new OLVectorSource();
  if (option.geojson) {
    source.addFeature(GeoJSONUtil.readFeature(option.geojson));
  }
  this.trackLyr = new OLVectorLayer({
    source: source,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    zIndex: 100,
    style: buildStyle(option.lyrStyle)
  });
    option.map.lyrManager.addLayer(this.LAYER_NAME, { ol: this.trackLyr });
 
        this.playPath = source.getFeatures()[0]

      this.animateFeature();
  }


  f = null;
  anim = null;
  animateFeature() {
    if (this.playPath) {
      this.f = new OLFeature(new Point([0, 0]));
      // if (this.innerOption.rotation) {
      //   this.f.setStyle(buildStyle(this.innerOption.styleTriangle));
      // } else {
        this.f.setStyle(buildStyle(this.innerOption.lyrStyle));
      // }
      this.anim = new Path({
        path: this.playPath,
        rotate: true,
        easing: 'linear',
        speed: 0.5,
        revers: false,
      });
      // this.anim.on('drawing', function (e) {
      //   // if (e.time > 5000) e.style = [
      //   //   new OLStyle({
      //   //     image: new RegularShape({
      //   //       radius: 10,
      //   //       radius2: 5,
      //   //       points: 5,
      //   //       fill: new Fill({ color: 'red' })
      //   //     })
      //   //   })
      //   // ];
      // })

      // let asd = this.trackLyr.animateFeature(this.f, this.anim);
      function animateFeature(feature, fanim, useFilter) {
        var listenerKey;
        // Save style
        var style = feature.getStyle();
        var flashStyle = style || (this.getStyleFunction ? this.getStyleFunction()(feature) : null);
        if (!flashStyle) flashStyle=[];
        if (!(flashStyle instanceof Array)) flashStyle = [flashStyle];
        // Structure pass for animating
        var event = {
          // Frame context
          vectorContext: null,
          frameState: null,
          start: 0,
          time: 0,
          elapsed: 0,
          extent: false,
          // Feature information
          feature: feature,
          geom: feature.getGeometry(),
          typeGeom: feature.getGeometry().getType(),
          bbox: feature.getGeometry().getExtent(),
          coord: getCenter(feature.getGeometry().getExtent()),
          style: flashStyle
        };
        if (!(fanim instanceof Array)) fanim = [fanim];
        // Remove null animations
        for (var i=fanim.length-1; i>=0; i--) {
          if (fanim[i].duration_===0) fanim.splice(i,1);
        }
        var nb=0, step = 0;
        // Filter availiable on the layer
        var filters = (useFilter && this.getFilters) ? this.getFilters() : [];
        function animate(e) {
          event.type = e.type;
          try {
            event.vectorContext = e.vectorContext || ol.render.getVectorContext(e);
          } catch(e) { /* nothing todo */ }
          event.frameState = e.frameState;
          event.inversePixelTransform = e.inversePixelTransform;
          if (!event.extent) {
            event.extent = e.frameState.extent;
            event.start = e.frameState.time;
            event.context = e.context;
          }
          event.time = e.frameState.time - event.start;
          event.elapsed = event.time / fanim[step].duration_;
          if (event.elapsed > 1) event.elapsed = 1;
          // Filter
          e.context.save();
          filters.forEach(function(f) {
            if (f.get('active')) f.precompose(e);
          });
          if (this.getOpacity) {
            e.context.globalAlpha = this.getOpacity();
          }
          // Before anim
          /*
          var beforeEvent = { 
            type: 'beforeanim', 
            step: step,
            start: event.start,
            time: event.time,
            elapsed: event.elapsed,
            rotation: event.rotation||0,
            geom: event.geom,
            coordinate: event.coord,
            feature: feature,
            extra: event.extra || {}, 
            style: flashStyle
          };
          fanim[step].dispatchEvent(beforeEvent);
          this.trackLyr.dispatchEvent(beforeEvent);
          */
          // Stop animation?
          if (!fanim[step].animate(event)) {
            nb++;
            // Repeat animation
            if (nb < fanim[step].repeat_) {
              event.extent = false;
            } else if (step < fanim.length-1) {
              // newt step
              fanim[step].dispatchEvent({ type:'animationend', feature: feature });
              step++;
              nb=0;
              event.extent = false;
            } else {
              // the end
              stop();
            }
          } else {
            var animEvent = { 
              type: 'animating', 
              step: step,
              start: event.start,
              time: event.time,
              elapsed: event.elapsed,
              rotation: event.rotation||0,
              geom: event.geom,
              coordinate: event.coord,
              feature: feature,
              extra: event.extra || {}, 
              style: flashStyle
            };
            fanim[step].dispatchEvent(animEvent);
            this.trackLyr.dispatchEvent(animEvent);
          }
          filters.forEach(function(f) {
            if (f.get('active')) f.postcompose(e);
          });
          e.context.restore();
          // tell OL3 to continue postcompose animation
          e.frameState.animate = true;
        }
        // Stop animation
        function stop(options) {
          ol.Observable.unByKey(listenerKey);
          listenerKey = null;
          feature.setStyle(style);
          event.stop = (new Date).getTime();
          // Send event
          var eventEnd = { type:'animationend', feature: feature };
          if (options) {
            for (var i in options) if (options.hasOwnProperty(i)) {
              eventEnd[i] = options[i]; 
            }
          }
          fanim[step].dispatchEvent(eventEnd);
          this.trackLyr.dispatchEvent(eventEnd);
        }
        // Launch animation
        function start(options) {
          if (fanim.length && !listenerKey) {
            // Restart at stop time
            if (event.stop) {
              event.start = (new Date).getTime() - event.stop + event.start;
              event.stop = 0;
            }
            // Compose
            listenerKey = this.trackLyr.on(['postcompose','postrender'], animate.bind(this));
            // map or layer?
            if (this.trackLyr.renderSync) {
              try { this.trackLyr.renderSync(); } catch(e) { /* ok */ }
            } else {
              this.trackLyr.changed();
            }
            // Hide feature while animating
            feature.setStyle(fanim[step].hiddenStyle || ol.featureAnimation.hiddenStyle);
            // Send event
            var eventStart = { type:'animationstart', feature: feature };
            if (options) {
              for (var i in options) if (options.hasOwnProperty(i)) {
                eventStart[i] = options[i]; 
              }
            }
            fanim[step].dispatchEvent(eventStart);
            this.trackLyr.dispatchEvent(eventStart);
          }
        }
        start();
        // Return animation controler
        return {
          start: start,
          stop: stop,
          isPlaying: function() { return (!!listenerKey); }
        };
      };
           
      animateFeature(this.f, this.anim).bind(this);
    }
  }
}

export const Easing = {
  Linear: "linear",
  EaseOut: "easeOut",
  EaseIn: "easeIn",
  InAndOut: "inAndOut",
};
