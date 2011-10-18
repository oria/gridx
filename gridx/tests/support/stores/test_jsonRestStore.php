<?php
	require_once('FirePHPCore/fb.php');  
	ob_start(); 

	header("Content-Type: " . ($_SERVER["CONTENT_TYPE"] == 'application/json' ? 'application/json' : 'text/plain'));

	$store = new JsonRestStore();
	switch ($_SERVER["REQUEST_METHOD"]) {
		case "GET":
//            fb($_REQUEST, 'GET');
			echo $store->get();
			break;
		case "PUT":
//            fb($_REQUEST, 'PUT');
			$store->put();
			break;
		case "DELETE":
//            fb($_REQUEST, 'DELETE');
			$store->delete();
			break;
		case "POST":
//            fb($_REQUEST, 'POST');
			$fh = fopen('test_jsonRestStore.txt', 'w');
			if(array_key_exists('totalsize', $_REQUEST)){
				fwrite($fh, (int)$_REQUEST['totalsize']."\r\n");
			}
			fclose($fh);
			break;
	}


class JsonRestStore{
	public $totalCount = 100;

	public $jsonArray = array(
		"identifier"=>"id",
	);

	function __construct(){
		$fh = fopen('test_jsonRestStore.txt', 'r');
		$str = fgets($fh);
		if($str){
			$this->totalCount = (int)$str;
		}
		fclose($fh);
	}

	//PipeLine----------------------------------------------------------------------------
	private $str = "abcd efgh ijkl mnop qrst uvwx yz12 3456 7890";

	private function randomString(){
		$len = rand(1, 200);
		$sb = array();
		for($i = 0; $i < $len; ++$i){
			$sb[] = $this->str[rand(0, strlen($this->str) - 1)];
		}
		return implode($sb);
	}

	private function getRow($index){
		return array(
			"id" => $index + 1,
			"number" => ($this->totalCount - $index),
			"string" => $this->randomString()
		);
	}

	private function getItems(){
		$items = array();
		for($i = 0; $i < $this->totalCount; ++$i){
			$items[] = $this->getRow($i);
		}
//        fb($items, 'getItems');
//        fb(count($items), 'getItems');
		return $items;
	}

	private function query($items){
		$keys = array_keys($items[0]);
		$querys = array();
		foreach($keys as $key){
			if(array_key_exists($key, $_REQUEST)){
				$q = $_REQUEST[$key];
				if (strlen($q) && $q[strlen($q)-1]=="*") {
					$q = substr($q, 0, strlen($q)-1);
				}
				$querys[$key] = $q;
			}
		}
		if(count($querys)){
			$ret = array();
			foreach ($items as $item) {
				if($this->match($item, $querys)){
					$ret[] = $item;
				}
			}
			$items = $ret;
		}
//        fb($items, 'query');
//        fb(count($items), 'query');
		return $items;
	}

	private function patch($items){
		$fh = fopen('test_jsonRestStore.txt', 'r');
		while(!feof($fh)){
			$str = fgets($fh);
			$record = explode(' ', $str, 3);
			
			if($record[0] == '+'){
				$obj = json_decode($record[2]);
				for($i = 0; $i < count($items); ++$i){
					if($items[$i]['id'] == $record[1]){
						foreach($obj as $key => $value){
							$items[$i][$key] = $value;
						}
						break;
					}
				}
				if($i == count($items)){
					$newItem = array();
					foreach($obj as $key => $value){
						$newItem[$key] = $value;
					}
					$items[] = $newItem;
				}
			}else if($record[0] == '-'){
				for($i = 0; $i < count($items); ++$i){
					if($items[$i]['id'] == $record[1]){
						array_splice($items, $i, 1);
						break;
					}
				}
			}
		}
		fclose($fh);
//        fb($items, 'patch');
//        fb(count($items), 'patch');
		return $items;
	}

	private function sort($items){
		$query = $_SERVER['QUERY_STRING'];
		$idx = strpos($query, 'sort(');
		if($idx !== false){
			$query = substr($query, $idx + 5);
			$idx = strpos($query, ')');
			if($idx !== false){
				$query = substr($query, 0, $idx);
				$attrs = explode(',', $query);
				foreach($attrs as $attr){
					$toSort = array();
					$desc = substr($attr, 0, 1) == '-';
					if(substr($attr, 0, 1) == '-' || substr($attr, 0, 1) == '+'){
						$attr = substr($attr, 1);
					}
					foreach ($items as $i) $toSort[$i[$attr]] = $i;
					if($desc){
						krsort($toSort);
					}else{
						ksort($toSort);
					}
					$newRet = array();
					foreach ($toSort as $i) $newRet[] = $i;
					$items = $newRet;
				}
			}
		}
//        fb($items, 'sort');
//        fb(count($items), 'sort');
		return $items;
	}

	private function slice($items){
		if(array_key_exists("HTTP_RANGE", $_SERVER)){
			$range = $_SERVER["HTTP_RANGE"];
			$range = substr($range, 6);
			$range = explode('-', $range);
			$start = (int)$range[0];
			$end = (int)$range[1];
			$items = array_slice($items, $start);
			if($end > 0){
				$items = array_slice($items, 0, $end + 1);
			}
		}
//        fb($items, 'slice');
//        fb(count($items), 'slice');
		return $items;
	}

	public function addTotalCount($items){
		header("Content-Range: /".count($items));
		return $items;
	}


	//Public-------------------------------------------------------------------------------
	public function get(){
		return json_encode($this->slice($this->addTotalCount($this->sort($this->query($this->patch($this->getItems()))))));
	}

	public function put(){
		$id = $_SERVER['PATH_INFO'];
		$id = substr($id, 1);
		$contents = file_get_contents('php://input');
		$fh = fopen('test_jsonRestStore.txt', 'a');
		fwrite($fh, '+ '.$id.' '.$contents."\r\n");
		fclose($fh);
//        fb($contents, 'put item');
	}

	public function delete(){
		$id = $_SERVER['PATH_INFO'];
//        fb($_SERVER, 'delete item');
		$id = substr($id, 1);
		$fh = fopen('test_jsonRestStore.txt', 'a');
		fwrite($fh, '- '.$id."\r\n");
		fclose($fh);
	}

	//Util------------------------------------------------------------------------
	public function match($item, $querys){
		foreach(array_keys($querys) as $key){
			if($querys[$key] && strpos(strtolower($item[$key]), strtolower($querys[$key])) === false){
				return false;
			}
		}
		return true;
	}
}

?>
