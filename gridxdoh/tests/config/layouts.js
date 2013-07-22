define([
	'dijit/form/ComboButton',
	'dijit/Menu',
	'dijit/MenuItem',
	'dijit/ProgressBar',
	'dijit/form/Button',
	'dijit/form/CheckBox',
	'dijit/form/DropDownButton',
	'dijit/TooltipDialog'
], function(){
	return [
		/*[
			{id: 'id', field: 'id', name: 'Identity', 'class': 'Identity', style: 'font-size: 13px'}
		],
		[
			{id: 'id', field: 'id', name: 'Identity', dataType: 'number'},
			{id: 'number', field: 'number', name: 'Number', dataType: 'number'},
			{id: 'string', field: 'string', name: 'String', dataType: 'string'},
			{id: 'date', field: 'date', name: 'Date', dataType: 'date'},
			{id: 'time', field: 'time', name: 'Time', dataType: 'time'},
			{id: 'bool', field: 'bool', name: 'Boolean', dataType: 'boolean'}
		],
		[//has horizontal scroller
			{id: 'id', field: 'id', name: 'Identity', width: '50px', dataType: 'number'},
			{id: 'number', field: 'number', name: 'Number', width: '20em', dataType: 'number'},
			{id: 'string', field: 'string', name: 'String', width: '50%', dataType: 'string'},
			{id: 'date', field: 'date', name: 'Date', width: 'auto', dataType: 'date'},
			{id: 'time', field: 'time', name: 'Time', width: '20%', dataType: 'time'},
			{id: 'bool', field: 'bool', name: 'Boolean', dataType: 'boolean'}
		],*/
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


});
