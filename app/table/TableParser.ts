import { Workout } from "app/model/Workout";
import { Table } from "./Table";


export class TableParser {

    public static toHtmlTable(workout: Workout): HTMLTableElement {

        const table = new Table();

        const largestSetCount = Math.max(...workout.exercises.map(exercise => exercise.reps.length));

        const headerRow = table.addRow();
        headerRow.addColumn("Exercise");
        headerRow.addColumn("Weight");

        for (let i = 1; i <= largestSetCount; i++) {
            headerRow.addColumn(`Set ${i}`);
        }

        if (workout.totalEnabled) headerRow.addColumn("Total");

        for (const exercise of workout.exercises) {
            const tableRow = table.addRow();
            tableRow.addColumn(exercise.name);

            tableRow.addColumn(exercise.weight ? `${exercise.weight} <sup>${exercise.weightUnit}</sup>` : "");

            for (let i = 0; i < largestSetCount; i++) {
                if (exercise.reps[i]) tableRow.addColumn(exercise.reps[i].toString());
                else tableRow.addColumn("");
            }

            if (workout.totalEnabled) {
                const totalRepCount = exercise.reps.map(reps => reps).reduce((a, b) => a + b, 0);
                if (totalRepCount > 0) {
                    tableRow.addColumn(totalRepCount.toString());
                } else {
                    tableRow.addColumn("");
                }
            }
        }

        return table.toHtmlTable();
    }
}