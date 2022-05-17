import React from 'react';

const UploadFullTable = function(props){
	console.log(props.data);

	let html = '<table><thead><tr><th>Фил</th><th>СНИЛС</th><th>Приказ</th><th>Дата</th><th>Пособие</th><th>Письмо</th><th>Дата письма</th><th>Сумма</th><th>Возвращено</th><th>Дата возврата</th><th>Квитанция</th><th>Примечание</th><th>Дата ОН</th><th>Дата ПО</th><th>НДФЛ</th><th>Год</th><th>04</th><th>КП</th></tr></thead><tbody>';

	for (var k in props.data) {
		html += '<tr>'
		html += '<td>'+props.data[k]['Фил']+'</td>'
		html += '<td>'+props.data[k]['СНИЛС']+'</td>'
		html += '<td>'+props.data[k]['Номер приказа']+'</td>'
		html += '<td>'+props.data[k]['Дата приказа']+'</td>'
		html += '<td>'+props.data[k]['Тип пособия']+'</td>'
		html += '<td>'+props.data[k]['Номер письма-требования о возврате переплаты']+'</td>'
		html += '<td>'+props.data[k]['Дата письма-требования о возврате переплаты']+'</td>'
		html += '<td>'+props.data[k]['Сумма к удержанию']+'</td>'
		html += '<td>'+props.data[k]['Сумма возврата']+'</td>'
		html += '<td>'+props.data[k]['Дата возврата']+'</td>'
		html += '<td>'+props.data[k]['Информация о квитанции']+'</td>'
		html += '<td>'+props.data[k]['Примечание']+'</td>'
		html += '<td>'+props.data[k]['Дата передачи документов в ОНиОСВ']+'</td>'
		html += '<td>'+props.data[k]['Дата передачи документов в Правовой отдел']+'</td>'
		html += '<td>'+props.data[k]['НДФЛ']+'</td>'
		html += '<td>'+props.data[k]['Год']+'</td>'
		html += '<td>'+props.data[k]['Перечисление на 04 счет']+'</td>'
		html += '<td>'+props.data[k]['В рамках КП']+'</td>'
		html += '</tr>'
	}
	html += '</tbody></table>';

	const ApplyHandle = async (event) => {
		const data = JSON.stringify(props.data);
		let res = await fetch("http://10.2.100.142/ApplyUploadFull.php", {
			method: 'POST',
			body: data
		});
		let response = await res.text();
		console.log(response);
	}

	return (
		<div className="upload__wr">
			<div className="upload__table" dangerouslySetInnerHTML={{__html: html}}></div>
			<button className="upload__apply" onClick={ApplyHandle}>Подтвердить импорт</button>
		</div>
	)
}

export default UploadFullTable;