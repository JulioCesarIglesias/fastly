import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

//
// ==============================
// AUTH (Better Auth)
// ==============================
//

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),

  plan: text("plan"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const sessionsTable = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),

  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),

  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const accountsTable = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),

  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),

  scope: text("scope"),
  password: text("password"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const verificationsTable = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),

  expiresAt: timestamp("expires_at").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

//
// ==============================
// ENUMS
// ==============================
//

export const confirmationStatusEnum = pgEnum("confirmation_status", [
  "confirmed",
  "cancelled",
]);

//
// ==============================
// EVENTS
// ==============================
//

export const eventsTable = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  description: text("description"),

  date: timestamp("date").notNull(),
  time: time("time"),

  location: text("location"),

  confirmationDeadline: timestamp("confirmation_deadline"),
  imageUrl: text("image_url"),

  // Configuração
  maxAdults: integer("max_adults").notNull(),
  allowChildren: boolean("allow_children").notNull().default(false),
  maxChildren: integer("max_children"),

  isActive: boolean("is_active").notNull().default(true),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const eventsTableRelations = relations(eventsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [eventsTable.userId],
    references: [usersTable.id],
  }),
  confirmations: many(confirmationsTable),
}));

//
// ==============================
// CONFIRMATIONS (RSVP)
// ==============================
//

export const confirmationsTable = pgTable(
  "confirmations",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    eventId: uuid("event_id")
      .notNull()
      .references(() => eventsTable.id, { onDelete: "cascade" }),

    name: text("name").notNull(),

    // IMPORTANTE: salvar normalizado (ex: 5511999999999)
    phone: text("phone").notNull(),

    adultsCount: integer("adults_count").notNull(),
    childrenCount: integer("children_count"),

    note: text("note"),

    status: confirmationStatusEnum("status").notNull().default("confirmed"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    // Evita duplicidade de telefone no mesmo evento
    uniquePhonePerEvent: uniqueIndex("unique_phone_per_event").on(
      table.eventId,
      table.phone,
    ),

    // Performance
    eventIndex: index("confirmation_event_idx").on(table.eventId),
  }),
);

export const confirmationsTableRelations = relations(
  confirmationsTable,
  ({ one }) => ({
    event: one(eventsTable, {
      fields: [confirmationsTable.eventId],
      references: [eventsTable.id],
    }),
  }),
);

//
// ==============================
// USER RELATIONS
// ==============================
//

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  events: many(eventsTable),
}));
