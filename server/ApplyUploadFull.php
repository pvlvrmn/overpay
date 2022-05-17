<?php

include('db.php');

$data = json_decode(file_get_contents('php://input'), true);

$snils = array_unique(array_column($data,'СНИЛС'));
$snilsTable = array();

if ($stmt = $con->prepare('SELECT `snils` FROM `persona`')) {
	$stmt->execute();
	$row = $stmt->get_result();
	while($arr = $row->fetch_assoc()) {
		array_push($snilsTable, $arr['snils']);
	}
	$stmt->close();
}

$arrayToInsert = array();

foreach ($snils as $key => $value) {
	foreach ($data as $key1 => $value1) {
		if (($value === $value1['СНИЛС']) and (!in_array($value, $snilsTable))){
			array_push($arrayToInsert, [$value1['СНИЛС'], $value1['Фамилия Имя Отчество']]);
			break;
		}
	}
}

if ($stmt = $con->prepare('INSERT INTO `persona` (`snils`, `lastname`, `firstname`, `middlename`, `created_ip`, `created_time`) VALUES (?, ?, 0, 0, ?, ?)')) {
	foreach ($arrayToInsert as $key => $value) {
		$date = date('Y-m-d H:i:s');
		$stmt->bind_param('ss', $value[0], $value[1], $_SERVER['REMOTE_ADDR'], $date);
		$stmt->execute();
	}
	$stmt->close();
}

if ($stmt = $con->prepare('INSERT INTO `suspnds` (`PERSONA_ID`, `SUM_TO_PAY`, `SUM_PAYED`, `ORDER_NUM`, `ORDER_DATE`, `ALCE_TYPE`, `LETTER_NUM`, `LETTER_DATE`, `SUM_PAYED_DATE`, `RECEIPT_INFO`, `NOTE`, `DOCS_ON_DATE`, `DOCS_PO_DATE`, `NDFL`, `YEAR`, `ACCOUNT_TYPE`, `IS_CAMERAL`, `fil`) VALUES ((SELECT `id` FROM persona WHERE `snils`=?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')) {
	foreach ($data as $value) {
		foreach ($value as $Qkey => $Qvalue) {
			if ($Qvalue == '') $value[$Qkey] = NULL;
		}
		$stmt->bind_param('sssssdsssssssddsss', $value['СНИЛС'], $value['Сумма к удержанию'], $value['Сумма возврата'], $value['Номер приказа'], $value['Дата приказа'], substr($value['Тип пособия'], 0, 2), $value['Номер письма-требования о возврате переплаты'], $value['Дата письма-требования о возврате переплаты'], $value['Дата возврата'], $value['Информация о квитанции'], $value['Примечание'], $value['Дата передачи документов в ОНиОСВ'], $value['Дата передачи документов в Правовой отдел'], $value['НДФЛ'], $value['Год'], $value['Перечисление на 04 счет'], $value['В рамках КП'], $value['Фил']);
		$stmt->execute();
	}
	$stmt->close();
}