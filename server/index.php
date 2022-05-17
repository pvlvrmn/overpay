<?php

header("Location: http://10.2.100.142:3000");

$servername = 'localhost';
$username = 'server';
$password = 'rbylpflpf';
$database = 'overpay';

$link = new mysqli($servername, $username, $password, $database);

if ($link->connect_error) {
	die ('ERR-0: Ошибка подключения к базе данных.'.$link->connect_error);
}
echo 'Соединение установлено<br><br>';

$result = $link->query("SELECT * FROM USERS");

while ($row = $result->fetch_row()) {
	printf($row[1]);
}

$link->close();