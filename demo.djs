<!DOCTYPE html> 
<html>
<head>
	<title>Gridx Demo</title>
	<link rel="stylesheet" href="css/960/reset.css" />
    
    <link rel="stylesheet" href="css/960/960.css" />
    <link rel="stylesheet" href="css/common.css" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"></meta>
	<style type="text/css">
		@import "dijit/themes/claro/claro.css";
		@import "dijit/themes/claro/document.css";
		@import "gridx/resources/claro/Gridx.css";

		body {
			padding: 0px;
			text-align: left;
		}
		.gridx {
			width: 700px;
			height: 400px;
		}
		.gridxCell {
			vertical-align: top !important;
		}
		.claro {
			font-family: arial;
		}
		.grid_9 {
			margin: 5px 0;
		}
	</style>

	<script type="text/javascript" src="dojo/dojo.js" data-dojo-config="async: true"></script>
	
</head>
<body class='claro'>
  <div class="container_12">
    {{header|safe}}
    
    <div class="grid_12" style="padding-left: 120px;">
    	<div style="padding: 5px; margin-right: 240px; margin-bottom: 20px; line-height: 150%;">
    		This is a simple GridX demo which demostrates some key features of GridX, such as: Sorting, Column Resizer, Selection, Filter, Column Lock, etc.
    		For more demos, please go to the <a href="./gallery.html">gallery</a> page.
    	</div>
    	<div id='gridContainer'></div>
    </div>
    <div class="clear"></div>
    {{footer|safe}}
  </div>
  <script type="text/javascript" src="test_grid_build.js"></script>
</body>
</html>
