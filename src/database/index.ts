import { firebaseAccount } from "@/settings";
import firebase, { credential } from "firebase-admin";
import * as typesaurs from "typesaurus";

import { UserDocument } from "./documents/UserDocument";
import { GuildDocument } from "./documents/GuildDocument";

firebase.initializeApp({ credential: credential.cert(firebaseAccount) });

const db = {
  users: typesaurs.collection<UserDocument>("users"),
  usersKeys: typesaurs.collection<Required<UserDocument>>("users"),
  /**
   *  yourCollectionName: typesaurs.collection<YourCollectionDocument>("yourCollectionName"),
   *  examples:
   *  guilds: typesaurs.collection<GuildDocument>("guilds"),
   *  logs: typesaurs.collection<LogDocument>("logs"),
   */
  guilds: typesaurs.collection<GuildDocument>("guilds"),
  guildsKeys: typesaurs.collection<Required<GuildDocument>>("guilds"),
  ...typesaurs,
  async get<Model>(collection: typesaurs.Collection<Model>, id: string) {
    return (await typesaurs.get<Model>(collection, id))?.data;
  },
  async delete<Model>(collection: typesaurs.Collection<Model>, id: string) {
    return await typesaurs.remove<Model>(collection, id);
  },
  getFull: typesaurs.get,
};

export { db };

export * from "./documents/UserDocument";
export * from "./documents/GuildDocument";
export * from "./functions/register";

/**
 * Export all Document Interfaces
 *
 * export * from "./documents/otherDocuments";
 * export * from "./documents/otherDocuments";
 */
