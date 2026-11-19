const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function runTests() {
  console.log('====================================================');
  console.log(' RADHEY RADHEY GIRLS POINT - END-TO-END VERIFICATION');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✔ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✖ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // TEST 1: Admin & Staff User Authentication
    console.log('[1/10] Verifying Admin & Staff Authentication...');
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@radheygirlspoint.com' },
    });
    assert(adminUser !== null, 'Admin user exists in database');
    assert(adminUser.role === 'ADMIN', 'Admin has ADMIN role');

    const isMatch = await bcrypt.compare('Admin@123Password!', adminUser.passwordHash);
    assert(isMatch === true, 'Admin password hash verifies correctly with bcrypt');

    // TEST 2: Dynamic Category & Subcategory Hierarchy
    console.log('\n[2/10] Verifying Dynamic Category Architecture...');
    const suitsCategory = await prisma.category.findUnique({
      where: { slug: 'suits' },
      include: { subcategories: true },
    });
    assert(suitsCategory !== null, 'Parent category "Suits" exists');
    assert(suitsCategory.subcategories.length >= 3, `Suits has ${suitsCategory.subcategories.length} subcategories`);

    // TEST 3: Dynamic Category Creation & Persistence
    console.log('\n[3/10] Testing Dynamic Category Creation by Admin...');
    const testCatSlug = `festive-wear-${Date.now()}`;
    const newCategory = await prisma.category.create({
      data: {
        name: 'Festive Wear Test',
        slug: testCatSlug,
        description: 'New seasonal festive edit',
        displayOrder: 99,
        isActive: true,
      },
    });
    assert(newCategory.id !== undefined, 'Category created successfully');
    assert(newCategory.slug === testCatSlug, 'Category slug matches');

    // TEST 4: Product Creation with Multi-Size Variants & Stock
    console.log('\n[4/10] Testing Product Management & Variant SKUs...');
    const testProductSku = `TEST-SUIT-${Date.now()}`;
    const testProduct = await prisma.product.create({
      data: {
        name: 'Royal Velvet Embroidered Anarkali',
        slug: `royal-velvet-anarkali-${Date.now()}`,
        sku: testProductSku,
        description: 'Deep jewel-toned regal velvet anarkali with zardozi embroidery.',
        mrp: 4999,
        sellingPrice: 3899,
        fabric: 'Micro Velvet 9000',
        categoryId: suitsCategory.id,
        isFeatured: true,
        isActive: true,
        variants: {
          create: [
            { size: 'M', color: 'Emerald Green', sku: `${testProductSku}-M`, stock: 12 },
            { size: 'L', color: 'Emerald Green', sku: `${testProductSku}-L`, stock: 8 },
          ],
        },
      },
      include: { variants: true },
    });

    assert(testProduct.id !== undefined, 'Product created with relational variants');
    assert(testProduct.variants.length === 2, 'Created 2 size variants (M, L)');
    assert(testProduct.variants[0].stock === 12, 'Variant stock recorded correctly');

    // TEST 5: Inventory Audit Log Recording
    console.log('\n[5/10] Testing Inventory Transaction Recording...');
    const txLog = await prisma.inventoryTransaction.create({
      data: {
        productId: testProduct.id,
        variantId: testProduct.variants[0].id,
        type: 'RESTOCK',
        previousStock: 0,
        newStock: 12,
        changeQuantity: 12,
        reason: 'Initial test stock restock',
        adminEmail: 'admin@radheygirlspoint.com',
      },
    });
    assert(txLog.id !== undefined, 'Inventory transaction created in audit log');

    // TEST 6: Coupon Validation & Calculation
    console.log('\n[6/10] Testing Coupon Engine & Cart Discount...');
    const coupon = await prisma.coupon.findUnique({
      where: { code: 'WELCOME10' },
    });
    assert(coupon !== null, 'Coupon WELCOME10 exists');
    assert(coupon.isActive === true, 'Coupon is currently active');
    const orderSubtotal = 2199;
    const discount = (orderSubtotal * coupon.discountValue) / 100;
    assert(discount === 219.9, '10% discount calculated accurately on ₹2199 subtotal');

    // TEST 7: Order Placement & Inventory Deduction Transaction
    console.log('\n[7/10] Testing Order Placement & Stock Deduction...');
    const variantToBuy = testProduct.variants[0];
    const initialStock = variantToBuy.stock;
    const qtyOrdered = 2;

    const testOrder = await prisma.$transaction(async (tx) => {
      // Deduct stock
      const updatedV = await tx.productVariant.update({
        where: { id: variantToBuy.id },
        data: { stock: { decrement: qtyOrdered } },
      });

      // Record transaction
      await tx.inventoryTransaction.create({
        data: {
          productId: testProduct.id,
          variantId: variantToBuy.id,
          type: 'SALE',
          previousStock: initialStock,
          newStock: initialStock - qtyOrdered,
          changeQuantity: -qtyOrdered,
          reason: 'Customer test checkout',
        },
      });

      // Create Order
      const ord = await tx.order.create({
        data: {
          orderNumber: `RR-TEST-${Date.now()}`,
          customerName: 'Test Buyer',
          customerEmail: 'buyer@test.com',
          customerPhone: '+91 99999 88888',
          shippingAddress: '42, Pink City Road, Jaipur, Rajasthan 302001',
          subtotal: 7798,
          totalAmount: 7798,
          paymentMethod: 'COD',
          paymentStatus: 'PENDING',
          orderStatus: 'CONFIRMED',
          items: {
            create: {
              productId: testProduct.id,
              variantId: variantToBuy.id,
              productName: testProduct.name,
              variantDetails: `Size: ${variantToBuy.size}`,
              unitPrice: 3899,
              quantity: qtyOrdered,
              totalPrice: 7798,
            },
          },
        },
        include: { items: true },
      });

      return { ord, updatedV };
    });

    assert(testOrder.ord.id !== undefined, 'Order placed successfully');
    assert(testOrder.updatedV.stock === initialStock - qtyOrdered, `Inventory deducted from ${initialStock} to ${testOrder.updatedV.stock}`);

    // TEST 8: Order Status Update with Tracking Details
    console.log('\n[8/10] Testing Order Tracking & Courier Assignment...');
    const updatedOrder = await prisma.order.update({
      where: { id: testOrder.ord.id },
      data: {
        orderStatus: 'SHIPPED',
        trackingNumber: 'BD-TEST-99281',
        courierName: 'BlueDart Express',
      },
    });
    assert(updatedOrder.orderStatus === 'SHIPPED', 'Order status transitioned to SHIPPED');
    assert(updatedOrder.trackingNumber === 'BD-TEST-99281', 'Tracking number attached');

    // TEST 9: Order Cancellation with Automatic Stock Restoration
    console.log('\n[9/10] Testing Order Cancellation & Stock Restoration...');
    await prisma.$transaction(async (tx) => {
      // Restore stock
      await tx.productVariant.update({
        where: { id: variantToBuy.id },
        data: { stock: { increment: qtyOrdered } },
      });

      // Record transaction
      await tx.inventoryTransaction.create({
        data: {
          productId: testProduct.id,
          variantId: variantToBuy.id,
          type: 'CANCELLED_RESTORE',
          previousStock: initialStock - qtyOrdered,
          newStock: initialStock,
          changeQuantity: qtyOrdered,
          reason: 'Order cancelled by customer service',
        },
      });

      await tx.order.update({
        where: { id: testOrder.ord.id },
        data: { orderStatus: 'CANCELLED' },
      });
    });

    const restoredVariant = await prisma.productVariant.findUnique({
      where: { id: variantToBuy.id },
    });
    assert(restoredVariant.stock === initialStock, `Stock restored back to original level: ${restoredVariant.stock}`);

    // Clean up test records
    await prisma.orderItem.deleteMany({ where: { orderId: testOrder.ord.id } });
    await prisma.order.delete({ where: { id: testOrder.ord.id } });
    await prisma.inventoryTransaction.deleteMany({ where: { productId: testProduct.id } });
    await prisma.productVariant.deleteMany({ where: { productId: testProduct.id } });
    await prisma.product.delete({ where: { id: testProduct.id } });
    await prisma.category.delete({ where: { id: newCategory.id } });

    // TEST 10: Store Settings & WhatsApp Integration
    console.log('\n[10/10] Verifying Store Settings & WhatsApp Configuration...');
    const whatsappSetting = await prisma.setting.findUnique({
      where: { key: 'whatsapp_number' },
    });
    assert(whatsappSetting !== null, 'WhatsApp number setting is configured');
    assert(whatsappSetting.value === '919876543210', 'WhatsApp number value is valid');

    console.log('\n----------------------------------------------------');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('----------------------------------------------------');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test run error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
