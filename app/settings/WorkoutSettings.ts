import { Plugin } from "obsidian";
import { ViewSortingOptions } from "app/views/ViewSortingOptions";

export default class WorkoutSettings {

    public static plugin: Plugin;

    private static DEFAULT_DATE_FORMAT = "YYYY-MM-DD";
    private static DEFAULT_VIEW_SORTING_OPTION: ViewSortingOptions = ViewSortingOptions.Occurrence;

    private static instance: WorkoutSettings = new WorkoutSettings();

    // ignore plugin when serializing


    private dateFormat = WorkoutSettings.DEFAULT_DATE_FORMAT;
    private totalEnabled = true;
    private currentViewSorting: ViewSortingOptions = WorkoutSettings.DEFAULT_VIEW_SORTING_OPTION;


    public static getDateFormat(): string {

        if (this.instance.dateFormat.length === 0) {
            return this.DEFAULT_DATE_FORMAT;
        } else {
            return this.instance.dateFormat;
        }
    }

    public static setDateFormat(value: string) {

        this.instance.dateFormat = value;
        this.plugin.saveData(this.instance);
    }

    public static getTotalEnabled(): boolean {

        return this.instance.totalEnabled;
    }

    public static setTotalEnabled(value: boolean) {

        this.instance.totalEnabled = value;
        this.plugin.saveData(this.instance);
    }

    public static getViewSortingOption(): ViewSortingOptions {
            
        return this.instance.currentViewSorting;
    }

    public static setViewSortingOption(selectedSort: ViewSortingOptions) {
        
        console.log("setting");
        this.instance.currentViewSorting = selectedSort;
        this.plugin.saveData(this.instance);
    }

    public static getInstance() {

        return this.instance;
    }

    public static setInstance(settings: WorkoutSettings): void {

        if (settings) {
            this.instance = settings;
        }

    }

}