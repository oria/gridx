define([
	'gridx/allModules'
], function(modules){

	return [
		{
			title: 'empty store and empty column structure',
			guide: [
				'no error',
				'grid show empty info',
				'set column to show header',
				'set store to show data'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 0,
			structure: []
		},
		{
			title: 'single cell',
			guide: [
				'no error',
				'toggle header',
				'add row',
				'toggle bodyStuffEmptyCell',
				'toggle bodyRowHoverEffect',
				'remove row to empty'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 1,
			structure: [{name: 'One Cell'}],
			props: {
				autoHeight: true,
				autoWidth: true,
				headerHidden: true
			}
		},
		{
			title: "special column definitions",
			guide: [
				'1st column empty',
				'2nd column only has header name',
				'3rd column show "Genre" field, but no name',
				'4th column show same as 3rd, but has name',
				'5th column show formatted data "Year - Length"',
				'6th column show decorated effect',
				'7th column has css class on header',
				'8th column has css style on header'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{},
				{name: 'name'},
				{field: 'Genre'},
				{id: 'myCol', name: 'Another Genre', field: 'Genre'},
				{formatter: function(rawData){ return rawData.Year + ' - ' + rawData.Length; }},
				{field: 'Name', decorator: function(data){ return '<b style="color: red;">' + data + '</b>'; }},
				{name: 'very long column header content', headerClass: 'myHeaderClass'},
				{name: 'very long column header content', headerStyle: 'color: red; font-weight: bolder;'}
			]
		}
	];
});
