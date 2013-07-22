profile = {
	stripConsole: "normal"
	,layerOptimize: 'closure'
	,optimize: 'closure'
	,releaseDir: '../build'
	,packages: [
		{
			name: 'dojo'
			,location: '../src/dojo'
		},{
			name: 'dijit'
			,location: '../src/dijit' 	//always relative to profile path
		},{
			name: 'dojox'
			,location: '../src/dojox' 	//always relative to profile path
		},{
			name: 'gridx'
			,location: '../src/gridx'
		}
	]
	,layers: {
		'gridx/tests/allInOne': {
			include: [
				'dojo/parser'
				,'dojo/_base/declare'
				,'gridx/tests/support/data/MusicData'
				,'gridx/tests/support/stores/Memory'
				,'dojo/store/Memory'
				,'dojo/date/locale'
				,'dijit/_Widget'
				,'dijit/_TemplatedMixin'
				,'dijit/_WidgetsInTemplateMixin'
				,'dijit/form/TextBox'
				,'dijit/form/ComboBox'
				,'dijit/form/DateTextBox'
				,'dijit/form/TimeTextBox'
				,'dijit/form/NumberTextBox'
				,'dijit/form/FilteringSelect'
				,'dijit/form/Select'
				,'dijit/form/HorizontalSlider'
				,'dijit/form/NumberSpinner'
				,'dijit/form/CheckBox'
				,'dijit/form/ToggleButton'
				,'dijit/Calendar'
				,'dijit/ColorPalette'
				,'gridx/Grid'
				,'gridx/core/model/cache/Sync'
				,'gridx/allModules'
			]
		}
	}
}