###Build GridX Website

####Overview
GridX website (gh-pages branch) runs on dojos (http://github.com/supnate/dojos) so that pages could be generated dynamically. Such as common header, footer, gallery page from a json file, etc. A script tool is used to generate static html files for uploading to github pages.

####Dojos
Every page is a djs file and a background djs.js file. Such as gallery.djs and gallery.djs.js. You can learn more about dojos from http://github.com/supnate/dojos

####Generate static pages
Github only accept static pages (html). So we need to generate them from dojos page file. There is a script tool "gen_html.js" under util folder. You can use "node gen_html.js" command to generate html files from djs pages. There are 2 parameters to config:

* sitePath: The path of the site: '/gridx_site/'
* options.host: The host of the site, such as '127.0.0.1'
* options.port: The port of the site, such as 8080

All static files are generated under the same folder with djs pages. 

####Build gridx demos
Gridx demos are built for the gallery page of the web site. They are built from gridx/tests folder. The build script is: util/gen_demos.js. You can use "node gen_demos.js" to build all demos file. The script copies test pages from gridx/tests folder to gridx_site/demos folder and rename them, also updates the reference css, js files in the page source.

####GridX source code for demos
Source code for demos is under src/ folder, which are saved as git sub modules. To update or change source code version, go to src folder and pull/checkout gridx, dojo, dijit, dojox with needed versions.

