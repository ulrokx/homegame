import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()

const createUser = async (prisma: PrismaClient, email: string, name: string) => {
    const user = await prisma.user.upsert({
        where: {
            email
        },
        update: {},
        create: {
            email,
            name,
            image: "https://picsum.photos/128",
            player: {
                connectOrCreate: {
                    create: {
                        email
                    },
                    where: {
                        email
                    }
                }
            }
            
        }
    })
    return user
}

const main = async () => {
    const teddy = await createUser(prisma, "teddy@kgb.gov", "Teddy KGB")
    const mike = await createUser(prisma, "mike@poker.gov", "Mike McDermott")
    const worm = await createUser(prisma, "worm@poker.gov", "Worm")
}

main().then(async () => {
    await prisma.$disconnect()
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})