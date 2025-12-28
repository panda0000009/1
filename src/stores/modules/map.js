import { defineStore } from 'pinia'

export const useMapStore = defineStore('map', {
  state: () => ({
    // userInfo: userInfo || null,
    activeMap: null,
    splitScrnList: [],
    mapDefaultOption: {
      viewOptions: {
        projection: 'EPSG:4326',
        center: [113.276879, 23.14225],
        extent: [111.54096489580995, 22.2749425372808, 115.46759553603398, 24.013367564496765],
        zoom: 7.5,
        minZoom: 1,
        maxZoom: 16,
      },
    }
  }),

  actions: {
    setActiveMap(v) {
      this.activeMap = v
    },
    setSplitScrn(name, map) {
      let mapObj = this.splitScrnList.find(n => n.name == name);
      if (mapObj) {
        mapObj.map = map;
      } else {
        this.splitScrnList.push({ name, map })
      }
    },
  },
  getters: {},
})
