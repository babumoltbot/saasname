CREATE TABLE `domain_checks` (
	`domain` text PRIMARY KEY NOT NULL,
	`available` integer NOT NULL,
	`checked_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `feature_interest` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`feature` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `generations` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`idea_text` text NOT NULL,
	`names` text NOT NULL,
	`ai_provider` text DEFAULT 'openai' NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`image` text,
	`google_id` text,
	`tier` text DEFAULT 'free' NOT NULL,
	`generations_used` integer DEFAULT 0 NOT NULL,
	`generations_limit` integer DEFAULT 3 NOT NULL,
	`names_per_generation` integer DEFAULT 5 NOT NULL,
	`stripe_customer_id` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_google_id_unique` ON `users` (`google_id`);--> statement-breakpoint
CREATE TABLE `validations` (
	`id` text PRIMARY KEY NOT NULL,
	`generation_id` text NOT NULL,
	`name` text NOT NULL,
	`domains` text,
	`socials` text,
	`trademark` text,
	`competitors` text,
	`brand_score` integer,
	`created_at` integer,
	FOREIGN KEY (`generation_id`) REFERENCES `generations`(`id`) ON UPDATE no action ON DELETE no action
);
