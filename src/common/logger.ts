import chalk from "chalk";
import consoleStamp from "console-stamp";

export class Logger {
    private static hasInit = false;

    private static init() {
        // Add timestamps in front of log messages
        consoleStamp(console, {
            format: ":date(dd/mm/yyyy HH:MM:ss) :label",
        });

        // Log all unhandled promise rejection
        process.on("unhandledRejection", console.error);

        Logger.hasInit = true;
    }

    static error(msg: string) {
        if (!Logger.hasInit) Logger.init();

        console.log(chalk.red("ERROR\t") + msg);
    }

    static info(msg: string) {
        if (!Logger.hasInit) Logger.init();

        console.log(chalk.white("INFO\t") + msg);
    }

    static success(msg: string) {
        if (!Logger.hasInit) Logger.init();

        console.log(chalk.green("SUCCESS\t") + msg);
    }
}
