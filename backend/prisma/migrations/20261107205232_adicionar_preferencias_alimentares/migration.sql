-- CreateTable
CREATE TABLE `PreferenciasAlimentares` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firebaseUid` VARCHAR(191) NOT NULL,
    `restricoes` JSON NOT NULL,
    `atualizadoEm` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PreferenciasAlimentares_firebaseUid_key`(`firebaseUid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
