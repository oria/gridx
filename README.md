<!-- ## GridX Overview

#### **A fast rendering, well modularized and plugin architecture based Grid.**

Besides supporting a rich set of popular features, GridX is optimized and extremely capable of supporting huge dataset.

GridX is consisted of:

* A compact and lightweight core
* A flexible plugin machinery with comprehensive module life-cycle and conflict management
* A rich and extend-able set of modules which can be loaded on demand.

GridX is available under [Dojo Toolkit](http://dojotoolkit.org/) [CLA](http://dojofoundation.org/about/cla) with the same [BSD/AFLv2 license] (http://dojotoolkit.org/license)


### Archive Versions:
* [1.3 (LTS)](https://github.com/oria/gridx/tree/1.3): [release notes](https://github.com/oria/gridx/wiki/Gridx-v1.3.0-Release-Notes)
* [1.2 (LTS)](https://github.com/oria/gridx/tree/1.2): [release notes](https://github.com/oria/gridx/wiki/Gridx-v1.2.0-Release-Notes)
* [1.1](https://github.com/oria/gridx/tree/1.1): [release notes](https://github.com/oria/gridx/wiki/Gridx-v1.1.0-Release-Notes)
* [1.0 (LTS)](https://github.com/oria/gridx/tree/1.0)

## Installation

1.	[CPM installation](https://github.com/kriszyp/cpm) with the following command:

	``cpm install gridx``

2.	[Bower](http://bower.io) install:

	``bower install gridx``

3.	Manual installation by putting GridX at the same level as Dojo, e.g:
	* dojo 
	* dijit
	* dojox
	* gridx

**GridX** works best with [Dojo 1.8.0](http://download.dojotoolkit.org/release-1.8.0/) or higher.


## Quick ways to know GridX

* [Feature Coverage](https://docs.google.com/spreadsheet/pub?key=0AgR1KOpszcsZdF9ZbW5hWFdYUFAzdjdhZi1xcGMwUVE&gid=1)
* [Module Compatibility Matrix](https://docs.google.com/spreadsheet/pub?key=0AgR1KOpszcsZdF9ZbW5hWFdYUFAzdjdhZi1xcGMwUVE&gid=0)
* [Demo gallery]() (http://oria.github.com/gridx/gallery.html)
* [Benchmaks]() (in progress)
* [Tutorial](https://github.com/oria/gridx/wiki) (in progress)
* [API Doc](http://oria.github.com/gridx/apidoc/index.html) (in progress)
* [Known limitations]() (in progress)
* [Release download (v1.3)](https://github.com/oria/gridx/zipball/1.3)
* [Report bugs](https://github.com/oria/gridx/issues/new)


## GridX Home Site (in progress)
Please also check out [GridX Home Site](http://oria.github.com/gridx) for more details on how GridX can help you.



##Current Maintainer
* [Chen Zhuang Hong (Daniel) - IBM, CCLA](mailto:xiaohongczh@gmail.com)

## GridX Team
* [Xiao Wen Zhu (Oliver) - IBM, CCLA](mailto:zhuxw1984@gmail.com)
* [Pei Wang (Nate) - IBM, CCLA](mailto:supnate@gmail.com)
* [Bing Jian Guo (Evans) - IBM, CCLA](mailto:bingjian.guo@gmail.com)
* [Qi Ruan (Rock) - IBM, CCLA](mailto:)
* [Xiang Zhou (JayZ) - IBM, CCLA](mailto:)
* [Wei Huang (Evan) -  Dojo Committer](mailto:evanhuangwei@gmail.com)

Please contact us if you have got any questions. We really appreciate any suggestions or fix patches to improve GridX. -->


## GridX experimental branch for more_less feature

### Cause:
This branch is caused by the feature request 12705. In detail, it is better for the grid to allow users to expand and collapse the contents of certain cells and columns.

### Solution:

Construct a widget "ExpandableArea", and a module "HeaderExpand". 

* ExpandableArea: a common IDX widget, consisting of "ExpandableArea.js" and template file "ExpandableArea.html". It can be used to expand or collapse the content with inside button more or less. 
* HeaderExpand: a module, which adds more and less buttons inside column header to expand and collapse contents of below cells. It requires modules "HeaderRegions" and "VirtualVScroller".

1. Load module "HeaderExpand", and required modules "HeaderRegions" and "VirtualVScroller";
2. Config the layout of gridx: for each column layout, set "isExpandable" to true and attach a name to "expandableName"; insert "ExpandableArea" widget into cell, with functions "decorator" and "setCellValue". Use "data-dojo-props" to cofig the widget, "height" is the default height without more button triggered, "name" is the same as "expandableName", "isExpanded" can determine the initial content status, expanded or collapsed.

### Test:

Run "test_grid_more_less.html" to see the result. 

### Resources:

Files related to this feature request are below:
HeaderExpand.js, ExpandableArea.js, ExpandableArea.html, test_grid_more_less.html, test_grid_more_less.js, MusitData2.js.