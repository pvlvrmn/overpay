<?php

$fileName = 'EXPORT_'.date('Y-m-d_h:i:s').'.xls';

header('Content-Encoding: windows-1251');
header('Content-Type: application/vnd.ms-excel; charset=windows-1251');
header('Content-Disposition: attachment; filename='.$fileName);
header('Expires: 0');
header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
header('Cache-Control: private', false);

error_reporting(E_ALL & ~E_DEPRECATED);

$heading = false;

include('db.php');

$resulted = array();
echo '<html
xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:x="urn:schemas-microsoft-com:office:excel"
xmlns="http://www.w3.org/TR/REC-html40">
<head>
<style>
* {font-family: "Times New Roman"; font-size: 11pt;}
table	{mso-displayed-decimal-separator:"\."; mso-displayed-thousand-separator:" ";}
.c0 {mso-number-format:"0";}
.c100 {mso-number-format:"\@"; vnd.ms-excel.numberformat:@;}
.c1 {mso-number-format: General;}
.c2 {mso-number-format:"\@";}
.c3 {mso-number-format:"\@";}
.c4 {}
.c5 {}
.c6 {}
.c7 {mso-number-format:"dd.MM.yyyy";}
.c8 {}
.c9 {mso-number-format:"dd.MM.yyyy";}
.c10 {}
.c11 {mso-number-format:"dd.MM.yyyy";}
.c12 {mso-number-format:"dd.MM.yyyy";}
.c13 {}
.c14 {mso-number-format:"dd.MM.yyyy";}
.c15 {mso-number-format:"dd.MM.yyyy";}
.c16 {}
.c17 {}
.c18 {}
.c19 {}
.c20 {}
.h {text-align:center;
vertical-align:middle;
background:#99CC00;
font-weight: bold;
border:1.0pt solid;
}
.f {white-space: nowrap;
border-top:none;
border-right:.5pt solid;
border-bottom:.5pt solid;
border-left:.5pt solid;
}
</style>
</head>
';
echo "<table>";
echo "
<col class=c0 width=0>
<col class=c1 width=70>
<col class=c2 width=120>
<col class=c3 width=300>
<col class=c4 width=100>
<col class=c5 width=100>
<col class=c6 width=70>
<col class=c7 width=90>
<col class=c8 width=70>
<col class=c10 width=90>
<col class=c11 width=110>
<col class=c12 width=70>
<col class=c13 width=100>
<col class=c14 width=150>
<col class=c15 width=70>
<col class=c16 width=70>
<col class=c17 width=70>
<col class=c18 width=70>
<col class=c19 width=120>
<col class=c20 width=120>
";

$param = $_GET['type'];

if ($param == 'full') {
	$where = '';
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
} else {
	$where = '';
}

if ($stmt = $con->prepare('SELECT suspnds.RECORD_UQ, suspnds.fil as `Ф/Код`, persona.snils as `СНИЛС`, CONCAT(persona.lastname, " ", persona.firstname, " ", persona.middlename) as `Фамилия Имя Отчество`, suspnds.SUM_TO_PAY as `К возврату`, suspnds.SUM_PAYED as `Возвращено`, suspnds.ORDER_NUM as `Номер приказа`, suspnds.ORDER_DATE as `Дата приказа`, suspnds.ALCE_TYPE as `Пособие`, suspnds.LETTER_DATE as `Дата письма`, suspnds.LETTER_NUM as `Номер письма`, suspnds.SUM_PAYED_DATE as `Дата возврата`, suspnds.RECEIPT_INFO as `Квитанция`, suspnds.NOTE as `Комментарий`, suspnds.DOCS_ON_DATE as `Дата передачи в ОН`, suspnds.DOCS_PO_DATE as `Дата передачи в ПО`, suspnds.NDFL as `НДФЛ`, suspnds.YEAR as `Год`, suspnds.ACCOUNT_TYPE as `04 счет`, suspnds.IS_CAMERAL as `В рамках КП` FROM suspnds INNER JOIN persona ON suspnds.PERSONA_ID=persona.id '.$where)) {
	$stmt->execute();
	$row = $stmt->get_result();
	while ($arr = $row->fetch_assoc()) {
		switch ($arr['Пособие']) {
			case '1':
				$arr['Пособие'] = '01-В/Н';
				break;
			case '2':
				$arr['Пособие'] = '02-Б/Р';
				break;
			case '3':
				$arr['Пособие'] = '03-Р/С';
				break;
			case '4':
				$arr['Пособие'] = '04-Р/Р';
				break;
			case '5':
				$arr['Пособие'] = '05-У/Р';
				break;
			case '9':
				$arr['Пособие'] = '09-О/Л';
				break;
			case '98':
				$arr['Пособие'] = '98-С/В';
				break;
			case '99':
				$arr['Пособие'] = '99-С/В';
				break;
		}
		//$arr['К возврату'] = str_replace('.', ',', $arr['К возврату']);
		//$arr['Возвращено'] = str_replace('.', ',', $arr['Возвращено']);
		//$arr['НДФЛ'] = str_replace('.', ',', $arr['НДФЛ']);
		$arr['К возврату'] = (float)$arr['К возврату'];
		$arr['Возвращено'] = (float)$arr['Возвращено'];
		$arr['НДФЛ'] = (float)$arr['НДФЛ'];
		$arr['СНИЛС'] = "".$arr['СНИЛС']."";
		array_push($resulted, $arr);
	}
	
	foreach ($resulted as $item) {
		if (!$heading) {
			echo "<tr><td class=h>".implode("</td><td class=h>", array_keys($item)) . "</td></tr>";
			$heading = true;
		}
		echo "<tr><td class=f>".implode("</td><td class=f>", array_values($item)) . "</td></tr>";
	}
	echo "</table>";

	$stmt->close();
}