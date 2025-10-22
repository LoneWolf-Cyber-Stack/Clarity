


import { IndexedEntity, Index } from "./core-utils";
import type { JournalEntry, User } from "@shared/types";interface Env {
  id?: string | number;

  [key: string]: unknown;
}interface Env {id?: string | number;[key: string]: unknown;}interface Env {id?: string | number;[key: string]: unknown;}export class UserEntity extends IndexedEntity<User> {static readonly entityName = "user";static readonly indexName = "users";
  static readonly initialState: User = {
    id: "",
    createdAt: 0
  };
}

export class JournalEntryEntity extends IndexedEntity<JournalEntry> {
  static readonly entityName = "journalEntry";

  static indexName(userId: string) {
    return `journalEntries:${userId}`;
  }
  static readonly initialState: JournalEntry = {
    id: "",
    userId: "",
    title: "",
    content: "",
    createdAt: 0,
    updatedAt: 0
  };

  static async create(env: Env, state: JournalEntry): Promise<JournalEntry> {
    const id = this.keyOf(state);
    const inst = new this(env, id);
    await inst.save(state);
    const idx = new Index<string>(env, this.indexName(state.userId));
    await idx.add(id);
    return state;
  }
  static async list(
  env: Env,
  userId: string,
  cursor?: string | null,
  limit?: number)
  : Promise<{items: JournalEntry[];next: string | null;}> {
    const idx = new Index<string>(env, this.indexName(userId));
    const { items: ids, next } = await idx.page(cursor, limit);
    const rows = (await Promise.all(ids.map((id) => new this(env, id).getState()))) as JournalEntry[];
    return { items: rows, next };
  }
  static async delete(env: Env, userId: string, id: string): Promise<boolean> {
    const inst = new this(env, id);
    const existed = await inst.delete();
    if (existed) {
      const idx = new Index<string>(env, this.indexName(userId));
      await idx.remove(id);
    }
    return existed;
  }
}