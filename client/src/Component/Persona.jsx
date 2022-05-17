import React, { Component, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'


const Persona = () => {

	const [isFetching, setFetching] = useState(false);
	const [data, setData] = useState([]);
	const [docs, setDocs] = useState([]);

	let { index } = useParams();

	const fetchData = async () => {
		setFetching(true);
		try {
			const response = await fetch('http://10.2.100.142/getPersonaById.php', {
				method: 'POST',
				body: index
			});
			const responseText = await response.json();
			console.log(responseText);
			setData(responseText);
			setFetching(false);
		} catch (error) {
			console.log(error);
			setFetching(false);
		}
	}

	const fetchDocs = async () => {
		setFetching(true);
		try {
			const response = await fetch('http://10.2.100.142/getDocsByPersona.php', {
				method: 'POST',
				body: index
			});
			const responseText = await response.json();
			setDocs(responseText);
			setFetching(false);
		} catch (error) {
			console.log(error);
			setFetching(false);
		}
	}

	const saveChanges = async () => {
		setFetching(true);
		try {
			const response = await fetch('http://10.2.100.142/updatePersona.php', {
				method: 'POST',
				body: JSON.stringify(data)
			});
			const responseText = await response.text();
			console.log(responseText);
			setFetching(false);
		} catch (error) {
			console.log(error);
			setFetching(false);
		}
	}

	useEffect(() => {
		let isMounted = true;
		fetchDocs();
		fetchData();
		return () => {
			isMounted = false;
		};
	}, []);

	const handleUpdates = index => e => {
		let newArr = {...data};
		newArr[index] = e.target.value;
		setData(newArr);
	}

	function openModal(index) {
		let newPageUrl = '/r/'+index
		window.open(newPageUrl, "_blank") //to open new page
	}


	return (
		<div className="page">
			<div className="page-wr">
				<h1>
					Запись №{index}
				</h1>

				<div className="module__actions">
					<div className="module__actions_btn" onClick={window.close}>Закрыть</div>
					<div className="module__actions_btn" onClick={saveChanges}>Сохранить изменения</div>
					<div className="module__actions_btn" onClick={fetchData}>Обновить</div>
				</div>

				<div className="module__wr">

					<fieldset className="module__wr_fieldset">
						<legend className="module__wr_fieldset_legend">
							<div className="module__wr_fieldset_legend_component">Застрахованный</div>
						</legend>
						<div className="module__wr_fieldset_body">
							<div className="module__wr_fieldset_container">
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										СНИЛС
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input type="text" onChange={handleUpdates('snils')} value={data && data.snils}/>
									</div>
								</div>
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Фамилия
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input type="text" onChange={handleUpdates('lastname')} value={data && data.lastname}/>
									</div>
								</div>
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Имя
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input type="text" onChange={handleUpdates('firstname')} value={data && data.firstname}/>
									</div>
								</div>
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Отчество
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input type="text" onChange={handleUpdates('middlename')} value={data && data.middlename}/>
									</div>
								</div>
							</div>
						</div>
					</fieldset>

					<fieldset className="module__wr_fieldset">
						<legend className="module__wr_fieldset_legend">
							<div className="module__wr_fieldset_legend_component">История</div>
						</legend>
						<div className="module__wr_fieldset_body">
							<div className="module__wr_fieldset_container">
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Создан
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input type="text" disabled="disabled" value={data && (data.created_time == '' ? 'нет' : data.created_time)}/>
									</div>
								</div>
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Пользователем
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input type="text" disabled="disabled" value={data && (data.created_ip == '' ? 'нет' : data.created_ip)}/>
									</div>
								</div>
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Последнее изменение
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input type="text" disabled="disabled" value={data && (data.edited_time == '' ? 'нет' : data.edited_time)}/>
									</div>
								</div>
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Пользователем
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input type="text" disabled="disabled" value={data && (data.edited_ip == '' ? 'нет' : data.edited_ip)}/>
									</div>
								</div>
							</div>
						</div>
					</fieldset>



					<fieldset className="module__wr_fieldset fieldset__docs">
						<legend className="module__wr_fieldset_legend">
							<div className="module__wr_fieldset_legend_component">Документы</div>
						</legend>
						<div className="module__wr_fieldset_body">
							<div className="module__wr_fieldset_container">
								<table className="persona_table">
									<thead>
										<tr>
											<th>ТОФ</th>
											<th>К возврату</th>
											<th>Возвращено</th>
											<th>Приказ</th>
											<th>Пособие</th>
											<th>Письмо</th>
											<th>Дата передачи в ОНиОСВ</th>
											<th>Дата передачи в ПО</th>
											<th>Год</th>
											<th>Счет</th>
											<th>В рамках КП</th>
										</tr>
									</thead>
									<tbody>
										{docs.map((item, i) => (
											<tr onDoubleClick={() => openModal(item.RECORD_UQ)}>
												<td>{item.fil}</td>
												<td>{item.SUM_TO_PAY}</td>
												<td>{item.SUM_PAYED}</td>
												<td>{item.ORDER_NUM} {item.ORDER_NUM ? "от" : "Нет"} {item.ORDER_DATE}</td>
												<td>{item.ALCE_TYPE}</td>
												<td>{item.LETTER_NUM} {item.LETTER_NUM ? "от" : "Нет"} {item.LETTER_DATE}</td>
												<td>{item.DOCS_ON_DATE}</td>
												<td>{item.DOCS_PO_DATE}</td>
												<td>{item.YEAR}</td>
												<td>{item.ACCOUNT_TYPE}</td>
												<td>{item.IS_CAMERAL}</td>
											</tr>
											))}
									</tbody>
								</table>
							</div>
						</div>
					</fieldset>


				</div>
			</div>
		</div>
	)
}

export default Persona;