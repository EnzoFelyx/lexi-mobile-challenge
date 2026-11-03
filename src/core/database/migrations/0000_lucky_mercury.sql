CREATE TABLE `favorites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text,
	`word` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `favorites_user_word_idx` ON `favorites` ((CASE WHEN "user_id" IS NULL THEN '' ELSE "user_id" END),`word`);--> statement-breakpoint
CREATE TABLE `history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text,
	`word` text NOT NULL,
	`viewed_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `history_user_word_idx` ON `history` ((CASE WHEN "user_id" IS NULL THEN '' ELSE "user_id" END),`word`);--> statement-breakpoint
CREATE INDEX `history_viewed_at_idx` ON `history` (`viewed_at`);--> statement-breakpoint
CREATE TABLE `word_cache` (
	`word` text PRIMARY KEY NOT NULL,
	`payload` text,
	`status` text NOT NULL,
	`fetched_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `words` (
	`word` text PRIMARY KEY NOT NULL,
	`sort_key` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `words_sort_key_word_idx` ON `words` (`sort_key`,`word`);