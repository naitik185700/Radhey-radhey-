const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Radhey Radhey Girls Point database...');

  // 1. Clean existing records if any
  await prisma.review.deleteMany();
  await prisma.couponUsage.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.inventoryTransaction.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.setting.deleteMany();

  // 2. Users (Admin, Staff, Customer)
  const passwordHashAdmin = await bcrypt.hash('Admin@123Password!', 10);
  const passwordHashStaff = await bcrypt.hash('Staff@123Password!', 10);
  const passwordHashCustomer = await bcrypt.hash('Customer@123!', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Radhey Admin',
      email: 'admin@radheygirlspoint.com',
      passwordHash: passwordHashAdmin,
      role: 'ADMIN',
      phone: '+91 98765 43210',
    },
  });

  const staff = await prisma.user.create({
    data: {
      name: 'Store Manager',
      email: 'staff@radheygirlspoint.com',
      passwordHash: passwordHashStaff,
      role: 'STAFF',
      phone: '+91 98765 43211',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Pooja Sharma',
      email: 'customer@example.com',
      passwordHash: passwordHashCustomer,
      role: 'CUSTOMER',
      phone: '+91 98111 22334',
      addresses: {
        create: {
          fullName: 'Pooja Sharma',
          phone: '+91 98111 22334',
          street: 'Flat 402, Royal Residency, MG Road',
          apartment: 'Tower B',
          city: 'Jaipur',
          state: 'Rajasthan',
          postalCode: '302001',
          country: 'India',
          isDefault: true,
        },
      },
    },
  });

  // 3. Settings
  const settingsData = [
    { key: 'site_name', value: 'Radhey Radhey Girls Point', group: 'general' },
    { key: 'tagline', value: 'Trendy • Ethnic • Daily Wear | Suits | Co-ords | Palazzo | Kurtis', group: 'general' },
    { key: 'contact_email', value: 'contact@radheygirlspoint.com', group: 'general' },
    { key: 'contact_phone', value: '+91 89507 29243', group: 'general' },
    { key: 'whatsapp_number', value: '918950729243', group: 'general' },
    { key: 'store_address', value: 'Near Sach Jewellers, Pul Teliyan, Hisar, Haryana', group: 'general' },
    { key: 'shipping_fee', value: '99', group: 'shipping' },
    { key: 'free_shipping_threshold', value: '999', group: 'shipping' },
    { key: 'return_window_days', value: '7', group: 'shipping' },
    { key: 'announcement_bar', value: 'Free Shipping on Orders Above ₹999 | Easy 7-Day Returns | Trendy • Ethnic • Daily Wear', group: 'general' },
    { key: 'instagram_handle', value: '@radheygirlspoint', group: 'social' },
    { key: 'facebook_handle', value: 'radheygirlspoint', group: 'social' },
  ];

  for (const s of settingsData) {
    await prisma.setting.create({ data: s });
  }

  // 4. Categories & Subcategories
  const catSuits = await prisma.category.create({
    data: {
      name: 'Suits',
      slug: 'suits',
      description: 'Handcrafted luxury suit sets in rich silks, georgettes, and cottons.',
      image: '/brand/product-black-suit.png',
      displayOrder: 1,
      isActive: true,
      subcategories: {
        create: [
          { name: 'Straight Suits', slug: 'straight-suits', description: 'Classic straight cut silhouettes', displayOrder: 1, isActive: true },
          { name: 'Anarkali Suits', slug: 'anarkali-suits', description: 'Flared regal anarkali sets', displayOrder: 2, isActive: true },
          { name: 'Punjabi Suits', slug: 'punjabi-suits', description: 'Traditional patiala and salwar sets', displayOrder: 3, isActive: true },
          { name: 'Party Wear Suits', slug: 'party-wear-suits', description: 'Heavily embellished festive suits', displayOrder: 4, isActive: true },
          { name: 'Daily Wear Suits', slug: 'daily-wear-suits', description: 'Breezy pure cotton daily suits', displayOrder: 5, isActive: true },
        ],
      },
    },
    include: { subcategories: true },
  });

  const catKurtiSets = await prisma.category.create({
    data: {
      name: 'Kurti Sets',
      slug: 'kurti-sets',
      description: 'Elegant kurti sets with matching palazzos, pants, and dupattas.',
      image: '/brand/product-pink-kurti.png',
      displayOrder: 2,
      isActive: true,
    },
  });

  const catCoords = await prisma.category.create({
    data: {
      name: 'Co-ord Sets',
      slug: 'co-ord-sets',
      description: 'Contemporary western & ethnic fusion two-piece matching sets.',
      image: '/brand/product-cream-coord.png',
      displayOrder: 3,
      isActive: true,
    },
  });

  const catDresses = await prisma.category.create({
    data: {
      name: 'Dresses',
      slug: 'dresses',
      description: 'Flowy ethnic maxi dresses, tiered midi dresses, and gowns.',
      image: '/brand/product-lavender-suit.png',
      displayOrder: 4,
      isActive: true,
    },
  });

  const catLehengas = await prisma.category.create({
    data: {
      name: 'Lehengas',
      slug: 'lehengas',
      description: 'Grand bridal and festive designer lehenga cholis.',
      image: '/brand/model-black-suit.png',
      displayOrder: 5,
      isActive: true,
    },
  });

  const catDupattas = await prisma.category.create({
    data: {
      name: 'Dupattas',
      slug: 'dupattas',
      description: 'Banarasi, Phulkari, Organza, and Chanderi statement dupattas.',
      image: '/brand/product-lavender-suit.png',
      displayOrder: 6,
      isActive: true,
    },
  });

  const catBottomWear = await prisma.category.create({
    data: {
      name: 'Bottom Wear',
      slug: 'bottom-wear',
      description: 'Palazzos, pants, salwars, and shararas.',
      image: '/brand/product-cream-coord.png',
      displayOrder: 7,
      isActive: true,
    },
  });

  const catSale = await prisma.category.create({
    data: {
      name: 'Sale',
      slug: 'sale',
      description: 'Special seasonal festive discounts and limited-time offers.',
      image: '/brand/product-black-suit.png',
      displayOrder: 8,
      isActive: true,
    },
  });

  // 5. Banners
  await prisma.banner.createMany({
    data: [
      {
        title: 'ETHNIC SUIT SETS',
        subtitle: 'Elegant Styles for Every Occasion',
        badge: 'New Collection',
        ctaText: 'Shop Now',
        ctaLink: '/category/suits',
        imageUrl: '/brand/hero-banner-source.png',
        displayOrder: 1,
        isActive: true,
      },
      {
        title: 'ROYAL ANARKALI & FESTIVE WEAR',
        subtitle: 'Intricate Zardozi & Resham Embroidery',
        badge: 'Festive Spotlight',
        ctaText: 'Explore Collection',
        ctaLink: '/category/suits?subcategory=anarkali-suits',
        imageUrl: '/brand/model-black-suit.png',
        displayOrder: 2,
        isActive: true,
      },
    ],
  });

  // 6. Products with Variants and Inventory
  const productsToCreate = [
    {
      name: 'Embroidered Suit Set',
      slug: 'embroidered-suit-set',
      sku: 'RR-SUIT-001',
      description: 'A regal pastel lavender pure Chanderi silk suit set featuring delicate thread embroidery, hand-finished gota patti borders, paired with matching pants and a pure organza dupatta.',
      shortDescription: 'Pastel lavender embroidered Chanderi silk suit with organza dupatta.',
      mrp: 2699,
      sellingPrice: 2199,
      fabric: 'Pure Chanderi Silk with Cotton Mulmul Lining',
      careInstructions: 'Dry Clean Only',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      categoryId: catSuits.id,
      subcategoryId: catSuits.subcategories[0]?.id,
      images: [
        { url: '/brand/product-lavender-suit.png', alt: 'Embroidered Lavender Suit Set Front', isThumbnail: true, displayOrder: 1 },
        { url: '/brand/product-lavender-suit.png', alt: 'Embroidered Lavender Suit Set Back', isThumbnail: false, displayOrder: 2 },
      ],
      variants: [
        { size: 'S', color: 'Lavender', colorHex: '#D8B4E2', sku: 'RR-SUIT-001-LAV-S', stock: 15 },
        { size: 'M', color: 'Lavender', colorHex: '#D8B4E2', sku: 'RR-SUIT-001-LAV-M', stock: 24 },
        { size: 'L', color: 'Lavender', colorHex: '#D8B4E2', sku: 'RR-SUIT-001-LAV-L', stock: 18 },
        { size: 'XL', color: 'Lavender', colorHex: '#D8B4E2', sku: 'RR-SUIT-001-LAV-XL', stock: 8 },
        { size: 'XXL', color: 'Lavender', colorHex: '#D8B4E2', sku: 'RR-SUIT-001-LAV-XXL', stock: 5 },
      ],
    },
    {
      name: 'Premium Suit Set',
      slug: 'premium-suit-set',
      sku: 'RR-SUIT-002',
      description: 'Signature royal noir black straight suit crafted from rich modal satin with exquisite golden zari neck detailing and intricate cutwork lace accents.',
      shortDescription: 'Black modal satin designer straight suit with gold zari work.',
      mrp: 3199,
      sellingPrice: 2499,
      fabric: 'Modal Satin Silk',
      careInstructions: 'Dry Clean Recommended',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      categoryId: catSuits.id,
      subcategoryId: catSuits.subcategories[1]?.id,
      images: [
        { url: '/brand/product-black-suit.png', alt: 'Premium Black Suit Set Front', isThumbnail: true, displayOrder: 1 },
        { url: '/brand/model-black-suit.png', alt: 'Premium Black Suit Set Model', isThumbnail: false, displayOrder: 2 },
      ],
      variants: [
        { size: 'S', color: 'Noir Black', colorHex: '#171717', sku: 'RR-SUIT-002-BLK-S', stock: 10 },
        { size: 'M', color: 'Noir Black', colorHex: '#171717', sku: 'RR-SUIT-002-BLK-M', stock: 30 },
        { size: 'L', color: 'Noir Black', colorHex: '#171717', sku: 'RR-SUIT-002-BLK-L', stock: 20 },
        { size: 'XL', color: 'Noir Black', colorHex: '#171717', sku: 'RR-SUIT-002-BLK-XL', stock: 12 },
      ],
    },
    {
      name: 'Designer Kurti Set',
      slug: 'designer-kurti-set',
      sku: 'RR-KURTI-001',
      description: 'Charming blush pink hand-block printed kurti with matching cigarette pants and sheer scalloped dupatta. Perfectly tailored for festive family gatherings.',
      shortDescription: 'Blush pink floral kurti set with matching pants and scalloped dupatta.',
      mrp: 2499,
      sellingPrice: 1899,
      fabric: 'Fine Mulmul Cotton',
      careInstructions: 'Gentle Hand Wash in Cold Water',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      categoryId: catKurtiSets.id,
      images: [
        { url: '/brand/product-pink-kurti.png', alt: 'Designer Kurti Set Front', isThumbnail: true, displayOrder: 1 },
      ],
      variants: [
        { size: 'S', color: 'Blush Pink', colorHex: '#F7C6D9', sku: 'RR-KURTI-001-PNK-S', stock: 14 },
        { size: 'M', color: 'Blush Pink', colorHex: '#F7C6D9', sku: 'RR-KURTI-001-PNK-M', stock: 22 },
        { size: 'L', color: 'Blush Pink', colorHex: '#F7C6D9', sku: 'RR-KURTI-001-PNK-L', stock: 16 },
        { size: 'XL', color: 'Blush Pink', colorHex: '#F7C6D9', sku: 'RR-KURTI-001-PNK-XL', stock: 4 },
      ],
    },
    {
      name: 'Co-ord Set',
      slug: 'co-ord-set',
      sku: 'RR-COORD-001',
      description: 'Contemporary chic printed co-ord set with a tailored collar shirt tunic and wide-leg palazzo trousers in breathable premium linen blend.',
      shortDescription: 'Ecru botanical printed two-piece tunic and palazzo co-ord set.',
      mrp: 2299,
      sellingPrice: 1799,
      fabric: 'Cotton Linen Blend',
      careInstructions: 'Machine Wash Delicate',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      categoryId: catCoords.id,
      images: [
        { url: '/brand/product-cream-coord.png', alt: 'Co-ord Set Front', isThumbnail: true, displayOrder: 1 },
      ],
      variants: [
        { size: 'S', color: 'Beige Cream', colorHex: '#F5EBE0', sku: 'RR-COORD-001-BGE-S', stock: 18 },
        { size: 'M', color: 'Beige Cream', colorHex: '#F5EBE0', sku: 'RR-COORD-001-BGE-M', stock: 25 },
        { size: 'L', color: 'Beige Cream', colorHex: '#F5EBE0', sku: 'RR-COORD-001-BGE-L', stock: 12 },
      ],
    },
    {
      name: 'Flared Anarkali Festive Gown',
      slug: 'flared-anarkali-festive-gown',
      sku: 'RR-DRESS-001',
      description: 'Full floor-length regal georgette anarkali gown featuring 24 kalis for maximum flare, finished with intricate sequin yoke and zardozi borders.',
      shortDescription: 'Wine red flared anarkali gown with embellished bodice.',
      mrp: 4499,
      sellingPrice: 3299,
      fabric: 'Pure Georgette with Shantoon Silk Lining',
      careInstructions: 'Dry Clean Only',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: true,
      categoryId: catDresses.id,
      images: [
        { url: '/brand/model-black-suit.png', alt: 'Flared Anarkali Gown', isThumbnail: true, displayOrder: 1 },
      ],
      variants: [
        { size: 'M', color: 'Wine Red', colorHex: '#6D071A', sku: 'RR-DRESS-001-WIN-M', stock: 8 },
        { size: 'L', color: 'Wine Red', colorHex: '#6D071A', sku: 'RR-DRESS-001-WIN-L', stock: 6 },
        { size: 'XL', color: 'Wine Red', colorHex: '#6D071A', sku: 'RR-DRESS-001-WIN-XL', stock: 3 },
      ],
    },
    {
      name: 'Heritage Banarasi Silk Dupatta',
      slug: 'heritage-banarasi-silk-dupatta',
      sku: 'RR-DUP-001',
      description: 'Timeless handwoven Banarasi pure katan silk dupatta with opulent floral kadwa weave and traditional zari pallu.',
      shortDescription: 'Emerald green Banarasi katan silk dupatta with golden zari.',
      mrp: 1999,
      sellingPrice: 1499,
      fabric: 'Pure Katan Silk',
      careInstructions: 'Dry Clean Only',
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: true,
      categoryId: catDupattas.id,
      images: [
        { url: '/brand/product-lavender-suit.png', alt: 'Heritage Banarasi Silk Dupatta', isThumbnail: true, displayOrder: 1 },
      ],
      variants: [
        { size: 'Free Size', color: 'Emerald Green', colorHex: '#046307', sku: 'RR-DUP-001-GRN-FS', stock: 25 },
      ],
    },
  ];

  for (const pData of productsToCreate) {
    const { images, variants, ...prodFields } = pData;
    const prod = await prisma.product.create({
      data: {
        ...prodFields,
        images: {
          create: images,
        },
        variants: {
          create: variants,
        },
      },
      include: { variants: true },
    });

    // Record initial inventory transactions for each variant
    for (const v of prod.variants) {
      await prisma.inventoryTransaction.create({
        data: {
          productId: prod.id,
          variantId: v.id,
          type: 'RESTOCK',
          previousStock: 0,
          newStock: v.stock,
          changeQuantity: v.stock,
          reason: 'Initial warehouse stock onboarding',
          adminEmail: admin.email,
        },
      });
    }
  }

  // 7. Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        description: 'Enjoy 10% off on your first order at Radhey Radhey Girls Point',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderAmount: 999,
        maxDiscount: 500,
        validUntil: new Date('2028-12-31'),
        usageLimit: 1000,
        usedCount: 14,
        isActive: true,
      },
      {
        code: 'FESTIVE500',
        description: 'Flat ₹500 off on festive collection purchases above ₹2999',
        discountType: 'FIXED',
        discountValue: 500,
        minOrderAmount: 2999,
        maxDiscount: 500,
        validUntil: new Date('2028-12-31'),
        usageLimit: 500,
        usedCount: 28,
        isActive: true,
      },
      {
        code: 'RADHEY20',
        description: 'Exclusive 20% privilege discount for VIP patrons',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        minOrderAmount: 1999,
        maxDiscount: 1000,
        validUntil: new Date('2028-12-31'),
        usageLimit: 200,
        usedCount: 5,
        isActive: true,
      },
    ],
  });

  // 8. Sample Real Orders for Dashboard and Customer tracking
  const sampleProduct = await prisma.product.findFirst({
    where: { slug: 'embroidered-suit-set' },
    include: { variants: true },
  });

  if (sampleProduct && sampleProduct.variants.length > 0) {
    const v = sampleProduct.variants[0];
    
    // Order 1: Delivered
    const order1 = await prisma.order.create({
      data: {
        orderNumber: 'RR-ORD-8821',
        userId: customer.id,
        customerName: 'Pooja Sharma',
        customerEmail: 'customer@example.com',
        customerPhone: '+91 98111 22334',
        shippingAddress: 'Flat 402, Royal Residency, MG Road, Jaipur, Rajasthan 302001',
        subtotal: 2199,
        discountAmount: 219.9,
        shippingFee: 0,
        totalAmount: 1979.1,
        paymentMethod: 'RAZORPAY',
        paymentStatus: 'PAID',
        orderStatus: 'DELIVERED',
        trackingNumber: 'DEL-992817456',
        courierName: 'BlueDart Express',
        couponCode: 'WELCOME10',
        items: {
          create: {
            productId: sampleProduct.id,
            variantId: v.id,
            productName: sampleProduct.name,
            variantDetails: `Size: ${v.size}, Color: ${v.color}`,
            unitPrice: 2199,
            quantity: 1,
            totalPrice: 2199,
          },
        },
        payments: {
          create: {
            razorpayOrderId: 'order_mock_001',
            razorpayPaymentId: 'pay_mock_9921',
            razorpaySignature: 'sig_mock_verified',
            amount: 1979.1,
            currency: 'INR',
            status: 'SUCCESS',
            method: 'CARD',
          },
        },
      },
    });

    // Order 2: Shipped / In Transit
    await prisma.order.create({
      data: {
        orderNumber: 'RR-ORD-8822',
        userId: customer.id,
        customerName: 'Ananya Verma',
        customerEmail: 'ananya.verma@gmail.com',
        customerPhone: '+91 98222 33445',
        shippingAddress: 'Villa 12, Palm Meadows, Whitefield, Bengaluru, Karnataka 560066',
        subtotal: 2499,
        discountAmount: 0,
        shippingFee: 0,
        totalAmount: 2499,
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
        orderStatus: 'SHIPPED',
        trackingNumber: 'DTDC-88127391',
        courierName: 'DTDC Courier',
        items: {
          create: {
            productId: sampleProduct.id,
            variantId: v.id,
            productName: 'Premium Suit Set',
            variantDetails: 'Size: M, Color: Noir Black',
            unitPrice: 2499,
            quantity: 1,
            totalPrice: 2499,
          },
        },
      },
    });

    // Order 3: Processing
    await prisma.order.create({
      data: {
        orderNumber: 'RR-ORD-8823',
        customerName: 'Meera Rajput',
        customerEmail: 'meera.rajput@outlook.com',
        customerPhone: '+91 97333 44556',
        shippingAddress: '45, Civil Lines, Near Circuit House, Jodhpur, Rajasthan 342001',
        subtotal: 3798,
        discountAmount: 500,
        shippingFee: 0,
        totalAmount: 3298,
        paymentMethod: 'RAZORPAY',
        paymentStatus: 'PAID',
        orderStatus: 'PROCESSING',
        couponCode: 'FESTIVE500',
        items: {
          create: {
            productId: sampleProduct.id,
            variantId: v.id,
            productName: sampleProduct.name,
            variantDetails: `Size: ${v.size}, Color: ${v.color}`,
            unitPrice: 1899,
            quantity: 2,
            totalPrice: 3798,
          },
        },
      },
    });
  }

  // 9. Customer reviews
  if (sampleProduct) {
    await prisma.review.create({
      data: {
        productId: sampleProduct.id,
        userId: customer.id,
        authorName: 'Pooja Sharma',
        rating: 5,
        title: 'Breathtaking quality and fabric!',
        comment: 'The embroidery is so delicate and pure. Looks even more luxurious in real life than in photos. The fitting was spot on and packaging was royal.',
        isApproved: true,
      },
    });
  }

  console.log('Seeding completed successfully!');
  console.log('Admin credentials: admin@radheygirlspoint.com / Admin@123Password!');
  console.log('Staff credentials: staff@radheygirlspoint.com / Staff@123Password!');
  console.log('Customer credentials: customer@example.com / Customer@123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
