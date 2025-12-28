import OLVectorLayer from "ol/layer/Vector";
import OLVectorSource from "ol/source/Vector";
import { buildStyle } from "../style/Style";
import { 
  EDIT_TOOL_NAME,
  EditingType,
  EditedStyle
 } from "../config/EditDefaultConfig";
import GeoJSONUtil from "../util/GeojsonUtil.js";
import { EDIT_LAYER_NAME } from "../config/LayerConstantConfig.js";

import Bar from "ol-ext/control/Bar"
import EditBar from "ol-ext/control/EditBar";
import Toggle from "ol-ext/control/Toggle"
import Button from "ol-ext/control/Button";
import UndoRedo from "ol-ext/interaction/UndoRedo";
import FillAttribute from "ol-ext/interaction/FillAttribute";
import Snap from "ol/interaction/Snap"

export class EditTool {
  constructor(option) {
    this.innerOption = option;
    // this.initDrawTool();
  }

  innerOption = null;
  drawVecLyr = null;
  drawVecSour = null;
  state = State.UnDrawding;

  //这里做约束必须具有这个属性
  get name() {
    return EDIT_TOOL_NAME;
  }

  //这里做约束必须具有这个属性
  get option() {
    return this.innerOption;
  }

  get state() {
    return this.state;
  }

  initDrawTool() {
    this.drawVecSour = new OLVectorSource();
    this.drawVecLyr = new OLVectorLayer({
      source: this.drawVecSour,
      style: buildStyle(
        this.drawOption && this.drawOption.drawedStyle
          ? this.drawOption.drawedStyle
          : EditedStyle
      ),
      zIndex: 99,
    });

    // Main control bar
    let mainbar = new Bar();
    this.innerOption.map.addControl(mainbar);
    
    // Editbar
    let editbar = new EditBar({
      source: this.drawVecSour,
      interactions: { Info: false }
    });
    mainbar.addControl(editbar);

    // Add a fill interaction to set color attribute
    var fill = new FillAttribute({ 
      name: 'fill color' 
    }, { 
      color: [255,0,0] 
    });

    editbar.addControl(new Toggle({
      html: '<i class="fa fa-paint-brush"></i>',
      title: 'fill color attribut',
      interaction: fill,
      bar: new Bar({
        controls:[ 
          new Button({
            className: 'red',
            handleClick: function(){
              fill.setAttribute('color', [255,0,0])
            }
          }),
          new Button({
            className: 'green',
            handleClick: function(){
              fill.setAttribute('color', [0,255,0])
            }
          }),
          new Button({
            className: 'blue',
            handleClick: function(){
              fill.setAttribute('color', [0,0,255])
            }
          })
        ]
      })
    }));


    // Undo redo interaction
    let undoInteraction = new UndoRedo();
    this.innerOption.map.addInteraction(undoInteraction);
    // Prevent selection of a deleted feature
    undoInteraction.on('undo', function(e) {
      if (e.action.type === 'addfeature') {
        editbar.getInteraction('Select').getFeatures().clear();
        editbar.getInteraction('Transform').select();
      }
    });

    // Handle undo/redo stack
    undoInteraction.on('stack:add', function (e) {
      // New action element
      if (!e.action.element) {
        var elt = e.action.element = $('<li>').text(e.action.name || e.action.type)
        elt.addClass(e.action.name || e.action.type);
        elt.click(function() {
          // undo or redo stack
          if (elt.parent().hasClass('undo')) {
            undoInteraction.undo();
          } else {
            undoInteraction.redo();
          }
        })
      }
      // Append to undo stack
      $('.options .undo').append(e.action.element);
      e.action.element.attr('title', 'undo');
      if (!undoInteraction.hasRedo()) $('.options .redo').html('');
    });
    // Append to redo stack
    undoInteraction.on('stack:remove', function (e) {
      if (e.shift) {
        $('.options .undo li').first().remove();
      } else {
        $('.options .redo').prepend($('.options .undo li').last());
      }
      e.action.element.attr('title', 'redo');
    });
    // Clear stack
    undoInteraction.on('stack:clear', function (e) {
      $('.options .undo').html('');
      $('.options .redo').html('');
    });

    // Add buttons to the bar
    var bar = new Bar({ 
      group: true,
      controls: [
        new Button({
          html: '<i class="fa fa-undo" ></i>',
          title: 'undo...',
          handleClick: function() {
            undoInteraction.undo();
          }
        }),
        new Button({
          html: '<i class="fa fa-repeat" ></i>',
          title: 'redo...',
          handleClick: function() {
            undoInteraction.redo();
          }
        })
      ]
    });
    mainbar.addControl(bar);

    // Add a snap
    this.innerOption.map.addInteraction(new Snap({ 
      source: this.drawVecSour
    }));


  }



}

export const State = {
  Editing: 'Editing',
  UnEditing: 'UnEditing'
} 
