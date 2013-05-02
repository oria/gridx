require([
	'dojo/on',
	'dojo/query',
	'dojo/dom-class',
	'dojo/number',
	'dijit/Tooltip',
	'dojo/NodeList-dom',
	'dojo/domReady!'
], function(on, query, domClass, number, Tooltip){

var modules = {
	ExtendedSelectRow: {path: 'extendedSelect/Row'},
	ExtendedSelectColumn: {},
	ExtendedSelectCell: {},
	Filter: {},
	FilterBar: {},
	QuickFilter: {},
	Dod: {},
	MoveColumn: {},
	MoveRow: {},
	DndColumn: {path: 'dnd/Column'},
	DndRow: {path: 'dnd/Row'},
	Pagination: {},
	PaginationBar: {},
	PaginationBarDD: {},
	SelectRow: {},
	SelectColumn: {},
	SelectCell: {},
	Bar: {},
	CellWidget: {},
	Edit: {},
	GroupHeader: {},
	HeaderMenu: {},
	HeaderRegions: {},
	HiddenColumns: {},
	IndirectSelect: {},
	IndirectSelectColumn: {},
	Menu: {},
	NavigableCell: {},
	SingleSort: {},
	NestedSort: {},
	PagedBody: {},
	Persist: {},
	RowHeader: {},
	ColumnLock: {},
	RowLock: {},
	Tree: {},
	Traverse: {},
	TouchScroll: {},
	TouchVScroller: {},
	VirtualVScroller: {}
};

var conflictStages = ['Compatible', 'Limited', 'Incompatible', 'Exclusive'];

var conflicts = {
	RowLock: {
		VirtualVScroller: [2, '']
	},
	PagedBody: {
		VirtualVScroller: [2, ''],
		Pagination: [2, ''],
		PaginationBar: [2, ''],
		PaginationBarDD: [2, '']
	},
	GroupHeader: {
		ColumnLock: [2, ''],
		HiddenColumns: [2, ''],
		DndColumn: [1, '']
	},
	Tree: {
		Filter: [1, ''],
		FilterBar: [1, ''],
		QuickFilter: [1, ''],
		RowLock: [2, '']
	},
	MoveRow: {
		SingleSort: [2, ''],
		NestedSort: [2, ''],
		RowLock: [2, '']
	},
	DndRow: {
		SingleSort: [2, ''],
		NestedSort: [2, ''],
		RowLock: [2, '']
	},
	SelectRow: {
		ExtendedSelectRow: [3, '']
	},
	SelectColumn: {
		ExtendedSelectColumn: [3, '']
	},
	SelectCell: {
		ExtendedSelectCell: [3, '']
	},
	IndirectSelect: {
		IndirectSelectColumn: [3, '']
	},
	SingleSort: {
		NestedSort: [3, '']
	},
	VirtualVScroller: {
		TouchVScroller: [3, '']
	},
	PaginationBar: {
		PaginationBarDD: [3, '']
	}
};

function normConflicts(conflicts){
	for(var name in conflicts){
		var item = conflicts[name];
		for(var c in item){
			conflicts[c] = conflicts[c] || {};
			conflicts[c][name] = item[c];
		}
	}
	return conflicts;
}

function buildTable(modules, conflicts){
	var i = 0, j = 0,
		sb = ['<table class="compatTable compatTableHeader"><thead><tr><th class="compatRowHeader compatColHeader">',
			'<div class="compatTableTitle">Gridx Modules Compatibility Matrix</div>',
		'</th>'];
	for(var name in modules){
		sb.push('<th class="compatColHeader" cidx="', i++, '"><div class="compatColHeaderInner">', name, '</div></th>');
	}
	sb.push('</tr></thead></table><table class="compatTable"><tbody>');
	for(var n in modules){
		sb.push('<tr><td class="compatRowHeader" ridx="', j, '">', n, '</td>');
		i = 0;
		for(var m in modules){
			var cls = '';
			if(n == m){
				cls = 'compatSelf';
			}else{
				cls = 'compat' + conflictStages[((conflicts[n] || {})[m] || [0])[0]];
			}
			sb.push('<td cidx="', i++, '" ridx="', j, '" rm="', n, '" cm="', m, '" class="compatCell ', cls, '"></td>');
		}
		sb.push('</tr>');
		++j;
	}
	sb.push('</tbody></table>');
	return sb.join('');
}

function onMouseOver(evt){
	var container = document.getElementById('compatContainer');
	query('.compatHover', container).removeClass('compatHover');
	var isCell = -1;
	if(evt.target.hasAttribute('ridx')){
		isCell++;
		var ridx = evt.target.getAttribute('ridx');
		query('[ridx="' + ridx + '"]', container).addClass('compatHover');
	}
	if(evt.target.hasAttribute('cidx')){
		isCell++;
		var cidx = evt.target.getAttribute('cidx');
		query('[cidx="' + cidx + '"]', container).addClass('compatHover');
	}
	if(isCell == 1){
		var rMod = evt.target.getAttribute('rm');
		var cMod = evt.target.getAttribute('cm');
		var item = conflicts[rMod] && conflicts[rMod][cMod];
		item = item || conflicts[cMod] && conflicts[cMod][rMod];
		if(item){
			var msg = ['<span>', rMod, '</span> and <span>', cMod, '</span>'];
			if(item[0] == 1){
				msg.push('are partially compatible to each other.');
			}else if(item[0] == 2){
				msg.push('are NOT compatible to each other.');
			}else if(item[0] == 3){
				msg.push('are two different implementations of one component.');
			}
			msg.push('<br/><div class="detailMsg">', item[1], '</div>');
			Tooltip.show(msg.join(' '), evt.target, ['below']);
		}
	}
}

function calcCompatRate(container){
	var total = (query('.compatCell', container).length -
			query('.compatSelf', container).length -
			query('.compatExclusive', container).length) / 2;
	var imcompat = (query('.compatIncompatible', container).length +
			query('.compatLimited', container).length) / 2;
	return (total - imcompat) / total;
}

var container = document.getElementById('compatContainer');
container.innerHTML = buildTable(modules, normConflicts(conflicts));
document.getElementById('compatRate').innerHTML = number.round(calcCompatRate(container) * 100, 2) + '%';
query('.compatTable').on('mouseover', onMouseOver);
document.getElementById('loading').style.display = 'none';

});
