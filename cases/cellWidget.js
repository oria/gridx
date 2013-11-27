define([
	'gridx/allModules',
	'dojo/date/locale',
	'dojo/has!gridx1.2?gridx/support/menu/AZFilterMenu',
	'dojo/has!gridx1.2?gridx/support/menu/NumberFilterMenu',
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
	'dijit/ColorPalette',
	'gridx/core/model/extensions/FormatSort'
], function(modules, locale, AZFilterMenu, NumberFilterMenu){

	var cases = [
		{
			title: 'CellWidget-Pagination',
			guide: [
				'Go to different pages, cell widgets should render correctly',
				'focus any cell in the Button column, press F2 to move focus to the button in the cell.',
				'when focus is on a button, press ESC to return focus back to cell'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
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
						this.cb.set('value', data ? data.length % 2 : 0);
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
				'gridx/modules/RowHeader',
				'gridx/modules/VirtualVScroller',
				modules.Pagination,
				'gridx/modules/pagination/PaginationBarDD'
			]
		},
		{
			title: "Multiple Focusable Elements in Cell",
			guide: [
				'put focus on a cell, press F2 to focus the first button in the cell',
				'when focus is on the first button in the cell, press TAB to move focus to the next button in the same cell',
				'when focus is on the last button in a cell, press TAB to move focus to the first button in the next cell',
				'when focus is on the first button in a cell, press SHIFT+TAB to move focus to the last button in the previous cell',
				'when focus is in cell, press ESC to move focus back to cell'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{ field: "id", name:"Index", width: '50px'},
				{ field: "Name", name:"Buttons",
					widgetsInCell: true,
					navigable: true,
					decorator: function(){
						return [
							'<button data-dojo-type="dijit.form.Button" ',
							'data-dojo-attach-point="btn1" ',
							'data-dojo-props="onClick: function(){',
								'alert(this.get(\'label\'));',
							'}"></button>',
							'<div data-dojo-type="dijit.form.DropDownButton" ',
								'data-dojo-attach-point="btn2"',
								'data-dojo-props="iconClass:\'dijitIconApplication\'">',
								'<div data-dojo-type="dijit.TooltipDialog" data-dojo-attach-point="ttd">',
									'hihi',
								'</div>',
							'</div>',
							'<div data-dojo-type="dijit.form.ComboButton" ',
								'data-dojo-attach-point="btn3" ',
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
						this.btn1.set('label', data);
						this.btn2.set('label', data);
						this.btn3.set('label', data);
					}
				}
			],
			modules: [
				"gridx/modules/Focus",
				"gridx/modules/CellWidget",
				"gridx/modules/ColumnResizer",
				modules.Pagination,
				"gridx/modules/pagination/PaginationBar"
			]
		}
	];
	return cases;
});
