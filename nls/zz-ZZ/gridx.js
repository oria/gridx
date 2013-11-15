define(
({
//Body
	loadingInfo: "[G'Ｌｏａding...İı｜]",
	emptyInfo: "[G'Ｎｏ ｉｔｅｍｓ ｔo displayİı｜]",
	loadFailInfo: "[G'Ｆａｉｌｅｄ ｔｏ ｌoad data!İı｜]",
	loadMore: "[G'Ｌｏad Moreİı｜]",
	loadMoreLoading: "[G'Ｌｏａding...İı｜]",
	loadPrevious: "[G'Ｌｏａｄ Ｐreviousİı｜]",
	loadPreviousLoading: "[G'Ｌｏａding...İı｜]",
	indirectSelectAll: "[G'Ｐｒｅｓｓ ＳＰＡＣＥ ｔo select all.İı｜]",
	indirectDeselectAll: "[G'Ｐｒｅｓｓ ＳＰＡＣＥ ｔo deselect all.İı｜]",
	treeExpanded: "[G'Ｃｏｎｔｒｏｌ + ｌｅｆｔ ａｒrow key to collapse this row.İı｜]",
	treeCollapsed: "[G'Ｃｏｎｔｒｏｌ + ｒｉｇｈｔ ａrrow key to expand this row.İı｜]",

//FilterBar
	"clearFilterDialogTitle": "[G'Ｃｌｅａr Filterİı｜]",
	"filterDefDialogTitle": "[G'Filterİı｜]",
	"defaultRuleTitle": "[G'Ruleİı｜]",
	"ruleTitleTemplate": "[G'Rule [${ruleNumber}]İı｜]",
	"noFilterApplied": "[G'Ｎｏ ｆｉｌｔｅｒ applied.İı｜]",
	"defineFilter": "[G'Ｄｅｆｉｎe filterİı｜]",
	
	"conditionEqual": "[G'equalİı｜]",
	"conditionNotEqual": "[G'ｄｏｅｓ ｎｏt equalİı｜]",
	"conditionLess": "[G'ｉｓ ｌｅss thanİı｜]",
	"conditionLessEqual": "[G'ｌｅｓｓ ｔｈａｎ or equalİı｜]",
	"conditionGreater": "[G'ｉｓ ｇｒｅａter thanİı｜]",
	"conditionGreaterEqual": "[G'ｇｒｅａｔｅｒ ｔｈan or equalİı｜]",
	"conditionContain": "[G'ｃontainsİı｜]",
	"conditionIs": "[G'isİı｜]",
	"conditionStartWith": "[G'ｓｔａｒts withİı｜]",
	"conditionEndWith": "[G'ｅｎds withİı｜]",
	"conditionNotContain": "[G'ｄｏｅｓ ｎｏｔ containİı｜]",
	"conditionIsNot": "[G'is notİı｜]",
	"conditionNotStartWith": "[G'ｄｏｅｓ ｎｏｔ ｓtart withİı｜]",
	"conditionNotEndWith": "[G'ｄｏｅｓ ｎｏｔ end withİı｜]",
	"conditionBefore": "[G'beforeİı｜]",
	"conditionAfter": "[G'afterİı｜]",
	"conditionRange": "[G'rangeİı｜]",
	"conditionIsEmpty": "[G'ｉs emptyİı｜]",
	
	"all": "[G'allİı｜]",
	"any": "[G'anyİı｜]",
	"relationAll": "[G'ａｌl rulesİı｜]",
	"waiRelAll": "[G'Ｍａｔｃｈ ａｌｌ ｏｆ ｔｈe following rules:İı｜]",
	"relationAny": "[G'ａny ruleİı｜]",
	"waiRelAny": "[G'Ｍａｔｃｈ ａｎｙ ｏｆ ｔｈe following rules:İı｜]",
	"relationMsgFront": "[G'Matchİı｜]",
	"relationMsgTail": "",
	"and": "[G'andİı｜]",
	"or": "[G'orİı｜]",
	
	"addRuleButton": "[G'Ａdd Ruleİı｜]",
	"waiAddRuleButton": "[G'Ａｄｄ ａ ｎｅw ruleİı｜]",
	"removeRuleButton": "[G'Ｒｅｍｏve Ruleİı｜]",
	"waiRemoveRuleButtonTemplate": "[G'Ｒｅｍｏｖe rule [${0}]İı｜]",
	
	"addRuleButton": "[G'Ａｄｄ Ｆｉｌter Ruleİı｜]",
	"cancelButton": "[G'Cancelİı｜]",
	"waiCancelButton": "[G'Ｃａｎｃｅｌ ｔｈis dialogİı｜]",
	"clearButton": "[G'Clearİı｜]",
	"waiClearButton": "[G'Ｃｌｅａｒ ｔｈe filterİı｜]",
	"filterButton": "[G'Filterİı｜]",
	"waiFilterButton": "[G'Ｓｕｂｍｉｔ ｔhe filterİı｜]",
	
	"columnSelectLabel": "[G'Column:İı｜]",
	"waiColumnSelectTemplate": "[G'Ｃｏｌｕｍｎ ｆor rule [${0}]İı｜]",
	"conditionSelectLabel": "[G'Ｃｏｎdition:İı｜]",
	"waiConditionSelectTemplate": "[G'Ｃｏｎｄｉｔｉｏｎ for rule [${0}]İı｜]",
	"valueBoxLabel": "[G'Value:İı｜]",
	"waiValueBoxTemplate": "[G'Ｅｎｔｅｒ ｖａｌｕｅ ｔo filter for rule [${0}]İı｜]",
	
	"rangeTo": "[G'toİı｜]",
	"rangeTemplate": "[G'ｆｒｏｍ [${0}] to [${1}]İı｜]",
	
	"statusTipHeaderColumn": "[G'Columnİı｜]",
	"statusTipHeaderCondition": "[G'Rulesİı｜]",
	"statusTipTitle": "[G'Ｆｉｌter Barİı｜]",
	"statusTipMsg": "[G'Ｃｌｉｃｋ ｔｈｅ ｆｉｌｔｅr bar here to filter on values in [${0}].İı｜]",
	"anycolumn": "[G'ａｎｙ columnİı｜]",
	"statusTipTitleNoFilter": "[G'Ｆｉｌter Barİı｜]",
	"statusTipTitleHasFilter": "[G'Filterİı｜]",
	"statusTipRelPre": "[G'Matchİı｜]",
	"statusTipRelPost": "[G'rules.İı｜]",
	"statusTipHeaderAll": "[G'Ｍａｔｃｈ ａｌl rules.İı｜]",
	"statusTipHeaderAny": "[G'Ｍａｔｃｈ ａｎy rules.İı｜]",
	
	"defaultItemsName": "[G'itemsİı｜]",
	"filterBarMsgHasFilterTemplate": "[G'[${0}] ｏｆ [${1}] [${2}] ｓｈｏｗn.İı｜]",
	"filterBarMsgNoFilterTemplate": "[G'Ｎｏ ｆｉｌｔｅr appliedİı｜]",
	
	"filterBarDefButton": "[G'Ｄｅｆｉｎe filterİı｜]",
	"waiFilterBarDefButton": "[G'Ｆｉｌｔｅｒ ｔhe tableİı｜]",
	"a11yFilterBarDefButton": "[G'Ｆｉlter...İı｜]",
	"filterBarClearButton": "[G'Ｃｌｅａr filterİı｜]",
	"waiFilterBarClearButton": "[G'Ｃｌｅａｒ ｔｈe filterİı｜]",
	"closeFilterBarBtn": "[G'Ｃｌｏｓｅ ｆｉlter barİı｜]",
	
	"clearFilterMsg": "[G'Ｔｈｉｓ ｗｉｌｌ ｒｅｍｏｖｅ the filter and show all available records.İı｜]",
	"anyColumnOption": "[G'Ａｎｙ Columnİı｜]",
	
	"trueLabel": "[G'Trueİı｜]",
	"falseLabel": "[G'Falseİı｜]",
	"radioTrueLabel": "[G'Ｖａｌue Trueİı｜]",
	"radioFalseLabel": "[G'Ｖａｌｕe Falseİı｜]",
	"beginTimeRangeLabel": "[G'Ｔｉｍｅ Ｒａｎｇｅ Ｖalue Startİı｜]",
	"endTimeRangeLabel": "[G'Ｔｉｍｅ Ｒａｎｇｅ Value Endİı｜]",
	"beginDateRangeLabel": "[G'Ｄａｔｅ Ｒａｎｇｅ Ｖalue Startİı｜]",
	"endDateRangeLabel": "[G'Ｄａｔｅ Ｒａｎｇｅ Value Endİı｜]",
	"startsWithExpr": "[G'[${0}]*İı｜]",

//NestedSort
	singleSort: "[G'Ｓｉｎｇle Sortİı｜]",
	nestedSort: "[G'Ｎｅｓｔed Sortİı｜]",
	ascending: "[G'Ｃｌｉｃｋ ｔｏ ｓｏｒt Ascendingİı｜]",
	descending: "[G'Ｃｌｉｃｋ ｔｏ ｓｏｒt Descendingİı｜]",
	sortingState: "[G'[${0}] - [${1}]İı｜]",
	unsorted: "[G'Ｄｏ ｎｏｔ ｓｏｒｔ ｔhis columnİı｜]",
	
	waiSingleSortLabel: "[G'[${0}] - ｉｓ ｓｏｒｔｅｄ ｂｙ [${1}]. Ｃｈｏose to sort by [${2}]İı｜]",
	waiNestedSortLabel:"[G'[${0}] - ｉｓ ｎｅｓｔｅｄ ｓｏｒｔｅｄ by [${1}]. Choose to nested sort by [${2}]İı｜]",

//PaginationBar
	pagerWai: '[G\'Pagerİı｜]',

	pageIndex: '[G\'[${0}]İı｜]',
	pageIndexTitle: '[G\'Page [${0}]İı｜]',

	firstPageTitle: '[G\'Ｆｉｒst pageİı｜]',
	prevPageTitle: '[G\'Ｐｒｅｖｉous pageİı｜]',
	nextPageTitle: '[G\'Ｎｅxt pageİı｜]',
	lastPageTitle: '[G\'Ｌａst pageİı｜]',

	pageSize: '[G\'[${0}]İı｜]',
	pageSizeTitle: '[G\'[${0}] ｉｔｅｍｓ ｐｅr pageİı｜]',
	pageSizeAll: '[G\'Allİı｜]',
	pageSizeAllTitle: '[G\'Ａｌl itemsİı｜]',

	description: '[G\'[${0}] - [${1}] ｏｆ [${2}] ｉｔｅｍｓ.İı｜]',
	descriptionEmpty: '[G\'Ｇｒｉｄ ｉｓ empty.İı｜]',

	summary: '[G\'Ｔotal: [${0}]İı｜]',
	summaryWithSelection: '[G\'Ｔｏｔａｌ: [${0}] Ｓｅｌｅcted: [${1}]İı｜]',

	gotoBtnTitle: '[G\'Ｇｏ ｔｏ ａ ｓｐｅｃific pageİı｜]',

	gotoDialogTitle: '[G\'Ｇｏ ｔo Pageİı｜]',
	gotoDialogMainMsg: '[G\'Ｓｐｅｃｉｆｙ ｔｈｅ page number:İı｜]',
	gotoDialogPageCount: '[G\'([${0}] ｐａges)İı｜]',
	gotoDialogOKBtn: '[G\'Goİı｜]',
	gotoDialogCancelBtn: '[G\'Cancelİı｜]',
	
	// for drop down pagination bar
	pageLabel: '[G\'Pageİı｜]',
	pageSizeLabel: '[G\'Rowsİı｜]',

//QuickFilter
	filterLabel: '[G\'Filterİı｜]',
	clearButtonTitle: '[G\'Ｃｌｅａr Filterİı｜]',
	buildFilterMenuLabel: '[G\'Ｂｕｉｌｄ Filter&hellip;İı｜]',
	apply: '[G\'Ａｐｐｌy Filterİı｜]',

//SummaryBar
	summary: '[G\'Ｔotal: [${0}]İı｜]',
	summaryWithSelection: '[G\'Ｔｏｔａｌ: [${0}] Ｓｅｌｅcted: [${1}]İı｜]',

//Sort [NEED TRANSLATION]
	helpMsg: '[G\'[${0}] - Ｃｌｉｃｋ ｔｏ ｓｏｒｔ ｏｒ control-click to add to sortİı｜]',
	singleHelpMsg: '[G\'[${0}] - Ｃｌｉｃｋ ｔｏ sortİı｜]',
	priorityOrder: '[G\'ｓｏｒｔ ｐｒiority [${0}]İı｜]'
})
);
