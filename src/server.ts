import { Telegraf, session } from "telegraf";
import { pickRandom } from "./random";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.BOT_TOKEN) {
    console.error(
        "No BOT_TOKEN env var!  Get one from BotFather and save it in .env file."
    );
    process.exit(1);
}
const bot = new Telegraf(process.env.BOT_TOKEN);

//OPTIONAL: logs incoming messages but it's quite noisy
// bot.use(Telegraf.log());

bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.command("go", (ctx) => ctx.reply("I got the command /go !"));
bot.command("time", (ctx) => ctx.reply(new Date().toTimeString()));

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
            " - check server console for full message details"
    );
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
