import { PrismaClient, Role, DropStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Load env before anything else
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Demo users ──────────────────────────────────────────────────────────────
  const donorHash = await bcrypt.hash('donor123', 10);
  const recipientHash = await bcrypt.hash('recipient123', 10);

  const donor1 = await prisma.user.upsert({
    where: { email: 'bakery@demo.com' },
    update: {},
    create: {
      email: 'bakery@demo.com',
      passwordHash: donorHash,
      name: 'Kitchener Market Bakery',
      role: Role.DONOR,
    },
  });

  const donor2 = await prisma.user.upsert({
    where: { email: 'bistro@demo.com' },
    update: {},
    create: {
      email: 'bistro@demo.com',
      passwordHash: donorHash,
      name: 'Uptown Bistro',
      role: Role.DONOR,
    },
  });

  const donor3 = await prisma.user.upsert({
    where: { email: 'grocer@demo.com' },
    update: {},
    create: {
      email: 'grocer@demo.com',
      passwordHash: donorHash,
      name: 'Cambridge Organic Grocer',
      role: Role.DONOR,
    },
  });

  await prisma.user.upsert({
    where: { email: 'recipient@demo.com' },
    update: {},
    create: {
      email: 'recipient@demo.com',
      passwordHash: recipientHash,
      name: 'Demo Recipient',
      role: Role.RECIPIENT,
    },
  });

  console.log('✅ Demo users created');

  // ── Demo food drops ──────────────────────────────────────────────────────────
  const now = new Date();

  const drops = [
    {
      donorId: donor1.id,
      donorName: donor1.name,
      donorPhone: '519-555-0101',
      title: 'Fresh Sourdough Loaves',
      description: '10 loaves of fresh sourdough baked this morning. Must go today!',
      quantity: '10 loaves',
      pickupAddress: '300 King St E',
      city: 'Kitchener',
      lat: 43.4497,
      lng: -80.4855,
      pickupStartTime: now,
      availableUntil: new Date(now.getTime() + 4 * 3600_000),
      tags: ['Vegan', 'Bakery'],
      status: DropStatus.AVAILABLE,
      aiSummary: 'Fresh sourdough loaves from a local bakery, perfect for families.',
    },
    {
      donorId: donor2.id,
      donorName: donor2.name,
      donorPhone: '519-555-0202',
      title: 'Halal Pasta Meals',
      description: 'Surplus pasta with marinara. Halal and Vegetarian certified.',
      quantity: '15 portions',
      pickupAddress: '75 King St S',
      city: 'Waterloo',
      lat: 43.4651,
      lng: -80.5223,
      pickupStartTime: now,
      availableUntil: new Date(now.getTime() + 6 * 3600_000),
      tags: ['Halal', 'Vegetarian', 'Hot Meal'],
      status: DropStatus.AVAILABLE,
      aiSummary: 'Nutritious halal pasta meals ready for immediate pickup.',
    },
    {
      donorId: donor3.id,
      donorName: donor3.name,
      donorPhone: '519-555-0303',
      title: 'Mixed Produce Box',
      description: 'Assorted fresh vegetables: carrots, spinach, tomatoes, and peppers. All vegan and gluten-free.',
      quantity: '20 boxes',
      pickupAddress: '55 Hespeler Rd',
      city: 'Cambridge',
      lat: 43.3617,
      lng: -80.3144,
      pickupStartTime: now,
      availableUntil: new Date(now.getTime() + 8 * 3600_000),
      tags: ['Vegan', 'Gluten-Free', 'Fresh Produce'],
      status: DropStatus.AVAILABLE,
      aiSummary: 'Assorted fresh vegetables ideal for anyone seeking nutritious, plant-based food.',
    },
  ];

  for (const drop of drops) {
    await prisma.foodDrop.create({ data: drop });
  }

  console.log('✅ Demo food drops created');
  console.log('\n📋 Demo accounts:');
  console.log('   Donor:     bakery@demo.com / donor123');
  console.log('   Donor:     bistro@demo.com / donor123');
  console.log('   Recipient: recipient@demo.com / recipient123');
  console.log('\n🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
