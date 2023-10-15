import { Plugin } from "obsidian";
import { ViewSortingOptions } from "app/views/ViewSortingOptions";

/**
 * Stateful class that represents the settings of the Obsidian Workout Log plugin.
 * Static reference to the plugin is a bad design, but it was added for simplicity.
 * All setter methods save the settings to the settings file.
 */
export default class WorkoutSettings {

    /**
     * Reference to the plugin instance. Hopefully it won't create any side effects :)
     */
    public static plugin: Plugin;

    /**
     * Default date format. It's the same as the default Obsidian date format.
     */
    private static DEFAULT_DATE_FORMAT = "YYYY-MM-DD";

    /**
     * Default sorting option for {@link WorkoutView}.
     */
    private static DEFAULT_VIEW_SORTING_OPTION: ViewSortingOptions = ViewSortingOptions.Oldest;

    /**
     * Instance of the settings. We instanciate it here to have default values.
     * At the start of the app we override it in {@link SettingsTab} with the values from the settings file.
     */
    private static instance: WorkoutSettings = new WorkoutSettings();


    /**
     * The date format used for displaying dates everywhere in the plugin.
     * */
    private dateFormat = WorkoutSettings.DEFAULT_DATE_FORMAT;

    /**
     * Whether to display the total amount of reps in the code block output.
     * true by default.
     */
    private totalEnabled = true;

    /**
     * The current sorting option for {@link WorkoutView}. Saved for consistency.
     */
    private currentViewSorting: ViewSortingOptions = WorkoutSettings.DEFAULT_VIEW_SORTING_OPTION;


    public static getDateFormat(): string {

        if (this.instance.dateFormat.length === 0) {
            return this.DEFAULT_DATE_FORMAT;
        } else {
            return this.instance.dateFormat;
        }
    }

    public static setDateFormat(value: string): void {

        this.instance.dateFormat = value;
        this.plugin.saveData(this.instance);
    }

    public static getTotalEnabled(): boolean {

        return this.instance.totalEnabled;
    }

    public static setTotalEnabled(value: boolean): void {

        this.instance.totalEnabled = value;
        this.plugin.saveData(this.instance);
    }

    public static getViewSortingOption(): ViewSortingOptions {

        return this.instance.currentViewSorting;
    }

    public static setViewSortingOption(selectedSort: ViewSortingOptions): void {

        this.instance.currentViewSorting = selectedSort;
        this.plugin.saveData(this.instance);
    }

    public static setInstance(settings: WorkoutSettings): void {

        if (settings) {
            this.instance = settings;
        }

    }

}