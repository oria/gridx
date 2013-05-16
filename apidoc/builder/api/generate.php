<?php
/*	generate.php
 *	TRT 2010-02-03
 *
 *  Utility methods.
 *
 *	Functions externally used are:
 *		generate_object() - returns metadata about specified module
 *		generate_object_html() - returns the HTML for a page describing a module (ex: dijit/Dialog)
 */

function convert_type($type){
	$base = 'object';
	switch(strtolower($type)){
		case 'namespace': $base='namespace'; break;
		case 'constructor': $base='constructor'; break;
		case 'node':
		case 'domnode':   $base='domnode'; break;
		case 'array':   $base='array'; break;
		case 'boolean':   $base='boolean'; break;
		case 'date':    $base='date'; break;
		case 'error':     $base='error'; break;
		case 'function':  $base='function'; break;
		case 'integer':
		case 'float':
		case 'int':
		case 'double':
		case 'integer':
		case 'number':    $base='number'; break;
		case 'regexp':    $base='regexp'; break;
		case 'string':    $base='string'; break;
	}
	return $base;
}

function icon_url($type, $size=16){
	$img = "object";
	switch($type){
		case 'Namespace':
		case 'namespace': $img='namespace'; break;
		case 'Constructor': $img='constructor'; break;
		case 'Node':
		case 'DOMNode':
		case 'DomNode':   $img='domnode'; break;
		case 'Array':   $img='array'; break;
		case 'Boolean':   $img='boolean'; break;
		case 'Date':    $img='date'; break;
		case 'Error':     $img='error'; break;
		case 'Function':  $img='function'; break;
		case 'Integer':
		case 'Float':
		case 'int':
		case 'Double':
		case 'integer':
		case 'Number':    $img='number'; break;
		case 'RegExp':    $img='regexp'; break;
		case 'String':    $img='string'; break;
		default:      $img='object'; break;
	}
	return 'css/icons/' . $size . 'x' . $size . '/' . $img . '.png';
}

function object_exists($name, $docs){
	// summary:
	//		Returns true if there's a page for the specified object, ex: "dijit/form/Button" or "dijit/Tree.TreeNode"

	return array_key_exists($name, $docs["objects"]);
}

function object($page, $docs){
	// summary:
	//		Return specified object (<object> node in details.xml), or null if no such page exists

	$xpath = $docs["xpath"];
	$context = $xpath->query('//object[@location="' . $page . '"]');
	return $context->length > 0 ? $context->item(0) : null;
}

//	BEGIN array_filter functions
function is_event($item){
	return preg_match("/^_?on[A-Z]/", $item["name"]) >= 1;
}
function is_method($item){
	return !is_event($item);
}

//	END array_filter functions

function load_docs($version){
	//	helper function to load up the XML doc and make it xpath-accessible
	global $dataDir;
	$data_dir = $dataDir . $version . "/";

	//	load up the module descriptions
	$details = "details.xml";
	$f = $data_dir . $details;
	if(!file_exists($f)){
        header(":", true, 400);
        header("Content-type: text/plain");
		echo "API data does not exist for the version: " . $version;
		exit();
	}

	$xml = new DOMDocument();
	$xml->load($f);

	$xpath = new DOMXPath($xml);

	// put names of all the objects in a hash
	$objects = $xpath->query('//object/@location');
	$objhash = array();
	for($i = 0; $i < $objects->length; $i++){
		$name = $objects->item($i)->nodeValue;
		$objhash[$name] = true;
	}

	$docs = array(
		"xml"=>$xml,
		"xpath"=>$xpath,
		"objects"=>$objhash
	);
	return $docs;
}

function read_method_info($page, $xpath, $n){
	// summary:
	//		Reads the information for a method/function stored inside of $n
	// $n: DOMElement
	//		Either a <method> node or an <object> node, containing subnodes like <parameters>, <description>, etc.

	// Get name, from either <method name="doit"> or <object location="foo/bar/doit">
	$nm = $n->hasAttribute("name") ? $n->getAttribute("name") : preg_replace("/.*\//", "", $n->getAttribute("location"));
	if(!strlen($nm)){
		$nm = "constructor";
	}

	$private = $n->getAttribute("private") == "true";
	if(!$private && strpos($nm, "_")===0){
		$private = true;
	}

	$method = array(
		"name"=>$nm,
		"scope"=>$n->getAttribute("scope"),
		"from"=>$n->getAttribute("from"),
		"visibility"=>($private=="true"?"private":"public"),
		"parameters"=>array(),
		"return-types"=>array(),
		"inherited"=>$n->getAttribute("from")!=$page && !$n->hasAttribute("extension-module"),
		"extension-module"=>$n->hasAttribute("extension-module"),
		"constructor"=>$n->getAttribute("type")=="constructor"
	);

	// Get the method's summary, description, etc. taking care to ignore summaries of the method parameters
	$methodSummaries = $xpath->query("summary", $n);
	if($methodSummaries->length){
		$desc = trim($methodSummaries->item(0)->nodeValue);
		if(strlen($desc)){
			$method["summary"] = $desc;
		}
	}
	$methodDescriptions = $xpath->query("description", $n);
	if($methodDescriptions->length){
		$desc = trim($methodDescriptions->item(0)->nodeValue);
		if(strlen($desc)){
			$method["description"] = $desc;
		}
	}
	$ex = $xpath->query("examples/example", $n);
	if($ex->length){
		if(!array_key_exists("examples", $method)){
			$method["examples"] = array();
		}
		foreach($ex as $example){
			$method["examples"][] = $example->nodeValue;
		}
	}
	$methodReturnDescriptions = $xpath->query("return-description", $n);
	if($methodReturnDescriptions->length){
		$desc = trim($methodReturnDescriptions->item(0)->nodeValue);
		if(strlen($desc)){
			$method["return-description"] = $desc;
		}
	}

	//	do up the parameters and the return types.
	$params = $xpath->query("parameters/parameter", $n);
	if($params->length){
		//	TODO: double-check that the XML will always have this.
		$method["parameters"] = array();
		foreach($params as $param){
			$item = array(
				"name"=>$param->getAttribute("name"),
				"type"=>$param->getAttribute("type"),
				"usage"=>$param->getAttribute("usage"),
				"summary"=>"",
				"description"=>""
			);
			$summaries = $xpath->query("summary", $param);
			if($summaries->length){
				$desc = trim($summaries->item(0)->nodeValue);
				if(strlen($desc)){
					$item["summary"] = $desc;
				}
			}
			// normally parameters don't have descriptions but Colin is outputting description for kwArgs params
			$descriptions = $xpath->query("description", $param);
			if($descriptions->length){
				$desc = trim($descriptions->item(0)->nodeValue);
				if(strlen($desc)){
					$item["description"] = $desc;
				}
			}
			$method["parameters"][] = $item;
		}
	}

	if($nm == "constructor"){
		$method["return-types"] = array();
		$method["return-types"][] = array(
			"type"=>$page,
			"description"=>""
		);
	} else {
		$rets = $xpath->query("return-types/return-type", $n);
		if($rets->length){
			$method["return-types"] = array();
			foreach($rets as $type){
				//	TODO: double-check that the XML will always have this.
				$method["return-types"][] = array(
					"type"=>$type->getAttribute("type"),
					"description"=>""
				);
			}
		}
	}

	return $method;
}

function read_object_fields($page, $version, $docs=array()){
	// summary:
	//		Return methods and properties for given module.

	if(!count($docs)){
		$docs = load_docs($version);
	}

	$xml = $docs["xml"];
	$xpath = $docs["xpath"];

	//	get the XML for the page.
	$context = object($page, $docs);
	if(!$context){
		//	we got nothing, just return null.
		return null;
	}

	//	properties
	$props = array();
	$nl = $xpath->query("properties/property", $context);
	foreach($nl as $n){
		$nm = $n->getAttribute("name");
		$private = $n->getAttribute("private") == "true";
		if(!$private && strpos($nm, "_")===0){
			$private = true;
		}

		$props[$nm] = array(
			"name"=>$nm,
			"scope"=>$n->getAttribute("scope"),
			"from"=>$n->getAttribute("from"),
			"visibility"=>($private == true ? "private" : "public"),
			"type"=>$n->getAttribute("type"),
			"inherited"=>$n->getAttribute("from")!=$page && !$n->hasAttribute("extension-module"),
			"extension-module"=>$n->hasAttribute("extension-module"),
		);

		$summaries = $xpath->query("summary", $n);
		if($summaries->length){
			$desc = trim($summaries->item(0)->nodeValue);
			if(strlen($desc)){
				$props[$nm]["summary"] = $desc;
			}
		}
		$descriptions = $xpath->query("description", $n);
		if($descriptions->length){
			$desc = trim($descriptions->item(0)->nodeValue);
			if(strlen($desc)){
				$props[$nm]["description"] = $desc;
			}
		}
	}

	//	methods
	$methods = array();
	$nl = $xpath->query("methods/method", $context);
	foreach($nl as $n){
		$method = read_method_info($page, $xpath, $n);
		$methods[$method["name"]] = $method;
	}

	return array("props"=>$props, "methods"=>$methods);
}


function generate_object($page, $version, $docs=array()){
	// summary:
	//		create a PHP-based associative array structure for specified module

	if(!count($docs)){
		$docs = load_docs($version);
	}
	$xml = $docs["xml"];
	$xpath = $docs["xpath"];

	//	get the XML for the page.
	$context = object($page, $docs);
	if(!$context){
		//	we got nothing, just return null.
		return null;
	}

	//	ok, we have a context, let's build up our object.
	$obj = array();

	//	basic information.
	$is_constructor = ($context->getAttribute("type")=="Function" && $context->getAttribute("classlike")=="true");
	$nl = $xpath->query('//object[starts-with(@location, "' . $page . '.") and not(starts-with(substring-after(@location, "' . $page . '."), "_"))]');
	$is_namespace = ($nl->length > 0);
	$type = $context->getAttribute("type");
	if(!strlen($type)){ $type = 'Object'; }
	if($is_constructor){ $type = 'Constructor'; }

	$obj["type"] = $type;
	$obj["title"] = $context->getAttribute("location");
	$obj["version"] = $version;

	$bc[] = "Object";
	$bc = array_reverse($bc);

	//	note that this is "in order"; used to either fetch other objects or for something like breadcrumbs.
	$obj["prototypes"] = $bc;

	//	summary and description.
	$summary = $xpath->query("summary/text()", $context)->item(0);
	if($summary){ $obj["summary"] = $summary->nodeValue; }
	$desc = $xpath->query("description/text()", $context)->item(0);
	if($desc){ $obj["description"] = $desc->nodeValue; }

	//	examples.
	$examples = $xpath->query("examples/example", $context);
	if($examples->length > 0){
		$obj["examples"] = array();
		foreach($examples as $example){
			$obj["examples"][] = $example->nodeValue;
		}
	}

	// Get mixins
	$obj["mixins"] = array();
	$nl = $xpath->query("mixins/mixin", $context);
	foreach($nl as $m){
		$obj["mixins"][] = $m->getAttribute("location");
	}

	// Get methods and properties, and sort
	$foo = read_object_fields($page, $version, $docs);
	$props = $foo["props"];
	$methods = $foo["methods"];
	uksort($props, 'strcasecmp');
	uksort($methods, 'strcasecmp');

	// reclassify methods with names starting with "on" as events
	$events = array_filter($methods, "is_event");
	$methods = array_filter($methods, "is_method");

	$obj["properties"] = $props;
	$obj["methods"] = $methods;
	$obj["events"] = $events;

	//	if this module is a top level function (like dojo/query), then get info about parameters etc.
	if($type == "function"){
		$obj["topfunc"] = read_method_info($page, $xpath, $context);
	}

	return $obj;
}

///////////////////////////////////////////////////////////////////////////////////////////////
//
//	BEGIN HTML OUTPUT GENERATION
//
///////////////////////////////////////////////////////////////////////////////////////////////

function hyperlink($text, $docs, $base_url, $suffix = "", $label = ""){
	// summary:
	//		Convert text to a hyperlink if it looks like a link to a module.
	//		Return text as-is if it's something like "Boolean".
	// $label: String
	//		If specified, use this as the hyperlink label, rather than $text

	$url = null;
	if(object_exists($text, $docs)){
		$url = $text;
	}else if(strpos($text, ".") && object_exists(preg_replace("/\..*/", "", $text), $docs)){
		// Text like dojo/on.emit where there is no separate page for emit(), so turn into a URL like dojo/on#emit
		$url = str_replace(".", "#", $text);
	}

	if($url){
		return '<a class="jsdoc-link" href="' . $base_url . implode("-", explode("/", $url)) . $suffix . '">'
			. (strlen($label) > 0 ? $label : $text)
			. '</a>';
	}else{
		// Word like "Boolean"
		return $text;
	}
}

function hyperlinks($list, $docs, $base_url, $suffix = ""){
	// summary:
	//		Takes list of types like dijit/_Widget|Object and converts the applicable entries to hyperlinks
	// $list: String
	//		Something like "String|Object".

	// Get each type, allowing for syntax like "String|Object" or "String || Object"
	$ary = preg_split("/ *\\|+ */", $list);

	// Call hyperlink() on each type
	$links = array();
	foreach($ary as $single){
		$links[] = hyperlink($single, $docs, $base_url, $suffix);
	}

	// Return the results as a single string
	$res = implode(" | ", $links);
	return $res;
}

function trim_summary($summary, $firstSentence){
	// summary:
	//		Strip tags and returns the first sentence of specified string

	// Looking for a period followed by a space or newline, and then a capital letter.
	// But since $summary matches the formatting of the original HTML, maybe we should just
	// look for a newline... not sure.

	$summary = strip_tags($summary);

	if($firstSentence){
		$summary = preg_replace("/(\\.|!|\\?)[\s]+[A-Z].*/s", "\\1", $summary);
	}

	return trim($summary);
}


function auto_hyperlink_replacer($matches){
	// helper function for auto_hyperlink()

	// trick to pass additional parameters to callback; server is php 5.2 so can't use anonymous functions/closures
	global $global_docs, $global_base_url, $global_suffix;

	// $matches is:
	//		$matches[0]: the whole string
	//		$matches[1]: "<code>" or ""
	//		$matches[2]: the link, ex: dijit/form/Button.set
	//		$matches[3]: .set (ignore this)
	//		$matches[4]:	parameter string like "(a, b)", or ""
	//		$matches[5]: "</code>" or ""

	// the label for the hyperlink should be the original text, but without the <code> wrapper
	$label = $matches[2] . $matches[4];
	$path = $matches[2];

	// try to convert matched string to a hyperlink to another module
	$link = hyperlink($path, $global_docs, $global_base_url, $global_suffix, $label);

	if($link != $matches[2]){
		// replaced <code>foo/bar</code> with <a ...>foo/bar<a>
		return $link;
	}else{
		// hyperlink() didn't do a conversion, so this is probably something else, so don't change it, leave <code>
		return $matches[0];
	}
}
function auto_hyperlink($text, $docs, $base_url, $suffix = ""){
	// summary:
	//		Search summary/description for patterns like dojo/hccss, dijit/Tree.TreeNode, or acme/myfunc(a, b, c),
	//		 and convert to hyperlinks

	// trick to pass additional parameters to callback; server is php 5.2 so can't use anonymous functions/closures, and
	// http://stackoverflow.com/questions/2680982/is-there-a-way-to-pass-another-parameter-in-the-preg-replace-callback-callback-f
	// not working for me either
	global $global_docs, $global_base_url, $global_suffix;
	$global_docs = $docs;
	$global_base_url = $base_url;
	$global_suffix = $suffix;

	// Find likely module references, ex:
	//		dijit/Tree
	//		dijit/Tree.TreeNode
	//		dojo/dom-style.set(a, b)
	// .. or any of the above surrounded by <code>...</code>
	//
	// Regex designed to not include the period ending a sentence, ex:
	//		For more info, see dijit/Tree.
	return preg_replace_callback(
		'&(<code>|)([a-zA-Z0-9]+/[-a-zA-Z0-9_]+([\./][-a-zA-Z0-9_]+)*)(\([^(]*\)|)(</code>|)&',
		"auto_hyperlink_replacer",
		$text
	);
}

function parameter_list($method, $types, $docs, $base_url){
	// summary:
	//		Return list of parameters and types for function, suitable to print inside parens.
	//		Ex: (/*Number*/ a, /*String*/ b)
	//	$method:
	//		Holds info about the function (including it's list of parameters
	//	$types: Boolean
	//		If true, list parameter types and return type


	$params = array();

	if(array_key_exists("parameters", $method) && count($method["parameters"])){
		foreach($method["parameters"] as $param){
			if($types){
				$params[] = '<span class="jsdoc-comment-type">/* '
					. $param["type"]
					. ($param["usage"] == "optional" ? "?":"")
					. ' */</span> '
					. $param["name"];
			}else{
				$params[] = $param["name"];
			}
		}
	}

	$return = "";
	if($types && count($method["return-types"])){
		$returns = array();
		foreach($method["return-types"] as $rt){
			$returns[] = hyperlinks($rt["type"], $docs, $base_url, $suffix);
		}
		$return = '<span class="jsdoc-returns"> returns ' . implode(" | ", $returns) . '</span>';
	}

	return '<span class="parameters">(' . implode(", ", $params) . ')</span>' . $return;
}

function return_details($method, $docs, $base_url, $suffix){
	// summary:
	//		Return HTML listing return types and return description

	$details = "";

	if(count($method["return-types"]) || array_key_exists("return-description", $method)){
		$details .= '<div><strong>Returns:</strong>';

		if(count($method["return-types"])){
			$tmp = array();
			foreach($method["return-types"] as $rt){
				$tmp[] = hyperlinks($rt["type"], $docs, $base_url, $suffix);
			}
			$details .= ' <span class="jsdoc-return-type">' . implode(" | ", $tmp) . '</span>';
		}

		$details .= '</div>';

		if(array_key_exists("return-description", $method)){
			$details .= '<div class="jsdoc-return-description">'
				. auto_hyperlink($method["return-description"], $docs, $base_url)
				. '</div>';
		}
	}

	return $details;
}

//	private functions for pieces
function _generate_property_output($page, $prop, $name, $docs = array(), $base_url = "", $suffix = ""){
	//	create the HTML strings for a single property

	// Property summary section
	$s = '<li class="' . convert_type($prop["type"]) . 'Icon '
		. (isset($prop["visibility"]) ? $prop["visibility"] : 'public') . ' '
		. ($prop["inherited"] ? 'inherited':'')
		. ($prop["extension-module"] ? 'extension-module':'')
		. '">'
		. '<a class="inline-link" href="#' . $name . '">'
		. $name
		. '</a>';

	// Property details section
	$details = '<div class="jsdoc-field '
		. (isset($prop["visibility"]) ? $prop["visibility"] : 'public') . ' '
		. ($prop["inherited"] ? 'inherited':'')
		. ($prop["extension-module"] ? 'extension-module':'')
		. '">'
		. '<div class="jsdoc-title">'
		. '<a name="' . $name . '"></a>'
		. '<span class="' . convert_type($prop["type"]) . 'Icon">'
		. $name
		. '</span>'
		. ($prop["visibility"] == "private" ? " <span class='jsdoc-private' title='private'></span>" : "")
		. '</div>';

	$details .= '<div class="jsdoc-inheritance">Defined by ' . hyperlink($prop["from"], $docs, $base_url, $suffix);
	if($prop["extension-module"]){
		$details .= "<span class='jsdoc-extension' title='Must manually require() " . $prop["from"] . " to access.'></span>";
	}else if($prop["inherited"]){
		$details .= "<span class='jsdoc-inherited' title='inherited'></span>";
	}
 	$details .= '</div>';

	// Normally properties just have a summary, but properties based on an inlined type also have a description which
	// (unlike methods) *supplements* the summary... so display both.
	$description = "";
	if(array_key_exists("summary", $prop)){
		$description .= auto_hyperlink($prop["summary"], $docs, $base_url, $suffix);
	}
	if(array_key_exists("description", $prop)){
		$description .= auto_hyperlink($prop["description"], $docs, $base_url, $suffix);
	}

	// If this property is an object it has its own page
	if($prop["type"] == "object"){
		$description .= '<p>See ' . hyperlink($page . "." . $name, $docs, $base_url, $suffix) . ' for details</p>';
	}

	if(strlen($description)){
		$details .= '<div class="jsdoc-summary">' . $description . '</div>';
	}

	if(array_key_exists("summary", $prop)){
		$s .= ' <span>' . trim_summary($prop["summary"], true) . '</span>';
	}
	$s .= ($prop["visibility"] == "private" ? " <span class='jsdoc-private' title='private'></span>" : "")
		. ($prop["inherited"] ? " <span class='jsdoc-inherited' title='inherited from " . $prop["from"] . "'></span>" : "")
		. ($prop["extension-module"] ? "<span class='jsdoc-extension' title='Must manually require() " . $prop["from"] . " to access.'></span>" : "");
	$s .= '</li>';	//	jsdoc-title

	$details .= '</div>';	//	jsdoc-field

	return array("s"=>$s, "details"=>$details);
}

function _generate_method_output($page, $method, $name, $docs = array(), $base_url = "", $suffix = ""){
	// summary:
	//		Creates and returns the summary and details HTML strings for a single method.

	// is this a constructor (i.e. a nested class)?
	$constructor = $method["constructor"];

	// Method summary section
	$s = '<li class="' . ($constructor ? 'constructorIcon ' : 'functionIcon ')
		. (isset($method["visibility"]) ? $method["visibility"] : 'public') . ' '
		. ($method["inherited"] ? 'inherited':'')
		. ($method["extension-module"] ? 'extension-module':'')
		. '">'
		. '<a class="inline-link" href="#' . $name . '">'
		. $name
		. '</a>'
		. parameter_list($method, false, $docs, $base_url);

	// Method details sections
	$details = '<div class="jsdoc-field '
		. (isset($method["visibility"]) ? $method["visibility"] : 'public') . ' '
		. ($method["inherited"] ? 'inherited':'')
		. ($method["extension-module"] ? 'extension-module':'')
		. '">'
		. '<div class="jsdoc-title">'
		. '<a name="' . $name . '"></a>'
		. '<span class="' . ($constructor ? 'constructorIcon' : 'functionIcon') .'">'
		. $name
		. '</span>'
		. parameter_list($method, false, $docs, $base_url)
		. ($method["visibility"] == "private" ? " <span class='jsdoc-private' title='private'></span>" : "")
		. '</div>';


	//	inheritance list.
	$details .= '<div class="jsdoc-inheritance">Defined by ' . hyperlink($method["from"], $docs, $base_url, $suffix);
	if($method["extension-module"]){
		$details .= "<span class='jsdoc-extension' title='Must manually require() " . $method["from"] . " to access.'></span>";
	}else if($method["inherited"]){
		$details .= "<span class='jsdoc-inherited' title='inherited'></span>";
	}
	$details .= '</div>';

	//	summary and description for details section
	if(array_key_exists("summary", $method)){
		$details .= '<div class="jsdoc-full-summary">'
			. auto_hyperlink($method["summary"], $docs, $base_url, $suffix)
			. "</div>";
	}
	if(array_key_exists("description", $method)){
		$details .= '<div class="jsdoc-full-summary">'
			. auto_hyperlink($method["description"], $docs, $base_url, $suffix)
			. "</div>";
	}

	// summary for overview section
	if(array_key_exists("summary", $method)){
		// Display abbreviated description.   If user has explicitly specified separate summary and description, then use
		// the summary.  If user has only specified a summary, then use it, but trim to first sentence
		$s .=
			' <span>'
			. trim_summary($method["summary"], !array_key_exists("description", $method))
			. '</span>';
	}
	$s .= ($method["visibility"] == "private" ? " <span class='jsdoc-private' title='private'></span>" : "")
		. ($method["inherited"] ? " <span class='jsdoc-inherited' title='inherited from " . $method["from"] ."'></span>" : "")
		. ($method["extension-module"] ? "<span class='jsdoc-extension' title='Must manually require() " . $method["from"] . " to access.'></span>" : "");
	$s .= '</li>';	//	jsdoc-title

	// Parameter details table
	if(count($method["parameters"])){
		$details .= _generate_param_table($method["parameters"], $docs, $base_url, $suffix);
	}

	$details .= return_details($method, $docs, $base_url, $suffix);

	if(array_key_exists("examples", $method)){
		$details .= '<div class="jsdoc-examples">';
		$counter = 1;
		foreach($method["examples"] as $example){
			$details .= '<div class="jsdoc-example">'
				. '<div><strong>Example ' . (count($method["examples"]) > 1 ? $counter++ : "") . '</strong></div>'
				. $example	// auto_hyperlink() too dangerous here?
				. '</div>';
		}
		$details .= '</div>';
	}

	// If this method is a constructor it has its own page
	if($constructor){
		$details .= '<div class="jsdoc-summary">See ' . hyperlink($page . "." . $name, $docs, $base_url, $suffix) . ' for details</div>';
	}

	$details .= '</div>';	//	jsdoc-field

	return array("s"=>$s, "details"=>$details);
}

function _generate_param_table($params, $docs = array(), $base_url = "", $suffix = ""){
	//	create the inline table for parameters; isolated so that nesting may occur on more than one level.
	$tmp_details = array();
	foreach($params as $p){
		$pstr = '<tr>'
			. '<td class="jsdoc-param-name">'
			. $p["name"]
			. '</td>'
			. '<td class="jsdoc-param-type">'
			. hyperlinks($p["type"], $docs, $base_url, $suffix)
			. '</td>'
			. '<td class="jsdoc-param-description">'
			. (strlen($p["usage"]) ? (($p["usage"] == "optional") ? '<div><em>Optional.</em></div>' : (($p["usage"] == "one-or-more") ? '<div><em>One or more can be passed.</em></div>' : '')) : '')
			. auto_hyperlink($p["summary"], $docs, $base_url, $suffix);

			// parameters from inlined types have a description that supplements the summary
			if(strlen($p["description"])){
				$pstr .= "<br/>" . auto_hyperlink($p["description"], $docs, $base_url, $suffix);
			}

		$pstr .= '</td>'
			. '</tr>';
		$tmp_details[] = $pstr;
	}
	return '<table class="jsdoc-parameters">'
		. '<tr>'
		. '<th>Parameter</th>'
		. '<th>Type</th>'
		. '<th>Description</th>'
		. '</tr>'
		. implode('', $tmp_details)
		. '</table>';
}

function _generate_properties_output($page, $properties, $docs = array(), $base_url = "", $suffix = "", $title="Property"){
	//	generate all of the properties output
	$s = '<h2 class="jsdoc-summary-heading">Property Summary <span class="jsdoc-summary-toggle"></span></h2>'
		. '<div class="jsdoc-summary-list">'
		. '<ul class="jsdoc-property-list">';
	$details = '<h2>Properties</h2><div class="jsdoc-property-list">';
	foreach($properties as $name=>$prop){
		$tmp = _generate_property_output($page, $prop, $name, $docs, $base_url, $suffix);
		$s .= $tmp["s"];
		$details .= $tmp["details"];
	}
	$details .= "</div>";	// jsdoc-property-list

	$s .= '</ul></div>';	//	property-summary
	return array("s"=>$s, "details"=>$details);
}

function _generate_methods_output($page, $methods, $docs = array(), $base_url = "", $suffix = "", $title="Method"){
	//	generate all of the methods output
	$s = "";
	$details = "";
	if(count($methods)){
		$s .= '<h2 class="jsdoc-summary-heading">' . $title . ' Summary <span class="jsdoc-summary-toggle"></span></h2>'
			. '<div class="jsdoc-summary-list">'
			. '<ul class="jsdoc-property-list">';
		$details .= '<h2>' . $title . 's</h2><div class="jsdoc-property-list">';
		foreach($methods as $name=>$method){
			if($name == "constructor"){
				// We displayed the constructor already, at the top of the page.
				continue;
			}
			$html = _generate_method_output($page, $method, $name, $docs, $base_url, $suffix);
			$s .= $html["s"];
			$details .= $html["details"];
		}
		$details .= "</div>";	// jsdoc-property-list
		$s .= '</ul></div>';	//	method-summary
	}
	return array("s"=>$s, "details"=>$details);
}

function generate_object_html($page, $version, $base_url = "", $suffix = "", $versioned = true, $docs = array(),
		$refdoc = null){
	//	$page:
	//		The object to render, i.e. "dojox/charting/Chart2D"
	//	$version:
	//		The version against which to generate the page.
	//	$base_url:
	//		A URL fragment that will be prepended to any link generated.
	//	$suffix:
	//		A string that will be appended to any link generated, i.e. ".html"
	//	$docs:
	//		An optional array of XML documents to run the function against.  See spider.php
	//		for example usage.
	//	$refdoc:
	//		Root directory of reference doc, so this page can link to the reference doc.

	if(!isset($page)){
		throw new Exception("generate_object_html: you must pass an object name!");
	}
	if(!isset($version)){
		throw new Exception("generate_object_html: you must pass a version!");
	}

	$data_dir = dirname(__FILE__) . "/../data/" . $version . "/";

	$object = preg_replace("/.*\//", "", $page);		// dijit/form/DateTextBox --> DateTextBox

	//	get the docs to run against.  this can be optionally provided;
	//	if they are they ALL need to be there.
	if(!count($docs)){
		$docs = load_docs($version);
	}

	$xml = $docs["xml"];
	$xpath = $docs["xpath"];

	//	check if we're to build links versioned and if so, add that to the base url.
	if($versioned){
		$base_url .= $version . '/docs/';
	}

	//	get our object
	$obj = generate_object($page, $version, $docs);
	if(!$obj){
        header(":", true, 400);
        header("Content-type: text/plain");
		echo "The requested object was not found.";
		exit();
	}

	//	process it and output us some HTML.
	$s = '<div class="jsdoc-permalink" style="display:none;">' . $base_url . implode("-", explode("/", $page)) . $suffix . '</div>';

	//	page heading.
	$s .= '<h1 class="jsdoc-title ' . convert_type($obj["type"]) . 'Icon36">'
		. $obj["title"]
		. ' <span style="font-size:11px;color:#999;">(version ' . $version . ')</span>'
		. '</h1>';

	//	Mixins, including the true prototypal superclass
	if(array_key_exists("mixins", $obj)){
		$tmp = array();
		foreach($obj["mixins"] as $mixin){
			$tmp[] = hyperlink($mixin, $docs, $base_url, $suffix);
		}
		if(count($tmp)){
			$s .= '<div class="jsdoc-mixins"><label>Extends: </label>'
				. implode(", ", $tmp)
				. '</div>';
		}
	}

	//	summary.
	if(array_key_exists("summary", $obj)){
		$s .= '<div class="jsdoc-full-summary">'
			. auto_hyperlink($obj["summary"], $docs, $base_url, $suffix)
			. "</div>";
	}

	//	description.
	if(array_key_exists("description", $obj)){
		$s .= '<div class="jsdoc-full-summary">'
			. auto_hyperlink($obj["description"], $docs, $base_url, $suffix)
			. "</div>";
	}

	//	usage, if this is a class (ex: dojo/dnd/AutoSource)
	if($obj["type"] == "constructor" && array_key_exists("methods", $obj) && array_key_exists("constructor", $obj["methods"])){
		$fn = $obj["methods"]["constructor"];
		$s .= '<div class="jsdoc-function-information"><h3>Usage:</h3>'
			. '<div class="function-signature">'
			. '<span class="keyword">var</span> foo = new '
			. $object
			. parameter_list($fn, false, $docs, $base_url)
			. ';</div></div>';

		$s .= '<div class="jsdoc-inheritance">Defined by ' . hyperlink($fn["from"], $docs, $base_url, $suffix) . '</div>';
		if(array_key_exists("description", $fn)){
			$s .= '<div class="jsdoc-summary">' . $fn["description"] . '</div>';
		} else if(array_key_exists("summary", $fn)){
			$s .= '<div class="jsdoc-summary">' . $fn["summary"] . '</div>';
		}

		if(count($fn["parameters"])){
			$s .= _generate_param_table($fn["parameters"], $docs, $base_url, $suffix);
		}
	}
	//	usage, if this module returns a top level function (ex: dojo/query, dojo/on)
	if(array_key_exists("topfunc", $obj)){
		$fn = $obj["topfunc"];

		$s .= '<div class="jsdoc-function-information"><h2>Usage</h2>'
			. '<div class="function-signature">'
			. $object
			. parameter_list($fn, false, $docs, $base_url)
			. ';</div></div>';

		// Note: Don't display summary, description, or examples.
		// They are same as for the module itself and we're already printing those

		if(count($fn["parameters"])){
			$s .= _generate_param_table($fn["parameters"], $docs, $base_url, $suffix);
		}

		$s .= return_details($fn, $docs, $base_url, $suffix);
	}
	//	display note for kwargs pseudo-classes that aren't real classes
 	if(preg_match("/^(.*\\.|)__/", $object)){
		$s .= '<p><strong>Note:</strong>'
			. 'This is not a real constructor, but just a description of the type of object that should be passed as'
			. ' a parameter to some method(s), and/or the return value from some method(s).'
			. ' In other words, the type exists only for documentation purposes, and you cannot call new '
			. $object	 . '().'
			. '</p>';
	}

	//	examples.
	if(array_key_exists("examples", $obj)){
		$examples = $obj["examples"];
		if(count($examples)){
			$s .= '<div class="jsdoc-examples">'
				. (count($examples) > 1 ? '<h2>Examples</h2>' : '<h2>Example</h2>');
			$counter = 1;
			foreach($examples as $example){
				$s .= '<div class="jsdoc-example">'
					. (count($examples) > 1 ? '<h3>Example ' . $counter++ . '</h3>' : '')
					. $example		// auto_hyperlink() too dangerous here?
					. '</div>';
			}
			$s .= '</div>';
		}
	}

	//	hyperlink to relevant reference doc page, if one exists
	if($refdoc){
		// Get the module.   Usually the same as $page, except sometimes $page is sub-object, ex: dijit/Tree._TreeNode.
		$module = preg_replace("/\\..*/", "", $page);

		// Compute base path to possible module reference doc (ex: dijit/Tree --> 1.8/dijit/Tree.html)
		$path = $version . "/" . $module . $refdoc["suffix"];

		if(!file_exists($refdoc["dir"] . $path) && count(explode("/", $path)) >= 3){
			// Apparently no reference doc for this module, but let's go up a level; ex: since there's no
			// dojox/charting/Chart.html page, try dojox/charting.html
			$module = preg_replace("/\/[^\/]+$/", "", $module);
			$path = $version . "/" . $module . $refdoc["suffix"];	// same as above
		}

		if(file_exists($refdoc["dir"] . $path)){
			// If there's a reference doc file for $module, then insert a link
			$url = $refdoc["url"] . $path;
			$s .= "<p>See the <a href='$url' target='_blank'>$module reference documentation</a> for more information.</p>";
		}
	}

	//	Properties, methods, events
	$s .= '<div class="jsdoc-children">';
	$s .= '<div class="jsdoc-field-list">';
	$details = '<div class="jsdoc-children">'
		. '<div class="jsdoc-fields">';

	$props = $obj["properties"];
	$methods = $obj["methods"];
	$events = $obj["events"];
	if(count($props) || count($methods) || count($events)){
		if(count($props)){
			$tmp = _generate_properties_output($page, $props, $docs, $base_url, $suffix, "Properties");
			$s .= $tmp["s"];
			$details .= $tmp["details"];
		}
		if(count($methods)){
			$tmp = _generate_methods_output($page, $methods, $docs, $base_url, $suffix, "Method");
			$s .= $tmp["s"];
			$details .= $tmp["details"];
		}
		if(count($events)){
			$tmp = _generate_methods_output($page, $events, $docs, $base_url, $suffix, "Event");
			$s .= $tmp["s"];
			$details .= $tmp["details"];
		}
	}

	$s .= '</div>';	// jsdoc-field-list.
	$s .= '</div>';	// jsdoc-children.
	$details .= '</div></div>';

	return $s . $details;
}

///////////////////////////////////////////////////////////////////////////////
// Old functions to generate static tree of objects
///////////////////////////////////////////////////////////////////////////////

//	sorting functions used for the tree
function object_node_sorter($a, $b){
	if($a->getAttribute("location") == $b->getAttribute("location")){ return 0; }
	return ($a->getAttribute("location") > $b->getAttribute("location")) ? 1 : -1;
}

function node_reference_sorter($a, $b){
	if(strtolower($a["_reference"]) == strtolower($b["_reference"])) return 0;
	return (strtolower($a["_reference"]) > strtolower($b["_reference"])) ? 1 : -1;
}

//	generate a hierarchical representation of the object tree; based on the class-tree.
//	Note that this structure is generated based on the structure of dojo.data.
function generate_object_tree($version, $roots=array(), $filter=true, $docs=array()){
	//	$version:
	//		The version of the object tree to generate.
	//	$roots:
	//		The objects to be considered the root nodes of the list generated.  If empty,
	//		this will simply look for any objects that do not have a period in the name.
	//	$filter:
	//		A boolean that filters out anything that is considered "private" (i.e. beginning with
	//		an underscore "_")
	//	$docs:
	//		An optional array of XML document objects that will be used as the sources for the tree.

	//	get our source.
	if(!count($docs)){
		$data_dir = dirname(__FILE__) . "/../data/" . $version . "/";
		$f = $data_dir . "objects.xml";
		if(!file_exists($f)){
			throw new Exception("generate_object_tree_html: the required directory/file was not found.");
		}

		$xml = new DOMDocument();
		$xml->load($f);
		$xpath = new DOMXPath($xml);
	} else {
		$xml = $docs["xml"];
		$xpath = $docs["xpath"];
	}

	$objects = $xpath->query("//object");
	$ret = array();
	$counter = 0;

	//	set our top-level objects
	$show = array();
	$keys = array();
	if(count($roots)){
		//	we were given a specific set of root locations.
		foreach($roots as $key=>$value){
			$show[$key] = $value;
			$keys[] = $key;
		}
	} else {
		$r = $xpath->query("//object[not(contains(@location, '.'))]");
		foreach($r as $node){
			if($node->getAttribute("type") == "Function" && $node->getAttribute("classlike") == "true"){
				$show[$node->getAttribute("location")] = -1;
				$keys[] = $node->getAttribute("location");
			}
		}
	}

	//	ok, let's create our internal structure.
	foreach($objects as $node){
		$name = $node->getAttribute("location");
		$type = $node->getAttribute("type");
		$classlike = $node->getAttribute("classlike");

		$name_parts = explode(".", $name);
		$short_name = array_pop($name_parts);

		if ($type=="Function" && $classlike=="true") {
			$val = array(
				"id"=>$name,  /* "object-" . $counter++, */
				"name"=>$short_name,
				"fullname"=>$name,
				"type"=>"constructor"
			);
		} else {
			$val = array(
				"id"=>$name,  /* "object-" . $counter++, */
				"name"=>$short_name,
				"fullname"=>$name,
				"type"=>(strlen($type) ? strtolower($type): "object")
			);
		}

		if(isset($val)){
			if($filter && strpos($short_name, "_") === 0){
				unset($val);
				continue;
			}
			if(count($name_parts)){
				$finder = implode(".", $name_parts);
				foreach($ret as &$obj){
					if($obj["fullname"] == $finder){
						if(!array_key_exists("children", $obj)){
							$obj["children"] = array();
						}
						$obj["children"][] = array(
							"_reference"=>$val["id"]
						);
					//	$obj["type"] = "namespace";
						break;
					}
				}
			}
			$ret[] = $val;
			unset($val);
		}
	}

	//	go through the top-level objects and reset the type on it.
	$counter = 0;
	foreach($ret as &$obj){
		$name = $obj["fullname"];
		if(array_key_exists($name, $show)){
			$obj["type"] = "root";
			$show[$name] = $counter;
		}
		$counter++;
	}

	//	finally, move the given namespaces to the top of the array.
	$fin = array();
	foreach($show as $item){
		if(array_key_exists("children", $ret[$item])){
			usort($ret[$item]["children"], "node_reference_sorter");
		}
		$fin[] = &$ret[$item];
	}
	foreach($ret as &$obj){
		if(!array_key_exists($obj["fullname"], $show)){
			if(array_key_exists("children", $obj)){
				usort($obj["children"], "node_reference_sorter");
			}
			$fin[] = $obj;
		}
	}

	return $fin;
}

function _get_branch($obj, $root){
	//	given the object generated by the tree, find all objects that are referenced as children
	//	and return an array.  Note that you should pass both params by reference (i.e. &$myTree)
	//
	//	$obj
	//		The actual tree object to be used for lookup.
	//	$root
	//		The parent object to use for getting children.

	$ret = array();
	foreach($root["children"] as $child){
		foreach($obj as $object){
			if($object["id"] == $child["_reference"]){
				$ret[] = $object;
				break;
			}
		}
	}
	return $ret;
}

function _generate_branch_html($tree, $obj, $base_url = "", $suffix = ""){
	//	recursive private function to "listify" the given branch.
	$s = '<li class="' . ($obj["type"]=="root"?"namespace":$obj["type"]) . 'Icon">'
		. '<a class="jsdoc-link" href="' . $base_url . implode("-", explode("/", $obj["fullname"])) . $suffix . '">'
		. $obj["name"]
		. '</a>';
	if(array_key_exists("children", $obj)){
		$s .= "\n". '<ul class="jsdoc-children">';
		$branch = _get_branch($tree, $obj);
		foreach($branch as $child){
			$s .= _generate_branch_html($tree, $child, $base_url, $suffix);
		}
		$s .= '</ul>' . "\n";
	}
	return $s . '</li>' . "\n";
}

function generate_object_tree_html($tree, $root, $base_url = "", $suffix = ""){
	//	summary:
	//		Given an object tree (such as generated above), create an HTML
	//		version, complete with links.
	//	$tree:
	//		The array structure as given from above.
	//	$root:
	//		The string indicating what root object to use for branching.
	//	$base_url:
	//		A string prepended to any links generated.
	//	$suffix:
	//		A string appended to any links generated.
	if(!isset($tree)){
		throw new Exception("generate_object_tree_html: you must pass in an object tree.");
	}

	//	find the root object in the tree.
	$roots = array();
	foreach($tree as $object){
		if($object["type"] == "root"){
			$roots[] = $object;
		}
	}

	//	let's give it a start.
	$s = '<ul class="jsdoc-navigation">' . "\n";
	foreach($roots as $r){
		if($r["id"] == $root){
			$s .= _generate_branch_html($tree, $r, $base_url, $suffix);
		} else {
			$s .= '<li class="namespaceIcon">'
				. '<a class="jsdoc-link" href="' . $base_url . implode("-", explode("/", $r["fullname"])) . $suffix . '">'
				. $r["name"]
				. '</a>'
				. '</li>' . "\n";
		}
	}

	$s .= '</ul>' . "\n";
	return $s;
}

?>
