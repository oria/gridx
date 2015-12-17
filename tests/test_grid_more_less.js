require([
	'dojo/parser',
	'dojo/on',
	"dojo/_base/connect",
	'dojo/_base/Deferred',
	'dojo/dom-construct',
	'gridx/tests/support/data/MusicData2',
	'gridx/tests/support/stores/Memory',
	'gridx/support/more_less/ExpandableArea',
	"gridx/modules/HeaderExpand",
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/core/model/cache/Async',
	'dijit/form/ComboButton',
	'dijit/Menu',
	'dijit/MenuItem',
	'dijit/ProgressBar',
	'dijit/form/Button',
	'dijit/form/CheckBox',
	'dijit/form/DropDownButton',
	'dijit/TooltipDialog',
	"gridx/allModules"
], function(parser, on, connect, Deferred, domConstruct, dataSource, storeFactory, ExpandableArea, HeaderExpand){

	store = storeFactory({
		dataSource: dataSource,
		size: 100
	});

	layout1 = [
		{id: "id", field: "id", name:"Index", width: '50px'},
		{id: 'Perface', field: "Perface", name:"Perface", dataType:'Text',  isExpandable:true, expandableName:"Perface",
			widgetsInCell: true, 
			decorator: function(){
				return [
					'<div data-dojo-type="ExpandableArea" data-dojo-attach-point="area" data-dojo-props="name: \'Perface\', height: \'200px\'"></div>'
				].join('');
			},
			setCellValue: function(data){
			 	this.area.set("container",data);
			}
		},
		{id: 'Artist', field: "Artist", name:"Button", 
			widgetsInCell: true,
			navigable: true,
			allowEventBubble: true,
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
		{id: 'Artist2', field: "Artist", name:"ComboButton", 
			navigable: true,
			expandLevel: 'all',
			width: '200px',
			widgetsInCell: true,
			allowEventBubble: true,
			setCellValue: function(gridData, storeData, cellWidget){
				var menuItem = new dijit.MenuItem({
					label : "Cut",
					value : "Cut",
					onClick : function (value) {
						cellWidget.combo.set('label', "Cut");
					}
				});

				cellWidget.sMenu.addChild(menuItem);
				menuItem = new dijit.MenuItem({
					label : "Paste",
					value : "Paste",
					onClick : function (value) {
						cellWidget.combo.set('label', "Paste");
					}
				});
				cellWidget.sMenu.addChild(menuItem);
			},
			decorator: function(){
				return [
					'<div data-dojo-attach-point="combo" data-dojo-type="dijit/form/ComboButton" data-dojo-props="label:\'Select\'">',
					'<div data-dojo-attach-point="sMenu" data-dojo-type="dijit/Menu"></div></div>'
				].join('');
			}
		},
		{id: 'Album', field: "Album", name:"Read-only CheckBox", 
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
				this.cb.set('value', data.length % 2);
			}
		},
		{id: 'Genre', field: "Genre", name:"ComboButton", 
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
		{id: 'Name', field: "Name", name:"DropDown Button",
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
	];

	parser.parse();
});
