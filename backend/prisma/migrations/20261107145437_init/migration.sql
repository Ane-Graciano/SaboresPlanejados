-- CreateTable
CREATE TABLE `Categoria` (
    `id` VARCHAR(191) NOT NULL,
    `emoji` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Receita` (
    `id` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `tempo` VARCHAR(191) NOT NULL,
    `categoriaId` VARCHAR(191) NOT NULL,
    `isSaudavel` BOOLEAN NOT NULL,
    `imagem` VARCHAR(191) NOT NULL,
    `avaliacao` DOUBLE NULL,
    `avaliacoesCount` INTEGER NULL,
    `dificuldade` VARCHAR(191) NULL,
    `porcoes` INTEGER NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `chef` VARCHAR(191) NOT NULL,
    `tipoPrato` VARCHAR(191) NOT NULL,
    `culinaria` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReceitaImagem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `ordem` INTEGER NOT NULL,
    `receitaId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ReceitaImagem_receitaId_ordem_key`(`receitaId`, `ordem`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ingrediente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Ingrediente_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReceitaIngrediente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `receitaId` VARCHAR(191) NOT NULL,
    `ingredienteId` INTEGER NOT NULL,
    `qtd` VARCHAR(191) NULL,
    `unidade` VARCHAR(191) NULL,
    `ordem` INTEGER NOT NULL,

    UNIQUE INDEX `ReceitaIngrediente_receitaId_ingredienteId_key`(`receitaId`, `ingredienteId`),
    UNIQUE INDEX `ReceitaIngrediente_receitaId_ordem_key`(`receitaId`, `ordem`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReceitaPasso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `receitaId` VARCHAR(191) NOT NULL,
    `ordem` INTEGER NOT NULL,
    `texto` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ReceitaPasso_receitaId_ordem_key`(`receitaId`, `ordem`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReceitaDica` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `receitaId` VARCHAR(191) NOT NULL,
    `ordem` INTEGER NOT NULL,
    `texto` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ReceitaDica_receitaId_ordem_key`(`receitaId`, `ordem`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tema` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tema_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReceitaTema` (
    `receitaId` VARCHAR(191) NOT NULL,
    `temaId` INTEGER NOT NULL,

    PRIMARY KEY (`receitaId`, `temaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReceitaEstacao` (
    `receitaId` VARCHAR(191) NOT NULL,
    `estacao` ENUM('verao', 'outono', 'inverno', 'primavera') NOT NULL,

    PRIMARY KEY (`receitaId`, `estacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReceitaEpoca` (
    `receitaId` VARCHAR(191) NOT NULL,
    `epoca` ENUM('natal', 'pascoa', 'ano_novo', 'festa_junina') NOT NULL,

    PRIMARY KEY (`receitaId`, `epoca`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Receita` ADD CONSTRAINT `Receita_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReceitaImagem` ADD CONSTRAINT `ReceitaImagem_receitaId_fkey` FOREIGN KEY (`receitaId`) REFERENCES `Receita`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReceitaIngrediente` ADD CONSTRAINT `ReceitaIngrediente_receitaId_fkey` FOREIGN KEY (`receitaId`) REFERENCES `Receita`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReceitaIngrediente` ADD CONSTRAINT `ReceitaIngrediente_ingredienteId_fkey` FOREIGN KEY (`ingredienteId`) REFERENCES `Ingrediente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReceitaPasso` ADD CONSTRAINT `ReceitaPasso_receitaId_fkey` FOREIGN KEY (`receitaId`) REFERENCES `Receita`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReceitaDica` ADD CONSTRAINT `ReceitaDica_receitaId_fkey` FOREIGN KEY (`receitaId`) REFERENCES `Receita`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReceitaTema` ADD CONSTRAINT `ReceitaTema_receitaId_fkey` FOREIGN KEY (`receitaId`) REFERENCES `Receita`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReceitaTema` ADD CONSTRAINT `ReceitaTema_temaId_fkey` FOREIGN KEY (`temaId`) REFERENCES `Tema`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReceitaEstacao` ADD CONSTRAINT `ReceitaEstacao_receitaId_fkey` FOREIGN KEY (`receitaId`) REFERENCES `Receita`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReceitaEpoca` ADD CONSTRAINT `ReceitaEpoca_receitaId_fkey` FOREIGN KEY (`receitaId`) REFERENCES `Receita`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
