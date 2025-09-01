import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  pgEnum,
  boolean,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const timestamps = {
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
};

export const User = pgTable("userTable", {
  id: serial().primaryKey(),
  email: text().notNull().unique(),
  password: text().notNull().unique(),
  salt: text().notNull().unique(),
  name: text(),
  location: text(),
  bio: text(),
  isActive: boolean().default(true),
  isAdmin: boolean().default(false),
  lastLogin: timestamp(),
  ...timestamps,
});

export const Like = pgTable(
  "likeTable",
  {
    userId: integer().notNull(),
    articleId: integer().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.articleId] })]
);

export const Comment = pgTable("commentTable", {
  id: serial().primaryKey(),
  userId: integer().notNull(),
  articleId: integer().notNull(),
  content: text(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const Language = pgTable("languages", {
  code: varchar({ length: 5 }).notNull().primaryKey(),
  name: varchar({ length: 50 }).notNull(),
  isActive: boolean().notNull().default(true),
});

export const Translation = pgTable(
  "translations",
  {
    translationKey: varchar({ length: 255 }).notNull(),
    languageCode: varchar({ length: 5 })
      .notNull()
      .references(() => Language.code),
    translationText: text().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.translationKey, table.languageCode] }),
  ]
);

export const likeRelations = relations(Like, ({ one }) => ({
  user: one(User, {
    fields: [Like.userId],
    references: [User.id],
  }),
}));

export const commentRelations = relations(Comment, ({ one }) => ({
  user: one(User, {
    fields: [Comment.userId],
    references: [User.id],
  }),
}));

export const userRelations = relations(User, ({ many }) => ({
  comments: many(Comment),
  likes: many(Like),
}));
