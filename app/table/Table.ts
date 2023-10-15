
/**
 * Simple class that represents HTML table structure.
 */
export class Table {

	private _rows: TableRow[] = [];

	public addRow(): TableRow {

		const tableRow = new TableRow();
		this._rows.push(tableRow);
		return tableRow;
	}

	/**
	 * Converts the table to an HTML table element.
	 * @returns The HTML table element.
	 */
	public toHtmlTable(): HTMLTableElement {

		const table: HTMLTableElement = document.createElement("table");
		table.id = "workout-table";
		const head: HTMLTableSectionElement = table.createTHead();
		const body: HTMLTableSectionElement = table.createTBody();
				
		for (let i = 0; i < this._rows.length; i++) {

			const row = this._rows[i];
			const tableRow = i === 0 ? head.insertRow() : body.insertRow();

			for (const column of row.columns) {
				const tableCell = i === 0 ? tableRow.createEl("th") : tableRow.createEl("td");
				tableCell.innerHTML = column.text;
				if (i == 0) tableCell.style.fontSize = "large";
			}
		}

		return table;
	}

}


export class TableRow {
	private _columns: Array<TableColumn> = [];

	public addColumn(column: TableColumn | string): void {

		if (typeof column === "string") {
			this._columns.push(new TableColumn(column));
		} else {
			this._columns.push(column);
		}
	}

	public get columns(): Array<TableColumn> {

		return this._columns;
	}
}

export class TableColumn {

	private _text: string;

	constructor(text: string) {

		this._text = text;
	}

	public get text(): string {

		return this._text;
	}
}
