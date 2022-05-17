import React, { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";

const Menu = function(props) {

	const [isFetching, setFetching] = useState(false);
	const [stat, setStat] = useState([]);

	const updateStatus = async () => {
		setFetching(true);
		try {
			const response = await fetch('http://10.2.100.142/updateStatus.php', {
				method: 'GET'
			});
		} catch (error) {
			console.log(error);
			setFetching(false);
		}
	}

	const fetchData = async () => {
		setFetching(true);
		try {
			console.log(props.user.fil);
			const response = await fetch('http://10.2.100.142/stat.php', {
				method: 'POST',
				body: props.user.fil
			});
			const responseText = await response.json();
			setStat(responseText);
			setFetching(false);
		} catch (error) {
			console.log(error);
			setFetching(false);
		}
	}

	useEffect(() => {
		let isMounted = true;
		updateStatus();
		fetchData();
		return () => {
			isMounted = false;
		};
	}, [props?.user?.fil]);

	function openModal(url) {
		window.open(url, "_self") //to open new page
	}

	return (
		<div className="page">
			<div className="page-wr">
				<h1>
					Главная
				</h1>
				<div className="main__blocks">
					<div className="main_blocks_elem" onClick={() => openModal('/overpay/full')}>
						<div className="main_blocks_elem_title">Все записи</div>
						<div className="main_blocks_elem_subtitle">{stat.RO && stat.RO.full}</div>
					</div>
					{props.user && (props.user.role=='ro' || props.user.role=='admin') &&
						<div className="main_blocks_elem" onClick={() => openModal('/overpay/created')}>
							<div className="main_blocks_elem_title">Созданные</div>
							<div className="main_blocks_elem_subtitle">{stat.RO && stat.RO.created}</div>
						</div>
					}
					<div className="main_blocks_elem" onClick={() => openModal('/overpay/waiting_letter')}>
						<div className="main_blocks_elem_title">Ожидание письма</div>
						<div className="main_blocks_elem_subtitle">{stat.RO && stat.RO.waiting_letter}</div>
					</div>
					<div className="main_blocks_elem" onClick={() => openModal('/overpay/overdue_letter')}>
						<div className="main_blocks_elem_title">Письмо просрочено</div>
						<div className="main_blocks_elem_subtitle">{stat.RO && stat.RO.overdue_letter}</div>
					</div>
					<div className="main_blocks_elem" onClick={() => openModal('/overpay/waiting_refund')}>
						<div className="main_blocks_elem_title">Ожидание возврата</div>
						<div className="main_blocks_elem_subtitle">{stat.RO && stat.RO.waiting_refund}</div>
					</div>
					<div className="main_blocks_elem" onClick={() => openModal('/overpay/waiting_on')}>
						<div className="main_blocks_elem_title">Ожидание документов ОН</div>
						<div className="main_blocks_elem_subtitle">{stat.RO && stat.RO.waiting_on}</div>
					</div>
					{props.user && (props.user.role=='ro' || props.user.role=='admin') &&
						<div className="main_blocks_elem" onClick={() => openModal('/overpay/waiting_po')}>
							<div className="main_blocks_elem_title">Ожидание документов ПО</div>
							<div className="main_blocks_elem_subtitle">{stat.RO && stat.RO.waiting_po}</div>
						</div>
					}
					<div className="main_blocks_elem" onClick={() => openModal('/overpay/waiting_kp')}>
						<div className="main_blocks_elem_title">Ожидание КП</div>
						<div className="main_blocks_elem_subtitle">{stat.RO && stat.RO.waiting_kp}</div>
					</div>
					<div className="main_blocks_elem" onClick={() => openModal('/overpay/docs_sent')}>
						<div className="main_blocks_elem_title">Документы переданы</div>
						<div className="main_blocks_elem_subtitle">{stat.RO && stat.RO.docs_sent}</div>
					</div>
					<div className="main_blocks_elem" onClick={() => openModal('/overpay/appoint_kp')}>
						<div className="main_blocks_elem_title">Назначена КП</div>
						<div className="main_blocks_elem_subtitle">{stat.RO && stat.RO.appoint_kp}</div>
					</div>
					<div className="main_blocks_elem" onClick={() => openModal('/overpay/overdue_docs')}>
						<div className="main_blocks_elem_title">Передача просрочена</div>
						<div className="main_blocks_elem_subtitle">{stat.RO && stat.RO.overdue_docs}</div>
					</div>
					<div className="main_blocks_elem" onClick={() => openModal('/overpay/done')}>
						<div className="main_blocks_elem_title">Возвращено</div>
						<div className="main_blocks_elem_subtitle">{stat.RO && stat.RO.done}</div>
					</div>
					<div className="main_blocks_elem" onClick={() => openModal('/overpay/warning')}>
						<div className="main_blocks_elem_title">Передано и возвращено</div>
						<div className="main_blocks_elem_subtitle">{stat.RO && stat.RO.warning}</div>
					</div>
					{props.user && (props.user.role=='ro' || props.user.role=='admin') &&
						<div className="main_blocks_elem" onClick={() => openModal('/newSuspnds')}>
							<div className="main_blocks_elem_title">Новая запись</div>
							<div className="main_blocks_elem_plus">+</div>
						</div>
					}
				</div>
			</div>
		</div>
		)
}

export default Menu;