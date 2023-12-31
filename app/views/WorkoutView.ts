import { Exercise, Workout } from "app/model/Workout";
import WorkoutParser from "app/model/WorkoutParser";
import WorkoutSettings from "app/settings/WorkoutSettings";
import { ItemView, TFile, WorkspaceLeaf, moment } from "obsidian";
import { ViewSortingOptions } from "./ViewSortingOptions";


export class WorkoutView extends ItemView {

    public static WORKOUT_VIEW_TYPE = "workout-log-view";

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    public async onOpen() {

        const container = this.containerEl.children[1];

        // Let the users select/copy text.
        this.containerEl.style.userSelect = "text";

        // Update the view when the file is modified.
        this.registerEvent(this.app.vault.on('modify', (file) => {
            const activeFile = this.app.workspace.getActiveFile();
            if (activeFile && file.path === activeFile.path) {
                this.createWorkoutView(container);
            }
        }));

        // Update the view when the another file is opened.
        this.registerEvent(
            this.app.workspace.on('file-open', () => {
              this.createWorkoutView(container);
            })
          );


        this.createWorkoutView(container);
    }

    private async createWorkoutView(container: Element): Promise<void> {

        container.empty();
        const leaf = this.app.workspace.getMostRecentLeaf();
        if (leaf) {

            container.createEl("h1", { text: "Workout Summary" });

            const workouts = await this.readWorkoutsFromFile(leaf);

            if (workouts.length === 0) {
                container.createEl("h3", { text: "No workout found" });
                return;
            }

            this.addSubheader(container, workouts);
            container.createEl("hr");
            this.displayWorkouts(container, workouts);
        }
    }

    /**
     * Reads current file, parses all 'workout' code blocks and converts them to {@link Workout} objects.
     * @param leaf 
     * @returns array of workouts. If no workouts are found, an empty array is returned.
     */
    private async readWorkoutsFromFile(leaf: WorkspaceLeaf): Promise<Workout[]> {

        const workouts: Workout[] = [];

        const filePath = leaf.getViewState().state?.file;
        if (filePath && typeof filePath === 'string') {

            const file = this.app.vault.getAbstractFileByPath(filePath);
            if (file instanceof TFile) {
                const content = await this.app.vault.cachedRead(file);

                // get all code blocks with the language "workout" using regex
                const regex = /```workout\n([\s\S]*?)```/g;

                let match;
                while ((match = regex.exec(content)) !== null) {
                    workouts.push(WorkoutParser.parse(match[1]));
                }
            }
        }

        return workouts;
    }

    /**
     * Creates the subheader with the total number of workouts and the sorting dropdown.
     * @param container View container
     * @param workouts array of workouts
     */
    private addSubheader(container: Element, workouts: Workout[]): void {

        const subHeaderContainer = container.createDiv("sub-header-container");
        subHeaderContainer.createEl("p", { text: `Total Workouts: ${workouts.length}` });

        const sortContainer = subHeaderContainer.createDiv("sort-container");
        sortContainer.style.textAlign = "right";
        sortContainer.createEl("label", { text: "↕️ Sort By: " });

        const select = sortContainer.createEl("select");
        select.id = "sortDropdown";

        for (const sortingOption in ViewSortingOptions) {
            const optionElement = sortContainer.createEl("option");
            optionElement.value = sortingOption;
            optionElement.textContent = sortingOption;
            select.appendChild(optionElement);
        }

        select.value = WorkoutSettings.getViewSortingOption();

        const setCurrentSort = (selectedSort: ViewSortingOptions) => {
            WorkoutSettings.setViewSortingOption(selectedSort);
            this.displayWorkouts(container, workouts);
        };

        select.addEventListener("change", function () {

            switch (select.value) {
                case ViewSortingOptions.Oldest:
                    setCurrentSort(ViewSortingOptions.Oldest);
                    break;
                case ViewSortingOptions.Newest:
                    setCurrentSort(ViewSortingOptions.Newest);
                    break;
                case ViewSortingOptions.Date:
                    setCurrentSort(ViewSortingOptions.Date);
                    break;
                default:
                    break;
            }
        });
    }
    
    private displayWorkouts(container: Element, workouts: Workout[]): void {

        // Don't modify the original array
        workouts = [...workouts];

        // find div with class workout-container
        let workoutContainer = container.find(".workout-container");

        if (workoutContainer) {
            workoutContainer.remove();
        }

        workoutContainer = container.createDiv("workout-container");

        // Sort workouts by date
        if (WorkoutSettings.getViewSortingOption() === ViewSortingOptions.Date) {
            workouts.sort((a, b) => {

                if (!a.date || (!a.date && !b.date)) return 1;
                if (!b.date) return -1;

                return moment(a.date, WorkoutSettings.getDateFormat())
                    .isBefore(moment(b.date, WorkoutSettings.getDateFormat())) ? 1 : -1;
            });

        } else if (WorkoutSettings.getViewSortingOption() === ViewSortingOptions.Oldest) {
            // Do nothing and let the workouts be displayed in the order they were added to the file.
        } else if (WorkoutSettings.getViewSortingOption() === ViewSortingOptions.Newest) {
            workouts.reverse();
        }

        for (const workout of workouts) {
            const workoutBox = workoutContainer.createDiv("workout");

            workoutBox.style.paddingLeft = "10px";
            workoutBox.style.paddingTop = "5px";
            workoutBox.style.paddingBottom = "5px";
            workoutBox.style.borderBottom = "var(--hr-thickness) solid var(--hr-color)"

            workoutBox.onmouseenter = () => {
                workoutBox.style.backgroundColor = "var(--background-secondary-alt)";
            };
            workoutBox.onmouseleave = () => {
                workoutBox.style.backgroundColor = "var(--background-secondary)";
            };

            const date = "📅 " + (workout.date ? workout.date.format(WorkoutSettings.getDateFormat()) : "No date");

            workoutBox.createEl("h4", { text: date });

            const exercisesMap = new Map<string, Exercise[]>();

            workout.exercises.forEach(exercise => {
                exercisesMap.set(exercise.name, [...exercisesMap.get(exercise.name) ?? [], exercise]);
            });
            let index = 1;


            exercisesMap.forEach((exercises, name) => {
                workoutBox.createEl("div", { text: `${index++}. ${name}`, cls: "setting-item-name" });
                const list = workoutBox.createEl("ul", {}, (ul) => {
                    exercises.forEach(exercise => {
                        ul.createEl("li", {
                            text: this.getExerciseSummaryString(exercise)
                        });
                    });
                });
                list.className = "setting-item-description";
            });
        }

    }

    private getExerciseSummaryString(exercise: Exercise): string {
        let summary = "";

        if (exercise.weight) {
            summary += `${exercise.weight} ${exercise.weightUnit} - `;
        }

        summary += exercise.sets.length;
        summary += exercise.sets.length > 1 ? " sets" : " set";
        summary += ` of ${exercise.sets.join(", ")} reps`
        return summary;
    }

    public getViewType() {
        return WorkoutView.WORKOUT_VIEW_TYPE;
    }

    public getDisplayText() {

        return "Workout Log View";
    }

    async onClose() {
        // Nothing to clean up.
    }
}

