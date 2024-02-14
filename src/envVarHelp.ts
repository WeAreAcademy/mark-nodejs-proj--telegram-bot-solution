import dotenv from "dotenv";
dotenv.config();

export function getBotTokenFromEnvironmentVariableOrFail(): string {
    const value = process.env.BOT_TOKEN;

    if (!value) {
        console.error(
            "No BOT_TOKEN env var!  Get one from BotFather and save it in .env file.",
        );
        process.exit(1);
    }
    return value;
}
