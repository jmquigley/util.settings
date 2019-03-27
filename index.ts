export interface SectionKeyVal {
	[key: string]: any;
}

export interface SectionConfig {
	name: string;
	default: SectionKeyVal;
}

export interface Sections {
	[key: string]: SectionKeyVal;
}

export class Settings {
	private static _instance: Settings = null;
	private _root: Sections;

	public static instance(): Settings {
		if (!Settings._instance) {
			Settings._instance = new Settings();
		}

		return Settings._instance;
	}

	private constructor() {}

	get root(): Sections {
		return this._root;
	}
}
