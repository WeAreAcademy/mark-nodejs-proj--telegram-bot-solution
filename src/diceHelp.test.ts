import { assert, it } from "vitest";
import { extractDiceNotationFromCommandText } from "./diceHelp";

//run these tests at prompt with npx vitest - no need to install anything.

it("when no dice notation is supplied, e.g. /roll or /roll@botname", () => {
    assert.strictEqual(extractDiceNotationFromCommandText("/roll"), null);
    assert.strictEqual(extractDiceNotationFromCommandText("/roll "), null);
    assert.strictEqual(
        extractDiceNotationFromCommandText("/roll@neill_bot"),
        null,
    );
    assert.strictEqual(
        extractDiceNotationFromCommandText("/roll@neill_bot   "),
        null,
    );
});
it("when dice notation is supplied, but no bot name", () => {
    assert.strictEqual(
        extractDiceNotationFromCommandText("/roll 3d20"),
        "3d20",
    );
    assert.strictEqual(
        extractDiceNotationFromCommandText("/roll 3d20 + 1d4 - 2d6 + 3"),
        "3d20 + 1d4 - 2d6 + 3",
    );
});

it("with /roll@botname <dice notation here>", () => {
    assert.strictEqual(
        extractDiceNotationFromCommandText("/roll@neill_bot 2d12 + 4d6 + 2"),
        "2d12 + 4d6 + 2",
    );
});

//may also get: /roll 3d20+4d6@neill_bot
it("with /roll <dice-notation-here>@botname", () => {
    assert.strictEqual(
        extractDiceNotationFromCommandText("/roll 2d12 + 4d6 + 2@neill_bot"),
        "2d12 + 4d6 + 2",
    );
});
