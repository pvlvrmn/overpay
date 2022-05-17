<?php

header('Content-Type: application/json');
include('db.php');

$data = json_decode(file_get_contents('php://input'), true);

if ($stmt = $con->prepare('UPDATE persona SET snils=?, lastname=?, firstname=?, middlename=?, edited_ip=?, edited_time=? WHERE persona.id = ?')) {
	$date = date('Y-m-d H:i:s');
	$stmt->bind_param('ssssssd', $data['snils'], $data['lastname'], $data['firstname'], $data['middlename'], $_SERVER['REMOTE_ADDR'], $date, $data['id']);
	$stmt->execute();
	$row = $stmt->get_result();

	echo $row;

	$stmt->close();
}