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

	layout = [
		{id: "id", field: "id", name:"Index", width: '50px'},
		{id: 'Perface', field: "Perface", name:"Perface", width: '100px', dataType:'Text',  isExpandable:true, expandableName:"Perface",
			widgetsInCell: true,
			allowEventBubble: true,
			decorator: function(){
				return [
					'<div data-dojo-type="ExpandableArea" data-dojo-attach-point="area" data-dojo-props="name: \'Perface\', height: \'100px\', isExpanded: false"></div>'
				].join('');
			},
			setCellValue: function(data, storeData, widget){
				this.area.set("container",data);
				var rowId = String(widget.cell.row.id);
				var colId = String(widget.cell.column.id);
				var info = {"id": rowId + "-" + colId, "rowId": rowId, "colId": colId};
				this.area.init(info);
			}
		},
		{id: 'Artist', field: "Artist", name:"Button", width: '100px'},
		{id: 'Artist2', field: "Artist", name:"ComboButton", width: '100px'},
		{id: 'Album', field: "Album", name:"Read-only CheckBox", width: '100px'},
		{id: 'Genre', field: "Genre", name:"ComboButton", width: '100px'},
		{id: 'Name', field: "Name", name:"DropDown Button", width: '100px'}
	];

	parser.parse();
});
