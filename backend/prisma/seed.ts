
import 'dotenv/config';

import prisma from '../src/lib/prisma';
import { receitas } from '../src/data/receitas';

const categorias = [
  { id: '1', emoji: '🍝', label: 'Massas' },
  { id: '2', emoji: '🥩', label: 'Carnes' },
  { id: '3', emoji: '🥗', label: 'Saladas' },
  { id: '4', emoji: '🍮', label: 'Sobremesas' },
  { id: '5', emoji: '🥤', label: 'Bebidas' },
  { id: '6', emoji: '☕', label: 'Café da manhã' },
];

async function seed() {
  await prisma.$transaction(async (tx) => {
    // 1. Cadastrar ou atualizar categorias
    for (const categoria of categorias) {
      await tx.categoria.upsert({
        where: { id: categoria.id },
        update: categoria,
        create: categoria,
      });
    }

    // 2. Cadastrar ou atualizar receitas
    for (const receita of receitas) {
      await tx.receita.upsert({
        where: { id: receita.id },
        update: {
          titulo: receita.titulo,
          tempo: receita.tempo,
          dataAdicao: new Date(`${receita.dataAdicao}T00:00:00.000Z`),
          categoriaId: receita.categoriaId,
          isSaudavel: receita.isSaudavel,
          imagem: receita.imagem,
          avaliacao: receita.avaliacao,
          avaliacoesCount: receita.avaliacoesCount,
          dificuldade: receita.dificuldade,
          porcoes: receita.porcoes,
          descricao: receita.descricao,
          historia: receita.historia,
          chef: receita.chef,
          tipoPrato: receita.tipoPrato,
          culinaria: receita.culinaria,
        },
        create: {
          id: receita.id,
          titulo: receita.titulo,
          tempo: receita.tempo,
          dataAdicao: new Date(`${receita.dataAdicao}T00:00:00.000Z`),
          categoriaId: receita.categoriaId,
          isSaudavel: receita.isSaudavel,
          imagem: receita.imagem,
          avaliacao: receita.avaliacao,
          avaliacoesCount: receita.avaliacoesCount,
          dificuldade: receita.dificuldade,
          porcoes: receita.porcoes,
          descricao: receita.descricao,
          historia: receita.historia,
          chef: receita.chef,
          tipoPrato: receita.tipoPrato,
          culinaria: receita.culinaria,
        },
      });

      // 3. Limpar relacionamentos anteriores desta receita
      await tx.receitaImagem.deleteMany({
        where: { receitaId: receita.id },
      });

      await tx.receitaIngrediente.deleteMany({
        where: { receitaId: receita.id },
      });

      await tx.receitaPasso.deleteMany({
        where: { receitaId: receita.id },
      });

      await tx.receitaDica.deleteMany({
        where: { receitaId: receita.id },
      });

      await tx.receitaTema.deleteMany({
        where: { receitaId: receita.id },
      });

      await tx.receitaEstacao.deleteMany({
        where: { receitaId: receita.id },
      });

      await tx.receitaEpoca.deleteMany({
        where: { receitaId: receita.id },
      });

      // 4. Cadastrar imagens adicionais
      // A imagem principal já está armazenada em Receita.imagem.
      const imagensAdicionais = receita.imagens?.slice(1) ?? [];

      if (imagensAdicionais.length > 0) {
        await tx.receitaImagem.createMany({
          data: imagensAdicionais.map((url, index) => ({
            url,
            ordem: index + 1,
            receitaId: receita.id,
          })),
        });
      }

      // 5. Cadastrar ingredientes e relacionamentos
      for (const [index, ingrediente] of receita.ingredientes.entries()) {
        const ingredienteSalvo = await tx.ingrediente.upsert({
          where: { nome: ingrediente.nome },
          update: {},
          create: { nome: ingrediente.nome },
        });

        await tx.receitaIngrediente.create({
          data: {
            receitaId: receita.id,
            ingredienteId: ingredienteSalvo.id,
            qtd:
              ingrediente.qtd === undefined
                ? null
                : String(ingrediente.qtd),
            unidade: ingrediente.unidade,
            ordem: index + 1,
          },
        });
      }

      // 6. Cadastrar passos
      if (receita.passos?.length) {
        await tx.receitaPasso.createMany({
          data: receita.passos.map((texto, index) => ({
            receitaId: receita.id,
            ordem: index + 1,
            texto,
          })),
        });
      }

      // 7. Cadastrar dicas
      if (receita.dicas?.length) {
        await tx.receitaDica.createMany({
          data: receita.dicas.map((texto, index) => ({
            receitaId: receita.id,
            ordem: index + 1,
            texto,
          })),
        });
      }

      // 8. Cadastrar temas
      for (const nome of receita.temas ?? []) {
        const tema = await tx.tema.upsert({
          where: { nome },
          update: {},
          create: { nome },
        });

        await tx.receitaTema.create({
          data: {
            receitaId: receita.id,
            temaId: tema.id,
          },
        });
      }

      // 9. Cadastrar estações
      if (receita.estacoes?.length) {
        await tx.receitaEstacao.createMany({
          data: receita.estacoes.map((estacao) => ({
            receitaId: receita.id,
            estacao,
          })),
        });
      }

      // 10. Cadastrar épocas comemorativas
      if (receita.epocas?.length) {
        await tx.receitaEpoca.createMany({
          data: receita.epocas.map((epoca) => ({
            receitaId: receita.id,
            epoca,
          })),
        });
      }
    }
  });

  console.log('Seed executado com sucesso!');
  console.log(`${categorias.length} categorias cadastradas.`);
  console.log(`${receitas.length} receitas cadastradas.`);
}

seed()
  .catch((erro) => {
    console.error('Erro ao executar o seed:', erro);
    throw erro;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
