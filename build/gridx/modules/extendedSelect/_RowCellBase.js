//>>built
define("gridx/modules/extendedSelect/_RowCellBase",["dojo/_base/declare","dojo/_base/lang","dojo/query","./_Base","../../core/model/extensions/Mark"],function(c,g,d,e,f){return c(e,{modelExtensions:[f],_getRowId:function(a){var b=d('[visualindex\x3d"'+a+'"]',this.grid.bodyNode)[0];return b?b.getAttribute("rowid"):this.grid.view.getRowInfo({visualIndex:a}).rowId},_init:function(){var a=this.model;this.batchConnect([this.grid.body,"onMoveToCell","_onMoveToCell"],[a,"onMarkChange","_onMark"],[a,"setStore",
"clear"])}})});
//@ sourceMappingURL=_RowCellBase.js.map