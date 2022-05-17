<?php

header('Content-Type: application/json');
include('db.php');

$data = json_decode(file_get_contents('php://input'), true);

if ($stmt = $con->prepare('UPDATE `suspnds` SET `SUM_TO_PAY` = ?, `SUM_PAYED` = ?, `ORDER_NUM` = ?, `ORDER_DATE` = ?, `ALCE_TYPE` = ?, `LETTER_DATE` = ?, `LETTER_NUM` = ?, `SUM_PAYED_DATE` = ?, `RECEIPT_INFO` = ?, `NOTE` = ?, `DOCS_ON_DATE` = ?, `DOCS_PO_DATE` = ?, `NDFL` = ?, `YEAR` = ?, `ACCOUNT_TYPE` = ?, `IS_CAMERAL` = ?, `fil` = ? WHERE `suspnds`.`RECORD_UQ` = ?')) {
	$stmt->bind_param('sssssssssssssssssd', $data['SUM_TO_PAY'], $data['SUM_PAYED'], $data['ORDER_NUM'], $data['ORDER_DATE'], $data['ALCE_TYPE'], $data['LETTER_DATE'], $data['LETTER_NUM'], $data['SUM_PAYED_DATE'], $data['RECEIPT_INFO'], $data['NOTE'], $data['DOCS_ON_DATE'], $data['DOCS_PO_DATE'], $data['NDFL'], $data['YEAR'], $data['ACCOUNT_TYPE'], $data['IS_CAMERAL'], $data['fil'], $data['RECORD_UQ']);
	$stmt->execute();
	$row = $stmt->get_result();

	echo $row;

	$stmt->close();
}