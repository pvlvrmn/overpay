<?php


header('Content-Type: application/json');
error_reporting(E_ALL & ~E_DEPRECATED);
$timestart = microtime(true);
include('db.php');
include('getWorkingDays.php');

$inp = file_get_contents('php://input');
$index = (int)$inp;

/*
0 Создано
1 Ожидание Письма
2 Письмо Просрочено
3 Ожидание Возврата
4 Ожидание в ПО
5 Ожидание в ОН
6 Ожидание КП
7 Документы переданы
8 Назначена КП
9 Передача просрчена
10 Возвращено
11 Передано в ПО, но вернули
*/

$resulted = array();

if ($stmt = $con->prepare('SELECT RECORD_UQ FROM suspnds')) {
	$stmt->execute();
	$row = $stmt->get_result();
	while ($arr = $row->fetch_assoc()) {
		array_push($resulted, $arr['RECORD_UQ']);
	}

	$stmt->close();
}

foreach ($resulted as $id => $record) {
	if ($stmt = $con->prepare('SELECT RECORD_UQ, SUM_TO_PAY, SUM_PAYED, ORDER_DATE, LETTER_DATE, DOCS_ON_DATE, DOCS_PO_DATE, IS_CAMERAL, status FROM suspnds WHERE RECORD_UQ = ?')) {
		$stmt->bind_param('d', $record);
		$stmt->execute();
		$row = $stmt->get_result();
		$r = $row->fetch_assoc();

		if (($r['DOCS_PO_DATE'] != NULL) & ($r['LETTER_DATE'] != NULL) & ($r['SUM_PAYED'] > 0)) {
			$status = 11;
		} elseif (($r['SUM_TO_PAY'] <= $r['SUM_PAYED']) & ($r['SUM_TO_PAY'] > 0)) {
			$status = 10;
		} elseif (($r['DOCS_ON_DATE'] == '') & ($r['ORDER_DATE'] != '') & ($r['ORDER_DATE'] != NULL) & (floor((time()-strtotime($r['ORDER_DATE'])) / 86400) > 90)) {
			$status = 9;
		} elseif (($r['IS_CAMERAL'] != NULL) & ($r['LETTER_DATE'] != NULL) & (getWorkingDays($r['LETTER_DATE'], date('Y-m-d')) > 10)) {
			$status = 8;
		} elseif (($r['DOCS_ON_DATE'] != NULL) & ($r['LETTER_DATE'] != NULL) & (getWorkingDays($r['LETTER_DATE'], date('Y-m-d')) > 10)) {
			$status = 7;
		} elseif (($r['IS_CAMERAL'] == NULL) & ($r['DOCS_ON_DATE'] == NULL) & ($r['LETTER_DATE'] != NULL) & (getWorkingDays($r['LETTER_DATE'], date('Y-m-d')) > 10)) {
			$status = 6;
		} elseif (($r['SUM_PAYED'] < $r['SUM_TO_PAY']) & ($r['LETTER_DATE'] != NULL) & ($r['DOCS_ON_DATE'] == NULL) & (floor((time()-strtotime($r['LETTER_DATE'])) / 86400) >= 10)) {
			$status = 5;
		} elseif (($r['SUM_PAYED'] < $r['SUM_TO_PAY']) & ($r['LETTER_DATE'] != NULL) & ($r['DOCS_PO_DATE'] == NULL) & (floor((time()-strtotime($r['LETTER_DATE'])) / 86400) >= 10)) {
			$status = 4;
		} elseif (($r['SUM_PAYED'] <= $r['SUM_TO_PAY']) & ($r['LETTER_DATE'] != NULL) & (floor((time()-strtotime($r['LETTER_DATE'])) / 86400) < 10)) {
			$status = 3;
		} elseif (($r['ORDER_DATE'] != NULL) & (getWorkingDays($r['ORDER_DATE'], date('Y-m-d')) > 5) & ($r['LETTER_DATE'] == NULL)) {
			$status = 2;
		} elseif (($r['ORDER_DATE'] != NULL) & (getWorkingDays($r['ORDER_DATE'], date('Y-m-d')) > 3) & ($r['LETTER_DATE'] == NULL)) {
			$status = 1;
		} else {
			$status = 0;
		}
	}

	if ($r['status'] != $status) {
		if ($stmt = $con->prepare('UPDATE suspnds SET status = ? WHERE RECORD_UQ = ?')) {
			$stmt->bind_param('dd', $status, $record);
			$stmt->execute();
			$stmt->close();
		}
	}
}


$timeend = microtime(true);
$exectued = ($timeend - $timestart);

echo 'Executed in '.round($exectued,3).' s';