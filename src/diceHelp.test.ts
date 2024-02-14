import { expect, it } from "vitest";
import { extractDiceNotationFromCommandText } from "./diceHelp";

//run these tests at prompt with npx vitest - no need to install anything.

it("when no dice notation is supplied, e.g. /roll or /roll@botname", () => {
    expect(extractDiceNotationFromCommandText("/roll")).toBe(null);
    expect(extractDiceNotationFromCommandText("/roll ")).toBe(null);
    expect(extractDiceNotationFromCommandText("/roll@neill_bot")).toBe(null);
    expect(extractDiceNotationFromCommandText("/roll@neill_bot   ")).toBe(null);
});
it("when dice notation is supplied, but no bot name", () => {
    expect(extractDiceNotationFromCommandText("/roll 3d20")).toBe("3d20");
    expect(extractDiceNotationFromCommandText("/roll 3d20 + 1d4 - 2d6 + 3")).toBe("3d20 + 1d4 - 2d6 + 3");
});

it("with /roll@botname <dice notation here>", () => {
    expect(extractDiceNotationFromCommandText("/roll@neill_bot 2d12 + 4d6 + 2")).toBe("2d12 + 4d6 + 2");
});

//may also get: /roll 3d20+4d6@neill_bot
it("with /roll <dice-notation-here>@botname", () => {
    expect(extractDiceNotationFromCommandText("/roll 2d12 + 4d6 + 2@neill_bot")).toBe("2d12 + 4d6 + 2");
});
