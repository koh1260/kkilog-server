/*
  Warnings:

  - Made the column `category_id` on table `post` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `FK_388636ba602c312da6026dc9dbc`;

-- AlterTable
ALTER TABLE `post` MODIFY `category_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `FK_388636ba602c312da6026dc9dbc` FOREIGN KEY (`category_id`) REFERENCES `categorie`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
