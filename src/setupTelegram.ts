import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import axios from "axios";
import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import { extractDiceNotationFromCommandText } from "./diceHelp";
import { addMessage, getMessages } from "./store";

export function setupTelegram() {
    dotenv.config();

    if (!process.env.BOT_TOKEN) {
        console.error(
            "No BOT_TOKEN env var!  Get one from BotFather and save it in .env file.",
        );
        process.exit(1);
    }
    const bot = new Telegraf(process.env.BOT_TOKEN);

    //OPTIONAL: logs incoming messages but it's quite noisy
    bot.use(Telegraf.log());

    bot.start((ctx) => ctx.reply("Welcome"));
    bot.help((ctx) => ctx.reply("Send me a sticker"));
    bot.on("sticker", (ctx) => ctx.reply("👍"));
    bot.hears("hi", (ctx) => ctx.reply("Hey there"));
    bot.command("go", (ctx) => ctx.reply("I got the command /go !"));
    bot.command("msg", (ctx) => {
        addMessage(ctx.message.text);
        ctx.reply("I stored your message");
    });
    bot.command("time", (ctx) => ctx.reply(new Date().toTimeString()));
    bot.command("sing", (ctx) => {
        ctx.reply("I don't sing (telegram-bot-solution-ts)");
    });

    //see later for a more complex dice-rolling solution: /roll
    bot.command("dice", (ctx) => {
        ctx.replyWithDice();
    });

    //see later for a more complex dice-rolling solution: /roll
    bot.command("messages", (ctx) => {
        ctx.reply("Messages: " + getMessages().join("\n"));
    });

    bot.command("gif", (ctx) => {
        ctx.replyWithAnimation("https://tenor.com/H1iF.gif");
    });

    //accepts "/roll" for a default, or custom, like "/roll 2620 + 1d4"
    bot.command("roll", (ctx) => {
        const diceNotation =
            extractDiceNotationFromCommandText(ctx.message.text) ?? "2d6";
        //https://dice-roller.github.io/documentation/guide/usage.html#rolling-dice
        let roll = new DiceRoll(diceNotation);
        ctx.reply(roll.toString());
    });

    bot.command("joke", async (ctx) => {
        try {
            const response = await axios.get("https://icanhazdadjoke.com/", {
                headers: { Accept: "application/json" },
            });
            console.log(response.data);
            ctx.reply(response.data.joke);
        } catch (error) {
            ctx.reply("Hmm, I can't seem to think of any, sorry. (error)");
            console.error("When fetching or processing joke: ", error);
        }
    });

    //message: "/dog spaniel"
    bot.command("dog", async (ctx) => {
        //1. get the breed from the command text
        const parts = ctx.message.text.split(" ");
        if (parts.length <= 1) {
            return ctx.reply("Missing breed.  Try /dog spaniel");
        }
        const breed = parts[1];

        2; //fetch a random image URL for this breed, from the dog API
        const url = `https://dog.ceo/api/breed/${breed}/images/random`;

        try {
            const response = await axios.get(url);

            //just an example response, unused
            const exampleResponse = {
                message:
                    "https://images.dog.ceo/breeds/hound-blood/n02088466_10335.jpg",
                status: "success",
            };

            const photoURL = response.data.message;

            //3. reply with photo
            ctx.replyWithPhoto(photoURL);
        } catch (error) {
            //TODO: this too-wide try-catch is hiding too
            //many possible errors unrelated to the fetch.
            //Write a function that does the fetch and ALWAYS returns a value (Either Error RandomPhotoData)
            ctx.reply("Error - maybe try a different breed?");
        }
    });

    bot.command("fortune", async (ctx) => {
        try {
            const response = await axios.get("http://yerkee.com/api/fortune");
            ctx.reply(response.data.fortune);
        } catch (error) {
            ctx.reply("Your future is not clear to me (error)");
            console.error("When fetching or processing fortune: ", error);
        }
    });

    //The function used by this command is broken
    bot.command("photo", (ctx) => {
        const randomPhotoURL = "https://picsum.photos/200/300/?random";
        ctx.replyWithPhoto({ url: randomPhotoURL });
    });

    //The function used by this command is broken
    bot.command("debug", (ctx) => {
        console.log(ctx.message);
        console.log(ctx.message.from.first_name);
        ctx.reply(
            "You sent: " +
                ctx.message.text +
                " - check server console for full message details",
        );
    });

    bot.launch();

    return bot;
}
