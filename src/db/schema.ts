import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const membershipTypes = sqliteTable("membership_types", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  duration: integer("duration").notNull(), // in months
  benefits: text("benefits").notNull(), // JSON array of benefit strings
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const members = sqliteTable("members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  dateOfBirth: text("date_of_birth"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country").default("US"),
  bio: text("bio"),
  interests: text("interests"), // JSON array of interest strings
  profilePhoto: text("profile_photo"),
  membershipTypeId: integer("membership_type_id").references(() => membershipTypes.id),
  membershipStatus: text("membership_status").notNull().default("pending"), // pending, active, expired, suspended
  membershipStartDate: integer("membership_start_date", { mode: "timestamp" }),
  membershipEndDate: integer("membership_end_date", { mode: "timestamp" }),
  memberNumber: text("member_number").unique(),
  isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  eventDate: integer("event_date", { mode: "timestamp" }).notNull(),
  location: text("location"),
  maxAttendees: integer("max_attendees"),
  isPublic: integer("is_public", { mode: "boolean" }).notNull().default(true),
  memberOnly: integer("member_only", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const eventRegistrations = sqliteTable("event_registrations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventId: integer("event_id").references(() => events.id).notNull(),
  memberId: integer("member_id").references(() => members.id).notNull(),
  registeredAt: integer("registered_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  status: text("status").notNull().default("registered"), // registered, cancelled, attended
});

export type MembershipType = typeof membershipTypes.$inferSelect;
export type NewMembershipType = typeof membershipTypes.$inferInsert;
export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type EventRegistration = typeof eventRegistrations.$inferSelect;
