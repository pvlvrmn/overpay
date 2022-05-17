import React, {useMemo, Component, useState, useEffect} from 'react';
import { useParams } from 'react-router-dom'
import Table from "./Table"

const Index = (props) => {

	const [isFetching, setFetching] = useState(false);
	const [data, setData] = useState([]);

	const titles = {'full': '(все записи)',
					'created': '(созданные)',
					'waiting_letter': '(ожидание письма)',
					'overdue_letter': '(письмо просрочено)',
					'waiting_refund': '(ожидание возврата)',
					'waiting_on': '(ожидание документов в ОНиОСВ)',
					'waiting_po': '(ожидание документов в ПО)',
					'waiting_kp': '(ожидание КП)',
					'docs_sent': '(документы переданы)',
					'appoint_kp': '(назначена КП)',
					'overdue_docs': '(передача просрочена)',
					'done': '(возвращено)',
					'warning': '(передано и возвращено)'};

	let { param } = useParams();

	const fetchData = async () => {
		setFetching(true);
		let dataToSend = {"type":param, "fil":props.user.fil.substr(1)};
		const JSONdata = JSON.stringify(dataToSend);
		try {
			const response = await fetch('http://10.2.100.142/getSuspnds.php', {
				method: 'POST',
				body: JSONdata
			});
			const responseText = await response.json();
			for (var i = responseText.length - 1; i >= 0; i--) {
				responseText[i]['sumToPay'] = responseText[i]['SUM_TO_PAY'] - responseText[i]['SUM_PAYED'];
				if (responseText[i]['sumToPay'] < 0) {
					responseText[i]['sumToPay'] = 0;
				}
			}
			setData(responseText);
			setFetching(false);
		} catch (error) {
			console.log(error);
			setFetching(false);
		}
	}

	useEffect(() => {
		let isMounted = true;
		fetchData();
		return () => {
			isMounted = false;
		};
	}, [props?.user?.fil]);

	const downloadData = () => {
		window.open('http://10.2.100.142/export.php?type='+param, "_blank") //to open new page
	}

	return (
		<div className="page">
			<div className="page-wr">
				<h1>
					Реестр записей {titles[param]}
				</h1>
				<div className="module__actions">
					<div className="module__actions_btn" onClick={downloadData}>Выгрузить в Excel</div>
				</div>
			</div>
			<p>{isFetching ? 'Loading...' : ''}</p>
			<div className="clear"></div>
			<Table data={data && data} user={props.user}/>
		</div>
	)

}

export default Index;