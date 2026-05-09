import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const brandSeeds = [
  {
    name: 'Daikin',
    irProtocol: 'NEC',
    irConfig: {
      model: 'FTKC',
      powerCode: '0x20DF10EF',
    },
  },
  {
    name: 'Panasonic',
    irProtocol: 'PANASONIC',
    irConfig: {
      model: 'CS-XPU',
      powerCode: '0x40040100BCBD',
    },
  },
  {
    name: 'LG',
    irProtocol: 'LG',
    irConfig: {
      model: 'V10APF',
      powerCode: '0x88C0051',
    },
  },
  {
    name: 'Samsung',
    irProtocol: 'SAMSUNG',
    irConfig: {
      model: 'AR9500',
      powerCode: '0xE0E040BF',
    },
  },
  {
    name: 'Mitsubishi',
    irProtocol: 'MITSUBISHI',
    irConfig: {
      model: 'MSY-GR',
      powerCode: '0x23CB26',
    },
  },
  {
    name: 'Toshiba',
    irProtocol: 'TOSHIBA_AC',
    irConfig: {
      model: 'RAS-H10',
      powerCode: '0xF20D03FC',
    },
  },
  {
    name: 'Sharp',
    irProtocol: 'SHARP_AC',
    irConfig: {
      model: 'AH-XP',
      powerCode: '0xAA5A6A95',
    },
  },
  {
    name: 'Gree',
    irProtocol: 'GREE',
    irConfig: {
      model: 'GWC12',
      powerCode: '0xA15A00FF',
    },
  },
  {
    name: 'Aqua',
    irProtocol: 'AQUA',
    irConfig: {
      model: 'AQA-KCRV',
      powerCode: '0xB24D12ED',
    },
  },
];

async function main(): Promise<void> {
  console.log('========== START SEED ==========');

  /**
   * Seed Brand
   */
  console.log('Seeding brands...');

  for (const brand of brandSeeds) {
    const result = await prisma.brand.upsert({
      where: {
        name: brand.name,
      },
      update: {
        irProtocol: brand.irProtocol,
        irConfig: brand.irConfig,
      },
      create: {
        name: brand.name,
        irProtocol: brand.irProtocol,
        irConfig: brand.irConfig,
      },
    });

    console.log(`✓ Brand done: ${result.name}`);
  }

  console.log('========== BRAND SEED DONE ==========');

  /**
   * Seed Admin User
   */
  console.log('Seeding admin user...');

  const hashedPassword = await bcrypt.hash('123456', 10);

  const adminUser = await prisma.user.upsert({
    where: {
      email: 'admin@smartac.local',
    },
    update: {
      fullName: 'System Admin',
      role: Role.ADMIN,
    },
    create: {
      email: 'admin@smartac.local',
      password: hashedPassword,
      fullName: 'System Admin',
      role: Role.ADMIN,
    },
  });

  console.log(`✓ Admin user done: ${adminUser.email}`);

  console.log('========== USER SEED DONE ==========');

  /**
   * Optional: Seed demo Room
   */
  console.log('Seeding demo room...');

  const room = await prisma.room.upsert({
    where: {
      id: 'demo-room-001',
    },
    update: {},
    create: {
      id: 'demo-room-001',
      name: 'Phòng họp tầng 1',
      location: 'Tầng 1 - Tòa A',
      currentPeople: 5,
      currentTemperature: 27,
      userId: adminUser.id,
    },
  });

  console.log(`✓ Room done: ${room.name}`);

  console.log('========== ROOM SEED DONE ==========');

  /**
   * Optional: Seed Configuration
   */
  console.log('Seeding room configuration...');

  const config = await prisma.configuration.upsert({
    where: {
      roomId: room.id,
    },
    update: {},
    create: {
      roomId: room.id,
      peoplePerAC: 10,
      minTemp: 22,
      maxTemp: 28,
      defaultTemp: 25,
      autoMode: true,
      startTime: '08:00',
      endTime: '18:00',
    },
  });

  console.log(`✓ Configuration done: ${config.id}`);

  console.log('========== CONFIG SEED DONE ==========');

  console.log('========== ALL SEED COMPLETED ==========');
}

main()
  .catch(async (error) => {
    console.error('SEED ERROR:', error);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });