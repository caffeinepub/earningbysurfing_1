import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  ChevronRight,
  Cpu,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Category } from "../backend";
import { CURATED_PRODUCTS } from "../data/curatedProducts";
import {
  useAllProducts,
  useAutoPostCategories,
  useSubmitOrder,
} from "../hooks/useQueries";

const CATEGORY_LABELS: Record<Category, string> = {
  [Category.shoesAndClothes]: "Fashion",
  [Category.toys]: "Toys",
  [Category.technology]: "Tech",
  [Category.books]: "Books",
  [Category.tech]: "Tech",
  [Category.lifestyle]: "Lifestyle",
  [Category.wellness]: "Wellness",
};

function CategoryBadge({ category }: { category: Category }) {
  return (
    <Badge className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-saffron/10 text-saffron border-0 rounded-full hover:bg-saffron/10">
      {CATEGORY_LABELS[category]}
    </Badge>
  );
}

function QualityScoreBadge({ score }: { score: bigint }) {
  const num = Number(score);
  return (
    <div className="absolute top-3 right-3 flex items-center gap-1 bg-saffron text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-md">
      <Star className="h-3 w-3 fill-white" />
      {num}
    </div>
  );
}

function ProductCard({
  title,
  category,
  description,
  aiReview,
  qualityScore,
  index,
  onBuyNow,
}: {
  title: string;
  category: Category;
  description: string;
  aiReview?: string;
  qualityScore?: bigint;
  index: number;
  onBuyNow?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white rounded-lg shadow-card border border-border overflow-hidden group hover:shadow-lg transition-shadow"
      data-ocid={`products.item.${index + 1}`}
    >
      <div className="product-image-placeholder h-48 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <TrendingUp className="h-12 w-12 text-white/40" />
        </div>
        <div className="absolute top-3 left-3">
          <CategoryBadge category={category} />
        </div>
        {qualityScore !== undefined && (
          <QualityScoreBadge score={qualityScore} />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground normal-case font-medium leading-relaxed mb-3 line-clamp-2">
          {description}
        </p>
        {aiReview && (
          <div className="flex items-start gap-1.5 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-saffron flex-shrink-0 mt-0.5" />
            <p className="text-xs italic text-muted-foreground normal-case line-clamp-1">
              {aiReview}
            </p>
          </div>
        )}
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-saffron hover:bg-saffron-dark text-white text-xs uppercase tracking-widest font-bold"
            data-ocid={`products.button.${index + 1}`}
          >
            View Product
          </Button>
          {onBuyNow && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-saffron text-saffron hover:bg-saffron hover:text-white text-xs uppercase tracking-widest font-bold"
              onClick={onBuyNow}
              data-ocid={`products.secondary_button.${index + 1}`}
            >
              Buy Now
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}

const CATEGORY_DATA: Record<
  string,
  { description: string; supplierSearch: string }
> = {
  "AI Tech": {
    description:
      "AI-powered gadgets, wearables and productivity tools driving record affiliate conversions.",
    supplierSearch: "https://www.amazon.com/s?k=AI+tech+gadgets",
  },
  "Organic Wellness": {
    description:
      "Supplements, adaptogens, and clean-label health products with massive DTC growth.",
    supplierSearch: "https://www.clickbank.com/marketplace/?category=health",
  },
  "Eco-Decor": {
    description:
      "Sustainable home d\u00e9cor and eco-friendly furnishings surging as green living trends accelerate.",
    supplierSearch: "https://www.amazon.com/s?k=eco+friendly+home+decor",
  },
  "Smart Kitchen": {
    description:
      "Connected kitchen appliances and smart cooking tools with strong gifting season demand.",
    supplierSearch: "https://www.amazon.com/s?k=smart+kitchen+gadgets",
  },
  "Solar Power": {
    description:
      "Portable solar panels and home energy kits surging due to rising energy costs and eco policy.",
    supplierSearch: "https://www.amazon.com/s?k=solar+power+portable",
  },
  "Leather Goods": {
    description:
      "Premium leather bags, wallets, and accessories with high average order values.",
    supplierSearch: "https://www.amazon.com/s?k=leather+goods+premium",
  },
  "Pet Tech": {
    description:
      "Smart feeders, GPS trackers, and health monitors for pets &#8212; a multi-billion dollar affiliate category.",
    supplierSearch: "https://www.amazon.com/s?k=pet+tech+gadgets",
  },
  "Digital Tools": {
    description:
      "Software, SaaS subscriptions, and productivity apps with recurring commission potential.",
    supplierSearch:
      "https://www.clickbank.com/marketplace/?category=software_services",
  },
  "Yoga Kits": {
    description:
      "Premium yoga mats, blocks, straps, and starter bundles with strong wellness community demand.",
    supplierSearch: "https://www.amazon.com/s?k=yoga+kit+set",
  },
  Skincare: {
    description:
      "Clean beauty and dermatologist-backed skincare driving high repeat purchases and subscriptions.",
    supplierSearch: "https://www.clickbank.com/marketplace/?category=health",
  },
};

function GlobalBestSellers() {
  const { data: categories = [], isLoading } = useAutoPostCategories();

  if (isLoading || categories.length === 0) return null;

  return (
    <section className="py-20 bg-white" data-ocid="bestsellers.section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">
            Admin Curated
          </p>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wide text-saffron mb-2">
            Global Best Sellers
          </h2>
          <p className="text-sm text-muted-foreground normal-case mb-4">
            Handpicked trending categories &#8212; curated globally, available
            now
          </p>
          <div className="w-16 h-1 bg-saffron mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const info = CATEGORY_DATA[cat] ?? {
              description:
                "Globally trending category with strong affiliate demand.",
              supplierSearch: `https://www.amazon.com/s?k=${encodeURIComponent(cat)}`,
            };
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                data-ocid={`bestsellers.item.${idx + 1}`}
              >
                <Card className="relative border border-saffron/20 hover:border-saffron/60 transition-all hover:shadow-lg overflow-hidden h-full">
                  <div
                    className="absolute top-0 left-0 right-0 flex items-center justify-center py-2 text-white text-xs font-black uppercase tracking-[0.2em]"
                    style={{ backgroundColor: "#FF9933" }}
                  >
                    &#9733; Best Seller
                  </div>
                  <CardContent className="pt-14 pb-6">
                    <h3 className="text-lg font-black uppercase tracking-wide text-foreground mb-2">
                      {cat}
                    </h3>
                    <p className="text-xs text-muted-foreground normal-case leading-relaxed mb-5">
                      {info.description}
                    </p>
                    <Button
                      size="sm"
                      className="w-full font-black uppercase tracking-wider text-xs"
                      style={{ backgroundColor: "#FF9933", color: "#fff" }}
                      onClick={() => window.open(info.supplierSearch, "_blank")}
                      data-ocid={`bestsellers.primary_button.${idx + 1}`}
                    >
                      <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                      Shop Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { data: products, isLoading } = useAllProducts();
  const { mutateAsync: submitOrder } = useSubmitOrder();

  const handleBuyNow = async (productName: string) => {
    try {
      const assignedIndex = await submitOrder({
        productName,
        totalMembers: BigInt(4000),
      });
      toast.success(
        `Order assigned to Member #${Number(assignedIndex) + 1}. Commission tracking active!`,
        { duration: 4000 },
      );
    } catch {
      toast.error("Order could not be placed. Please try again.");
    }
  };

  const backendProducts = products?.slice(0, 12).map(([, p]) => p) ?? [];
  const displayProducts =
    backendProducts.length > 0 ? backendProducts : CURATED_PRODUCTS;

  return (
    <main>
      {/* ── Hero Section ── */}
      <section
        className="relative min-h-[85vh] flex items-center overflow-hidden"
        data-ocid="hero.section"
      >
        {/* Solid Khalish Saffron background */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "#FF9933", zIndex: 0 }}
        />

        {/* Hero text — left column */}
        <div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full"
          style={{ zIndex: 10 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl"
          >
            <p
              className="text-white/90 text-xs font-bold uppercase tracking-[0.3em] mb-4"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
            >
              Welcome to EarningBySurfing
            </p>
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-none mb-6"
              style={{
                textShadow:
                  "2px 3px 0 rgba(0,0,0,0.18), 0 1px 8px rgba(0,0,0,0.12)",
              }}
            >
              <span className="text-white">Discover</span>
              <br />
              <span className="text-white">Premium</span>
              <br />
              <span className="text-white">Products</span>
            </h1>
            <p
              className="text-white text-lg normal-case font-semibold leading-relaxed mb-6 max-w-lg"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.2)" }}
            >
              AI-curated high-demand affiliate products &#8212; Tech, Lifestyle
              &amp; Wellness &#8212; with verified quality scores and expert
              reviews.
            </p>
            <p
              className="text-white text-4xl sm:text-5xl font-black uppercase tracking-widest mb-10"
              style={{
                textShadow:
                  "3px 4px 0 rgba(0,0,0,0.2), 0 2px 12px rgba(0,0,0,0.15)",
              }}
            >
              One World One Future
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-[#FF9933] hover:bg-white/90 font-black uppercase tracking-widest text-sm px-8 shadow-lg"
                data-ocid="hero.primary_button"
              >
                SHOP NOW <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white bg-transparent hover:bg-white/15 font-black uppercase tracking-widest text-sm px-8"
                style={{ borderColor: "rgba(255,255,255,0.7)" }}
                data-ocid="hero.secondary_button"
              >
                EXPLORE TRENDING
              </Button>
            </div>
          </motion.div>
        </div>

        {/* White wave clip at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-white"
          style={{ clipPath: "ellipse(55% 100% at 50% 100%)", zIndex: 11 }}
        />
      </section>

      <GlobalBestSellers />

      {/* Trending Products */}
      <section className="py-20 bg-white" data-ocid="trending.section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">
              AI-Powered Discovery
            </p>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wide text-saffron mb-2">
              Trending Products
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Cpu className="h-4 w-4 text-saffron" />
              <span className="text-xs text-muted-foreground normal-case">
                Each product AI-scored and reviewed for quality
              </span>
            </div>
            <div className="w-16 h-1 bg-saffron mx-auto rounded-full" />
          </motion.div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            data-ocid="products.list"
          >
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                  <ProductSkeleton key={i} />
                ))
              : displayProducts.map((product, i) => (
                  <ProductCard
                    key={product.title}
                    title={product.title}
                    category={product.category}
                    description={product.description}
                    aiReview={product.aiReview}
                    qualityScore={product.qualityScore}
                    index={i}
                    onBuyNow={() => handleBuyNow(product.title)}
                  />
                ))}
          </div>

          <div className="text-center mt-10">
            <Button
              variant="outline"
              size="lg"
              className="border-saffron text-saffron hover:bg-saffron hover:text-white font-bold uppercase tracking-widest text-sm"
              data-ocid="trending.button"
            >
              VIEW ALL PRODUCTS <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Collections + Mission */}
      <section className="py-20 bg-muted/30" data-ocid="collections.section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-wide text-saffron mb-6">
                Featured Collections
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="collection-tile-1 rounded-lg h-48 flex items-end p-4 cursor-pointer overflow-hidden"
                >
                  <div>
                    <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">
                      Collection
                    </p>
                    <p className="text-white font-black uppercase text-lg">
                      Tech Essentials
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="collection-tile-2 rounded-lg h-48 flex items-end p-4 cursor-pointer overflow-hidden"
                >
                  <div>
                    <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">
                      Collection
                    </p>
                    <p className="text-white font-black uppercase text-lg">
                      Lifestyle Picks
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-2xl font-black uppercase tracking-wide text-saffron mb-6">
                Our Mission
              </h2>
              <p className="text-foreground text-base normal-case leading-relaxed mb-4 font-medium">
                At EarningBySurfing, we believe that great products should be
                accessible to everyone. Our AI hunts only the highest-demand
                items across Tech, Lifestyle, and Wellness categories.
              </p>
              <p className="text-muted-foreground text-sm normal-case leading-relaxed mb-6">
                Every product receives an AI-generated quality score and expert
                review &#8212; so you always know exactly what you&apos;re
                promoting.
              </p>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-5 w-5 fill-saffron text-saffron" />
                ))}
                <span className="text-sm font-bold text-foreground uppercase tracking-wide ml-1">
                  Trusted Platform
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-saffron" data-ocid="cta.section">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wide text-white mb-4">
              Start Earning Today
            </h2>
            <p className="text-white/90 text-lg normal-case font-medium mb-8">
              Join our platform and get access to AI-curated products, smart
              affiliate links, and WhatsApp marketing tools.
            </p>
            <Button
              size="lg"
              className="bg-white text-saffron hover:bg-white/90 font-black uppercase tracking-widest text-sm px-10"
              data-ocid="cta.primary_button"
            >
              GET STARTED FREE
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
