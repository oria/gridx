require([
	'require',
	'dojo/parser',
	'dojo/_base/lang',
	'dojo/_base/query',
	'dojo/_base/array',
	'dojo/DeferredList',
	'dojo/dom',
	'dojo/dom-construct',
	'dojo/dom-geometry',
	'dojo/dom-class',
	'dojo/dom-style',
	'dijit/registry',
	'gridx/tests/demo/util/ColumnBar',
	'gridx/tests/demo/util/modules',
	'gridx/tests/demo/util/attrs',
	'gridx/tests/demo/util/data',
	'dojo/store/Memory',
	'gridx/Grid',
	'gridx/allModules',
	'gridx/core/model/cache/Sync',
	'dojo/domReady!',
	'dojo/NodeList-manipulate',
	'dijit/form/NumberSpinner',
	'dijit/form/NumberTextBox'
], function(require, parser, lang, query, array, DeferredList,
	dom, domConstruct, domGeo, domClass, domStyle,
	registry, ColumnBar, modules, attrs, data,
Store, Grid){

	query('#showConfig').on('click', toggleConfig);
	query('#configComplete').on('click', function(){
		toggleConfig(null, false);
		createGrid();
	});
	query('#showGrid').on('click', function(){
		toggleConfig(null, false);
		toggleCode(null, false);
		createGrid();
	});
	query('#showCode').on('click', toggleCode);
	query('.codeContainerTitle').on('mouseover', function(e){
		query('.codeContainerTitle').forEach(function(node){
			domClass.toggle(node, 'codeContainerTitleSelected', e.target == node);
		});
		domClass.toggle('jscodeContainer', 'codeHidden', e.target.id != 'jscodeTitle');
		domClass.toggle('htmlcodeContainer', 'codeHidden', e.target.id != 'htmlcodeTitle');
	});

	query('.closeCode').on('click', toggleCode);
	query('.closeConfig').on('click', function(){
		query('.configDetailOpen').removeClass('configDetailOpen');
	});
	query('#columnsConfig .closeConfig').on('click', columnsSummary);
	query('#modulesConfig .closeConfig').on('click', modulesSummary);
	query('#attributesConfig .closeConfig').on('click', attributesSummary);

	query('#storeConfigPreview').on('click', function(){
		query('#storeConfig').addClass('configDetailOpen');
	});
	query('#columnsConfigPreview').on('click', function(){
		query('#columnsConfig').addClass('configDetailOpen');
	});
	query('#modulesConfigPreview').on('click', function(){
		query('#modulesConfig').addClass('configDetailOpen');
	});
	query('#attributesConfigPreview').on('click', function(){
		query('#attributesConfig').addClass('configDetailOpen');
	});
	query('#addColumnBtn').on('click', function(){
		addColumnBar();
	});
	query('#modulesAvailable').on('dblclick', function(e){
		var n = e.target;
		while(n && !domClass.contains(n, 'moduleItem')){
			n = n.parentNode;
		}
		if(n && domClass.contains(n, 'moduleItem')){
			useModule(n);
			dom.byId('modulesLoadedCover').style.display = 'none';
		}
	});
	query('#modulesLoaded').on('dblclick', function(e){
		var n = e.target;
		while(n && !domClass.contains(n, 'moduleItem')){
			n = n.parentNode;
		}
		if(n && domClass.contains(n, 'moduleItem')){
			delModule(n);
			attributesSummary();
			if(!query('.moduleItem', 'modulesLoaded').length){
				dom.byId('modulesLoadedCover').style.display = '';
			}
		}
	});
	query('#modulesConfig').on('mousedown', function(e){
		var n = e.target;
		while(n && !domClass.contains(n, 'moduleItem')){
			n = n.parentNode;
		}
		if(n && domClass.contains(n, 'moduleItem')){
			query('.moduleItemFocus').removeClass('moduleItemFocus');
			domClass.add(n, 'moduleItemFocus');
			dom.byId('moduleDescCover').style.display = 'none';
			showModuleDetail(modules[n.getAttribute('data-mod-idx')]);
		}
	});
	query('.attributesPane').on('mouseover', function(e){
		var n = e.target;
		while(n && !domClass.contains(n, 'attributesPane')){
			n = n.parentNode;
		}
		query('.attributesPaneSelected').removeClass('attributesPaneSelected');
		domClass.add(n, 'attributesPaneSelected');
	});
	query('#columnsContainer').on('mousedown', function(e){
		var n = e.target;
		if(!domClass.contains(n, 'columnBar')){
			while(n && !domClass.contains(n, 'columnBarIndex')){
				n = n.parentNode;
			}
			if(n){
				n = n.parentNode;
			}
		}
		if(n){
			dom.setSelectable('columnsConfig', false);
			this._dndReady = true;
			this._dndColNode = n;
		}
	});
	query('body').on('mousemove', function(e){
		var container = query('#columnsContainer')[0];
		var n = container._dndColNode;
		var pos;
		if(container._dndReady){
			delete container._dndReady;
			container._dnd = true;
			pos = domGeo.position(container);
			n.style.top = (e.clientY - pos.y - 20) + 'px';
			n.previousSibling.style.height = '104px';
			container._pad = n.nextSibling;
			container.removeChild(n.nextSibling);
			domClass.add(n.previousSibling, 'betweenColumnsBarExpanded');
			domConstruct.place(n, 'addColumnBtn', 'after');
			
			domClass.add(n, 'columnBarDnD');
			setTimeout(function(){
				domClass.add(container, 'columnDnD');
			}, 1);
		}else if(container._dnd){
			pos = domGeo.position(container);
			var y = e.clientY - pos.y - 20;
			n.style.top = y + 'px';
			var found = query('.columnBar').some(function(columnBarNode){
				if(columnBarNode != n){
					var p = domGeo.position(columnBarNode);
					if((p.y + p.h / 2) > e.clientY){
						var pad = query('.betweenColumnsBarExpanded', 'columnsContainer');
						if(columnBarNode.previousSibling != pad[0]){
							pad.removeClass('betweenColumnsBarExpanded').style('height', '');
							domClass.add(columnBarNode.previousSibling, 'betweenColumnsBarExpanded');
							columnBarNode.previousSibling.style.height = '104px';
						}
						return true;
					}
				}
			});
			if(!found){
				var pad = query('.betweenColumnsBarExpanded', 'columnsContainer');
				var lastPad = dom.byId('addColumnBtn').previousSibling;
				if(lastPad != pad){
					pad.removeClass('betweenColumnsBarExpanded').style('height', '');
					domClass.add(lastPad, 'betweenColumnsBarExpanded');
					lastPad.style.height = '104px';
				}
			}
			endScrollColumns();
			if(e.clientY < pos.y + 40){
				startScrollColumns(-1);
			}else if(e.clientY > pos.y + pos.h - 40){
				startScrollColumns(1);
			}
		}
	});
	query('body').on('mouseup', function(e){
		var container = query('#columnsContainer')[0];
		if(container._dnd || container._dndReady){
			delete container._dndReady;
			delete container._dnd;
			var pad = query('.betweenColumnsBarExpanded', 'columnsContainer').removeClass('betweenColumnsBarExpanded')[0];
			pad.style.height = '';
			container._dndColNode.style.top = '';
			domConstruct.place(container._dndColNode, pad, 'after');
			domConstruct.place(container._pad, container._dndColNode, 'after');
			domClass.remove(container._dndColNode, 'columnBarDnD');
			domClass.remove(container, 'columnDnD');
			dom.setSelectable('columnsConfig', true);
			updateColumnIdx();
		}
	});
	colScrollHandler = null;
	function startScrollColumns(dir){
		if(!colScrollHandler){
			colScrollHandler = setInterval(function(){
				dom.byId('columnsContainer').scrollTop += dir * 10;
			}, 10);
		}
	}
	function endScrollColumns(){
		clearInterval(colScrollHandler);
		colScrollHandler = null;
	}

	function toggleConfig(e, toShow){
		if(domClass.contains(query('#codeViewer')[0], 'configOpen')){
			toggleCode(null, false);
		}
		var cfg = query('#config');
		if(toShow === undefined){
			toShow = !domClass.contains(cfg[0], 'configOpen');
		}
		cfg.toggleClass('configOpen', toShow);
		cfg.style('height', toShow ? '642px' : '0');
	}
	function toggleCode(e, toShow){
		updateJSCode();
		var cfg = query('#codeViewer');
		if(toShow === undefined){
			toShow = !domClass.contains(cfg[0], 'configOpen');
		}
		cfg.toggleClass('configOpen', toShow);
		cfg.style('height', toShow ? '642px' : '0');
	}

	function updateColumnIdx(){
		var cols = dom.byId('columnsContainer').childNodes;
		for(var i = 0, idx = 1; i < cols.length; ++i){
			var col = cols[i];
			if(domClass.contains(col, 'columnBar')){
				col = registry.byNode(col);
				col.setIndex(idx);
				++idx;
			}
		}
	}
	cid = 1;
	function addColumnBar(refCol, colProps){
		colProps = colProps || {};
		var colbar = new ColumnBar({
			columnId: colProps.id || 'column_' + cid++,
			columnName: colProps.name || 'New Column',
			fields: ['Genre', 'Name', 'Artist'],
			onAdd: function(){
				addColumnBar(this);
			},
			onDelete: function(){
				var t = this;
				t.domNode.style.height = 0;
				setTimeout(function(){
					t.domNode.parentNode.removeChild(t.domNode.nextSibling);
					t.domNode.parentNode.removeChild(t.domNode);
					updateColumnIdx();
					t.destroy();
				}, 500);
			}
		});
		if(refCol){
			colbar.placeAt(refCol.domNode, 'after');
			domConstruct.create('div', {
				'class': 'betweenColumnsPad'
			}, colbar.domNode, 'before');
		}else{
			colbar.placeAt('addColumnBtn', 'before');
			domConstruct.create('div', {
				'class': 'betweenColumnsPad'
			}, colbar.domNode, 'after');
		}
		updateColumnIdx();
		setTimeout(function(){
			colbar.domNode.style.height = '80px';
		}, 40);
	}

	function columnsSummary(){
		var cols = query('.columnBar', 'columnsContainer').map(function(columnBarNode){
			return colBar = registry.byNode(columnBarNode).getColumn();
		});
		cols.sort(function(col1, col2){
			return col1.index - col2.index;
		});
		var sb = [];
		sb.push.apply(sb, cols.map(function(col){
			return ['<tr>',
				'<td class="columnsConfigPreviewSummaryIdx">', col.index, '</td>',
				'<td class="columnsConfigPreviewSummaryId">', col.id, '</td>',
				'<td class="columnsConfigPreviewSummaryName">', col.name, '</td>',
				'<td class="columnsConfigPreviewSummaryField">', col.field, '</td>',
				'<td class="columnsConfigPreviewSummaryWidth">', col.width, '</td>',
			'</tr>'].join('');
		}));
		query('tbody', 'columnsConfigPreviewSummaryInner').innerHTML(sb.join(''));
	}
	function modulesSummary(){
		dom.byId('modulesConfigPreviewSummary').innerHTML = query('.moduleItem', 'modulesLoaded').map(function(modNode){
			var bg = domStyle.get(query('.moduleIcon', modNode)[0], 'backgroundImage');
			var label = query('.moduleLabel td', modNode)[0].innerHTML;
			return ["<div class='modulePreviewItem' style='background: ", bg, ";'>",
				'<div class="modulePreviewItemLabel"><table><tr><td>', label, '</td></tr></table></div>',
			'</div>'].join('');
		}).join('');
	}
	function attributesSummary(){
		var rows = query('.attributeItemUsed', 'attributesConfig').map(function(attrNode){
			var label = attrNode.getAttribute('data-attr-name');
			var attr = attrsByName[label];
			return ["<tr><td class='attributePreviewItemLabel'>", label,
				"</td><td class='attributePreviewItemValue'>", attr.curValue,
				"</td></tr>"].join('');
		});
		query('#attributesConfigPreviewSummary tbody')[0].innerHTML = rows.join('');
	}
	function loadModules(){
		var coreMods = array.map(Grid.prototype.coreModules, function(m){
			return m.prototype.name;
		}).concat(['autoScroll', '_dnd']);
		dom.byId('modulesAvailable').innerHTML = array.map(modules, function(mod, i){
			var prot = mod.module.prototype;
			mod.deps = array.filter((prot.forced || []).concat(prot.required || []), function(dep){
				return array.indexOf(coreMods, dep) < 0;
			});
			return [
				"<div class='moduleItem' data-mod-idx='", i, "' data-mod-name='", mod.module.prototype.name,
				"' title='click to show description, double click to use'><div class='moduleIcon' style='background:url(\"",
				mod.icon,
				"\");'></div><div class='moduleLabel'><table><tr><td>",
				mod.label,
				"</td></tr></table></div></div>"
			].join('');
		}).join('');
	}
	var attrsByName = {};
	function loadAttributes(){
		array.forEach(attrs, function(attr){
			var name = attr._name = attr.mod ? attr.name.slice(0, 1).toUpperCase() + attr.name.slice(1) : attr.name;
			attr.label = attr.mod ? attr.mod + name : name;
			attrsByName[attr.label] = attr;
			attr.curValue = attr.value;
		});
		loadBoolAttributes();
		loadNumberAttributes();
	}
	function boolBtn(value){
		return [
			"<div class='attributeBoolBtn ", value ? "attributeBoolOn" : "", "'>",
				"<div class='attributeBoolBtnInner'>",
					"<table border='0' cellpadding='0' cellborder='0'><tbody><tr><td class='attributeBoolBtnOn'>on</td>",
					"<td class='attributeBoolBtnOff'>off</td></tr></tbody></table>",
					"<div class='attributeBoolBtnHandle'></div>",
				"</div>",
			"</div>"
		].join('');
	}
	function loadBoolAttributes(){
		dom.byId('attributesBoolInner').innerHTML = array.map(array.filter(attrs, function(attr){
			return attr.type == 'bool';
		}), function(attr, i){
			return ["<div class='attributeBoolItem attributeItem ",
				attr.mod ? 'attributeItemDisabled' : '',
				"' data-attr-mod='", attr.mod,
				"' data-attr-name='", attr.label, 
				"'><table><tbody><tr><td>",
				boolBtn(attr.value),
				"</td><td>",
				"<div class='attributeBoolItemDesc'>", attr.name, "</div>",
			"</td></tr></tbody></table></div>"].join('');
		}).join('');
		query('.attributeBoolBtn', 'attributesBoolInner').on('click', function(){
			domClass.toggle(this, 'attributeBoolOn');
			var n = this.parentNode;
			while(!domClass.contains(n, 'attributeItem')){
				n = n.parentNode;
			}
			var attr = attrsByName[n.getAttribute('data-attr-name')];
			domClass.toggle(n, 'attributeItemUsed', domClass.contains(this, 'attributeBoolOn') != attr.value);
			attr.curValue = domClass.contains(this, 'attributeBoolOn');
		});
	}
	function loadNumberAttributes(){
		dom.byId('attributesNumberInner').innerHTML = array.map(array.filter(attrs, function(attr){
			return attr.type == 'number';
		}), function(attr, i){
			return ["<div class='attributeNumberItem attributeItem ",
				attr.mod ? 'attributeItemDisabled' : '',
				"' data-attr-mod='", attr.mod,
				"' data-attr-name='", attr.label, 
				"'>", attr.unitPre,
				{
					spinner: "<span class='attributeNumberInput' data-dojo-type='dijit/form/NumberSpinner'",
					numberTextBox: "<span class='attributeNumberInput' data-dojo-type='dijit/form/NumberTextbox'"
				}[attr.editor],
				" data-dojo-props='value: ", attr.value, "'></span>",
				attr.unitPost,
			"</div>"].join('');
		}).join('');
		parser.parse(dom.byId('attributesNumberInner'));
		setTimeout(function(){
			query('.attributeNumberInput', 'attributesNumberInner').forEach(function(n){
				var valueBox = registry.byNode(n);
				var attr = attrsByName[n.parentNode.getAttribute('data-attr-name')];
				valueBox.connect(valueBox, 'onChange', function(){
					setTimeout(function(){
						console.log('onChange', valueBox.get('value'));
						domClass.toggle(n.parentNode, 'attributeItemUsed', valueBox.get('value') != attr.value);
						attr.curValue = valueBox.get('value');
					}, 10);
				});
				valueBox.connect(valueBox, 'onInput', function(){
					setTimeout(function(){
						console.log('onInput', valueBox.get('value'));
						domClass.toggle(n.parentNode, 'attributeItemUsed', valueBox.get('value') != attr.value);
						attr.curValue = valueBox.get('value');
					}, 10);
				});
			});
		}, 500);
	}

	function showModuleDetail(mod){
		query('#moduleDescIcon').style('background', 'url("' + mod.icon + '")');
		query('#moduleDescLabel').innerHTML(mod.label);
		query('#moduleDescName').innerHTML(mod.name);
		query('#moduleDescPathDetail').innerHTML(mod.mid + '.js');
		query('#moduleDescDetail').innerHTML(mod.description);
		var deps = array.map(mod.deps, function(dep){
			return ['<span class="moduleDescDependItem">', dep, '</span>'].join('');
		});
		query('#moduleDescDependDetail').innerHTML(deps.length ? deps.join('') : 'None');
	}

	function useModule(itemNode){
		itemNode.setAttribute('title', 'click to show description, double click to remove');
		var mod = modules[itemNode.getAttribute('data-mod-idx')];
		array.forEach(mod.deps, function(dep){
			if(!query('[data-mod-name="' + dep + '"].moduleItem', 'modulesLoaded').length){
				var n = query('[data-mod-name="' + dep + '"].moduleItem', 'modulesAvailable')[0];
				if(n){
					useModule(n);
				}
			}
		});
		domConstruct.place(itemNode, 'modulesLoaded');
		var nodes = query('[data-attr-mod="' + mod.module.prototype.name + '"].attributeItem', 'attributesConfig');
		nodes.removeClass('attributeItemDisabled');
	}
	function delModule(itemNode){
		itemNode.setAttribute('title', 'click to show description, double click to use');
		var name = itemNode.getAttribute('data-mod-name');
		query('.moduleItem', 'modulesLoaded').filter(function(n){
			var mod = modules[n.getAttribute('data-mod-idx')];
			return array.indexOf(mod.deps, name) >= 0;
		}).forEach(delModule);
		domConstruct.place(itemNode, 'modulesAvailable');
		if(!query('[data-mod-name="' + name + '"].moduleItem', 'modulesLoaded').length){
			query('[data-attr-mod="' + name + '"].attributeItem', 'attributesConfig').
				addClass('attributeItemDisabled').
				removeClass('attributeItemUsed');
		}
	}

	function createStore(){
		var i;
		var items = [];
		var rowCount = 100;
		for(i = 0; i < rowCount; ++i){
			var item = lang.clone(data[i % data.length]);
			item.id = i + 1;
			item.order = i + 1;
			items.push(item);
		}
		return new Store({
			data: items
		});
	}
	function gatherColumns(){
		var cols = query('.columnBar', 'columnsContainer').map(function(columnBarNode){
			return colBar = registry.byNode(columnBarNode).getColumn();
		});
		cols.sort(function(col1, col2){
			return col1.index - col2.index;
		});
		return cols;
	}
	function gatherModules(){
		return query('.moduleItem', 'modulesLoaded').map(function(modNode){
			return modules[modNode.getAttribute('data-mod-idx')];
		});
	}
	function gatherAttributes(){
		return query('.attributeItemUsed', 'attributesConfig').map(function(attrNode){
			var label = attrNode.getAttribute('data-attr-name');
			return attrsByName[label];
		});
	}
	grid = null;
	function createGrid(){
		if(grid){
			grid.destroy();
		}
		var store = createStore();
		var columns = gatherColumns();
		var mods = gatherModules();
		var attributes = gatherAttributes();
		var cfg = {
			cacheClass: 'gridx/core/model/cache/Sync',
			store: store,
			structure: columns,
			modules: array.map(mods, function(mod){
				return mod.mid;
			})
		};
		grid = new Grid(cfg);
		grid.placeAt('gridContainer');
		grid.startup();
	}
	function updateJSCode(){
		var columns = gatherColumns();
		var mods = gatherModules();
		var attributes = gatherAttributes();
		var i, j = 0, sb = [
			'require([\n',
				'\t"gridx/Grid",\n',
				'\t"gridx/core/model/cache/Sync",\n'
		];
		[].push.apply(sb, array.map(mods, function(mod){
			return ['\t"', mod.mid, '",\n'].join('');
		}));
		sb.push('\t"dojo/store/Memory",\n',
				'\t"dojo/domReady!"\n',
			'], function(Grid, Cache, \n');
		array.forEach(mods, function(mod){
			++j;
			if(j % 3 == 1){
				sb.push('\t');
			}
			sb.push(mod.name, ', ');
			if(j % 3 === 0){
				sb.push('\n');
			}
		});
		sb.push('Store){\n',
				'\n',
				'\t//Create store here...\n',
				'\t//var store = new Store(...);\n',
				'\n',
				'\tvar grid = new Grid({\n',
					'\t\tstore: store,\n',
					'\t\tcacheClass: Cache,\n',
					'\t\tstructure: [\n');
		[].push.apply(sb, array.map(columns, function(col, i, cols){
			return [
				'\t\t\t{ id: "', col.id,
				'", field: "', col.field,
				'", name: "', col.name,
				col.width == 'auto' ? '"' : '", width: "' + col.width + '"',
			' }', i == cols.length - 1 ? '' : ',', '\n'].join('');
		}));
		sb.push('\t\t],\n');
		[].push.apply(sb, array.map(attributes, function(attr){
			return ['\t\t', attr.label, ': ', attr.curValue, ',\n'].join('');
		}));
		sb.push('\t\tmodules: [\n');
		[].push.apply(sb, array.map(mods, function(mod){
			return ['\t\t\t', mod.name, ',\n'].join('');
		}));
		sb.push('\t\t]\n',
				'\t});\n',
				'\n',
				'\tgrid.placeAt("gridContainer");\n',
				'\tgrid.startup();\n',
			'});');
		dom.byId('jscode').innerHTML = sb.join('');
	}

	addColumnBar();
	addColumnBar();
	addColumnBar();
	loadModules();
	loadAttributes();

	columnsSummary();
	modulesSummary();
	attributesSummary();


	createGrid();
});
