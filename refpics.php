<!DOCTYPE html> 
<html>
<head>
	<title>Gridx Reference Snapshots</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<style type="text/css">
		body {
			background-color: #555;
		}
		.main {
			max-width: 1024px;
			margin: 20px auto;
			padding: 20px;
			background-color: #fff;
			border-radius: 20px;
			box-shadow: 5px 5px 3px #000;
		}
		.testsuite {
			background-color: #ddd;
			padding: 10px 10px 2px 10px;
			border-radius: 10px;
			margin-bottom: 10px;
			position: relative;
		}
		.testcase {
			background-color: #aaa;
			padding: 10px 10px 2px 10px;
			border-radius: 10px;
			margin-bottom: 10px;
			position: relative;
		}
		.testcaseImageSet {
			background-color: #888;
			padding: 10px 10px 2px 10px;
			border-radius: 10px;
			margin-bottom: 10px;
			position: relative;
		}
		.index {
			display: block;
			position: absolute;
			width: 20px;
			height: 20px;
			border-radius: 10px;
			background-color: #af0;
			text-align: center;
			top: -5px;
			left: -5px;
			cursor: pointer;
		}
		.title {
			display: inline-block;
			margin-left: 15px;
		}
		.testcaseImage {
			display: inline-block;
			padding: 5px 10px;
			position: relative;
		}
		.testcaseImage img {
			height: 150px;
		}
		.deleteRef {
			position: absolute;
			display: none;
			right: 0px;
			top: 15px;
			width: 20px;
			height: 20px;
			border-radius: 10px;
			cursor: pointer;
			background-color: #e00;
			text-align: center;
		}
		.testcaseImage:hover .deleteRef {
			display: block;
		}
	</style>
	<script type="text/javascript">
		function deleteRef(imgFilePath){
			console.log(imgFilePath);
		}
	</script>
</head>
<body>
<div class="main">
<?php
function getFileList($directory){
	$files = array();
	if(is_dir($directory)){
		if($files = scandir($directory)){
			$files = array_slice($files, 2);
		}
	}
	return $files;
}
function getData(){
	$dict = array();
	$dir = dirname(__FILE__)."\\refs";
	$browsers = getFileList($dir);
	foreach($browsers as $browser){
		$browserDir = $dir."\\".$browser;
		$images = getFileList($browserDir);
		foreach($images as $img){
			if(preg_match('/\.png$/', $img)){
				$imgPath = implode('/', array("refs", $browser, $img));
				$imgArr = explode('~', substr($img, 0, -4));
				if(!array_key_exists($imgArr[0], $dict)){
					$dict[$imgArr[0]] = array();
				}
				if(!array_key_exists($imgArr[1], $dict[$imgArr[0]])){
					$dict[$imgArr[0]][$imgArr[1]] = array();
				}
				$name = count($imgArr) > 2 ? $imgArr[2] : "main";
				if(!array_key_exists($name, $dict[$imgArr[0]][$imgArr[1]])){
					$dict[$imgArr[0]][$imgArr[1]][$name] = array();
				}
				$dict[$imgArr[0]][$imgArr[1]][$name][$browser] = array(
					'path' => $imgPath,
					'file' => $browserDir."\\".$img
				);
			}
		}
	}
	return $dict;
}
function getHTML($dict){
	$str = "";
	$i = 1;
	foreach($dict as $testsuite => $test){
		$str = $str."<div class='testsuite'><span class='index'>".$i.
			"</span><span class='title'>".$testsuite."</span><div class='testcases'>";
		$j = 1;
		foreach($test as $testcase => $imageSets){
			$str = $str."<div class='testcase'><span class='index'>".$j.
				"</span><span class='title'>".$testcase."</span><div class='testcaseImageSets'>";
			$k = 1;
			foreach($imageSets as $imageSetName => $imageSet){
				$str = $str."<div class='testcaseImageSet'><span class='index'>".$k.
					"</span><span class='title'>".$imageSetName."</span><div class='testcaseImages'>";
				foreach($imageSet as $browser => $imgInfo){
					$str = $str."<span class='testcaseImage'><span class='deleteRef' onclick='deleteRef(\"".
						$imgInfo["file"].
						"\")'></span><span class='browserName'>".
						$browser."</span><br/><a href='".$imgInfo["path"]."' target='_blank'><img src='".$imgInfo["path"].
						"'/></a></span>";
				}
				$str = $str."</div></div>";
				$k++;
			}
			$str = $str."</div></div>";
			$j++;
		}
		$str = $str."</div></div>";
		$i++;
	}
	$str = $str."</div></div>";
	return $str;
}

echo getHTML(getData());
?>
</div>
</body>
</html>

