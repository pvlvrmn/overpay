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
			placeholder={`Поиск...`}
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
	let newPageUrl = '/persona/'+index
	window.open(newPageUrl, "_blank") //to open new page
}

function ListTable({ data }) {

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
				accessor: 'id',
				Filter: DefaultColumnFilter,
				filter: 'fuzzyText',
			},
			{
				Header: 'СНИЛС',
				accessor: 'snils',
				Filter: DefaultColumnFilter,
				filter: 'fuzzyText'
			},
			{
				Header: 'Фамилия',
				accessor: 'lastname',
				Filter: DefaultColumnFilter,
				filter: 'fuzzyText'
			},
			{
				Header: 'Имя',
				accessor: 'firstname',
				Filter: DefaultColumnFilter,
				filter: 'fuzzyText'
			},
			{
				Header: 'Отчество',
				accessor: 'middlename',
				Filter: DefaultColumnFilter,
				filter: 'fuzzyText'
			},
			{
				Header: 'Документов',
				accessor: 'count',
				Filter: DefaultColumnFilter,
				filter: 'fuzzyText'
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

			<table className="table_search_el personas_table" {...getTableProps()}>
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

export default ListTable;