export interface Section {
	name: string;
	default: {[key: string]: any};
}

export class Settings {
	private static _instance: Settings = null;

	public static instance(): Settings {
		if (!Settings._instance) {
			Settings._instance = new Settings();
		}

		return Settings._instance;
	}

	private constructor() {}
}
