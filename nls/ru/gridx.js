define({     
//Body
	loadingInfo: "Загрузка...",
	emptyInfo: "Нет ни одного элемента",
	loadFailInfo: "Не удалось загрузить данные!",
	loadMore: "Загрузить еще",
	loadMoreLoading: "Загрузка...",
	loadPrevious: "Загрузить предыдущие",
	loadPreviousLoading: "Загрузка...",

//FilterBar
	"clearFilterDialogTitle": "Очистить фильтр",
	"filterDefDialogTitle": "Фильтр",
	"defaultRuleTitle": "Правило",
	"ruleTitleTemplate": "Правило ${ruleNumber}",
	"noFilterApplied": "Фильтры не используются.",
	"defineFilter": "Определить фильтр",
	"conditionEqual": "равно",
	"conditionNotEqual": "не равно",
	"conditionLess": "меньше чем",
	"conditionLessEqual": "не меньше чем",
	"conditionGreater": "больше чем",
	"conditionGreaterEqual": "не больше чем",
	"conditionContain": "содержит",
	"conditionIs": "-",
	"conditionStartWith": "начинается с",
	"conditionEndWith": "заканчивается",
	"conditionNotContain": "не содержит",
	"conditionIsNot": "не соответствует",
	"conditionNotStartWith": "не начинается с",
	"conditionNotEndWith": "не заканчивается",
	"conditionBefore": "до",
	"conditionAfter": "после",
	"conditionRange": "диапазон",
	"conditionIsEmpty": "пуст",
	"all": "все",
	"any": "любое",
	"relationAll": "все правила",
	"waiRelAll": "Соответствует всем следующим правилам:",
	"relationAny": "любое правило",
	"waiRelAny": "Соответствует любому из следующих правил:",
	"relationMsgFront": "Соответствует",
	"relationMsgTail": "",
	"and": "и",
	"or": "или",
	"addRuleButton": "Добавить правило",
	"waiAddRuleButton": "Добавить новое правило",
	"removeRuleButton": "Удалить правило",
	"waiRemoveRuleButtonTemplate": "Удалить правило ${0}",
	"addRuleButton": "Добавить правило фильтрации",
	"cancelButton": "Отмена",
	"waiCancelButton": "Отменить этот диалог",
	"clearButton": "Очистить",
	"waiClearButton": "Очистить фильтр",
	"filterButton": "Фильтр",
	"waiFilterButton": "Применить фильтр",
	"columnSelectLabel": "Столбец:",
	"waiColumnSelectTemplate": "Столбец правила ${0}",
	"conditionSelectLabel": "Условие:",
	"waiConditionSelectTemplate": "Условие правила ${0}",
	"valueBoxLabel": "Значение:",
	"waiValueBoxTemplate": "Введите значение в фильтр правила ${0}",
	"rangeTo": "до",
	"rangeTemplate": "от ${0} до ${1}",
	"statusTipHeaderColumn": "Столбец",
	"statusTipHeaderCondition": "Правила",
	"statusTipTitle": "Панель фильтров",
	"statusTipMsg": "Нажмите на панель фильтров для фильтрации по значениям в ${0}.",
	"anycolumn": "любой столбец",
	"statusTipTitleNoFilter": "Панель фильтров",
	"statusTipTitleHasFilter": "Фильтр",
	"statusTipRelPre": "Соответствует",
	"statusTipRelPost": "правила.",
	"statusTipHeaderAll": "Соответствие всем правилам.",
	"statusTipHeaderAny": "Соответствие любому из правил.",
	"defaultItemsName": "элементов",
	"filterBarMsgHasFilterTemplate": "Показано ${0} из ${1} ${2}.",
	"filterBarMsgNoFilterTemplate": "Фильтры не используются",
	"filterBarDefButton": "Определить фильтр",
	"waiFilterBarDefButton": "Фильтровать таблицу",
	"a11yFilterBarDefButton": "Фильтровать...",
	"filterBarClearButton": "Очистить фильтр",
	"waiFilterBarClearButton": "Очистить фильтр",
	"closeFilterBarBtn": "Закрыть панель фильтров",
	"clearFilterMsg": "Эта опция удалит фильтр и будут показаны все доступные записи.",
	"anyColumnOption": "Любой столбец",
	"trueLabel": "Истина",
	"falseLabel": "Ложь",
	"radioTrueLabel": "Значение Истина",
	"radioFalseLabel": "Значение Ложь",
	"beginTimeRangeLabel": "Начало интервала времени",
	"endTimeRangeLabel": "Конец интервала времени",
	"beginDateRangeLabel": "Начало интервала дат",
	"endDateRangeLabel": "Конец интервала дат",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Одноуровневая сортировка",
	nestedSort: "Вложенная сортировка",
	ascending: "Сортировка по возрастанию",
	descending: "Сортировка по убыванию",
	sortingState: "${0} - ${1}",
	unsorted: "Не сортировать этот столбец",
	waiSingleSortLabel: "${0} - сортировка по ${1}. Выберите для сортировки по ${2}",
	waiNestedSortLabel:"${0} - вложенная сортировка по ${1}. Выберите для вложенной сортировки по ${2}",

//PaginationBar
	pagerWai: 'Пейджер',

	pageIndex: '${0}',
	pageIndexTitle: 'Страница ${0}',

	firstPageTitle: 'Первая страница',
	prevPageTitle: 'Предыдущая страница',
	nextPageTitle: 'Следующая страница',
	lastPageTitle: 'Последняя страница',

	pageSize: '${0}',
	pageSizeTitle: '${0} элементов на странице',
	pageSizeAll: 'Все',
	pageSizeAllTitle: 'Все элементы',

	description: '${0} - ${1} из ${2} items.',
	descriptionEmpty: 'Матрица пуста.',

	summary: 'Всего: ${0}',
	summaryWithSelection: 'Всего: ${0} Выбрано: ${1}',

	gotoBtnTitle: 'Перейти на указанную страницу',

	gotoDialogTitle: 'Перейти на страницу',
	gotoDialogMainMsg: 'Укажите номер страницы:',
	gotoDialogPageCount: '(${0} страниц)',
	gotoDialogOKBtn: 'Перейти',
	gotoDialogCancelBtn: 'Отмена',
	// for drop down pagination bar
	pageLabel: 'Страница',
	pageSizeLabel: 'Строки',

//QuickFilter
	filterLabel: 'Фильтр',
	clearButtonTitle: 'Очистить фильтр',
	buildFilterMenuLabel: 'Составить фильтр&hellip;',
	apply: 'Применить фильтр',

//Sort
	helpMsg: '${0} - Щелкните для сортировки или щелкните, удерживая клавишу Ctrl, для добавления в список сортировки',
	singleHelpMsg: '${0} - Щелкните для сортировки',
	priorityOrder: 'сортировать ${0} по приоритетам ',

//SummaryBar
	summaryTotal: 'Всего: ${0}',
	summarySelected: 'Выбрано: ${0}',
	summaryRange: 'Диапазон: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "Нажмите клавишу Пробел для выбора всех элементов.",	//need translation
	indirectDeselectAll: "Нажмите клавишу Пробел для отмены выбора всех элементов.",	//need translation
	treeExpanded: "Нажмите Control + стрелка влево, чтобы свернуть эту строку.",	//need translation
	treeCollapsed: "Нажмите Control + стрелка вправо, чтобы развернуть эту строку."	//need translation
});

