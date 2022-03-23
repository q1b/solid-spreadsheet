import { createStore, produce } from "solid-js/store";

/* Table will contain Columns and some metadata about all Cells */
/* Each Column will contain Header & Cells */
/* Header will contain it's label and data as well metadata about Cells */
/* Each Cell will contain it's label and corresponding data to it . */

type Store = {
	table: Table;
};

type Table = {
	columns: Column[];
};
const createTable = (options?: Partial<Table>): Table => {
	return {
		columns: [],
		...options,
	};
};

/* 
	createColumn
*/
type Column = {
	x: number;
	label: string;
	cells: Cell[];
};
/* Getters */
const getCells = (x: number) => {
	return store.table.columns[x];
};

/* Setters */
const createColumn = (label: string = "Default", cells: Cell[] = [], x?: number): Column => {
	return {
		label,
		cells,
		x: x ? x : store.table.columns.length + 1,
	};
};

export const updateColumnLabel = (x: number,label: string) => {
	setStore(
		"table",
		"columns",
		(column) => column.x === x,
		'label',
		label
	);
};

/* 
	createCell
*/
type Cell = {
	x: number;
	y: number;
	label: string;
};
/* Getters */
const getCell = (x: number, y: number) => {
	return store.table.columns[x].cells[y];
};

/* Setters */
const createCell = (options?: Partial<Cell>): Cell => {
	return {
		label: "Default",
		x: -1,
		y: -1,
		...options,
	};
};

const addNewRow = () => {
	setStore(
		"table",
		"columns",
		produce((columns) => {
			for (let index = 0; index < columns.length; index++) {
				columns[index].cells.push({
					y: columns[index].cells.length,
					x: columns[index].x,
					label: "new cell",
				});
			}
		})
	);
};

export const updateCellLabel = (x: number, y: number, label: string) => {
	setStore(
		"table",
		"columns",
		(column) => column.x === x,
		"cells",
		(cell) => cell.y === y,
		"label",
		label
	);
};

export const [store, setStore] = createStore<Store>({
	table: {
		columns: [
			{
				label: "company",
				x: 1,
				cells: [
					{
						label: "nike",
						x: 1,
						y: 1,
					},
					{
						label: "google",
						x: 1,
						y: 2,
					},
					{
						label: "airasia",
						x: 1,
						y: 3,
					},
					{
						label: "microsoft",
						x: 1,
						y: 4,
					},
					{
						label: "H&M",
						x: 1,
						y: 5,
					},
					{
						label: "adidas",
						x: 1,
						y: 6,
					},
				],
			},
			{
				label: "type",
				x: 2,
				cells: [
					{
						label: "sports",
						x: 2,
						y: 1,
					},
					{
						label: "technology",
						x: 2,
						y: 2,
					},
					{
						label: "Airlines",
						x: 2,
						y: 3,
					},
					{
						label: "technology",
						x: 2,
						y: 4,
					},
					{
						label: "cloths",
						x: 2,
						y: 5,
					},
					{
						label: "sports",
						x: 2,
						y: 6,
					},
				],
			},
			{
				label: "since",
				x: 3,
				cells: [
					{
						label: "25 January 1964",
						x: 2,
						y: 1,
					},
					{
						label: "4 September 1998",
						x: 2,
						y: 2,
					},
					{
						label: "20 December 1993",
						x: 2,
						y: 3,
					},
					{
						label: "4 April 1975",
						x: 2,
						y: 4,
					},
					{
						label: "4 October 1947",
						x: 2,
						y: 5,
					},
					{
						label: "18 August 1949",
						x: 2,
						y: 6,
					},
				],
			},
		],
	},
});

export default store;
