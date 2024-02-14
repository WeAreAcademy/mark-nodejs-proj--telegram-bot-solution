export function extractDiceNotationFromCommandText(commandText: string) {
    const afterSpace = getTextAfterFirstSpace(commandText);
    if (!afterSpace) {
        return null;
    }
    //remove any optional bot name from the end of the text.
    return afterSpace.split("@")[0].trim();
}
/**
 * @example "/roll   2d6" -> "2d6"
 * @example "/roll   "    -> null
 */
function getTextAfterFirstSpace(txt: string): string | null {
    const firstSpace = txt.indexOf(" ");
    if (firstSpace === -1) {
        return null;
    }
    return txt.slice(firstSpace + 1).trim();
}
