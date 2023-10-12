import { Event } from "@/discord/base";
import { globalMessage, deleteMember } from "@/functions";

new Event({
  name: "guildMemberRemove",
  run(member) {
    globalMessage({ member, action: "leave" });
    deleteMember(member);
  },
});
