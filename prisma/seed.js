require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    /*prisma.user.deleteMany();
    prisma.timeBlock.deleteMany();
    prisma.appointment.deleteMany();
}*/

const user1 = await prisma.user.upsert({
    where: {
        email: "paulo.galarza@example.com"
    },
    update: {},
    create: {
        name: "Paulo Galarza",
        email: "paulo.galarza@example.com",
        password: "admin123",
        role: "ADMIN"
    }
});
const user2 = await prisma.user.upsert({
    where: {
        email: "julian.galarza@example.com"
    },
    update: {},
    create: {
        name: "Julian Galarza",
        email: "julian.galarza@example.com",
        password: "user123",
        role: "USER"
    }
});

    //Crear bloques de tiempo
    const timeBlock1 = await prisma.timeBlock.create({
        data: {
            startTime: new Date('2026-10-27T09:00:00Z'),
            endTime: new Date("2026-10-27T11:00:00Z"),
        }
    });

    const timeBlock2 = await prisma.timeBlock.create({
        data: {
            startTime: new Date('2026-10-27T10:00:00Z'),
            endTime: new Date("2026-10-27T11:00:00Z"),
        }
    });

    //Crear citas
    await prisma.appointment.create({
        data: {
            date: new Date("2026-10-26T09:00:00Z"),
            user: {
                connect: {
                    id: user1.id,
                },
            },
                timeBlock: {
                    connect: {
                        id: timeBlock1.id,
                    },
                },
            },
    });

    await prisma.appointment.create({
        data: {
            date: new Date("2026-10-26T09:00:00Z"),
            user: {
                connect: {
                    id: user2.id,
                },
            },
            timeBlock: {
                    connect: {
                        id: timeBlock2.id,
                    },
                },
            },
    });    
}
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });