<?php

header('Content-Type: application/json');
include('db.php');
$resulted = array();

$inp = file_get_contents('php://input');
$index = (int)$inp;

if ($stmt = $con->prepare('SELECT * FROM suspnds WHERE suspnds.PERSONA_ID = ?')) {
	$stmt->bind_param('d', $index);
	$stmt->execute();
	$row = $stmt->get_result();

	while ($arr = $row->fetch_assoc()) {
		switch ($arr['ALCE_TYPE']) {
			case '1':
				$arr['ALCE_TYPE'] = '01-В/Н';
				break;
			case '2':
				$arr['ALCE_TYPE'] = '02-Б/Р';
				break;
			case '3':
				$arr['ALCE_TYPE'] = '03-Р/С';
				break;
			case '4':
				$arr['ALCE_TYPE'] = '04-Р/Р';
				break;
			case '5':
				$arr['ALCE_TYPE'] = '05-У/Р';
				break;
			case '9':
				$arr['ALCE_TYPE'] = '09-О/Л';
				break;
			case '98':
				$arr['ALCE_TYPE'] = '98-С/В';
				break;
			case '99':
				$arr['ALCE_TYPE'] = '99-С/В';
				break;
		}
		$arr['SUM_TO_PAY'] = (float)$arr['SUM_TO_PAY'];
		$arr['SUM_PAYED'] = (float)$arr['SUM_PAYED'];
		$arr['NDFL'] = (float)$arr['NDFL'];
		array_push($resulted, $arr);
	}
	
	$json = json_encode($resulted, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE );
	
	
	echo($json);

	$stmt->close();
}