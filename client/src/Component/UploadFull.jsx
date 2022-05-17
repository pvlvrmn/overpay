import React, { useState } from 'react';
import { useCookies } from "react-cookie";
import UploadFullTable from './UploadFullTable'

const Upload = function(props) {

	const [cookies, setCookie, removeCookie] = useCookies(['token']);
	const [data, setData] = useState();

	const HandleClick = () => {
		removeCookie('token');
	}

	const handleFile = async (event) => {
		let inp = document.getElementById('upload__inp');
		event.preventDefault();
		const files = inp.files;
		const data = new FormData();
		data.append('myFile', files[0]);
		let res = await fetch("http://10.2.100.142/uploadFull.php", {
			method: 'POST',
			body: data
		});
		let response = await res.json();
		setData(response);
	}

	return (
		<div className="page">
			<div className="page-wr">
				<h1>
					Загрузка из файла ЖУРНАЛА
				</h1>
				<input name="myfileU" type="file" id="upload__inp"/>
				<button onClick={handleFile}>Загрузить</button>
				{data ? <UploadFullTable data={data}/> : '' }
			</div>
		</div>
		)
}

export default Upload;