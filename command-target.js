export class HTMLCommandTargetElement extends HTMLElement {
	#commands = new Map();
	#registryOpen = true;

	constructor({
		commands,
		error: {
			name = 'error',
			bubbles = false,
			cancelable = false,
		} = {}
	} = {}) {
		super();

		this.addEventListener('command', async event => {
			if (this.#commands.has(event.command)) {
				const cb = this.#commands.get(event.command);

				await Promise.try(cb, event).catch(error => {
					if (error instanceof Error) {
						const event = new ErrorEvent(name, {
							message: error.message,
							error,
							bubbles,
							cancelable,
							// Not standard but helpful where supported
							filename: error.fileName,
							lineno: error.lineNumber,
							colno: error.columnNumber,
						});

						this.dispatchEvent(event);
					} else if (typeof error === 'string') {
						const event = new ErrorEvent(name, {
							message: error,
							bubbles,
							cancelable
						});

						this.dispatchEvent(event);
					}
				});
			}
		});

		if (typeof commands === 'object') {
			for (const [command, callback] of Object.entries(commands)) {
				this.registerCommand(`--${command}`, callback);
			}
		}
	}

	registerCommand(command, callback) {
		if (typeof command !== 'string' || ! command.startsWith('--')) {
			throw new TypeError(`Invalid command "${command}". Commands must be strings prefixed with "--".`);
		} else if (typeof callback !== 'function') {
			throw new TypeError('Callbacks for commands must be functions.');
		} else if (this.#commands.has(command)) {
			throw new Error(`Command "${command}" already registered.`);
		} else if (! this.#registryOpen) {
			throw new Error('Attempting to register command with a closed registry.');
		} else {
			this.#commands.set(command, callback.bind(this));
		}
	}

	closeCommandRegistry() {
		if (this.#registryOpen) {
			this.#registryOpen = false;
			return true;
		} else {
			return false;
		}
	}

	isCommandRegsitryOpen() {
		return this.#registryOpen;
	}

	hasCommand(command) {
		return typeof command === 'string' && this.#commands.has(command);
	}

	getCommands() {
		return this.#commands.keys();
	}
}
