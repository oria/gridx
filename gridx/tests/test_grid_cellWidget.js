require([
	'dojo/date/locale',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/modules',
	'gridx/tests/support/TestPane',

	'dijit/ProgressBar',
	'dijit/form/Button',
	'dijit/form/CheckBox'
], function(locale, Grid, Cache, dataSource, storeFactory, modules, TestPane){

	var progressDecorator = function(){
		return [
			"<div data-dojo-type='dijit.ProgressBar' data-dojo-props='maximum: 1' class='dojoxGridxHasGridCellValue' style='width: 100%;'></div>"
		].join('');
	};

	var artistDecorator = function(){
		return [
			'<button data-dojo-type="dijit.form.Button" data-dojo-attach-point="btn1" data-dojo-props="onClick: function(){alert(\'hello\');}"></button><br />',
			'<button data-dojo-type="dijit.form.Button" data-dojo-attach-point="btn2"></button>'
		].join('');
	};

	var artistSetCellValue = function(data){
		this.btn1.set('label', data);
		this.btn2.set('label', "Search...");
	};

	var albumDecorator = function(){
		return [
			'<span data-dojo-type="dijit.form.CheckBox" data-dojo-attach-point="cb" data-dojo-props="readOnly: true"></span>',
			'<label data-dojo-attach-point="lbl"></label>'
		].join('');
	};

	var albumSetCellValue = function(data){
		this.lbl.innerHTML = data;
		this.cb.set('value', data.length % 2);
	};

	var structure = [
		{ field: "id", name:"Index", width: '50px'},
		{ field: "Progress", name:"Progress", 
			widgetsInCell: true, 
			decorator: progressDecorator
		},
		{ field: "Artist", name:"Artist", 
			widgetsInCell: true, 
			navigable: true,
			decorator: artistDecorator,
			setCellValue: artistSetCellValue
		},
		{ field: "Album", name:"Album", 
			widgetsInCell: true,
			navigable: true,
			decorator: albumDecorator,
			setCellValue: albumSetCellValue
		}
	];

	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource, 
			size: 1000
		}),
		structure: structure,
		modules: [
			modules.Focus,
			modules.CellWidget,
			modules.VirtualVScroller
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();


	//Test buttons
	/*var tp = new TestPane({});
	tp.placeAt('ctrlPane');

	tp.addTestSet('Core Functions', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: beginEdit2_3">Begin edit cell(2,3)</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: applyEdit2_3">Apply edit cell(2,3)</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: cancelEdit2_3">Cancel edit cell(2,3)</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: isEditing2_3">Is cell(2,3) editing</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setEditor3">set the "Year" column\'s editor to a TextBox</div><br/>'
	].join(''));

	tp.startup();
	*/
});
