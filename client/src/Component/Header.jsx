import React, { useState } from 'react';
import { useCookies } from "react-cookie";

const Header = function(props) {

	const [cookies, setCookie, removeCookie] = useCookies(['token']);

	const HandleClick = () => {
		removeCookie('token');
	}

	return (
		<header>
			<div className="header__wr"> 
				<div className="header__wr_title"><a href="/">Журнал учета переплаты</a></div>
				<div className="header__wr_menu">
					<ul>
						<li>
							<a href="/">Журнал</a>
						</li>
						<li>
							<a href="/personas">Застрахованные</a>
						</li>
						{props.user && (props.user.role == 'admin' || props.user.role == 'ro') &&
						<li>
							<a href="/upload">Загрузка</a>
						</li>
						}
						<li>
							<a href="/help">Помощь</a>
						</li>
					</ul>
				</div>
				<div className="header__right">
					<div className="header_right_text">
					{props.user && 'Пользователь: '+props.user.displayname}<br/>
					{props.user && 'ТОФ: '+props.user.fil}
					</div>
					{props.logButton ? <button className="header__wr_logout" onClick={HandleClick}>Выйти </button> : ''}
				</div>
			</div>
		</header>
		)
}

export default Header;