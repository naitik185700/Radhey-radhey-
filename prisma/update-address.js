const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Updating boutique address, contact and WhatsApp in database...');

  const settingsToUpdate = [
    { key: 'tagline', value: 'Trendy • Ethnic • Daily Wear | Suits | Co-ords | Palazzo | Kurtis' },
    { key: 'contact_phone', value: '+91 89507 29243' },
    { key: 'whatsapp_number', value: '918950729243' },
    { key: 'store_address', value: 'Near Sach Jewellers, Pul Teliyan, Hisar, Haryana' },
    { key: 'announcement_bar', value: 'Free Shipping on Orders Above ₹999 | Easy 7-Day Returns | WhatsApp Orders: +91 89507 29243' },
  ];

  for (const s of settingsToUpdate) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value, group: 'general' },
    });
  }

  console.log('Database updated with Hisar boutique address and +91 89507 29243 WhatsApp number!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
