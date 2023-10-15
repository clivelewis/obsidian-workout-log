import { moment } from "obsidian";
import { Exercise, Workout } from "./Workout";
import WorkoutSettings from "app/settings/WorkoutSettings";

export default class WorkoutParser {

    public static parse(source: string): Workout {

        const lines = source
			.split("\n")
			.filter((line) => line.trim().length > 0);
		const firstLine = lines[0];

		const workout = new Workout();
		workout.totalEnabled = WorkoutSettings.getTotalEnabled();

		if (this.isDateLine(firstLine)) {
			const date = moment(firstLine, WorkoutSettings.getDateFormat(), true);
			if (!date.isValid()) {
				// Do something
			}
			console.log(date);
			workout.date = date;
			lines.shift();
		}

		lines.forEach((line) => {
			const exercise = new Exercise();

			line.endsWith(",") ? line = line.substring(0, line.length - 1) : line;
			const entries = line.split(",");
			for (let i = 0; i < entries.length; i++) {
				if (i == 0) exercise.name = entries[i];
				else if (i == 1 && entries[1].contains("kg")) {
					exercise.weight = parseInt(entries[i].replace("kg", ""));
					exercise.weightUnit = "kg";
				} else if (i == 1 && entries[1].contains("lbs")) {
					exercise.weight = parseInt(entries[i].replace("lbs", ""));
					exercise.weightUnit = "lbs";
				} else if (i == 1 && (entries[1].contains("level") || entries[1].contains("lvl"))) {
					exercise.weight = parseInt(entries[i].replace("level", "").replace("lvl", ""));
					exercise.weightUnit = "level";
				} else {
					exercise.sets.push(parseInt(entries[i]));
				}
			}

			workout.exercises.push(exercise);
		});

        return workout;
    }

    private static isDateLine(line: string): boolean {

		return !line.contains(",");
	}
}