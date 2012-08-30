<html>
<head>
  <title>GridX</title>
  <link rel="stylesheet" href="css/960/reset.css" />
  <link rel="stylesheet" href="css/960/text.css" />
  <link rel="stylesheet" href="css/960/960.css" />

  <style>
    body {
      color: #666;
      font-family: arial;
      font-size: 12px;
      background: url(images/header_bg.png) 0 0 repeat-x;
      text-align: center;
    }
    div.container_12 {
      text-align: left;
    }
    h2 {
      font-size: 14px;
      padding: 3px;
      border-bottom: 1px solid #ddd;
      margin: 0;
    }
    div{
      
      margin: 5px 0;
    }
    
    ul,li {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    li {
      padding: 3px;
      
    }
    
    li a {
      color: #666;
      text-decoration: none;
    }
    
    .logo {
    	padding: 20px 0 0 0;
    	margin-top: 10px;
    	margin-bottom: 40px;
    }
    
    .search {
      text-align: right;
      margin-top:20px;
    }
    
    .search input {
      border: 1px solid #ddd;
      width: 200px;
      background: #fff url(images/icon_search.png) 178px 4px no-repeat;
      color: #777;
      padding: 3px;
      border-radius: 3px;
      
    }
    .menu {
      text-align: right;
      padding: 3px 0;
      margin-top: 10px;
    }
    
    .menu a {
      font-size: 14px;
      font-weight: bold;
      color: #888;
      text-decoration: none;
      margin-left: 15px;
      text-shadow: 1px 1px 1px #fff;
    }
    
    .menu a.current
    ,.menu a:hover {
      color: #f90;
    }

    .summary {
      margin-bottom: 20px;
    }
    .summary img {
      margin: 30px;
    }
    
    .button {
    	font-size: 12px;
    	color: #555;
    	padding: 4px 16px;
    	margin-right: 10px;
    	cursor: pointer;
    	text-decoration: none;
    	
    	/*From OneUI*/
    	background-color: #F4F4F4;
		background-image: -moz-linear-gradient(top, #F4F4F4, #DBDBDB);
		background-image: -webkit-gradient(linear,0% 0%,0% 100%,from(#F4F4F4),to(#DBDBDB));
		background-image: -webkit-linear-gradient(top, #F4F4F4 0%,#DBDBDB 100%);
		background-image: -o-linear-gradient(top, #F4F4F4 0%,#DBDBDB 100%);
		background-image: -ms-linear-gradient(top, #F4F4F4 0%,#DBDBDB 100%);
		background-image: linear-gradient(top, #F4F4F4 0%,#DBDBDB 100%);
		border: 1px solid #C3C3C3;
		-moz-border-radius: 3px;
		-webkit-border-radius: 3px;
		border-radius: 3px;
		-webkit-box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.1);
		-moz-box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.1);
		box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.1);
		text-shadow: 0px 1px 0px white;
		font-weight: bold;
    }
    
    .button:hover {
		-webkit-transition-duration: 0.2s;
		-moz-transition-duration: 0.2s;
		transition-duration: 0.2s;
		background-color: #E5E5E5;
		background-image: -moz-linear-gradient(top, #FEFEFE, #CCC);
		background-image: -webkit-gradient(linear,0% 0%,0% 100%,from(#FEFEFE),to(#CCC));
		background-image: -webkit-linear-gradient(top, #FEFEFE 0%, #CCC 100%);
		background-image: -o-linear-gradient(top, #FEFEFE 0%, #CCC 100%);
		background-image: -ms-linear-gradient(top, #FEFEFE 0%, #CCC 100%);
		background-image: linear-gradient(top, #FEFEFE 0%, #CCC 100%);
		border: 1px solid -moz-linear-gradient(top, #FDFDFD, #E4E4E4);
		border: 1px solid -webkit-gradient(linear,0% 0%,100% 100%,from(#FDFDFD),to(#E4E4E4));
    }
    
    .button-demo {
      background-color: #008ABF;
	  background-image: -moz-linear-gradient(top, #008ABF, #085884);
	  background-image: -webkit-gradient(linear,0% 0%,0% 100%,from(#008ABF),to(#085884));
	  background-image: -webkit-linear-gradient(top, #008ABF 0%, #085884 100%);
	  background-image: -o-linear-gradient(top, #008ABF 0%, #085884 100%);
	  background-image: -ms-linear-gradient(top, #008ABF 0%, #085884 100%);
	  background-image: linear-gradient(top, #008ABF 0%, #085884 100%);
	  border: 1px solid #0A5F8E;
	  color: white;
	  text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.35);
    }
    
    .button-demo:hover {
      background-color: #206B93;
	  background-image: -moz-linear-gradient(top, #1A95C5, #206B93);
	  background-image: -webkit-gradient(linear,0% 0%,0% 100%,from(#1A95C5),to(#206B93));
	  background-image: -webkit-linear-gradient(top, #1A95C5 0%, #206B93 100%);
	  background-image: -o-linear-gradient(top, #1A95C5 0%, #206B93 100%);
	  background-image: -ms-linear-gradient(top, #1A95C5 0%, #206B93 100%);
	  background-image: linear-gradient(top, #1A95C5 0%, #206B93 100%);
    }
    
    
    #gallery-nav {
    	padding: 15px;
    	background-color: #f3f3f3;
    }
    #gallery-nav li {
      list-style: none;
      margin-left: 0px;
      color: #666;
      font-weight: bold;
    }
    #gallery-nav .sub-nav {
      margin-left: 15px;
    }
    #gallery-nav .sub-nav li {
   		font-weight: normal
    }
    
    #gallery-nav .sub-nav li a:hover {
    	color: #f90;
    }
    
    #gallery-list-header{
    	padding: 5px;
    }
    .gallery-item {
    	border-top: 1px solid #eee;
    	padding: 10px;
    	clear: both;
    }
    .gallery-item h4 {
    	padding: 5px 5px 5px 0;
    	margin: 0;
    }
    .gallery-item .description{
    	line-height: 150%;
    	margin-bottom: 20px;
    	min-height: 60px;
    }
    .gallery-item img {
    	float:right;
    	margin: 10px;
    	border: 1px solid #fff;
    	-webkit-box-shadow: #999 3px 3px 3px;
		-moz-box-shadow: #999 3px 3px 3px;
		box-shadow: #999 3px 3px 3px;
		width: 200px;
    }
    .gallery-item .button {
    }
    
    .footer {
      text-align: center;
      border-top: 1px solid #ddd;
      padding: 5px 0;
      margin-top: 30px;
      color: #999;
      font-weight: bold;
    }
    
    
    .footer a{
      margin: 10px;
      color: #999;
      text-decoration: none;
    }
    
    .footer a.git-link {
      color: #2175bc;
    }
    
    .grid_3 {
    
    }
    
  </style>
  
  <style type="text/css">
	
  </style>
  <script src="../dojo/dojo.js" djConfig="parseOnLoad:true, isDebug:true"></script>
  <script>
	require([
		'dojo/domReady!'], function(){
	});
  </script>
</head>

<body>
  <div class="container_12" style="background: none;">
    {{header|safe}}
    
    <div class="grid_3">
    	<div id="gallery-nav">
    		<ul>
    			<li>Core Modules</li>
    			<li>
    				<ul class="sub-nav">
    					{% for m in core %}
					     <li><a href="#{{m.id}}">{{m.name}}</a></li>
					    {% endfor %}
    				</ul>
    			</li>
    			<li>Basic Modules</li>
    			<li>
    				<ul class="sub-nav">
    					{% for m in basic %}
					     <li><a href="#{{m.id}}">{{m.name}}</a></li>
					    {% endfor %}
    				</ul>
    			</li>
    			<li>Advanced Modules</li>
    			<li>
    				<ul class="sub-nav">
    					{% for m in advanced %}
					    <li><a href="#{{m.id}}">{{m.name}}</a></li>
					    {% endfor %}
    				</ul>
    			</li>
    			
    		</ul>
    	</div>
    </div>
    <div class="grid_9">
    	<div id="gallery-list-header">
    		<img src="images/gallery_header.png"/>
    	</div>
    	{% for m in all %}
    	<div class="gallery-item">
    		<a name="{{m.id}}"/>
    		<img src="images/gallery/{{m.id}}.jpg"/>
    		<h4>{{m.name}}</h4>
    		<div class="description">{{m.description}}</div>
    		<a class="button" href="http://oria.github.com/gridx/doc/gridx.html#{{m.id}}">API Reference</a>
    		<a class="button button-demo" href="gridx/demos/{{m.demo}}">See the Demo</a>
    		<div class="clear"></div>
    	</div>
    	{% endfor %}
    	
    </div>
    <div class="clear"></div>
    
    {{footer|safe}}
    
  </div>
</body>

</html>