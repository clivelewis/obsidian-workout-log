import { Workout } from "app/model/Workout";
import { Table } from "./Table";


/**
 * Class that parses a {@link Workout} object into an HTML table.
 */
export default class TableParser {

    public static toHtmlTable(workout: Workout): HTMLTableElement {

        const table = new Table();
        const largestSetCount = Math.max(...workout.exercises.map(exercise => exercise.sets.length));

        // Generate table header
        const headerRow = table.addRow();
        headerRow.addColumn("Exercise");
        headerRow.addColumn("Weight");

        for (let i = 1; i <= largestSetCount; i++) {
            headerRow.addColumn(`Set ${i}`);
        }

        if (workout.totalEnabled) {
            headerRow.addColumn("Total");
        }

        // Populate table with exercise data
        for (const exercise of workout.exercises) {
            const tableRow = table.addRow();
            tableRow.addColumn(exercise.name);

            tableRow.addColumn(exercise.weight ? `${exercise.weight} <sup>${exercise.weightUnit}</sup>` : "");

            for (let i = 0; i < largestSetCount; i++) {
                if (exercise.sets[i]) tableRow.addColumn(exercise.sets[i].toString());
                else tableRow.addColumn("");
            }

            if (workout.totalEnabled) {
                const totalRepCount = exercise.sets.reduce((a, b) => a + b, 0);
                const totalColumn = totalRepCount > 0 ? totalRepCount.toString() : "";
                tableRow.addColumn(totalColumn);
            }
        }

        return table.toHtmlTable();
    }
}