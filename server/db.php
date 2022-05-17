<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

$DB_HOST = 'localhost';
$DB_USER = 'server';
$DB_PASS = 'rbylpflpf';
$DB_TABL = 'overpay';

$ip = $_SERVER['REMOTE_ADDR'];

$con = mysqli_connect($DB_HOST, $DB_USER, $DB_PASS, $DB_TABL);

if (mysqli_connect_errno()) {
	exit('5');
}

$con -> set_charset('utf8');