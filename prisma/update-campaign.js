const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding 16:9 landscape campaign banners in database...');

  await prisma.banner.deleteMany({});
  await prisma.banner.createMany({
    data: [
      {
        title: 'LUXURY PUNJABI SUITS & DUPATTAS',
        subtitle: 'Ivory & Resham Handcrafted Festive Edit with Intricate Embroidery',
        badge: 'Spring / Summer 2026',
        ctaText: 'Shop The Campaign',
        ctaLink: '/category/suits',
        imageUrl: '/campaign/hero-banner.jpg',
        displayOrder: 1,
        isActive: true,
      },
      {
        title: 'NEW ARRIVALS: CONTEMPORARY ETHNICS',
        subtitle: 'Curated Pastel Kurti Sets, Co-ord Ensembles & Silk Suits',
        badge: 'Trending Now',
        ctaText: 'Explore New In',
        ctaLink: '/shop?newArrival=true',
        imageUrl: '/campaign/new-arrivals-banner.jpg',
        displayOrder: 2,
        isActive: true,
      },
      {
        title: 'THE JAIPUR HERITAGE CRAFT',
        subtitle: 'Pure Modal Satin, Fine Chanderi Silks & Hand Block Prints',
        badge: 'Artisanal Edit',
        ctaText: 'Discover Collection',
        ctaLink: '/shop',
        imageUrl: '/campaign/promo-banner.jpg',
        displayOrder: 3,
        isActive: true,
      },
    ],
  });

  console.log('Database updated with widescreen 16:9 landscape banners!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
