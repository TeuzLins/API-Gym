import bcrypt from 'bcryptjs';
import { PrismaClient, Role, MuscleGroup, Equipment } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@gymtrack.com';
  const passwordHash = await bcrypt.hash('Admin@123', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Administrador',
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const exercises = [
    { name: 'Supino reto', muscleGroup: MuscleGroup.CHEST, equipment: Equipment.BARBELL },
    { name: 'Agachamento livre', muscleGroup: MuscleGroup.LEGS, equipment: Equipment.BARBELL },
    { name: 'Remada curvada', muscleGroup: MuscleGroup.BACK, equipment: Equipment.BARBELL },
  ];

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {},
      create: exercise,
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
