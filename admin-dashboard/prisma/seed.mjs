import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient({
  datasourceUrl: "file:./dev.db"
});

async function main() {
  console.log("🌱 Starting seeding...");

  await prisma.analyticsSnapshot.deleteMany();
  await prisma.verificationLog.deleteMany();
  await prisma.changeLog.deleteMany();
  await prisma.ecosystem.deleteMany();

  // 1. Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: "Cinema Machina",
      tagline: "The Art of the Home Cinema Experience",
      contactEmail: "cinemamachina.ae@gmail.com",
      phoneNumber: "+971 50 728 2195",
      vimeoUrl: "https://player.vimeo.com/video/1180098392",
      primaryBronze: "#E2C19B",
    },
  });

  // 2. Ecosystems
  const ecosystems = [
    { name: "Plex", logoPath: "/assets/logos/plex.png", sortOrder: 1 },
    { name: "Apple TV", logoPath: "/assets/logos/appletv.png", sortOrder: 2 },
    { name: "Kodi", logoPath: "/assets/logos/kodi.png", sortOrder: 3 },
    { name: "Nvidia Shield", logoPath: "/assets/logos/nvidia.png", sortOrder: 4 },
    { name: "Dune HD", logoPath: "/assets/logos/dune.png", sortOrder: 5 },
  ];

  for (const eco of ecosystems) {
    await prisma.ecosystem.create({
      data: eco,
    });
  }

  // 3. Initial Logs
  await prisma.verificationLog.create({
    data: {
      date: new Date(),
      testName: "Initial Dashboard Scaffolding",
      resultStatus: "PASS",
      details: "Successfully initialized the premium dashboard UI and database layer.",
    },
  });

  await prisma.changeLog.create({
    data: {
      date: new Date(),
      description: "Initialized Prisma 7 Database & Scaffolded Admin Dashboard",
      version: "0.1.0",
    },
  });

  // 4. Analytics Mock
  await prisma.analyticsSnapshot.create({
    data: {
      snapshotDate: new Date(),
      visitorsCount: 1240,
      pageViews: 4820,
      conversionRate: 3.2,
    },
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
