
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkLogs() {
  const logs = await prisma.cameraLog.findMany({
    orderBy: { timestamp: 'desc' },
    take: 5,
  });

  console.log('Recent Camera Logs:');
  logs.forEach(l => {
    console.log(`- ID: ${l.id}, People: ${l.peopleCount}, Confidence: ${l.confidence}, Status: ${l.status}`);
    // console.log(`  Raw: ${JSON.stringify(l.rawResult).slice(0, 100)}...`);
  });
}

checkLogs().finally(() => prisma.$disconnect());
