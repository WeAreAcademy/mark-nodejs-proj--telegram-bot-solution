import { setupExpress } from "./setupExpress";
import { setupTelegram } from "./setupTelegram";

const bot = setupTelegram();

const { app, server } = setupExpress();

// Enable relatively graceful stop
process.once("SIGTERM", () => stopBotAndExpress("SIGTERM"));
process.once("SIGINT", () => stopBotAndExpress("SIGINT"));

function stopBotAndExpress(signal: "SIGTERM" | "SIGINT") {
    console.log("signalling bot and express to stop");
    bot.stop(signal);
    server.close((x) => process.exit(0));
    setTimeout(() => process.exit(1), 2000);
}
