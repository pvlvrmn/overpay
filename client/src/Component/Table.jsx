import React from "react";
import { useTable, useFilters, useGlobalFilter, useSortBy } from 'react-table'
import { matchSorter } from 'match-sorter'


function DefaultColumnFilter({
	column: { filterValue, preFilteredRows, setFilter },
}) {
	return (
		<input
			className="table__filter_input"
			value={filterValue || ''}
			onChange={e => {
				setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
			}}
			placeholder={'Поиск...'}
		/>
	)
}

function SelectColumnFilter({
	column: { filterValue, setFilter, preFilteredRows, id },
}) {
	const options = React.useMemo(() => {
		const options = new Set()
		preFilteredRows.forEach(row => {
			options.add(row.values[id])
		})
		return [...(new Set([...options.values()]))].sort();
	}, [id, preFilteredRows])

	return (
		<select
			className="filter__wr_select"
			value={filterValue}
			onChange={e => {
				setFilter(e.target.value || undefined)
			}}
		>
			<option value="">Все</option>
			{options.map((option, i) => (
				<option key={i} value={option}>
					{option}
				</option>
			))}
		</select>
	)
}


function fuzzyTextFilterFn(rows, id, filterValue) {
	return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

fuzzyTextFilterFn.autoRemove = val => !val

function openModal(index) {
	let newPageUrl = '/r/'+index
	window.open(newPageUrl, "_blank") //to open new page
}

function Table({ data, user }) {

	const filterTypes = React.useMemo(
			() => ({
				fuzzyText: fuzzyTextFilterFn,
				text: (rows, id, filterValue) => {
					return rows.filter(row => {
						const rowValue = row.values[id]
						return rowValue !== undefined
							? String(rowValue)
									.toLowerCase()
									.startsWith(String(filterValue).toLowerCase())
							: true
					})
				},
			}),
			[]
		)

	const defaultColumn = React.useMemo(
		() => ({
			// Let's set up our default Filter UI
			Filter: DefaultColumnFilter,
		}),
		[]
	)

	const columns = React.useMemo(
		() => [
			{
				Header: 'RECORD_UQ',
				accessor: 'RECORD_UQ',
				Filter: DefaultColumnFilter,
				filter: 'fuzzyText'
			},
			{
				Header: 'ТОФ',
				accessor: 'fil',
				Filter: SelectColumnFilter,
				filter: 'equals',
        		sortType: "basic"
			},
			{
				Header: 'СНИЛС',
				accessor: 'snils',
				Filter: DefaultColumnFilter,
				filter: 'fuzzyText',
				Cell: props => props.value
			},
			{
				Header: 'Фамилия И.О.',
				accessor: 'name',
				Filter: DefaultColumnFilter,
				filter: 'fuzzyText',
			},
			{
				Header: 'Приказ',
				accessor: 'ORDER_NUM',
				Filter: DefaultColumnFilter,
				filter: 'fuzzyText',
			},
			{
				Header: 'Дата приказа',
				accessor: 'ORDER_DATE',
				Filter: DefaultColumnFilter,
				filter: 'fuzzyText',
			},
			{
				Header: 'Пособие',
				accessor: 'ALCE_TYPE',
				Filter: SelectColumnFilter,
				filter: 'equals',
			},
			{
				Header: 'Дата письма',
				accessor: 'LETTER_DATE',
				Filter: DefaultColumnFilter,
				filter: 'fuzzyText',
			},
			{
				Header: 'Номер письма',
				accessor: 'LETTER_NUM',
				Filter: DefaultColumnFilter,
				filter: 'fuzzyText',
			},
			{
				Header: 'К возврату',
				accessor: 'SUM_TO_PAY',
				Filter: DefaultColumnFilter,
				filter: 'fuzzyText',
				Cell: props => new Intl.NumberFormat('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(props.value)
			},
			{
				Header: 'Возвращено',
				accessor: 'SUM_PAYED',
				Filter: DefaultColumnFilter,
				filter: 'fuzzyText',
				Cell: props => new Intl.NumberFormat('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(props.value)
			},
			{
				Header: 'Дата возврата',
				accessor: 'SUM_PAYED_DATE',
				Filter: DefaultColumnFilter,
				filter: 'fuzzyText',
			},
			{
				Header: 'Квитанция',
				accessor: 'RECEIPT_INFO',
				Filter: DefaultColumnFilter,
				filter: 'fuzzyText',
			},
			{
				Header: 'Документы ОНиОСВ',
				accessor: 'DOCS_ON_DATE',
				Filter: DefaultColumnFilter,
				filter: 'fuzzyText',
			},
			{
				Header: 'Документы правовой',
				accessor: 'DOCS_PO_DATE',
				Filter: DefaultColumnFilter,
				filter: 'fuzzyText',
			},
			{
				Header: 'НДФЛ',
				accessor: 'NDFL',
				Filter: DefaultColumnFilter,
				filter: 'fuzzyText',
				Cell: props => new Intl.NumberFormat('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(props.value)
			},
			{
				Header: 'Счет',
				accessor: 'ACCOUNT_TYPE',
				Filter: SelectColumnFilter,
				filter: 'equals'
			},
			{
				Header: 'КП',
				accessor: 'IS_CAMERAL',
				Filter: SelectColumnFilter,
				filter: 'equals',
			},
			{
				Header: 'Остаток',
				accessor: 'sumToPay',
				Filter: DefaultColumnFilter,
				filter: 'fuzzyText',
				Cell: props => new Intl.NumberFormat('ru-RU').format(props.value)
			}
		],
		[]
	)

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		} = useTable(
			{
				columns,
				data,
				defaultColumn,
				filterTypes,
			},
			useFilters,
			useGlobalFilter,
			useSortBy
		)

	const firstPageRows = rows.slice(0, 6000)
	const fullLentght = rows.length;

	return (
		<div>
			<div className="table__search">Отображается {fullLentght} строк из {data.length}</div>

			<table className="table_search_el" {...getTableProps()}>
				<thead>
					{headerGroups.map(headerGroup => (
						<tr	className="table100-head" {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<th {...column.getHeaderProps()}>
									<div className="table__filter_title" {...column.getHeaderProps(column.getSortByToggleProps())}>
										{column.render('Header')}
										<span>
						                    {column.isSorted
						                      ? column.isSortedDesc
						                        ? ' ↑'
						                        : ' ↓'
						                      : ''}
						                  </span>
									</div>
									
									<div className="table__filter_wr">{column.canFilter ? column.render('Filter') : null}</div>
								</th>
							))}
						</tr>
					))}

				</thead>
				<tbody {...getTableBodyProps()}>
					{firstPageRows.map((row, index) => {
						prepareRow(row);
						return (
							<tr {...row.getRowProps()} onDoubleClick={() => openModal(row.cells[0].value)}>
								{row.cells.map(cell => {
									return (
										<td {...cell.getCellProps()}>
											{cell.render('Cell')}
										</td>
									)
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
    	</div>
	)
}

export default Table;