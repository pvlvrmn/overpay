<?php

header('Content-Type: application/json');
error_reporting(~E_ALL);
include('db.php');

$inp = file_get_contents('php://input');
$index = (int)$inp;

if ($stmt = $con->prepare('SELECT * FROM persona WHERE persona.id = ?')) {
	$stmt->bind_param('d', $index);
	$stmt->execute();
	$row = $stmt->get_result();
	$row_r = $row->fetch_assoc();


	if (strtotime($row_r['created_time']) < strtotime('01.01.1980')) {
		$row_r['created_time'] = '';
	} else {
		$row_r['created_time'] = date('d.m.Y в h:i:s', strtotime($row_r['created_time']));
	}

	if (strtotime($row_r['edited_time'])  < strtotime('01.01.1980')) {
		$row_r['edited_time'] = '';
	} else {
		$row_r['edited_time'] = date('d.m.Y в h:i:s', strtotime($row_r['edited_time']));
	}

	$res = json_encode($row_r, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
	
	
	echo($res);

	$stmt->close();
}