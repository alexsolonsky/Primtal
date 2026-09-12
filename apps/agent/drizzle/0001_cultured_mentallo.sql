CREATE TABLE `bindings` (
	`owner` text PRIMARY KEY NOT NULL,
	`participant_id` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bindings_participant_id_unique` ON `bindings` (`participant_id`);--> statement-breakpoint
CREATE TABLE `pairings` (
	`owner` text PRIMARY KEY NOT NULL,
	`code_hash` text NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pairings_code_hash_unique` ON `pairings` (`code_hash`);--> statement-breakpoint
CREATE TABLE `participants` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`user_id` text NOT NULL,
	`value` text NOT NULL
);
