<?php

header('Content-Type: application/json');
include('db.php');

$inp = file_get_contents('php://input');
$token = $inp;

$resultedArray = array();

// всего записей
if ($stmt = $con->prepare('SELECT * FROM loginactivity WHERE token = ?')) {
	$stmt->bind_param('s', $token);
	$stmt->execute();
	$row = $stmt->get_result();
	$res = $row->fetch_assoc();
	$stmt->close();

	if (strtotime(date('Y-m-d h:i:s')) - strtotime($res['time']) > 86400) {
		$resultedArray['active'] = false;
	} else {

		if ($stmtUser = $con->prepare('SELECT * FROM users WHERE id = ?')) {
			$stmtUser->bind_param('d', $res['userid']);
			$stmtUser->execute();
			$rowUser = $stmtUser->get_result();
			$resUser = $rowUser->fetch_assoc();
			$stmtUser->close();
		}

		$resultedArray['active'] = true;
		$resultedArray['uid'] = $res['userid'];
		$resultedArray['displayname'] = $resUser['displayname'];
		$resultedArray['fil'] = $resUser['fil'];
		$resultedArray['role'] = $resUser['role'];
	}
	
	$json = json_encode($resultedArray, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE );
	echo($json);
	exit();
}