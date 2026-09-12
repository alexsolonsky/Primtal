import {sqliteTable,text,integer} from "drizzle-orm/sqlite-core";
export const settings=sqliteTable("settings",{id:text("id").primaryKey(),owner:text("owner").notNull(),value:text("value").notNull()});
export const sessions=sqliteTable("sessions",{id:text("id").primaryKey(),owner:text("owner").notNull(),value:text("value").notNull(),updated:integer("updated").notNull()});
export const checkins=sqliteTable("checkins",{id:text("id").primaryKey(),owner:text("owner").notNull(),day:text("day").notNull(),demo:integer("demo").notNull(),value:text("value").notNull()});
export const locks=sqliteTable("locks",{id:text("id").primaryKey(),token:text("token").notNull(),expires:integer("expires").notNull()});
export const participants=sqliteTable('participants',{id:text('id').primaryKey(),workspaceId:text('workspace_id').notNull(),userId:text('user_id').notNull(),value:text('value').notNull()});
export const bindings=sqliteTable('bindings',{owner:text('owner').primaryKey(),participantId:text('participant_id').notNull().unique()});
export const pairings=sqliteTable('pairings',{owner:text('owner').primaryKey(),codeHash:text('code_hash').notNull().unique(),expires:integer('expires').notNull()});
