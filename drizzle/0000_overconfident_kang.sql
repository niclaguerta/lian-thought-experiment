CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`language` text NOT NULL,
	`group_label` text NOT NULL,
	`moral` text NOT NULL,
	`practical` text NOT NULL,
	`amplificant` text NOT NULL,
	`renunciant` text NOT NULL
);
