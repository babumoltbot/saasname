PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`image` text,
	`google_id` text,
	`tier` text DEFAULT 'free' NOT NULL,
	`generations_used` integer DEFAULT 0 NOT NULL,
	`generations_limit` integer DEFAULT 0 NOT NULL,
	`names_per_generation` integer DEFAULT 0 NOT NULL,
	`stripe_customer_id` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "email", "name", "image", "google_id", "tier", "generations_used", "generations_limit", "names_per_generation", "stripe_customer_id", "created_at", "updated_at") SELECT "id", "email", "name", "image", "google_id", "tier", "generations_used", "generations_limit", "names_per_generation", "stripe_customer_id", "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_google_id_unique` ON `users` (`google_id`);--> statement-breakpoint
ALTER TABLE `generations` ADD `clarifications` text;