<?php

error_reporting(E_ALL & ~E_DEPRECATED);
include 'SimpleXLS.php';

if(!empty($_FILES['myFile']['name'])) {
	$target_dir = 'uploads/';
	if (!file_exists($target_dir)) {
		mkdir($target_dir, 0777);
	}

	$errors = array();
	$fileName = $_FILES['myFile']['name'];
	$fileSize = $_FILES['myFile']['size'];
	$fileTMP = $_FILES['myFile']['tmp_name'];
	$fileType = $_FILES['myFile']['type'];
	$fileExt = substr($fileName, -3);

	if ($fileExt != 'xls') {
		exit('0');
	}

	if ($fileSize > 10485760) {
		exit('1');
	}

	$target_file = $target_dir.basename($fileName);
	move_uploaded_file($_FILES['myFile']['tmp_name'], $target_file);

	if ( $xls = SimpleXLS::parse($target_file)) {
		$arr = $xls->rows();
		$len = sizeof($arr);
	    $keys = array();
	    $parsed = array();
	    foreach ($arr as $lino => $line) {
	    	if ($lino === 0) {
	    		$keys = $line;
	    	}else {
		    	$current = array();
		    	foreach ($line as $fragno => $value) {
		    		$current[$keys[$fragno]] = $value;
		    	}
		    	$parsed[] = $current;
		    }
	    }
		$json = json_encode($parsed, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
	    printf( $json );
	} else {
	    echo SimpleXLS::parseError();
	}
}


?>