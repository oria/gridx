define([
	'dojo/_base/query',
	'dojo/dom',
	'dojo/dom-geometry',
	'./gdoh',
	'gridx/core/model/cache/Sync',
	'../support/data/TestData',
	'../support/stores/Memory',
	'../support/modules',
	'dijit/form/Button',
	'dijit/ProgressBar'
], function(query, dom, domGeo, doh, Cache, dataSource, storeFactory, modules){

	var store = storeFactory({
		dataSource: dataSource,
		size: 100
	});

	var layout = [
		{id: 'id', field: 'id', name: 'Identity',
			decorator: function(data){
				return "<a href='www.google.com'>" + data + "</a>";
			}
		},
		{id: 'number', field: 'number', name: 'Number',
			widgetsInCell: true,
			decorator: function(){
				return [
					"<div data-dojo-type='dijit.ProgressBar' data-dojo-attach-point='prog' data-dojo-props='maximum: 100' ",
					"class='gridxHasGridCellValue' style='width: 100%;'></div>"
				].join('');
			}
		},
		{id: 'string', field: 'string', name: 'String',
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
		{id: 'date', field: 'date', name: 'Date'},
		{id: 'time', field: 'time', name: 'Time'},
		{id: 'bool', field: 'bool', name: 'Boolean'}
	];

	//------------------------------------------------------------------------
	doh.ts('cellWidget.getCellWidget');

	doh.td('getCellWidget', function(t, grid){
		var w = grid.cell(0, 'number').widget();
		t.t(!!w);
		t.t(!!w.prog);
		t.is(grid.cell(0, 'number').data(), w.prog.get('value'));
	});

	doh.ts('cellWidget.setCellDecorator');

	//------------------------------------------------------------------------
	return doh.go('cellWidget', [
		'cellWidget.getCellWidget',
		'cellWidget.setCellDecorator',
	0], {
		cacheClass: Cache,
		store: store,
		structure: layout,
		modules: [
			modules.CellWidget
		]
	});
});
