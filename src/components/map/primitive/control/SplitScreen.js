
import OLProtoMap from "../map/OLProtoMap.js";
import emitter from "../../utils/eventbus.js";
import { SYSTEM_LAYERS } from "../config/LayerConstantConfig.js";

export class SplitScreen {

    constructor(option) {
        this.innerOption = option;
        this.innerOption.map.olMap.set('identify', 'ONE_MAP');
    }

    innerOption = null;
    mapCollection = [];

    //这里做约束必须具有这个属性
    get name() {
        return 'SplitScreen';
    }

    //这里做约束必须具有这个属性
    get option() {
        return this.innerOption;
    }

    get maps() {
        return this.mapCollection.map(n => n.map);
    }

    setViewMode(map, mapMode) {
        this.innerOption.mapMode = mapMode;
        this.removeChildMap();
        switch(mapMode) {
            case ViewMode.ONE_MAP:
                this.clearElements(this.innerOption.mainContainer);
                this.innerOption.mainContainer.style = `width: ${this.innerOption.width}px; height: ${this.innerOption.height}px;position: relative;`;
                this.createMap(this.innerOption.mainContainer, `position: absolute;left:0px;box-sizing:border-box; top:0px`, "100%", "100%", "ONE_MAP");
                break;
            case ViewMode.DOUBLE_MAP:
                this.clearElements(this.innerOption.mainContainer);
                this.innerOption.mainContainer.style = `width: ${this.innerOption.width}px; height: ${this.innerOption.height}px;position: relative;`;
                this.createMap(this.innerOption.mainContainer, `position: absolute;left:0px;box-sizing:border-box; top:0px`, "50%", "100%", "ONE_MAP");
                this.createMap(this.innerOption.mainContainer, `position: absolute;left:50%;box-sizing:border-box; top:0px`, "50%", "100%", "TWO_MAP");
                break;
            case ViewMode.THREE_MAP:
                this.clearElements(this.innerOption.mainContainer);
                this.innerOption.mainContainer.style = `width: ${this.innerOption.width}px; height: ${this.innerOption.height}px;position: relative;`;
                this.createMap(this.innerOption.mainContainer, `position: absolute;left:0px;box-sizing:border-box; top:0px`, "50%", "100%", "ONE_MAP");
                this.createMap(this.innerOption.mainContainer, `position: absolute;left:50%;box-sizing:border-box; top:0px`, "50%", "50%", "TWO_MAP");
                this.createMap(this.innerOption.mainContainer, `position: absolute;left:50%;box-sizing:border-box; top:50%`, "50%", "50%", "THREE_MAP");
                break;
            case ViewMode.FOUR_MAP:
                this.clearElements(this.innerOption.mainContainer);
                this.innerOption.mainContainer.style = `width: ${this.innerOption.width}px; height: ${this.innerOption.height}px;position: relative;`;
                this.createMap(this.innerOption.mainContainer, `position: absolute;left:0px;box-sizing:border-box; top:0px`, "50%", "50%", "ONE_MAP");
                this.createMap(this.innerOption.mainContainer, `position: absolute;left:50%;box-sizing:border-box; top:0px`, "50%", "50%", "TWO_MAP");
                this.createMap(this.innerOption.mainContainer, `position: absolute;left:0px;box-sizing:border-box; top:50%`, "50%", "50%", "THREE_MAP");
                this.createMap(this.innerOption.mainContainer, `position: absolute;left:50%;box-sizing:border-box; top:50%`, "50%", "50%", "FOUR_MAP");
                break;
            case ViewMode.SIX_MAP:
                this.clearElements(this.innerOption.mainContainer);
                this.innerOption.mainContainer.style = `width: ${this.innerOption.width}px; height: ${this.innerOption.height}px;position: relative;`;
                this.createMap(this.innerOption.mainContainer, `position: absolute;left:0px;box-sizing:border-box; top:0px`, "70%", "66%", "ONE_MAP");
                this.createMap(this.innerOption.mainContainer, `position: absolute;left:70%;box-sizing:border-box; top:0px`, "30%", "33%", "TWO_MAP");
                this.createMap(this.innerOption.mainContainer, `position: absolute;left:70%;box-sizing:border-box; top:33%`, "30%", "33%", "THREE_MAP");
                this.createMap(this.innerOption.mainContainer, `position: absolute;left:0px;box-sizing:border-box; top:66%`, "35%", "34%", "FOUR_MAP");
                this.createMap(this.innerOption.mainContainer, `position: absolute;left:35%;box-sizing:border-box; top:66%`, "35%", "34%", "FIVE_MAP");
                this.createMap(this.innerOption.mainContainer, `position: absolute;left:70%;box-sizing:border-box; top:66%`, "30%", "34%", "SIX_MAP");
                break;
        }
        this.mainMapClickHandler();

    }

    clearElements(node){
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    createMap(mainnContainer, display, width, height, identify) {
        if (this.innerOption.map) {
            let cloneMapContainer = document.createElement("div");
            if (this.innerOption.mapMode == ViewMode.ONE_MAP) {
                cloneMapContainer.style = `${display};width: ${width}; height: ${height};`;
            } else {
                cloneMapContainer.style = `${display};width: ${width}; height: ${height}; border:solid blue 2px`;
            }
            mainnContainer.appendChild(cloneMapContainer);
            let cloneMap = new OLProtoMap(this.innerOption.mapOption, cloneMapContainer);
            cloneMap.olMap.set('identify', identify);
            this.addDataTochildMap(cloneMap);
            cloneMap.olMap.on('click', evt => {
                emitter.emit("activemap", { mapName: evt.map.get('identify'), map: this.mapCollection.find(n => n.identify == evt.map.get('identify')).map });
                let nodes = this.innerOption.mainContainer.children;
                for(let i = 0;i < nodes.length;i ++ ){
                    if (this.innerOption.mapMode != ViewMode.ONE_MAP) {
                        nodes[i].style.border =  "solid blue 2px"
                    }
                }
                if (this.innerOption.mapMode != ViewMode.ONE_MAP) {
                    cloneMapContainer.style.border = `solid red 2px`;
                }
            })
            this.mapCollection.push({
                div: cloneMapContainer,
                map: cloneMap,
                identify: identify
            });
        }
    }

    mainMapClickHandler() {
        emitter.emit("activemap", { mapName: 'ONE_MAP', map: this.mapCollection.find(n => n.identify == 'ONE_MAP').map });
        let nodes = this.innerOption.mainContainer.children;
        for(let i = 0;i < nodes.length;i ++ ){
            if (this.innerOption.mapMode != ViewMode.ONE_MAP) {
                nodes[i].style.border =  "solid blue 2px"
            }
        }
        if (this.innerOption.mapMode != ViewMode.ONE_MAP) {
            this.mapCollection.find(n => n.identify == 'ONE_MAP').div.style.border = `solid red 2px`;
        }
    }

    addDataTochildMap(childMap) {
        if (childMap) {
            // 添加图层
            // let lyrs = this.innerOption.map.layers;
            // if (lyrs && lyrs.length) {
            //     for (const lyr of lyrs) {
            //         if (lyr.layer && lyr.layer.clone) {
            //             childMap.layerManager.addLayer(lyr.lyrName, lyr.layer.clone());
            //         }
            //     }
            // }
            let lyrs = this.innerOption.map.layers;
            if (lyrs && lyrs.length) {
                for (const lyr of lyrs) {
                    if (lyr.layer && lyr.layer.clone && SYSTEM_LAYERS.includes(lyr.lyrName)) {
                        childMap.layerManager.addLayer(lyr.lyrName, lyr.layer.clone());
                    }
                }
            }
            //添加临时要素
            // let feats = this.innerOption.map.features;
            // if (feats && feats.length) {
            //     for (const feat of feats) {
            //         childMap.addFeature(feat.featName, feat.feature, false);
            //     }
            // }
            // //添加气泡框
            // let overlays = this.innerOption.map.overlays;
            // if (overlays && overlays.length) {
            //     for (const orlyr of overlays) {
            //         childMap.addOverlay(orlyr.overlayName, orlyr.overlay);
            //     }
            // }
        }
    }

    removeChildMap() {
        if (this.mapCollection?.length > 0) {
            for (let index = 0; index < this.mapCollection.length; index++) {
                this.innerOption.mainContainer.removeChild(this.mapCollection[index].div);
            }
            this.mapCollection.length = 0;
        }
    }
}

export const ViewMode = {
    ONE_MAP: 'ONE_MAP',
    DOUBLE_MAP: 'DOUBLE_MAP',
    THREE_MAP: 'THREE_MAP',
    FOUR_MAP: 'FOUR_MAP',
    SIX_MAP: 'SIX_MAP'
};
