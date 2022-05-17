<?php

header('Content-Type: application/json');
include('db.php');
include('getWorkingDays.php');

$inp = file_get_contents('php://input');
$fil = (int)$inp;

if ($fil == '0200') {
	$filText = 'fil IS NOT NULL';
} else {
	$filText = ' fil = '.$fil;
}

$resultedArray = array();

// всего записей
if ($stmt = $con->prepare('SELECT COUNT(*) as `num` FROM suspnds WHERE '.$filText)) {
	$stmt->execute();
	$row = $stmt->get_result();
	$res = $row->fetch_assoc();
	
	$resultedArray['RO']['full'] = $res['num'];

	$stmt->close();
}

if ($stmt = $con->prepare('SELECT COUNT(*) as `num` FROM suspnds WHERE status = 0 AND '.$filText)) {
	$stmt->execute();
	$row = $stmt->get_result();
	$res = $row->fetch_assoc();
	
	$resultedArray['RO']['created'] = $res['num'];

	$stmt->close();
}

if ($stmt = $con->prepare('SELECT COUNT(*) as `num` FROM suspnds WHERE status = 1 AND '.$filText)) {
	$stmt->execute();
	$row = $stmt->get_result();
	$res = $row->fetch_assoc();
	
	$resultedArray['RO']['waiting_letter'] = $res['num'];

	$stmt->close();
}

if ($stmt = $con->prepare('SELECT COUNT(*) as `num` FROM suspnds WHERE status = 2 AND '.$filText)) {
	$stmt->execute();
	$row = $stmt->get_result();
	$res = $row->fetch_assoc();
	
	$resultedArray['RO']['overdue_letter'] = $res['num'];

	$stmt->close();
}

if ($stmt = $con->prepare('SELECT COUNT(*) as `num` FROM suspnds WHERE status = 3 AND '.$filText)) {
	$stmt->execute();
	$row = $stmt->get_result();
	$res = $row->fetch_assoc();
	
	$resultedArray['RO']['waiting_refund'] = $res['num'];

	$stmt->close();
}

if ($stmt = $con->prepare('SELECT COUNT(*) as `num` FROM suspnds WHERE status = 4 AND '.$filText)) {
	$stmt->execute();
	$row = $stmt->get_result();
	$res = $row->fetch_assoc();
	
	$resultedArray['RO']['waiting_on'] = $res['num'];

	$stmt->close();
}

if ($stmt = $con->prepare('SELECT COUNT(*) as `num` FROM suspnds WHERE status = 5 AND '.$filText)) {
	$stmt->execute();
	$row = $stmt->get_result();
	$res = $row->fetch_assoc();
	
	$resultedArray['RO']['waiting_po'] = $res['num'];

	$stmt->close();
}

if ($stmt = $con->prepare('SELECT COUNT(*) as `num` FROM suspnds WHERE status = 6 AND '.$filText)) {
	$stmt->execute();
	$row = $stmt->get_result();
	$res = $row->fetch_assoc();
	
	$resultedArray['RO']['waiting_kp'] = $res['num'];

	$stmt->close();
}

if ($stmt = $con->prepare('SELECT COUNT(*) as `num` FROM suspnds WHERE status = 7 AND '.$filText)) {
	$stmt->execute();
	$row = $stmt->get_result();
	$res = $row->fetch_assoc();
	
	$resultedArray['RO']['docs_sent'] = $res['num'];

	$stmt->close();
}

if ($stmt = $con->prepare('SELECT COUNT(*) as `num` FROM suspnds WHERE status = 8 AND '.$filText)) {
	$stmt->execute();
	$row = $stmt->get_result();
	$res = $row->fetch_assoc();
	
	$resultedArray['RO']['appoint_kp'] = $res['num'];

	$stmt->close();
}

if ($stmt = $con->prepare('SELECT COUNT(*) as `num` FROM suspnds WHERE status = 9 AND '.$filText)) {
	$stmt->execute();
	$row = $stmt->get_result();
	$res = $row->fetch_assoc();
	
	$resultedArray['RO']['overdue_docs'] = $res['num'];

	$stmt->close();
}

if ($stmt = $con->prepare('SELECT COUNT(*) as `num` FROM suspnds WHERE status = 10 AND '.$filText)) {
	$stmt->execute();
	$row = $stmt->get_result();
	$res = $row->fetch_assoc();
	
	$resultedArray['RO']['done'] = $res['num'];

	$stmt->close();
}

if ($stmt = $con->prepare('SELECT COUNT(*) as `num` FROM suspnds WHERE status = 11 AND '.$filText)) {
	$stmt->execute();
	$row = $stmt->get_result();
	$res = $row->fetch_assoc();
	
	$resultedArray['RO']['warning'] = $res['num'];

	$stmt->close();
}

$json = json_encode($resultedArray, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE );
echo($json);