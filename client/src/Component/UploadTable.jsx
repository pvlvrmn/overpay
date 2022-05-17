import React from 'react';

const UploadTable = function(props){
	console.log(props.data);

	let html = '<table><thead><tr><th>RECORD_UQ</th><th>ТОФ</th><th>СНИЛС</th><th>Фамилия</th><th>Имя</th><th>Отчество</th><th>Пособие</th><th>Сумма к возврату</th><th>Район</th></tr></thead><tbody>';

	for (var k in props.data) {
		props.data[k]['Выплачено.'] = Math.abs(props.data[k]['Выплачено.'])
		html += '<tr>'
		html += '<td>'+props.data[k]['RECORD_UQ']+'</td>'
		html += '<td>'+200+'</td>'

		html += '<td>'+props.data[k]['СНИЛС']+'</td>'
		html += '<td>'+props.data[k]['Фамилия']+'</td>'
		html += '<td>'+props.data[k]['Имя']+'</td>'
		html += '<td>'+props.data[k]['Отчество']+'</td>'
		html += '<td>'+props.data[k]['Пособие']+'</td>'
		html += '<td>'+props.data[k]['Выплачено.']+'</td>'
		html += '<td>'+props.data[k]['Район']+'</td>'
		html += '</tr>'
	}
	html += '</tbody></table>';

	const ApplyHandle = async (event) => {
		const data = JSON.stringify(props.data);
		let res = await fetch("http://10.2.100.142/ApplyUpload.php", {
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

export default UploadTable;