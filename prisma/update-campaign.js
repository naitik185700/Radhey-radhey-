const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Updating banners with newly generated campaign photography...');
  await prisma.banner.deleteMany({});
  await prisma.banner.createMany({
    data: [
      {
        title: 'LUXURY PUNJABI SUITS & DUPATTAS',
        subtitle: 'Ivory & Resham Handcrafted Festive Edit',
        badge: 'Spring / Summer 2026',
        ctaText: 'Shop The Campaign',
        ctaLink: '/category/suits',
        imageUrl: '/campaign/hero-banner.jpg',
        displayOrder: 1,
        isActive: true,
      },
      {
        title: 'ROYAL ANARKALI & FESTIVE WEAR',
        subtitle: 'Intricate Zardozi & Resham Embroidery on Pure Silk',
        badge: 'Festive Spotlight',
        ctaText: 'Explore Anarkalis',
        ctaLink: '/category/suits?subcategory=anarkali-suits',
        imageUrl: '/campaign/anarkali-suits.jpg',
        displayOrder: 2,
        isActive: true,
      },
      {
        title: 'NEW ARRIVALS: CONTEMPORARY ETHNICS',
        subtitle: 'Curated Pastel Kurti Sets & Co-ord Ensembles',
        badge: 'Trending Now',
        ctaText: 'View New In',
        ctaLink: '/shop?newArrival=true',
        imageUrl: '/campaign/new-arrivals-banner.jpg',
        displayOrder: 3,
        isActive: true,
      },
      {
        title: 'MIDNIGHT PARTY WEAR SUITS',
        subtitle: 'Regal Black & Silver Zardozi Salwar Suits',
        badge: 'Evening Exclusive',
        ctaText: 'Shop Party Wear',
        ctaLink: '/category/suits',
        imageUrl: '/campaign/party-wear.jpg',
        displayOrder: 4,
        isActive: true,
      },
    ],
  });

  console.log('Updating categories with campaign images...');
  const catUpdates = [
    { slug: 'suits', image: '/campaign/punjabi-suits.jpg' },
    { slug: 'kurti-sets', image: '/campaign/kurti-collection.jpg' },
    { slug: 'co-ord-sets', image: '/campaign/coord-sets.jpg' },
    { slug: 'lehengas', image: '/campaign/lehenga-collection.jpg' },
    { slug: 'new-arrivals', image: '/campaign/daily-wear.jpg' },
    { slug: 'sale', image: '/campaign/promo-banner.jpg' },
  ];

  for (const c of catUpdates) {
    await prisma.category.updateMany({
      where: { slug: c.slug },
      data: { image: c.image },
    });
  }

  // Update sample product images with high-fashion photos
  const productBlackSuit = await prisma.product.findFirst({
    where: { slug: 'premium-suit-set' },
  });
  if (productBlackSuit) {
    await prisma.productImage.deleteMany({ where: { productId: productBlackSuit.id } });
    await prisma.productImage.createMany({
      data: [
        { productId: productBlackSuit.id, url: '/campaign/party-wear.jpg', alt: 'Midnight Black Party Wear Suit', isThumbnail: true, displayOrder: 1 },
        { productId: productBlackSuit.id, url: '/campaign/party-wear.jpg', alt: 'Black Party Wear Suit Detail', isThumbnail: false, displayOrder: 2 },
      ],
    });
  }

  const productCoord = await prisma.product.findFirst({
    where: { slug: 'co-ord-set' },
  });
  if (productCoord) {
    await prisma.productImage.deleteMany({ where: { productId: productCoord.id } });
    await prisma.productImage.createMany({
      data: [
        { productId: productCoord.id, url: '/campaign/coord-sets.jpg', alt: 'Contemporary Ethnic Co-ord Set', isThumbnail: true, displayOrder: 1 },
        { productId: productCoord.id, url: '/campaign/coord-sets.jpg', alt: 'Co-ord Set Detail', isThumbnail: false, displayOrder: 2 },
      ],
    });
  }

  const productKurti = await prisma.product.findFirst({
    where: { slug: 'designer-kurti-set' },
  });
  if (productKurti) {
    await prisma.productImage.deleteMany({ where: { productId: productKurti.id } });
    await prisma.productImage.createMany({
      data: [
        { productId: productKurti.id, url: '/campaign/kurti-collection.jpg', alt: 'Designer Kurti Set', isThumbnail: true, displayOrder: 1 },
        { productId: productKurti.id, url: '/campaign/daily-wear.jpg', alt: 'Pastel Kurti Set', isThumbnail: false, displayOrder: 2 },
      ],
    });
  }

  console.log('Database updated successfully with authentic campaign assets!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
