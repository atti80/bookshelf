import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  pgEnum,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
};

export const statusType = pgEnum("notificationType", [
  "draft",
  "published",
  "deleted",
]);

export type StatusType = (typeof statusType.enumValues)[number];

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

export const Article = pgTable("articleTable", {
  id: serial().primaryKey(),
  title: text().notNull(),
  content: text().notNull(),
  authorId: integer()
    .notNull()
    .references(() => User.id),
  status: statusType().notNull().default("draft"),
  linkUrl: text(),
  image: text(),
  isFeatured: boolean().default(false),
  publishedAt: timestamp(),
  ...timestamps,
});

export const Like = pgTable(
  "likeTable",
  {
    userId: integer()
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    articleId: integer()
      .notNull()
      .references(() => Article.id, { onDelete: "cascade" }),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.articleId] })]
);

export const Comment = pgTable(
  "commentTable",
  {
    userId: integer()
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    articleId: integer()
      .notNull()
      .references(() => Article.id, { onDelete: "cascade" }),
    content: text(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.articleId] })]
);

export const Label = pgTable("labelTable", {
  id: serial().primaryKey(),
  name: text().notNull().unique(),
});

export const LabelToArticle = pgTable(
  "labelXArticle",
  {
    labelId: integer()
      .notNull()
      .references(() => Label.id, { onDelete: "cascade" }),
    articleId: integer()
      .notNull()
      .references(() => Article.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.articleId, table.labelId] })]
);

export const Genre = pgTable("genreTable", {
  id: serial().primaryKey(),
  name: text().notNull().unique(),
});

export const GenreToArticle = pgTable(
  "genreXArticle",
  {
    genreId: integer()
      .notNull()
      .references(() => Genre.id, { onDelete: "cascade" }),
    articleId: integer()
      .notNull()
      .references(() => Article.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.articleId, table.genreId] })]
);

export const userRelations = relations(User, ({ many }) => ({
  articles: many(Article),
  comments: many(Comment),
  likes: many(Like),
}));

export const articleRelations = relations(Article, ({ one, many }) => ({
  author: one(User, {
    fields: [Article.authorId],
    references: [User.id],
  }),
  likes: many(Like),
  comments: many(Comment),
  genres: many(GenreToArticle),
  labels: many(LabelToArticle),
}));

export const genreToArticleRelations = relations(GenreToArticle, ({ one }) => ({
  article: one(Article, {
    fields: [GenreToArticle.articleId],
    references: [Article.id],
  }),
  genre: one(Genre, {
    fields: [GenreToArticle.genreId],
    references: [Genre.id],
  }),
}));

export const genreRelations = relations(Genre, ({ many }) => ({
  articles: many(GenreToArticle),
}));

export const labelToArticleRelations = relations(LabelToArticle, ({ one }) => ({
  article: one(Article, {
    fields: [LabelToArticle.articleId],
    references: [Article.id],
  }),
  label: one(Label, {
    fields: [LabelToArticle.labelId],
    references: [Label.id],
  }),
}));

export const labelRelations = relations(Label, ({ many }) => ({
  articles: many(LabelToArticle),
}));

export const likeRelations = relations(Like, ({ one }) => ({
  article: one(Article, {
    fields: [Like.articleId],
    references: [Article.id],
  }),
  user: one(User, {
    fields: [Like.userId],
    references: [User.id],
  }),
}));

export const commentRelations = relations(Comment, ({ one }) => ({
  article: one(Article, {
    fields: [Comment.articleId],
    references: [Article.id],
  }),
  user: one(User, {
    fields: [Comment.userId],
    references: [User.id],
  }),
}));
