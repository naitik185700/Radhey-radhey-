const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding full-width edge-to-edge campaign hero banners in database...');

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
        title: 'ROYAL ANARKALI & FESTIVE WEAR',
        subtitle: 'Intricate Zardozi & Resham Embroidery on Pure Heritage Silk',
        badge: 'Festive Spotlight',
        ctaText: 'Explore Anarkalis',
        ctaLink: '/category/suits?subcategory=anarkali-suits',
        imageUrl: '/campaign/anarkali-suits.jpg',
        displayOrder: 3,
        isActive: true,
      },
      {
        title: 'MIDNIGHT PARTY WEAR SUITS',
        subtitle: 'Regal Black & Silver Zardozi Salwar Suits for Grand Occasions',
        badge: 'Evening Exclusive',
        ctaText: 'Shop Party Wear',
        ctaLink: '/category/suits',
        imageUrl: '/campaign/party-wear.jpg',
        displayOrder: 4,
        isActive: true,
      },
      {
        title: 'THE JAIPUR HERITAGE CRAFT',
        subtitle: 'Pure Modal Satin, Fine Chanderi Silks & Hand Block Prints',
        badge: 'Artisanal Edit',
        ctaText: 'Discover Collection',
        ctaLink: '/shop',
        imageUrl: '/campaign/promo-banner.jpg',
        displayOrder: 5,
        isActive: true,
      },
    ],
  });

  console.log('Successfully updated banners in database with 5 full-bleed campaign slides!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
