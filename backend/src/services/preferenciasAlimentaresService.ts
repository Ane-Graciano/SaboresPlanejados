import prisma from '../lib/prisma';

export const buscarPreferencias = async (firebaseUid: string) => {
  return prisma.preferenciasAlimentares.findUnique({
    where: { firebaseUid },
  });
};

export const salvarPreferencias = async (
  firebaseUid: string,
  restricoes: string[]
) => {
  return prisma.preferenciasAlimentares.upsert({
    where: { firebaseUid },
    update: { restricoes },
    create: {
      firebaseUid,
      restricoes,
    },
  });
};