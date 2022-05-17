import React, { Component, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'


const Module = (props) => {

	const [isFetching, setFetching] = useState(false);
	const [data, setData] = useState();
	const [role, setRole] = useState(5);

	let { index } = useParams();

	if (role === 5 && props.user) {
		if (props.user && props.user.role == 'read') {
			setRole(0);
		} else if (props.user && props.user.role == 'fil') {
			setRole(1);
		} else if (props.user && props.user.role == 'ro') {
			setRole(2);
		} else if (props.user && props.user.role == 'admin') {
			setRole(3);
		}
	}

	/*
	0 Создано
	1 Ожидание Письма
	2 Письмо Просрочено
	3 Ожидание Возврата
	4 Ожидание в ПО
	5 Ожидание в ОН
	6 Ожидание КП
	7 Документы переданы
	8 Назначена КП
	9 Передача просрчена
	10 Возвращено
	11 Передано в ПО, но вернули
	*/

	const titles = {'0': '(Создано)',
					'1': '(Ожидание письма)',
					'2': '(Письмо просрочено)',
					'3': '(Ожидание возврата)',
					'4': '(Ожидание передачи документов в ПО)',
					'5': '(Ожидание передачи документов в ОНиОСВ)',
					'6': '(Ожидание заполнения КП)',
					'7': '(Документы переданы)',
					'8': '(КП назначена)',
					'9': '(Передача документов просрочена)',
					'10': '(Возвращено)',
					'11': '(Передано в ПО, но деньги поступили)'};

	const subTitles = {'0': 'Документ загружен, но номер и дата приказа еще не заполнены',
					'1': 'Прошло более трех дней от даты приказа, но письмо-требование еще не отправлено',
					'2': 'Прошло более пяти дней от даты приказа, но письмо-требование еще не отправлено',
					'3': 'Письмо-требование отправлено менее 10 дней назад и возврат еще не поступил',
					'4': 'Письмо-требование отправлено более 10 дней назад и возврат еще не поступил, ожидание передачи документов',
					'5': 'Письмо-требование отправлено более 10 дней назад и возврат еще не поступил, ожидание передачи документов',
					'6': 'Письмо-требование отправлено более 10 дней назад и не заполнено поле «В рамках КП»',
					'7': 'Письмо-требование отправлено более 10 дней назад и документы переданы',
					'8': 'Письмо-требование отправлено более 10 дней назад и заполнено поле «В рамках КП»',
					'9': 'С даты приказа прошло более 90 дней и документы не переданы в ОНиОСВ',
					'10': 'Сумма возврата равна или превышает суммы к удержанию',
					'11': 'Документы были переданы в ПО, но поступил возврат'};

	const fetchData = async () => {
		setFetching(true);
		try {
			const response = await fetch('http://10.2.100.142/getSuspndsById.php', {
				method: 'POST',
				body: index
			});
			const responseText = await response.json();
			setData(responseText);
			setFetching(false);
		} catch (error) {
			console.log(error);
			setFetching(false);
		}
	}

	const saveChanges = async () => {
		setFetching(true);
		try {
			const response = await fetch('http://10.2.100.142/updateSuspnds.php', {
				method: 'POST',
				body: JSON.stringify(data)
			});
			const responseText = await response.text();
			setFetching(false);
		} catch (error) {
			console.log(error);
			setFetching(false);
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	const handleUpdates = index => e => {
		let newArr = {...data};
		newArr[index] = e.target.value;
		setData(newArr);
	}


	return (
		<div className="page">
			<div className="page-wr">
				<h1> 
					Запись №{index} {data && titles[data.status]}
				</h1>
				<span>{data && subTitles[data.status]}</span>

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
										<input type="text" disabled="disabled" value={data && data.snils} className="input_with-button"/>
										<div className="button_with-input" onClick={e => window.open("../persona/"+data.id, "_blank")}>Карточка</div>
									</div>
								</div>
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Фамилия
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input type="text" disabled="disabled" value={data && data.lastname}/>
									</div>
								</div>
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Имя
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input type="text" disabled="disabled" value={data && data.firstname}/>
									</div>
								</div>
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Отчество
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input type="text" disabled="disabled" value={data && data.middlename}/>
									</div>
								</div>
							</div>
						</div>
					</fieldset>

					<fieldset className="module__wr_fieldset">
						<legend className="module__wr_fieldset_legend">
							<div className="module__wr_fieldset_legend_component">Информация о приказе</div>
						</legend>
						<div className="module__wr_fieldset_body">
							<div className="module__wr_fieldset_container">
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Филиал * 
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input disabled={(role === 0 || role === 1) ? true : false} type="text" onChange={handleUpdates('fil')} value={data && data.fil} />
									</div>
								</div>
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Приказ *
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input disabled={(role == 0 || role == 1) ? true : false} type="text" onChange={handleUpdates('ORDER_NUM')} value={data && data.ORDER_NUM} />
									</div>
								</div>
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Дата приказа *
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input disabled={(role == 0 || role == 1) ? true : false} type="date" onChange={handleUpdates('ORDER_DATE')} value={data && data.ORDER_DATE} />
									</div>
								</div>
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Пособие *
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<select disabled={(role == 0 || role == 1) ? true : false} onChange={handleUpdates('ALCE_TYPE')} value={data && data.ALCE_TYPE} >
											<option value="1">01-В/Н</option>
											<option value="2">02-Б/Р</option>
											<option value="3">03-Р/С</option>
											<option value="4">04-Р/Р</option>
											<option value="5">05-У/Р</option>
											<option value="9">09-О/Л</option>
											<option value="98">98-С/В</option>
											<option value="99">99-С/В</option>
										</select>
									</div>
								</div>
							</div>
						</div>
					</fieldset>

					<fieldset className="module__wr_fieldset">
						<legend className="module__wr_fieldset_legend">
							<div className="module__wr_fieldset_legend_component">Информация о возврате</div>
						</legend>
						<div className="module__wr_fieldset_body">
							<div className="module__wr_fieldset_container">
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Сумма к возврату *
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input disabled={(role == 0 || role == 1) ? true : false} type="text" onChange={handleUpdates('SUM_TO_PAY')} value={data && data.SUM_TO_PAY} />
									</div>
								</div>
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Возвращено *
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input disabled={(role == 0 || role == 1) ? true : false} type="text" onChange={handleUpdates('SUM_PAYED')} value={data && data.SUM_PAYED} />
									</div>
								</div>
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Дата возврата *
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input disabled={(role == 0 || role == 1) ? true : false} type="date" onChange={handleUpdates('SUM_PAYED_DATE')} value={data && data.SUM_PAYED_DATE} />
									</div>
								</div>
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Квитанция
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input disabled={(role === 0) ? true : false} type="text" onChange={handleUpdates('RECEIPT_INFO')} value={data && data.RECEIPT_INFO}/>
									</div>
								</div>
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										НДФЛ *
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input disabled={(role == 0 || role == 1) ? true : false} type="text" onChange={handleUpdates('NDFL')} value={data && data.NDFL} />
									</div>
								</div>
							</div>
						</div>
					</fieldset>

					<fieldset className="module__wr_fieldset">
						<legend className="module__wr_fieldset_legend">
							<div className="module__wr_fieldset_legend_component">Прочее</div>
						</legend>
						<div className="module__wr_fieldset_body">
							<div className="module__wr_fieldset_container">
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Год *
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input disabled={(role == 0 || role == 1) ? true : false} type="text" onChange={handleUpdates('YEAR')} value={data && data.YEAR} />
									</div>
								</div>
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Перечисление на 04 *
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<select disabled={(role == 0 || role == 1) ? true : false} onChange={handleUpdates('ACCOUNT_TYPE')} value={data && data.ACCOUNT_TYPE} >
											<option value="">-</option>
											<option value="04">Возврат на 04</option>
											<option value="130">Перекидка на 130 (2 кв)</option>
										</select>
									</div>
								</div>
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										В рамках КП
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<select disabled={role === 0 ? true : false} onChange={handleUpdates('IS_CAMERAL')} value={data && data.IS_CAMERAL} >
											<option value="">-</option>
											<option value="101">По приказу №101 от 21.02.2022</option>
											<option value="0">В связи с не возвратом</option>
										</select>
									</div>
								</div>
							</div>
						</div>
					</fieldset>

					<fieldset className="module__wr_fieldset">
						<legend className="module__wr_fieldset_legend">
							<div className="module__wr_fieldset_legend_component">Информация о письме</div>
						</legend>
						<div className="module__wr_fieldset_body">
							<div className="module__wr_fieldset_container">
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Дата письма-требования
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input disabled={role === 0 ? true : false} type="date" onChange={handleUpdates('LETTER_DATE')} value={data && data.LETTER_DATE}/>
									</div>
								</div>
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										Номер письма-требования
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input disabled={role === 0 ? true : false} type="text" onChange={handleUpdates('LETTER_NUM')} value={data && data.LETTER_NUM}/>
									</div>
								</div>
							</div>
						</div>
					</fieldset>

					<fieldset className="module__wr_fieldset">
						<legend className="module__wr_fieldset_legend">
							<div className="module__wr_fieldset_legend_component">Даты передачи документов</div>
						</legend>
						<div className="module__wr_fieldset_body">
							<div className="module__wr_fieldset_container">
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										В ОНиОСВ
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input disabled={role === 0 ? true : false} type="date" onChange={handleUpdates('DOCS_ON_DATE')} value={data && data.DOCS_ON_DATE}/>
									</div>
								</div>
								<div className="module__wr_fieldset_container_panel">
									<div className="module__wr_fieldset_container_panel_label">
										В правовой отдел *
									</div>
									<div className="module__wr_fieldset_container_panel_input">
										<input disabled={(role == 0 || role == 1) ? true : false} type="date" onChange={handleUpdates('DOCS_PO_DATE')} value={data && data.DOCS_PO_DATE} />
									</div>
								</div>
							</div>
						</div>
					</fieldset>

					<fieldset className="module__wr_fieldset fieldset__note">
						<legend className="module__wr_fieldset_legend">
							<div className="module__wr_fieldset_legend_component">Примечание</div>
						</legend>
						<div className="module__wr_fieldset_body fieldset__note_body">
							<textarea disabled={role === 0 ? true : false} onChange={handleUpdates('NOTE')} value={data && data.NOTE}>
							</textarea>
						</div>
					</fieldset>


				</div>
			</div>
		</div>
	)
}

export default Module;