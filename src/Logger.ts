import chalk from "chalk";

export class Logger {

	private static _discordPrefix = chalk.cyan('[ DISCORD ]');
	private static _msgPrefix = chalk.green('[ MESSAGE ]');
	private static _errPrefix = chalk.red('[ ERROR ]');


	static discord(...args: any): void {
		const baseMsg = args.join(" ");
		const msg = `${this._discordPrefix} ${baseMsg}`

		console.log(msg);
	}

	static message(...args: any): void {
		const baseMsg = args.join(" ");
		const msg = `${this._msgPrefix} ${baseMsg}`

		console.log(msg);
	}

	static error(...args: any): void {
		const baseMsg = args.join(" ");
		const msg = `${this._msgPrefix} ${baseMsg}`

		console.log(msg);
	}

}