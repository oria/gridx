require([
	'dojo',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/TestPane',
	'gridx/tests/support/modules',

	'dijit/form/Button',
	'dijit/form/NumberTextBox',
	'dojo/domReady!'
], function(dojo, Grid, Cache, dataSource, storeFactory, TestPane, modules){

	grid = new Grid({
		id: 'grid',
		store: storeFactory({
			dataSource: dataSource,
			size: 100
		}),
		structure: dataSource.layouts[0],
		cacheClass: Cache,
		modules: [
			modules.Focus,
			{
				moduleClass: modules.TitleBar,
				label: 'Gridx - Title Bar Label'
			},
			modules.VirtualVScroller
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();	
	
	//Test functions
	
	show = function(){
		grid.titleBar.domNode.style.display = 'block';
	};
	hide = function(){
		grid.titleBar.domNode.style.display = 'none';
	};
	showDialog = function(){
		dijit.byId('setTitleDialog').show();
	};
	submit = function(){
		var label = dijit.byId("title_input").value;
		grid.titleBar.setLabel(label);
		dijit.byId("title_input").set('value', "");
		dijit.byId('setTitleDialog').hide();
	};
	cancel = function(){
		dijit.byId("title_input").set('value', "");
		dijit.byId('setTitleDialog').hide();
	}
	
	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');
	
	tp.addTestSet('Title Bar Actions', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: show">Show the title bar</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: hide">Hide the title bar</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: showDialog">Set a new titile</div><br/>',
	''].join(''));
	
	tp.startup();
});
