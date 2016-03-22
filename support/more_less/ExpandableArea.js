define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-style",
    "dojo/on",
    "dojo/_base/connect",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./ExpandableArea.html"
], function(declare, lang, domStyle, on, connect, _WidgetBase, _TemplatedMixin, template){

    var singletonArray = [];

    return declare("ExpandableArea", [_WidgetBase, _TemplatedMixin], {

        templateString: template,
        height: "100px",
        name: "name",
        expandedAreas: singletonArray,
        isAllExpanded: false,

        _setContainerAttr: function(content){
            this.container.innerHTML=content;
        },

        init: function(info){
          this.info = info;
          var isExpanded = !(!this.isAllExpanded && this.expandedAreas.indexOf(this.info.id)==-1);
          this._expand(isExpanded);
          this._trackExpanded(isExpanded);
        },

        _trackExpanded: function(isExpanded){
          var t = this,
            info = t.info,
            id = t.info.id;
            index = t.expandedAreas.indexOf(id);
          if(isExpanded){
            if(index==-1)
              t.expandedAreas.push(id);
          }
          else{
            if(index!=-1)
              t.expandedAreas.splice(index,1);
          }
        },

        _expand: function(isExpanded){
            var t = this,
                btn = t.btn;

            if(isExpanded){
                btn.innerHTML="[Less]";
                domStyle.set(t.container, "height", "100%");
            }else{
                btn.innerHTML="[More]";
                domStyle.set(t.container, "height", t.height);
            };
        },


        postCreate: function(){
            var t = this;

            on(t.btn, "click", lang.hitch(t, function(){
                var isExpanded = this.btn.innerHTML==="[More]";
                this._expand(isExpanded);
                this._trackExpanded(isExpanded);
                connect.publish('expandableArea/', t.info);
            }));

            connect.subscribe('allExpandableArea/', lang.hitch(t, function(isExpanded){
                this.isAllExpanded = isExpanded;
                if(!isExpanded && this.expandedAreas.length>0)
                  this.expandedAreas.length = 0;
                else
                  this._trackExpanded(isExpanded);
                this._expand(isExpanded);
                //this._trackExpanded(isExpanded);
            }));
        }
    });
});
