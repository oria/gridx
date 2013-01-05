require([
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/tests/support/TestPane',
	'gridx/modules/filter/Filter',
	'gridx/modules/SingleSort',
	'gridx/modules/RowHeader',
	'gridx/modules/select/Row',
	'gridx/modules/VirtualVScroller',
	'gridx/modules/Focus',
	'gridx/modules/filter/FilterBar',
	'dojo/domReady!'
], function(Grid, Cache, dataSource, storeFactory, TestPane, Filter, SingleSort, RowHeader, SelectRow, VirtualVScroller, Focus, FilterBar){			
	var layout = [
		{id: 'id', field: 'id', name: 'Identity', dataType: 'number'},
		{id: 'Genre', field: 'Genre', name: 'Genre', dataType: 'enum',
			enumOptions: ['a', 'b', 'c']
		},
		{id: 'Artist', field: 'Artist', name: 'Artist', dataType: 'enum',
			enumOptions: ['d', 'e', 'f']
		},
		{id: 'Album', field: 'Album', name: 'Album', dataType: 'string', autoComplete: false},
		{id: 'Name', field: 'Name', name: 'Name', dataType: 'string'},
		{id: 'Year', field: 'Year', name: 'Year', dataType: 'number'},
		{id: 'Length', field: 'Length', name: 'Length', dataType: 'string'},
		{id: 'Track', field: 'Track', name: 'Track', dataType: 'number'},
		{id: 'Composer', field: 'Composer', name: 'Composer', dataType: 'string'},
		{id: 'Download Date', field: 'Download Date', name: 'Download Date', dataType: 'date'},
		{id: 'Last Played', field: 'Last Played', name: 'Last Played', dataType: 'time'},
		{id: 'Heard', field: 'Heard', name: 'Heard', dataType: 'boolean'}
	];

	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			dataSource: dataSource, 
			size: 100
		}),
		structure: layout,
		selectRowTriggerOnCell: true,
		modules: [
			Filter,
			SingleSort,
			VirtualVScroller,
			Focus,
			SelectRow,
			RowHeader,
			{
				moduleClass: FilterBar,
				maxRuleCount: Infinity,
				filterData: {
					type: 'all',
					conditions: [
						{
							colId: "",
							condition: "contain",
							type: "Text",
							value: "Easy"
						}
					]
				},
				ruleCountToConfirmClearFilter: 2
			}
		]
	});
	grid.placeAt('gridContainer');
	grid.startup();

	//Test functions, must be global
	window.setStore = function(){
		grid.setStore(storeFactory({
			dataSource: dataSource,
			size: 50 + parseInt(Math.random() * 200, 10)
		}));
	};

	//Test buttons
	
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');
	
	fb = grid.filterBar;
	applyFilter = function(){
		var filterData = {"type":"any","conditions":[{"colId":"id","condition":"greater","value":95,"type":"Number"},{"colId":"Artist","condition":"contain","value":"Jimi Hendrix","type":"Text"}]};
		fb.applyFilter(filterData);
	};
	clear = function(){
		fb.clearFilter();
	};
	clearWithoutConfirm = function(){
		fb.clearFilter(true);
	};
	showOrHide = function(){
		var isHiding = fb.domNode.style.display == "none";
		fb[isHiding ? "show" : "hide"]();
		this.set("label", isHiding ? "Hide fiter bar" : "Show filter bar");
	};
	showFilterDialog = function(){
		fb.showFilterDialog();
	};
	setIdentityFilterable = function(){
		var c = grid.column("id", true);
		c.setFilterable(!c.isFilterable());
		this.set("label", c.isFilterable() ? 'Set "Identity" column un-filterable' : 'Set "Identity" column filterable');
	};
	getConditions = function(){
		var c = grid.column("Download Date", true);
		alert(dojo.toJson(c.filterConditions()));
	};

	tp.addTestSet('Filter Actions', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: applyFilter">Apply a given filter</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: clear">Clear current filter</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: clearWithoutConfirm">Clear current filter without confirm</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: showOrHide">Hide filter bar</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: showFilterDialog">Show filter dialog</div><br/>',
	''].join(''));
	tp.addTestSet('Column Extended Actions', [
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: setIdentityFilterable">Set "Identity" column un-filterable</div><br/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: getConditions">Get the available conditions of column "Download Date"</div><br/>',
	''].join(''));
	tp.startup();
	
	
});
