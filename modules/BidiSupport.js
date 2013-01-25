define([
	"../core/_Module",
	"dojo/_base/declare",
	"dijit/_BidiSupport"
], function(_Module, declare, _BidiSupport){

/*=====
	var Bidi = declare(_Module, {
		// module:
		//		gridx/modules/_BidiSupport
		// summary:
		//		Module that deals with BIDI, special with the auto
		//		direction if needed without changing the GUI direction.
		// description:
		//		There's a special need for displaying BIDI text in rtl direction
		//		in ltr GUI, sometimes needed auto support.
		//		In creation of widget, if it's want to activate this class,
		//		the widget should define the "textDir".
		//		See for reference:	http://w3-03.ibm.com/globalization/page/publish/4353

		getTextDir: function(colId, text){
		},

		getTextDirStyle: function(colId, text){
			// summary:
			//		Returns input text direction related attributes.
			// textDir:
			//		Cell text direction
			// data:
			//		Cell text content
		},

		enforceTextDirWithUcc: function(colId, text){
			// summary:
			//		Wraps by UCC (Unicode control characters) option's text according to textDir
			// textDir:
			//		The control text direction
			// text:
			//		The text to be wrapped.
		}
	});

	Bidi.__ColumnDefinition = declare([], {
		textDir: ''
	});

	return Bidi;
=====*/
		
	function checkContextual(textDir, text){
		return textDir = (textDir === "auto") ? _BidiSupport.prototype._checkContextual(text) : textDir;
	}

	var LRE = '\u202A',
		RLE = '\u202B',
		PDF = '\u202C';

	return declare(_Module, {
		name: 'bidi',

		getAPIPath: function(){
			return {
				bidi: this,
				_setTextDirAttr: function(textDir){
					// summary:
					//		 Seamlessly changes grid 'textDir' property on the fly.
					// textDir:
					//		Grid text direction
					if(this.textDir != textDir){
						this.textDir = textDir;
						this.header.refresh();
						if(this.edit){
							this.edit._initAlwaysEdit();
						}
						this.body.refresh();
					}
				}
			};
		},

		getTextDir: function(colId, text){
			var g = this.grid,
				col = g._columnsById[colId];
			return checkContextual(col.textDir || g.textDir, text);
		},

		getTextDirStyle: function(colId, text){
			var textDir = this.getTextDir(colId, text);
			return textDir ? " direction:" + textDir + ";" : "";
		},

		enforceTextDirWithUcc: function(colId, text){
			var textDir = this.getTextDir(colId, text);
			return textDir ? (textDir === "rtl" ? RLE : LRE) + text + PDF : text;
		}
	});
});
