import axios from "axios";
import fs from "fs";
import { Context } from "telegraf";
//import { File } from "typegram";
export async function downloadVoiceFileFromTelegram(
    details: {
        fileId: string;
        ctx: Context;
    },
    botToken: string,
    onFinish: () => void,
    onError: (err: Error) => void,
) {
    let file = await details.ctx.telegram.getFile(details.fileId);
    const filePath = file.file_path;
    if (!filePath) {
        onError(new Error("No file path in file details"));
        return;
    }

    let fileUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;

    let axiosResponse = await axios({
        method: "GET",
        url: fileUrl,
        responseType: "stream",
    });

    let writer = fs.createWriteStream(
        `./downloadedFiles/${details.fileId}.ogg`,
    );
    axiosResponse.data.pipe(writer);

    writer.on("finish", onFinish);
    writer.on("error", onError);
}
