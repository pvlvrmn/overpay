import React, {useMemo, Component, useState, useEffect} from 'react';
import ListTable from "./ListTable"

const List = () => {

	const [isFetching, setFetching] = useState(false);
	const [data, setData] = useState([]);

	const fetchData = async () => {
		setFetching(true);
		try {
			const response = await fetch('http://10.2.100.142/getPersonas.php', {
				method: 'POST',
				body: ''
			});
			const responseText = await response.json();
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
	}, []);

	const downloadData = () => {
		window.open('http://10.2.100.142/exportPersonas.php?type=full', "_blank") //to open new page
	}

	return (
		<div className="page">
			<div className="page-wr">
				<h1>
					Реестр застрахованных
				</h1>
				<div className="module__actions">
					<div className="module__actions_btn" onClick={downloadData}>Выгрузить в Excel</div>
				</div>
			</div>
			<p>{isFetching ? 'Loading...' : ''}</p>
			<div className="clear"></div>
			<ListTable data={data && data}/>
		</div>
	)

}

export default List;