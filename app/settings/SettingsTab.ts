import { Plugin, moment, PluginSettingTab, Setting } from "obsidian";
import WorkoutSettings from "./WorkoutSettings";

/**
 * Represents a settings tab for the Obsidian Workout Log plugin.
 */
export class SettingsTab extends PluginSettingTab {

	/**
	 * Reference to the plugin instance.
	 */
	private plugin: Plugin;

	constructor(plugin: Plugin) {

		super(plugin.app, plugin);
		this.plugin = plugin;
		this.loadSettings();
	}

	public display(): void {

		const { containerEl } = this;
		containerEl.empty();

		this.createDateSettingElement(containerEl);
		this.createTotalSettingElement(containerEl);

	}

	private async loadSettings() {

		const data = await this.plugin.loadData();
		WorkoutSettings.setInstance(data);
	}

	/**
	* Creates the date format setting element.
	* @param containerEl - The container element to append the setting to.
	*/
	private createDateSettingElement(containerEl: HTMLElement): void {

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
					})
			);
	}

	/**
	 * Generates the date format setting description depending on the current date format.
	 * @returns The date format setting description.
	 */
	private getDateSettingDescription(): DocumentFragment {
		const fragment = new DocumentFragment();
		fragment.createDiv().innerHTML =
			`Default date format (used by moment.js library)
		<br>
		Your current format looks like this: <b class="u-pop">${moment().format(WorkoutSettings.getDateFormat())}</b>`;
		return fragment;
	}

	/**
	* Creates the total toggle element.
	* @param containerEl - The container element to append the setting to.
	*/
	private createTotalSettingElement(containerEl: HTMLElement): Setting {

		const totalSetting = new Setting(containerEl)
			.setName("Total column enabled")
			.setDesc("When toggled, a column with total amount of reps per exercise will be added to the table.")
			.addToggle((toggle) => {
				toggle.setValue(WorkoutSettings.getTotalEnabled());
				toggle.onChange((value: boolean) => {
					WorkoutSettings.setTotalEnabled(value);
				})
			});

		return totalSetting;
	}
}
