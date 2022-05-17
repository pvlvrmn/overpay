import React from 'react';

const Filter = function() {
	return (
		<div className="filter__wr">
			<input className="filter__wr_input" placeholder="ТОФ"/>
			<input className="filter__wr_input" placeholder="СНИЛС"/>
			<input className="filter__wr_input" placeholder="Фамилия Имя Отчество"/>
			<input className="filter__wr_input" placeholder="Приказ"/>
			<input className="filter__wr_input" placeholder="Дата приказа"/>
			<input className="filter__wr_input" placeholder="Статус"/>
		</div>
		)
}

export default Filter;