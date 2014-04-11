define({     
//Body
	loadingInfo: "A carregar...",
	emptyInfo: "Sem artigos a apresentar",
	loadFailInfo: "Falha ao carregar dados!",
	loadMore: "Carregar Mais",
	loadMoreLoading: "A carregar...",
	loadPrevious: "Carregar Anterior",
	loadPreviousLoading: "A carregar...",

//FilterBar
	"clearFilterDialogTitle": "Limpar filtro",
	"filterDefDialogTitle": "Filtro",
	"defaultRuleTitle": "Regra",
	"ruleTitleTemplate": "Regra ${ruleNumber}",
	"noFilterApplied": "Nenhum filtro aplicado.",
	"defineFilter": "Definir filtro",
	"conditionEqual": "igual",
	"conditionNotEqual": "não é igual",
	"conditionLess": "é menor do que",
	"conditionLessEqual": "menor ou igual",
	"conditionGreater": "é maior do que",
	"conditionGreaterEqual": "maior ou igual",
	"conditionContain": "contém",
	"conditionIs": "é",
	"conditionStartWith": "começa com",
	"conditionEndWith": "termina com",
	"conditionNotContain": "não contém",
	"conditionIsNot": "não é",
	"conditionNotStartWith": "não começa com",
	"conditionNotEndWith": "não termina com",
	"conditionBefore": "antes",
	"conditionAfter": "após",
	"conditionRange": "intervalo",
	"conditionIsEmpty": "está vazio",
	"all": "tudo",
	"any": "qualquer",
	"relationAll": "todas as regras",
	"waiRelAll": "Corresponder a todas as seguintes regras:",
	"relationAny": "qualquer regra",
	"waiRelAny": "Corresponder a qualquer uma das seguintes regras:",
	"relationMsgFront": "Correspondência",
	"relationMsgTail": "",
	"and": "and",
	"or": "or",
	"addRuleButton": "Adicionar regra",
	"waiAddRuleButton": "Adicionar uma nova regra",
	"removeRuleButton": "Remover regra",
	"waiRemoveRuleButtonTemplate": "Remover regra ${0}",
	"addRuleButton": "Adicionar regra de filtro",
	"cancelButton": "Cancelar",
	"waiCancelButton": "Cancelar esta caixa de diálogo",
	"clearButton": "Limpar",
	"waiClearButton": "Limpar o filtro",
	"filterButton": "Filtro",
	"waiFilterButton": "Submeter o filtro",
	"columnSelectLabel": "Coluna:",
	"waiColumnSelectTemplate": "Coluna para a regra ${0}",
	"conditionSelectLabel": "Condição:",
	"waiConditionSelectTemplate": "Condição para a regra ${0}",
	"valueBoxLabel": "Valor:",
	"waiValueBoxTemplate": "Introduzir valor para filtrar para a regra ${0}",
	"rangeTo": "a",
	"rangeTemplate": "de ${0} a ${1}",
	"statusTipHeaderColumn": "Coluna",
	"statusTipHeaderCondition": "Regras",
	"statusTipTitle": "Barra do filtro",
	"statusTipMsg": "Faça clique na barra de filtro para filtrar os valores em ${0}.",
	"anycolumn": "qualquer coluna",
	"statusTipTitleNoFilter": "Barra do filtro",
	"statusTipTitleHasFilter": "Filtro",
	"statusTipRelPre": "Correspondência",
	"statusTipRelPost": "regras.",
	"statusTipHeaderAll": "Corresponder todas as regras.",
	"statusTipHeaderAny": "Corresponder quaisquer regras.",
	"defaultItemsName": "artigos",
	"filterBarMsgHasFilterTemplate": "${0} de ${1} ${2} apresentado(s).",
	"filterBarMsgNoFilterTemplate": "Nenhum filtro aplicado",
	"filterBarDefButton": "Definir filtro",
	"waiFilterBarDefButton": "Filtrar a tabela",
	"a11yFilterBarDefButton": "Filtrar...",
	"filterBarClearButton": "Limpar filtro",
	"waiFilterBarClearButton": "Limpar o filtro",
	"closeFilterBarBtn": "Fechar barra de filtro",
	"clearFilterMsg": "Este procedimento irá remover o filtro e apresentar todos os registos disponíveis.",
	"anyColumnOption": "Qualquer coluna",
	"trueLabel": "True",
	"falseLabel": "False",
	"radioTrueLabel": "Valor True",
	"radioFalseLabel": "Valor False",
	"beginTimeRangeLabel": "Início do valor de intervalo de tempo",
	"endTimeRangeLabel": "Fim do valor de intervalo de tempo",
	"beginDateRangeLabel": "Início do valor de intervalo de datas",
	"endDateRangeLabel": "Fim do valor de intervalo de datas",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Ordenação única",
	nestedSort: "Ordenação imbricada",
	ascending: "Faça clique para ordenar Ascendente",
	descending: "Faça clique para ordenar Descendente",
	sortingState: "${0} - ${1}",
	unsorted: "Não ordenar esta coluna",
	waiSingleSortLabel: "${0} - está ordenado por ${1}. Seleccionar ordenar por ${2}",
	waiNestedSortLabel:"${0} - é ordenação imbricada por ${1}. Seleccionar ordenação imbricada por ${2}",

//PaginationBar
	pagerWai: 'Paginador',

	pageIndex: '${0}',
	pageIndexTitle: 'Página ${0}',

	firstPageTitle: 'Primeira página',
	prevPageTitle: 'Página anterior',
	nextPageTitle: 'Página seguinte',
	lastPageTitle: 'Última página',

	pageSize: '${0}',
	pageSizeTitle: '${0} artigos por página',
	pageSizeAll: 'Tudo',
	pageSizeAllTitle: 'Todos os artigos',

	description: '${0} - ${1} de ${2} artigos.',
	descriptionEmpty: 'Grelha está vazia.',

	summary: 'Total: ${0}',
	summaryWithSelection: 'Total: ${0} Seleccionados: ${1}',

	gotoBtnTitle: 'Avançar para uma página específica',

	gotoDialogTitle: 'Avançar para a página',
	gotoDialogMainMsg: 'Especificar o número de página:',
	gotoDialogPageCount: ' (${0} páginas)',
	gotoDialogOKBtn: 'Ir',
	gotoDialogCancelBtn: 'Cancelar',
	// for drop down pagination bar
	pageLabel: 'Página',
	pageSizeLabel: 'Filas',

//QuickFilter
	filterLabel: 'Filtro',
	clearButtonTitle: 'Limpar filtro',
	buildFilterMenuLabel: 'Construir filtro&hellip;',
	apply: 'Aplicar filtro',

//Sort
	helpMsg: '${0} - Faça clique para ordenar ou prima CTRL e faça clique para adicionar à ordenação',
	singleHelpMsg: '${0} - Faça clique para ordenar',
	priorityOrder: 'prioridade de ordenação ${0}',

//SummaryBar
	summaryTotal: 'Total: ${0}',
	summarySelected: 'Seleccionado: ${0}',
	summaryRange: 'Intervalo: ${0} a ${1}',	//need translation

//Other
	indirectSelectAll: "Prima a Barra de espaços para seleccionar tudo.",	//need translation
	indirectDeselectAll: "Prima a Barra de espaços para desmarcar tudo.",	//need translation
	treeExpanded: "Prima CTRL e a seta para a esquerda para contrair esta linha.",	//need translation
	treeCollapsed: "Prima CTRL e a seta para a direita para expandir esta linha."	//need translation
});

