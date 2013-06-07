define([
	'dojo/_base/lang',
	'dojo/_base/array',
	'../support/stores/Memory',
	'../support/stores/ItemFileWriteStore',
	'../support/data/TestData',
	'gridx/allModules'
], function(lang, array, memoryFactory, IFWSFactory, dataSource, modules){
	var stores = [
		memoryFactory({
			dataSource: dataSource,
			size: 10
		})
	];
	
	var neceFuncs = ['load', 'preload'];
	
	var pressureFuncs = {
		body: [	
				'refresh', 
				'renderRows', 
				'_initFocus',
				'_buildRows'
			],
		header: [
				'_build',
				'refresh'
			]
			
	};
	
	var coreMods = {
			//Put default modules here!
			Header: 'header',
			View: 'view',
			Body: 'body',
			VLayout: 'vLayout',
			HLayout: 'hLayout',
			VScroller: 'vScroller',
			HScroller: 'hScroller',
			ColumnWidth: 'columnWidth',
			Focus: 'focus'
	};
	
	var mods = {
		VirtualVScroller: "virtualVScroller",
		ColumnResizer: "columnResizer",
		NavigableCell: "navigableCell",
		CellWidget: "cellWidget",
		Edit: "edit",
		SingleSort: "sort",
		NestedSort: "sort",
		Pagination: "pagination",
		PaginationBar: "paginationBar",
		PaginationBarDD: "paginationBar",
		Filter: "filter",
		FilterBar: "filterBar",
		QuickFilter: "quickFilter",
		SelectRow: "selectRow",
		SelectColumn: "selectColumn",
		SelectCell: "selectCell",
		ExtendedSelectRow: "selectRow",
		ExtendedSelectColumn: "selectColumn",
		ExtendedSelectCell: "selectCell",
		MoveRow: "moveRow",
		MoveColumn: "moveColumn",
		RowHeader: "rowHeader",
		IndirectSelect: "indirectSelect",
		IndirectSelectColumn: "indirectSelect",
		ColumnLock: "columnLock",
		RowLock: "rowLock",
		Tree: "tree",
		HiddenColumns: 'hiddenColumns',
		GroupHeader: 'groupHeader',
		TouchVScroller: 'vScroller',
		PagedBody: 'pagedBody',
		Dod: 'dod'
	};

	for(var k in lang.mixin(mods, coreMods)){
		var mod = mods[k];
		console.log(k);
		
		if(pressureFuncs[mod]){
			array.forEach(neceFuncs, function(func){
				if(pressureFuncs[mod].indexOf(func) < 0){
					pressureFuncs[mod].push(func);
				}
			});
		}else{
			pressureFuncs[mod] = neceFuncs;
		}
	}
	
	console.log(pressureFuncs);

	
	var caches = [
		'gridx/core/model/cache/Sync'
		// 'gridx/core/model/cache/Async'
	];
	
	var layouts = [
		[//cell widgets
			{id: 'id', field: "id", name:"Index", width: '50px'},
			{id: 'number', field: "number", name:"Progress", dataType:'number',
				widgetsInCell: true, 
				decorator: function(){
					return [
						"<div data-dojo-type='dijit.ProgressBar' data-dojo-props='maximum: 1' ",
						"class='gridxHasGridCellValue' style='width: 100%;'></div>"
					].join('');
				}
			},
			{id: 'date', field: "date", name:"Button", 
				widgetsInCell: true,
				navigable: true,
				decorator: function(){
					//Generate cell widget template string
					return [
						'<button data-dojo-type="dijit.form.Button" ',
						'data-dojo-attach-point="btn" ',
						'data-dojo-props="onClick: function(){',
							'alert(this.get(\'label\'));',
						'}"></button>'
					].join('');
				},
				setCellValue: function(data){
					//"this" is the cell widget
					this.btn.set('label', data);
				}
			},
			{id: 'bool', field: "bool", name:"Read-only CheckBox", 
				widgetsInCell: true,
				decorator: function(){
					return [
						'<span data-dojo-type="dijit.form.CheckBox" ',
							'data-dojo-attach-point="cb" ',
							'data-dojo-props="readOnly: true"',
						'></span>',
						'<label data-dojo-attach-point="lbl"></label>'
					].join('');
				},
				setCellValue: function(data){
					//"this" is the cell widget
					this.lbl.innerHTML = data;
					this.cb.set('value', data);
				}
			},
			{id: 'string', field: "string", name:"ComboButton", 
				widgetsInCell: true,
				navigable: true,
				decorator: function(){
					return [
						'<div data-dojo-type="dijit.form.ComboButton" ',
							'data-dojo-attach-point="btn" ',
							'data-dojo-props="',
								'optionsTitle:\'Save Options\',',
								'iconClass:\'dijitIconFile\',',
								'onClick:function(){ console.log(\'Clicked ComboButton\'); }',
						'">',
						'<div data-dojo-type="dijit.Menu">',
						'<div data-dojo-type="dijit.MenuItem"',
							'data-dojo-props="',
								'iconClass:\'dijitEditorIcon dijitEditorIconSave\',',
								'onClick:function(){ console.log(\'Save\'); }">',
							'Save',
						'</div>',
						'<div data-dojo-type="dijit.MenuItem"',
							'data-dojo-props="onClick:function(){ console.log(\'Save As\'); }">',
							'Save As',
						'</div></div></div>'
					].join('');
				},
				setCellValue: function(data){
					this.btn.set('label', data);
				}
			},
			{id: 'time', field: "time", name:"DropDown Button",
				widgetsInCell: true, 
				navigable: true,
				decorator: function(){
					return [
						'<div data-dojo-type="dijit.form.DropDownButton" ',
							'data-dojo-attach-point="btn"',
							'data-dojo-props="iconClass:\'dijitIconApplication\'">',
							'<div data-dojo-type="dijit.TooltipDialog" data-dojo-attach-point="ttd">',
								'hihi',
							'</div>',
						'</div>'
					].join('');
				},
				setCellValue: function(data){
					this.btn.set('label', data);
				}
			}
		]
	];
	
	return {
		caches: caches,
		stores: stores,
		structures: layouts,
		modules: modules,
		pressureFuncs: pressureFuncs
	};
	
});
