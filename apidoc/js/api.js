require([
	"dojo/_base/array",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/_base/fx",
	"dojo/_base/lang",
	"dojo/on",
	"dojo/parser",
	"dojo/query",
	"dojo/ready",
	"dojo/topic",
	"dojo/string",
	"dijit/registry",
	"dijit/Dialog",
	"dojox/fx/_core",
	"api/ModuleTreeModel",
	"api/ModuleTree",
	"dojo/hash",
	"dojo/aspect",

	// Modules used by the parser
	"dijit/layout/BorderContainer",
	"dijit/layout/TabContainer",
	"dijit/layout/ContentPane",
	"dijit/layout/AccordionContainer"
], function(array, dom, domClass, domConstruct, domStyle, fx, lang, on, parser, query, ready, topic, string,
			registry, Dialog, Line, ModuleTreeModel, ModuleTree, hash, aspect, BorderContainer, TabContainer){

// This file contains the top level javascript code to setup the tree, etc.

page = page || "";

function smoothScroll(args){
	//	NB: this is basically dojox.fx.smoothScroll

	var node = args.node,
		win = args.win;

	// Run animation to bring the node to the top of the pane (if possible).   Is that what we want?
	// Or should it move to the center?   Or scroll the minimal amount possible to bring the
	// node into view?
	return new fx.Animation(lang.mixin({
		beforeBegin: function(){
			if(this.curve){ delete this.curve; }
			var current = { x: win.scrollLeft, y: win.scrollTop };

			var target;
			if(node.offsetTop >= win.scrollTop && node.offsetTop + node.clientHeight <= win.scrollTop + win.clientHeight){
				// If node is already in view, don't do any scrolling.   Particularly important when clicking a
				// TreeNode selects (or opens) a tab, which then triggers code for the TreeNode to scroll into view.
				target = [current.x, current.y];
			}else{
				// Otherwise, scroll to near top of containing div
				target = [node.offsetLeft, Math.max(node.offsetTop - 30, 0)];
			}

			this.curve = new Line([ current.x, current.y ], target);
		},
		onAnimate: function(val){
			win.scrollLeft = val[0];
			win.scrollTop = val[1];
		}
	}, args));
}

// Monkey-patch TabContainer so closing a pane selects the adjacent one, rather than the first one.
// Remove this for 1.9 since it's fixed in #9776
TabContainer.prototype.removeChild = function(/*dijit/_WidgetBase*/ page){
	// Overrides StackContainer.removeChild() so closing the selected tab selects the adjacent tab,
	// rather than the first one

	// new line
	var idx = array.indexOf(this.getChildren(), page);

	// this.inherited(arguments) doesn't work, is there a better way to override TabContainer.removeChild() so it does?
	require("dijit/_Container").prototype.removeChild.apply(this, arguments);

	if(this._started){
		// this will notify any tablists to remove a button; do this first because it may affect sizing
		topic.publish(this.id + "-removeChild", page);	// publish
	}

	// If all our children are being destroyed than don't run the code below (to select another page),
	// because we are deleting every page one by one
	if(this._descendantsBeingDestroyed){ return; }

	// Select new page to display, also updating TabController to show the respective tab.
	// Do this before layout call because it can affect the height of the TabController.
	if(this.selectedChildWidget === page){
		this.selectedChildWidget = undefined;
		if(this._started){
			var children = this.getChildren();
			if(children.length){
				this.selectChild(children[Math.max(idx-1, 0)]);	// changed line
			}
		}
	}

	if(this._started){
		// In case the tab titles now take up one line instead of two lines
		// (note though that ScrollingTabController never overflows to multiple lines),
		// or the height has changed slightly because of addition/removal of tab which close icon
		this.layout();
	}
};

paneOnLoad = function(data){
	var context = this.domNode;

	// After the page has loaded, scroll to specified anchor in the page
	var anchor = this.href.replace(/.*#/, "");
	if(anchor){
		var target = query('a[name="' + anchor + '"]', context)[0];
		if(target){
			setTimeout(function(){
				target.scrollIntoView();
			}, 100);
		}
	}

	// Setup listener so when you click on links to other modules, it opens a new tab rather than refreshing the
	// whole page
	on(context, on.selector("a.jsdoc-link", "click"), function(evt){
		// Don't do this code for the permalink button, that's handled in a different place
		if(domClass.contains(this.parentNode, "jsdoc-permalink")){
			return;
		}

		// Stop the browser from navigating to a new page
		evt.preventDefault();

		// Open tab for specified module
		var tmp = this.href.replace(/#.*/, "").replace(/\.html$/, '').split("/");
		var version = tmp[tmp.length - 3];
		var page = tmp[tmp.length - 1].replace(/-/g, '/');
		var pane = addTabPane(page, version);

		// After the page has loaded, scroll to specified anchor in the page
		var anchor = this.href.replace(/.*#/, "");
		if(anchor){
			pane.onLoadDeferred.then(function(){
				var target = query('a[name="' + anchor + '"]', context);
				if(target[0]){
					var anim = smoothScroll({
						node: target[0],
						win: context,
						duration: 600
					}).play();
				}
			});
		}
	});

	// This is for navigating from "method summary" area and scrolling down to the method details.
	on(context, on.selector("a.inline-link", "click"), function(evt){
		evt.preventDefault();
		var target = query('a[name="' + this.href.substr(this.href.indexOf('#')+1) + '"]', context);
		if(target[0]){
			var anim = smoothScroll({
				node: target[0],
				win: context,
				duration: 600
			}).play();
		}
	});


	function adjustLists(){
		// summary:
		//		Hide/show privates and inherited methods according to setting of private and inherited toggle buttons.
		//		Set/remove "odd" class on alternating rows.

		// The alternate approach is to do this through CSS: Toggle a jsdoc-hide-privates and jsdoc-hide-inherited
		// class on the pane's DOMNode, and use :nth-child(odd) to get the gray/white shading of table rows.   The
		// only problem (besides not working on IE6-8) is that the row shading won't account for hidden rows, so you
		// might get contiguous white rows or contiguous gray rows.

		// number of visible rows so far
		var cnt = 1;

		query(".jsdoc-property-list > *", context).forEach(function(li){
			var hide =
				(!extensionOn && domClass.contains(li, "extension-module")) ||
				(!privateOn && domClass.contains(li, "private")) ||
				(!inheritedOn && domClass.contains(li, "inherited"));
			domStyle.set(li, "display", hide ? "none" : "");
			domClass.toggle(li, "odd", cnt%2);
			if(!hide){
				cnt++;
			}
		});
	}

	//	build the toolbar.
	// Don't add permalink since we don't have a server.
	var link = ''; //query("div.jsdoc-permalink", context)[0].innerHTML;

	var tbc = (link ? '<span class="jsdoc-permalink"><a class="jsdoc-link" href="' + link + '">Permalink</a></span>' : '')
		+ '<label>View options: </label>'
		+ '<span class="trans-icon jsdoc-extension"><img src="css/icons/24x24/extension.png" align="middle" border="0" alt="Toggle extension module members" title="Toggle extension module members" /></span>'
		+ '<span class="trans-icon jsdoc-private"><img src="css/icons/24x24/private.png" align="middle" border="0" alt="Toggle private members" title="Toggle private members" /></span>'
		+ '<span class="trans-icon jsdoc-inherited"><img src="css/icons/24x24/inherited.png" align="middle" border="0" alt="Toggle inherited members" title="Toggle inherited members" /></span>';
	var toolbar = domConstruct.create("div", {
		className: "jsdoc-toolbar",
		innerHTML: tbc
	}, this.domNode, "first");

	var extensionBtn = query(".jsdoc-extension", toolbar)[0];
	on(extensionBtn, "click", function(e){
		extensionOn = !extensionOn;
		domClass.toggle(extensionBtn, "off", !extensionOn);
		adjustLists();
	});

	var privateBtn = query(".jsdoc-private", toolbar)[0];
	domClass.add(privateBtn, "off");	// initially off
	on(privateBtn, "click", function(e){
		privateOn = !privateOn;
		domClass.toggle(privateBtn, "off", !privateOn);
		adjustLists();
	});

	var inheritedBtn =  query(".jsdoc-inherited", toolbar)[0];
	on(inheritedBtn, "click", function(e){
		inheritedOn = !inheritedOn;
		domClass.toggle(inheritedBtn, "off", !inheritedOn);
		adjustLists();
	});


	//	if SyntaxHighlighter is present, run it in the content
	if(SyntaxHighlighter){
		// quick hack to convert <pre><code> --> <pre class="brush: js;" lang="javascript">,
		// as expected by the SyntaxHighlighter
		var children = query("pre code", context);
		children.forEach(function(child){
			var parent = child.parentNode,
				isXML = lang.trim(child.innerText || child.textContent).charAt(0) == "<";
			domConstruct.place("<pre class='brush: " + (isXML ? "xml" : "js") + ";'>" + child.innerHTML + "</pre>",
				parent, "after");
			domConstruct.destroy(parent);
		});

		// run highlighter
		SyntaxHighlighter.highlight();
	}

	var privateOn = false, inheritedOn = true, extensionOn = true;

	//	hide the private members.
	adjustLists();

	//	make the summary sections collapsible.
	query("h2.jsdoc-summary-heading", this.domNode).forEach(function(item){
		on(item, "click", function(e){
			var d = e.target.nextSibling;
			while(d.nodeType != 1 && d.nextSibling){ d = d.nextSibling; }
			if(d){
				var dsp = domStyle.get(d, "display");
				domStyle.set(d, "display", (dsp=="none"?"":"none"));
				query("span.jsdoc-summary-toggle", e.target).forEach(function(item){
					domClass.toggle(item, "closed", dsp=="none");
				});
			}
		});

		query("span.jsdoc-summary-toggle", item).addClass("closed");

		//	probably should replace this with next or something.
		var d = item.nextSibling;
		while(d.nodeType != 1 && d.nextSibling){ d = d.nextSibling; }
		if(d){
			domStyle.set(d, "display", "none");
		}
	});

	//	set the title
	var w = registry.byId("content").selectedChildWidget;
	document.title = w.title + " - " + (siteName || "The Dojo Toolkit");

	//	set the content of the printBlock.
	dom.byId("printBlock").innerHTML = w.domNode.innerHTML;
};

addTabPane = function(page, version, anchor){
	var p = registry.byId("content");

	// Get the URL to get the tab content.
	var pageFile = page.replace(/\//g, '-');
	var url = "./data/" + version + "/docs/" + pageFile + '.html';
	if(anchor){
		url += '#' + anchor;
	}

	var title = page + " (" + version + ")";

	//	get the children and make sure we haven't opened this yet.
	var c = p.getChildren();
	for(var i=0; i<c.length; i++){
		if(c[i].title == title){
			p.selectChild(c[i]);
			return c[i];
		}
	}
	var pane = new dijit.layout.ContentPane({
		id: page.replace(/[\/.]/g, "_") + "_" + version,
		v: version,
		page: page,		// save page because when we select a tab we locate the corresponding TreeNode
		href: url,
		title: title,
		closable: true,
		parseOnLoad: false,
		onLoad: lang.hitch(pane, paneOnLoad)
	});
	
	p.addChild(pane);
	p.selectChild(pane);
	return pane;
};

// Intentional globals (accessed from welcome tab)
moduleModel = null;
moduleTree = null;

buildTree = function(){
	//	handle changing the tree versions.
	if(moduleTree){
		moduleTree.destroyRecursive();
	}

	// load welcome tab for this version
	registry.byId("baseTab").set("href", "./themes/" + currentVersion + "/index.html");
	registry.byId("baseTab").set("title", "Welcome (" + currentVersion + ")");

	//	load the module tree data.
	moduleModel = new ModuleTreeModel('./data/' + currentVersion + '/tree.json');

	moduleTree = new ModuleTree({
		id: "moduleTree",
		model: moduleModel,
		showRoot: false,
		persist: false,		// tree item ids have slashes, which confuses the persist code
		version: currentVersion
	});
	moduleTree.placeAt("moduleTreePane");

	var w = registry.byId("content");
	if(w){
		// Code to run when a pane is selected by clicking a tab label (although it also unwantedly runs when a pane is
		// selected by clicking a node in the tree)
		w.watch("selectedChildWidget", function(attr, oldVal, selectedChildWidget){
			// If we are still scrolling the Tree from a previous run, cancel that animation
			if(moduleTree.scrollAnim){
				moduleTree.scrollAnim.stop();
			}

			if(!selectedChildWidget.page){
				// This tab doesn't have a corresponding entry in the tree.   It must be the welcome tab.
				return;
			}

			// Select the TreeNode corresponding to this tab's object.   For dijit/form/Button the path must be
			// ["root", "dijit/", "dijit/form/", "dijit/form/Button"]
			var parts = selectedChildWidget.page.match(/[^/\.]+[/\.]?/g),
				path = ["root"].concat(array.map(parts, function(part, idx){
				return parts.slice(0, idx+1).join("").replace(/\.$/, "");
			}));
			moduleTree.set("path", path).then(function(){
				// And then scroll it into view.
				moduleTree.scrollAnim = smoothScroll({
					node: moduleTree.selectedNodes[0].domNode,
					win: dom.byId("moduleTreePane"),
					duration: 300
				}).play();
			},
			function(err){
				console.log("tree: error setting path to " + path);
			});
		}, true);
	}
};

versionChange = function(e){
	// summary:
	//		Change the version displayed.

	var v = this.options[this.selectedIndex].value;
	
	// var h = hash();
	// hash(v + '/' + h);
	
	if(currentVersion == v){ return; }
	
	// var p = new RegExp(/\d\.\d/);
// 
	// if(p.test(h)){
		// h = h.replace(/\d\.\d/, v);
	// }else{
		// h = v + '/' + h;
	// }
	// hash(h);
	//	if we reverted, bug out.

	currentVersion = v;

	buildTree();
};

ready(function(){
	parser.parse(document.body);
	var w = registry.byId("content");
	if(w){
		// Code to run when a pane is selected
		w.watch("selectedChildWidget", function(attr, oldVal, selectedChildWidget){
			document.title = selectedChildWidget.title + " - GridX";
		});
	}

	// When user selects a choice in the version <select>, switch to that version
	var s = dom.byId("versionSelector");
	s.onchange = lang.hitch(s, versionChange);

	buildTree();

	if(page && currentVersion) {
		var p = addTabPane(page, currentVersion);

		//	handle any URL hash marks.
		if(p && window.location.hash.length){
			var h = p.onLoadDeferred.then(function(){
				var target = query('a[name$="' + window.location.hash.substr(window.location.hash.indexOf('#')+1) + '"]', p.domNode);
				if(target[0]){
					var anim = smoothScroll({
						node: target[0],
						win: p.domNode,
						duration: 600
					}).play();
				}
			});
		}
	}
	
	var hs = hash();
	if(hs){
		var path = [];
		
		var version = hs.match(/\d+\.\d+/)[0];
		if(version){
			currentVersion = version;
			buildTree();
			
			for(var i in s.options){
				if(s.options[i].value == version){
					s.options[i].selected = 'true';
				}
			}

			hs = hs.replace(/\d+\.\d+/, '').substring(1);
		}

		var pathAry = hs.split('/');
		//remove the anchor part from path
		var pathLast = pathAry[pathAry.length - 1].split('#');
		pathAry[pathAry.length - 1] = pathLast[0];
		
		for(var i = 0, len = pathAry.length; i < len; i++){
			if(i){
				if(pathAry[i].indexOf('.') >= 0 ){
					path.push(path[i - 1] + pathAry[i].split('.')[0]);
				}
				path.push(path[i - 1] + pathAry[i] + (i == len - 1? '' : '/'));
			}else{
				path.push(pathAry[i] + '/');
			}
		}
		
		// console.log('path is', path);
		var anchor = pathLast[1];
		moduleTree.selectAndClick(path, anchor);
	}
	
	var tb = registry.byId('content');
	aspect.after(tb, 'selectChild', function(page){
		if(page.page){
			var anchor = page.href.split('#')[1];
			hash(page.v + '/' + page.page + (anchor ? '#' + anchor : ''));
		}
	}, true);
});

});
