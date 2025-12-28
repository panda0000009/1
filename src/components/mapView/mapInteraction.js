import FullScreen from 'ol/control/FullScreen.js'
import { ZoomInOut } from '@/components/map/primitive/control/ZoomInOut.js'
import * as turf from "@turf/turf";
import GeoJSONUtil from "@/components/map/primitive/util/GeojsonUtil.js";
import { useMapStore } from '@/stores/modules/map.js'
const mapStore = useMapStore()

let zoomInCtrl = null;
let fullscreenListenerAdded = false;
let zoomTimer = null; // 防抖定时器
let isZooming = false; // 标记是否正在缩放

// 全屏状态改变时，更新地图大小
const handleFullscreenChange = () => {
  setTimeout(() => {
    if (mapStore?.activeMap?.olMap) {
      mapStore.activeMap.olMap.updateSize();
    }
  }, 100);
};

// 初始化全屏监听器（只添加一次）
const initFullscreenListener = () => {
  if (!fullscreenListenerAdded) {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    fullscreenListenerAdded = true;
  }
};

export const zoomIn = () => {
  // 如果正在缩放，忽略本次操作
  if (isZooming) {
    return;
  }

  // 清除之前的定时器
  if (zoomTimer) {
    clearTimeout(zoomTimer);
  }

  // 防抖处理，避免快速点击导致卡死
  zoomTimer = setTimeout(() => {
    zoomIn1();
    zoomTimer = null;
  }, 10);
}

export const zoomOut = () => {
  // 如果正在缩放，忽略本次操作
  if (isZooming) {
    return;
  }

  // 清除之前的定时器
  if (zoomTimer) {
    clearTimeout(zoomTimer);
  }

  // 防抖处理，避免快速点击导致卡死
  zoomTimer = setTimeout(() => {
    zoomOut1();
    zoomTimer = null;
  }, 10);
}

function zoomIn1() {
  if (!mapStore?.activeMap) {
    isZooming = false;
    return;
  }

  const view = mapStore.activeMap.olView;
  if (!view) {
    console.warn("get openlayers view failed");
    isZooming = false;
    return;
  }

  const currentZoom = view.getZoom();
  if (currentZoom !== undefined && currentZoom < 22) {
    isZooming = true;
    const newZoom = currentZoom + 1;

    // 使用 requestAnimationFrame 确保在下一帧执行，避免阻塞主线程
    requestAnimationFrame(() => {
      try {
        // 直接使用 setZoom，更稳定可靠
        view.setZoom(newZoom);

        // 延迟重置标志，确保操作完成
        setTimeout(() => {
          isZooming = false;
        }, 10);
      } catch (error) {
        console.error('缩放操作错误:', error);
        isZooming = false;
      }
    });
  } else {
    isZooming = false;
  }
}

function zoomOut1() {
  if (!mapStore?.activeMap) {
    isZooming = false;
    return;
  }

  const view = mapStore.activeMap.olView;
  if (!view) {
    console.warn("get openlayers view failed");
    isZooming = false;
    return;
  }

  const currentZoom = view.getZoom();
  if (currentZoom !== undefined && currentZoom > 0) {
    isZooming = true;
    const newZoom = currentZoom - 1;

    // 使用 requestAnimationFrame 确保在下一帧执行，避免阻塞主线程
    requestAnimationFrame(() => {
      try {
        // 直接使用 setZoom，更稳定可靠
        view.setZoom(newZoom);

        // 延迟重置标志，确保操作完成
        setTimeout(() => {
          isZooming = false;
        }, 10);
      } catch (error) {
        console.error('缩放操作错误:', error);
        isZooming = false;
      }
    });
  } else {
    isZooming = false;
  }
}

export const fullMap = () => {
  if (!mapStore?.activeMap) {
    console.warn('地图未初始化');
    return;
  }

  // 初始化全屏监听器
  initFullscreenListener();

  // 获取地图容器元素，优先使用地图的 target 元素
  const mapTarget = mapStore.activeMap.olMap?.getTargetElement();
  const mapContainer = mapTarget || document.querySelector('.mapMax') || document.body;

  // 检查当前是否处于全屏状态（兼容不同浏览器）
  const isFullscreen = document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement;

  // 使用浏览器的 Fullscreen API 实现全屏
  if (!isFullscreen) {
    // 进入全屏
    if (mapContainer.requestFullscreen) {
      mapContainer.requestFullscreen().catch(err => {
        console.error('无法进入全屏模式:', err);
      });
    } else if (mapContainer.webkitRequestFullscreen) {
      // Safari 浏览器
      mapContainer.webkitRequestFullscreen();
    } else if (mapContainer.mozRequestFullScreen) {
      // Firefox 浏览器
      mapContainer.mozRequestFullScreen();
    } else if (mapContainer.msRequestFullscreen) {
      // IE/Edge 浏览器
      mapContainer.msRequestFullscreen();
    }
  } else {
    // 退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => {
        console.error('无法退出全屏模式:', err);
      });
    } else if (document.webkitExitFullscreen) {
      // Safari 浏览器
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // Firefox 浏览器
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      // IE/Edge 浏览器
      document.msExitFullscreen();
    }
  }
}

export const resetMap = () => {
  // if (!mapStore?.activeMap?.olView) {
  //   console.warn('地图未初始化');
  //   return;
  // }
  // mapStore.activeMap.olView.fit(mapStore.mapDefaultOption.viewOptions.extent, {
  //   padding: [100, 100, 100, 100],
  //   duration: 1500
  // });
  mapStore.activeMap.olView.fit(mapStore.mapDefaultOption.viewOptions.extent)
}
