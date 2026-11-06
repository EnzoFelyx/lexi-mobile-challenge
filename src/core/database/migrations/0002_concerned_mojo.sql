CREATE TABLE `pending_sync` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`word` text NOT NULL,
	`operation` text NOT NULL,
	`changed_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pending_sync_user_kind_word_idx` ON `pending_sync` (`user_id`,`kind`,`word`);