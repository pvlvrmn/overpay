import React, { useState } from 'react';

const Login = (props) => {

	const [uName, setName] = useState('');
	const [uPass, setPass] = useState('');
	const [error, setError] = useState('');

	const HandleClick = async () => {
		setError('');
		try {
			const data = {
				u: uName,
				p: uPass
			};
			const dataJSON = JSON.stringify(data);
			console.log(dataJSON);
			const response = await fetch('http://10.2.100.142/login.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: dataJSON,
			});
			const responseText = await response.text();
			//setResp(responseText)
			console.log(responseText);
			if (responseText[0] == '2') {
				console.log('Logged in');
				let token = responseText.slice(2);
				let expires = new Date();
				expires.setTime(expires.getTime() + 24*60*60*1000); 
				props.setToken('token', token, {path: '/', expires});
			}
			else if (responseText[0] == '1'){
				setError('Неверные данные о подлинности');
			}
			else {
				setError('Неизвестная ошибка:'+responseText[0]);
			}
		} catch (error) {
			console.log(error);
			setError('Ошибка сервера');
		}
	}

	return (
		<div className="login__wr">
			{error != '' ? <div className="login__error">{error}</div> : ''}
			<label>
				<p>Имя пользователя</p>
				<input type="text" id="username" value={uName} onInput={e => setName(e.target.value)}/>
			</label>
			<label>
				<p>Пароль</p>
				<input type="password" id="password" value={uPass} onInput={e => setPass(e.target.value)}/>
			</label>
			<div>
				<button className="login__button" onClick={HandleClick}>ВОЙТИ</button>
			</div>
		</div>
		)
}

export default Login;