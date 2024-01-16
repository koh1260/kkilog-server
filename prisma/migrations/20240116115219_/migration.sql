/*
  Warnings:

  - Made the column `user_id` on table `post_like` required. This step will fail if there are existing NULL values in that column.
  - Made the column `post_id` on table `post_like` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `post_like` DROP FOREIGN KEY `FK_a7ec6ac3dc7a05a9648c418f1ad`;

-- DropForeignKey
ALTER TABLE `post_like` DROP FOREIGN KEY `FK_c635b15915984c8cdb520a1fef3`;

-- AlterTable
ALTER TABLE `post_like` MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `post_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `post_like` ADD CONSTRAINT `FK_a7ec6ac3dc7a05a9648c418f1ad` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `post_like` ADD CONSTRAINT `FK_c635b15915984c8cdb520a1fef3` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
