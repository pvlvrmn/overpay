import React, { useState } from 'react';
import { useCookies } from "react-cookie";

const Help = function(props) {

	const [cookies, setCookie, removeCookie] = useCookies(['token']);

	const HandleClick = () => {
		removeCookie('token');
	}

	return (
		<div className="page">
			<div className="page-wr">
				<h1>
					Помощь
				</h1>
			</div>
		</div>
		)
}

export default Help;