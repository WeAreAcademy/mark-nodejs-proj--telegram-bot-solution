const messages: string[] = [];

export function getMessages() {
    return [...messages];
}
export function addMessage(msg: string) {
    messages.push(msg);
}
