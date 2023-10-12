
export class Workout {

    private _date: string;
    private _exercises: Exercise[] = [];

    private _totalEnabled: boolean;

    public get date(): string {
        return this._date;
    }
    public set date(value: string) {
        this._date = value;
    }

    public get exercises(): Exercise[] {
        return this._exercises;
    }
    public set exercises(value: Exercise[]) {
        this._exercises = value;
    }
    
    public get totalEnabled(): boolean {
        return this._totalEnabled;
    }
    public set totalEnabled(value: boolean) {
        this._totalEnabled = value;
    }
}

export class Exercise {

    private _name: string;
    private _weight: number;
    private _weightUnit: string;
    private _reps: number[] = [];

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get weight(): number {
        return this._weight;
    }
    public set weight(value: number) {
        this._weight = value;
    }

    public get weightUnit(): string {
        return this._weightUnit;
    }
    public set weightUnit(value: string) {
        this._weightUnit = value;
    }

    public get reps(): number[] {
        return this._reps;
    }
    public set reps(value: number[]) {
        this._reps = value;
    }
}

export class ExerciseSet {

    private _weight: number;
    private _reps: number;

    public get reps(): number {
        return this._reps;
    }

    public set reps(value: number) {
        this._reps = value;
    }

    public get weight(): number {
        return this._weight;
    }

    public set weight(value: number) {
        this._weight = value;
    }
}