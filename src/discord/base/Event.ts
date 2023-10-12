import { log } from "@/settings";
import ck from "chalk";
import { ClientEvents } from "discord.js";

type EventData<Key extends keyof ClientEvents> = {
    name: Key,
    once?: boolean,
    run(...args: ClientEvents[Key]): any,
}

export class Event<Key extends keyof ClientEvents> {
    public static all: Array<EventData<keyof ClientEvents>> = [];
    constructor(data: EventData<Key>){
        log.success(
            ck.green(`${ck.yellow.underline(data.name)} registered successfully!`)
        );
        Event.all.push(data);
    }
}