<html>
<head>
  <title>GridX</title>
  <link rel="stylesheet" href="css/960/reset.css" />
  <link rel="stylesheet" href="css/960/text.css" />
  <link rel="stylesheet" href="css/960/960.css" />
  <link rel="stylesheet" href="css/common.css" />

  <style>

    
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
    
    
    .grid_12 h1 {
      background: #eee;
      color: #45A29B;
      font-family: "DOSIS", sans-serif;
      padding: 5px 10px;
      border-bottom: 1px solid #ccc;
    }
    .grid_12.demosHead {
        margin-top: 15px;
    }

    .demoLink {
      text-align: center;
    }

    .demoLink img {
        width: 280px;
        height: 208px;
        -webkit-box-shadow: #999 3px 3px 3px;
        -moz-box-shadow: #999 3px 3px 3px;
        box-shadow: #999 3px 3px 3px;
    }
    .demoLink h2 {
        padding: 15px;
    }
    .demoLink a {
        display: block;
        color: #666;
        text-decoration: none;
    }
    .demoLink a:hover {
        text-decoration: underline;
    }

    #linkTop {
        text-decoration: none;
        color: #555;

    }
    #linkTop:hover {
        text-decoration: underline;
    }

  </style>
  
  <style type="text/css">
	
  </style>
  
</head>

<body>
    <a name="top"></a>
  <div class="container_12">
    {{header|safe}}
    <div class="grid_12 demosHead">
        <h1>DEMOS</h1>
    </div>
    <div class="grid_4 demoLink">
        <a href="demos/demo_features.html">
            <img src="images/demo_features.png"/>
            <h2>Powerful features</h2>
        </a>
    </div>
    <div class="grid_4 demoLink">
        <a href="demos/demo_style.html">
            <img src="images/demo_style.png"/>
            <h2>Custom look &amp; feel</h2>
        </a>
    </div>
    <div class="grid_4 demoLink">
        <a href="demos/demo_dynamic.html">
            <img src="images/demo_store.png"/>
            <h2>Dynamical store</h2>
        </a>
    </div>
    <div class="clear"></div>
    <div class="grid_12">
        <h1>GALLERY</h1>
    </div>
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
    			
    			<li>Mobile GridX</li>
    			<li>
    				<ul class="sub-nav">
    					{% for m in mobile %}
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
    		<a class="button button-demo" href="demos/{{m.demo}}">See the Demo</a>
    		<div class="clear"></div>
    	</div>
    	{% endfor %}
    	
    </div>
    <div class="clear"></div>
    
    {{footer|safe}}
    
  </div>
  <a href="#top" style="position: fixed; right: 10px; bottom: 10px;" id="linkTop">Go Top</a>
</body>

</html>