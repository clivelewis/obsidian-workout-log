import { MarkdownPostProcessorContext, Plugin } from "obsidian";
import { TableParser } from "./table/TableParser";
import { SettingsTab } from "./settings/SettingsTab";
import { WorkoutView } from "./views/WorkoutView";
import WorkoutParser from "./model/WorkoutParser";
import WorkoutSettings from "./settings/WorkoutSettings";

export default class InspirationalQuotePlugin extends Plugin {
	private settings: SettingsTab;

	async onload() {

		// Set current plugin instance for static access from the settings.
		WorkoutSettings.plugin = this;

		// Create and register settings tab
		this.settings = new SettingsTab(this);
		this.addSettingTab(this.settings);

		this.registerEvent(this.app.vault.on('modify', (file) => {
			console.log("File modified - " + file.name);
		}));
		
		// Register 'workout' code block
		this.registerMarkdownCodeBlockProcessor(
			"workout",
			(source, element, context) => {
				this.processWorkout(source, element, context);
			}
		);

		// Register workout view
		this.registerView(WorkoutView.WORKOUT_VIEW_TYPE, (leaf) => new WorkoutView(leaf));
		this.addRibbonIcon("dumbbell", "Open workout log view", () => this.activateView());
		this.addCommand({
			id: "open-workout-view",
			name: "Open workout log view",
			callback: () => this.activateView(),
		})
	}

	async onunload() {
		// Nothing to unload.
	}

	private showError(ele: HTMLElement, message: string): void {
		const error = ele.createEl("h4");
		error.innerText = message;
		error.style.color = "red";
	}

	private isValidInput(source: string): boolean {
		return !!source && source.trim().length > 0;
	}

	async activateView() {
		this.app.workspace.detachLeavesOfType(WorkoutView.WORKOUT_VIEW_TYPE);

		await this.app.workspace.getRightLeaf(false).setViewState({
			type: WorkoutView.WORKOUT_VIEW_TYPE,
			active: true,
		});

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(WorkoutView.WORKOUT_VIEW_TYPE)[0]);
	}

	private processWorkout(source: string, element: HTMLElement, context: MarkdownPostProcessorContext): void {

		if (!this.isValidInput(source)) {
			this.showError(element, "Invalid input");
			return;
		}

		const workout = WorkoutParser.parse(source);

		if (workout.date) {
			const title = element.createEl("h4");
			title.innerText = workout.date;
		}

		const htmlTable = TableParser.toHtmlTable(workout);
		element.appendChild(htmlTable);
	}
}
