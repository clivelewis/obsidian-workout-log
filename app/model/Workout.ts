/**
 * Represents one workout, which contains a date and a list of exercises.
 */
export class Workout {

    /**
     * @param date The date of the workout. Can be empty, but will be displayed as "No date".
     * @param exercises The list of exercises performed during the workout.
     * @param totalEnabled Whether or not to calculate the total number of reps for all exercises.
     */
    constructor(
        public date: moment.Moment | null = null,
        public exercises: Exercise[] = [],
        public totalEnabled: boolean = false
    ) { }

}

/**
 * Represents an exercise in a workout.
 */
export class Exercise {

    /**
     * @param name The name of the exercise.
     * @param weight The weight used for the exercise.
     * @param weightUnit The unit of measurement for the weight (kg, lbs, level).
     * @param sets The list of reps performed for the exercise. Each array element represents one set.
     */
    constructor(
        public name: string = "",
        public weight: number | null = null,
        public weightUnit: string = "",
        public sets: number[] = []
    ) { }
}