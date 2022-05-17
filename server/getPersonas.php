<?php

header('Content-Type: application/json');
include('db.php');

$resulted = array();

if ($stmt = $con->prepare('SELECT persona.id, persona.snils, persona.lastname, persona.firstname, persona.middlename, COUNT(suspnds.RECORD_UQ) as count FROM suspnds INNER JOIN persona ON persona.id = suspnds.PERSONA_ID GROUP BY suspnds.PERSONA_ID')) {
	$stmt->execute();
	$row = $stmt->get_result();
	while ($arr = $row->fetch_assoc()) {
		array_push($resulted, $arr);
	}
	$json = json_encode($resulted, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE );
	
	echo($json);

	$stmt->close();
}