<?php

header('Content-Type: application/json');
include('db.php');

$inp = file_get_contents('php://input');
$index = (int)$inp;

if ($stmt = $con->prepare('SELECT suspnds.RECORD_UQ, suspnds.fil, persona.id, persona.snils, persona.lastname, persona.firstname, persona.middlename, suspnds.SUM_TO_PAY, suspnds.SUM_PAYED, suspnds.ORDER_NUM, suspnds.ORDER_DATE, suspnds.ALCE_TYPE, suspnds.LETTER_DATE, suspnds.LETTER_NUM, suspnds.SUM_PAYED_DATE, suspnds.RECEIPT_INFO, suspnds.NOTE, suspnds.DOCS_ON_DATE, suspnds.DOCS_PO_DATE, suspnds.NDFL, suspnds.YEAR, suspnds.ACCOUNT_TYPE, suspnds.IS_CAMERAL, suspnds.status FROM suspnds INNER JOIN persona ON suspnds.PERSONA_ID=persona.id WHERE suspnds.RECORD_UQ = ?')) {
	$stmt->bind_param('d', $index);
	$stmt->execute();
	$row = $stmt->get_result();
	$res = json_encode($row->fetch_assoc(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
	
	
	echo($res);

	$stmt->close();
}