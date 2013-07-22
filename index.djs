<html>
<head>
  <title>GridX - The next generation of dojo enhanced data grid.</title>
  <link rel="stylesheet" href="css/960/reset.css" />
  <link rel="stylesheet" href="css/960/text.css" />
  <link rel="stylesheet" href="css/960/960.css" />
  <link rel="stylesheet" href="css/common.css" />
  <meta name="description" content="GridX is the next generation of dojo grid(datagrid). It provides well modularized and plugin architecture." />
  <meta name="keywords" content="dojo,grid,best,dijit,datagrid" />
  
  <style>

   
  .button {
    margin-left: 42px;
    font-size: 18px;
    color: #666;
  }
  .summary {
    margin-bottom: 15px;
  }
  .summary img {
    margin: 40px 30px 0 30px;
  }


  .grid_3 li {
    list-style: square;
    margin-left: 20px;
    color: #999;
  }

  .mainBanner {
    background: transparent url(images/homeBannerBg3.png) no-repeat;
    background-size: cover;
    height: 340px;
    padding-left: 0px;
  }

  .mainBanner p {
    color: #fff;
    font-size: 38px;
    font-family: "DOSIS", sans-serif;
    padding: 35px 40px 10px 40px;
    width: 70%;
  }

  .mainBanner p span {
    font-size: 24px;

  }

  .mainBanner img {
    float: right;
  }

  .mainBanner .browsers {
    margin: 0;
    margin-right: 50px;
    float: right;
    color: #fff;
    font-size: 16px;
    font-weight: normal;
  }
  .mainBanner .browsers span {
    opacity: 0.5;
    margin-right: 15px;
  }
  .mainBanner .browsers img {
    float: none;
    width: 160px;
  }
  .news ul,.news h2, .features ul, .features h2{
    margin-left: 110px;
    margin-right: 20px;
    color: #999;
  }
  .news h2, .features h2 {
    color: #888;
  }


  li a {
    color: #999;
    cursor: default;
  }
  li a:hover {
    text-decoration: none;
  }

  .news img, .features img {
    float: left;
    width: 80px;
    margin-left: 20px;
    opacity: 0.7;
  }
	
  .news, .features {
    background: #f7f7f7;
    padding: 20px 0;
  }

  .blockLink {
    background: #f7f7f7;
    height: 140px;
    cursor: pointer;
    margin-top:5px;
    margin-bottom: 15px;
  }
  .blockLink:hover{
    background: #eee;
  }

  .blockLink h2{
    border: none;
    font-size: 24px;
    color: #888;
    margin: 10px;
    padding: 0;
  }

  .blockLink p{
    font-size: 14px;
    color: #999;
    margin: 10px;
  }
  .blockLink a {
    display: block;
    text-decoration: none;
  }

  /*.blockLink1 {background: #FFF2BF;}
  .blockLink2 {background: #FFF2BF;}
  .blockLink3 {background: #FFF2BF;}*/
  </style>
</head>

<body>

  <div class="container_12" >
    {{header|safe}}
    

    <div class="grid_12 summary mainBanner">
      <img src="images/home1.png"/>
      <p>
      FAST RENDERING<br/>WELL MODULARIZED<br/>PLUGIN ARCHITECTURE
      <br/><span>The next generation of Dojo data grid.</span>
      </p>
      <a href="https://github.com/oria/gridx/tags" class="button button-download">Download for Free</a>
      <span class="browsers"><span>Supporting</span><img src="images/browsers.png" class="browsers"/></span>
      <div class="clear"></div>
    </div>
  
    <div class="clear"></div>
    
    
    <div class="grid_4 blockLink blockLink2">
      <a href="./gallery.html">
      <h2>Demos &amp; Gallery</h2>
      <p>See the demos for typical GridX customization and look for a module usage from the gallery.</p>
    </div>
    <div class="grid_4 blockLink blockLink1">
      <a href="./playground.html">
      <h2>Playground</h2>
      <p>Play GridX with interactive user interface to learn how to customize GridX with various modules and stores.
    </div>
    <div class="grid_4 blockLink blockLink3">
      <a href="https://github.com/oria/gridx/wiki">
      <h2>Documentation</h2>
      <p>You can find tutorials and API reference from the documentation page (wiki) on the github. </p>
      </a>
    </div>
    <div class="clear"></div>
    <div class="grid_6 news">
      <img src="images/new.png"/>
      <h2>What's new</h2>
      <ul>
      	<li><a href="./news/metrics.html">Metrics for different GridX comparison</a></li>
        <li><a href="./gallery.html#mobile">Gridx 1.0.1 released!</a></li>
      	<li><a href="./gallery.html#mobile">Gridx mobile demos added to the gallery!</a></li>
        <li><a href="#">Gridx v1.0 launched!</a></li>
        <li><a href="#">Gridx home site is online</a></li>
        <li><a href="#">Gridx playground beta is ready</a></li>
      </ul>
      
    </div>
    <div class="grid_6 features">
    <img src="images/star.png"/>
      <h2>Features</h2>
      <ul>
        <li><a href="#">Fast rendering speed</a></li>
        <li><a href="#">Flexible module machinery</a></li>
        <li><a href="#">New smart scroller</a></li>
        <li><a href="#">Huge data store support</a></li>
        <li><a href="#">Easy for upgrading</a></li>
        <li><a href="#">Enterprise level i18n & a11y compliance</a></li>
      </ul>
    </div>
    
    <div class="clear"></div>
    
    {{footer|safe}}
    <div class="clear"></div>
  </div>
</body>

</html>