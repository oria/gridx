define([
	'./support/data/AllData',
	'./support/stores/Memory',
//    './support/stores/JsonRest',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/modules/CellWidget',
	'gridx/modules/extendedSelect/Row',
	'gridx/modules/Sort',
	'gridx/modules/IndirectSelectColumn',
	'gridx/modules/AutoPagedBody',
	'gridx/modules/TouchVScroller',
	'gridx/modules/MultiChannelScroller',
	'gridx/modules/HiddenColumns',
	'gridx/modules/StructureSwitch',
	'gridx/modules/SummaryBar',
	'dijit/ProgressBar'
], function(dataSource, storeFactory){

	var store = storeFactory({
		isAsync: true,
		dataSource: dataSource,
		asyncTimeout: 1000,
		size: 200
	});

	var layout = [
		{id: 'id', field: 'id', name: 'Identity', width: '70px', sortable: 'ascend'},
		{id: 'id-mobile', field: 'id', width: '15px', sortable: 'ascend'},
		{id: 'name', field: 'name', name: 'Name', width: '20%', minWidth: 90},
		{id: 'server', field: 'server', name: 'Server', width: '10%', minWidth: 100, sortable: false},
		{id: 'platform', field: 'platform', name: 'Platform', width: '20%', minWidth: 150},
		{id: 'status', field: 'status', name: 'Status', width: '80px', sortable: 'descend',
			decorator: function(data){
				return [
					"<span class='", {
						normal: 'testDataNormalStatus',
						warning: 'testDataWarningStatus',
						critical: 'testDataCriticalStatus'
					}[data.toLowerCase()], "'></span>",
					data
				].join('');
			}
		},
		{id: 'status-mobile', field: 'status', width: '20px', sortable: 'descend',
			decorator: function(data){
				return [
					"<span class='", {
						normal: 'testDataNormalStatus',
						warning: 'testDataWarningStatus',
						critical: 'testDataCriticalStatus'
					}[data.toLowerCase()], "'></span>"
				].join('');
			}
		},
		{id: 'progress', field: 'progress', name: 'Progress', width: 'auto', minWidth: 180,
			widgetsInCell: true,
			decorator: function(){
				return "<div data-dojo-type='dijit.ProgressBar' data-dojo-props='minimum: 0, maximum: 1' class='gridxHasGridCellValue' style='width: 100%;'></div>";
			}
		},
		{id: 'progress-mobile', field: 'progress', name: 'Name & Progress', width: 'auto', minWidth: 150,
			widgetsInCell: true,
			decorator: function(){
				return [
					"<div data-dojo-attach-point='taskname' class='mobileNameDiv'></div>",
					"<div data-dojo-attach-point='prog' data-dojo-type='dijit.ProgressBar' ",
					"data-dojo-props='minimum: 0, maximum: 1' class='gridxHasGridCellValue' style='width: 100%;'></div>"].join('');
			},
			setCellValue: function(gridData, storeData, cellWidget){
				cellWidget.taskname.innerHTML = cellWidget.cell.row.rawData().name;
				cellWidget.prog.set('value', gridData);
			}
		}
	];

	var config = {
		desktop: ['id', 'name', 'server', 'platform', 'status', 'progress'],
		pad: ['id-mobile', 'name', 'platform', 'status', 'progress'],
		phone: ['id-mobile', 'status-mobile', 'progress-mobile']
	};

	var condition = {
		desktop: function(grid){
//            return window.innerWidth > 1024;
			return grid.domNode.offsetWidth > 1024;
		},
		pad: function(grid){
//            return window.innerWidth <= 1024 && window.innerWidth > 480;
			return grid.domNode.offsetWidth <= 1024 && grid.domNode.offsetWidth > 480;
		},
		phone: function(grid){
//            return window.innerWidth <= 480;
			return grid.domNode.offsetWidth <= 480;
		}
	};

	return {
		store: store,
		layout: layout,
		structureSwitchCondition: condition,
		structureSwitchConfig: config
	};
});
