define([
], function(){

	return [
		{
			version: 1.2,
			title: "1 layer of groups, all columns in group",
			guide: [
				'resize columns',
				'resize group headers'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'id:1'},
				{id: 'Genre', field: 'Genre', name: 'Genre:2'},
				{id: 'Artist', field: 'Artist', name: 'Artist:3'},
				{id: 'Album', field: 'Album', name: 'Album:4'},
				{id: 'Name', field: 'Name', name: 'Name:5'},
				{id: 'Year', field: 'Year', name: 'Year:6'},
				{id: 'Length', field: 'Length', name: 'Length:7'},
				{id: 'Track', field: 'Track', name: 'Track:8'},
				{id: 'Composer', field: 'Composer', name: 'Composer:9'},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date:10'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played:11'},
				{id: 'Heard', field: 'Heard', name: 'Heard:12'}
			],
			modules: [
				"gridx/modules/ColumnResizer",
				"gridx/modules/move/Column",
				"gridx/modules/GroupHeader"
			],
			props: {
				headerGroups: [
					{name: 'Group 1', children: 3},
					{name: 'Group 2', children: 5},
					{name: 'Group 3', children: 4}
				]
			}
		},
		{
			version: 1.2,
			title: '1 layer of groups, some columns not in group',
			guide: [
				'resize columns',
				'resize group headers'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'id:1'},
				{id: 'Genre', field: 'Genre', name: 'Genre:2'},
				{id: 'Artist', field: 'Artist', name: 'Artist:3'},
				{id: 'Album', field: 'Album', name: 'Album:4'},
				{id: 'Name', field: 'Name', name: 'Name:5'},
				{id: 'Year', field: 'Year', name: 'Year:6'},
				{id: 'Length', field: 'Length', name: 'Length:7'},
				{id: 'Track', field: 'Track', name: 'Track:8'},
				{id: 'Composer', field: 'Composer', name: 'Composer:9'},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date:10'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played:11'},
				{id: 'Heard', field: 'Heard', name: 'Heard:12'}
			],
			modules: [
				"gridx/modules/ColumnResizer",
				"gridx/modules/move/Column",
				"gridx/modules/GroupHeader"
			],
			props: {
				headerGroups: [
					1,
					{name: 'Group 1', children: 2},
					2,
					{name: 'Group 2', children: 2},
					{name: 'Group 3', children: 2}
				]
			}
		},
		{
			version: 1.2,
			title: "multiple layers of groups",
			guide: [
				'resize columns',
				'resize group headers'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'id:1'},
				{id: 'Genre', field: 'Genre', name: 'Genre:2'},
				{id: 'Artist', field: 'Artist', name: 'Artist:3'},
				{id: 'Album', field: 'Album', name: 'Album:4'},
				{id: 'Name', field: 'Name', name: 'Name:5'},
				{id: 'Year', field: 'Year', name: 'Year:6'},
				{id: 'Length', field: 'Length', name: 'Length:7'},
				{id: 'Track', field: 'Track', name: 'Track:8'},
				{id: 'Composer', field: 'Composer', name: 'Composer:9'},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date:10'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played:11'},
				{id: 'Heard', field: 'Heard', name: 'Heard:12'}
			],
			modules: [
				"gridx/modules/ColumnResizer",
				"gridx/modules/move/Column",
				"gridx/modules/GroupHeader"
			],
			props: {
				headerGroups: [
					{name: 'Group 1',
						children: [
							{name: 'Group 1-1',
								children: [
									{name: 'Group 1-1-1', children: 1},
									{name: 'Group 1-1-2', children: 2}
								]
							},
							{name: 'Group 1-2',
								children: [
									{name: 'Group 1-2-1', children: 1},
									{name: 'Group 1-2-2', children: 2}
								]
							}
						]
					},
					{name: 'Group 2',
						children: [
							{name: 'Group 2-1',
								children: [
									{name: 'Group 2-1-1', children: 2},
									{name: 'Group 2-1-2', children: 1}
								]
							},
							{name: 'Group 2-2',
								children: [
									{name: 'Group 2-2-1', children: 2},
									{name: 'Group 2-2-2', children: 1}
								]
							}
						]
					}
				]
			}
		},
		{
			version: 1.2,
			title: "multiple layers of groups, has rowspan",
			guide: [
				'resize columns',
				'resize group headers',
				'use up/down arrow keys to navigate to/from group header',
				'use left/right arrow keys to navigate among group headers or columns in the save level'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'id:1'},
				{id: 'Genre', field: 'Genre', name: 'Genre:2'},
				{id: 'Artist', field: 'Artist', name: 'Artist:3'},
				{id: 'Album', field: 'Album', name: 'Album:4'},
				{id: 'Name', field: 'Name', name: 'Name:5'},
				{id: 'Year', field: 'Year', name: 'Year:6'},
				{id: 'Length', field: 'Length', name: 'Length:7'},
				{id: 'Track', field: 'Track', name: 'Track:8'},
				{id: 'Composer', field: 'Composer', name: 'Composer:9'},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date:10'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played:11'},
				{id: 'Heard', field: 'Heard', name: 'Heard:12'}
			],
			modules: [
				"gridx/modules/ColumnResizer",
//                "gridx/modules/move/Column",
				"gridx/modules/GroupHeader"
			],
			props: {
				headerGroups: [
					2,
					{name: 'Group 1',
						children: [
							{name: 'Group 1-1',
								children: [
									{name: 'Group 1-1-1', children: 2},
									{name: 'Group 1-1-2', children: 2}
								]
							},
							1,
							{name: 'Group 1-2', children: 2}
						]
					}
				]
			}
		},
		{
			version: 1.2,
			title: "GroupHeader and autoWidth",
			guide: [
				'resize columns',
				'resize group headers'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'id:1'},
				{id: 'Genre', field: 'Genre', name: 'Genre:2'},
				{id: 'Artist', field: 'Artist', name: 'Artist:3'},
				{id: 'Album', field: 'Album', name: 'Album:4'},
				{id: 'Name', field: 'Name', name: 'Name:5'},
				{id: 'Year', field: 'Year', name: 'Year:6'},
				{id: 'Length', field: 'Length', name: 'Length:7'},
				{id: 'Track', field: 'Track', name: 'Track:8'},
				{id: 'Composer', field: 'Composer', name: 'Composer:9'},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date:10'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played:11'},
				{id: 'Heard', field: 'Heard', name: 'Heard:12'}
			],
			modules: [
				"gridx/modules/ColumnResizer",
//                "gridx/modules/move/Column",
				"gridx/modules/GroupHeader"
			],
			props: {
				autoWidth: true,
				headerGroups: [
					2,
					{name: 'Group 1',
						children: [
							{name: 'Group 1-1',
								children: [
									{name: 'Group 1-1-1', children: 2},
									{name: 'Group 1-1-2', children: 2}
								]
							},
							1,
							{name: 'Group 1-2', children: 2}
						]
					}
				]
			}
		},
		{
			version: 1.2,
			title: "GroupHeader and columnWidthAutoResize",
			guide: [
				'make grid wider/narrower'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'id:1'},
				{id: 'Genre', field: 'Genre', name: 'Genre:2'},
				{id: 'Artist', field: 'Artist', name: 'Artist:3'},
				{id: 'Album', field: 'Album', name: 'Album:4'},
				{id: 'Name', field: 'Name', name: 'Name:5'},
				{id: 'Year', field: 'Year', name: 'Year:6'},
				{id: 'Length', field: 'Length', name: 'Length:7'},
				{id: 'Track', field: 'Track', name: 'Track:8'},
				{id: 'Composer', field: 'Composer', name: 'Composer:9'},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date:10'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played:11'},
				{id: 'Heard', field: 'Heard', name: 'Heard:12'}
			],
			modules: [
//                "gridx/modules/move/Column",
				"gridx/modules/GroupHeader"
			],
			props: {
				columnWidthAutoResize: true,
				headerGroups: [
					2,
					{name: 'Group 1',
						children: [
							{name: 'Group 1-1',
								children: [
									{name: 'Group 1-1-1', children: 2},
									{name: 'Group 1-1-2', children: 2}
								]
							},
							1,
							{name: 'Group 1-2', children: 2}
						]
					}
				]
			}
		},
		{
			version: 1.2,
			title: "GroupHeader Degenerated to normal header",
			guide: [
				'resize columns'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{id: 'id', field: 'id', name: 'id:1'},
				{id: 'Genre', field: 'Genre', name: 'Genre:2'},
				{id: 'Artist', field: 'Artist', name: 'Artist:3'},
				{id: 'Album', field: 'Album', name: 'Album:4'},
				{id: 'Name', field: 'Name', name: 'Name:5'},
				{id: 'Year', field: 'Year', name: 'Year:6'},
				{id: 'Length', field: 'Length', name: 'Length:7'},
				{id: 'Track', field: 'Track', name: 'Track:8'},
				{id: 'Composer', field: 'Composer', name: 'Composer:9'},
				{id: 'Download Date', field: 'Download Date', name: 'Download Date:10'},
				{id: 'Last Played', field: 'Last Played', name: 'Last Played:11'},
				{id: 'Heard', field: 'Heard', name: 'Heard:12'}
			],
			modules: [
				"gridx/modules/ColumnResizer",
				"gridx/modules/move/Column",
				"gridx/modules/GroupHeader"
			],
			props: {
				headerGroups: []
			}
		}
	];
});

