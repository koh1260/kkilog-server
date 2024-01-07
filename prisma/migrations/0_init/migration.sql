-- CreateTable
CREATE TABLE `categorie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `update_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `category_name` VARCHAR(20) NOT NULL,
    `icon` TEXT NULL,
    `parent_id` INTEGER NULL,

    UNIQUE INDEX `IDX_3b4285082d36cc95b36eb7b682`(`category_name`),
    INDEX `FK_d12ceff0fef09517a40bb59c7a6`(`parent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `update_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `content` TEXT NOT NULL,
    `parent` INTEGER NULL,
    `writer_id` INTEGER NOT NULL,
    `post_id` INTEGER NOT NULL,

    INDEX `FK_8aa21186314ce53c5b61a0e8c93`(`post_id`),
    INDEX `FK_c91a52757c962864d1c93bb85b5`(`writer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comment_like` (
    `comment_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    INDEX `IDX_4a0c128374ff87d4641cab920f`(`comment_id`),
    INDEX `IDX_fd7207639a77fa0f1fea8943b7`(`user_id`),
    PRIMARY KEY (`comment_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `migrations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` BIGINT NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `update_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `public_scope` VARCHAR(255) NOT NULL DEFAULT 'PUBLIC',
    `introduction` VARCHAR(255) NOT NULL,
    `thumbnail` TEXT NOT NULL,
    `likes` INTEGER NOT NULL DEFAULT 0,
    `writer_id` INTEGER NOT NULL,
    `category_id` INTEGER NULL,

    INDEX `FK_388636ba602c312da6026dc9dbc`(`category_id`),
    INDEX `FK_90d79dc6b2cb6d222af76d876a3`(`writer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `update_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `image_url` TEXT NOT NULL,
    `post_id` INTEGER NOT NULL,

    INDEX `FK_c75a6b8c090482abc8597fd7dfc`(`post_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_like` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `update_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `user_id` INTEGER NULL,
    `post_id` INTEGER NULL,

    INDEX `FK_a7ec6ac3dc7a05a9648c418f1ad`(`post_id`),
    INDEX `FK_c635b15915984c8cdb520a1fef3`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `update_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `email` VARCHAR(50) NOT NULL,
    `nickname` VARCHAR(20) NOT NULL,
    `role` VARCHAR(5) NOT NULL,
    `profile_image` TEXT NULL,
    `password` VARCHAR(255) NOT NULL,
    `refresh_token` TEXT NULL,

    UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `categorie` ADD CONSTRAINT `FK_d12ceff0fef09517a40bb59c7a6` FOREIGN KEY (`parent_id`) REFERENCES `categorie`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `FK_8aa21186314ce53c5b61a0e8c93` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `FK_c91a52757c962864d1c93bb85b5` FOREIGN KEY (`writer_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `comment_like` ADD CONSTRAINT `FK_4a0c128374ff87d4641cab920f0` FOREIGN KEY (`comment_id`) REFERENCES `comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment_like` ADD CONSTRAINT `FK_fd7207639a77fa0f1fea8943b78` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `FK_388636ba602c312da6026dc9dbc` FOREIGN KEY (`category_id`) REFERENCES `categorie`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `FK_90d79dc6b2cb6d222af76d876a3` FOREIGN KEY (`writer_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `post_image` ADD CONSTRAINT `FK_c75a6b8c090482abc8597fd7dfc` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `post_like` ADD CONSTRAINT `FK_a7ec6ac3dc7a05a9648c418f1ad` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `post_like` ADD CONSTRAINT `FK_c635b15915984c8cdb520a1fef3` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

