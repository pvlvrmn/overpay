<?php

include('db.php');
header('Access-Control-Allow-Headers: Content-Type');

/*
0 - no data
1 - wrong pass
2 - logged in
3 - wrong token
4 - valid token
5 - unexpected
*/

$logged = false;

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['u'], $data['p']) and !isset($data['t'])) {
	exit('0');
} else if (isset($data['u'], $data['p'])) {
	if ($stmt = $con->prepare('SELECT id, password FROM USERS WHERE name=?')) {
		$stmt->bind_param('s', $data['u']);
		$stmt->execute();
		$stmt->store_result();

		if ($stmt->num_rows > 0) {
			$stmt->bind_result($id, $password);
			$stmt->fetch();

			if ($password == $data['p']) {
				echo '2';
				$logged = true;
			}
			else {
				exit('1');
			}
			
		} else {
			exit('1');
		}

		$stmt->close();
	}

	$now = date('Y-m-d h:i:s');

	if ($logged == true) {
		if ($stmt = $con->prepare('INSERT INTO `loginActivity` (`time`, `userid`, `ip`, `token`) VALUES (?, ?, ?, ?)')) {
			$token = md5($id.$ip.$now.'fss');
			$stmt->bind_param('siss', $now, $id, $ip, $token);
			$stmt->execute();
			$stmt->close();

			exit(':'.$token);
		}
	}
} else if (isset($data['t'])) {
	if ($stmt = $con->prepare('SELECT ip FROM loginActivity WHERE token=?')) {
		$stmt->bind_param('s', $data['t']);
		$stmt->execute();
		$stmt->store_result();

		if ($stmt->num_rows > 0) {
			$stmt->bind_result($ip_db);
			$stmt->fetch();

			if ($ip_db == $ip) {
				exit('4');
			}
			else {
				exit('3');
			}
			
		}

		$stmt->close();
	}
}


exit('5');