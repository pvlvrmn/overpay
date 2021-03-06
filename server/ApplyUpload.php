<?php

include('db.php');

$raion = array('Октябрьский г.Уфа', 'Калиниский г.Уфа', 'Орджоникидзевский г.Уфа',
	'Архангельский', 'Благоварский', 'г.Благовещенск и Благовещениский район', 'Иглинский', 'Кармаскалинский', 'Кушнаренковский', 'Нуримановский', 'Уфимский', 'г.Давлеканово', 'Чишминский',
	'Аургазинский', 'Гафурийский', 'Стерлибашевский', 'Стерлитамакский', 'г.Ишимбай и Ишимбайский район', 'г.Салават', 'г.Стерлитамак', 'Ишимбайский', 'г.Ишимбай',
	'Зианчуринский', 'Куюргазинский', 'Кугарчинский', 'Фёдоровский', 'г.Кумертау', 'г.Мелеуз', 'Мелеузовский',
	'г.Баймак и Баймакский район', 'Зилаирский', 'Хайбуллинский', 'г.Сибай',
	'Абзелиловский', 'Бурзянский', 'г.Белорецк и Белорецкий район', 'г.Учалы', 'г. Межгорье', 'Белорецкий',
	'Белокатайский', 'Дуванский', 'Кигинский', 'Мечетлинский', 'Салаватский',
	'Аскинский', 'Балтачаевский', 'Бураевский', 'Караидельский', 'Мишкинский', 'Татышлинский', 'г. Бирск и Бирский район', 'г. Бирск',
	'г.Дюртюли', 'Калтасинский', 'Илишевский', 'Краснокамский', 'Чекмагушевский', 'г.Янаул', 'г.Нефтекамск', 'г.Агидель',
	'Альшеевский', 'Бижбулякский', 'Ермекеевский', 'Миякинский', 'г.Белебей и Белебеевский р-он',
	'Бакалинский', 'Буздякский', 'Шаранский', 'г.Октябрьский', 'г.Туймазы', 'Туймазинский',
	'Кировский г.Уфа', 'Ленинский г.Уфа', 'Демский г.Уфа', 'Советский г.Уфа');

$fkod = array('0201', '0201', '0201',
	'0202', '0202', '0202', '0202', '0202', '0202', '0202', '0202', '0202', '0202',
	'0203', '0203', '0203', '0203', '0203', '0203', '0203', '0203', '0203',
	'0204', '0204', '0204', '0204', '0204', '0204', '0204',
	'0205', '0205', '0205', '0205',
	'0206', '0206', '0206', '0206', '0206', '0206',
	'0207', '0207', '0207', '0207', '0207',
	'0208', '0208', '0208', '0208', '0208', '0208', '0208', '0208',
	'0209', '0209', '0209', '0209', '0209', '0209', '0209', '0209',
	'0210', '0210', '0210', '0210', '0210',
	'0211', '0211', '0211', '0211', '0211', '0211',
	'0212', '0212', '0212', '0212');

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
			array_push($arrayToInsert, [$value1['СНИЛС'], $value1['Фамилия'], $value1['Имя'], $value1['Отчество'], ]);
			break;
		}
	}
}

if ($stmt = $con->prepare('INSERT INTO `persona` (`snils`, `lastname`, `firstname`, `middlename`, `created_ip`, `created_time`) VALUES (?, ?, ?, ?, ?, ?)')) {
	foreach ($arrayToInsert as $key => $value) {
		$date = date('Y-m-d H:i:s');
		$stmt->bind_param('ssssss', $value[0], $value[1], $value[2], $value[3], $_SERVER['REMOTE_ADDR'], $date);
		$stmt->execute();
	}
	$stmt->close();
}

if ($stmt = $con->prepare('INSERT INTO `suspnds` (`PERSONA_ID`, `SUM_TO_PAY`, `ALCE_TYPE`, `NDFL`, `fil`, `created_ip`, `created_time`) VALUES ((SELECT `id` FROM persona WHERE `snils`=?), ?, ?, ?, ?, ?, ?)')) {
	foreach ($data as $key => $value) {
		$date = date('Y-m-d H:i:s');
		$stmt->bind_param('sdsdsss', $value['СНИЛС'], $value['Выплачено.'], substr($value['Пособие'], 0, 2), $value['Удержано'], str_replace($raion, $fkod, $value['Район']), $_SERVER['REMOTE_ADDR'], $date);
		$stmt->execute();
	}
	$stmt->close();
}