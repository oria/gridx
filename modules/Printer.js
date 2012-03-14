define([
	"../core/_Module",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/_base/xhr",
	"dojo/_base/array",
	"dojo/_base/sniff",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/DeferredList"
], function(_Module, declare, lang, Deferred, xhr, array, sniff, dom, domConstruct, domStyle, DeferredList){

	function loadCSSFiles(cssFiles){
		var dl = array.map(cssFiles, function(cssFile){
			cssFile = lang.trim(cssFile);
			if(cssFile.substring(cssFile.length - 4).toLowerCase() === '.css'){
				return xhr.get({
					url: cssFile
				});
			}else{
				var d = new Deferred();
				d.callback(cssFile);
				return d;
			}
		});
		return DeferredList.prototype.gatherResults(dl);
	}
	
	return _Module.register(
	declare(_Module, {
		name: 'printer',

		forced: ['table'],
		
		constructor: function(grid, args){
			var t = this;
			args = lang.isObject(args) ? args : {};
			t._title = args.title ? args.title : "";
			if(args.cssFiles){
				if(lang.isString(args.cssFiles)){
					t._cssFiles = [args.cssFiles];
				}else if(lang.isArray(args.cssFiles)){
					t._cssFiles = args.cssFiles;
				}else{
					t._cssFiles = null;
				}
			}
		},
		
		getAPIPath: function(){
			return {
				'printer': this
			};
		},
	
		print: function(exportArgs){
			//	summary:
			//		Print all rows of the grid.
			//	exportArgs: Object
			//		Please refer to `grid.exporter.__ExportArgs`
			var t = this;
			t.grid.exporter.toTable(exportArgs).then(function(str){
				t._wrapHTML(t._title, t._cssFiles, str).then(function(result){
					t._print(result);
				});
			});
		},
		
		//[private]
		//
		_wrapHTML: function(/* string */title, /* Array */cssFiles, /* string */bodyContent){
			// summary:
			//		Put title, cssFiles, and bodyContent together into an HTML string.
			// tags:
			//		private
			// title: String
			//		A title for the html page.
			// cssFiles: Array
			//		css file pathes.
			// bodyContent: String
			//		Content to print, not including <head></head> part and <html> tags
			// returns:
			//		the wrapped HTML string ready for print
			var ltr = this.grid.isLeftToRight();
			return loadCSSFiles(cssFiles).then(function(cssStrs){
				var i, sb = ['<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">',
						'<html ', ltr ? '' : 'dir="rtl"', '><head><title>', title,
						'</title><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></meta>'];
				for(i = 0; i < cssStrs.length; ++i){
					sb.push('<style type="text/css">', cssStrs[i], '</style>');
				}
				sb.push('</head>');
				if(bodyContent.search(/^\s*<body/i) < 0){
					bodyContent = '<body>' + bodyContent + '</body>';
				}
				sb.push(bodyContent, '</html>');
				return sb.join('');
			});
		},

		_print: function(/* string */htmlStr){
			// summary:
			//		Do the print job.
			// tags:
			//		private
			// htmlStr: String
			//		The html content string to be printed.
			// returns:
			//		undefined
			var win, t = this,
				fillDoc = function(w){
					var doc = w.document;
					doc.open();
					doc.write(htmlStr);
					doc.close();
				};
			if(!window.print){
				//We don't have a print facility.
				return;
			}else if(sniff('chrome') || sniff('opera')){
				//referred from dijit._editor.plugins.Print._print()
				//In opera and chrome the iframe.contentWindow.print
				//will also print the outside window. So we must create a
				//stand-alone new window.
				win = window.open("javascript: ''", "",
					"status=0,menubar=0,location=0,toolbar=0,width=1,height=1,resizable=0,scrollbars=0");
				fillDoc(win);
				win.print();
				//Opera will stop at this point, showing the popping-out window.
				//If the user closes the window, the following codes will not execute.
				//If the user returns focus to the main window, the print function
				// is executed, but still a no-op.
				win.close();
			}else{
				//Put private things in deeper namespace to avoid poluting grid namespace.
				var fn = t._printFrame,
					dn = t.grid.domNode;
				if(!fn){
					var frameId = dn.id + "_print_frame";
					if(!(fn = dom.byId(frameId))){
						//create an iframe to store the grid data.
						fn = domConstruct.create("iframe");
						fn.id = frameId;
						fn.frameBorder = 0;
						domStyle.set(fn, {
							width: "1px",
							height: "1px",
							position: "absolute",
							right: 0,
							bottom: 0,
							border: "none",
							overflow: "hidden"
						});
						if(!sniff('ie')){
							domStyle.set(fn, "visibility", "hidden");
						}
						dn.appendChild(fn);
					}
					//Reuse this iframe
					t._printFrame = fn;
				}
				win = fn.contentWindow;
				fillDoc(win);
				//IE requires the frame to be focused for print to work, and it's harmless for FF.
				win.focus();
				win.print();
			}
		}
	}));
});
