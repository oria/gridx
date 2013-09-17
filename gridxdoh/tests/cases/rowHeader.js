define([
	'gridx/allModules',
	'dijit/form/ComboButton',
	'dijit/Menu',
	'dijit/MenuItem',
	'dijit/ProgressBar',
	'dijit/form/Button',
	'dijit/form/CheckBox',
	'dijit/form/DropDownButton',
	'dijit/form/TextBox',
	'dijit/form/NumberTextBox',
	'dijit/TooltipDialog',
	'dijit/ColorPalette'
], function(modules){

	return [
		{
			title: 'rowHeader, sync cache, filter, paging, columnResizer',
			guide: [
				'row header is correct during scrolling',
				'row header is correct during page switching',
				'row header is correct during filtering',
				'row header is correct during column resizing',
				'TAB order: header -> row header -> body'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity', width: '50px'},
				{id: 'Genre', field: 'Genre', name: 'Genre', width: '100px'},
				{id: 'Year', field: 'Year', name: 'Year', width: '80px'},
				{id: 'Length', field: 'Length', name: 'Length', width: '80px'},
				{id: 'Track', field: 'Track', name: 'Track', width: '50px'},
				{id: 'Composer', field: 'Composer', name: 'Composer', width: '100px'},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date', width: '100px'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played', width: '100px'},
				{id: 'Heard', field: 'Heard', name: 'Heard', width: '80px'}
			],
			modules: [
				'gridx/modules/ColumnResizer',
				'gridx/modules/RowHeader',
				modules.Pagination,
				'gridx/modules/pagination/PaginationBar',
				modules.Filter,
				'gridx/modules/filter/QuickFilter'
			]
		},
		{
			title: 'rowHeader, async cache, virtual scroll',
			guide: [
				'row header is correct during scrolling'
			],
			cache: "gridx/core/model/cache/Async",
			store: 'mockserver',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'Identity', width: '50px'},
				{id: 'Genre', field: 'Genre', name: 'Genre', width: '100px'},
				{id: 'Year', field: 'Year', name: 'Year', width: '80px'},
				{id: 'Length', field: 'Length', name: 'Length', width: '80px'},
				{id: 'Track', field: 'Track', name: 'Track', width: '50px'},
				{id: 'Composer', field: 'Composer', name: 'Composer', width: '100px'},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date', width: '100px'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played', width: '100px'},
				{id: 'Heard', field: 'Heard', name: 'Heard', width: '80px'}
			],
			modules: [
				'gridx/modules/ColumnResizer',
				'gridx/modules/VirtualVScroller',
				'gridx/modules/RowHeader'
			],
			props: {
				pageSize: 20
			}
		},
		{
			title: 'rowHeader, cellWidget and async cache',
			guide: [
				'row header is correct during scrolling'
			],
			cache: "gridx/core/model/cache/Async",
			store: 'mockserver',
			size: 1000,
			structure: [
				{ field: "id", name:"Index", width: '30px'},
				{ field: "progress", name:"Progress", dataType:'number', width: '200px',
					widgetsInCell: true, 
					decorator: function(){
						return [
							"<div data-dojo-type='dijit.ProgressBar' data-dojo-props='maximum: 1' ",
							"class='gridxHasGridCellValue' style='width: 100%;'></div>"
						].join('');
					}
				},
				{ field: "Artist", name:"Button", width: '200px',
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
				{ field: "Album", name:"Read-only CheckBox", width: '200px',
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
						this.cb.set('value', String(data).length % 2);
					}
				},
				{ field: "Genre", name:"ComboButton", width: '200px',
					widgetsInCell: true,
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
				{ field: "Name", name:"DropDown Button", width: '200px',
					widgetsInCell: true, 
					navigable:true,
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
			],
			modules: [
				'gridx/modules/ColumnResizer',
				'gridx/modules/CellWidget',
				'gridx/modules/VirtualVScroller',
				'gridx/modules/RowHeader'
			],
			props: {
				pageSize: 20
			}
		},
		{
			title: 'rowHeader and Editable cell',
			guide: [
				'row header is correct when entering editting mode or exiting editing mode'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{ field: "id", name:"ID", width: '20px'},
				{ field: "Color", name:"Color Palatte", width: '205px', editable: true,
					decorator: function(data){
						return [
							'<div style="display: inline-block; border: 1px solid black; ',
							'width: 20px; height: 20px; background-color: ',
							data,
							'"></div>',
							data
						].join('');
					},
					editor: 'dijit.ColorPalette',
					editorArgs: {
						fromEditor: function(v, cell){
							return v || cell.data(); //If no color selected, use the orginal one.
						}
					}
				},
				{ field: "Genre", name:"TextBox", width: '100px', editable: true},
				{ field: "Year", name:"NumberTextBox", width: '100px', editable: true,
					editor: "dijit.form.NumberTextBox"
				}
			],
			modules: [
				'gridx/modules/ColumnResizer',
				'gridx/modules/CellWidget',
				'gridx/modules/Edit',
				'gridx/modules/VirtualVScroller',
				'gridx/modules/RowHeader'
			],
			props: {
				autoWidth: true
			}
		}
	];
});
