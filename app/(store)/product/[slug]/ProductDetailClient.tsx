'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  Check,
  Star,
  MessageCircle,
  Share2,
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import ProductCard from '@/components/storefront/ProductCard';

interface ProductDetailClientProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();

  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0]?.url || '/brand/product-black-suit.png'
  );
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const discount = calculateDiscount(product.mrp, product.sellingPrice);
  const wishlisted = isWishlisted(product.id);
  const currentStock = selectedVariant ? selectedVariant.stock : 10;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      slug: product.slug,
      price: selectedVariant?.priceOverride || product.sellingPrice,
      mrp: product.mrp,
      image: selectedImage,
      size: selectedVariant?.size || 'Free Size',
      color: selectedVariant?.color || 'Standard',
      quantity,
      maxStock: currentStock,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeStatus('Available! Express Delivery in 3-4 days (Free on orders ₹999+)');
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code');
    }
  };

  const whatsappInquiryUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hello Radhey Radhey Girls Point! I would like to inquire about "${product.name}" (SKU: ${product.sku}). Is it available in ${selectedVariant?.size || 'my size'}?`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-neutral-500 mb-6 font-medium">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        {product.category && (
          <>
            <Link href={`/category/${product.category.slug}`} className="hover:text-black">
              {product.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
          </>
        )}
        <span className="text-neutral-900 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Gallery (Thumbnails + Main Zoom Image) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnail list */}
          {product.images?.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[560px] pb-2 md:pb-0 no-scrollbar">
              {product.images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative w-16 sm:w-20 aspect-[3/4] flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === img.url
                      ? 'border-black ring-1 ring-black'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <Image src={img.url} alt={img.alt || ''} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image */}
          <div className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 shadow-premium border border-neutral-200">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              className="object-cover object-top hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 600px"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-black text-white text-xs font-bold rounded shadow-md">
                -{discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Details and Purchase Options */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            {product.category && (
              <p className="text-xs uppercase tracking-widest font-semibold text-neutral-400">
                {product.category.name}
              </p>
            )}

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mt-1 leading-snug">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
              <span>SKU: <strong className="text-neutral-700">{selectedVariant?.sku || product.sku}</strong></span>
              <span>&bull;</span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-neutral-800">4.9</span>
                <span className="text-neutral-400">({product.reviews?.length || 18} reviews)</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 my-5 pb-5 border-b border-neutral-100">
              <span className="font-serif text-3xl font-bold text-neutral-900">
                {formatPrice(selectedVariant?.priceOverride || product.sellingPrice)}
              </span>
              {product.mrp > product.sellingPrice && (
                <span className="text-base text-neutral-400 line-through">
                  MRP {formatPrice(product.mrp)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Fabric Highlight */}
            {product.fabric && (
              <div className="mb-5 p-3.5 bg-neutral-50 rounded-lg border border-neutral-200/60 text-xs">
                <span className="font-semibold text-neutral-900">Artisan Fabric:</span>{' '}
                <span className="text-neutral-700">{product.fabric}</span>
              </div>
            )}

            {/* Size Selector with Size Chart link */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Select Size
                  </span>
                  <button
                    onClick={() => setIsSizeChartOpen(true)}
                    className="text-xs text-neutral-600 hover:text-black underline flex items-center gap-1"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v: any) => {
                    const isSelected = selectedVariant?.id === v.id;
                    const outOfStock = v.stock <= 0;
                    return (
                      <button
                        key={v.id}
                        disabled={outOfStock}
                        onClick={() => {
                          setSelectedVariant(v);
                          setQuantity(1);
                        }}
                        className={`min-w-[50px] h-11 px-4 text-xs font-semibold rounded-md border transition-all ${
                          isSelected
                            ? 'bg-black text-white border-black shadow-subtle'
                            : outOfStock
                            ? 'bg-neutral-100 text-neutral-300 border-neutral-200 cursor-not-allowed line-through'
                            : 'bg-white text-neutral-800 border-neutral-300 hover:border-black'
                        }`}
                      >
                        {v.size}
                      </button>
                    );
                  })}
                </div>

                {/* Stock Indicator */}
                <div className="mt-3">
                  {isOutOfStock ? (
                    <span className="text-xs font-semibold text-red-600">
                      Currently Out of Stock in this size
                    </span>
                  ) : currentStock <= 5 ? (
                    <span className="text-xs font-semibold text-amber-600 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Only {currentStock} left in stock - order soon!
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      In Stock & Ready to Dispatch
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6 flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Quantity:
              </span>
              <div className="flex items-center border border-neutral-300 rounded-md bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 text-xs font-semibold text-neutral-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-4 px-6 rounded-md text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    isOutOfStock
                      ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      : isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black hover:bg-neutral-800 text-white shadow-premium'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-4 rounded-md border transition-colors ${
                    wishlisted
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-neutral-300 hover:border-black text-neutral-700'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-600 text-red-600' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-3.5 px-6 rounded-md text-xs font-bold uppercase tracking-widest border-2 border-black text-black hover:bg-black hover:text-white transition-all disabled:opacity-50"
              >
                Instant Buy Now
              </button>

              {/* Direct WhatsApp Ordering */}
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 rounded-md text-xs font-semibold text-neutral-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Order or Inquire on WhatsApp</span>
              </a>
            </div>

            {/* Pincode & Delivery Checker */}
            <div className="mt-8 pt-6 border-t border-neutral-200">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 block mb-2">
                Estimate Delivery Time
              </span>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 border border-neutral-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-black"
                >
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <p className="text-[11px] font-medium text-emerald-700 mt-2">{pincodeStatus}</p>
              )}
            </div>

            {/* Product Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-neutral-200 text-center">
              <div className="p-3 bg-neutral-50 rounded-lg">
                <Truck className="w-5 h-5 mx-auto text-neutral-700 mb-1" />
                <p className="text-[11px] font-semibold text-neutral-800">Free Shipping</p>
                <p className="text-[10px] text-neutral-500">Above ₹999</p>
              </div>
              <div className="p-3 bg-neutral-50 rounded-lg">
                <RotateCcw className="w-5 h-5 mx-auto text-neutral-700 mb-1" />
                <p className="text-[11px] font-semibold text-neutral-800">7-Day Returns</p>
                <p className="text-[10px] text-neutral-500">Doorstep pickup</p>
              </div>
              <div className="p-3 bg-neutral-50 rounded-lg">
                <ShieldCheck className="w-5 h-5 mx-auto text-neutral-700 mb-1" />
                <p className="text-[11px] font-semibold text-neutral-800">100% Authentic</p>
                <p className="text-[10px] text-neutral-500">Quality verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description & Specifications Tabs */}
      <div className="mt-16 pt-10 border-t border-neutral-200">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 mb-6">
          Product Details & Craftsmanship
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900 text-sm">Description</h3>
            <p className="font-light">{product.description}</p>

            {product.careInstructions && (
              <div className="pt-2">
                <h4 className="font-semibold text-neutral-900 mb-1">Wash & Care Instructions</h4>
                <p className="text-neutral-600">{product.careInstructions}</p>
              </div>
            )}
          </div>

          <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 space-y-3">
            <h3 className="font-semibold text-neutral-900 text-sm mb-2">Specifications</h3>
            <div className="flex justify-between py-1.5 border-b border-neutral-200">
              <span className="text-neutral-500">Fabric Type</span>
              <span className="font-medium text-neutral-900">{product.fabric || 'Pure Artisan Silk / Cotton'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-200">
              <span className="text-neutral-500">Design / Pattern</span>
              <span className="font-medium text-neutral-900">Embroidered Gota Patti / Threadwork</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-200">
              <span className="text-neutral-500">Occasion</span>
              <span className="font-medium text-neutral-900">Festive, Wedding Guest, Celebration</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-500">Origin</span>
              <span className="font-medium text-neutral-900">Jaipur, Rajasthan, India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-10 border-t border-neutral-200">
          <div className="text-center mb-8">
            <span className="font-serif italic text-xs tracking-widest text-neutral-500 uppercase">
              Complete The Look
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mt-1 uppercase">
              You May Also Love
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Size Chart Modal */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSizeChartOpen(false)}
          />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 z-10">
              <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                <h3 className="font-serif text-lg font-bold">Standard Size Chart (Inches)</h3>
                <button onClick={() => setIsSizeChartOpen(false)}>
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              <div className="mt-4 overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 border-b border-neutral-300">
                      <th className="p-2 font-semibold">Size</th>
                      <th className="p-2 font-semibold">Bust</th>
                      <th className="p-2 font-semibold">Waist</th>
                      <th className="p-2 font-semibold">Hip</th>
                      <th className="p-2 font-semibold">Kurta Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    <tr>
                      <td className="p-2 font-bold">S</td>
                      <td className="p-2">36&quot;</td>
                      <td className="p-2">32&quot;</td>
                      <td className="p-2">38&quot;</td>
                      <td className="p-2">44&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold">M</td>
                      <td className="p-2">38&quot;</td>
                      <td className="p-2">34&quot;</td>
                      <td className="p-2">40&quot;</td>
                      <td className="p-2">44&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold">L</td>
                      <td className="p-2">40&quot;</td>
                      <td className="p-2">36&quot;</td>
                      <td className="p-2">42&quot;</td>
                      <td className="p-2">45&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold">XL</td>
                      <td className="p-2">42&quot;</td>
                      <td className="p-2">38&quot;</td>
                      <td className="p-2">44&quot;</td>
                      <td className="p-2">45&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold">XXL</td>
                      <td className="p-2">44&quot;</td>
                      <td className="p-2">40&quot;</td>
                      <td className="p-2">46&quot;</td>
                      <td className="p-2">45&quot;</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-neutral-500 mt-4">
                * Note: Measurements refer to garment dimensions. For comfort, select a garment size 2 inches larger than your body measurements.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
