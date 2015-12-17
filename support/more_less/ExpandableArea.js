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
    return declare("ExpandableArea", [_WidgetBase, _TemplatedMixin], {

        templateString: template,
        height: "100px",
        isExpanded: false,
        name: "name",

        _setContainerAttr: function(content){
            this.container.innerHTML=content;
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

            t._expand(t.isExpanded);

            on(t.btn, "click", lang.hitch(t, function(){
                this._expand(this.btn.innerHTML==="[More]");
            }));

            connect.subscribe('expandableArea/' + t.name, lang.hitch(t, function(isExpanded){
                this.isExpanded = isExpanded;
                this._expand(isExpanded);
            }));
        }
    });
});