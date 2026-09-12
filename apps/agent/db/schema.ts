import {sqliteTable,text,integer} from "drizzle-orm/sqlite-core";
export const settings=sqliteTable("settings",{id:text("id").primaryKey(),owner:text("owner").notNull(),value:text("value").notNull()});
export const sessions=sqliteTable("sessions",{id:text("id").primaryKey(),owner:text("owner").notNull(),value:text("value").notNull(),updated:integer("updated").notNull()});
export const checkins=sqliteTable("checkins",{id:text("id").primaryKey(),owner:text("owner").notNull(),day:text("day").notNull(),demo:integer("demo").notNull(),value:text("value").notNull()});
export const locks=sqliteTable("locks",{id:text("id").primaryKey(),token:text("token").notNull(),expires:integer("expires").notNull()});
