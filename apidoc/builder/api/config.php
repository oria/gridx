<?php
# Location of data files for each version.   This directory should contain a subdirectory for each product version,
# and the subdirectory should contain details.xml and tree.json
$dataDir = dirname(__FILE__) . "/../../data/";

# Path and URL to reference doc: if set, use the specified directory to check if corresponding reference doc exists,
# and then use the url to generate a link to that reference doc.
# The reference doc directory structure needs to be similar to api URLs, with version numbers for the top level
# directories.
$refdoc = array(
	"dir" => dirname(__FILE__) . "/../reference-guide/",
	"url" => "/reference-guide/",
	"suffix" => ".html"
);
?>
