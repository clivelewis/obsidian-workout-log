import { Plugin, moment, PluginSettingTab, Setting } from "obsidian";
import WorkoutSettings from "./WorkoutSettings";

export class SettingsTab extends PluginSettingTab {

	private plugin: Plugin;

	constructor(plugin: Plugin) {

		super(plugin.app, plugin);
		this.plugin = plugin;
		this.init();
	}

	private async init() {

		console.log("Initializing settings object...");
		this.loadSettings();
	}

	public display(): void {

		const { containerEl } = this;
		containerEl.empty();

		console.log("Building settings tab...");
		this.createDateSettingElement(containerEl);
		this.createTotalSettingElement(containerEl);
				
	}

	private async loadSettings() {

		const data = await this.plugin.loadData();
		console.log(data);
		WorkoutSettings.setInstance(data);
	}

	private createDateSettingElement(containerEl: HTMLElement): Setting {

		const dateSetting = new Setting(containerEl)
			.setName("Date format")
			.setDesc(this.getDateSettingDescription())
			.addText((text) =>
				text
					.setPlaceholder("YYYY-MM-DD")
					.setValue(WorkoutSettings.getDateFormat())
					.onChange((value: string) => {
						WorkoutSettings.setDateFormat(value);
						dateSetting.setDesc(this.getDateSettingDescription());
						this.plugin.saveData(WorkoutSettings.getInstance());
					})
			);

		return dateSetting;
	}

	private getDateSettingDescription(): DocumentFragment {
		const fragment = new DocumentFragment();
		fragment.createDiv().innerHTML = 
		`Default date format (used by moment.js library)
		<br>
		Your current format looks like this: <b class="u-pop">${moment().format(WorkoutSettings.getDateFormat())}</b>`;
		return fragment;	
	}

	private createTotalSettingElement(containerEl: HTMLElement): Setting {

		const totalSetting = new Setting(containerEl)
		.setName("Total column enabled")
		.setDesc("When toggled, a column with total amount of reps per exercise will be added to the table.")
		.addToggle((toggle) => {
			toggle.setValue(WorkoutSettings.getTotalEnabled());
			toggle.onChange((value: boolean) => {
				WorkoutSettings.setTotalEnabled(value);
				this.plugin.saveData(WorkoutSettings.getInstance());
			})
		});

		return totalSetting;
	}
}
