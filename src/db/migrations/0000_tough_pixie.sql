CREATE TABLE `event_registrations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`member_id` integer NOT NULL,
	`registered_at` integer,
	`status` text DEFAULT 'registered' NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`event_date` integer NOT NULL,
	`location` text,
	`max_attendees` integer,
	`is_public` integer DEFAULT true NOT NULL,
	`member_only` integer DEFAULT false NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`date_of_birth` text,
	`address` text,
	`city` text,
	`state` text,
	`zip_code` text,
	`country` text DEFAULT 'US',
	`bio` text,
	`interests` text,
	`profile_photo` text,
	`membership_type_id` integer,
	`membership_status` text DEFAULT 'pending' NOT NULL,
	`membership_start_date` integer,
	`membership_end_date` integer,
	`member_number` text,
	`is_admin` integer DEFAULT false NOT NULL,
	`notes` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`membership_type_id`) REFERENCES `membership_types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `members_email_unique` ON `members` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `members_member_number_unique` ON `members` (`member_number`);--> statement-breakpoint
CREATE TABLE `membership_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`price` real NOT NULL,
	`duration` integer NOT NULL,
	`benefits` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer
);
