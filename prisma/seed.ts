import { PrismaClient } from "@prisma/client";
import { Picsum } from "picsum-photos";

const prisma = new PrismaClient();

const createUser = async (
  prisma: PrismaClient,
  email: string,
  name: string,
) => {
  const user = await prisma.user.upsert({
    where: {
      email,
    },
    update: {},
    create: {
      email,
      name,
      image: Picsum.url({ height: 128, cache: false }),
      player: {
        connectOrCreate: {
          create: {
            email,
          },
          where: {
            email,
          },
        },
      },
    },
  });
  return user;
};

const main = async () => {
  await createUser(prisma, "teddy@kgb.gov", "Teddy KGB");
  await createUser(prisma, "mike@poker.gov", "Mike McDermott");
  await createUser(prisma, "worm@poker.gov", "Worm");
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
