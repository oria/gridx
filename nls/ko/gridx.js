define({     
//Body
	loadingInfo: "로드 중...",
	emptyInfo: "표시할 항목 없음",
	loadFailInfo: "데이터 로드에 실패했음!",
	loadMore: "계속 로드",
	loadMoreLoading: "로드 중...",
	loadPrevious: "이전 로드",
	loadPreviousLoading: "로드 중...",

//FilterBar
	"clearFilterDialogTitle": "필터 지우기",
	"filterDefDialogTitle": "필터",
	"defaultRuleTitle": "규칙 ",
	"ruleTitleTemplate": "규칙 ${ruleNumber}",
	"noFilterApplied": "적용된 필터 없음",
	"defineFilter": "필터 정의",
	"conditionEqual": "같음",
	"conditionNotEqual": "같지 않음",
	"conditionLess": "미만",
	"conditionLessEqual": "이하",
	"conditionGreater": "초과",
	"conditionGreaterEqual": "이상",
	"conditionContain": "포함",
	"conditionIs": "다음과 같음",
	"conditionStartWith": "다음으로 시작",
	"conditionEndWith": "다음으로 종료",
	"conditionNotContain": "포함하지 않음",
	"conditionIsNot": "다음이 아님",
	"conditionNotStartWith": "다음으로 시작하지 않음",
	"conditionNotEndWith": "다음으로 종료하지 않음",
	"conditionBefore": "이전",
	"conditionAfter": "이후",
	"conditionRange": "범위",
	"conditionIsEmpty": "비어있음",
	"all": "모두",
	"any": "임의",
	"relationAll": "모든 규칙",
	"waiRelAll": "다음 규칙에 모두 일치:",
	"relationAny": "임의 규칙",
	"waiRelAny": "다음 규칙 중에 일치:",
	"relationMsgFront": "일치",
	"relationMsgTail": "",
	"and": "및",
	"or": "또는",
	"addRuleButton": "규칙 추가",
	"waiAddRuleButton": "새 규칙 추가",
	"removeRuleButton": "규칙 제거",
	"waiRemoveRuleButtonTemplate": "${0} 규칙 제거",
	"addRuleButton": "필터 규칙 추가",
	"cancelButton": "취소",
	"waiCancelButton": "이 대화 상자 취소",
	"clearButton": "지우기",
	"waiClearButton": "해당 필터 지우기",
	"filterButton": "필터",
	"waiFilterButton": "필터 제출",
	"columnSelectLabel": "컬럼:",
	"waiColumnSelectTemplate": "${0} 규칙에 대한 컬럼",
	"conditionSelectLabel": "조건:",
	"waiConditionSelectTemplate": "${0} 규칙에 대한 조건",
	"valueBoxLabel": "값:",
	"waiValueBoxTemplate": "${0} 규칙에 대해 필터링할 값 입력",
	"rangeTo": "다음에서 종료",
	"rangeTemplate": "${0}에서 ${1}까지",
	"statusTipHeaderColumn": "컬럼",
	"statusTipHeaderCondition": "규칙",
	"statusTipTitle": "필터 표시줄",
	"statusTipMsg": "${0}의 값을 필터링하려면 이 필터 표시줄을 클릭하십시오.",
	"anycolumn": "임의의 컬럼",
	"statusTipTitleNoFilter": "필터 표시줄",
	"statusTipTitleHasFilter": "필터",
	"statusTipRelPre": "일치",
	"statusTipRelPost": "규칙",
	"statusTipHeaderAll": "모든 규칙과 일치.",
	"statusTipHeaderAny": "임의 규칙과 일치.",
	"defaultItemsName": "항목",
	"filterBarMsgHasFilterTemplate": "${1} ${2}의 ${0}이(가) 표시됩니다.",
	"filterBarMsgNoFilterTemplate": "적용된 필터 없음",
	"filterBarDefButton": "필터 정의",
	"waiFilterBarDefButton": "표 필터링",
	"a11yFilterBarDefButton": "필터...",
	"filterBarClearButton": "필터 지우기",
	"waiFilterBarClearButton": "해당 필터 지우기",
	"closeFilterBarBtn": "필터 표시줄 닫기",
	"clearFilterMsg": "이로 인해 해당 필터가 제거되며 사용 가능한 모든 레코드가 표시됩니다.",
	"anyColumnOption": "임의의 컬럼",
	"trueLabel": "True",
	"falseLabel": "False",
	"radioTrueLabel": "값 True",
	"radioFalseLabel": "값 False",
	"beginTimeRangeLabel": "시간 범위 값 시작",
	"endTimeRangeLabel": "시간 범위 값 종료",
	"beginDateRangeLabel": "날짜 범위 값 시작",
	"endDateRangeLabel": "날짜 범위 값 종료",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "단일 정렬",
	nestedSort: "중첩된 정렬",
	ascending: "오름차순으로 정렬하려면 클릭",
	descending: "내림차순으로 정렬하려면 클릭",
	sortingState: "${0} - ${1}",
	unsorted: "이 컬럼을 정렬하지 않음",
	waiSingleSortLabel: "${0} - ${1}별로 정렬합니다. ${2}별로 정렬하려면 선택하십시오.",
	waiNestedSortLabel:"${0} - ${1}별로 중첩 정렬합니다. ${2}별로 중첩 정렬하려면 선택하십시오.",

//PaginationBar
	pagerWai: '호출기',

	pageIndex: '${0}',
	pageIndexTitle: '${0} 페이지',

	firstPageTitle: '첫 페이지',
	prevPageTitle: '이전 페이지',
	nextPageTitle: '다음 페이지',
	lastPageTitle: '마지막 페이지',

	pageSize: '${0}',
	pageSizeTitle: '페이지당 ${0}개 항목',
	pageSizeAll: '모두',
	pageSizeAllTitle: '모든 항목',

	description: '${0} - ${1} / ${2} 항목',
	descriptionEmpty: '그리드가 비어있습니다.',

	summary: '총계: ${0}',
	summaryWithSelection: '총계: ${0} 선택됨: ${1}',

	gotoBtnTitle: '특정 페이지로 이동',

	gotoDialogTitle: '페이지 이동',
	gotoDialogMainMsg: '페이지 번호 지정',
	gotoDialogPageCount: '(${0}페이지)',
	gotoDialogOKBtn: '이동',
	gotoDialogCancelBtn: '취소',
	// for drop down pagination bar
	pageLabel: '페이지',
	pageSizeLabel: '행',

//QuickFilter
	filterLabel: '필터',
	clearButtonTitle: '필터 지우기',
	buildFilterMenuLabel: '필터 빌드&hellip;',
	apply: '필터 적용',

//Sort
	helpMsg: '${0} - 정렬하려면 클릭 또는 정렬에 추가 하려면 Ctrl + 클릭',
	singleHelpMsg: '${0} - 정렬하려면 클릭',
	priorityOrder: '정렬 우선순위 ${0}',

//SummaryBar
	summaryTotal: '총계: ${0}',
	summarySelected: '선택됨: ${0}',
	summaryRange: '범위: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "모두 선택하려면 SPACE를 누르십시오.",	//need translation
	indirectDeselectAll: "모두 선택 취소하려면 SPACE를 누르십시오.",	//need translation
	treeExpanded: "이 행을 접으려면 Ctrl + 왼쪽 화살표를 누르십시오.",	//need translation
	treeCollapsed: "이 행을 펼치려면 Ctrl + 오른쪽 화살표를 누르십시오."	//need translation
});

