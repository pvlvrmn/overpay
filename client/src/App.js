import React, { Component, useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link
} from "react-router-dom";
import { useCookies } from "react-cookie";
import "./App.css"
import Header from ".//Component/Header"
import Index from ".//Component/Index"
import Upload from ".//Component/Upload"
import UploadFull from ".//Component/UploadFull"
import Module from ".//Component/Module"
import Persona from ".//Component/Persona"
import Login from ".//Component/Login"
import Help from ".//Component/Help"
import Menu from ".//Component/Menu"
import List from ".//Component/List"



function App() {
	
	const [cookies, setCookie, removeCookie] = useCookies(['token']);
	const [user, setUser] = useState();

	const HandleToken = async () => {
		try {
			const data = {
				t: cookies.token,
			};
			const dataJSON = JSON.stringify(data);
			const response = await fetch('http://10.2.100.142/login.php', {
				method: 'POST',
				headers: {'Content-Type': 'application/json',},
				body: dataJSON,
			});
			const responseText = await response.text();
			if (responseText[0] != '4'){
				console.log('Token is invalid');
				removeCookie('token');
				console.log(responseText);
			}
		} catch (error) {
			console.log(error);
		}

		try {
			const response = await fetch('http://10.2.100.142/checkToken.php', {
				method: 'POST',
				body: cookies.token,
			});
			const responseText = await response.json();
			if (responseText.active == false) {
				removeCookie('token');
			} else {
				setUser(responseText);
			}
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		if (cookies.token) {
			HandleToken();
		}
	}, [])
	
	if (!cookies.token) {
		return (
			<>
				<Header logButton={false}/>
				<Login setToken={setCookie} />
			</>
		)
	} else {
		return (
			<Router>
				<div className='App'>
					<Header logButton={true} user={user}/>
					<Routes>
						<Route path='/' element={<Menu user={user}/>} />
						<Route path='/overpay/:param' element={<Index user={user}/>} />
						<Route path='/r/:index' element={<Module user={user}/>} />
						<Route path='/personas' element={<List user={user}/>} />
						<Route path='/persona/:index' element={<Persona user={user}/>} />
						<Route path='/upload' element={<Upload user={user}/>} />
						<Route path='/help' element={<Help user={user}/>} />
					</Routes>
				</div>
			</Router>
		);
	}
}

export default App;