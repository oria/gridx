<?php
include("config.php");
include("generate.php");

function get_page($version, $page, $refdoc=""){
	$html = generate_object_html($page, $version, "data/", ".html", true, array(), $refdoc);
	$pageName = preg_replace("/\\//", "-", $page);
	$fh = fopen("../../data/".$version."/docs/".$pageName.".html", "w");
	fwrite($fh, $html);
	fclose($fh);

	return $html;
}

//	begin the real work.
if(!isset($version)){ $version = "1.1"; }
if(!isset($page)){ $page = ""; }

//	check if there's URL variables
if(isset($_GET["p"])){ $page = $_GET["p"]; }
if(isset($_GET["v"])){ $version = $_GET["v"]; }

//  sanitize $version and $page so user can't specify a string like ../../...
$version = preg_replace("/\\.\\.+/", "", $version);
$page = preg_replace("/\\.\\.+/", "", $page);

echo get_page($version, $page, $refdoc);
?>
