<?php

header('Content-Type: application/json');
error_reporting(~E_ALL);
include('db.php');

$data = json_decode(file_get_contents('php://input'), true);

$param = $data['type'];

if ($data['fil'] == '200') {
	$filText = 'AND suspnds.fil IS NOT NULL';
} else {
	$filText = 'AND suspnds.fil = "'.$data['fil'].'"';
}

$resulted = array();

if ($param == 'full') {
	$where = 'WHERE status IS NOT NULL';
} elseif ($param == 'created') {
	$where = 'WHERE status = 0';
} elseif ($param == 'waiting_letter') {
	$where = 'WHERE status = 1';
} elseif ($param == 'overdue_letter') {
	$where = 'WHERE status = 2';
} elseif ($param == 'waiting_refund') {
	$where = 'WHERE status = 3';
} elseif ($param == 'waiting_on') {
	$where = 'WHERE status = 4';
} elseif ($param == 'waiting_po') {
	$where = 'WHERE status = 5';
} elseif ($param == 'waiting_kp') {
	$where = 'WHERE status = 6';
} elseif ($param == 'docs_sent') {
	$where = 'WHERE status = 7';
} elseif ($param == 'appoint_kp') {
	$where = 'WHERE status = 8';
} elseif ($param == 'overdue_docs') {
	$where = 'WHERE status = 9';
} elseif ($param == 'done') {
	$where = 'WHERE status = 10';
} elseif ($param == 'warning') {
	$where = 'WHERE status = 11';
}

if ($stmt = $con->prepare('SELECT suspnds.RECORD_UQ, suspnds.fil, persona.snils, CONCAT(persona.lastname, " ", persona.firstname, " ", persona.middlename) AS name, suspnds.SUM_TO_PAY, suspnds.SUM_PAYED, suspnds.ORDER_NUM, suspnds.ORDER_DATE, suspnds.ALCE_TYPE, suspnds.LETTER_DATE, suspnds.LETTER_NUM, suspnds.SUM_PAYED_DATE, suspnds.RECEIPT_INFO, suspnds.NOTE, suspnds.DOCS_ON_DATE, suspnds.DOCS_PO_DATE, suspnds.NDFL, suspnds.YEAR, suspnds.ACCOUNT_TYPE, suspnds.IS_CAMERAL FROM suspnds INNER JOIN persona ON suspnds.PERSONA_ID=persona.id '.$where.' '.$filText)) {
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

		if (strtotime($arr['ORDER_DATE']) < strtotime('01.01.1980')) {
			$arr['ORDER_DATE'] = '';
		} else {
			$arr['ORDER_DATE'] = date('d.m.Y', strtotime($arr['ORDER_DATE']));
		}

		if (strtotime($arr['LETTER_DATE']) < strtotime('01.01.1980')) {
			$arr['LETTER_DATE'] = '';
		} else {
			$arr['LETTER_DATE'] = date('d.m.Y', strtotime($arr['LETTER_DATE']));
		}

		if (strtotime($arr['SUM_PAYED_DATE']) < strtotime('01.01.1980')) {
			$arr['SUM_PAYED_DATE'] = '';
		} else {
			$arr['SUM_PAYED_DATE'] = date('d.m.Y', strtotime($arr['SUM_PAYED_DATE']));
		}

		if (strtotime($arr['DOCS_ON_DATE']) < strtotime('01.01.1980')) {
			$arr['DOCS_ON_DATE'] = '';
		} else {
			$arr['DOCS_ON_DATE'] = date('d.m.Y', strtotime($arr['DOCS_ON_DATE']));
		}

		if (strtotime($arr['DOCS_PO_DATE']) < strtotime('01.01.1980')) {
			$arr['DOCS_PO_DATE'] = '';
		} else {
			$arr['DOCS_PO_DATE'] = date('d.m.Y', strtotime($arr['DOCS_PO_DATE']));
		}
		array_push($resulted, $arr);
	}
	$json = json_encode($resulted, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE );
	
	echo($json);

	$stmt->close();
}