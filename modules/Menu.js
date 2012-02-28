define([
	"dojo/_base/declare",
	"../core/_Module",
	"dojo/_base/html",
	"dojo/keys",
	"dojo/_base/event",
	"dojo/_base/lang",
	"dijit/registry",
	"dijit/Menu"
], function(declare, _Module, html, keys, event, lang, dijit, Menu){

/*=====
	var _MenuArgs = function(){
		//hookPoint: String?
		//		Indicates from where the menu should occur.
		//		One of "cell", "headercell", "row", "header", "body", "grid". If invalid, default to "grid".
		//selected: Boolean?
		//		Indicates whether to bind this menu only to the selected items. Default is false.
	};

	var _MenuContext = function(){
		//grid: Grid
		//		This grid that triggers this menu.
		//column: Column
		//		The column that triggers this menu. Only valid for "headercell" hookpoint.
		//row: Row
		//		The row that triggers this menu. Only valid for "row" hookpoint.
		//cell: Cell
		//		The cell that triggers this menu. Only valid for "cell" hookpoint.
	};
=====*/

	return _Module.register(
	declare(_Module, {
		name: 'menu',

		getAPIPath: function(){
			return {
				menu: this 
			};
		},
	
		constructor: function(){
			this._menus = {};
		},

		//Public---------------------------------------------

		//context: __MenuContext
		//		An object representing the current context when user triggers a context menu.
		//		This property is updated everytime a menu of grid is popped up.
		//		Users can refer to this in their menu action handlers by grid.menu.context.
		context: null,

		bind: function(/* dijit.Menu|ID */ menu, /* __MenuArgs? */ args){
			//summary:
			//		Bind a memu to grid, according to the provided args
			//menu: dijit.Menu | ID
			//		The menu to be binded.
			//args: __MenuArgs
			//		Indicates how to bind the menu
			var t = args.hookPoint.toLowerCase(),
				type = args.selected ? t + '-selected' : t,
				evtName = this._evtMap[t],
				m = this._menus[type] = this._menus[type] || {},
				showMenu = lang.partial(this._showMenu, type);
			this.disconnect(m.open);
			this.disconnect(m.close);
			m.menu = dijit.byId(menu);
			if(evtName){
				m.open = this.connect(this.grid, evtName, showMenu);
			}else if(t == 'body'){
				m.open = this.connect(this.grid.bodyNode, 'oncontextmenu', showMenu);
			}else{
				m.open = this.connect(this.grid.domNode, 'oncontextmenu', showMenu);
			}
			m.close = this.connect(m.menu, 'onClose', function(){
				this._mutex = 0;
			});
		},

		unbind: function(menu){
			//summary:
			//		Unbind a menu from grid.
			//menu: dijit.Menu | ID
			//		The menu to be unbinded.
			var type, menus = this._menus;
			menu = dijit.byId(menu);
			for(type in menus){
				if(menus[type].menu == menu){
					this.disconnect(menus[type].open);
					this.disconnect(menus[type].close);
					delete menus[type];
					return;
				}
			}
		},
		
		//[private]==
		_evtMap: {
			header: 'onHeaderContextMenu',
			headercell: 'onHeaderCellContextMenu',
			cell: 'onCellContextMenu',
			row: 'onRowContextMenu'
		},

		_showMenu: function(type, e){
			if(!this._mutex && this._menus[type].menu){
				var g = this.grid,
					isRow = !type.indexOf('row'),
					isCell = !type.indexOf('cell'),
					isHeaderCell = !type.indexOf('headercell'),
					isSelectedType = type.indexOf('-') > 0,
					selected = !!((isCell && html.hasClass(e.cellNode, "gridxCellSelected")) ||
						(isHeaderCell && html.hasClass(g.header.getHeaderNode(e.columnId), "gridxColumnSelected")) ||
						(isRow && html.hasClass(g.body.getRowNode({rowId: e.rowId}), "gridxRowSelected")));
				if(isSelectedType == selected || (!isSelectedType && selected && !this._menus[type + '-selected'])){
					this.context = {
						grid: g,
						column: isHeaderCell ? g.column(e.columnId, true) : undefined,
						row: isRow ? g.row(e.rowId, true) : undefined,
						cell: isCell ? g.cell(e.rowId, e.columnId, true) : undefined
					};
					event.stop(e);
					this._mutex = 1;
					this._menus[type].menu._openMyself({
						target: e.target, 
						coords: e.keyCode != keys.F10 && "pageX" in e ? {x: e.pageX, y: e.pageY} : null
					});
				}
			}
		}
	}));
});

