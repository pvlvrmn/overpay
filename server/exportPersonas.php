<?php

$fileName = 'EXPORT_PERSONAS_'.date('Y-m-d_h:i:s').'.xls';

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
.c0 {mso-number-format:General;}
.c1 {mso-number-format:General;}
.c2 {mso-number-format:General;}
.c3 {mso-number-format:General;}
.c4 {mso-number-format:General;}
.c5 {mso-number-format:0;}
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
<col class=c1 width=120>
<col class=c2 width=140>
<col class=c3 width=140>
<col class=c4 width=140>
<col class=c5 width=50>
";

if ($stmt = $con->prepare('SELECT persona.id as "RECORD_UQ", persona.snils as "СНИЛС", persona.lastname as "Фамилия", persona.firstname as "Имя", persona.middlename as "Отчество", COUNT(suspnds.RECORD_UQ) as "Документов" FROM suspnds INNER JOIN persona ON persona.id = suspnds.PERSONA_ID GROUP BY suspnds.PERSONA_ID')) {
	$stmt->execute();
	$row = $stmt->get_result();
	while ($arr = $row->fetch_assoc()) {
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