define([
  "dojo/_base/declare",
  "gridx/core/_Module",
  "dojo/_base/array",
  "dojo/dom-class",
  "dojo/json",
  "dojo/_base/lang",
  "dojo/query",
  "dojo/NodeList-dom"
], function(declare, _Module, array, domClass, JSON, lang, query) {
  // summary:
  // module name: checkBoxColumn
  return declare(_Module, {
    name: 'checkBoxColumn',
    forecd: ['hiddenColumns'],
    isDisabled: false,
    isHidden: false,

    constructor: function() {
      this._handlers = [];
      this.checkBoxColumnId = this.arg("checkBoxColumnId", "checkBox");
      this.checkBoxField = this.arg("checkBoxField", "checkBox");
      this.isUpdateChildren = this.arg("isUpdateChildren", true);
      this.isUpdateParent = this.arg("isUpdateParent", true);
      this.STATUS = {
        checked: 2,
        partial: 1,
        unChecked: 0
      };
    },

    _createCheckBox: function(row) {
      if (this.isHidden) return;
      var cell = row.cell(this.checkBoxColumnId, true);
      this._updateCheckBox(cell)
    },

    _updateCheckBox: function(cell) {
      if (this.isHidden) return;
      var cStatus = cell.rawData();
      var cDomNode = cell.node();
      if (cStatus === 1) {
        if (!this.isDisabled) {
          cDomNode.innerHTML = "<div>" +
            "<span class=\"gridxIndirectSelectionCheckBox dijitReset dijitInline dijitCheckBox dijitCheckBoxPartial\"></span>" + "</div>";
        } else {
          cDomNode.innerHTML = "<div>" +
            "<span class=\"gridxIndirectSelectionCheckBox dijitReset dijitInline dijitCheckBox dijitCheckBoxPartialDisabled\"></span>" + "</div>";
        }
      } else if (cStatus === 2) {
        if (!this.isDisabled) {
          cDomNode.innerHTML = "<div>" +
            "<span class=\"gridxIndirectSelectionCheckBox dijitReset dijitInline dijitCheckBox dijitCheckBoxChecked\"></span>" + "</div>";
        } else {
          cDomNode.innerHTML = "<div>" +
            "<span class=\"gridxIndirectSelectionCheckBox dijitReset dijitInline dijitCheckBox dijitCheckBoxCheckedDisabled\"></span>" + "</div>";
        }
      } else if (cStatus === 0) {
        if (!this.isDisabled) {
          cDomNode.innerHTML = "<div>" +
            "<span class=\"gridxIndirectSelectionCheckBox dijitReset dijitInline dijitCheckBox\"></span>" +
            "</div>";
        } else {
          cDomNode.innerHTML = "<div>" +
            "<span class=\"gridxIndirectSelectionCheckBox dijitReset dijitInline dijitCheckBox dijitCheckBoxDisabled\"></span>" +
            "</div>";
        }
      }
    },

    _updateCheckBoxStyle: function(node, checked, partial, isUnselectable) {
      var dijitClass = 'dijitCheckBox';
      domClass.toggle(node, dijitClass + 'Checked', checked);
      domClass.toggle(node, dijitClass + 'Partial', partial);
      domClass.toggle(node, dijitClass + 'CheckedDisabled', checked && isUnselectable);
      domClass.toggle(node, dijitClass + 'PartialDisabled', partial && isUnselectable);
      domClass.toggle(node, dijitClass + 'Disabled', !checked && !partial && isUnselectable);
    },

    load: function(args, startup) {
      var t = this;
      startup.then(function() {

        var afterRowHandler = t.grid.connect(t.grid.body, 'onAfterRow', lang.hitch(t, t._createCheckBox));
        var afterCellHandler = t.grid.connect(t.grid.body, 'onAfterCell', lang.hitch(t, t._updateCheckBox));

        t._handlers.push(afterRowHandler);
        t._handlers.push(afterCellHandler);

        var checkBoxClickHandler = t.grid.connect(t.grid, 'onCellClick', function(evt) {
          //evt.originalTarget.className
          if (!t.isDisabled) {
            var target = evt.originalTarget || evt.srcElement;
            if (domClass.contains(target, "gridxIndirectSelectionCheckBox")) {
              var row = t.grid.row(evt.rowId, 1);
              var rowData = row.rawData();
              var cStatus = rowData[t.checkBoxField];
              rowData[t.checkBoxField] = (cStatus === 2 ? 0 : 2);

              t._updateCheckBox(row.cell(t.checkBoxColumnId, true));

              if (t.isUpdateChildren) {
                t.updateChildren(evt.rowId, rowData[t.checkBoxField]);
              }

              if (t.isUpdateParent) {
                t.updateParent(evt.rowId);
              }
              t.onCheckBoxClick(evt, rowData[t.checkBoxField] === 2);
            }
          }
        });

        t._handlers.push(checkBoxClickHandler);

        t.loaded.callback();
      });
    },


    onCheckBoxClick: function(evt, checked) {

    },
    /*
     * status: "checked, unChecked, partial"
     */
    updateCheckBoxStatus: function(rowId, status) {
      var row = this.grid.row(rowId, 1);
      var rowData = row.rawData();
      var cStatus = rowData[this.checkBoxField];
      rowData[this.checkBoxField] = this.STATUS[status];
      this._updateCheckBox(row.cell(t.checkBoxColumnId, true));
    },

    updateParent: function(rowId) {
      this._updateParent(rowId);
    },

    _updateParent: function(rowId) {
      var t = this;
      var parentId = t.grid.model.parentId(rowId);
      if (parentId === "") return;
      var row = t.grid.row(parentId, 1);
      var rowData = row.rawData();
      var rowIds = t.grid.model.children(parentId);
      //just partial checked
      if (array.some(rowIds, function(cId) {
        var crow = t.grid.row(cId, 1);
        var crowData = crow.rawData();
        return crowData[t.checkBoxField] === 2 || crowData[t.checkBoxField] === 1;
      })) {
        rowData[t.checkBoxField] = 1;
      }
      //all children checked
      if (array.every(rowIds, function(cId) {
        var crow = t.grid.row(cId, 1);
        var crowData = crow.rawData();
        return crowData[t.checkBoxField] === 2;
      })) {
        rowData[t.checkBoxField] = 2;
      }
      //all children unchecked
      if (array.every(rowIds, function(cId) {
        var crow = t.grid.row(cId, 1);
        var crowData = crow.rawData();
        return crowData[t.checkBoxField] === 0;
      })) {
        rowData[t.checkBoxField] = 0;
      }

      if (t.grid.model.parentId(parentId) !== null) {
        t._updateChildCheckBoxValue(t.grid.model.store, rowData);
        t._updateCheckBox(row.cell(t.checkBoxColumnId, true));
      } else {
        t.grid.model.store.put(rowData);
      }

      t._updateParent(parentId);
    },
    /**
     * rowId: parentId
     * status: 0,1,2
     * */
    updateChildren: function(rowId, status) {
      this._updateChildren(rowId, status);
    },

    _updateChildren: function(rowId, status) {
      var t = this;
      var rowIds = t.grid.model.children(rowId);
      for (var i = 0; i < rowIds.length; i++) {
        var row = this.grid.row(rowIds[i], 1);
        var rowData = row.rawData();
        rowData[this.checkBoxField] = status;
        t._updateChildCheckBoxValue(t.grid.model.store, rowData);
        if (row.cell(t.checkBoxColumnId, true).node()) {
          t._updateCheckBox(row.cell(t.checkBoxColumnId, true));
        }

        t._updateChildren(rowIds[i], status);
      }
    },

    disable: function() {
      var t = this;
      var rows = t.grid.rows();
      array.forEach(rows, function(row) {
        var rowData = row.rawData();
        var cStatus = rowData[t.checkBoxField];
        query('span.gridxIndirectSelectionCheckBox', row.node()).forEach(function(rowNode) {
          if (cStatus === 2) {
            t._updateCheckBoxStyle(rowNode, true, false, true);
          } else if (cStatus === 1) {
            t._updateCheckBoxStyle(rowNode, false, true, true);
          } else if (cStatus === 0) {
            t._updateCheckBoxStyle(rowNode, false, false, true);
          }
        });
      });
      this.isDisabled = true;
    },

    enable: function() {
      var t = this;
      var rows = t.grid.rows();
      array.forEach(rows, function(row) {
        var rowData = row.rawData();
        var cStatus = rowData[t.checkBoxField];
        query('span.gridxIndirectSelectionCheckBox', row.node()).forEach(function(rowNode) {
          if (cStatus === 2) {
            t._updateCheckBoxStyle(rowNode, true, false, false);
          } else if (cStatus === 1) {
            t._updateCheckBoxStyle(rowNode, false, true, false);
          } else if (cStatus === 0) {
            t._updateCheckBoxStyle(rowNode, false, false, false);
          }
        });
      });
      this.isDisabled = false;
    },

    hide: function() {
      this.grid.hiddenColumns.add(this.checkBoxColumnId);
      this.isHidden = true;
    },

    show: function() {
      this.grid.hiddenColumns.remove(this.checkBoxColumnId);
      this.isHidden = false;
      //update cell structure, normal case and tree case
      var t = this;
      var rows = t.grid.rows();
      this._updateCheckBoxOnTree(rows);
    },

    _updateCheckBoxOnTree: function(rows) {
      var t = this;

      for (var i = 0; i < rows.length; i++) {
        var cell = rows[i].cell(t.checkBoxColumnId, true);
        t._updateCheckBox(cell);
        var rowIds = t.grid.model.children(rows[i].id);
        if (rowIds.length === 0) continue;
        var childRows = array.map(rowIds, function(rowId) {
          return t.grid.row(rowId, true);
        });
        t._updateCheckBoxOnTree(childRows)
      }
    },

    getCheckedRowIds: function() {
      var t = this;
      var items = t.grid.model.store.query();
      var rowIds = [];
      var collectChecked = function(items) {
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (item[t.checkBoxField] === 2) {
            rowIds.push(item.id);
          }
          if (item.children && item.children.length !== 0) {
            collectChecked(item.children);
          }
        }
      };
      collectChecked(items);
      return rowIds;
    },


    destroy: function() {
      this.inherited(arguments);
      //remove event
      array.forEach(this._handlers, function(handler) {
        handler.remove();
      });
    }
  });
});